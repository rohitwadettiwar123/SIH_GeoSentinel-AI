from fastapi import APIRouter
from geosentinel.core.config import config
import time

router = APIRouter(prefix="/v1", tags=["health"])

@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "timestamp": time.time(),
        "offline_mode": config.get("system.offline_mode", False),
        "features": config.get("features", {}),
        "gates": config.get("gates", {})
    }
