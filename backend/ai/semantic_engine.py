import os
import json
import numpy as np
import faiss
from PIL import Image
from pathlib import Path
from sentence_transformers import SentenceTransformer

class SemanticEngine:
    def __init__(self):
        self.model_name = 'clip-ViT-B-32'
        self.model = None
        self.index = None
        self.metadata = []
        self.dimension = 512
        self.is_ready = False
        
        # Determine the base directory properly
        base_dir = Path(__file__).resolve().parent.parent
        self.index_dir = base_dir / "data" / "indexes"
        self.index_path = self.index_dir / "satellite.index"
        self.meta_path = self.index_dir / "metadata.json"
        
    def load(self):
        print(f"Loading embedding model {self.model_name}...")
        # sentence-transformers auto-downloads the model if missing and caches it
        self.model = SentenceTransformer(self.model_name)
        self.dimension = self.model.get_sentence_embedding_dimension()
        
        self.index_dir.mkdir(parents=True, exist_ok=True)
        
        if self.index_path.exists() and self.meta_path.exists():
            print("Loading FAISS index...")
            self.index = faiss.read_index(str(self.index_path))
            with open(self.meta_path, 'r') as f:
                self.metadata = json.load(f)
            
            if self.index.d != self.dimension:
                raise ValueError(f"Embedding dimension mismatch. Index dimension: {self.index.d}, Query dimension: {self.dimension}. Rebuild the index.")
            self.is_ready = True
            print(f"Index loaded. {self.index.ntotal} items.")
        else:
            print("No index found. Initializing empty index.")
            self.index = faiss.IndexFlatIP(self.dimension)
            self.metadata = []
            self.is_ready = True

    def _normalize(self, v):
        norm = np.linalg.norm(v, axis=1, keepdims=True)
        return v / np.maximum(norm, 1e-10)

    def encode_text(self, text: str) -> np.ndarray:
        if not self.model: self.load()
        emb = self.model.encode([text])[0]
        emb = np.array([emb], dtype=np.float32)
        return self._normalize(emb)

    def encode_image(self, image_path: str) -> np.ndarray:
        if not self.model: self.load()
        img = Image.open(image_path).convert('RGB')
        emb = self.model.encode([img])[0]
        emb = np.array([emb], dtype=np.float32)
        return self._normalize(emb)

    def add_image(self, image_path: str, meta: dict):
        if not self.model: self.load()
        emb = self.encode_image(image_path)
        self.index.add(emb)
        meta["vector_id"] = len(self.metadata)
        self.metadata.append(meta)
        
    def save(self):
        faiss.write_index(self.index, str(self.index_path))
        with open(self.meta_path, 'w') as f:
            json.dump(self.metadata, f, indent=2)

    def get_health(self):
        return {
            "status": "ready" if self.is_ready else "not ready",
            "model_loaded": self.model is not None,
            "index_loaded": self.index is not None,
            "metadata_loaded": len(self.metadata) > 0,
            "dimension_match": self.index.d == self.dimension if self.index else False,
            "indexed_items": self.index.ntotal if self.index else 0,
            "dimension": self.dimension
        }

    def search(self, query: str, top_k: int = 20):
        if not self.is_ready or self.index.ntotal == 0:
            return []
        
        emb = self.encode_text(query)
        candidate_k = min(100, self.index.ntotal)
        scores, indices = self.index.search(emb, candidate_k)
        
        results = []
        for i, idx in enumerate(indices[0]):
            if idx == -1: continue
            score = float(scores[0][i])
            meta = self.metadata[idx]
            results.append({
                "rank": i + 1,
                "similarity": score,
                "semantic_score": score,
                **meta
            })
        
        results.sort(key=lambda x: x["similarity"], reverse=True)
        return results[:top_k]

# Singleton instance
engine = SemanticEngine()
