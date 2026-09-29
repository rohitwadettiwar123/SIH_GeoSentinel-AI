from typing import List, Dict, Any
from geosentinel.core.schemas import Observation, ChangeResult
from geosentinel.core.registry import get_plugin
from geosentinel.core.config import config
import geosentinel.change_detection.detector # ensure registry is populated

class TemporalAnalyzer:
    def observations(self, tile_id: str, date_range: List[str]) -> List[Observation]:
        # MVP: Mock fetching from DB
        return []

    def select_best(self, obs: List[Observation], period="season") -> List[Observation]:
        # Filter best quality
        return [o for o in obs if o.quality > 0.6 and not o.used]

    def analyze_pair(self, t0: Observation, t1: Observation, region_mask: Any = None) -> ChangeResult:
        # Load the configured detector (baseline or deep)
        method = config.get("change_detection.method", "baseline")
        try:
            DetectorCls = get_plugin("change_detector", method)
        except ValueError:
            # Fallback to baseline
            DetectorCls = get_plugin("change_detector", "baseline")
            
        detector = DetectorCls()
        return detector.detect(t0, t1, region_mask)

    def earliest_supported(self, series: List[Observation], current: Observation, region_mask: Any = None) -> Dict[str, Any]:
        """
        Backwards scanning to find earliest supported change.
        """
        candidate = current
        min_persistence = 2
        
        last_unchanged = None
        earliest_changed = current.date
        
        # simplified mock logic
        for obs in reversed(series):
            if obs.date >= current.date: continue
            if obs.quality <= 0.6: continue
            
            res = self.analyze_pair(obs, current)
            if res.final_confidence > 0.6:
                earliest_changed = obs.date
            else:
                last_unchanged = obs.date
                break
                
        return {
            "earliest_supported_date": earliest_changed,
            "last_unchanged_date": last_unchanged
        }
