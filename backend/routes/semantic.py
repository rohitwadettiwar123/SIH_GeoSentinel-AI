from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from ai.semantic_engine import engine

router = APIRouter(prefix="/search", tags=["semantic-search"])

class SearchFilters(BaseModel):
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    sensor: Optional[str] = None
    cloud_cover_max: Optional[float] = None
    aoi: Optional[str] = None

class SearchRequest(BaseModel):
    query: str
    top_k: int = 20
    filters: Optional[SearchFilters] = None

@router.on_event("startup")
async def startup_event():
    # Load model on startup to avoid delay on first query
    engine.load()

@router.post("/semantic")
async def semantic_search(req: SearchRequest):
    if not engine.is_ready:
        raise HTTPException(status_code=503, detail="Semantic index not found. Please build the index first.")
    
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Please enter a semantic search query.")
        
    try:
        results = engine.search(req.query, top_k=req.top_k)
        
        # Apply basic metadata filtering if filters are provided
        if req.filters:
            filtered_results = []
            for r in results:
                if req.filters.cloud_cover_max is not None and r.get("cloud_cover", 0) > req.filters.cloud_cover_max:
                    continue
                if req.filters.sensor and r.get("sensor") != req.filters.sensor:
                    continue
                filtered_results.append(r)
            results = filtered_results
            
        if not results:
            return {
                "query": req.query,
                "results": [],
                "total_results": 0,
                "message": "No semantically relevant imagery found. Try broader filters."
            }

        return {
            "query": req.query,
            "results": results,
            "total_results": len(results),
            "index_version": "1.0",
            "model": engine.model_name
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/semantic/health")
async def get_health():
    return engine.get_health()

@router.post("/semantic/rebuild")
async def rebuild_index(background_tasks: BackgroundTasks):
    # Triggers an async rebuild
    def rebuild():
        import subprocess
        from pathlib import Path
        script_path = Path(__file__).resolve().parent.parent / "scripts" / "build_index.py"
        subprocess.run(["python", str(script_path)])
        engine.load() # reload after building
        
    background_tasks.add_task(rebuild)
    return {"message": "Index rebuild started in background."}
