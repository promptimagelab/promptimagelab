import httpx
import json

class AntigravityClient:
    def __init__(self, api_key="sk-mock-key"):
        # We point directly to our local edge proxy instead of api.openai.com
        self.base_url = "http://127.0.0.1:8080/v1"
        self.api_key = api_key
        
    def chat_completions_create(self, model: str, messages: list, stream: bool = False):
        print(f"[*] Sending request through Antigravity Edge Proxy (Model: {model}, Stream: {stream})")
        
        payload = {
            "model": model,
            "messages": messages,
            "stream": stream
        }
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        with httpx.Client() as client:
            if stream:
                with client.stream("POST", f"{self.base_url}/chat/completions", json=payload, headers=headers, timeout=10.0) as response:
                    print(f"Response Status: {response.status_code}")
                    for chunk in response.iter_bytes():
                        print(chunk.decode('utf-8'), end='', flush=True)
                    print()
                return {"status": "stream_complete"}
            else:
                response = client.post(
                    f"{self.base_url}/chat/completions",
                    json=payload,
                    headers=headers,
                    timeout=10.0
                )
                if response.status_code == 200:
                    return response.json()
                else:
                    raise Exception(f"Proxy Error: {response.status_code} - {response.text}")

if __name__ == "__main__":
    client = AntigravityClient()
    
    # Mocking a prompt with sensitive data to test the Zero-Trust Redaction
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Please analyze this customer record. Their SSN is 123-45-6789 and their card is 4111-2222-3333-4444."}
    ]
    
    try:
        response = client.chat_completions_create(model="gpt-4", messages=messages, stream=True)
        print("\n[+] Success! Received response from proxy.")
        print("\nCheck the rust proxy logs to see the telemetry and PII redaction action!")
    except Exception as e:
        print(f"\n[-] Failed: {e}")
