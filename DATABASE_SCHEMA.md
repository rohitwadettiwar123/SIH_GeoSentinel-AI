# Database Schema

## MVP: SQLite (WAL mode) -> Target: PostgreSQL + PostGIS

```sql
CREATE TABLE scenes (
    scene_id TEXT PRIMARY KEY,
    sensor TEXT,
    acquisition_time DATETIME,
    cloud_pct REAL,
    crs TEXT,
    resolution_m REAL,
    source_path TEXT,
    sha256 TEXT,
    dataset_version TEXT
);

CREATE TABLE tiles (
    tile_id TEXT,
    scene_id TEXT REFERENCES scenes(scene_id),
    bbox TEXT, -- JSON or WKT in SQLite, Geometry in PostGIS
    lat REAL,
    lon REAL,
    row INTEGER,
    col INTEGER,
    quality_score REAL,
    cloud_frac REAL,
    processing_version TEXT
);

CREATE TABLE embeddings (
    embedding_id TEXT PRIMARY KEY,
    tile_id TEXT,
    scene_id TEXT,
    model_name TEXT,
    model_version TEXT,
    dim INTEGER,
    preprocessing_version TEXT,
    index_version TEXT,
    vector_row INTEGER
);

CREATE TABLE search_queries (
    query_id TEXT,
    user TEXT,
    raw_text TEXT,
    plan_json TEXT,
    filters_json TEXT,
    ts DATETIME
);

CREATE TABLE temporal_observations (
    obs_id TEXT,
    tile_id TEXT,
    scene_id TEXT,
    quality REAL,
    used BOOLEAN,
    reject_reason TEXT
);

CREATE TABLE change_events (
    event_id TEXT,
    tile_id TEXT,
    change_type TEXT,
    earliest_date DATETIME,
    last_unchanged_date DATETIME,
    confidence REAL,
    status TEXT
);

CREATE TABLE evidence (
    evidence_id TEXT,
    event_id TEXT,
    kind TEXT,
    description TEXT,
    value_json TEXT,
    source_ref TEXT,
    weight REAL
);

CREATE TABLE reviews (
    review_id TEXT,
    event_id TEXT,
    action TEXT,
    analyst TEXT,
    conf_before REAL,
    reason TEXT,
    ts DATETIME
);

CREATE TABLE provenance (
    prov_id TEXT,
    entity_type TEXT,
    entity_id TEXT,
    parents_json TEXT,
    activity TEXT,
    agent TEXT,
    ts DATETIME
);
```
