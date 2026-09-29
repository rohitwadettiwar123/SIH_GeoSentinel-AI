# Data Pipeline

## Ingestion Flow
1. **Raw Scene**: Read-only GeoTIFF/COG. Hashed (SHA-256).
2. **Validation (G0)**: Check CRS, resolution, bands.
3. **Geo-preprocessing**: Reproject to common CRS, crop to AOI, mask (cloud/shadow), create fixed-grid tiles.
4. **Embedding**: Generate OpenCLIP vectors for tiles.
5. **Indexing**: Add vectors to FAISS/Qdrant. Update SQLite registries.

## Identifiers
- Deterministic IDs: `sha1(scene_id|tile_id|model_version|preprocessing_version)` ensures idempotent ingestion.

## Registries
- Scenes, Tiles, Embeddings, Processing Runs, Change Events, Reviews.

## Incremental Ingestion
Only new tiles are embedded. The pipeline diffs new scenes against the registry.
