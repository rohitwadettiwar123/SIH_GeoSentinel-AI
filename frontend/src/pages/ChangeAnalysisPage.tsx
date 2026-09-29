import React, { useState } from 'react';
import { ArrowLeftRight, Calendar, Map, AlertTriangle, CheckCircle2, Clock, ChevronRight } from 'lucide-react';

const AREAS = ['Brahmaputra Valley', 'Ganges Delta', 'Sundarbans', 'Chilika Lake', 'Bihar Flood Plain', 'Himalayan Foothills'];
const SENSORS = ['Sentinel-2 L2A', 'Landsat-9', 'ISRO LISS-IV', 'Sentinel-1 SAR'];
const CHANGE_TYPES = [
  { id: 'construction', label: 'Construction', color: 'text-amber-400' },
  { id: 'water',        label: 'Water Change', color: 'text-cyan-400' },
  { id: 'vegetation',  label: 'Vegetation Loss', color: 'text-green-400' },
  { id: 'road',        label: 'Road Development', color: 'text-violet-400' },
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
  const [detected, setDetected] = useState(true);

  const toggleChange = (id: string) =>
    setChangeTypes(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

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

            <button className="w-full py-2 mt-1 btn-3d px-4 py-2 flex items-center justify-center gap-2 text-xs font-mono font-bold hover:bg-cyan-500/30 transition-colors flex items-center justify-center gap-2">
              <Map className="w-3.5 h-3.5" /> Draw AOI
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
            onClick={() => setDetected(true)}
            className="py-2 btn-3d px-4 py-2 flex items-center justify-center gap-2 text-xs font-mono font-bold hover:bg-cyan-500/30 transition-colors"
          >
            ▶ RUN ANALYSIS
          </button>
        </div>

        {/* Right: results */}
        <div className="flex-1 flex flex-col gap-3 min-h-0">
          {/* Before / After images */}
          <div className="flex gap-3 shrink-0">
            {['BEFORE — ' + dateBefore, 'AFTER — ' + dateAfter].map((label, i) => (
              <div key={i} className="flex-1 glass-panel overflow-hidden">
                <div className="px-3 py-2 border-b border-gray-800/60 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-gray-400">{label}</span>
                  <span className="text-[9px] font-mono text-gray-600">{sensor}</span>
                </div>
                <div className="h-44 bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 flex items-center justify-center relative">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,240,255,0.1) 10px, rgba(0,240,255,0.1) 11px)' }} />
                  <span className="text-xs font-mono text-gray-700">{aoi}</span>
                  {detected && i === 1 && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-red-500/20 border border-red-500/50 rounded text-[10px] font-mono font-bold text-red-400 flex items-center gap-1 animate-pulse">
                      <AlertTriangle className="w-3 h-3" /> CHANGE DETECTED
                    </div>
                  )}
                  {detected && i === 1 && (
                    <div className="absolute bottom-2 right-2 w-16 h-16 border-2 border-red-400/60 rounded opacity-70" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Change Details + Timeline */}
          <div className="flex gap-3 flex-1 min-h-0">
            {detected && (
              <div className="w-56 shrink-0 glass-panel p-4">
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">Change Details</p>
                {[
                  { label: 'Type', value: 'Construction + Water', color: 'text-amber-400' },
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

            {/* Timeline */}
            <div className="flex-1 glass-panel p-4">
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4">Event Timeline</p>
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-800" />
                {TIMELINE_EVENTS.map((ev, i) => (
                  <div key={i} className="flex items-start gap-3 mb-4 relative">
                    <div className={`w-6 h-6 rounded-full ${ev.color} flex items-center justify-center shrink-0 z-10`}>
                      {ev.type === 'current' ? <AlertTriangle className="w-3 h-3 text-white" /> :
                       ev.type === 'baseline' ? <Clock className="w-3 h-3 text-white" /> :
                       <ChevronRight className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-gray-600">{ev.date}</p>
                      <p className="text-[11px] font-mono text-gray-300">{ev.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
