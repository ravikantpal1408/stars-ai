from smolagents import LiteLLMModel

model = LiteLLMModel(
    # 1. Add 'openai/' prefix so LiteLLM uses the OpenAI-compatible local API
    model_id="openai/google/gemma-3-4b",
    # 2. Point to the base V1 endpoint (remove /chat or /chat/completions)
    api_base="http://192.168.1.10:1234/v1",
    # 3. LiteLLM often requires a string here even for local servers
    api_key="not-needed",
    num_ctx=8192,
)

# 4. Correct way to trigger a response
messages = [{"role": "user", "content": "What is 2+2?"}]

try:
    response = model(messages)
    print(response.content)
except Exception as e:
    print(f"An error occurred: {e}")
