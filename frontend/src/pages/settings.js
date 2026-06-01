import Head from 'next/head';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import { User, Key, Shield } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();

  const Section = ({ icon: Icon, title, children }) => (
    <div className="card rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-4" style={{ borderBottom: '1px solid #1e1e30' }}>
        <Icon size={15} style={{ color: '#00d4d4' }} />
        <h2 className="font-medium text-white text-sm">{title}</h2>
      </div>
      <div className="px-6 py-4">{children}</div>
    </div>
  );

  const Row = ({ label, value }) => (
    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid #1e1e3080' }}>
      <span className="text-sm" style={{ color: '#8888aa' }}>{label}</span>
      <span className="text-sm mono text-white">{value}</span>
    </div>
  );

  return (
    <>
      <Head><title>Settings — CloudLab</title></Head>
      <div className="px-8 py-6 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-white">Settings</h1>
          <p className="text-sm mt-1" style={{ color: '#4a4a6a' }}>Manage your account and workspace configuration</p>
        </div>
        <div className="space-y-4">
          <Section icon={User} title="Profile">
            <Row label="Name" value={user?.name || '—'} />
            <Row label="Email" value={user?.email || '—'} />
            <Row label="Plan" value={user?.plan || 'Free'} />
            <Row label="User ID" value={user?.id || '—'} />
          </Section>
          <Section icon={Key} title="IDE Password">
            <p className="text-sm mb-3" style={{ color: '#8888aa' }}>
              The code-server password is set via <code className="px-1.5 py-0.5 rounded mono text-xs"
                style={{ background: '#00d4d415', color: '#00d4d4' }}>CODE_SERVER_PASSWORD</code> in your backend <code
                className="px-1.5 py-0.5 rounded mono text-xs" style={{ background: '#1e1e30', color: '#8888aa' }}>.env</code> file.
            </p>
            <div className="px-4 py-3 rounded-lg mono text-sm" style={{ background: '#0d0d14', border: '1px solid #1e1e30', color: '#00d4d4' }}>
              CODE_SERVER_PASSWORD=cloudlab123
            </div>
          </Section>
          <Section icon={Shield} title="Security">
            <p className="text-sm" style={{ color: '#8888aa' }}>
              JWT tokens expire after 7 days. Change <code className="px-1 py-0.5 rounded mono text-xs"
                style={{ background: '#1e1e30', color: '#8888aa' }}>JWT_EXPIRES</code> in backend/.env to adjust.
            </p>
          </Section>
        </div>
      </div>
    </>
  );
}
Settings.getLayout = page => <DashboardLayout>{page}</DashboardLayout>;
