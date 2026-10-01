from geosentinel.core.registry import register
from typing import List, Tuple
import numpy as np
import os
import json

try:
    import faiss
except ImportError:
    faiss = None

class VectorStore:
    def add(self, ids: List[str], vecs: np.ndarray, meta_list: List[dict] = None):
        raise NotImplementedError
    def search(self, q: np.ndarray, k: int, id_filter=None) -> Tuple[List[str], np.ndarray, List[dict]]:
        raise NotImplementedError

@register("vector_store", "faiss")
class FaissStore(VectorStore):
    _cached_index = None
    _cached_id_map = None
    _cached_meta_map = None

    def __init__(self, dim: int = 768, index_type: str = "flat"):
        if faiss is None:
            raise ImportError("faiss is required")
        self.dim = dim
        self.index = faiss.IndexFlatIP(dim)
        
        self.id_map = [] # stores strings since faiss flat index uses int IDs
        self.meta_map = []
        self.index_path = "backend/data/indexes/faiss.index"
        self.id_map_path = "backend/data/indexes/id_map.txt"
        self.meta_map_path = "backend/data/indexes/meta_map.json"

    def add(self, ids: List[str], vecs: np.ndarray, meta_list: List[dict] = None):
        faiss.normalize_L2(vecs)
        self.index.add(vecs)
        self.id_map.extend(ids)
        if meta_list:
            self.meta_map.extend(meta_list)
        else:
            self.meta_map.extend([{} for _ in ids])
        
    def search(self, q: np.ndarray, k: int, id_filter: List[str]=None) -> Tuple[List[str], np.ndarray, List[dict]]:
        if self.index.ntotal == 0:
            return [], [], []
            
        faiss.normalize_L2(q)
        actual_k = min(k, self.index.ntotal)
        distances, indices = self.index.search(q, actual_k)
        
        results_ids = []
        results_metas = []
        for row_idx in indices:
            row_ids = []
            row_metas = []
            for i in row_idx:
                if 0 <= i < len(self.id_map):
                    row_ids.append(self.id_map[i])
                    row_metas.append(self.meta_map[i])
                else:
                    row_ids.append("")
                    row_metas.append({})
            results_ids.append(row_ids)
            results_metas.append(row_metas)
            
        return results_ids, distances, results_metas

    def save(self):
        os.makedirs(os.path.dirname(self.index_path), exist_ok=True)
        faiss.write_index(self.index, self.index_path)
        with open(self.id_map_path, 'w') as f:
            for i in self.id_map:
                f.write(f"{i}\n")
        with open(self.meta_map_path, 'w') as f:
            json.dump(self.meta_map, f)
        
        # Invalidate cache
        FaissStore._cached_index = None
        FaissStore._cached_id_map = None
        FaissStore._cached_meta_map = None

    def load(self):
        if FaissStore._cached_index is not None:
            self.index = FaissStore._cached_index
            self.id_map = FaissStore._cached_id_map
            self.meta_map = FaissStore._cached_meta_map
            return

        if os.path.exists(self.index_path):
            self.index = faiss.read_index(self.index_path)
        if os.path.exists(self.id_map_path):
            with open(self.id_map_path, 'r') as f:
                self.id_map = [line.strip() for line in f]
        if os.path.exists(self.meta_map_path):
            with open(self.meta_map_path, 'r') as f:
                self.meta_map = json.load(f)

        FaissStore._cached_index = self.index
        FaissStore._cached_id_map = self.id_map
        FaissStore._cached_meta_map = self.meta_map
