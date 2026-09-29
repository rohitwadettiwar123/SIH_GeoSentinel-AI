import React, { useState } from 'react';
import { FileBarChart, Download, FileText, Table, Map, FileImage, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';

const TEMPLATES = [
  { id: 'change', label: 'Change Analysis Report 1', desc: 'Bi-temporal change detection with metrics', color: 'text-cyan-400' },
  { id: 'search', label: 'Semantic Search Result',   desc: 'Search results with similarity scores',     color: 'text-violet-400' },
  { id: 'geo',    label: 'Geospatial Evidence',      desc: 'GIS-ready evidence export with polygons',   color: 'text-emerald-400' },
  { id: 'custom', label: 'Custom Report',            desc: 'Configure your own report template',        color: 'text-amber-400' },
];

const FORMATS = [
  { id: 'csv', label: 'CSV', icon: Table,     color: 'text-green-400 border-green-500/30 bg-green-500/10' },
  { id: 'gml', label: 'GML', icon: Map,       color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
  { id: 'shp', label: 'SHP', icon: Map,       color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  { id: 'pdf', label: 'PDF', icon: FileImage, color: 'text-red-400 border-red-500/30 bg-red-500/10' },
];

const RECENT_REPORTS = [
  { name: 'ChangeAnalysis_BrahmaValley_20240912.pdf', size: '842 KB', date: '2024-09-12 11:34' },
  { name: 'SemanticSearch_Coastal_20240910.csv',      size: '124 KB', date: '2024-09-10 09:22' },
  { name: 'GeoEvidence_Sundarbans_20240908.gml',      size: '2.1 MB', date: '2024-09-08 15:44' },
  { name: 'ChangeAnalysis_GangesDelta_20240905.pdf',  size: '1.3 MB', date: '2024-09-05 08:10' },
  { name: 'CustomReport_Bihar_20240902.pdf',          size: '678 KB', date: '2024-09-02 14:55' },
];

export default function ReportsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('change');
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [provenance, setProvenance] = useState(true);
  const [generating, setGenerating] = useState(false);

  const generate = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    setGenerating(false);
  };

  const currentTemplate = TEMPLATES.find(t => t.id === selectedTemplate);

  return (
    <div className="h-full flex gap-3 p-4 overflow-hidden">
      {/* Left: Templates + Recent */}
      <div className="w-56 shrink-0 flex flex-col gap-3">
        <div className="glass-panel overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-800/60">
            <span className="text-[10px] font-mono font-bold text-gray-400">REPORT TEMPLATES</span>
          </div>
          {TEMPLATES.map(t => (
            <div
              key={t.id}
              onClick={() => setSelectedTemplate(t.id)}
              className={`px-4 py-3 cursor-pointer border-b border-gray-800/20 last:border-0 hover:bg-gray-800/30 transition-colors ${
                selectedTemplate === t.id ? 'bg-cyan-500/5 border-l-2 border-l-cyan-500' : ''
              }`}
            >
              <p className={`text-[10px] font-mono font-bold ${t.color}`}>{t.label}</p>
              <p className="text-[9px] font-mono text-gray-600 mt-0.5">{t.desc}</p>
            </div>
          ))}
        </div>

        {/* Recent reports */}
        <div className="flex-1 glass-panel flex flex-col min-h-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-800/60 shrink-0">
            <span className="text-[10px] font-mono font-bold text-gray-400">RECENT REPORTS</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {RECENT_REPORTS.map((r, i) => (
              <div key={i} className="px-3 py-2.5 border-b border-gray-800/20 last:border-0 hover:bg-gray-800/20 cursor-pointer transition-colors">
                <div className="flex items-start gap-2">
                  <FileText className="w-3 h-3 text-gray-600 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-mono text-gray-300 truncate">{r.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] font-mono text-gray-600">{r.size}</span>
                      <span className="text-[9px] font-mono text-gray-700">{r.date}</span>
                    </div>
                  </div>
                  <Download className="w-3 h-3 text-gray-600 hover:text-cyan-400 shrink-0 mt-0.5 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Center: Export panel */}
      <div className="flex-1 flex flex-col gap-3">
        <div className="glass-panel p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileBarChart className="w-4 h-4 text-cyan-400" />
            <p className="text-[10px] font-mono font-bold text-gray-300 uppercase tracking-widest">Export Results</p>
          </div>

          <p className="text-[10px] font-mono text-gray-500 mb-3 uppercase tracking-widest">Output Format</p>
          <div className="flex gap-2 mb-5">
            {FORMATS.map(({ id, label, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => setSelectedFormat(id)}
                className={`flex-1 py-3 border rounded-xl flex flex-col items-center gap-1.5 transition-all ${
                  selectedFormat === id
                    ? color + ' ring-1 ring-current'
                    : 'border-gray-700 bg-gray-800/20 text-gray-500 hover:border-gray-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[11px] font-mono font-bold">{label}</span>
              </button>
            ))}
          </div>

          {/* Provenance toggle */}
          <div className="flex items-center gap-3 py-3 border-t border-gray-800/60 mb-5">
            <button onClick={() => setProvenance(!provenance)} className="flex items-center gap-2">
              {provenance
                ? <ToggleRight className="w-5 h-5 text-cyan-400" />
                : <ToggleLeft className="w-5 h-5 text-gray-600" />
              }
              <span className="text-[11px] font-mono text-gray-400">
                Include Provenance (SHA-256 Audit Hash)
              </span>
            </button>
          </div>

          {/* Selected template info */}
          <div className="bg-[#020817] border border-gray-800/40 rounded-xl p-4 mb-5">
            <p className="text-[9px] font-mono text-gray-600 uppercase mb-2">Selected Template</p>
            <p className={`text-sm font-mono font-bold ${currentTemplate?.color}`}>
              {currentTemplate?.label}
            </p>
            <p className="text-[10px] font-mono text-gray-600 mt-1">{currentTemplate?.desc}</p>
          </div>

          <button
            onClick={generate}
            disabled={generating}
            className="w-full py-3 btn-3d px-4 py-2 flex items-center justify-center gap-2-xl text-sm font-mono font-bold hover:bg-cyan-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {generating
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
              : <><Download className="w-4 h-4" /> Generate Report</>
            }
          </button>
        </div>

        {/* Preview placeholder */}
        <div className="flex-1 glass-panel flex items-center justify-center">
          <div className="text-center opacity-30">
            <FileBarChart className="w-12 h-12 text-gray-500 mx-auto mb-2" />
            <p className="text-[11px] font-mono text-gray-500">Report preview will appear here</p>
            <p className="text-[10px] font-mono text-gray-600 mt-1">Generate a report to preview</p>
          </div>
        </div>
      </div>
    </div>
  );
}
