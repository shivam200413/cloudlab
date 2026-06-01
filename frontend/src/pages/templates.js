import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Loader } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { wsApi } from '../components/api';

const TEMPLATES = [
  {
    id: 'nodejs', color: '#00d4d4', name: 'Node.js 20 LTS',
    desc: 'Modern JavaScript runtime with npm, yarn, and pnpm. Perfect for web apps, REST APIs, and tooling.',
    tags: ['JavaScript', 'TypeScript', 'npm', 'yarn', 'pnpm'],
    features: ['Node.js 20', 'npm / yarn / pnpm', 'Git + zsh', 'VS Code (code-server)', 'ESLint + Prettier'],
  },
  {
    id: 'python', color: '#7c5cfc', name: 'Python 3.11',
    desc: 'Full Python stack with pip, virtualenv, and Jupyter. Great for data science, ML, and scripting.',
    tags: ['Python', 'Jupyter', 'NumPy', 'Pandas', 'pip'],
    features: ['Python 3.11', 'pip + virtualenv', 'Jupyter Notebook', 'NumPy / Pandas / Matplotlib', 'VS Code (code-server)'],
  },
  {
    id: 'fullstack', color: '#ffab40', name: 'Full Stack',
    desc: 'Node.js + Python + PostgreSQL client in one container. For multi-runtime projects.',
    tags: ['Node.js', 'Python', 'PostgreSQL', 'Redis'],
    features: ['Node.js 20 + Python 3.11', 'PostgreSQL client', 'Redis CLI', 'Git + zsh', 'VS Code (code-server)'],
  },
];

export default function Templates() {
  const router = useRouter();
  const [launching, setLaunching] = useState(null);

  const launch = async id => {
    setLaunching(id);
    try {
      await wsApi.create(undefined, id);
      router.push('/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create workspace');
      setLaunching(null);
    }
  };

  return (
    <>
      <Head><title>Templates — CloudLab</title></Head>
      <div className="px-8 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-white">Environment Templates</h1>
          <p className="text-sm mt-1" style={{ color: '#4a4a6a' }}>
            Pre-configured Docker images with VS Code (code-server). Launch in seconds.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TEMPLATES.map(t => (
            <div key={t.id} className="card card-hover rounded-xl p-6 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: t.color + '15', border: `1px solid ${t.color}30` }}>
                ◈
              </div>
              <div>
                <h2 className="font-semibold text-white">{t.name}</h2>
                <p className="text-sm mt-1 leading-relaxed" style={{ color: '#4a4a6a' }}>{t.desc}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {t.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded mono"
                    style={{ background: t.color + '10', color: t.color, border: `1px solid ${t.color}25` }}>
                    {tag}
                  </span>
                ))}
              </div>
              <ul className="space-y-1.5 flex-1">
                {t.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs" style={{ color: '#8888aa' }}>
                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: t.color }} />
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => launch(t.id)} disabled={!!launching}
                className="w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                style={{ background: t.color + '15', color: t.color, border: `1px solid ${t.color}30` }}
                onMouseEnter={e => !launching && (e.currentTarget.style.background = t.color + '25')}
                onMouseLeave={e => !launching && (e.currentTarget.style.background = t.color + '15')}>
                {launching === t.id ? <><Loader size={14} className="animate-spin-slow" /> Launching…</> : 'Launch Workspace'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
Templates.getLayout = page => <DashboardLayout>{page}</DashboardLayout>;
