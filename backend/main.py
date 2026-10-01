"""SatQuery AI – FastAPI Application Entrypoint."""
from __future__ import annotations

import json
import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles

from backend.config import settings

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s — %(message)s")
log = logging.getLogger("satquery")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle handler."""
    # ── Startup ────────────────────────────────────────────────────────────
    log.info("🛰️  SatQuery AI — Initialising…")

    # Ensure required directories exist
    for d in [settings.uploads_dir, settings.reports_dir, settings.uploads_dir.parent]:
        d.mkdir(parents=True, exist_ok=True)

    # Initialise empty audit log if it doesn't exist
    if not settings.audit_log_path.exists():
        settings.audit_log_path.parent.mkdir(parents=True, exist_ok=True)
        settings.audit_log_path.write_text(json.dumps([], ensure_ascii=False, indent=2))

    # Auto-build FAISS index if missing
    index_path = settings.data_dir / "indexes" / "faiss.index"
    if not index_path.exists():
        log.info("FAISS index not found. Building it via Gemini API...")
        import subprocess
        subprocess.run(["python", "scripts/build_geosentinel_index.py"], check=False)
        log.info("Index build complete.")

    log.info("✅ Directories ready. Backend is live.")
    log.info("📡 Gemini API: %s", "configured" if settings.gemini_api_key else "NOT configured (deterministic fallback)")

    yield  # ── application runs ────────────────────────────────────────────

    # ── Shutdown ───────────────────────────────────────────────────────────
    log.info("🔴 SatQuery AI shutting down.")


app = FastAPI(
    title="SatQuery AI",
    description=(
        "Autonomous Multimodal Remote Sensing Intelligence Platform — "
        "combining deterministic scientific pipelines with vision-language AI "
        "for verifiable Earth Observation analysis."
    ),
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ── CORS ───────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "https://satquery-ai-tau-seven.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Static file serving (uploaded images) ─────────────────────────────────────
app.mount("/uploads", StaticFiles(directory=str(settings.uploads_dir), check_dir=False), name="uploads")

# ── Routers ───────────────────────────────────────────────────────────────────
from backend.routes.health import router as health_router
from backend.routes.upload import router as upload_router
from backend.routes.analyze import router as analyze_router
from backend.routes.benchmark import router as benchmark_router
from backend.routes.report import router as report_router
from backend.routes.chat import router as chat_router
from backend.routes.gis_export import router as gis_router

app.include_router(health_router, prefix="/api")
app.include_router(upload_router, prefix="/api")
app.include_router(analyze_router, prefix="/api")
app.include_router(benchmark_router, prefix="/api")
app.include_router(report_router, prefix="/api")
# -- GeoSentinel API v1 --
from geosentinel.api_v1.health import router as geosentinel_health_router
from geosentinel.api_v1.ingest import router as geosentinel_ingest_router
from geosentinel.api_v1.search import router as geosentinel_search_router
from geosentinel.api_v1.analyze import router as geosentinel_analyze_router
from geosentinel.api_v1.discover import router as geosentinel_discover_router
app.include_router(geosentinel_health_router, prefix="/api")
app.include_router(geosentinel_ingest_router, prefix="/api")
app.include_router(geosentinel_search_router, prefix="/api")
app.include_router(geosentinel_analyze_router, prefix="/api")
app.include_router(geosentinel_discover_router, prefix="/api")


import os

# ── Global exception handler ──────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    log.exception("Unhandled exception on %s %s", request.method, request.url)
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)},
    )

# ── Serve React Frontend (For Single-Port Deployments like Hugging Face) ──────
dist_path = Path("frontend/dist")
if dist_path.exists() and dist_path.is_dir():
    app.mount("/", StaticFiles(directory=str(dist_path), html=True), name="frontend")
    
    # Custom 404 handler for React Router SPA
    @app.exception_handler(404)
    async def custom_404_handler(request: Request, exc: Exception):
        if request.url.path.startswith("/api"):
            return JSONResponse(status_code=404, content={"detail": "Not Found"})
        return FileResponse(str(dist_path / "index.html"))
else:
    @app.get("/", tags=["root"])
    async def root():
        return {
            "service": "SatQuery AI",
            "version": "2.0.0",
            "status": "operational",
            "docs": "/docs",
        }
