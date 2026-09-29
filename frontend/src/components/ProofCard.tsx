import React from 'react';

export interface EvidenceNode {
  id: string;
  type: string;
  description: string;
  source_ref: string;
}

export interface ProofCardProps {
  finalConfidence: number;
  status: 'CONFIRMED' | 'REJECTED' | 'INSUFFICIENT_EVIDENCE' | 'NEEDS_REVIEW';
  evidence: EvidenceNode[];
  gates: Record<string, { status: string; reason?: string }>;
}

export const ProofCard: React.FC<ProofCardProps> = ({ finalConfidence, status, evidence, gates }) => {
  const getStatusColor = (s: string) => {
    switch(s) {
      case 'CONFIRMED': return 'bg-cyan-900/30 text-cyan-400 border-cyan-500/50';
      case 'REJECTED': return 'bg-red-900/30 text-red-400 border-red-500/50';
      case 'INSUFFICIENT_EVIDENCE': return 'bg-gray-800/50 text-gray-400 border-gray-600/50';
      default: return 'bg-amber-900/30 text-amber-400 border-amber-500/50';
    }
  };

  return (
    <div className="bg-[#050a14] border border-gray-800/80 rounded-xl p-4 font-sans mt-4">
      <div className="flex justify-between items-center mb-4 border-b border-gray-800/80 pb-2">
        <h3 className="text-[11px] font-mono font-bold text-cyan-400 tracking-widest">GEO-EVIDENCE PROOF CARD</h3>
        <span className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold uppercase ${getStatusColor(status)}`}>
          {status.replace('_', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[#090e1b] border border-gray-800/50 rounded-lg p-2.5 flex flex-col justify-center">
          <p className="text-[9px] text-gray-500 font-mono tracking-widest mb-1">FINAL CONFIDENCE</p>
          <p className="text-lg font-mono font-bold text-gray-100">
            {status === 'INSUFFICIENT_EVIDENCE' ? 'N/A' : `${(finalConfidence * 100).toFixed(1)}%`}
          </p>
        </div>
        <div className="bg-[#090e1b] border border-gray-800/50 rounded-lg p-2.5 overflow-y-auto max-h-24">
          <p className="text-[9px] text-gray-500 font-mono tracking-widest mb-1.5">VALIDATION GATES</p>
          <div className="flex flex-wrap gap-1">
            {Object.entries(gates).map(([gate, result]) => (
              <span key={gate} title={result.reason} className={`px-1.5 py-0.5 text-[8px] font-mono border rounded ${
                result.status === 'PASS' ? 'bg-green-900/20 text-green-400 border-green-500/30' : 
                result.status === 'WARN' ? 'bg-amber-900/20 text-amber-400 border-amber-500/30' : 'bg-red-900/20 text-red-400 border-red-500/30'
              }`}>
                {gate}: {result.status}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div>
        <p className="text-[9px] text-gray-500 font-mono tracking-widest mb-2">EVIDENCE GRAPH TRACE</p>
        <div className="space-y-1.5">
          {evidence.map((node) => (
            <div key={node.id} className="flex text-[10px] border-l-2 border-cyan-500/50 pl-2 py-0.5 bg-[#090e1b] rounded-r">
              <span className="font-mono text-cyan-500/70 w-10 shrink-0">{node.id}</span>
              <span className="font-mono font-bold text-gray-400 w-16 shrink-0 uppercase truncate">{node.type}</span>
              <span className="text-gray-300 flex-grow font-sans">{node.description}</span>
              <span className="text-[8px] font-mono text-gray-600 truncate w-16 text-right" title={node.source_ref}>
                {node.source_ref}
              </span>
            </div>
          ))}
          {evidence.length === 0 && <p className="text-[10px] text-gray-500 italic font-sans pl-1">No evidence nodes recorded.</p>}
        </div>
      </div>
    </div>
  );
};
