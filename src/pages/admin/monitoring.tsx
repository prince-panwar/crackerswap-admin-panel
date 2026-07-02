import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { HealthComponent, PlatformHealth } from './api-types';
import { AdminErrorState, AdminLoadingState } from './components/AdminStates';

const statusStyle: Record<HealthComponent['status'], { bg: string; text: string; border: string; dot: string }> = {
  up: { bg: 'bg-[#34D07F]/10', text: 'text-[#34D07F]', border: 'border-[#34D07F]/20', dot: 'bg-[#34D07F]' },
  down: { bg: 'bg-[#FF5B5B]/10', text: 'text-[#FF5B5B]', border: 'border-[#FF5B5B]/20', dot: 'bg-[#FF5B5B]' },
  skipped: { bg: 'bg-[#A69DB7]/10', text: 'text-[#A69DB7]', border: 'border-[#A69DB7]/20', dot: 'bg-[#A69DB7]' },
};

const latencyLabel = (c: HealthComponent) =>
  c.latencyMs != null ? `${c.latencyMs}ms` : (c.detail ?? '—');

export default function PlatformMonitoringPage() {
  const [health, setHealth] = useState<PlatformHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    api
      .get<PlatformHealth>('/admin/platform/health')
      .then(setHealth)
      .catch((e) => setError(e?.message || 'Failed to load platform health'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <AdminLoadingState />;
  if (error || !health) return <AdminErrorState onRetry={load} message={error} />;

  const rpc = health.components.filter((c) => c.name.startsWith('rpc:'));
  const deps = health.components.filter((c) => !c.name.startsWith('rpc:'));

  return (
    <div className="space-y-6">
      {/* Overall banner */}
      <div className="rounded-2xl bg-[#0F0D1A] border border-[#1A1A2E]/60 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`w-3 h-3 rounded-full ${health.status === 'ok' ? 'bg-[#34D07F]' : 'bg-[#FF8A3D]'}`} />
          <span className="text-sm font-semibold text-[#F6F2EA]">
            Platform {health.status === 'ok' ? 'Operational' : 'Degraded'}
          </span>
        </div>
        <span className="text-xs text-[#6E667E]">
          Checked {new Date(health.checkedAt).toLocaleTimeString()}
        </span>
      </div>

      {/* Dependency Status (DB, Redis, CoinGecko, Uniswap API, crons) */}
      <div className="rounded-2xl bg-[#0F0D1A] border border-[#1A1A2E]/60 overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1A1A2E]/40">
          <h3 className="text-sm font-semibold text-[#F6F2EA]">Dependency Status</h3>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {deps.map((svc) => (
            <div key={svc.name} className="p-4 rounded-xl bg-[#1A1A2E]/20 flex flex-col items-center text-center">
              <span className={`w-3 h-3 rounded-full ${statusStyle[svc.status].dot}`} />
              <p className="text-sm font-medium text-[#D8D1E6] mt-2">{svc.name}</p>
              <span className={`inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusStyle[svc.status].bg} ${statusStyle[svc.status].text} ${statusStyle[svc.status].border}`}>
                {svc.status}
              </span>
              <p className="text-[10px] text-[#6E667E] mt-1.5">{latencyLabel(svc)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chain / RPC Status */}
      <div className="rounded-2xl bg-[#0F0D1A] border border-[#1A1A2E]/60 overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1A1A2E]/40">
          <h3 className="text-sm font-semibold text-[#F6F2EA]">Chain / RPC Status</h3>
        </div>
        <div className="p-4 space-y-2">
          {rpc.map((svc) => (
            <div key={svc.name} className="flex items-center justify-between p-3 rounded-xl bg-[#1A1A2E]/20">
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${statusStyle[svc.status].dot}`} />
                <div>
                  <p className="text-sm font-medium text-[#D8D1E6]">{svc.name.replace('rpc:', '')}</p>
                  <p className="text-[10px] text-[#6E667E] mt-0.5">Latency: {latencyLabel(svc)}</p>
                </div>
              </div>
              <span className={`text-xs font-medium ${statusStyle[svc.status].text}`}>{svc.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/*
        NO API — commented out:
          - Sync Jobs progress bars (health only reports crons on/off, not per-job progress)
          - Quote Service "Failed Quotes" / "Last Failure" tiles (not tracked)
          - "Recent System Events" list (no system-events endpoint)
      */}
    </div>
  );
}
