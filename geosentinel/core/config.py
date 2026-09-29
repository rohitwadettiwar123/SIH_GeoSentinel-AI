import yaml
import os
from typing import Dict, Any

class ConfigManager:
    def __init__(self, base_dir: str = "."):
        self.base_dir = base_dir
        self.config: Dict[str, Any] = {}
        self.load_all()

    def _load_yaml(self, path: str) -> Dict[str, Any]:
        full_path = os.path.join(self.base_dir, path)
        if os.path.exists(full_path):
            with open(full_path, 'r') as f:
                return yaml.safe_load(f) or {}
        return {}

    def load_all(self):
        # 1. Load legacy config as base
        legacy_config = self._load_yaml("config.yaml")
        
        # 2. Load modular configs
        default_cfg = self._load_yaml("configs/default.yaml")
        features_cfg = self._load_yaml("configs/features.yaml")
        ranking_cfg = self._load_yaml("configs/ranking.yaml")
        gates_cfg = self._load_yaml("configs/gates.yaml")
        confidence_cfg = self._load_yaml("configs/confidence.yaml")
        
        # 3. Merge legacy keys into the new structure as fallbacks if missing
        self.config = {
            "system": default_cfg.get("system", {}),
            "storage": default_cfg.get("storage", {}),
            "geospatial": default_cfg.get("geospatial", {}),
            "retrieval": default_cfg.get("retrieval", {}),
            "embedding": default_cfg.get("embedding", {}),
            "change_detection": default_cfg.get("change_detection", {}),
            "features": features_cfg.get("features", features_cfg),
            "ranking": ranking_cfg,
            "gates": gates_cfg,
            "confidence": confidence_cfg,
            "legacy": legacy_config
        }
        
        # Fallbacks from legacy config
        if "cloud_threshold" in legacy_config:
            if "G4" not in self.config["gates"]:
                self.config["gates"]["G4"] = {}
            if "max_cloud_frac" not in self.config["gates"]["G4"]:
                self.config["gates"]["G4"]["max_cloud_frac"] = legacy_config["cloud_threshold"]
                
        if "g1_max_coregistration_rmse" in legacy_config:
            if "G1" not in self.config["gates"]:
                self.config["gates"]["G1"] = {}
            if "max_coregistration_rmse_px" not in self.config["gates"]["G1"]:
                self.config["gates"]["G1"]["max_coregistration_rmse_px"] = legacy_config["g1_max_coregistration_rmse"]
                
        if "g2_nyquist_factor" in legacy_config:
            if "G2" not in self.config["gates"]:
                self.config["gates"]["G2"] = {}
            if "nyquist_factor" not in self.config["gates"]["G2"]:
                self.config["gates"]["G2"]["nyquist_factor"] = legacy_config["g2_nyquist_factor"]
                
        if "g5_escalation_threshold" in legacy_config:
            if "G8" not in self.config["gates"]:
                self.config["gates"]["G8"] = {}
            if "escalation_threshold" not in self.config["gates"]["G8"]:
                self.config["gates"]["G8"]["escalation_threshold"] = legacy_config["g5_escalation_threshold"]

        if "confidence_weights" in legacy_config:
            old_weights = legacy_config["confidence_weights"]
            new_weights = self.config["confidence"].get("weights", {})
            if "quality" not in new_weights and "cloud_prob" in old_weights:
                new_weights["quality"] = old_weights["cloud_prob"]
            if "registration" not in new_weights and "registration_quality" in old_weights:
                new_weights["registration"] = old_weights["registration_quality"]
            if "consistency" not in new_weights and "local_consistency" in old_weights:
                new_weights["consistency"] = old_weights["local_consistency"]
            if "model" not in new_weights and "model_confidence" in old_weights:
                new_weights["model"] = old_weights["model_confidence"]
            self.config["confidence"]["weights"] = new_weights

    def get(self, key_path: str, default: Any = None) -> Any:
        keys = key_path.split(".")
        val = self.config
        for k in keys:
            if isinstance(val, dict) and k in val:
                val = val[k]
            else:
                return default
        return val

# Singleton instance
config = ConfigManager()
