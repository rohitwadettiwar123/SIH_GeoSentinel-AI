from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional
import uuid

from geosentinel.ingestion.processor import IngestionProcessor

router = APIRouter(prefix="/v1/ingest", tags=["ingestion"])

class IngestRequest(BaseModel):
    paths: List[str]
    sensor: Optional[str] = "Sentinel-2"
    aoi: Optional[dict] = None

# In-memory store for MVP background task status
ingest_jobs = {}

def process_ingestion_task(run_id: str, req: IngestRequest):
    try:
        processor = IngestionProcessor()
        all_tiles = []
        for path in req.paths:
            tiles = processor.process_scene(path, sensor=req.sensor)
            all_tiles.extend(tiles)
        
        # Here we would normally embed the tiles and insert into DB/FAISS
        
        ingest_jobs[run_id] = {"status": "completed", "tiles_processed": len(all_tiles)}
    except Exception as e:
        ingest_jobs[run_id] = {"status": "error", "error": str(e)}

@router.post("")
def start_ingestion(req: IngestRequest, background_tasks: BackgroundTasks):
    run_id = str(uuid.uuid4())
    ingest_jobs[run_id] = {"status": "running"}
    background_tasks.add_task(process_ingestion_task, run_id, req)
    return {"status": "ok", "data": {"run_id": run_id}}

@router.get("/{run_id}")
def get_ingestion_status(run_id: str):
    if run_id not in ingest_jobs:
        return {"status": "error", "reason": "Job not found"}
    return {"status": "ok", "data": ingest_jobs[run_id]}
