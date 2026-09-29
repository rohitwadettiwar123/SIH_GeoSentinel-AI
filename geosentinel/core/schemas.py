from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class TileMetadata(BaseModel):
    scene_id: str
    tile_id: str
    sensor: str
    acquisition_time: str
    lat: float
    lon: float
    bbox: List[float]
    crs: str
    resolution_m: float
    cloud_pct: float
    source_path: str
    sha256: str
    processing_version: str
    quality_score: float

class QueryPlan(BaseModel):
    intent: str
    object: str
    change_type: Optional[str] = None
    spatial_relation: Optional[Dict[str, Any]] = None
    date_range: Optional[List[str]] = None
    requires_change_analysis: bool = False
    filters: Optional[Dict[str, Any]] = None
    steps: List[str]

class SearchHit(BaseModel):
    tile_id: str
    bbox: List[float]
    date: str
    sensor: str
    scores: Dict[str, float]
    thumb: str

class Observation(BaseModel):
    obs_id: str
    tile_id: str
    scene_id: str
    date: str
    quality: float
    used: bool
    reject_reason: Optional[str] = None

class ChangeResult(BaseModel):
    tile_id: str
    t0_date: str
    t1_date: str
    raw_change_score: float
    gates: Dict[str, Any]
    final_confidence: float

class EvidenceNode(BaseModel):
    id: str
    type: str
    description: str
    source_ref: str
