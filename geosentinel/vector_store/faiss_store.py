from geosentinel.core.registry import register
from typing import List, Tuple
import numpy as np
import os

try:
    import faiss
except ImportError:
    faiss = None

class VectorStore:
    def add(self, ids: List[str], vecs: np.ndarray):
        raise NotImplementedError
    def search(self, q: np.ndarray, k: int, id_filter=None) -> Tuple[np.ndarray, np.ndarray]:
        raise NotImplementedError

@register("vector_store", "faiss")
class FaissStore(VectorStore):
    def __init__(self, dim: int = 512, index_type: str = "flat"):
        if faiss is None:
            raise ImportError("faiss is required")
        self.dim = dim
        if index_type == "flat":
            self.index = faiss.IndexFlatL2(dim)
        else:
            self.index = faiss.IndexFlatL2(dim) # simplified MVP
        
        self.id_map = [] # stores strings since faiss flat index uses int IDs
        self.index_path = "data/indexes/faiss.index"
        self.id_map_path = "data/indexes/id_map.txt"

    def add(self, ids: List[str], vecs: np.ndarray):
        faiss.normalize_L2(vecs)
        self.index.add(vecs)
        self.id_map.extend(ids)
        
    def search(self, q: np.ndarray, k: int, id_filter: List[str]=None) -> Tuple[List[str], np.ndarray]:
        faiss.normalize_L2(q)
        distances, indices = self.index.search(q, k)
        
        results_ids = []
        for row_idx in indices:
            row_ids = []
            for i in row_idx:
                if i >= 0 and i < len(self.id_map):
                    row_ids.append(self.id_map[i])
                else:
                    row_ids.append("")
            results_ids.append(row_ids)
            
        return results_ids, distances

    def save(self):
        os.makedirs(os.path.dirname(self.index_path), exist_ok=True)
        faiss.write_index(self.index, self.index_path)
        with open(self.id_map_path, 'w') as f:
            for i in self.id_map:
                f.write(f"{i}\n")

    def load(self):
        if os.path.exists(self.index_path):
            self.index = faiss.read_index(self.index_path)
        if os.path.exists(self.id_map_path):
            with open(self.id_map_path, 'r') as f:
                self.id_map = [line.strip() for line in f]
