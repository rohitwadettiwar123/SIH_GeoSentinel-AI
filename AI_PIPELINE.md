# AI Pipeline

## Discovery & Retrieval
- **Models**: OpenCLIP ViT-B/32 (baseline), RS-CLIP (upgrade).
- **Process**: Text/Image Query -> Embed -> SQL Pre-filter -> ANN Search -> Hybrid Rerank.

## Ranking
Hybrid scoring combining:
- Semantic similarity
- Metadata match
- Temporal relevance
- Quality score
- Geospatial distance

## Clustering (Similar Site Radar)
- Zero-shot clustering of retrieved tiles using KMeans (MVP) or HDBSCAN.

## Query Planner
1. Exact UI rules.
2. Keyword/Regex.
3. Local LLM (JSON schema constrained).

## Grounded Ask AI
- LLM explains *only* based on the deterministic Evidence Graph. Never generates unstructured metrics.
