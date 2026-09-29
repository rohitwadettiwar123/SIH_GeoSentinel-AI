const API_BASE = '/api/v1';

export const GeoSentinelAPI = {
  healthCheck: async () => {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  ingestImages: async (paths: string[], sensor: string = 'Sentinel-2') => {
    const res = await fetch(`${API_BASE}/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paths, sensor })
    });
    return res.json();
  },

  searchText: async (query: string, topK: number = 20) => {
    const res = await fetch(`${API_BASE}/search/text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, top_k: topK })
    });
    return res.json();
  },

  analyzeChange: async (tileId: string, t0?: string, t1?: string) => {
    const res = await fetch(`${API_BASE}/analyze/change`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tile_id: tileId, t0, t1 })
    });
    return res.json();
  },

  analyzeTimeline: async (tileId: string, dateRange: string[]) => {
    const res = await fetch(`${API_BASE}/analyze/timeline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tile_id: tileId, date_range: dateRange })
    });
    return res.json();
  }
};
