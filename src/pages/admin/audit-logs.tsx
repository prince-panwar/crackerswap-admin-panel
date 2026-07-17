// Repurposed from the mock "Audit Logs" page (which had no backend) into the
// Transactions feed backed by GET /admin/transactions.
import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { chainName, formatUsd, shortenAddress } from '@/lib/format';
import { AdminErrorState, AdminLoadingState } from './components/AdminStates';
import {
  SUPPORTED_CHAINS,
  TX_STATUSES,
  TX_TYPES,
  type PaginatedTransactions,
  type TransactionResponse,
} from './api-types';

const PAGE_SIZE = 20;

const statusColors: Record<string, string> = {
  CONFIRMED: 'bg-success-soft text-success border-success-soft',
  PENDING: 'bg-warning-soft text-warning border-warning-soft',
  FAILED: 'bg-danger-soft text-danger border-danger-soft',
  DROPPED: 'bg-surface-inset text-fg-tertiary border-card-border',
};

export default function TransactionsPage() {
  const [chainFilter, setChainFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PaginatedTransactions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detail, setDetail] = useState<TransactionResponse | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    api
      .get<PaginatedTransactions>('/admin/transactions', {
        chainId: chainFilter === 'All' ? undefined : chainFilter,
        type: typeFilter === 'All' ? undefined : typeFilter,
        status: statusFilter === 'All' ? undefined : statusFilter,
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
      })
      .then(setData)
      .catch((e) => setError(e?.message || 'Failed to load transactions'))
      .finally(() => setLoading(false));
  }, [chainFilter, typeFilter, statusFilter, page]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
        <select
          value={chainFilter}
          onChange={(e) => { setChainFilter(e.target.value); setPage(1); }}
          className="px-3 py-1.5 rounded-full bg-surface border border-card-border text-xs text-fg-secondary outline-none cursor-pointer"
        >
          <option value="All">All Chains</option>
          {SUPPORTED_CHAINS.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="px-3 py-1.5 rounded-full bg-surface border border-card-border text-xs text-fg-secondary outline-none cursor-pointer"
        >
          <option value="All">All Types</option>
          {TX_TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-1.5 rounded-full bg-surface border border-card-border text-xs text-fg-secondary outline-none cursor-pointer"
        >
          <option value="All">All Statuses</option>
          {TX_STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
        </select>
        {/* NO API: CSV export removed. */}
      </div>

      {loading && <AdminLoadingState />}
      {!loading && error && <AdminErrorState onRetry={load} message={error} />}

      {!loading && !error && data && (
        <>
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="relative overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-card-border">
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-fg-subtle uppercase tracking-wider">Time</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-fg-subtle uppercase tracking-wider">Wallet</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-fg-subtle uppercase tracking-wider">Type</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-fg-subtle uppercase tracking-wider hidden md:table-cell">Chain</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold text-fg-subtle uppercase tracking-wider hidden lg:table-cell">Value In</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-fg-subtle uppercase tracking-wider">Status</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold text-fg-subtle uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border">
                  {data.items.map((tx) => (
                    <tr key={tx.id} className="hover:bg-surface transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-xs text-fg-tertiary whitespace-nowrap">{new Date(tx.createdAt).toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono text-fg-secondary">{shortenAddress(tx.walletAddress)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-fg">{tx.type}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-fg-tertiary">{chainName(tx.chainId)}</span>
                      </td>
                      <td className="px-4 py-3 text-right hidden lg:table-cell">
                        <span className="text-sm text-fg-secondary">{tx.amountInUsd != null ? formatUsd(tx.amountInUsd) : '—'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusColors[tx.status] || 'bg-surface-inset text-fg-tertiary border-card-border'}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => setDetail(tx)}
                            className="px-2.5 py-1.5 rounded-lg text-[10px] font-medium text-accent bg-accent-soft border border-accent-soft hover:brightness-110 transition-all cursor-pointer whitespace-nowrap"
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data.items.length === 0 && (
              <div className="relative py-16 text-center">
                <p className="text-sm text-fg-tertiary">No transactions found</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-fg-subtle">{data.total} transactions · page {page} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-full text-xs font-medium border border-card-border text-fg-secondary disabled:opacity-40 hover:bg-surface transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-full text-xs font-medium border border-card-border text-fg-secondary disabled:opacity-40 hover:bg-surface transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Detail Drawer */}
      {detail && (
        <>
          <div className="fixed inset-0 bg-overlay-backdrop backdrop-blur-sm z-[80]" onClick={() => setDetail(null)} />
          <div className="glass-card fixed top-0 right-0 h-full w-full max-w-md z-[90] overflow-y-auto animate-slide-up-in">
            <div className="sticky top-0 bg-surface-strong backdrop-blur-xl border-b border-card-border px-6 py-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-fg">Transaction Detail</h3>
              <button onClick={() => setDetail(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-fg-muted hover:text-fg hover:bg-surface cursor-pointer">
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>
            <div className="relative p-6 space-y-4">
              <div className="p-4 rounded-xl bg-surface-inset">
                <p className="text-[10px] text-fg-subtle uppercase tracking-wider mb-2">Tx Hash</p>
                <p className="text-xs font-mono text-fg break-all">{detail.txHash}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Type', detail.type],
                  ['Status', detail.status],
                  ['Chain', chainName(detail.chainId)],
                  ['Protocol', detail.protocol ?? '—'],
                  ['Wallet', shortenAddress(detail.walletAddress)],
                  ['Block', detail.blockNumber ?? '—'],
                  ['Value In', detail.amountInUsd != null ? formatUsd(detail.amountInUsd) : '—'],
                  ['Value Out', detail.amountOutUsd != null ? formatUsd(detail.amountOutUsd) : '—'],
                  ['Gas (USD)', detail.gasCostUsd != null ? formatUsd(detail.gasCostUsd) : '—'],
                  ['Confirmed', detail.confirmedAt ? new Date(detail.confirmedAt).toLocaleString() : '—'],
                ].map(([label, value]) => (
                  <div key={label} className="p-3 rounded-xl bg-surface-inset">
                    <p className="text-[10px] text-fg-subtle uppercase tracking-wider">{label}</p>
                    <p className="text-sm font-medium text-fg mt-0.5 break-all">{value}</p>
                  </div>
                ))}
              </div>

              {detail.errorReason && (
                <div className="p-4 rounded-xl bg-danger-soft border border-danger-soft">
                  <p className="text-[10px] text-danger uppercase tracking-wider mb-1.5">Error Reason</p>
                  <p className="text-sm text-fg-secondary">{detail.errorReason}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
