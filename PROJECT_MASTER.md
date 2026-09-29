# GeoSentinel AI - Project Master

## What is the project?
GeoSentinel AI is an on-premise, air-gap-capable geospatial intelligence workstation. It enables semantic retrieval and multi-temporal change analysis of satellite imagery. Analysts can discover relevant locations through semantic/hybrid retrieval, compare temporal footprints, verify changes with deterministic science (NDVI/NDWI/NDBI, area, SAR), explain results through an evidence graph, and preserve the full lineage.

## What existed in SatQuery?
- Basic agent / query routing
- Gemini (online) and Ollama + LLaVA (local fallback) LLM integrations
- Temporal cloud reconstruction (for visualization)
- 5-factor confidence weighting
- Basic NDVI classification and dead-band change detection
- Initial validation gates (G1 coregistration, G2 Nyquist, G5 escalation)
- PDF report generation (reportlab) and JSON audit log
- Basic authentication (python-jose)
- Docker setup for basic backend/frontend

## What are we adding?
- **GeoSentinel Core**: Offline, deterministic-first AI pipeline.
- **Geospatial Ingestion Engine**: `rasterio`-based, preserving CRS and geotransforms, creating fixed-grid tiles.
- **Embeddings & Vector Store**: OpenCLIP models and FAISS/Qdrant vector stores for text/image/hybrid retrieval.
- **Robust Temporal Engine**: Best-observation selection, sequence analysis, and earliest-supported-change calculations.
- **Expanded Scientific Validation**: Deterministic validation gates (G0-G9), expanded spectral indices, and false-alarm suppression.
- **Evidence Graph**: Transparent confidence computation and a Scientific Proof Card.
- **Similar Site Radar**: KMeans/HDBSCAN clustering for discovery.
- **PostGIS / SQLite DB**: Formal database for scenes, tiles, embeddings, and provenance.
- **3D Explorer Link**: Context sharing between 2D and 3D maps.

## What must NOT be removed?
- Existing agent/query routing (used as a fallback)
- LLaVA local fallback
- Existing validation gates (G1, G2, G5 equivalents)
- PDF report generation capabilities
- Dockerized deployment foundations
- Authentication framework

## Final architecture
The system operates offline with a React/TypeScript frontend (MapLibre 2D + 3D Explorer) communicating via REST to a FastAPI backend. The backend routes intents through a Query Planner (rules + optional LLM), executes tools via a deterministic Tool Executor (Retrieval, Temporal, Spectral, Quality, Evidence), and responds using templates grounded in stored evidence.

## Implementation rules
1. **AI discovers, deterministic science verifies.** No hallucinated metrics.
2. **Everything replaceable.** Use interface contracts and the plugin registry.
3. **Offline by construction.** No runtime cloud API dependency.
4. **Cloud-reconstructed pixels are not evidence.** Mask them out of temporal analysis.
5. **No raw radiometry cross-sensor comparisons.** Compare indicators only.
6. **Graceful degradation.** CPU fallback for everything.
