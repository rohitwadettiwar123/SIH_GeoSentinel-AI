from typing import Optional, Dict, Any
from geosentinel.core.registry import register
from geosentinel.core.config import config
import logging
import httpx

log = logging.getLogger("geosentinel.llm")

class LLMProvider:
    def generate(self, prompt: str, system_prompt: Optional[str] = None, image_path: Optional[str] = None) -> str:
        raise NotImplementedError

@register("llm", "disabled")
class DisabledLLM(LLMProvider):
    def generate(self, prompt: str, system_prompt: Optional[str] = None, image_path: Optional[str] = None) -> str:
        return "Offline mode enabled, LLM disabled."

@register("llm", "ollama")
class OllamaLLM(LLMProvider):
    def generate(self, prompt: str, system_prompt: Optional[str] = None, image_path: Optional[str] = None) -> str:
        # synchronous request for simplicity in abstraction, could be async
        url = config.get("legacy.ollama_url", "http://localhost:11434")
        model = config.get("legacy.ollama_model", "llava")
        payload = {
            "model": model,
            "prompt": prompt,
            "stream": False
        }
        if system_prompt:
            payload["system"] = system_prompt
        # (Handling image_path base64 encoding would go here for llava)
        
        try:
            with httpx.Client(timeout=60.0) as client:
                res = client.post(f"{url}/api/generate", json=payload)
                res.raise_for_status()
                return res.json().get("response", "")
        except Exception as e:
            log.warning(f"Ollama error: {e}")
            return "Ollama fallback failed."

@register("llm", "groq")
class GroqLLM(LLMProvider):
    def generate(self, prompt: str, system_prompt: Optional[str] = None, image_path: Optional[str] = None) -> str:
        if config.get("system.offline_mode"):
            return "Offline mode enabled, Groq disabled."
        try:
            from groq import Groq
            from backend.config import settings
            client = Groq(api_key=settings.groq_api_key)
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})
            
            completion = client.chat.completions.create(
                model="llama3-8b-8192",
                messages=messages
            )
            return completion.choices[0].message.content or ""
        except Exception as e:
            log.warning(f"Groq error: {e}")
            return "Groq generation failed."

@register("llm", "gemini")
class GeminiLLM(LLMProvider):
    def generate(self, prompt: str, system_prompt: Optional[str] = None, image_path: Optional[str] = None) -> str:
        if config.get("system.offline_mode"):
            return "Offline mode enabled, Gemini disabled."
        try:
            import google.generativeai as genai
            from backend.config import settings
            genai.configure(api_key=settings.gemini_api_key)
            model = genai.GenerativeModel('gemini-1.5-flash')
            # simplified
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            log.warning(f"Gemini error: {e}")
            return "Gemini generation failed."

def get_llm_provider() -> LLMProvider:
    if config.get("system.offline_mode"):
        provider_name = config.get("features.local_llm_provider", "ollama")
        if not config.get("features.local_llm"):
            provider_name = "disabled"
    else:
        provider_name = config.get("features.online_llm_provider", "groq")
        
    from geosentinel.core.registry import get_plugin
    try:
        provider_cls = get_plugin("llm", provider_name)
        return provider_cls()
    except Exception:
        return DisabledLLM()
