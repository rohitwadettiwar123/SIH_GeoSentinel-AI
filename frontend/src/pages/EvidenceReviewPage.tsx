import React, { useState } from 'react';
import { ShieldCheck, Filter, Eye, CheckCircle, XCircle, FileText, Search, Image as ImageIcon, ChevronDown } from 'lucide-react';

const CHANGE_TYPES = ['All', 'Construction', 'Water Change', 'Vegetation Loss', 'Road Development', 'Flood Inundation'];
const STATUSES = ['All', 'CONFIRMED', 'PENDING', 'REJECTED'];
const LOCATIONS = ['All Regions', 'Brahmaputra Valley', 'Ganges Delta', 'Sundarbans', 'Bihar', 'Coastal India'];

const EVIDENCE_DATA = [
  { id: 'EVD-00142', changeType: 'Construction',    confidence: 0.96, status: 'CONFIRMED', location: 'Brahmaputra Valley', date: '2024-09-12', area: '5.04 km²' },
  { id: 'EVD-00141', changeType: 'Water Change',    confidence: 0.88, status: 'PENDING',   location: 'Ganges Delta',       date: '2024-09-10', area: '3.21 km²' },
  { id: 'EVD-00140', changeType: 'Vegetation Loss', confidence: 0.74, status: 'PENDING',   location: 'Sundarbans',         date: '2024-09-08', area: '1.87 km²' },
  { id: 'EVD-00139', changeType: 'Road Development',confidence: 0.91, status: 'CONFIRMED', location: 'Bihar',             date: '2024-09-05', area: '0.43 km²' },
  { id: 'EVD-00138', changeType: 'Flood Inundation',confidence: 0.98, status: 'CONFIRMED', location: 'Bihar',             date: '2024-09-02', area: '7.00 km²' },
  { id: 'EVD-00137', changeType: 'Construction',    confidence: 0.62, status: 'REJECTED',  location: 'Coastal India',     date: '2024-08-28', area: '2.10 km²' },
  { id: 'EVD-00136', changeType: 'Water Change',    confidence: 0.80, status: 'CONFIRMED', location: 'Brahmaputra Valley', date: '2024-08-25', area: '4.52 km²' },
  { id: 'EVD-00135', changeType: 'Vegetation Loss', confidence: 0.87, status: 'PENDING',   location: 'Sundarbans',         date: '2024-08-20', area: '2.34 km²' },
  { id: 'EVD-00134', changeType: 'Construction',    confidence: 0.93, status: 'CONFIRMED', location: 'Ganges Delta',       date: '2024-08-15', area: '1.78 km²' },
  { id: 'EVD-00133', changeType: 'Road Development',confidence: 0.69, status: 'REJECTED',  location: 'Bihar',             date: '2024-08-10', area: '0.21 km²' },
];

const STATUS_STYLE: Record<string, string> = {
  CONFIRMED: 'text-green-400 bg-green-500/10 border-green-500/30',
  PENDING:   'text-amber-400 bg-amber-500/10 border-amber-500/30',
  REJECTED:  'text-red-400   bg-red-500/10   border-red-500/30',
};

const TYPE_COLOR: Record<string, string> = {
  'Construction':    'text-amber-400',
  'Water Change':    'text-cyan-400',
  'Vegetation Loss': 'text-green-400',
  'Road Development':'text-violet-400',
  'Flood Inundation':'text-blue-400',
};

export default function EvidenceReviewPage() {
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterLoc, setFilterLoc] = useState('All Regions');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, string>>(Object.fromEntries(EVIDENCE_DATA.map(e => [e.id, e.status])));

  const filtered = EVIDENCE_DATA.filter(e =>
    (filterStatus === 'All' || statuses[e.id] === filterStatus) &&
    (filterType === 'All' || e.changeType === filterType) &&
    (filterLoc === 'All Regions' || e.location === filterLoc) &&
    (search === '' || e.id.toLowerCase().includes(search.toLowerCase()) || e.location.toLowerCase().includes(search.toLowerCase()))
  );

  const selectedEv = EVIDENCE_DATA.find(e => e.id === selected);

  const update = (id: string, s: string) => setStatuses(prev => ({ ...prev, [id]: s }));

  return (
    <div className="h-full flex gap-3 p-4 overflow-hidden">
      {/* Left filters */}
      <div className="w-48 shrink-0 flex flex-col gap-3">
        <div className="glass-panel p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-mono font-bold text-gray-400">FILTERS</span>
          </div>
          <label className="block text-[9px] font-mono text-gray-600 uppercase mb-1">Location</label>
          <select value={filterLoc} onChange={e => setFilterLoc(e.target.value)}
            className="w-full bg-[#020817] border border-gray-700/60 rounded px-2 py-1.5 text-[10px] font-mono text-gray-300 focus:outline-none focus:border-cyan-500/50 mb-3">
            {LOCATIONS.map(l => <option key={l}>{l}</option>)}
          </select>
          <label className="block text-[9px] font-mono text-gray-600 uppercase mb-1">Change Type</label>
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            className="w-full bg-[#020817] border border-gray-700/60 rounded px-2 py-1.5 text-[10px] font-mono text-gray-300 focus:outline-none focus:border-cyan-500/50 mb-3">
            {CHANGE_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <label className="block text-[9px] font-mono text-gray-600 uppercase mb-1">Status</label>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="w-full bg-[#020817] border border-gray-700/60 rounded px-2 py-1.5 text-[10px] font-mono text-gray-300 focus:outline-none focus:border-cyan-500/50 mb-3">
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="glass-panel p-3">
          <p className="text-[9px] font-mono text-gray-600 mb-2 uppercase">Summary</p>
          {['CONFIRMED','PENDING','REJECTED'].map(s => (
            <div key={s} className="flex justify-between mb-1">
              <span className={`text-[10px] font-mono ${STATUS_STYLE[s].split(' ')[0]}`}>{s}</span>
              <span className="text-[10px] font-mono text-gray-400">{EVIDENCE_DATA.filter(e => statuses[e.id] === s).length}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Center table */}
      <div className="flex-1 flex flex-col min-h-0 glass-panel overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-800/60 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-mono font-bold text-gray-300">EVIDENCE QUEUE ({filtered.length})</span>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-600" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search ID or location…"
              className="bg-[#020817] border border-gray-700/60 rounded pl-8 pr-3 py-1.5 text-[10px] font-mono text-gray-300 focus:outline-none focus:border-cyan-500/50 w-48" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-[#050b18]">
              <tr className="border-b border-gray-800/60">
                {['Tile ID','Change Type','Confidence','Status','Actions'].map(h => (
                  <th key={h} className="px-3 py-2 text-left text-[9px] font-mono font-bold text-gray-600 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(ev => (
                <tr key={ev.id}
                  className={`border-b border-gray-800/20 hover:bg-gray-800/20 cursor-pointer transition-colors ${
                    selected === ev.id ? 'bg-cyan-500/5' : ''
                  }`}
                  onClick={() => setSelected(ev.id === selected ? null : ev.id)}>
                  <td className="px-3 py-2.5 text-[10px] font-mono text-cyan-400 font-bold">{ev.id}</td>
                  <td className={`px-3 py-2.5 text-[10px] font-mono font-bold ${TYPE_COLOR[ev.changeType] || 'text-gray-400'}`}>{ev.changeType}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${Math.round(ev.confidence * 100)}%` }} />
                      </div>
                      <span className="text-[10px] font-mono text-gray-400">{Math.round(ev.confidence * 100)}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[9px] font-mono font-bold ${STATUS_STYLE[statuses[ev.id]] || STATUS_STYLE.PENDING}`}>
                      {statuses[ev.id]}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                      <button onClick={() => setSelected(ev.id)} title="View"
                        className="p-1 rounded bg-gray-800/60 text-gray-400 hover:text-cyan-400 transition-colors">
                        <Eye className="w-3 h-3" />
                      </button>
                      <button onClick={() => update(ev.id, 'CONFIRMED')} title="Confirm"
                        className="p-1 rounded bg-gray-800/60 text-gray-400 hover:text-green-400 transition-colors">
                        <CheckCircle className="w-3 h-3" />
                      </button>
                      <button onClick={() => update(ev.id, 'REJECTED')} title="Reject"
                        className="p-1 rounded bg-gray-800/60 text-gray-400 hover:text-red-400 transition-colors">
                        <XCircle className="w-3 h-3" />
                      </button>
                      <button title="Note" className="p-1 rounded bg-gray-800/60 text-gray-400 hover:text-amber-400 transition-colors">
                        <FileText className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right: Selected detail */}
      {selectedEv ? (
        <div className="w-56 shrink-0 flex flex-col gap-3">
          <div className="glass-panel overflow-hidden">
            <div className="px-3 py-2 border-b border-gray-800/60">
              <span className="text-[10px] font-mono font-bold text-gray-300">{selectedEv.id}</span>
            </div>
            <div className="h-24 bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-700" />
              <span className="absolute text-[9px] font-mono text-gray-600">BEFORE</span>
            </div>
            <div className="h-24 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center border-t border-gray-800/60">
              <ImageIcon className="w-8 h-8 text-gray-700" />
              <span className="absolute text-[9px] font-mono text-gray-600">AFTER</span>
            </div>
          </div>
          <div className="glass-panel p-4 flex-1">
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">Change Details</p>
            {[
              { label: 'Type', value: selectedEv.changeType, color: TYPE_COLOR[selectedEv.changeType] },
              { label: 'Confidence', value: `${Math.round(selectedEv.confidence * 100)}%`, color: 'text-green-400' },
              { label: 'Area', value: selectedEv.area, color: 'text-cyan-400' },
              { label: 'Earliest Detect', value: selectedEv.date, color: 'text-gray-300' },
              { label: 'Location', value: selectedEv.location, color: 'text-gray-300' },
            ].map(({ label, value, color }) => (
              <div key={label} className="mb-2">
                <p className="text-[9px] font-mono text-gray-600 uppercase">{label}</p>
                <p className={`text-[11px] font-mono font-bold ${color}`}>{value}</p>
              </div>
            ))}
            <div className="mt-3 pt-3 border-t border-gray-800/60 space-y-1.5">
              <button onClick={() => update(selectedEv.id, 'CONFIRMED')}
                className="w-full py-1.5 bg-green-500/10 border border-green-500/30 text-green-400 rounded text-[10px] font-mono font-bold hover:bg-green-500/20 transition-colors">CONFIRM</button>
              <button onClick={() => update(selectedEv.id, 'REJECTED')}
                className="w-full py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded text-[10px] font-mono font-bold hover:bg-red-500/20 transition-colors">REJECT</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-56 shrink-0 glass-panel flex items-center justify-center">
          <div className="text-center opacity-30">
            <ShieldCheck className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p className="text-[10px] font-mono text-gray-500">Select a row to review</p>
          </div>
        </div>
      )}
    </div>
  );
}
