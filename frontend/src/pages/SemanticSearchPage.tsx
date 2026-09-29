import React, { useState } from 'react';
import { Search, Filter, Calendar, Cpu, Star, Loader2, Image as ImageIcon, MapPin } from 'lucide-react';

const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://127.0.0.1:8000/api';

const SENSORS = ['All Sensors', 'Sentinel-2', 'Landsat-9', 'ISRO LISS-IV', 'SAR/Radar', 'Planet Labs'];
const AREAS = ['Global', 'South Asia', 'India — Eastern', 'India — Western', 'Bay of Bengal', 'Himalayan Region', 'Coastal India'];

const MOCK_RESULTS = [
  { id: 'SC-20240912-001', date: '2024-09-12', sensor: 'Sentinel-2', score: 0.97, region: 'Brahmaputra Valley', cloud: 8 },
  { id: 'SC-20240903-042', date: '2024-09-03', sensor: 'Landsat-9',  score: 0.93, region: 'Ganges Delta', cloud: 12 },
  { id: 'SC-20240825-017', date: '2024-08-25', sensor: 'Sentinel-2', score: 0.91, region: 'Yamuna Flood Plain', cloud: 5 },
  { id: 'SC-20240818-009', date: '2024-08-18', sensor: 'ISRO LISS',  score: 0.88, region: 'Sundarbans', cloud: 22 },
  { id: 'SC-20240811-033', date: '2024-08-11', sensor: 'Sentinel-2', score: 0.85, region: 'Chilika Lake', cloud: 3 },
  { id: 'SC-20240730-021', date: '2024-07-30', sensor: 'Landsat-9',  score: 0.83, region: 'Kaveri Delta', cloud: 18 },
  { id: 'SC-20240722-055', date: '2024-07-22', sensor: 'SAR/Radar',  score: 0.80, region: 'Bihar Flood Region', cloud: 0 },
  { id: 'SC-20240714-008', date: '2024-07-14', sensor: 'Sentinel-2', score: 0.78, region: 'Mahanadi Basin', cloud: 31 },
];

interface SearchResult {
  id: string;
  date: string;
  sensor: string;
  score: number;
  region: string;
  cloud: number;
}

export default function SemanticSearchPage() {
  const [query, setQuery] = useState('');
  const [aoi, setAoi] = useState('Global');
  const [sensor, setSensor] = useState('All Sensors');
  const [dateFrom, setDateFrom] = useState('2024-01-01');
  const [dateTo, setDateTo] = useState('2024-12-31');
  const [results, setResults] = useState<SearchResult[]>(MOCK_RESULTS);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const reqBody = {
        query,
        filters: { aoi, sensor, dateFrom, dateTo },
        top_k: 8
      };
      const res = await fetch(`${API_BASE}/v1/search/text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody)
      });
      if (res.ok) {
        const data = await res.json();
        setResults(Array.isArray(data?.data?.hits) && data.data.hits.length > 0 ? data.data.hits : MOCK_RESULTS);
      } else {
        setResults(MOCK_RESULTS);
      }
    } catch {
      setResults(MOCK_RESULTS);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s: number) => s >= 0.9 ? 'text-green-400 bg-green-500/10 border-green-500/30' : s >= 0.8 ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' : 'text-amber-400 bg-amber-500/10 border-amber-500/30';

  return (
    <div className="h-full flex flex-col gap-3 p-4 overflow-hidden">
      {/* Header */}
      <div className="shrink-0">
        <h2 className="font-mono text-lg font-bold text-white tracking-wider">SEMANTIC SEARCH</h2>
        <p className="text-[11px] text-gray-500 font-mono">Natural-language search across indexed satellite imagery</p>
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
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 py-2 btn-3d px-4 py-2 flex items-center justify-center gap-2-lg text-xs font-mono font-bold hover:bg-cyan-500/30 transition-colors disabled:opacity-50 flex items-center gap-2"
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
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-4 gap-3">
          {results.map(r => (
            <div
              key={r.id}
              onClick={() => setSelected(r.id === selected ? null : r.id)}
              className={`bg-[#050b18] border rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
                selected === r.id ? 'border-cyan-500/60 ring-1 ring-cyan-500/30' : 'border-gray-800/60 hover:border-gray-700'
              }`}
            >
              {/* Thumbnail placeholder */}
              <div className="h-28 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(0,240,255,0.08) 8px, rgba(0,240,255,0.08) 9px)' }} />
                <ImageIcon className="w-8 h-8 text-gray-700" />
                <span className={`absolute top-2 right-2 px-1.5 py-0.5 rounded border text-[9px] font-mono font-bold ${scoreColor(r.score)}`}>
                  {Math.round(r.score * 100)}%
                </span>
                <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/60 rounded text-[9px] font-mono text-gray-400">{r.sensor}</span>
              </div>
              <div className="p-3">
                <p className="text-[10px] font-mono font-bold text-gray-300 truncate">{r.id}</p>
                <p className="text-[10px] font-mono text-cyan-400 mt-0.5">{r.region}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-[9px] font-mono text-gray-600">{r.date}</span>
                  <span className="text-[9px] font-mono text-gray-600">{r.cloud}% cloud</span>
                </div>
                <div className="mt-1.5 flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 text-amber-400" />
                  <span className={`text-[9px] font-mono font-bold ${scoreColor(r.score).split(' ')[0]}`}>Score: {r.score.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
