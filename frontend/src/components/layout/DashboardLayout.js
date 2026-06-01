import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutGrid, FileCode2, Settings, CreditCard,
  LogOut, Menu, X, Terminal
} from 'lucide-react';

const NAV = [
  { href: '/dashboard', icon: LayoutGrid, label: 'My Workspaces' },
  { href: '/templates', icon: FileCode2, label: 'Templates' },
  { href: '/settings', icon: Settings, label: 'Settings' },
  { href: '/billing', icon: CreditCard, label: 'Billing — Free Tier', badge: 'FREE' },
];

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'CL';

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0d0d14' }}>
      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex flex-col w-64
          transition-transform duration-200 lg:static lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ background: '#0f0f1a', borderRight: '1px solid #1e1e30' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid #1e1e30' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#00d4d420', border: '1px solid #00d4d440' }}>
            <Terminal size={16} style={{ color: '#00d4d4' }} />
          </div>
          <div>
            <p className="font-semibold text-white text-sm leading-tight">CloudLab</p>
            <p className="text-xs" style={{ color: '#4a4a6a' }}>v2.1.0-beta</p>
          </div>
          <button className="ml-auto lg:hidden" onClick={() => setOpen(false)} style={{ color: '#4a4a6a' }}>
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ href, icon: Icon, label, badge }) => {
            const active = router.pathname === href;
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${active ? 'nav-active' : ''}`}
                style={!active ? { color: '#8888aa' } : {}}
              >
                <Icon size={16} />
                <span className="flex-1">{label}</span>
                {badge && (
                  <span className="text-xs px-1.5 py-0.5 rounded font-semibold"
                    style={{ background: '#00d4d420', color: '#00d4d4', fontSize: '10px' }}>
                    {badge}
                  </span>
                )}
                {href === '/dashboard' && active && (
                  <span className="text-xs w-5 h-5 rounded flex items-center justify-center font-semibold"
                    style={{ background: '#00d4d4', color: '#0d0d14' }}>
                    2
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-3 pb-4" style={{ borderTop: '1px solid #1e1e30', paddingTop: '12px' }}>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ background: '#13131f' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #7c5cfc, #00d4d4)', color: '#fff' }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
              <p className="text-xs truncate" style={{ color: '#4a4a6a' }}>Student Plan</p>
            </div>
            <button onClick={logout} className="transition-colors"
              style={{ color: '#4a4a6a' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ff5252'}
              onMouseLeave={e => e.currentTarget.style.color = '#4a4a6a'}
              title="Sign out">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay mobile */}
      {open && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-3 h-14 px-4" style={{ borderBottom: '1px solid #1e1e30', background: '#0f0f1a' }}>
          <button onClick={() => setOpen(true)} style={{ color: '#8888aa' }}><Menu size={20} /></button>
          <span className="font-semibold text-white">CloudLab</span>
        </div>
        {children}
      </div>
    </div>
  );
}
