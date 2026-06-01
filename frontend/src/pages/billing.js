import Head from 'next/head';
import DashboardLayout from '../components/layout/DashboardLayout';
import { CheckCircle, CreditCard } from 'lucide-react';

const LIMITS = [
  { service: 'EC2 t2.micro', limit: '750 hrs/mo', note: '1 always-on instance', color: '#00d4d4' },
  { service: 'EBS Storage',  limit: '30 GB SSD',  note: 'Workspace persistent storage', color: '#7c5cfc' },
  { service: 'S3 Storage',   limit: '5 GB',       note: 'Backups & exports', color: '#00e676' },
  { service: 'Data Transfer', limit: '100 GB/mo', note: 'IDE traffic included', color: '#ffab40' },
  { service: 'AWS Cognito',  limit: '50,000 MAU', note: 'Auth users (if enabled)', color: '#00d4d4' },
  { service: 'AWS SES',      limit: '62,000/mo',  note: 'Email notifications', color: '#7c5cfc' },
];

export default function Billing() {
  return (
    <>
      <Head><title>Billing — CloudLab</title></Head>
      <div className="px-8 py-6 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-white">Billing</h1>
          <p className="text-sm mt-1" style={{ color: '#4a4a6a' }}>You are on the AWS Free Tier — no charges for 12 months.</p>
        </div>

        <div className="card rounded-xl p-5 mb-4 flex items-start gap-3"
          style={{ borderColor: '#00e67630' }}>
          <CheckCircle size={18} style={{ color: '#00e676', flexShrink: 0, marginTop: 2 }} />
          <div>
            <p className="font-medium text-white text-sm">Free Tier Active</p>
            <p className="text-sm mt-0.5" style={{ color: '#4a4a6a' }}>
              AWS Free Tier is active for 12 months from account creation. CloudLab only uses free-tier services.
            </p>
          </div>
        </div>

        <div className="card rounded-xl overflow-hidden mb-4">
          <div className="flex items-center gap-2 px-6 py-4" style={{ borderBottom: '1px solid #1e1e30' }}>
            <CreditCard size={15} style={{ color: '#00d4d4' }} />
            <h2 className="font-medium text-white text-sm">Free Tier Limits</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #1e1e30', background: '#0d0d14' }}>
                {['Service', 'Free Limit', 'Used For'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-medium" style={{ color: '#4a4a6a' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LIMITS.map((row, i) => (
                <tr key={row.service} style={{ borderBottom: i < LIMITS.length - 1 ? '1px solid #1e1e30' : 'none' }}>
                  <td className="px-6 py-3 text-sm mono text-white">{row.service}</td>
                  <td className="px-6 py-3 text-sm mono font-medium" style={{ color: row.color }}>{row.limit}</td>
                  <td className="px-6 py-3 text-sm" style={{ color: '#4a4a6a' }}>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card rounded-xl p-5">
          <h3 className="font-medium text-white text-sm mb-3">Estimated cost after free tier</h3>
          <ul className="space-y-2 text-sm" style={{ color: '#8888aa' }}>
            <li className="flex justify-between"><span>EC2 t2.micro (always on)</span><span className="mono">~$8.50/mo</span></li>
            <li className="flex justify-between"><span>EBS 30GB gp2</span><span className="mono">~$3.00/mo</span></li>
            <li className="flex justify-between"><span>Data transfer (over 100GB)</span><span className="mono">$0.09/GB</span></li>
            <li className="flex justify-between pt-2 text-white font-medium" style={{ borderTop: '1px solid #1e1e30' }}>
              <span>Total estimate</span><span className="mono" style={{ color: '#00d4d4' }}>~$11–15/mo</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
Billing.getLayout = page => <DashboardLayout>{page}</DashboardLayout>;
