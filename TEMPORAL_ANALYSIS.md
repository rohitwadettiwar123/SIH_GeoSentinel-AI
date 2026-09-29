# Temporal Analysis

## Observation Selection
- Retrieve all observations for a `tile_id` in a `date_range`.
- Select the best-quality observation per season to minimize phenology differences.

## Registration
- ORB+RANSAC coregistration to align T0 and T1.
- Output `registration_quality` score (G1 gate).

## Change Detectors
- **Baseline**: Pixel difference, Spectral Difference (ΔNDVI, ΔNDWI, ΔNDBI).
- **Advanced**: Deep/Temporal models (optional).

## Earliest Supported Change
Backwards scan from the latest observation (Tn):
1. Compare T(i) to Tn.
2. If change score > threshold, Tn is different from T(i).
3. Requires persistence across multiple subsequent good observations.
4. Output: `[last_unchanged_date, earliest_supported_date]`.
