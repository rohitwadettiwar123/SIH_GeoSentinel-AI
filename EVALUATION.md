# Evaluation Strategy

## Core Metrics (Measured Only)

### Retrieval
- Precision@K, Recall@K, MRR, nDCG@K on hand-labeled queries.
- Baseline vs Metadata filter vs Hybrid rerank vs RS-CLIP.

### Change Detection
- Precision, Recall, F1, IoU on known-stable vs changed tiles.
- False Positive Rate (especially on seasonal/clouded tiles).
- Earliest-date: absolute error in days vs labeled onset.

### Systems Performance
- Index build time (batch).
- Incremental ingest time.
- Search latency (p50 / p95).
- Temporal analysis latency.
- RAM / VRAM usage.

## Baseline Comparison
Compare the `geosentinel` results against `evaluation/baseline_satquery.json` (the snapshot of `benchmark_report.json`). No hallucinated metrics allowed.
