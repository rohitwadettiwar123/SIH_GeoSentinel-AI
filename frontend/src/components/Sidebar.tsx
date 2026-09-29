import React from 'react';
import {
  LayoutDashboard, Search, ArrowLeftRight, Globe2, Map,
  Layers3, MessageSquare, ShieldCheck, Upload, Settings,
  FileBarChart, Satellite
} from 'lucide-react';

export type PageId =
  | 'dashboard' | 'semantic-search' | 'change-analysis'
  | 'tactical' | 'explorer3d'
  | 'ask-ai' | 'evidence' | 'data-ingestion'
  | 'settings' | 'reports';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard',       label: 'Dashboard',      icon: LayoutDashboard },
  { id: 'semantic-search', label: 'Semantic Search', icon: Search },
  { id: 'change-analysis', label: 'Change Analysis', icon: ArrowLeftRight },
  { id: 'tactical',        label: '2D Tactical',     icon: Map },
  { id: 'explorer3d',      label: '3D Explorer',     icon: Layers3 },
  { id: 'ask-ai',          label: 'Ask AI',          icon: MessageSquare },
  { id: 'evidence',        label: 'Evidence',        icon: ShieldCheck },
  { id: 'data-ingestion',  label: 'Data Ingestion',  icon: Upload },
  { id: 'settings',        label: 'Settings',        icon: Settings },
  { id: 'reports',         label: 'Reports',         icon: FileBarChart },
];

interface SidebarProps {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
}

export default function Sidebar({ activePage, setActivePage }: SidebarProps) {
  return (
    <aside className="w-56 shrink-0 flex flex-col bg-[#040810] border-r border-gray-800/60 h-full">
      {/* Logo */}
      <div className="h-14 flex items-center gap-2.5 px-4 border-b border-gray-800/60 shrink-0">
        <Satellite className="w-5 h-5 text-cyan-400" />
        <div className="flex flex-col">
          <span className="font-mono text-sm font-bold tracking-wider text-white leading-none">
            GeoSentinel<span className="text-cyan-400">.AI</span>
          </span>
          <span className="text-[9px] font-mono text-gray-500 tracking-widest uppercase leading-tight">Intelligence Platform</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1.5">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activePage === id;
          return (
            <button
              key={id}
              onClick={() => setActivePage(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono font-semibold transition-all duration-300 relative overflow-hidden ${
                isActive
                  ? 'text-cyan-100 shadow-[0_0_15px_rgba(0,245,255,0.2)] bg-gradient-to-r from-cyan-900/40 to-transparent border border-cyan-500/30 pl-[12px]'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40 border border-transparent pl-[12px] hover:shadow-[0_4px_10px_rgba(0,0,0,0.3)]'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
              )}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_10px_rgba(0,245,255,0.8)]" />
              )}
              <Icon className={`w-4 h-4 shrink-0 relative z-10 ${isActive ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(0,245,255,0.5)]' : ''}`} />
              <span className="relative z-10 tracking-wide">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-800/60 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] font-mono text-gray-500">BACKEND CONNECTED</span>
        </div>
        <div className="mt-1 text-[9px] font-mono text-gray-700">v2.0 • localhost:8000</div>
      </div>
    </aside>
  );
}
