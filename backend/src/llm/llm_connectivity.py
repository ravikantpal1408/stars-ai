import base64
import asyncio
import httpx
from typing import Optional

class LLMService:
    def __init__(self):
        # Your target machine IP
        self.base_url = "http://192.168.1.5:1234/v1/chat/completions"
        self.default_model = "qwen/qwen2.5-vl-7b" 

    def _sync_post(self, payload: dict, timeout: float) -> str:
        """
        Executes a pure synchronous network socket call.
        Bypasses async event loop routing and ignores system proxies.
        """
        # trust_env=False forces Python to ignore system-wide VPNs/Proxies
        with httpx.Client(timeout=timeout, trust_env=False) as client:
            response = client.post(self.base_url, json=payload)
            response.raise_for_status()
            result_json = response.json()
            return result_json["choices"][0]["message"]["content"] or ""

    async def generate_response(self, user_prompt: str, system_prompt: Optional[str] = None) -> str:
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": user_prompt})

        payload = {
            "model": self.default_model,
            "messages": messages,
            "temperature": 0
        }

        try:
            # Run the synchronous network call safely in a separate thread pool worker
            return await asyncio.to_thread(self._sync_post, payload, 60.0)
        except Exception as e:
            print(f"[LLMService Error] Cross-Machine Text Generation Failed: {str(e)}")
            raise RuntimeError(f"Text LLM communication error: {e}")

    async def generate_vision_response(
        self, 
        prompt: str, 
        image_bytes: bytes, 
        mime_type: str = "image/png"
    ) -> str:
        base64_image = base64.b64encode(image_bytes).decode("utf-8")
        image_data_url = f"data:{mime_type};base64,{base64_image}"

        payload = {
            "model": self.default_model,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {"url": image_data_url}
                        }
                    ]
                }
            ],
            "temperature": 0
        }

        try:
            # Run the vision payload off-thread
            return await asyncio.to_thread(self._sync_post, payload, 90.0)
        except Exception as e:
            print(f"[LLMService Error] Cross-Machine Vision Execution Failed: {str(e)}")
            raise RuntimeError(f"Vision LLM communication error: {e}")

llm_service = LLMService()