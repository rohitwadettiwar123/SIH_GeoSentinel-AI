from typing import Dict, Any
import math
from geosentinel.core.config import config

class ConfidenceCalculator:
    def __init__(self):
        self.weights = config.get("confidence.weights", {})

    def compute(self, components: Dict[str, float], gate_cap: float) -> float:
        """
        base = product( component_i ^ w_i )
        final = min(base, gate_cap) * product(1 - risk_j)
        """
        base = 1.0
        total_weight = sum(self.weights.values())
        if total_weight == 0:
            return 0.0
            
        for k, v in components.items():
            if k in self.weights:
                # Geometric mean component
                w = self.weights[k] / total_weight
                base *= (v ** w)
                
        # risks (cloud, seasonal, etc)
        risks = components.get("risks", {})
        risk_penalty = 1.0
        for r_val in risks.values():
            risk_penalty *= (1.0 - r_val)
            
        final_score = min(base, gate_cap) * risk_penalty
        return round(final_score, 4)
