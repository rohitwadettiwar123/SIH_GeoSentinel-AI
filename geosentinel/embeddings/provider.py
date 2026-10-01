from typing import List, Any
from geosentinel.core.registry import register
import numpy as np

class EmbeddingProvider:
    def __init__(self, name: str, version: str, dim: int):
        self.name = name
        self.version = version
        self.dim = dim
        self.preprocessing_version = "prep-1.0.0"
        self.supports_text = True

    def embed_images(self, image_paths: List[str]) -> np.ndarray:
        raise NotImplementedError

    def embed_text(self, texts: List[str]) -> np.ndarray:
        raise NotImplementedError

@register("embedding", "gemini_api")
class GeminiEmbeddingProvider(EmbeddingProvider):
    def __init__(self):
        super().__init__("gemini_api", "1.0", 768)
        import google.generativeai as genai
        from backend.config import settings
        if not settings.gemini_api_key:
            raise ValueError("GEMINI_API_KEY is required for this provider.")
        genai.configure(api_key=settings.gemini_api_key)
        self.text_model = "models/text-embedding-004"
        self.vision_model = genai.GenerativeModel("gemini-1.5-flash")

    def embed_images(self, image_paths: List[str]) -> np.ndarray:
        import google.generativeai as genai
        from PIL import Image
        embeddings = []
        for p in image_paths:
            try:
                img = Image.open(p)
                # 1. Ask Gemini Vision to describe the satellite image in detail
                prompt = "Describe this satellite image in extreme detail, focusing on geographical features, water bodies, vegetation, urban areas, and any visible structures."
                response = self.vision_model.generate_content([prompt, img])
                description = response.text
                
                # 2. Embed the text description
                emb_res = genai.embed_content(model=self.text_model, content=description)
                embeddings.append(emb_res['embedding'])
            except Exception as e:
                print(f"Error embedding image {p}: {e}")
                # Fallback to zero vector if Gemini fails (e.g. rate limit)
                embeddings.append([0.0] * 768)
                
        return np.array(embeddings, dtype=np.float32)

    def embed_text(self, texts: List[str]) -> np.ndarray:
        import google.generativeai as genai
        embeddings = []
        for text in texts:
            try:
                res = genai.embed_content(model=self.text_model, content=text)
                embeddings.append(res['embedding'])
            except Exception as e:
                print(f"Error embedding text '{text}': {e}")
                embeddings.append([0.0] * 768)
        return np.array(embeddings, dtype=np.float32)

@register("embedding", "dummy_clip")
class DummyClipProvider(EmbeddingProvider):
    def __init__(self):
        super().__init__("dummy_clip", "1.0", 512)
        
    def embed_images(self, image_paths: List[str]) -> np.ndarray:
        return np.random.rand(len(image_paths), self.dim).astype('float32')

    def embed_text(self, texts: List[str]) -> np.ndarray:
        return np.random.rand(len(texts), self.dim).astype('float32')
