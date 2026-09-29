import React, { useState } from 'react';
import { Upload, CheckCircle2, Loader2, Database, Search, FileText, ChevronRight, AlertCircle, Eye } from 'lucide-react';

const PIPELINE_STEPS = [
  { id: 1, label: 'Upload', icon: Upload,        desc: 'File received & validated', status: 'done' },
  { id: 2, label: 'Preprocess', icon: AlertCircle, desc: 'Quality Masking + Cloud Filter', status: 'done' },
  { id: 3, label: 'Indexing', icon: Database,    desc: 'Embeddings → FAISS Vector Index', status: 'active' },
  { id: 4, label: 'Complete', icon: CheckCircle2, desc: 'Ready for Search', status: 'pending' },
];

const FORMATS = ['GeoTIFF', 'COG', 'TIF', 'JP2', 'PNG', 'JPEG'];

const RECENT_FILES = [
  { name: 'Sentinel-2A_20240912_B02B03B04.tif', size: '14.2 MB', pct: 100, status: 'complete' },
  { name: 'ISRO_LISS4_20240908_WFN.jp2',         size: '8.7 MB',  pct: 100, status: 'complete' },
  { name: 'Landsat9_OLI_20240902_path142.tif',   size: '22.1 MB', pct: 73,  status: 'processing' },
  { name: 'Sentinel-1_GRD_20240828_VV.tif',      size: '18.5 MB', pct: 0,   status: 'queued' },
];

const STATUS_STYLE: Record<string, string> = {
  complete:   'text-green-400',
  processing: 'text-cyan-400',
  queued:     'text-gray-500',
  error:      'text-red-400',
};

export default function DataIngestionPage() {
  const [dragging, setDragging] = useState(false);
  const [progress] = useState(73);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  return (
    <div className="h-full flex flex-col gap-4 p-4 overflow-y-auto">
      <div className="shrink-0">
        <h2 className="font-mono text-lg font-bold text-white tracking-wider">DATA INGESTION</h2>
        <p className="text-[11px] text-gray-500 font-mono">Upload and index satellite imagery for search and analysis</p>
      </div>

      {/* Pipeline steps */}
      <div className="shrink-0 glass-panel p-5">
        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-5">Ingestion Pipeline</p>
        <div className="flex items-center">
          {PIPELINE_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    step.status === 'done'    ? 'border-green-500 bg-green-500/10' :
                    step.status === 'active'  ? 'border-cyan-500 bg-cyan-500/10 animate-pulse' :
                    'border-gray-700 bg-gray-800/20'
                  }`}>
                    {step.status === 'done' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : step.status === 'active' ? (
                      <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                    ) : (
                      <Icon className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <p className={`text-[10px] font-mono font-bold mt-2 ${
                    step.status === 'done' ? 'text-green-400' : step.status === 'active' ? 'text-cyan-400' : 'text-gray-600'
                  }`}>{step.label}</p>
                  <p className="text-[9px] font-mono text-gray-600 text-center max-w-[80px] mt-0.5">{step.desc}</p>
                </div>
                {i < PIPELINE_STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-3 ${
                    PIPELINE_STEPS[i + 1].status === 'done' || step.status === 'done' ? 'bg-green-500/40' :
                    step.status === 'active' ? 'bg-cyan-500/40' : 'bg-gray-800'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4 shrink-0">
        {/* Drop zone */}
        <div
          className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center py-10 cursor-pointer transition-colors ${
            dragging ? 'border-cyan-500 bg-cyan-500/5' : 'border-gray-700 hover:border-gray-600'
          }`}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <Upload className="w-8 h-8 text-gray-600 mb-3" />
          <p className="text-sm font-mono text-gray-400">Drop satellite files here</p>
          <p className="text-[10px] font-mono text-gray-600 mt-1">or click to browse</p>
          <div className="flex gap-1.5 mt-4 flex-wrap justify-center">
            {FORMATS.map(f => (
              <span key={f} className="px-2 py-0.5 bg-gray-800/60 border border-gray-700/60 rounded text-[9px] font-mono text-gray-500">{f}</span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="w-48 shrink-0 space-y-3">
          {[{ label: 'In Queue', val: '1', color: 'text-amber-400' }, { label: 'Processing', val: '1', color: 'text-cyan-400' }, { label: 'Completed Today', val: '2', color: 'text-green-400' }, { label: 'Total Indexed', val: '14,872', color: 'text-gray-300' }].map(({ label, val, color }) => (
            <div key={label} className="glass-panel px-4 py-3">
              <p className="text-[9px] font-mono text-gray-600 uppercase">{label}</p>
              <p className={`text-xl font-mono font-bold ${color}`}>{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* File list */}
      <div className="shrink-0 glass-panel overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800/60">
          <span className="text-[10px] font-mono font-bold text-gray-300">INGESTION PROGRESS</span>
          <button className="px-3 py-1 bg-gray-800/60 border border-gray-700/40 text-gray-400 rounded text-[10px] font-mono hover:text-gray-200 transition-colors flex items-center gap-1.5">
            <Eye className="w-3 h-3" /> View Log
          </button>
        </div>
        {RECENT_FILES.map((file, i) => (
          <div key={i} className="px-4 py-3 border-b border-gray-800/20 last:border-b-0">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-gray-600" />
                <span className="text-[10px] font-mono text-gray-300 truncate max-w-xs">{file.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-mono text-gray-600">{file.size}</span>
                <span className={`text-[10px] font-mono font-bold uppercase ${STATUS_STYLE[file.status]}`}>{file.status}</span>
              </div>
            </div>
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  file.status === 'complete' ? 'bg-green-500' : file.status === 'processing' ? 'bg-cyan-500' : 'bg-gray-700'
                }`}
                style={{ width: `${file.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
