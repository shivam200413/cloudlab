import { useState } from 'react';
import { X, Loader, Plus } from 'lucide-react';
import { wsApi } from './api';

const TEMPLATES = [
  { id: 'nodejs',    icon: '⬡', color: '#00d4d4', name: 'Node.js 20',    desc: 'Node.js LTS with npm, yarn, pnpm pre-installed' },
  { id: 'python',    icon: '⬡', color: '#7c5cfc', name: 'Python 3.11',   desc: 'Python with pip, virtualenv, Jupyter notebook' },
  { id: 'fullstack', icon: '⬡', color: '#ffab40', name: 'Full Stack',    desc: 'Node.js + Python + PostgreSQL client' },
];

export default function CreateWorkspaceModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [templateId, setTemplateId] = useState('nodejs');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await wsApi.create(name || undefined, templateId);
      onCreate(data.workspace);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create workspace');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-md rounded-2xl p-6 animate-fade-up"
        style={{ background: '#13131f', border: '1px solid #1e1e30' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-white text-lg">New Workspace</h2>
          <button onClick={onClose} className="transition-colors"
            style={{ color: '#4a4a6a' }}
            onMouseEnter={e => e.currentTarget.style.color = '#e2e2f0'}
            onMouseLeave={e => e.currentTarget.style.color = '#4a4a6a'}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg text-sm"
            style={{ background: '#ff525215', border: '1px solid #ff525230', color: '#ff5252' }}>
            {error}
          </div>
        )}

        <div className="mb-5">
          <label className="block text-xs mb-2" style={{ color: '#8888aa' }}>Workspace name (optional)</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Web Dev Sandbox"
            className="w-full px-4 py-2.5 rounded-lg text-sm text-white outline-none transition-colors"
            style={{ background: '#0d0d14', border: '1px solid #2a2a3f' }}
            onFocus={e => e.target.style.borderColor = '#00d4d440'}
            onBlur={e => e.target.style.borderColor = '#2a2a3f'}
          />
        </div>

        <div className="mb-6">
          <label className="block text-xs mb-3" style={{ color: '#8888aa' }}>Environment</label>
          <div className="space-y-2">
            {TEMPLATES.map(t => (
              <button key={t.id} onClick={() => setTemplateId(t.id)}
                className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all"
                style={{
                  background: templateId === t.id ? t.color + '10' : '#0d0d14',
                  border: `1px solid ${templateId === t.id ? t.color + '50' : '#2a2a3f'}`,
                }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: t.color + '15', border: `1px solid ${t.color}30`, color: t.color }}>
                  ◈
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#4a4a6a' }}>{t.desc}</p>
                </div>
                {templateId === t.id && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: t.color }}>
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{ background: 'transparent', border: '1px solid #2a2a3f', color: '#8888aa' }}
            onMouseEnter={e => e.currentTarget.style.color = '#e2e2f0'}
            onMouseLeave={e => e.currentTarget.style.color = '#8888aa'}>
            Cancel
          </button>
          <button onClick={handleCreate} disabled={loading}
            className="btn-cyan flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm">
            {loading
              ? <><Loader size={14} className="animate-spin-slow" /> Provisioning…</>
              : <><Plus size={14} /> Create Workspace</>}
          </button>
        </div>
      </div>
    </div>
  );
}
