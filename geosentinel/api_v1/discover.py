from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
import uuid

from geosentinel.core.config import config

router = APIRouter(prefix="/v1/discover", tags=["discover"])

class ClusterRequest(BaseModel):
    seed: Optional[str] = None
    method: str = "kmeans"
    k: Optional[int] = 5

@router.post("/cluster")
def discover_clusters(req: ClusterRequest):
    # Mock Similar Site Radar (Clustering)
    # 1. Fetch embeddings for all current tiles (or filtered by AOI)
    # 2. Run KMeans / HDBSCAN
    # 3. Return clusters mapped to tile_ids
    
    # Mocking output
    mock_clusters = [
        {"cluster_id": 0, "label": "Cluster 0", "tile_ids": ["tile_1", "tile_2"]},
        {"cluster_id": 1, "label": "Cluster 1", "tile_ids": ["tile_3", "tile_4"]},
    ]
    
    return {
        "status": "ok",
        "data": {
            "method": req.method,
            "clusters": mock_clusters
        }
    }

class SimilarRequest(BaseModel):
    tile_id: str
    k: int = 5

@router.post("/similar")
def find_similar(req: SimilarRequest):
    # Mock finding similar sites to a specific tile
    return {
        "status": "ok",
        "data": {
            "query_tile": req.tile_id,
            "similar_tiles": [
                {"tile_id": f"sim_tile_{i}", "similarity": round(1.0 - (i * 0.1), 2)}
                for i in range(1, req.k + 1)
            ]
        }
    }
