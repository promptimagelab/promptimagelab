use axum::{
    extract::{Request, State},
    http::{StatusCode, HeaderMap},
    response::IntoResponse,
    routing::{post, get},
    Router, Json,
};
use reqwest::Client;
use serde_json::{Value, json};
use regex::Regex;
use std::sync::Arc;
use tokio::time::Instant;
use tracing::{info, error, Level};

#[derive(Clone)]
enum PolicyAction {
    Redact,
    Block,
}

#[derive(Clone)]
struct Policy {
    id: String,
    name: String,
    regex: Regex,
    action: PolicyAction,
    replacement: Option<String>,
}

struct AppState {
    client: Client,
    policies: Vec<Policy>,
    redis_client: Option<redis::Client>,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_max_level(Level::INFO)
        .init();

    info!("Initializing Antigravity Zero-Trust Edge Proxy...");

    // Initialize Redis (optional for local dev without docker)
    let redis_url = std::env::var("REDIS_URL").unwrap_or_else(|_| "redis://127.0.0.1:6379/".to_string());
    let redis_client = match redis::Client::open(redis_url.clone()) {
        Ok(client) => {
            info!("Connected to Redis Rate Limiter at {}", redis_url);
            Some(client)
        },
        Err(e) => {
            error!("Failed to connect to Redis at {}: {}", redis_url, e);
            None
        }
    };

    let policies = vec![
        Policy {
            id: "pol_ssn".to_string(),
            name: "SSN Redaction".to_string(),
            regex: Regex::new(r"\b\d{3}-\d{2}-\d{4}\b").unwrap(),
            action: PolicyAction::Redact,
            replacement: Some("[REDACTED_SSN]".to_string()),
        },
        Policy {
            id: "pol_cc".to_string(),
            name: "Credit Card Redaction".to_string(),
            regex: Regex::new(r"\b(?:\d{4}[ -]?){3}\d{4}\b").unwrap(),
            action: PolicyAction::Redact,
            replacement: Some("[REDACTED_CC]".to_string()),
        },
        Policy {
            id: "pol_fin_adv".to_string(),
            name: "Block Financial Advice".to_string(),
            regex: Regex::new(r"(?i)\b(buy|sell|invest|stock|crypto)\b").unwrap(),
            action: PolicyAction::Block,
            replacement: None,
        }
    ];

    let state = Arc::new(AppState {
        client: Client::new(),
        policies,
        redis_client,
    });

    let cors = tower_http::cors::CorsLayer::new()
        .allow_origin(tower_http::cors::Any)
        .allow_methods(tower_http::cors::Any)
        .allow_headers(tower_http::cors::Any);

    let app = Router::new()
        .route("/v1/chat/completions", post(proxy_chat_completions))
        .route("/v1/policies", get(list_policies))
        .layer(cors)
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    info!("Proxy listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}

async fn list_policies(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    let mut response = Vec::new();
    for p in &state.policies {
        let action_str = match p.action {
            PolicyAction::Redact => "Redact",
            PolicyAction::Block => "Block",
        };
        response.push(json!({
            "id": p.id,
            "name": p.name,
            "action": action_str,
        }));
    }
    Json(response)
}

async fn proxy_chat_completions(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    Json(mut payload): Json<Value>,
) -> impl IntoResponse {
    let start_time = Instant::now();

    // 0. Redis Global Rate Limiting
    if let Some(ref redis_client) = state.redis_client {
        let ip = "global"; // In production, extract from X-Forwarded-For
        let key = format!("rate_limit:{}", ip);
        if let Ok(mut con) = redis_client.get_async_connection().await {
            let count: Option<i32> = redis::cmd("INCR").arg(&key).query_async(&mut con).await.ok();
            let count = count.unwrap_or(1);
            if count == 1 {
                let _: () = redis::cmd("EXPIRE").arg(&key).arg(60).query_async(&mut con).await.unwrap_or(());
            }
            if count > 100 { // Max 100 requests per minute
                error!("Rate limit exceeded for IP: {}", ip);
                return (
                    StatusCode::TOO_MANY_REQUESTS,
                    Json(json!({"error": "Rate limit exceeded. Please try again later."}))
                ).into_response();
            }
        }
    }

    // 1. Semantic Redaction & Blocking (Zero-Trust Policy Engine)
    let mut redacted = false;
    let mut blocked = false;
    let mut block_reason = String::new();

    if let Some(messages) = payload.get_mut("messages").and_then(|m| m.as_array_mut()) {
        for msg in messages {
            if let Some(content) = msg.get_mut("content").and_then(|c| c.as_str()) {
                let mut new_content = content.to_string();
                
                for policy in &state.policies {
                    if policy.regex.is_match(&new_content) {
                        match policy.action {
                            PolicyAction::Block => {
                                blocked = true;
                                block_reason = policy.name.clone();
                                break;
                            }
                            PolicyAction::Redact => {
                                let repl = policy.replacement.as_deref().unwrap_or("[REDACTED]");
                                new_content = policy.regex.replace_all(&new_content, repl).to_string();
                                redacted = true;
                            }
                        }
                    }
                }

                if blocked {
                    break;
                }

                if redacted {
                    *msg.get_mut("content").unwrap() = json!(new_content);
                }
            }
        }
    }

    if blocked {
        info!("Request blocked by policy: {}", block_reason);
        // Telemetry Generation (Async POST to FastAPI) for blocked request
            let backend_client = state.client.clone();
            let is_stream = payload.get("stream").and_then(|v| v.as_bool()).unwrap_or(false);
            
            tokio::spawn(async move {
                let payload = json!({
                    "latency_ms": 0,
                    "redacted": false,
                    "stream": is_stream
                });
                
                let control_plane = std::env::var("CONTROL_PLANE_URL")
                    .unwrap_or_else(|_| "http://127.0.0.1:8000".to_string());
                let url = format!("{}/v1/telemetry/ingest", control_plane);
                
                let _ = backend_client.post(&url)
                    .header("Authorization", "Bearer antigravity_secret_key")
                    .json(&payload)
                    .send()
                    .await;
            });
        
        return (
            StatusCode::FORBIDDEN, 
            Json(json!({"error": format!("Blocked by policy: {}", block_reason)}))
        ).into_response();
    }

    if redacted {
        info!("Payload contained sensitive data. PII redacted locally.");
    }

    // 2. Dynamic Universal Routing
    let model = payload.get("model").and_then(|v| v.as_str()).unwrap_or("gpt-3.5-turbo");
    
    let upstream_url = if model.starts_with("gpt-") || model.starts_with("o1-") {
        "https://api.openai.com/v1/chat/completions"
    } else {
        // Ollama Local / Enterprise Cloud
        "http://127.0.0.1:11434/v1/chat/completions"
    };
    
    info!("Routing request for model '{}' to {}", model, upstream_url);

    let mut upstream_req = state.client.post(upstream_url).json(&payload);

    // Pass through Authorization header
    let auth_header = headers.get("authorization").cloned();
    if let Some(ref auth) = auth_header {
        upstream_req = upstream_req.header("authorization", auth.clone());
    }
    
    // Check if client requested streaming
    let is_stream = payload.get("stream").and_then(|v| v.as_bool()).unwrap_or(false);

    // Try primary upstream
    let response_result = upstream_req.send().await;

    // 2.5 Multi-Cloud Automatic Fallback
    let response_result = match response_result {
        Ok(res) if res.status().is_server_error() => {
            error!("Primary upstream returned server error ({}). Triggering Fallback to Local Ollama...", res.status());
            let fallback_url = "http://127.0.0.1:11434/v1/chat/completions";
            let mut fallback_req = state.client.post(fallback_url).json(&payload);
            if let Some(ref auth) = auth_header {
                fallback_req = fallback_req.header("authorization", auth.clone());
            }
            fallback_req.send().await
        },
        Err(e) => {
            error!("Primary upstream failed completely ({}). Triggering Fallback to Local Ollama...", e);
            let fallback_url = "http://127.0.0.1:11434/v1/chat/completions";
            let mut fallback_req = state.client.post(fallback_url).json(&payload);
            if let Some(ref auth) = auth_header {
                fallback_req = fallback_req.header("authorization", auth.clone());
            }
            fallback_req.send().await
        },
        Ok(res) => Ok(res), // Success!
    };

    match response_result {
        Ok(res) => {
            let latency = start_time.elapsed().as_millis();
            
            // 3. Telemetry Generation (Async POST to FastAPI)
            info!(
                target: "telemetry",
                latency_ms = latency,
                redacted = redacted,
                stream = is_stream,
                "Request routed upstream successfully"
            );

            let backend_client = state.client.clone();
            let latency_u64 = latency as u64;
            
            tokio::spawn(async move {
                let payload = json!({
                    "latency_ms": latency_u64,
                    "redacted": redacted,
                    "stream": is_stream
                });
                
                let control_plane = std::env::var("CONTROL_PLANE_URL")
                    .unwrap_or_else(|_| "http://127.0.0.1:8000".to_string());
                let url = format!("{}/v1/telemetry/ingest", control_plane);
                
                let _ = backend_client.post(&url)
                    .header("Authorization", "Bearer antigravity_secret_key")
                    .json(&payload)
                    .send()
                    .await;
            });

            let status = res.status();
            let mut builder = axum::response::Response::builder().status(status);
            
            // Forward headers (like content-type for SSE)
            for (name, value) in res.headers() {
                builder = builder.header(name, value);
            }

            use futures_util::StreamExt;
            use axum::body::Body;
            
            // Convert reqwest stream to axum Body stream
            let stream = res.bytes_stream().map(|result| {
                result.map_err(|e| std::io::Error::new(std::io::ErrorKind::Other, e.to_string()))
            });
            
            let body = Body::from_stream(stream);
            builder.body(body).unwrap().into_response()
        },
        Err(e) => {
            let latency = start_time.elapsed().as_millis();
            error!(
                target: "telemetry",
                latency_ms = latency,
                error = %e,
                "Upstream and Fallback request completely failed"
            );
            (StatusCode::INTERNAL_SERVER_ERROR, "Upstream Error").into_response()
        }
    }
}
