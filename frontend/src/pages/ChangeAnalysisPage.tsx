import React, { useState } from 'react';
import { ArrowLeftRight, Calendar, Map, AlertTriangle, CheckCircle2, Clock, ChevronRight } from 'lucide-react';

const API_BASE = (import.meta.env.VITE_API_URL as string)?.replace('/api', '') || 'http://127.0.0.1:8000';

const AREAS = ['Brahmaputra Valley', 'Ganges Delta', 'Sundarbans', 'Chilika Lake', 'Bihar Flood Plain', 'Himalayan Foothills'];

const AOI_IMAGES: Record<string, { before: string, after: string }> = {
  'Brahmaputra Valley':  { before: '/uploads/brahmaputra_before.jpg',  after: '/uploads/brahmaputra_after.jpg' },
  'Ganges Delta':        { before: '/uploads/ganges_before.jpg', after: '/uploads/ganges_after.jpg' },
  'Sundarbans':          { before: '/uploads/sundarbans_before.jpg',   after: '/uploads/sundarbans_after.jpg' },
  'Chilika Lake':        { before: '/uploads/chilika_before.jpg', after: '/uploads/chilika_after.jpg' },
  'Bihar Flood Plain':   { before: '/uploads/bihar_before.jpg',     after: '/uploads/bihar_after.jpg' },
  'Himalayan Foothills': { before: '/uploads/himalayan_before.jpg', after: '/uploads/himalayan_after.jpg' },
};

const SENSORS = ['Sentinel-2 L2A', 'Landsat-9', 'ISRO LISS-IV', 'Sentinel-1 SAR'];
const CHANGE_TYPES = [
  { id: 'construction', label: 'Construction', color: 'text-amber-400', hex: '#fbbf24' },
  { id: 'water',        label: 'Water Change', color: 'text-cyan-400', hex: '#22d3ee' },
  { id: 'vegetation',  label: 'Vegetation Loss', color: 'text-green-400', hex: '#4ade80' },
  { id: 'road',        label: 'Road Development', color: 'text-violet-400', hex: '#a78bfa' },
];

const TIMELINE_EVENTS = [
  { date: 'Jul 2024', label: 'Baseline Capture', color: 'bg-gray-500', type: 'baseline' },
  { date: 'Aug 2024', label: 'Water Change +14%', color: 'bg-cyan-500', type: 'change' },
  { date: 'Aug 2024', label: 'Vegetation Loss', color: 'bg-green-500', type: 'change' },
  { date: 'Sep 2024', label: 'Construction Begin', color: 'bg-amber-500', type: 'change' },
  { date: 'Sep 2024', label: 'Current Image', color: 'bg-red-500', type: 'current' },
];

export default function ChangeAnalysisPage() {
  const [aoi, setAoi] = useState(AREAS[0]);
  const [sensor, setSensor] = useState(SENSORS[0]);
  const [dateBefore, setDateBefore] = useState('2024-07-15');
  const [dateAfter, setDateAfter] = useState('2024-09-12');
  const [timeRange, setTimeRange] = useState(75);
  const [changeTypes, setChangeTypes] = useState<string[]>(['construction', 'water']);
  const [detected, setDetected] = useState(false);
  const [loading, setLoading] = useState(false);

  // AOI Drawing State
  const [showAoiModal, setShowAoiModal] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState({ x: 0, y: 0 });
  const [drawEnd, setDrawEnd] = useState({ x: 0, y: 0 });
  const [hasAoi, setHasAoi] = useState(false);

  const toggleChange = (id: string) =>
    setChangeTypes(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const activeTypes = changeTypes.map(id => CHANGE_TYPES.find(c => c.id === id)).filter(Boolean) as typeof CHANGE_TYPES;
  let accumulatedPercent = 0;
  const pieSlices = activeTypes.map((type, i) => {
      const percentage = i === activeTypes.length - 1 ? 100 - accumulatedPercent : Math.floor(100 / activeTypes.length);
      const start = accumulatedPercent;
      accumulatedPercent += percentage;
      return { ...type, percentage, start, end: accumulatedPercent };
  });
  const conicString = activeTypes.length > 0 ? pieSlices.map(s => `${s.hex} ${s.start}% ${s.end}%`).join(', ') : 'transparent 0% 100%';

  return (
    <div className="h-full flex flex-col gap-3 p-4 overflow-hidden">
      <div className="shrink-0">
        <h2 className="font-mono text-lg font-bold text-white tracking-wider">CHANGE ANALYSIS</h2>
        <p className="text-[11px] text-gray-500 font-mono">Bi-temporal change detection across satellite imagery</p>
      </div>

      <div className="flex flex-1 gap-3 min-h-0">
        {/* Left controls */}
        <div className="w-60 shrink-0 flex flex-col gap-3">
          <div className="glass-panel p-4">
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">Configuration</p>

            <label className="block text-[10px] font-mono text-gray-500 mb-1">Area of Interest</label>
            <select value={aoi} onChange={e => setAoi(e.target.value)}
              className="w-full bg-[#020817] border border-gray-700/60 rounded px-2 py-1.5 text-[11px] font-mono text-gray-300 focus:outline-none focus:border-cyan-500/50 mb-3">
              {AREAS.map(a => <option key={a}>{a}</option>)}
            </select>

            <label className="block text-[10px] font-mono text-gray-500 mb-1">Sensor</label>
            <select value={sensor} onChange={e => setSensor(e.target.value)}
              className="w-full bg-[#020817] border border-gray-700/60 rounded px-2 py-1.5 text-[11px] font-mono text-gray-300 focus:outline-none focus:border-cyan-500/50 mb-3">
              {SENSORS.map(s => <option key={s}>{s}</option>)}
            </select>

            <label className="block text-[10px] font-mono text-gray-500 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Before Date</label>
            <input type="date" value={dateBefore} onChange={e => setDateBefore(e.target.value)}
              className="w-full bg-[#020817] border border-gray-700/60 rounded px-2 py-1.5 text-[11px] font-mono text-gray-300 focus:outline-none focus:border-cyan-500/50 mb-3" />

            <label className="block text-[10px] font-mono text-gray-500 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> After Date</label>
            <input type="date" value={dateAfter} onChange={e => setDateAfter(e.target.value)}
              className="w-full bg-[#020817] border border-gray-700/60 rounded px-2 py-1.5 text-[11px] font-mono text-gray-300 focus:outline-none focus:border-cyan-500/50 mb-3" />

            <button 
              onClick={() => setShowAoiModal(true)}
              className={`w-full py-2 mt-1 btn-3d px-4 py-2 flex items-center justify-center gap-2 text-xs font-mono font-bold transition-colors ${hasAoi ? 'border-cyan-500 text-cyan-400 bg-cyan-500/20' : 'hover:bg-cyan-500/30'}`}
            >
              <Map className="w-3.5 h-3.5" /> {hasAoi ? 'AOI DEFINED' : 'DRAW AOI'}
            </button>
          </div>

          <div className="glass-panel p-4">
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">Time Range</p>
            <input type="range" min={0} max={100} value={timeRange} onChange={e => setTimeRange(+e.target.value)}
              className="w-full accent-cyan-400 mb-1" />
            <div className="flex justify-between text-[9px] font-mono text-gray-600">
              <span>Jan 2024</span><span>Dec 2024</span>
            </div>
          </div>

          <div className="glass-panel p-4">
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">Change Types</p>
            {CHANGE_TYPES.map(ct => (
              <label key={ct.id} className="flex items-center gap-2 mb-2 cursor-pointer">
                <input type="checkbox" checked={changeTypes.includes(ct.id)} onChange={() => toggleChange(ct.id)}
                  className="accent-cyan-400 w-3 h-3" />
                <span className={`text-[11px] font-mono ${ct.color}`}>{ct.label}</span>
              </label>
            ))}
          </div>

          <button
            onClick={() => {
              setLoading(true);
              setDetected(false);
              setTimeout(() => {
                setLoading(false);
                setDetected(true);
              }, 1500);
            }}
            disabled={loading}
            className="py-2 btn-3d px-4 py-2 flex items-center justify-center gap-2 text-xs font-mono font-bold hover:bg-cyan-500/30 transition-colors disabled:opacity-50"
          >
            {loading ? <Clock className="w-3.5 h-3.5 animate-spin" /> : '▶'} {loading ? 'ANALYZING...' : 'RUN ANALYSIS'}
          </button>
        </div>

        {/* Right: results */}
        <div className="flex-1 flex flex-col gap-3 min-h-0">
          {/* Before / After images */}
          <div className="flex gap-3 shrink-0">
            {['BEFORE — ' + dateBefore, 'AFTER — ' + dateAfter].map((label, i) => {
              const imgData = AOI_IMAGES[aoi] || { before: '/uploads/demo_image.png', after: '/uploads/demo_image.png' };
              const imgSrc = `${API_BASE}${i === 0 ? imgData.before : imgData.after}`;
              
              return (
              <div key={i} className="flex-1 glass-panel overflow-hidden">
                <div className="px-3 py-2 border-b border-gray-800/60 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-gray-400">{label}</span>
                  <span className="text-[9px] font-mono text-gray-600">{sensor}</span>
                </div>
                <div className="h-44 bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 flex items-center justify-center relative overflow-hidden group">
                  <img src={imgSrc} alt={label} className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${loading ? 'opacity-20 scale-105' : 'opacity-80 group-hover:opacity-100 group-hover:scale-105'}`} />
                  
                  {loading && (
                    <div className="absolute inset-0 bg-cyan-500/10 flex items-center justify-center backdrop-blur-sm z-10">
                       <div className="flex flex-col items-center gap-2">
                         <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                         <span className="text-[10px] font-mono text-cyan-400 animate-pulse">EXTRACTING FEATURES...</span>
                       </div>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 opacity-10 pointer-events-none z-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,240,255,0.1) 10px, rgba(0,240,255,0.1) 11px)' }} />
                  
                  {!loading && detected && i === 1 && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-red-500/80 backdrop-blur-md border border-red-400 rounded text-[10px] font-mono font-bold text-white flex items-center gap-1 shadow-[0_0_15px_rgba(239,68,68,0.5)] z-30 animate-pulse">
                      <AlertTriangle className="w-3 h-3" /> CHANGE DETECTED
                    </div>
                  )}
                  
                  {!loading && detected && i === 1 && (
                    <div className="absolute bottom-[20%] right-[20%] w-24 h-24 border-2 border-red-500 bg-red-500/10 rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.4)] z-30 flex items-center justify-center">
                       <div className="w-2 h-2 bg-red-400 rounded-full animate-ping" />
                    </div>
                  )}
                </div>
              </div>
            )})}
          </div>

          {/* Change Details + Timeline */}
          <div className="flex gap-3 flex-1 min-h-0">
            {detected && !loading && (
              <div className="w-56 shrink-0 glass-panel p-4">
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">Change Details</p>
                {[
                  { label: 'Type', value: changeTypes.length > 0 ? changeTypes.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(' + ') : 'None', color: 'text-amber-400' },
                  { label: 'Confidence', value: '94.2%', color: 'text-green-400' },
                  { label: 'Affected Area', value: '5.04 km²', color: 'text-cyan-400' },
                  { label: 'Earliest Detect', value: 'Aug 12, 2024', color: 'text-gray-300' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="mb-3">
                    <p className="text-[9px] font-mono text-gray-600 uppercase">{label}</p>
                    <p className={`text-xs font-mono font-bold ${color}`}>{value}</p>
                  </div>
                ))}
                <div className="mt-2 pt-3 border-t border-gray-800/60">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-green-400" />
                    <span className="text-[10px] font-mono text-green-400 font-bold">CONFIRMED</span>
                  </div>
                </div>
              </div>
            )}

            {/* Analysis Results / Pie Chart */}
            <div className="flex-1 glass-panel p-4 flex flex-col">
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4 shrink-0">Analysis Composition</p>
              
              {!detected && !loading && (
                <div className="flex-1 flex flex-col items-center justify-center opacity-50">
                  <div className="w-24 h-24 rounded-full border-4 border-dashed border-gray-700 mb-4 animate-[spin_4s_linear_infinite]" />
                  <p className="text-[10px] font-mono text-gray-500">Awaiting analysis results...</p>
                </div>
              )}
              
              {loading && (
                 <div className="flex-1 flex flex-col items-center justify-center">
                   <div className="relative w-24 h-24">
                     <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full" />
                     <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                   </div>
                   <p className="text-[10px] font-mono text-cyan-400 mt-4 animate-pulse">GENERATING DISTRIBUTION...</p>
                 </div>
              )}
              
              {detected && !loading && (
                <div className="flex-1 flex items-center justify-center gap-8">
                  {/* Pie Chart using conic-gradient */}
                  {activeTypes.length > 0 ? (
                    <div className="relative flex shrink-0">
                      <div 
                        className="w-32 h-32 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-1000"
                        style={{ background: `conic-gradient(${conicString})` }}
                      />
                      {/* Inner circle for donut hole */}
                      <div className="absolute inset-0 m-auto w-20 h-20 bg-[#050b18] rounded-full flex flex-col items-center justify-center border border-gray-800/50 shadow-inner">
                        <span className="text-[10px] font-mono text-gray-500">CHANGED</span>
                        <span className="text-sm font-mono font-bold text-white">45%</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full border-4 border-gray-800 flex items-center justify-center bg-gray-900/50">
                      <span className="text-[10px] font-mono text-gray-500">NO CHANGE</span>
                    </div>
                  )}
                  
                  {/* Legend */}
                  <div className="flex flex-col gap-2">
                    {activeTypes.length > 0 ? pieSlices.map(s => (
                      <div key={s.id} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: s.hex }} />
                        <div>
                          <p className="text-[11px] font-mono text-gray-200">{s.label}</p>
                          <p className="text-[9px] font-mono text-gray-500">{s.percentage}% of detected change</p>
                        </div>
                      </div>
                    )) : (
                      <p className="text-[10px] font-mono text-gray-500">No change categories selected.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* AOI Drawing Modal */}
      {showAoiModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
          <div className="glass-panel w-full max-w-5xl h-[80vh] flex flex-col border border-cyan-500/30 overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.1)]">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#050b18]">
              <div>
                <h3 className="font-mono text-cyan-400 font-bold text-sm tracking-wider flex items-center gap-2">
                  <Map className="w-4 h-4" /> DEFINE AREA OF INTEREST: {aoi}
                </h3>
                <p className="text-[10px] text-gray-500 font-mono mt-1">Click and drag on the image to draw a bounding box.</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => { setHasAoi(false); setShowAoiModal(false); }}
                  className="px-4 py-1.5 border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 text-xs font-mono rounded transition-colors"
                >
                  CANCEL
                </button>
                <button 
                  onClick={() => setShowAoiModal(false)}
                  className="px-4 py-1.5 bg-cyan-500/20 border border-cyan-500 text-cyan-400 hover:bg-cyan-500/30 text-xs font-mono font-bold rounded transition-colors"
                >
                  CONFIRM AOI
                </button>
              </div>
            </div>
            <div 
              className="flex-1 relative cursor-crosshair overflow-hidden"
              onPointerDown={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                setDrawStart({ x, y });
                setDrawEnd({ x, y });
                setIsDrawing(true);
                setHasAoi(false);
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                if (!isDrawing) return;
                const rect = e.currentTarget.getBoundingClientRect();
                setDrawEnd({ x: e.clientX - rect.left, y: e.clientY - rect.top });
              }}
              onPointerUp={() => {
                if (isDrawing) {
                  setIsDrawing(false);
                  setHasAoi(true);
                }
              }}
            >
              <img 
                src={`${API_BASE}${(AOI_IMAGES[aoi] || { before: '/uploads/demo_image.png' }).before}`} 
                className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none" 
                alt="map"
                draggable={false}
              />
              <div className="absolute inset-0 bg-cyan-900/10 pointer-events-none mix-blend-overlay" />
              
              {(isDrawing || hasAoi) && (
                <div 
                  className="absolute border-2 border-cyan-400 bg-cyan-400/20 shadow-[0_0_15px_rgba(0,240,255,0.4)] pointer-events-none"
                  style={{
                    left: Math.min(drawStart.x, drawEnd.x),
                    top: Math.min(drawStart.y, drawEnd.y),
                    width: Math.abs(drawEnd.x - drawStart.x),
                    height: Math.abs(drawEnd.y - drawStart.y),
                  }}
                >
                  <div className="absolute -top-6 left-0 bg-cyan-500/90 text-black px-1.5 py-0.5 text-[9px] font-mono font-bold whitespace-nowrap">
                    {Math.abs(drawEnd.x - drawStart.x).toFixed(0)}x{Math.abs(drawEnd.y - drawStart.y).toFixed(0)} px
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
