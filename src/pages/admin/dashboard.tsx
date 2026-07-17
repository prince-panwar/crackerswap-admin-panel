import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatCompact, formatUsd } from '@/lib/format';
import type { DashboardMetrics, HealthComponent } from './api-types';
import { AdminErrorState, AdminLoadingState } from './components/AdminStates';

const componentDot: Record<HealthComponent['status'], string> = {
  up: 'bg-success',
  down: 'bg-danger',
  skipped: 'bg-fg-tertiary',
};

const componentText: Record<HealthComponent['status'], string> = {
  up: 'text-success',
  down: 'text-danger',
  skipped: 'text-fg-tertiary',
};

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    api
      .get<DashboardMetrics>('/admin/dashboard')
      .then(setMetrics)
      .catch((e) => setError(e?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <AdminLoadingState />;
  if (error || !metrics) return <AdminErrorState onRetry={load} message={error} />;

  const apiHealthy = !metrics.apiStatuses.some((c) => c.status === 'down');

  // Only metrics backed by the /admin/dashboard endpoint are shown.
  // Colors: `accent` (violet) for neutral/volume metrics, `warning` (amber)
  // for the "Featured" star (a natural fit for a favorite/star icon, and
  // keeps some variety instead of every card reading identically violet),
  // `success`/`warning` for the health-dependent API Status card.
  const dashboardMetrics = [
    { label: 'Listed Tokens', value: String(metrics.listedTokens), icon: 'ri-coin-line', color: 'text-accent', bg: 'bg-accent-soft' },
    { label: 'Featured Tokens', value: String(metrics.featuredTokens), icon: 'ri-star-line', color: 'text-warning', bg: 'bg-warning-soft' },
    { label: '24H Swap Volume', value: formatUsd(metrics.swapVolume24hUsd), icon: 'ri-swap-box-line', color: 'text-success', bg: 'bg-success-soft' },
    { label: '24H Swaps', value: formatCompact(metrics.swaps24h), icon: 'ri-exchange-line', color: 'text-accent', bg: 'bg-accent-soft' },
    { label: 'Active Wallets (24H)', value: formatCompact(metrics.connectedWallets24h), icon: 'ri-wallet-3-line', color: 'text-accent', bg: 'bg-accent-soft' },
    { label: 'API Status', value: apiHealthy ? 'Healthy' : 'Degraded', icon: 'ri-cloud-line', color: apiHealthy ? 'text-success' : 'text-warning', bg: apiHealthy ? 'bg-success-soft' : 'bg-warning-soft' },
    // NO API: "Pending Review", "Hidden / Flagged", and "Data Sync" have no
    // backend metric (no review-queue / status-count endpoint).
  ];

  return (
    <div className="space-y-6">
      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {dashboardMetrics.map((metric) => (
          <div
            key={metric.label}
            className="glass-card rounded-2xl p-5 transition-all hover:border-fg-subtle"
          >
            <div className="relative flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-xl ${metric.bg} flex items-center justify-center`}>
                <i className={`${metric.icon} ${metric.color} text-base`}></i>
              </div>
              <span className="text-xs text-fg-tertiary font-medium">{metric.label}</span>
            </div>
            <p className="relative text-2xl font-bold text-fg">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Platform Health — from /admin/dashboard apiStatuses */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="relative px-5 py-4 border-b border-card-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-fg">Platform Health</h3>
          <span className="text-xs text-fg-subtle">
            Checked {new Date(metrics.generatedAt).toLocaleTimeString()}
          </span>
        </div>
        <div className="relative p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {metrics.apiStatuses.map((svc) => (
            <div key={svc.name} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-surface transition-colors">
              <div className="flex items-center gap-2.5">
                <span className={`w-2 h-2 rounded-full ${componentDot[svc.status]}`} />
                <span className="text-sm text-fg-secondary">{svc.name}</span>
              </div>
              <span className={`text-xs font-medium ${componentText[svc.status]}`}>
                {svc.status}
                {svc.latencyMs != null ? ` · ${svc.latencyMs}ms` : ''}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/*
        NO API — the following dashboard widgets have no backing endpoint and
        are intentionally commented out:
          - "Recent Admin Actions" (no audit-log API)
          - "System Events" (no system-events API)
          - "Token Review Summary" (no review-queue API)
      */}
    </div>
  );
}
