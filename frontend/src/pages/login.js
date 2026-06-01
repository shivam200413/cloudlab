import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Terminal, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@cloudlab.local');
  const [password, setPassword] = useState('cloudlab123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>Sign In — CloudLab</title></Head>
      <div className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ background: '#0d0d14' }}>
        {/* Grid bg */}
        <div className="fixed inset-0 pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(0,212,212,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,212,0.03) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        {/* Glow */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-64 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(124,92,252,0.08) 0%, transparent 70%)' }} />

        <div className="relative w-full max-w-sm animate-fade-up">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: '#00d4d415', border: '1px solid #00d4d430' }}>
              <Terminal size={22} style={{ color: '#00d4d4' }} />
            </div>
            <h1 className="text-xl font-bold text-white">CloudLab</h1>
            <p className="text-sm mt-1" style={{ color: '#4a4a6a' }}>Sign in to your environment</p>
          </div>

          <div className="rounded-2xl p-6" style={{ background: '#13131f', border: '1px solid #1e1e30' }}>
            {error && (
              <div className="mb-4 px-4 py-3 rounded-lg text-sm"
                style={{ background: '#ff525215', border: '1px solid #ff525230', color: '#ff5252' }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs mb-2" style={{ color: '#8888aa' }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full px-4 py-2.5 rounded-lg text-sm text-white outline-none transition-colors"
                  style={{ background: '#0d0d14', border: '1px solid #2a2a3f' }}
                  onFocus={e => e.target.style.borderColor = '#00d4d440'}
                  onBlur={e => e.target.style.borderColor = '#2a2a3f'}
                  placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-xs mb-2" style={{ color: '#8888aa' }}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full px-4 py-2.5 rounded-lg text-sm text-white outline-none transition-colors"
                  style={{ background: '#0d0d14', border: '1px solid #2a2a3f' }}
                  onFocus={e => e.target.style.borderColor = '#00d4d440'}
                  onBlur={e => e.target.style.borderColor = '#2a2a3f'}
                  placeholder="••••••••" />
              </div>
              <button type="submit" disabled={loading}
                className="btn-cyan w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm mt-2">
                {loading ? <><Loader size={14} className="animate-spin-slow" /> Signing in…</> : 'Sign In'}
              </button>
            </form>
            <p className="text-center text-xs mt-5" style={{ color: '#4a4a6a' }}>
              No account?{' '}
              <Link href="/register" className="transition-colors" style={{ color: '#00d4d4' }}
                onMouseEnter={e => e.currentTarget.style.color = '#00bcbc'}
                onMouseLeave={e => e.currentTarget.style.color = '#00d4d4'}>
                Register
              </Link>
            </p>
          </div>
          <p className="text-center text-xs mt-4" style={{ color: '#2a2a3f' }}>
            Default: admin@cloudlab.local / cloudlab123
          </p>
        </div>
      </div>
    </>
  );
}
