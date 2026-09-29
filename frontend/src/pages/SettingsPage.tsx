import React, { useState } from 'react';
import { Settings, Wifi, WifiOff, Database, Cpu, HardDrive, MemoryStick, Key, RefreshCw } from 'lucide-react';

const TABS = ['General', 'Ingestion', 'Offline Deployment', 'Logs'] as const;
type Tab = typeof TABS[number];

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('Offline Deployment');
  const [online, setOnline] = useState(true);
  const [sensorPass, setSensorPass] = useState('');
  const [showPass, setShowPass] = useState(false);

  const RESOURCES = [
    { label: 'CPU Utilization', val: 34, color: 'bg-cyan-500' },
    { label: 'Memory (RAM)',    val: 58, color: 'bg-amber-500' },
    { label: 'Storage (SSD)',  val: 74, color: 'bg-violet-500' },
    { label: 'GPU Memory',     val: 41, color: 'bg-green-500' },
  ];

  return (
    <div className="h-full flex flex-col gap-3 p-4 overflow-hidden">
      <div className="shrink-0">
        <h2 className="font-mono text-lg font-bold text-white tracking-wider">SETTINGS</h2>
        <p className="text-[11px] text-gray-500 font-mono">Platform configuration and deployment options</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 shrink-0 border-b border-gray-800/60">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-xs font-mono font-bold transition-colors ${
              tab === t ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500 hover:text-gray-300'
            }`}>{t}</button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === 'General' && (
          <div className="max-w-lg space-y-4">
            <div className="glass-panel p-5">
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4">Application</p>
              {[{ label: 'Platform Name', val: 'GeoSentinel AI' }, { label: 'Version', val: '2.0.0' }, { label: 'Backend URL', val: 'http://localhost:8000' }, { label: 'API Version', val: 'v1' }].map(({ label, val }) => (
                <div key={label} className="flex justify-between py-2 border-b border-gray-800/40 last:border-0">
                  <span className="text-[11px] font-mono text-gray-500">{label}</span>
                  <span className="text-[11px] font-mono text-gray-300 font-bold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'Ingestion' && (
          <div className="max-w-lg space-y-4">
            <div className="glass-panel p-5">
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4">Ingestion Settings</p>
              {[{ label: 'Max File Size', val: '2 GB' }, { label: 'Supported Formats', val: 'GeoTIFF, COG, JP2, TIF' }, { label: 'Cloud Mask Threshold', val: '30%' }, { label: 'FAISS Index Type', val: 'IVF4096,Flat' }].map(({ label, val }) => (
                <div key={label} className="flex justify-between py-2 border-b border-gray-800/40 last:border-0">
                  <span className="text-[11px] font-mono text-gray-500">{label}</span>
                  <span className="text-[11px] font-mono text-gray-300 font-bold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'Offline Deployment' && (
          <div className="flex gap-4">
            <div className="flex-1 space-y-4">
              {/* Status */}
              <div className="glass-panel p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Connection Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-bold ${
                    online ? 'text-green-400 bg-green-500/10 border-green-500/30' : 'text-red-400 bg-red-500/10 border-red-500/30'
                  }`}>
                    {online ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                    {online ? 'Online' : 'Offline'}
                  </span>
                </div>
                <button onClick={() => setOnline(!online)}
                  className="px-4 py-2 bg-gray-800/60 border border-gray-700 text-gray-300 rounded text-xs font-mono font-bold hover:border-gray-500 hover:text-white transition-colors">
                  Switch to {online ? 'Offline' : 'Online'} Mode
                </button>
              </div>

              {/* Sensor Password */}
              <div className="glass-panel p-5">
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4">Sensor Authentication</p>
                <label className="block text-[10px] font-mono text-gray-500 mb-2">Sensor Password</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                    <input type={showPass ? 'text' : 'password'} value={sensorPass} onChange={e => setSensorPass(e.target.value)}
                      placeholder="Enter sensor password…"
                      className="w-full bg-[#020817] border border-gray-700/60 rounded pl-9 pr-3 py-2 text-xs font-mono text-gray-300 focus:outline-none focus:border-cyan-500/50" />
                  </div>
                  <button onClick={() => setShowPass(!showPass)}
                    className="px-3 py-2 bg-gray-800/60 border border-gray-700 rounded text-[10px] font-mono text-gray-400 hover:text-gray-200 transition-colors">
                    {showPass ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>

              {/* Model & Index */}
              <div className="glass-panel p-5">
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4">Models & Index</p>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded text-xs font-mono font-bold hover:bg-cyan-500/20 transition-colors">Manage Models</button>
                  <button className="flex-1 py-2 bg-violet-500/10 border border-violet-500/30 text-violet-400 rounded text-xs font-mono font-bold hover:bg-violet-500/20 transition-colors">Manage Index</button>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="w-64 shrink-0">
              <div className="glass-panel p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">System Resources</p>
                  <RefreshCw className="w-3.5 h-3.5 text-gray-600 cursor-pointer hover:text-gray-300 transition-colors" />
                </div>
                {RESOURCES.map(({ label, val, color }) => (
                  <div key={label} className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-[10px] font-mono text-gray-500">{label}</span>
                      <span className="text-[10px] font-mono text-gray-300 font-bold">{val}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${val}%` }} />
                    </div>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-800/60">
                  {[{ icon: Database, label: 'Vector DB', val: 'ONLINE', color: 'text-green-400' }, { icon: Cpu, label: 'FAISS Shards', val: '4 / 4', color: 'text-cyan-400' }].map(({ icon: Icon, label, val, color }) => (
                    <div key={label} className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-gray-600" />
                        <span className="text-[10px] font-mono text-gray-500">{label}</span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold ${color}`}>{val}</span>
                    </div>
                  ))}
                  <button className="w-full mt-2 py-1.5 bg-gray-800/60 border border-gray-700/40 text-gray-400 rounded text-[10px] font-mono font-bold hover:text-gray-200 hover:border-gray-500 transition-colors">Manage Vector Database</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'Logs' && (
          <div className="bg-[#020817] border border-gray-800/60 rounded-xl p-4 font-mono text-[10px] text-gray-400 h-64 overflow-y-auto">
            {[
              '[2024-09-12 11:34:22] INFO  FAISS index loaded — 14,872 vectors',
              '[2024-09-12 11:34:23] INFO  API server started on :8000',
              '[2024-09-12 11:34:24] INFO  GPU detected: NVIDIA A100 (40 GB)',
              '[2024-09-12 11:35:01] INFO  Ingestion job started: Sentinel-2A_20240912.tif',
              '[2024-09-12 11:35:14] INFO  Cloud masking complete: 8% coverage filtered',
              '[2024-09-12 11:35:28] INFO  Embedding generated: 1,024-dim vector',
              '[2024-09-12 11:35:29] INFO  FAISS index updated — 14,873 vectors',
              '[2024-09-12 11:35:29] INFO  Ingestion complete: 14.2 MB processed',
            ].map((line, i) => (
              <div key={i} className="py-0.5 border-b border-gray-900">
                <span className="text-gray-600">{line.slice(0, 22)}</span>
                <span className={line.includes('INFO') ? 'text-green-400' : line.includes('WARN') ? 'text-amber-400' : 'text-red-400'}> {line.slice(22, 28)}</span>
                <span className="text-gray-400">{line.slice(28)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
