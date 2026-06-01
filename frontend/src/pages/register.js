import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Terminal, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      await register(form.email, form.password, form.name);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const inputStyle = { background: '#0d0d14', border: '1px solid #2a2a3f' };

  return (
    <>
      <Head><title>Register — CloudLab</title></Head>
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0d0d14' }}>
        <div className="fixed inset-0 pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(0,212,212,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,212,0.03) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative w-full max-w-sm animate-fade-up">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: '#00d4d415', border: '1px solid #00d4d430' }}>
              <Terminal size={22} style={{ color: '#00d4d4' }} />
            </div>
            <h1 className="text-xl font-bold text-white">Create account</h1>
            <p className="text-sm mt-1" style={{ color: '#4a4a6a' }}>Start your free Cloud Lab</p>
          </div>
          <div className="rounded-2xl p-6" style={{ background: '#13131f', border: '1px solid #1e1e30' }}>
            {error && (
              <div className="mb-4 px-4 py-3 rounded-lg text-sm"
                style={{ background: '#ff525215', border: '1px solid #ff525230', color: '#ff5252' }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Aryan Kumar' },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'you@example.com' },
                { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs mb-2" style={{ color: '#8888aa' }}>{label}</label>
                  <input type={type} value={form[key]} onChange={set(key)} required placeholder={placeholder}
                    className="w-full px-4 py-2.5 rounded-lg text-sm text-white outline-none transition-colors"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#00d4d440'}
                    onBlur={e => e.target.style.borderColor = '#2a2a3f'} />
                </div>
              ))}
              <button type="submit" disabled={loading}
                className="btn-cyan w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm mt-2">
                {loading ? <><Loader size={14} className="animate-spin-slow" /> Creating…</> : 'Create Account'}
              </button>
            </form>
            <p className="text-center text-xs mt-5" style={{ color: '#4a4a6a' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#00d4d4' }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
