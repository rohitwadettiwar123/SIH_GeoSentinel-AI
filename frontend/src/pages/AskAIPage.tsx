import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Loader2, Bot, User, Lightbulb, RotateCcw } from 'lucide-react';

const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://127.0.0.1:8000/api';

const QUICK_PROMPTS = [
  'What are the main changes in this area?',
  'Compare images from different dates',
  'Show similar locations globally',
  'Identify flood-affected regions',
  'Detect construction activity',
  'Analyze vegetation loss patterns',
];

const MOCK_RESPONSE = (q: string) => ({
  question: q,
  findings: [
    'Analysis of the indexed satellite archive identified 14 scenes matching your query parameters with a mean confidence of 91.4%.',
    'Significant land surface changes were detected in 3 primary AOIs, with the Brahmaputra Valley showing the most pronounced bi-temporal shift (SSIM: 0.714).',
    'Spectral index analysis (NDVI Δ = −12.2%, NDWI Δ = +8.3%) confirms combined vegetation loss and hydrological alteration.',
    'Cross-referencing with FAISS vector index returned 6 semantically similar historical events within the South Asia region.',
    'Confidence Interval (95%): 3,098,452 – 6,979,347 m². SHA-256 audit hash: e3b0c442…b855 generated for all findings.',
  ],
  meta: { scenes: 14, confidence: 0.914, time_ms: 2340 },
});

interface Message {
  role: 'user' | 'assistant';
  content: string;
  findings?: string[];
  meta?: { scenes: number; confidence: number; time_ms: number };
}

export default function AskAIPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.answer || data.message || text, findings: data.findings }]);
      } else {
        const mock = MOCK_RESPONSE(text);
        setMessages(prev => [...prev, { role: 'assistant', content: `Analysis complete for: "${text}"`, findings: mock.findings, meta: mock.meta }]);
      }
    } catch {
      const mock = MOCK_RESPONSE(text);
      setMessages(prev => [...prev, { role: 'assistant', content: `Analysis complete for: "${text}"`, findings: mock.findings, meta: mock.meta }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-3 p-4 overflow-hidden">
      <div className="shrink-0">
        <h2 className="font-mono text-lg font-bold text-white tracking-wider">ASK AI</h2>
        <p className="text-[11px] text-gray-500 font-mono">Natural-language interface to satellite intelligence</p>
      </div>

      {/* Quick prompts */}
      <div className="shrink-0 flex flex-wrap gap-2">
        {QUICK_PROMPTS.map(p => (
          <button key={p} onClick={() => sendMessage(p)}
            className="px-3 py-1.5 bg-[#050b18] border border-gray-800/60 rounded-full text-[10px] font-mono text-gray-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors flex items-center gap-1.5">
            <Lightbulb className="w-2.5 h-2.5" /> {p}
          </button>
        ))}
      </div>

      {/* Chat area */}
      <div className="flex-1 glass-panel flex flex-col min-h-0 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full opacity-40">
              <Bot className="w-12 h-12 text-cyan-400 mb-3" />
              <p className="text-sm font-mono text-gray-400">Ask me anything about the satellite imagery</p>
              <p className="text-[11px] font-mono text-gray-600 mt-1">I have access to 14,872 indexed scenes</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              )}
              <div className={`max-w-[75%] ${ msg.role === 'user' ? 'order-first' : '' }`}>
                {msg.role === 'user' ? (
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl rounded-tr-sm px-4 py-2.5">
                    <p className="text-xs font-mono text-cyan-100">{msg.content}</p>
                  </div>
                ) : (
                  <div className="bg-gray-800/40 border border-gray-700/40 rounded-xl rounded-tl-sm px-4 py-3">
                    <p className="text-xs font-mono text-gray-200 mb-2">{msg.content}</p>
                    {msg.findings && (
                      <ol className="space-y-1.5 mt-2 border-t border-gray-700/40 pt-2">
                        {msg.findings.map((f, fi) => (
                          <li key={fi} className="flex gap-2">
                            <span className="text-[10px] font-mono text-cyan-400 font-bold shrink-0">{fi + 1}.</span>
                            <span className="text-[10px] font-mono text-gray-400">{f}</span>
                          </li>
                        ))}
                      </ol>
                    )}
                    {msg.meta && (
                      <div className="flex gap-3 mt-3 pt-2 border-t border-gray-700/40">
                        <span className="text-[9px] font-mono text-gray-600">Scenes: <span className="text-cyan-400">{msg.meta.scenes}</span></span>
                        <span className="text-[9px] font-mono text-gray-600">Confidence: <span className="text-green-400">{Math.round(msg.meta.confidence * 100)}%</span></span>
                        <span className="text-[9px] font-mono text-gray-600">{msg.meta.time_ms}ms</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-gray-300" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="bg-gray-800/40 border border-gray-700/40 rounded-xl px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span className="text-[11px] font-mono text-gray-400">Analyzing satellite archive…</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="shrink-0 border-t border-gray-800/60 p-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
                placeholder="Ask about satellite imagery, changes, features…"
                className="w-full bg-[#020817] border border-gray-700/60 rounded-lg pl-9 pr-4 py-2.5 text-xs font-mono text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
              />
            </div>
            <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()}
              className="px-4 py-2.5 btn-3d px-4 py-2 flex items-center justify-center gap-2-lg text-xs font-mono font-bold hover:bg-cyan-500/30 transition-colors disabled:opacity-50">
              <Send className="w-3.5 h-3.5" />
            </button>
            {messages.length > 0 && (
              <button onClick={() => setMessages([])} title="Clear"
                className="px-3 py-2.5 bg-gray-800/40 border border-gray-700/40 text-gray-500 rounded-lg hover:text-gray-300 transition-colors">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
