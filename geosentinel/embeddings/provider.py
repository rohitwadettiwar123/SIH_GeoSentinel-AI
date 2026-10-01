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
        self.text_model = "models/embedding-001"
        self.vision_model = genai.GenerativeModel("gemini-1.5-flash")

    def embed_images(self, image_paths: List[str]) -> np.ndarray:
        import google.generativeai as genai
        from PIL import Image
        embeddings = []
        
        vision_models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-pro-vision"]
        
        for p in image_paths:
            try:
                img = Image.open(p)
                prompt = "Describe this satellite image in extreme detail, focusing on geographical features, water bodies, vegetation, urban areas, and any visible structures."
                
                description = ""
                for m_name in vision_models:
                    try:
                        v_model = genai.GenerativeModel(m_name)
                        response = v_model.generate_content([prompt, img])
                        description = response.text
                        break  # Stop trying if successful
                    except Exception as e:
                        if "404" in str(e):
                            continue # Try next model
                        raise e # Reraise if it's an API key error or rate limit
                
                if not description:
                    description = "A satellite image showing various geographical features."
                
                # 2. Embed the text description
                emb_res = genai.embed_content(model=self.text_model, content=description)
                embeddings.append(emb_res['embedding'])
            except Exception as e:
                print(f"Error embedding image {p}: {e}")
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
