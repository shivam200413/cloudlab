import { useState } from 'react';
import { Play, Square, Trash2, Code2, Loader, Hash } from 'lucide-react';
import axios from 'axios';
const _api = axios.create({ baseURL: '/api' });
const _token = () => typeof window !== 'undefined' ? localStorage.getItem('cl_token') : '';
const wsApi = {
  start: (id) => _api.post(`/workspaces/${id}/start`, {}, { headers: { Authorization: `Bearer ${_token()}` } }),
  stop: (id) => _api.post(`/workspaces/${id}/stop`, {}, { headers: { Authorization: `Bearer ${_token()}` } }),
  delete: (id) => _api.delete(`/workspaces/${id}`, { headers: { Authorization: `Bearer ${_token()}` } }),
};

const TEMPLATE_META = {
  nodejs:    { icon: '⬡', color: '#00d4d4', label: 'Node.js 20 / React' },
  python:    { icon: '⬡', color: '#7c5cfc', label: 'Python 3.11 / ML' },
  fullstack: { icon: '⬡', color: '#ffab40', label: 'Node.js / Python / PG' },
};

export default function WorkspaceCard({ workspace, onUpdate, onDelete, onOpenIDE }) {
  const [busy, setBusy] = useState(false);
  const [stats] = useState({ cpu: Math.floor(Math.random() * 40 + 5), ram: Math.floor(Math.random() * 300 + 100) });

  const meta = TEMPLATE_META[workspace.templateId] || { icon: '⬡', color: '#8888aa', label: workspace.templateId };
  const isRunning = workspace.status === 'running';
  const isStopped = workspace.status === 'stopped';

  const doStart = async () => {
    setBusy(true);
    try { const { data } = await wsApi.start(workspace.id); onUpdate(data.workspace); }
    catch (e) { alert(e.response?.data?.error || 'Failed to start'); }
    finally { setBusy(false); }
  };

  const doStop = async () => {
    setBusy(true);
    try { const { data } = await wsApi.stop(workspace.id); onUpdate(data.workspace); }
    catch (e) { alert(e.response?.data?.error || 'Failed to stop'); }
    finally { setBusy(false); }
  };

  const doDelete = async () => {
    if (!confirm(`Delete "${workspace.name}"?`)) return;
    setBusy(true);
    try { await wsApi.delete(workspace.id); onDelete(workspace.id); }
    catch (e) { alert(e.response?.data?.error || 'Failed to delete'); setBusy(false); }
  };

  return (
    <div className="card card-hover rounded-xl p-5 animate-fade-up">
      <div className="flex items-start justify-between mb-4">
        {/* Left: icon + name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: meta.color + '15', border: `1px solid ${meta.color}30` }}>
            <Code2 size={18} style={{ color: meta.color }} />
          </div>
          <div>
            <h3 className="font-semibold text-white">{workspace.name}</h3>
            <span className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full mt-1 mono"
              style={{ background: meta.color + '15', color: meta.color, border: `1px solid ${meta.color}30` }}>
              <Hash size={9} />
              {meta.label}
            </span>
          </div>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
          style={isRunning
            ? { background: '#00e67615', color: '#00e676', border: '1px solid #00e67630' }
            : { background: '#1e1e30', color: '#4a4a6a', border: '1px solid #2a2a3f' }}>
          <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'animate-pulse-dot' : ''}`}
            style={{ background: isRunning ? '#00e676' : '#4a4a6a' }} />
          {busy ? 'UPDATING...' : isRunning ? 'RUNNING' : 'STOPPED'}
        </div>
      </div>

      {/* CPU / RAM bars — shown only for running workspaces */}
      {isRunning && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex justify-between text-xs mb-1.5" style={{ color: '#4a4a6a' }}>
              <span>CPU</span>
              <span className="mono" style={{ color: '#00d4d4' }}>{stats.cpu}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${stats.cpu}%`, background: '#00d4d4' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1.5" style={{ color: '#4a4a6a' }}>
              <span>RAM</span>
              <span className="mono" style={{ color: '#7c5cfc' }}>{stats.ram}MB</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${Math.min(100, (stats.ram / 512) * 100)}%`, background: '#7c5cfc' }} />
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {isRunning ? (
          <>
            <button onClick={() => onOpenIDE(workspace)} disabled={busy}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{ background: '#00d4d4', color: '#0d0d14' }}
              onMouseEnter={e => !busy && (e.currentTarget.style.background = '#00bcbc')}
              onMouseLeave={e => !busy && (e.currentTarget.style.background = '#00d4d4')}>
              <Code2 size={14} />
              Open IDE
            </button>
            <button onClick={doStop} disabled={busy}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ background: '#13131f', border: '1px solid #2a2a3f', color: '#8888aa' }}
              onMouseEnter={e => !busy && (e.currentTarget.style.color = '#e2e2f0')}
              onMouseLeave={e => !busy && (e.currentTarget.style.color = '#8888aa')}>
              {busy ? <Loader size={14} className="animate-spin-slow" /> : <Square size={14} />}
              Stop
            </button>
          </>
        ) : (
          <>
            <button onClick={doStart} disabled={busy}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{ background: '#13131f', border: '1px solid #2a2a3f', color: '#e2e2f0' }}
              onMouseEnter={e => !busy && (e.currentTarget.style.borderColor = '#00d4d440')}
              onMouseLeave={e => !busy && (e.currentTarget.style.borderColor = '#2a2a3f')}>
              {busy ? <Loader size={14} className="animate-spin-slow" /> : <Play size={14} />}
              {busy ? 'Starting…' : 'Launch'}
            </button>
          </>
        )}
        <button onClick={doDelete} disabled={busy}
          className="flex items-center justify-center w-10 rounded-lg transition-colors"
          style={{ background: '#13131f', border: '1px solid #2a2a3f', color: '#4a4a6a' }}
          onMouseEnter={e => !busy && (e.currentTarget.style.color = '#ff5252')}
          onMouseLeave={e => !busy && (e.currentTarget.style.color = '#4a4a6a')}
          title="Delete workspace">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
