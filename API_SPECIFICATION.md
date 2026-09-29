# API Specification

All routes are under `/v1` in FastAPI. Breaking changes will go to `/v2`.

| Method | Path | Request Body | Response (Abridged) |
|---|---|---|---|
| POST | `/v1/ingest` | `{paths[], sensor?, aoi?}` | `{run_id}` (async) |
| GET | `/v1/ingest/{run_id}` | None | Status of ingestion task |
| POST | `/v1/plan` | `{text, context}` | `QueryPlan` JSON |
| POST | `/v1/search/text` | `{query, filters, top_k, weights?}` | `{hits: [...], status}` |
| POST | `/v1/search/image` | multipart image + filters | `{hits: [...], status}` |
| POST | `/v1/search/hybrid` | text/image/location + filters | `{hits: [...], status}` |
| POST | `/v1/analyze/change`| `{tile_id, t0?, t1?, method?}` | `ChangeResult + gates + evidence` |
| POST | `/v1/analyze/timeline`| `{tile_id, date_range}` | `ChangeSeries + earliest interval` |
| POST | `/v1/discover/similar`| `{tile_id, k}` | Similar sites list |
| POST | `/v1/cluster` | `{seed?, method, k?}` | Clusters of tiles |
| POST | `/v1/ask` | `{question, result_id}` | Grounded answer based on evidence |
| POST | `/v1/review` | `{event_id, action, reason}`| Audit record |
| GET | `/v1/health` | None | Models, index versions, offline status |
| POST | `/v1/export/geojson`| (Export parameters) | GeoJSON file |

## Common Envelope
All responses follow a standard envelope:
```json
{
  "status": "ok|insufficient_evidence|error",
  "reason": "...",
  "data": {},
  "provenance_id": "..."
}
```
