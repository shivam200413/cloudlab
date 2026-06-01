import { Zap, Clock, HardDrive } from 'lucide-react';

export default function QuickStats({ workspaces = [] }) {
  const running = workspaces.filter(w => w.status === 'running').length;
  const total = workspaces.length;

  const stats = [
    { icon: Zap, label: 'Running', value: running, color: '#00e676' },
    { icon: HardDrive, label: 'Total Workspaces', value: total, color: '#00d4d4' },
    { icon: Clock, label: 'Free Hours Left', value: '738h', color: '#7c5cfc' },
  ];

  return (
    <div className="card rounded-xl p-4">
      <p className="text-xs font-semibold tracking-widest mono mb-4" style={{ color: '#4a4a6a' }}>
        QUICK STATS
      </p>
      <div className="space-y-3">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: color + '15', border: `1px solid ${color}30` }}>
                <Icon size={13} style={{ color }} />
              </div>
              <span className="text-xs" style={{ color: '#8888aa' }}>{label}</span>
            </div>
            <span className="text-sm font-semibold mono" style={{ color: '#e2e2f0' }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
