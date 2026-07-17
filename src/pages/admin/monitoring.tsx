import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { HealthComponent, PlatformHealth } from './api-types';
import { AdminErrorState, AdminLoadingState } from './components/AdminStates';

const statusStyle: Record<HealthComponent['status'], { bg: string; text: string; border: string; dot: string }> = {
  up: { bg: 'bg-success-soft', text: 'text-success', border: 'border-success-soft', dot: 'bg-success' },
  down: { bg: 'bg-danger-soft', text: 'text-danger', border: 'border-danger-soft', dot: 'bg-danger' },
  skipped: { bg: 'bg-surface-inset', text: 'text-fg-tertiary', border: 'border-card-border', dot: 'bg-fg-tertiary' },
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
      <div className="glass-card rounded-2xl px-5 py-4 flex items-center justify-between">
        <div className="relative flex items-center gap-3">
          <span className={`w-3 h-3 rounded-full ${health.status === 'ok' ? 'bg-success' : 'bg-warning'}`} />
          <span className="text-sm font-semibold text-fg">
            Platform {health.status === 'ok' ? 'Operational' : 'Degraded'}
          </span>
        </div>
        <span className="relative text-xs text-fg-subtle">
          Checked {new Date(health.checkedAt).toLocaleTimeString()}
        </span>
      </div>

      {/* Dependency Status (DB, Redis, CoinGecko, Uniswap API, crons) */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="relative px-5 py-4 border-b border-card-border">
          <h3 className="text-sm font-semibold text-fg">Dependency Status</h3>
        </div>
        <div className="relative p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {deps.map((svc) => (
            <div key={svc.name} className="p-4 rounded-xl bg-surface-inset flex flex-col items-center text-center">
              <span className={`w-3 h-3 rounded-full ${statusStyle[svc.status].dot}`} />
              <p className="text-sm font-medium text-fg-secondary mt-2">{svc.name}</p>
              <span className={`inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusStyle[svc.status].bg} ${statusStyle[svc.status].text} ${statusStyle[svc.status].border}`}>
                {svc.status}
              </span>
              <p className="text-[10px] text-fg-subtle mt-1.5">{latencyLabel(svc)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chain / RPC Status */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="relative px-5 py-4 border-b border-card-border">
          <h3 className="text-sm font-semibold text-fg">Chain / RPC Status</h3>
        </div>
        <div className="relative p-4 space-y-2">
          {rpc.map((svc) => (
            <div key={svc.name} className="flex items-center justify-between p-3 rounded-xl bg-surface-inset">
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${statusStyle[svc.status].dot}`} />
                <div>
                  <p className="text-sm font-medium text-fg-secondary">{svc.name.replace('rpc:', '')}</p>
                  <p className="text-[10px] text-fg-subtle mt-0.5">Latency: {latencyLabel(svc)}</p>
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
