import { useEffect, useState } from 'react';
import { Monitor } from 'lucide-react';
import { metricsApi } from './api';

const ROWS = [
  { key: 'ram',       label: 'RAM',       used: 200,  total: 1024, unit: 'MB', color: '#00d4d4', fmt: v => `${v}MB` },
  { key: 'cpu',       label: 'CPU',       used: 12,   total: 100,  unit: '%',  color: '#7c5cfc', fmt: v => `${v}%` },
  { key: 'storage',   label: 'Storage',   used: 4.1,  total: 30,   unit: 'GB', color: '#00e676', fmt: v => `${v}GB` },
  { key: 'bandwidth', label: 'Bandwidth', used: 8.2,  total: 100,  unit: 'GB', color: '#ffab40', fmt: v => `${v}GB` },
];

export default function FreeTierWidget() {
  const [region] = useState('ap-south-1 · Mumbai');
  const [data, setData] = useState(ROWS);

  useEffect(() => {
    metricsApi.host().then(({ data: d }) => {
      if (d?.freeTier) {
        setData([
          { ...ROWS[0], used: Math.round(d.freeTier.storageUsedGB * 6.8) },
          { ...ROWS[1], used: 12 },
          { ...ROWS[2], used: d.freeTier.storageUsedGB },
          { ...ROWS[3], used: d.freeTier.dataTransferGB },
        ]);
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="card rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Monitor size={14} style={{ color: '#00d4d4' }} />
        <span className="text-xs font-semibold tracking-widest mono" style={{ color: '#00d4d4' }}>
          AWS FREE TIER
        </span>
      </div>

      <div className="space-y-3">
        {data.map(row => {
          const pct = Math.min(100, Math.round((row.used / row.total) * 100));
          return (
            <div key={row.key}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span style={{ color: '#8888aa' }}>{row.label}</span>
                <span className="mono" style={{ color: '#8888aa' }}>
                  {row.fmt(row.used)} / {row.fmt(row.total)}
                </span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${pct}%`, background: row.color }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3" style={{ borderTop: '1px solid #1e1e30' }}>
        <p className="text-xs" style={{ color: '#4a4a6a' }}>REGION</p>
        <p className="text-sm font-medium mt-0.5" style={{ color: '#8888aa' }}>{region}</p>
      </div>
    </div>
  );
}
