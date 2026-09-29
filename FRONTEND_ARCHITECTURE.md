# Frontend Architecture

## Tech Stack
- React + TypeScript
- MapLibre GL JS (2D offline maps, vector/raster tiles)
- CesiumJS (or MapLibre 3D Terrain) for 3D Explorer
- Tailwind CSS

## State Management
- Centralized `AnalysisContext` store synced with URL params.
- Shared between 2D Tactical and 3D Explorer for seamless deep linking.
```typescript
interface AnalysisContext {
  aoi: GeoJSON | null;
  dateRange: [string, string];
  sensors: string[];
  cloudMax: number;
  query: string | null;
  selectedTileIds: string[];
  selectedEventId: string | null;
  viewport: { center: [number, number], zoom: number };
}
```

## Key Views
1. **Mission Dashboard**: Metrics on ingested data, searches today, detected high-confidence changes, pending reviews.
2. **2D Tactical**: The main workspace. Swiping before/after, confidence overlays, temporal dock, evidence markers.
3. **3D Explorer**: Draw an AOI on the 3D globe and click "Analyse This View" to seamlessly transfer context to the 2D Tactical view.
4. **Change Evidence / Proof Card**: Detailed breakdown of the confidence components (Semantic, Visual, Temporal, Gates, etc.).
5. **Analyst Review**: UI for Confirm/Reject/Flag on candidate changes.
6. **Similar Site Radar**: Radial map view of similar locations.
