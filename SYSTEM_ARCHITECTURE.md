# System Architecture

## Overview
GeoSentinel AI follows a modular, plugin-based architecture designed for offline, air-gapped environments.

```mermaid
flowchart TD
    UI[Frontend: 2D/3D Map, Timeline, Reviews] <--> API[FastAPI REST API /v1]
    API --> Planner[Query Planner: Rules/LLM]
    Planner --> Executor[Tool Executor]
    Executor --> Retrieval[Retrieval Engine: FAISS, Metadata]
    Executor --> Temporal[Temporal Engine]
    Executor --> Quality[Quality & Confounding Engine]
    Executor --> Evidence[Evidence & Proof Card]
    Retrieval <--> DB[(SQLite / PostGIS)]
    Temporal <--> DB
```

## Plugin Registry
Every module (embedding, vector store, change detector, llm, map) registers via a plugin system to allow easy swapping and graceful degradation.

## Modularity
- **Interfaces**: Defined in `geosentinel/core/schemas.py`.
- **Config-Driven**: `features.yaml` flags control feature availability (e.g., `semantic_search: true`).

## Key Components
- **API**: Versioned `/v1` endpoints.
- **Data Stores**: SQLite (MVP) or PostgreSQL+PostGIS for relational data, FAISS or Qdrant for vectors.
- **Offline Assurance**: Network calls strictly blocked at runtime.
