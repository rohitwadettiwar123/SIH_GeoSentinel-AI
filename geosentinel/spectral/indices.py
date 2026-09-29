import numpy as np
from typing import Dict, Any

class SpectralAnalyzer:
    def __init__(self, ndvi_deadband: float = 0.05, ndwi_threshold: float = 0.1):
        self.ndvi_deadband = ndvi_deadband
        self.ndwi_threshold = ndwi_threshold

    def calculate_ndvi(self, nir: np.ndarray, red: np.ndarray) -> np.ndarray:
        # Avoid division by zero
        denominator = (nir + red)
        denominator[denominator == 0] = 1e-6
        return (nir - red) / denominator

    def calculate_ndwi(self, green: np.ndarray, nir: np.ndarray) -> np.ndarray:
        denominator = (green + nir)
        denominator[denominator == 0] = 1e-6
        return (green - nir) / denominator

    def analyze_change(self, 
                       nir_t0: np.ndarray, red_t0: np.ndarray, 
                       nir_t1: np.ndarray, red_t1: np.ndarray) -> Dict[str, Any]:
        """
        Calculates NDVI for T0 and T1, and returns change statistics.
        """
        ndvi_t0 = self.calculate_ndvi(nir_t0, red_t0)
        ndvi_t1 = self.calculate_ndvi(nir_t1, red_t1)
        
        delta_ndvi = ndvi_t1 - ndvi_t0
        
        # Deadband filtering
        significant_change_mask = np.abs(delta_ndvi) > self.ndvi_deadband
        
        mean_delta = np.mean(delta_ndvi[significant_change_mask]) if np.any(significant_change_mask) else 0.0
        changed_pixels = np.sum(significant_change_mask)
        
        return {
            "mean_delta_ndvi": float(mean_delta),
            "changed_pixels": int(changed_pixels),
            "significant_change_ratio": float(changed_pixels / ndvi_t0.size)
        }
