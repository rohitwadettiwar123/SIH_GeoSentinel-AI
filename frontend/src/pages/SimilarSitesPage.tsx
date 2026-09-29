import React, { useState } from 'react';
import { Globe2, Loader2, Play, Users, Layers } from 'lucide-react';

const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://127.0.0.1:8000/api';

const CLUSTER_TYPES = ['KMeans', 'Semantic Similarity', 'Hybrid'];

const MOCK_CLUSTERS = [
  { id: 'C-001', label: 'River Delta Systems',    color: '#00f0ff', members: 42, x: 20, y: 30 },
  { id: 'C-002', label: 'Coastal Erosion Zones',  color: '#a78bfa', members: 31, x: 60, y: 20 },
  { id: 'C-003', label: 'Urban Expansion Areas',  color: '#fbbf24', members: 58, x: 40, y: 55 },
  { id: 'C-004', label: 'Forest Loss Patches',    color: '#34d399', members: 24, x: 75, y: 60 },
  { id: 'C-005', label: 'Industrial Zones',       color: '#f87171', members: 19, x: 25, y: 70 },
  { id: 'C-006', label: 'Agricultural Cycles',   color: '#fb923c', members: 37, x: 80, y: 35 },
];

const MOCK_POINTS = [
  { cx: 18, cy: 28, color: '#00f0ff', r: 5 }, { cx: 22, cy: 33, color: '#00f0ff', r: 4 }, { cx: 15, cy: 25, color: '#00f0ff', r: 3 },
  { cx: 62, cy: 18, color: '#a78bfa', r: 5 }, { cx: 57, cy: 24, color: '#a78bfa', r: 4 }, { cx: 65, cy: 22, color: '#a78bfa', r: 3 },
  { cx: 38, cy: 53, color: '#fbbf24', r: 6 }, { cx: 43, cy: 58, color: '#fbbf24', r: 4 }, { cx: 35, cy: 60, color: '#fbbf24', r: 3 }, { cx: 46, cy: 52, color: '#fbbf24', r: 3 },
  { cx: 73, cy: 62, color: '#34d399', r: 4 }, { cx: 78, cy: 57, color: '#34d399', r: 3 }, { cx: 76, cy: 65, color: '#34d399', r: 3 },
  { cx: 24, cy: 68, color: '#f87171', r: 4 }, { cx: 28, cy: 73, color: '#f87171', r: 3 }, { cx: 20, cy: 72, color: '#f87171', r: 3 },
  { cx: 82, cy: 33, color: '#fb923c', r: 5 }, { cx: 77, cy: 38, color: '#fb923c', r: 4 }, { cx: 85, cy: 30, color: '#fb923c', r: 3 },
];

interface Cluster { id: string; label: string; color: string; members: number; x: number; y: number; }

export default function SimilarSitesPage() {
  const [clusterType, setClusterType] = useState(CLUSTER_TYPES[0]);
  const [minCluster, setMinCluster] = useState(10);
  const [clusters, setClusters] = useState<Cluster[]>(MOCK_CLUSTERS);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'cluster' | 'similar'>('cluster');

  const runClustering = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/v1/discover/cluster`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: clusterType.toLowerCase(), k: minCluster }),
      });
      if (res.ok) {
        const data = await res.json();
        setClusters(Array.isArray(data.clusters) && data.clusters.length > 0 ? data.clusters : MOCK_CLUSTERS);
      } else {
        setClusters(MOCK_CLUSTERS);
      }
    } catch {
      setClusters(MOCK_CLUSTERS);
    } finally {
      setLoading(false);
    }
  };

  const selectedCluster = clusters.find(c => c.id === selected);

  return (
    <div className="h-full flex flex-col gap-3 p-4 overflow-hidden">
      <div className="shrink-0">
        <h2 className="font-mono text-lg font-bold text-white tracking-wider">SIMILAR SITES</h2>
        <p className="text-[11px] text-gray-500 font-mono">Cluster discovery and site similarity analysis</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 shrink-0 border-b border-gray-800/60 pb-1">
        {(['cluster', 'similar'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 text-xs font-mono font-bold rounded-t transition-colors ${
              activeTab === tab ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 border-b-0' : 'text-gray-500 hover:text-gray-300'
            }`}>
            {tab === 'cluster' ? 'Cluster View' : 'Similar Sites'}
          </button>
        ))}
      </div>

      <div className="flex flex-1 gap-3 min-h-0">
        {/* Left panel */}
        <div className="w-52 shrink-0 flex flex-col gap-3">
          <div className="glass-panel p-4">
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">Clustering</p>
            <label className="block text-[10px] font-mono text-gray-500 mb-1">Algorithm</label>
            <select value={clusterType} onChange={e => setClusterType(e.target.value)}
              className="w-full bg-[#020817] border border-gray-700/60 rounded px-2 py-1.5 text-[11px] font-mono text-gray-300 focus:outline-none focus:border-cyan-500/50 mb-3">
              {CLUSTER_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            <label className="block text-[10px] font-mono text-gray-500 mb-1">Min Cluster Size: {minCluster}</label>
            <input type="range" min={3} max={50} value={minCluster} onChange={e => setMinCluster(+e.target.value)}
              className="w-full accent-cyan-400 mb-3" />
            <button onClick={runClustering} disabled={loading}
              className="w-full py-2 btn-3d px-4 py-2 flex items-center justify-center gap-2 text-xs font-mono font-bold hover:bg-cyan-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />} Run Clustering
            </button>
          </div>

          {/* Cluster list */}
          <div className="flex-1 glass-panel overflow-hidden">
            <div className="px-3 py-2 border-b border-gray-800/60">
              <span className="text-[10px] font-mono font-bold text-gray-400">CLUSTERS ({clusters.length})</span>
            </div>
            <div className="overflow-y-auto h-full">
              {clusters.map(c => (
                <div key={c.id} onClick={() => setSelected(c.id === selected ? null : c.id)}
                  className={`px-3 py-2.5 cursor-pointer border-b border-gray-800/20 hover:bg-gray-800/30 transition-colors ${
                    selected === c.id ? 'bg-gray-800/40' : ''
                  }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                      <span className="text-[10px] font-mono text-gray-300 truncate max-w-[110px]">{c.label}</span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full" style={{ backgroundColor: c.color + '20', color: c.color }}>
                      {c.members}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center: scatter plot */}
        <div className="flex-1 glass-panel flex flex-col min-h-0">
          <div className="px-4 py-2.5 border-b border-gray-800/60 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] font-mono font-bold text-gray-300">EMBEDDING SPACE — {clusterType.toUpperCase()}</span>
            </div>
            {loading && <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />}
          </div>
          <div className="flex-1 p-4">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Grid */}
              {[20,40,60,80].map(v => (
                <React.Fragment key={v}>
                  <line x1={v} y1={0} x2={v} y2={100} stroke="#1f2937" strokeWidth="0.3" />
                  <line x1={0} y1={v} x2={100} y2={v} stroke="#1f2937" strokeWidth="0.3" />
                </React.Fragment>
              ))}
              {/* Convex hull approximations */}
              {clusters.map(c => (
                <circle key={c.id + '-hull'} cx={c.x} cy={c.y} r={Math.sqrt(c.members) * 2}
                  fill={c.color + '15'} stroke={c.color + '40'} strokeWidth="0.5"
                  className="cursor-pointer transition-all"
                  onClick={() => setSelected(c.id === selected ? null : c.id)} />
              ))}
              {/* Points */}
              {MOCK_POINTS.map((p, i) => (
                <circle key={i} cx={p.cx} cy={p.cy} r={p.r * 0.7}
                  fill={p.color} fillOpacity={0.7}
                  className="cursor-pointer hover:fill-opacity-100 transition-all" />
              ))}
              {/* Labels */}
              {clusters.map(c => (
                <text key={c.id + '-label'} x={c.x} y={c.y - Math.sqrt(c.members) * 2 - 1}
                  textAnchor="middle" fontSize="2.5" fill={c.color} fontFamily="monospace">
                  {c.label.split(' ').slice(0, 2).join(' ')}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Right: selected info */}
        {selectedCluster && (
          <div className="w-52 shrink-0 glass-panel p-4">
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">Cluster Detail</p>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedCluster.color }} />
              <span className="text-xs font-mono text-gray-200 font-bold">{selectedCluster.label}</span>
            </div>
            <div className="space-y-2">
              {[
                { label: 'ID', value: selectedCluster.id },
                { label: 'Members', value: selectedCluster.members.toString() },
                { label: 'Algorithm', value: clusterType },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[9px] font-mono text-gray-600 uppercase">{label}</p>
                  <p className="text-[11px] font-mono text-gray-300">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-800/60">
              <p className="text-[10px] font-mono text-gray-500 mb-2">Similar Sites</p>
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <Users className="w-3 h-3 text-gray-600" />
                  <span className="text-[10px] font-mono text-gray-400">Site #{String(i + 1).padStart(3, '0')}</span>
                  <span className="ml-auto text-[9px] font-mono" style={{ color: selectedCluster.color }}>{(0.95 - i * 0.05).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
