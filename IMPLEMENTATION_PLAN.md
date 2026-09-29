# Implementation Plan

Follows a phased approach. Each phase requires contract tests to pass.

## Phases

| Phase | Description | Exit Condition |
|---|---|---|
| **P0** | Initial check and baseline | App runs from clone, tests saved. |
| **P1** | Contract tests & baseline | Snapshots saved for existing routes. |
| **P2** | Core structure `geosentinel/` | Config loader reads new/old configs. `/v1/health` works. |
| **P3** | LLM Provider Shims | Network blocked, offline models work. |
| **P4** | Geospatial Ingestion (rasterio) | Valid tiles + metadata stored. |
| **P5** | Embeddings & FAISS Index | Build index works, self-query returns rank 1. |
| **P6** | Retrieval & Planner | Text/hybrid search returns ranked tiles. |
| **P7** | Temporal Engine & Change Det | Earliest-supported-change logic works. |
| **P8** | Gates & Confidence | Proof card generated, confounders suppressed. |
| **P9** | Feedback & Provenance DB | Reviews persisted, JSON audit maintained. |
| **P10** | Frontend Integration | UI flows end-to-end (Search -> Compare -> Verify). |
| **P11** | (Optional) SAR Fusion | SAR evidence on cloudy dates. |
| **P12** | Offline Packaging | Runs completely disconnected, offline script passes. |

## Strategy
Wrap existing logic in `ai/` and `pipeline/` with `adapters/` to implement `geosentinel/` interfaces, keeping the old `/` routes functional while we build `/v1/`.
