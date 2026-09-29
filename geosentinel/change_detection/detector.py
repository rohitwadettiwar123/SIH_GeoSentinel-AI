from typing import Protocol, Any, Dict, List
import numpy as np
from geosentinel.core.registry import register
from geosentinel.core.schemas import ChangeResult, Observation

class ChangeDetector(Protocol):
    def detect(self, t0: Observation, t1: Observation, region_mask: Any = None) -> ChangeResult:
        ...

@register("change_detector", "baseline")
class SpectralDifferenceDetector:
    def __init__(self):
        self.threshold = 0.15 # Minimum delta NDVI/NDWI to flag

    def detect(self, t0: Observation, t1: Observation, region_mask: Any = None) -> ChangeResult:
        # MVP: Mock spectral difference based on date proximity and random noise
        # In a real scenario, this would load the raster data for t0 and t1, compute NDVI/NDWI,
        # apply the region_mask, and compute the delta area.
        
        # Simulate a change score
        raw_score = 0.35 # Simulated score
        
        # Construct the change result payload
        return ChangeResult(
            tile_id=t0.tile_id,
            t0_date=t0.date,
            t1_date=t1.date,
            raw_change_score=raw_score,
            gates={"G5": {"status": "PASS", "reason": "Delta above threshold"}},
            final_confidence=min(1.0, raw_score * 1.5)
        )

@register("change_detector", "deep")
class DeepChangeDetector:
    def __init__(self):
        # We wrap imports so the pipeline doesn't crash if torch is missing on CPU
        try:
            import torch
            self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            self.model_loaded = True
        except ImportError:
            self.device = "cpu"
            self.model_loaded = False
            
    def load_model(self):
        # Mock model loading
        pass

    def detect(self, t0: Observation, t1: Observation, region_mask: Any = None) -> ChangeResult:
        if not self.model_loaded:
            # Fallback gracefully
            return SpectralDifferenceDetector().detect(t0, t1, region_mask)
            
        # 1. Load t0 and t1 image arrays as tensors
        # 2. Forward pass: diff_mask = model(t0_tensor, t1_tensor)
        # 3. Apply post-processing (thresholding, morphological operations)
        
        raw_score = 0.88 # Simulated high confidence from deep model
        
        return ChangeResult(
            tile_id=t0.tile_id,
            t0_date=t0.date,
            t1_date=t1.date,
            raw_change_score=raw_score,
            gates={"G5": {"status": "PASS", "reason": "Deep feature difference detected"}},
            final_confidence=raw_score
        )
