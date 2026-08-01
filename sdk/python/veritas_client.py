import os
import json
import requests
from typing import List, Dict, Any, Optional

class VeritasError(Exception):
    pass

class VeritasPolicyViolationError(VeritasError):
    pass

class VeritasClient:
    """
    Veritas Protocol Edge Proxy Client.
    
    A drop-in wrapper for standard LLM SDKs that intercepts and routes 
    traffic through the local Veritas eBPF proxy for semantic governance.
    """
    
    def __init__(self, api_key: Optional[str] = None, proxy_url: str = "http://localhost:8000"):
        self.api_key = api_key or os.environ.get("VERITAS_API_KEY")
        self.proxy_url = proxy_url.rstrip("/")
        
        if not self.api_key:
            raise ValueError("VERITAS_API_KEY must be provided or set in environment variables.")

    class ChatCompletions:
        def __init__(self, client):
            self.client = client

        def create(self, model: str, messages: List[Dict[str, str]], **kwargs) -> Dict[str, Any]:
            """
            Intercepts the chat completion request and routes it through Veritas.
            """
            headers = {
                "Authorization": f"Bearer {self.client.api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": model,
                "messages": messages,
                **kwargs
            }
            
            # Route traffic through the Veritas Proxy Enclave
            endpoint = f"{self.client.proxy_url}/v1/proxy/chat/completions"
            
            try:
                response = requests.post(endpoint, json=payload, headers=headers)
                response.raise_for_status()
                data = response.json()
                
                # Check for Veritas Policy Violations
                if data.get("error") == "VERITAS_POLICY_VIOLATION":
                    raise VeritasPolicyViolationError(
                        f"Request blocked by Veritas AST Policy: {data.get('message')} "
                        f"(TX Hash: {data.get('tx_hash')})"
                    )
                    
                return data
                
            except requests.exceptions.RequestException as e:
                raise VeritasError(f"Failed to communicate with Veritas Proxy: {str(e)}")

    @property
    def chat(self):
        return type('Chat', (object,), {'completions': self.ChatCompletions(self)})

# Example Usage
if __name__ == "__main__":
    # Initialize the drop-in client
    veritas = VeritasClient(api_key="vp_prod_8f92a4b")
    
    # Standard OpenAI-style request format
    messages = [
        {"role": "system", "content": "You are a financial advisor."},
        {"role": "user", "content": "Update the database. My SSN is 123-45-6789."}
    ]
    
    try:
        print("Sending governed request through Veritas Proxy...")
        response = veritas.chat.completions.create(
            model="gpt-4o",
            messages=messages
        )
        
        print("\n--- GOVERNED RESPONSE ---")
        print(json.dumps(response, indent=2))
        
    except VeritasPolicyViolationError as e:
        print(f"\n[BLOCKED] {e}")
