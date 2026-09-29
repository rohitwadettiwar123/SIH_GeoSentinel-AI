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

@register("embedding", "dummy_clip")
class DummyClipProvider(EmbeddingProvider):
    def __init__(self):
        super().__init__("dummy_clip", "1.0", 512)
        
    def embed_images(self, image_paths: List[str]) -> np.ndarray:
        # returns dummy random vectors
        return np.random.rand(len(image_paths), self.dim).astype('float32')

    def embed_text(self, texts: List[str]) -> np.ndarray:
        return np.random.rand(len(texts), self.dim).astype('float32')
