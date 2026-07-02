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
  CONFIRMED: 'bg-[#34D07F]/10 text-[#34D07F] border-[#34D07F]/20',
  PENDING: 'bg-[#FF8A3D]/10 text-[#FF8A3D] border-[#FF8A3D]/20',
  FAILED: 'bg-[#FF5B5B]/10 text-[#FF5B5B] border-[#FF5B5B]/20',
  DROPPED: 'bg-[#A69DB7]/10 text-[#A69DB7] border-[#A69DB7]/20',
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
          className="px-3 py-1.5 rounded-full bg-[#0A0618] border border-[#1A1A2E] text-xs text-[#D8D1E6] outline-none cursor-pointer"
        >
          <option value="All">All Chains</option>
          {SUPPORTED_CHAINS.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="px-3 py-1.5 rounded-full bg-[#0A0618] border border-[#1A1A2E] text-xs text-[#D8D1E6] outline-none cursor-pointer"
        >
          <option value="All">All Types</option>
          {TX_TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-1.5 rounded-full bg-[#0A0618] border border-[#1A1A2E] text-xs text-[#D8D1E6] outline-none cursor-pointer"
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
          <div className="rounded-2xl bg-[#0F0D1A] border border-[#1A1A2E]/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1A1A2E]/40">
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6E667E] uppercase tracking-wider">Time</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6E667E] uppercase tracking-wider">Wallet</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6E667E] uppercase tracking-wider">Type</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6E667E] uppercase tracking-wider hidden md:table-cell">Chain</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold text-[#6E667E] uppercase tracking-wider hidden lg:table-cell">Value In</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6E667E] uppercase tracking-wider">Status</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold text-[#6E667E] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A2E]/20">
                  {data.items.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#1A1A2E]/20 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-xs text-[#A69DB7] whitespace-nowrap">{new Date(tx.createdAt).toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono text-[#D8D1E6]">{shortenAddress(tx.walletAddress)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-[#F6F2EA]">{tx.type}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-[#A69DB7]">{chainName(tx.chainId)}</span>
                      </td>
                      <td className="px-4 py-3 text-right hidden lg:table-cell">
                        <span className="text-sm text-[#D8D1E6]">{tx.amountInUsd != null ? formatUsd(tx.amountInUsd) : '—'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusColors[tx.status] || 'bg-[#A69DB7]/10 text-[#A69DB7] border-[#A69DB7]/20'}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => setDetail(tx)}
                            className="px-2.5 py-1.5 rounded-lg text-[10px] font-medium text-[#7B61FF] bg-[#7B61FF]/10 border border-[#7B61FF]/20 hover:bg-[#7B61FF]/20 transition-all cursor-pointer whitespace-nowrap"
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
              <div className="py-16 text-center">
                <p className="text-sm text-[#A69DB7]">No transactions found</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6E667E]">{data.total} transactions · page {page} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-full text-xs font-medium border border-[#1A1A2E] text-[#D8D1E6] disabled:opacity-40 hover:bg-[#1A1A2E]/40 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-full text-xs font-medium border border-[#1A1A2E] text-[#D8D1E6] disabled:opacity-40 hover:bg-[#1A1A2E]/40 transition-all cursor-pointer disabled:cursor-not-allowed"
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
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80]" onClick={() => setDetail(null)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0F0D1A] border-l border-[#1A1A2E] shadow-[0_0_80px_rgba(0,0,0,0.6)] z-[90] overflow-y-auto animate-slide-up-in">
            <div className="sticky top-0 bg-[#0F0D1A] border-b border-[#1A1A2E]/40 px-6 py-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#F6F2EA]">Transaction Detail</h3>
              <button onClick={() => setDetail(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8B8FA3] hover:text-white hover:bg-[#1A1A2E]/40 cursor-pointer">
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-[#1A1A2E]/20">
                <p className="text-[10px] text-[#6E667E] uppercase tracking-wider mb-2">Tx Hash</p>
                <p className="text-xs font-mono text-[#F6F2EA] break-all">{detail.txHash}</p>
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
                  <div key={label} className="p-3 rounded-xl bg-[#1A1A2E]/20">
                    <p className="text-[10px] text-[#6E667E] uppercase tracking-wider">{label}</p>
                    <p className="text-sm font-medium text-[#F6F2EA] mt-0.5 break-all">{value}</p>
                  </div>
                ))}
              </div>

              {detail.errorReason && (
                <div className="p-4 rounded-xl bg-[#FF5B5B]/5 border border-[#FF5B5B]/15">
                  <p className="text-[10px] text-[#FF5B5B] uppercase tracking-wider mb-1.5">Error Reason</p>
                  <p className="text-sm text-[#D8D1E6]">{detail.errorReason}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
