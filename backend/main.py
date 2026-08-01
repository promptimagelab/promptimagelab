from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import time
import httpx
import jwt
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import SessionLocal, engine
from app import models

app = FastAPI(
    title="Antigravity Enterprise Control Plane API",
    description="The core infrastructure layer for AI evaluation and zero-trust proxy telemetry.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"], # Locked down for Phase 3
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "antigravity_secret_key"
ALGORITHM = "HS256"

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Auth dependency
async def verify_jwt(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    token = auth_header.split(" ")[1]
    
    # For Phase 3, we accept the raw secret key for internal service-to-service auth (Rust proxy -> FastAPI)
    # OR a valid JWT for client-to-service auth (Next.js -> FastAPI)
    if token != SECRET_KEY:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        except jwt.PyJWTError:
            raise HTTPException(status_code=401, detail="Invalid token")

class TelemetryIngestRequest(BaseModel):
    latency_ms: int
    redacted: bool
    stream: bool

@app.post("/v1/telemetry/ingest", dependencies=[Depends(verify_jwt)])
async def ingest_telemetry(req: TelemetryIngestRequest, db: Session = Depends(get_db)):
    log = models.TelemetryLog(
        latency_ms=req.latency_ms,
        redacted=1 if req.redacted else 0,
        stream=1 if req.stream else 0
    )
    db.add(log)
    db.commit()
    return {"status": "success"}

@app.get("/v1/telemetry/summary", dependencies=[Depends(verify_jwt)])
async def telemetry_summary(db: Session = Depends(get_db)):
    total_reqs = db.query(func.count(models.TelemetryLog.id)).scalar() or 0
    avg_latency = db.query(func.avg(models.TelemetryLog.latency_ms)).scalar() or 0
    total_redactions = db.query(func.sum(models.TelemetryLog.redacted)).scalar() or 0
    
    return {
        "total_requests": total_reqs,
        "avg_latency_ms": round(avg_latency, 2),
        "total_redactions": total_redactions,
        "active_proxies": 1 # Hardcoded for MVP
    }

class EvaluationRequest(BaseModel):
    prompt: str
    models: List[str]
    api_keys: Optional[Dict[str, str]] = None

class ModelResult(BaseModel):
    model: str
    content: str
    latency_ms: int
    ttft_ms: int
    cost_estimate: float

class EvaluationResponse(BaseModel):
    results: List[ModelResult]
    total_latency_ms: int

async def real_model_inference(model: str, prompt: str) -> ModelResult:
    start_time = time.time()
    
    async with httpx.AsyncClient() as client:
        try:
            # Route to our local Rust edge proxy
            res = await client.post(
                "http://127.0.0.1:8080/v1/chat/completions",
                json={
                    "model": model,
                    "messages": [{"role": "user", "content": prompt}],
                    "stream": False
                },
                headers={"Authorization": "Bearer sk-mock-key"},
                timeout=15.0
            )
            
            latency_ms = int((time.time() - start_time) * 1000)
            
            if res.status_code == 200:
                data = res.json()
                content = data.get("choices", [{}])[0].get("message", {}).get("content", str(data))
            else:
                content = f"Proxy Error {res.status_code}: {res.text}"

            return ModelResult(
                model=model,
                content=content,
                latency_ms=latency_ms,
                ttft_ms=int(latency_ms * 0.3),
                cost_estimate=0.001
            )
        except Exception as e:
            return ModelResult(
                model=model, 
                content=str(e), 
                latency_ms=int((time.time() - start_time) * 1000), 
                ttft_ms=0, 
                cost_estimate=0.0
            )

@app.post("/v1/evaluate", response_model=EvaluationResponse)
async def evaluate_prompt(req: EvaluationRequest):
    if not req.models:
        raise HTTPException(status_code=400, detail="At least one model must be specified.")
    
    start_time = time.time()
    
    # Actually run concurrently against the Rust proxy
    import asyncio
    tasks = [real_model_inference(model, req.prompt) for model in req.models]
    results = await asyncio.gather(*tasks)
    
    total_latency_ms = int((time.time() - start_time) * 1000)
    
    return EvaluationResponse(
        results=results,
        total_latency_ms=total_latency_ms
    )

@app.get("/health")
def health_check():
    return {"status": "Antigravity API Active", "version": "2.0.0"}
