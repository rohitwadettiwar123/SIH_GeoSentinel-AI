from typing import Dict, Any
from geosentinel.core.config import config

class ValidationGates:
    def __init__(self):
        self.cfg = config.get("gates", {})

    def evaluate(self, candidate_change: Dict[str, Any]) -> Dict[str, Any]:
        results = {}
        overall_cap = 1.0

        # G1: Registration
        g1_cfg = self.cfg.get("G1", {})
        rmse = candidate_change.get("registration_rmse", 0.0)
        max_rmse = g1_cfg.get("max_coregistration_rmse_px", 2.0)
        if rmse > max_rmse:
            results["G1"] = {"status": "FAIL", "reason": f"RMSE {rmse} > {max_rmse}"}
            if g1_cfg.get("critical"): overall_cap = 0.0
        else:
            results["G1"] = {"status": "PASS", "rmse": rmse}

        # G4: Cloud / Shadow
        g4_cfg = self.cfg.get("G4", {})
        cloud_frac = candidate_change.get("cloud_fraction", 0.0)
        if cloud_frac > g4_cfg.get("max_cloud_frac", 0.3):
            results["G4"] = {"status": "FAIL", "reason": f"Cloud {cloud_frac} > {g4_cfg.get('max_cloud_frac')}"}
            if g4_cfg.get("critical"): overall_cap = 0.0
        elif cloud_frac > g4_cfg.get("warn_cloud_frac", 0.15):
            results["G4"] = {"status": "WARN", "reason": "High cloud fraction"}
            overall_cap = min(overall_cap, 0.8)
        else:
            results["G4"] = {"status": "PASS"}

        # Add logic for other gates (G0, G2, G3, G5, G6, G8, G9)...

        return {
            "gate_results": results,
            "overall_cap": overall_cap
        }
