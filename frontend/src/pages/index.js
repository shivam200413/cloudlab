import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading) router.replace(user ? '/dashboard' : '/login');
  }, [user, loading, router]);
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d0d14' }}>
      <div className="w-8 h-8 border-2 border-cyan rounded-full border-t-transparent animate-spin" />
    </div>
  );
}
