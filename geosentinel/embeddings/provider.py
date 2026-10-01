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

@register("embedding", "sentence_transformers")
class SentenceTransformerProvider(EmbeddingProvider):
    _cached_model = None

    def __init__(self, model_name: str = "clip-ViT-B-32"):
        super().__init__("sentence_transformers", "1.0", 512)
        try:
            from sentence_transformers import SentenceTransformer
            if SentenceTransformerProvider._cached_model is None:
                SentenceTransformerProvider._cached_model = SentenceTransformer(model_name)
            self.model = SentenceTransformerProvider._cached_model
            self.dim = self.model.get_sentence_embedding_dimension()
        except ImportError:
            raise ImportError("sentence_transformers is not installed. Please install it.")
        
    def embed_images(self, image_paths: List[str]) -> np.ndarray:
        from PIL import Image
        images = [Image.open(p).convert('RGB') for p in image_paths]
        emb = self.model.encode(images)
        return np.array(emb, dtype=np.float32)

    def embed_text(self, texts: List[str]) -> np.ndarray:
        emb = self.model.encode(texts)
        return np.array(emb, dtype=np.float32)

@register("embedding", "dummy_clip")
class DummyClipProvider(EmbeddingProvider):
    def __init__(self):
        super().__init__("dummy_clip", "1.0", 512)
        
    def embed_images(self, image_paths: List[str]) -> np.ndarray:
        return np.random.rand(len(image_paths), self.dim).astype('float32')

    def embed_text(self, texts: List[str]) -> np.ndarray:
        return np.random.rand(len(texts), self.dim).astype('float32')
