from openai import OpenAI

# 1. We instantiate the OFFICIAL OpenAI client
# 2. But we point it at our Antigravity Zero-Trust Edge Proxy!
client = OpenAI(
    api_key="antigravity_secret_key", 
    base_url="http://127.0.0.1:8080/v1"
)

print("[*] Sending request using official OpenAI SDK...")
print("[*] Target Model: qwen3:4b (Should route to Ollama)")

try:
    response = client.chat.completions.create(
        model="qwen3:4b", 
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "What is 2+2? Keep it extremely short."}
        ],
    )
    
    print("\n[+] Response received from Antigravity Proxy:")
    print("--------------------------------------------------")
    print(response.choices[0].message.content)
    print("--------------------------------------------------")
    
except Exception as e:
    print(f"\n[-] Error: {e}")
