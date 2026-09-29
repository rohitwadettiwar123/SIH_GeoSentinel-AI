import React from 'react';
import {
  Satellite, Activity, HardDrive, Image, TrendingUp,
  MapPin, Clock, CheckCircle2, AlertCircle, Upload,
  Search, ArrowLeftRight
} from 'lucide-react';

const STATS = [
  { label: 'Total Scenes', value: '14,872', sub: '+312 this week', icon: Image, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  { label: 'Indexed Area', value: '2.4M km²', sub: 'GeoTIFF + COG', icon: MapPin, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { label: 'Recent Ingestions', value: '48', sub: 'Last 24 hours', icon: Upload, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { label: 'Storage Used', value: '1.87 TB', sub: '74% of 2.5 TB', icon: HardDrive, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
];

const ACTIVITY = [
  { time: '11:34', type: 'CHANGE_DETECT', location: 'AOI-Brahmaputra-07', status: 'complete', confidence: 0.94 },
  { time: '11:22', type: 'INGESTION', location: 'Sentinel-2A_2024_Q3.tif', status: 'complete', confidence: null },
  { time: '11:08', type: 'SEMANTIC_SEARCH', location: 'coastal erosion India', status: 'complete', confidence: 0.87 },
  { time: '10:55', type: 'CLUSTER', location: 'Regional cluster run #42', status: 'complete', confidence: null },
  { time: '10:41', type: 'CHANGE_DETECT', location: 'AOI-Ganges-Delta-02', status: 'pending', confidence: 0.76 },
  { time: '10:28', type: 'INGESTION', location: 'ISRO_ResourceSAT_202409.jp2', status: 'error', confidence: null },
  { time: '10:12', type: 'SEMANTIC_SEARCH', location: 'industrial expansion Bihar', status: 'complete', confidence: 0.91 },
  { time: '09:50', type: 'CHANGE_DETECT', location: 'AOI-Yamuna-04', status: 'complete', confidence: 0.89 },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  complete: { label: 'COMPLETE', color: 'text-green-400 bg-green-500/10 border-green-500/30', icon: CheckCircle2 },
  pending:  { label: 'PENDING',  color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',  icon: Clock },
  error:    { label: 'ERROR',    color: 'text-red-400 bg-red-500/10 border-red-500/30',          icon: AlertCircle },
};

const TYPE_COLOR: Record<string, string> = {
  CHANGE_DETECT:   'text-cyan-400',
  INGESTION:       'text-amber-400',
  SEMANTIC_SEARCH: 'text-violet-400',
  CLUSTER:         'text-emerald-400',
};

export default function DashboardPage() {
  return (
    <div className="h-full flex flex-col gap-4 p-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="font-mono text-lg font-bold text-white tracking-wider">MISSION DASHBOARD</h2>
          <p className="text-[11px] text-gray-500 font-mono mt-0.5">GeoSentinel AI — Satellite Intelligence Overview</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] font-mono text-gray-400">LIVE • {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3 shrink-0">
        {STATS.map(({ label, value, sub, icon: Icon, color, bg, border }) => (
          <div key={label} className={`${bg} border ${border} rounded-xl p-4 relative overflow-hidden backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] transition-all duration-300 before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none`}>
            <div className="absolute -right-4 -top-4 opacity-10">
              <Icon className={`w-24 h-24 ${color}`} />
            </div>
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{label}</p>
                <p className={`text-2xl font-mono font-bold ${color} mt-1 drop-shadow-[0_0_8px_currentColor]`}>{value}</p>
                <p className="text-[10px] text-gray-600 font-mono mt-1">{sub}</p>
              </div>
              <div className={`p-2 rounded-lg ${bg}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom: Activity + Mini chart area */}
      <div className="flex gap-3 flex-1 min-h-0">
        {/* Recent Activity */}
        <div className="flex-1 glass-panel flex flex-col min-h-0">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800/60 shrink-0">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono text-xs font-bold text-gray-300 tracking-wider">RECENT ACTIVITY</span>
            </div>
            <span className="text-[10px] font-mono text-gray-600">Last 2 hours</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800/40">
                  {['Time', 'Type', 'Location / Query', 'Confidence', 'Status'].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-[9px] font-mono font-bold text-gray-600 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ACTIVITY.map((row, i) => {
                  const s = STATUS_CONFIG[row.status];
                  const SIcon = s.icon;
                  return (
                    <tr key={i} className="border-b border-gray-800/20 hover:bg-gray-800/20 transition-colors">
                      <td className="px-4 py-2.5 text-[10px] font-mono text-gray-500">{row.time}</td>
                      <td className={`px-4 py-2.5 text-[10px] font-mono font-bold ${TYPE_COLOR[row.type] || 'text-gray-400'}`}>{row.type}</td>
                      <td className="px-4 py-2.5 text-[10px] font-mono text-gray-300 max-w-xs truncate">{row.location}</td>
                      <td className="px-4 py-2.5 text-[10px] font-mono text-gray-400">
                        {row.confidence !== null ? `${Math.round((row.confidence ?? 0) * 100)}%` : '—'}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[9px] font-mono font-bold ${s.color}`}>
                          <SIcon className="w-2.5 h-2.5" />
                          {s.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right mini-panel */}
        <div className="w-56 flex flex-col gap-3">
          <div className="glass-panel p-4 flex-1">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono text-xs font-bold text-gray-300">SENSOR MIX</span>
            </div>
            {[
              { label: 'Sentinel-2', pct: 52, color: 'bg-cyan-500' },
              { label: 'Landsat-9', pct: 28, color: 'bg-emerald-500' },
              { label: 'ISRO LISS', pct: 13, color: 'bg-violet-500' },
              { label: 'SAR',       pct: 7,  color: 'bg-amber-500' },
            ].map(({ label, pct, color }) => (
              <div key={label} className="mb-2">
                <div className="flex justify-between mb-0.5">
                  <span className="text-[10px] font-mono text-gray-500">{label}</span>
                  <span className="text-[10px] font-mono text-gray-400">{pct}%</span>
                </div>
                <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="glass-panel p-4">
            <div className="flex items-center gap-2 mb-3">
              <Satellite className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono text-xs font-bold text-gray-300">SYSTEM</span>
            </div>
            {[
              { label: 'Vector Index', val: 'ONLINE', color: 'text-green-400' },
              { label: 'FAISS Shards', val: '4 / 4', color: 'text-cyan-400' },
              { label: 'GPU Util',     val: '34%',    color: 'text-amber-400' },
              { label: 'API Latency',  val: '42 ms',  color: 'text-green-400' },
            ].map(({ label, val, color }) => (
              <div key={label} className="flex justify-between mb-1.5">
                <span className="text-[10px] font-mono text-gray-600">{label}</span>
                <span className={`text-[10px] font-mono font-bold ${color}`}>{val}</span>
              </div>
            ))}
          </div>
          
          <div className="glass-panel p-4 flex-1 flex flex-col gap-3">
            <p className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">Quick Actions</p>
            <button className="flex-1 btn-3d text-[10px] flex items-center justify-center gap-2">
              <Search className="w-3.5 h-3.5" /> Semantic Search
            </button>
            <button className="flex-1 btn-3d text-[10px] flex items-center justify-center gap-2">
              <Activity className="w-3.5 h-3.5" /> Start Analysis
            </button>
            <button className="flex-1 btn-3d text-[10px] flex items-center justify-center gap-2">
              <Upload className="w-3.5 h-3.5" /> Ingest Imagery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
