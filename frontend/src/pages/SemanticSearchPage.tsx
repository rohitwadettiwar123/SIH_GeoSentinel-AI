import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Cpu, Star, Loader2, Image as ImageIcon, MapPin, Target, ArrowLeftRight, Globe2, Activity } from 'lucide-react';

const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://127.0.0.1:8000/api';

const SENSORS = ['All Sensors', 'Sentinel-1 SAR', 'Sentinel-2', 'Landsat-9', 'ISRO LISS-IV', 'Planet Labs'];
const AREAS = ['Global', 'South Asia', 'India — Eastern', 'India — Western', 'Bay of Bengal', 'Himalayan Region', 'Coastal India'];

interface SearchResult {
  tile_id: string;
  date: string;
  sensor: string;
  scores: {
    semantic: number;
  };
  region?: string;
  cloud?: number;
  thumb?: string;
}

export default function SemanticSearchPage({ setActivePage }: { setActivePage: (p: string) => void }) {
  const [query, setQuery] = useState('');
  const [aoi, setAoi] = useState('Global');
  const [sensor, setSensor] = useState('All Sensors');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<any>(null);

  // Check health on load
  useEffect(() => {
    fetch(`${API_BASE}/v1/search/health`)
      .then(res => res.json())
      .then(data => setStatus(data))
      .catch(console.error);
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const filters: any = {};
      if (aoi !== 'Global') filters.aoi = aoi;
      if (sensor !== 'All Sensors') filters.sensor = sensor;
      if (dateFrom) filters.dateFrom = dateFrom;
      if (dateTo) filters.dateTo = dateTo;

      const reqBody = {
        query,
        filters,
        top_k: 20
      };
      const res = await fetch(`${API_BASE}/v1/search/text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody)
      });
      if (res.ok) {
        const data = await res.json();
        setResults(Array.isArray(data?.data?.hits) ? data.data.hits : []);
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
      setSelected(null);
    }
  };

  const handleImageSearch = async (file: File) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch(`${API_BASE}/v1/search/image?top_k=20`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setResults(Array.isArray(data?.data?.hits) ? data.data.hits : []);
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
      setSelected(null);
    }
  };

  const handleBuildIndex = async () => {
    try {
      await fetch(`${API_BASE}/search/semantic/rebuild`, { method: 'POST' });
      alert("Index build started. Check terminal.");
    } catch (e) {
      console.error(e);
    }
  };

  const scoreColor = (s: number) => s >= 0.9 ? 'text-green-400 bg-green-500/10 border-green-500/30' : s >= 0.8 ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' : 'text-amber-400 bg-amber-500/10 border-amber-500/30';

  return (
    <div className="h-full flex flex-col gap-3 p-4 overflow-hidden relative">
      {/* Header */}
      <div className="flex justify-between items-start shrink-0">
        <div>
          <h2 className="font-mono text-lg font-bold text-white tracking-wider">SEMANTIC SEARCH</h2>
          <p className="text-[11px] text-gray-500 font-mono">Natural-language and Image-to-Image search across indexed satellite imagery</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-[9px] font-mono text-right">
            <p className="text-gray-500 mb-1">ENGINE STATUS</p>
            {status ? (
              <div className="flex items-center gap-1.5 justify-end">
                <div className={`w-1.5 h-1.5 rounded-full ${status.status === 'ready' ? 'bg-green-500' : 'bg-amber-500'}`} />
                <span className={status.status === 'ready' ? 'text-green-400' : 'text-amber-400'}>
                  {status.status.toUpperCase()}
                </span>
                <span className="text-gray-600 ml-2">[{status.indexed_items} tiles]</span>
              </div>
            ) : (
              <span className="text-gray-600">Checking...</span>
            )}
          </div>
          {status?.status !== 'ready' && (
             <button onClick={handleBuildIndex} className="btn-3d px-3 py-1.5 text-[9px] text-amber-400 border-amber-500/30 hover:bg-amber-500/10">
               BUILD INDEX
             </button>
          )}
        </div>
      </div>

      {/* Search bar */}
      <div className="shrink-0 glass-panel p-4">
        <div className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. coastal erosion near river delta post-monsoon …"
              className="w-full bg-[#020817] border border-gray-700/60 rounded-lg pl-10 pr-4 py-2.5 text-xs font-mono text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-colors"
            />
          </div>
          
          <div className="relative">
             <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" title="Upload Image for Similarity Search"
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageSearch(e.target.files[0]);
                  }
                }}
             />
             <button className="btn-3d px-4 py-2 flex items-center justify-center gap-2 text-xs font-mono hover:bg-cyan-500/10 transition-colors border border-gray-700/60 text-gray-300">
               <ImageIcon className="w-3.5 h-3.5" />
               IMAGE SEARCH
             </button>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="btn-3d px-4 py-2 flex items-center justify-center gap-2 text-xs font-mono font-bold hover:bg-cyan-500/30 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            SEARCH
          </button>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-gray-500" />
            <select value={aoi} onChange={e => setAoi(e.target.value)}
              className="bg-[#020817] border border-gray-700/60 rounded px-2 py-1.5 text-[11px] font-mono text-gray-300 focus:outline-none focus:border-cyan-500/50">
              {AREAS.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              className="bg-[#020817] border border-gray-700/60 rounded px-2 py-1.5 text-[11px] font-mono text-gray-300 focus:outline-none focus:border-cyan-500/50" />
            <span className="text-gray-600 text-xs">—</span>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
              className="bg-[#020817] border border-gray-700/60 rounded px-2 py-1.5 text-[11px] font-mono text-gray-300 focus:outline-none focus:border-cyan-500/50" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <select value={sensor} onChange={e => setSensor(e.target.value)}
              className="bg-[#020817] border border-gray-700/60 rounded px-2 py-1.5 text-[11px] font-mono text-gray-300 focus:outline-none focus:border-cyan-500/50">
              {SENSORS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Results grid */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Results</span>
        <span className="text-[10px] font-mono text-cyan-400 font-bold">{results.length} scenes</span>
        {loading && <Loader2 className="w-3 h-3 text-cyan-400 animate-spin" />}
      </div>
      
      {!loading && results.length === 0 && query && (
        <div className="flex-1 flex flex-col items-center justify-center opacity-50">
          <Search className="w-8 h-8 text-gray-600 mb-2" />
          <p className="text-[10px] font-mono text-gray-500">No semantically relevant imagery found. Try broader filters.</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-trace-scroll pr-2 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {results.map((r, idx) => (
            <div
              key={r.tile_id}
              onClick={() => setSelected(r.tile_id === selected ? null : r.tile_id)}
              className={`bg-[#050b18] border rounded-xl overflow-hidden cursor-pointer transition-all duration-200 flex flex-col ${
                selected === r.tile_id ? 'border-cyan-500/60 ring-1 ring-cyan-500/30' : 'border-gray-800/60 hover:border-gray-700'
              }`}
            >
              <div className="h-28 bg-[#020817] relative flex items-center justify-center group overflow-hidden shrink-0">
                {r.thumb ? (
                  <img src={`${API_BASE.replace(/\/api\/?$/, '')}${r.thumb}`} alt="Satellite Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-700" />
                )}
                <span className={`absolute top-2 right-2 px-1.5 py-0.5 rounded border text-[9px] font-mono font-bold shadow-lg ${scoreColor(r.scores.semantic)}`}>
                  {(r.scores.semantic * 100).toFixed(1)}%
                </span>
                <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/80 rounded border border-gray-700/50 text-[9px] font-mono text-gray-400">
                  {r.sensor}
                </span>
                <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/80 rounded text-[9px] font-mono text-white border border-gray-700/50">
                  #{idx + 1}
                </span>
              </div>
              <div className="p-3 flex flex-col flex-1">
                <p className="text-[10px] font-mono font-bold text-gray-300 truncate" title={r.tile_id}>{r.tile_id}</p>
                <p className="text-[10px] font-mono text-cyan-400 mt-0.5 truncate">{r.region || 'Unknown Location'}</p>
                <div className="flex justify-between mt-2 mt-auto pt-2">
                  <span className="text-[9px] font-mono text-gray-600">{r.date}</span>
                  <span className="text-[9px] font-mono text-gray-600">{r.cloud !== undefined ? `${r.cloud}% cloud` : ''}</span>
                </div>
              </div>
              
              {/* Action Bar when selected */}
              {selected === r.tile_id && (
                <div className="bg-[#020817] border-t border-cyan-500/20 p-2 grid grid-cols-2 gap-1 shrink-0">
                  <button onClick={(e) => { e.stopPropagation(); setActivePage?.('tactical'); }} className="flex flex-col items-center justify-center gap-1 p-1.5 rounded hover:bg-cyan-500/10 text-cyan-400/80 hover:text-cyan-400 transition-colors">
                    <Target className="w-3.5 h-3.5" />
                    <span className="text-[8px] font-mono">ANALYZE</span>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setActivePage?.('change'); }} className="flex flex-col items-center justify-center gap-1 p-1.5 rounded hover:bg-amber-500/10 text-amber-400/80 hover:text-amber-400 transition-colors">
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span className="text-[8px] font-mono">COMPARE</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
