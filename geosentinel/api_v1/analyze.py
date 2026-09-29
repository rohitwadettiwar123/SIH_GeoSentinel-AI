from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
from geosentinel.core.schemas import ChangeResult, Observation
from geosentinel.temporal.analyzer import TemporalAnalyzer
from geosentinel.core.config import config

router = APIRouter(prefix="/v1/analyze", tags=["analyze"])

class ChangeRequest(BaseModel):
    tile_id: str
    t0: Optional[str] = None
    t1: Optional[str] = None
    method: Optional[str] = "baseline"

class TimelineRequest(BaseModel):
    tile_id: str
    date_range: List[str]

@router.post("/change")
def analyze_change(req: ChangeRequest):
    # Temporarily set the method based on the request (or rely on default if none)
    method = req.method or config.get("change_detection.method", "baseline")
    
    # We load it directly here, or modify TemporalAnalyzer to accept it
    try:
        from geosentinel.core.registry import get_plugin
        DetectorCls = get_plugin("change_detector", method)
    except ValueError:
        DetectorCls = get_plugin("change_detector", "baseline")
        
    detector = DetectorCls()
    
    # Mocking observations for the requested dates
    obs_t0 = Observation(obs_id="1", tile_id=req.tile_id, scene_id="s1", date=req.t0 or "2023-01-01", quality=0.9, used=True)
    obs_t1 = Observation(obs_id="2", tile_id=req.tile_id, scene_id="s2", date=req.t1 or "2024-01-01", quality=0.95, used=True)
    
    res = detector.detect(obs_t0, obs_t1)
    
    return {
        "status": "ok",
        "data": res.model_dump()
    }

@router.post("/timeline")
def analyze_timeline(req: TimelineRequest):
    analyzer = TemporalAnalyzer()
    
    # Mock sequence of observations
    obs_seq = [
        Observation(obs_id="1", tile_id=req.tile_id, scene_id="s1", date="2023-01-01", quality=0.9, used=True),
        Observation(obs_id="2", tile_id=req.tile_id, scene_id="s2", date="2023-06-01", quality=0.95, used=True),
        Observation(obs_id="3", tile_id=req.tile_id, scene_id="s3", date="2024-01-01", quality=0.92, used=True)
    ]
    
    interval = analyzer.earliest_supported(obs_seq, obs_seq[-1])
    
    return {
        "status": "ok",
        "data": {
            "timeline": [o.model_dump() for o in obs_seq],
            "earliest_supported": interval
        }
    }
