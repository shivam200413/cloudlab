import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { Plus, FileCode2, RefreshCw, Trash2 } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import WorkspaceCard from '../components/WorkspaceCard';
import CreateWorkspaceModal from '../components/CreateWorkspaceModal';
import FreeTierWidget from '../components/FreeTierWidget';
import QuickStats from '../components/QuickStats';
import IDEView from '../components/IDEView';
import { useAuth } from '../context/AuthContext';
import { wsApi } from '../components/api';
import { useRouter } from 'next/router';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [wsList, setWsList] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [activeIDE, setActiveIDE] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  const fetchWs = useCallback(async () => {
    try {
      const { data } = await wsApi.list();
      setWsList(data.workspaces || []);
    } catch {}
    finally { setFetching(false); }
  }, []);

  useEffect(() => { if (user) fetchWs(); }, [user, fetchWs]);

  const onUpdate = (updated) => setWsList(p => p.map(w => w.id === updated.id ? updated : w));
  const onDelete = (id) => setWsList(p => p.filter(w => w.id !== id));
  const onCreate = (ws) => setWsList(p => [ws, ...p]);

  const onTerminate = async () => {
    if (!activeIDE) return;
    try { const { data } = await wsApi.stop(activeIDE.id); onUpdate(data.workspace); } catch {}
    setActiveIDE(null);
  };

  if (authLoading || !user) return null;

  if (activeIDE) return <IDEView workspace={activeIDE} onBack={() => setActiveIDE(null)} onTerminate={onTerminate} />;

  const running = wsList.filter(w => w.status === 'running');
  const total = wsList.length;

  const initials = user.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'CL';

  return (
    <>
      <Head><title>Dashboard — CloudLab</title></Head>
      <div className="flex flex-col min-h-full">
        {/* ── Top header bar ── */}
        <div className="flex items-center justify-between px-8 py-4" style={{ borderBottom: '1px solid #1e1e30' }}>
          <p className="text-white font-medium">
            {greeting()}, <span style={{ color: '#00d4d4' }}>{user.name?.split(' ')[0]}</span>
          </p>
          <div className="flex items-center gap-3">
            {running.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm mono"
                style={{ background: '#00d4d410', border: '1px solid #00d4d430', color: '#00d4d4' }}>
                <span className="w-2 h-2 rounded-full animate-pulse-dot" style={{ background: '#00d4d4' }} />
                {running.length} workspace{running.length > 1 ? 's' : ''} running
              </div>
            )}
            <button onClick={fetchWs} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: '#13131f', border: '1px solid #1e1e30', color: '#8888aa' }}
              onMouseEnter={e => e.currentTarget.style.color = '#e2e2f0'}
              onMouseLeave={e => e.currentTarget.style.color = '#8888aa'}>
              <RefreshCw size={14} />
            </button>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #7c5cfc, #00d4d4)', color: '#fff' }}>
              {initials}
            </div>
          </div>
        </div>

        <div className="flex flex-1 gap-0">
          {/* ── Left main content ── */}
          <div className="flex-1 min-w-0 px-8 py-6 space-y-6">

            {/* ── Hero banner ── */}
            <div className="relative rounded-2xl overflow-hidden p-8"
              style={{ background: 'linear-gradient(135deg, #13131f 0%, #1a1a2e 60%, #0f1535 100%)', border: '1px solid #1e1e30' }}>
              {/* Decorative circle */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full opacity-20"
                style={{ background: 'radial-gradient(circle, #7c5cfc 0%, transparent 70%)', border: '1px solid #7c5cfc40' }} />
              <div className="absolute right-14 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full opacity-30"
                style={{ background: 'radial-gradient(circle, #00d4d4 0%, transparent 70%)' }} />

              <div className="relative max-w-xl">
                <p className="text-xs font-semibold tracking-widest mb-3 mono" style={{ color: '#00d4d4' }}>
                  CLOUD LAB ENVIRONMENT
                </p>
                <h1 className="text-3xl font-bold text-white mb-3 leading-tight">
                  On-demand coding workspaces
                </h1>
                <p className="text-sm leading-relaxed mb-6" style={{ color: '#8888aa' }}>
                  Spin up isolated, pre-configured dev environments in seconds. Full VS Code in your
                  browser, persistent storage, and direct AWS integration.
                </p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setShowCreate(true)}
                    className="btn-cyan flex items-center gap-2 px-5 py-2.5 text-sm">
                    <Plus size={16} />
                    New Workspace
                  </button>
                  <a href="/templates"
                    className="flex items-center gap-2 px-5 py-2.5 text-sm rounded-lg font-medium transition-colors"
                    style={{ background: 'transparent', border: '1px solid #2a2a3f', color: '#e2e2f0' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#00d4d440'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a3f'}>
                    <FileCode2 size={16} />
                    Browse Templates
                  </a>
                </div>
              </div>
            </div>

            {/* ── Workspace list ── */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-white font-semibold text-base">My Workspaces</h2>
                  <p className="text-xs mt-0.5" style={{ color: '#4a4a6a' }}>
                    {total} total · {running.length} running
                  </p>
                </div>
                {wsList.length > 0 && (
                  <button onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
                    style={{ background: '#13131f', border: '1px solid #1e1e30', color: '#8888aa' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#e2e2f0'}
                    onMouseLeave={e => e.currentTarget.style.color = '#8888aa'}>
                    <Trash2 size={14} />
                    Manage
                  </button>
                )}
              </div>

              {fetching ? (
                <div className="space-y-3">
                  {[0, 1].map(i => (
                    <div key={i} className="card h-36 rounded-xl overflow-hidden">
                      <div className="h-full w-full" style={{
                        background: 'linear-gradient(90deg, #13131f 25%, #1e1e30 50%, #13131f 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite'
                      }} />
                    </div>
                  ))}
                </div>
              ) : wsList.length === 0 ? (
                <EmptyState onCreate={() => setShowCreate(true)} />
              ) : (
                <div className="space-y-3">
                  {wsList.map(ws => (
                    <WorkspaceCard key={ws.id} workspace={ws}
                      onUpdate={onUpdate} onDelete={onDelete}
                      onOpenIDE={setActiveIDE} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Right sidebar widgets ── */}
          <div className="hidden xl:flex flex-col gap-4 w-72 shrink-0 px-4 py-6" style={{ borderLeft: '1px solid #1e1e30' }}>
            <FreeTierWidget />
            <QuickStats workspaces={wsList} />
          </div>
        </div>
      </div>

      {showCreate && <CreateWorkspaceModal onClose={() => setShowCreate(false)} onCreate={onCreate} />}
    </>
  );
}

function EmptyState({ onCreate }) {
  return (
    <div className="card rounded-xl p-10 text-center">
      <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
        style={{ background: '#00d4d410', border: '1px solid #00d4d430' }}>
        <FileCode2 size={24} style={{ color: '#00d4d4' }} />
      </div>
      <h3 className="font-semibold text-white mb-2">No workspaces yet</h3>
      <p className="text-sm mb-5" style={{ color: '#4a4a6a' }}>Create your first coding environment to get started.</p>
      <button onClick={onCreate} className="btn-cyan px-5 py-2 text-sm">
        <Plus size={14} className="inline mr-1.5" />
        New Workspace
      </button>
    </div>
  );
}

Dashboard.getLayout = page => <DashboardLayout>{page}</DashboardLayout>;
