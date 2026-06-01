import { useState, useEffect } from 'react';
import { ArrowLeft, Wifi, StopCircle, Maximize2, Zap } from 'lucide-react';

export default function IDEView({ workspace, onBack, onTerminate }) {
  const [secs, setSecs] = useState(2700); // 45 min
  const [ping, setPing] = useState(12);

  useEffect(() => {
    const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setPing(Math.floor(8 + Math.random() * 18)), 3000);
    return () => clearInterval(t);
  }, []);

  const fmt = s => {
    const m = Math.floor(s / 60), sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const urgent = secs < 300;
  const ideUrl = workspace.hostPort
    ? `${typeof window !== 'undefined' ? window.location.protocol + '//' + window.location.hostname : 'http://localhost'}:${workspace.hostPort}`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#0d0d14' }}>
      {/* ── Control bar ── */}
      <div className="flex items-center h-14 px-4 gap-4 flex-shrink-0"
        style={{ background: '#0f0f1a', borderBottom: '1px solid #1e1e30' }}>
        {/* Left */}
        <button onClick={onBack}
          className="flex items-center gap-2 text-sm transition-colors px-3 py-1.5 rounded-lg"
          style={{ color: '#8888aa', background: '#13131f', border: '1px solid #1e1e30' }}
          onMouseEnter={e => e.currentTarget.style.color = '#e2e2f0'}
          onMouseLeave={e => e.currentTarget.style.color = '#8888aa'}>
          <ArrowLeft size={14} />
          Dashboard
        </button>
        <div className="w-px h-5" style={{ background: '#1e1e30' }} />
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse-dot" style={{ background: '#00e676' }} />
          <span className="text-sm font-medium text-white">{workspace.name}</span>
        </div>

        {/* Center */}
        <div className="flex-1 flex items-center justify-center gap-6">
          <div className={`flex items-center gap-2 text-sm font-semibold mono ${urgent ? '' : ''}`}
            style={{ color: urgent ? '#ff5252' : '#e2e2f0' }}>
            <Zap size={14} style={{ color: urgent ? '#ff5252' : '#00d4d4' }} />
            Session Ends in {fmt(secs)}
          </div>
          <div className="flex items-center gap-1.5 text-xs mono" style={{ color: '#4a4a6a' }}>
            <Wifi size={12} style={{ color: '#00e676' }} />
            {ping}ms
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {ideUrl && (
            <a href={ideUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors"
              style={{ background: '#13131f', border: '1px solid #1e1e30', color: '#8888aa' }}
              onMouseEnter={e => e.currentTarget.style.color = '#e2e2f0'}
              onMouseLeave={e => e.currentTarget.style.color = '#8888aa'}>
              <Maximize2 size={12} />
              Pop out
            </a>
          )}
          <button onClick={onTerminate}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{ background: '#ff525215', border: '1px solid #ff525230', color: '#ff5252' }}
            onMouseEnter={e => e.currentTarget.style.background = '#ff525225'}
            onMouseLeave={e => e.currentTarget.style.background = '#ff525215'}>
            <StopCircle size={14} />
            Terminate Lab
          </button>
        </div>
      </div>

      {/* ── IDE iframe ── */}
      <div className="flex-1 relative" style={{ background: '#1e1e2e' }}>
        {ideUrl ? (
          <iframe src={ideUrl} className="w-full h-full border-0"
            title={`IDE — ${workspace.name}`}
            allow="clipboard-read; clipboard-write" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: '#13131f', border: '1px solid #2a2a3f' }}>
              <span className="text-3xl">
                {workspace.templateId === 'python' ? '🐍' : workspace.templateId === 'fullstack' ? '🚀' : '⬡'}
              </span>
            </div>
            <p className="text-sm mono" style={{ color: '#4a4a6a' }}>
              &lt;iframe&gt; Code-Server Editor Mounts Here
            </p>
            <p className="text-xs mono" style={{ color: '#2a2a3f' }}>
              Workspace running on port {workspace.hostPort}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
