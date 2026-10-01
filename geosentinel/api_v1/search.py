from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, Optional

from geosentinel.core.schemas import SearchHit
from geosentinel.core.registry import get_plugin
from geosentinel.core.config import config
import geosentinel.embeddings.provider
import geosentinel.vector_store.faiss_store

router = APIRouter(prefix="/v1/search", tags=["search"])

class TextSearchRequest(BaseModel):
    query: str
    filters: Optional[Dict[str, Any]] = None
    top_k: int = 20
    weights: Optional[Dict[str, float]] = None

@router.post("/text")
def search_text(req: TextSearchRequest):
    if not req.query.strip():
        return {"status": "error", "reason": "Empty query"}

    # 1. Load Embedding Model
    provider_name = config.get("embedding.model", "sentence_transformers")
    try:
        EmbeddingCls = get_plugin("embedding", provider_name)
    except ValueError:
        # Fallback if sentence_transformers isn't in config
        EmbeddingCls = get_plugin("embedding", "gemini_api")
        
    embedder = EmbeddingCls()
    vec = embedder.embed_text([req.query])
    
    # 2. Load Vector Store
    store_name = config.get("retrieval.backend", "faiss")
    VectorStoreCls = get_plugin("vector_store", store_name)
    store = VectorStoreCls()
    store.load()
    
    if store.index is None or store.index.ntotal == 0:
        return {"status": "error", "reason": "Index is empty or not built. Please build index first.", "data": {"hits": []}}
    
    # We fetch a larger candidate pool for filtering
    candidate_k = min(100, store.index.ntotal)
    
    # 3. Search
    ids, dists, metas = store.search(vec, candidate_k)
    
    hits = []
    # 4. Filter and Rank
    for i, id_list in enumerate(ids):
        for j, tile_id in enumerate(id_list):
            if not tile_id: continue
            
            meta = metas[i][j]
            score = float(dists[i][j])
            
            # Geo/Spatial/Temporal Filtering
            if req.filters:
                # Basic filter matching
                if req.filters.get("sensor") and meta.get("sensor") != req.filters.get("sensor"):
                    continue
                if req.filters.get("cloud_cover_max") is not None and meta.get("cloud_cover", 0) > req.filters.get("cloud_cover_max"):
                    continue
            
            # Hybrid Ranking (simplified weights)
            # score is already normalized Inner Product (cosine similarity)
            # we can add metadata logic here if needed
            final_score = score * 1.0 # purely semantic for now
            
            hits.append(SearchHit(
                tile_id=tile_id,
                bbox=meta.get("bbox", [0.0, 0.0, 1.0, 1.0]),
                date=meta.get("acquisition_date", "2024-01-01"),
                sensor=meta.get("sensor", "Unknown"),
                scores={"semantic": final_score},
                thumb=meta.get("preview_url", "")
            ))
            
    # Sort and take top_k
    hits.sort(key=lambda x: x.scores.get("semantic", 0), reverse=True)
    hits = hits[:req.top_k]
            
    if not hits:
        return {"status": "ok", "reason": "No matching results found for the selected filters.", "data": {"hits": []}}

    return {"status": "ok", "data": {"hits": hits, "total": len(hits), "dimension": store.dim}}

@router.get("/health")
def search_health():
    # Attempt to load to check health
    store_name = config.get("retrieval.backend", "faiss")
    VectorStoreCls = get_plugin("vector_store", store_name)
    store = VectorStoreCls()
    store.load()
    
    return {
        "status": "ready" if store.index and store.index.ntotal > 0 else "not ready",
        "index_loaded": store.index is not None,
        "indexed_items": store.index.ntotal if store.index else 0,
        "dimension_match": True
    }

from fastapi import UploadFile, File
import shutil
import os

@router.post("/image")
async def search_image(file: UploadFile = File(...), top_k: int = 20):
    provider_name = config.get("embedding.model", "sentence_transformers")
    try:
        EmbeddingCls = get_plugin("embedding", provider_name)
    except ValueError:
        EmbeddingCls = get_plugin("embedding", "gemini_api")
        
    embedder = EmbeddingCls()
    
    # Save the file temporarily
    temp_path = f"backend/data/{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        vec = embedder.embed_images([temp_path])
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
    store_name = config.get("retrieval.backend", "faiss")
    VectorStoreCls = get_plugin("vector_store", store_name)
    store = VectorStoreCls()
    store.load()
    
    if store.index is None or store.index.ntotal == 0:
        return {"status": "error", "reason": "Index is empty or not built. Please build index first.", "data": {"hits": []}}
    
    candidate_k = min(100, store.index.ntotal)
    ids, dists, metas = store.search(vec, candidate_k)
    
    hits = []
    for i, id_list in enumerate(ids):
        for j, tile_id in enumerate(id_list):
            if not tile_id: continue
            
            meta = metas[i][j]
            score = float(dists[i][j])
            
            hits.append(SearchHit(
                tile_id=tile_id,
                bbox=meta.get("bbox", [0.0, 0.0, 1.0, 1.0]),
                date=meta.get("acquisition_date", "2024-01-01"),
                sensor=meta.get("sensor", "Unknown"),
                scores={"semantic": score},
                thumb=meta.get("preview_url", "")
            ))
            
    hits.sort(key=lambda x: x.scores.get("semantic", 0), reverse=True)
    hits = hits[:top_k]
            
    if not hits:
        return {"status": "ok", "reason": "No matching results found.", "data": {"hits": []}}

    return {"status": "ok", "data": {"hits": hits, "total": len(hits), "dimension": store.dim}}
