# GeoAI Engine (Validation & Evidence Fusion)

## Scientific Validation (Gates G0-G9)
Pure, unit-tested functions in `geosentinel/quality/`:
- **G0 Input**: Validate format and CRS.
- **G1 Registration**: Coregistration RMSE ≤ threshold.
- **G2 Resolution**: Resolution compatibility check.
- **G3 Image Quality**: Basic image statistics.
- **G4 Cloud/Shadow**: Cloud fraction check (fail if mostly cloudy).
- **G5 Deterministic**: NDVI/NDWI/NDBI thresholds.
- **G6 False-Alarm**: Suppress seasonal changes.
- **G7 Confidence**: Final confidence score threshold.
- **G8 Analyst Review**: Escalation threshold.
- **G9 Provenance**: Ensure all inputs are traceable.

## False-Alarm Suppression
Confounders handled:
- Clouds / Shadows / Snow
- Haze
- Seasonality (compared to tile's own historical envelope)
- Illumination/Sun-angle
- Registration errors
- Radiometric consistency

## GeoEvidence Fusion (Proof Card)
The Evidence Graph joins nodes (Semantic, Visual, Temporal, Spectral, SAR, Quality, Geospatial) with `source_ref`, `value`, and `weight`.
Output is the **Scientific Proof Card** showing transparency into the confidence score.
