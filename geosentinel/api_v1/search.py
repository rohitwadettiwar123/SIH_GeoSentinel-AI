from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, Optional

from geosentinel.core.schemas import SearchHit
from geosentinel.core.registry import get_plugin
from geosentinel.core.config import config

router = APIRouter(prefix="/v1/search", tags=["search"])

class TextSearchRequest(BaseModel):
    query: str
    filters: Optional[Dict[str, Any]] = None
    top_k: int = 20
    weights: Optional[Dict[str, float]] = None

@router.post("/text")
def search_text(req: TextSearchRequest):
    provider_name = config.get("embedding.model", "dummy_clip")
    EmbeddingCls = get_plugin("embedding", provider_name)
    embedder = EmbeddingCls()
    
    vec = embedder.embed_text([req.query])
    
    store_name = config.get("retrieval.backend", "faiss")
    VectorStoreCls = get_plugin("vector_store", store_name)
    store = VectorStoreCls()
    store.load()
    
    ids, dists = store.search(vec, req.top_k)
    
    hits = []
    # Mocking hits for the ids returned
    for i, id_list in enumerate(ids):
        for j, tile_id in enumerate(id_list):
            if not tile_id: continue
            hits.append(SearchHit(
                tile_id=tile_id,
                bbox=[0.0, 0.0, 1.0, 1.0], # Mock
                date="2024-01-01",
                sensor="Sentinel-2",
                scores={"semantic": 1.0 / (1.0 + float(dists[i][j]))},
                thumb=""
            ))
            
    if not hits:
        return {"status": "ok", "reason": "No sufficiently relevant imagery found.", "data": {"hits": []}}

    return {"status": "ok", "data": {"hits": hits}}
