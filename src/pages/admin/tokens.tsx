import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { chainName, shortenAddress } from '@/lib/format';
import TokenReviewDrawer from './components/TokenReviewDrawer';
import MetadataEditDrawer from './components/MetadataEditDrawer';
import ConfirmationModal from './components/ConfirmationModal';
import { AdminErrorState, AdminLoadingState } from './components/AdminStates';
import {
  SUPPORTED_CHAINS,
  type AdminTokenResponse,
  type PaginatedTokens,
} from './api-types';
import type { TokenModItem } from './types';

const PAGE_SIZE = 20;

// Adapt the API token shape to the TokenModItem the drawers consume. Fields the
// backend doesn't provide are left blank / neutral (see NO API notes in the
// drawers).
function toModItem(t: AdminTokenResponse): TokenModItem {
  return {
    id: t.id,
    tokenName: t.name,
    symbol: t.symbol,
    chain: chainName(t.chainId),
    contractAddress: t.address,
    liquidity: '—',
    tvl: '—',
    volume24h: '—',
    holders: '—',
    status: t.isVerified ? 'Approved' : 'Pending Review',
    dataConfidence: 'Medium',
    lastUpdated: new Date(t.lastUpdated).toLocaleString(),
    logo: t.logoURI ?? '',
    description: '',
    website: '',
    twitter: '',
    telegram: '',
    tags: [],
  };
}

export default function TokenModerationPage() {
  const [chainId, setChainId] = useState<number>(SUPPORTED_CHAINS[0].id);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PaginatedTokens | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [reviewDrawer, setReviewDrawer] = useState<AdminTokenResponse | null>(null);
  const [metadataDrawer, setMetadataDrawer] = useState<AdminTokenResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminTokenResponse | null>(null);
  const [toast, setToast] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    api
      .get<PaginatedTokens>('/admin/tokens', {
        chainId,
        search: search || undefined,
        page,
        pageSize: PAGE_SIZE,
      })
      .then(setData)
      .catch((e) => setError(e?.message || 'Failed to load tokens'))
      .finally(() => setLoading(false));
  }, [chainId, search, page]);

  // Debounce search + refetch on chain/page changes.
  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const patchToken = async (id: string, body: Record<string, unknown>, msg: string) => {
    try {
      await api.patch(`/admin/tokens/${id}`, body);
      showToast(msg);
      load();
    } catch (e) {
      showToast((e as { message?: string })?.message || 'Update failed');
    }
  };

  const handleMetadataSave = (updated: TokenModItem) => {
    setMetadataDrawer(null);
    patchToken(
      updated.id,
      {
        name: updated.tokenName,
        symbol: updated.symbol,
        logoURI: updated.logo || null,
      },
      'Token metadata updated',
    );
  };

  const markFeatured = async (t: AdminTokenResponse) => {
    try {
      await api.post('/admin/featured', { chainId: t.chainId, address: t.address });
      showToast('Token added to featured list');
    } catch (e) {
      showToast((e as { message?: string })?.message || 'Failed to feature token');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/admin/tokens/${deleteTarget.id}`);
      showToast('Token deleted');
      setDeleteTarget(null);
      load();
    } catch (e) {
      showToast((e as { message?: string })?.message || 'Delete failed');
      setDeleteTarget(null);
    }
  };

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1">
          {SUPPORTED_CHAINS.map((c) => (
            <button
              key={c.id}
              onClick={() => { setChainId(c.id); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                chainId === c.id ? 'bg-cta-soft text-cta-bg-active border border-cta-soft' : 'text-fg-muted hover:text-fg-secondary border border-transparent'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="relative w-full sm:w-64">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle text-sm"></i>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search token, symbol, address..."
            className="w-full pl-9 pr-8 py-2 rounded-full bg-surface border border-card-border text-xs text-fg placeholder-fg-subtle outline-none backdrop-blur-md transition-colors focus:border-accent"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-fg-subtle hover:text-fg-secondary cursor-pointer">
              <i className="ri-close-line text-sm"></i>
            </button>
          )}
        </div>
      </div>

      {loading && <AdminLoadingState />}
      {!loading && error && <AdminErrorState onRetry={load} message={error} />}

      {!loading && !error && data && (
        <>
          {/* Table */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="relative overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-card-border">
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-fg-subtle uppercase tracking-wider">Token</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-fg-subtle uppercase tracking-wider hidden md:table-cell">Chain</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-fg-subtle uppercase tracking-wider hidden lg:table-cell">Contract</th>
                    {/* NO API: Liquidity / TVL / 24H Vol / Holders columns removed (not on the Token entity). */}
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-fg-subtle uppercase tracking-wider">Status</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold text-fg-subtle uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border">
                  {data.items.map((item) => (
                    <tr key={item.id} className="hover:bg-surface transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-surface-inset flex items-center justify-center text-xs font-bold text-fg-secondary overflow-hidden">
                            {item.logoURI ? (
                              <img src={item.logoURI} alt={item.symbol} className="w-full h-full object-cover" />
                            ) : (
                              item.symbol.slice(0, 2)
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-fg">{item.name}</p>
                            <p className="text-[11px] text-fg-subtle">{item.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-accent-soft text-accent border border-accent-soft">
                          <i className="ri-circle-fill text-[6px]" />{chainName(item.chainId)}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-fg-subtle font-mono">{shortenAddress(item.address)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          item.isVerified
                            ? 'bg-success-soft text-success border-success-soft'
                            : 'bg-surface-inset text-fg-tertiary border-card-border'
                        }`}>
                          {item.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                        {item.isFeatured && (
                          <span className="ml-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border bg-warning-soft text-warning border-warning-soft">
                            Featured
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => setReviewDrawer(item)} className="px-2 py-1.5 rounded-lg text-[10px] font-medium text-accent bg-accent-soft border border-accent-soft hover:brightness-110 transition-all cursor-pointer whitespace-nowrap">
                            Review
                          </button>
                          <button onClick={() => setMetadataDrawer(item)} className="px-2 py-1.5 rounded-lg text-[10px] font-medium text-fg-tertiary bg-surface-inset border border-card-border hover:bg-surface transition-all cursor-pointer whitespace-nowrap">
                            Metadata
                          </button>
                          <button onClick={() => setDeleteTarget(item)} className="px-2 py-1.5 rounded-lg text-[10px] font-medium text-danger bg-danger-soft border border-danger-soft hover:brightness-110 transition-all cursor-pointer whitespace-nowrap">
                            Delete
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
                <div className="w-12 h-12 mx-auto rounded-xl bg-surface-inset flex items-center justify-center">
                  <i className="ri-search-line text-xl text-fg-subtle"></i>
                </div>
                <p className="text-sm text-fg-tertiary mt-3">No tokens match filters</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-fg-subtle">{data.total} tokens · page {page} of {totalPages}</span>
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

      {/* Toast */}
      {toast && (
        <div className="glass-card fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] px-4 py-2.5 rounded-full text-sm text-fg-secondary animate-slide-down">
          <i className="relative ri-checkbox-circle-line text-success mr-2"></i>
          <span className="relative">{toast}</span>
        </div>
      )}

      {/* Drawers */}
      {reviewDrawer && (
        <TokenReviewDrawer
          token={toModItem(reviewDrawer)}
          onClose={() => setReviewDrawer(null)}
          onApprove={() => { patchToken(reviewDrawer.id, { isVerified: true }, 'Token verified'); setReviewDrawer(null); }}
          onHide={() => { patchToken(reviewDrawer.id, { isVerified: false }, 'Token unverified'); setReviewDrawer(null); }}
          onEditMetadata={() => { setMetadataDrawer(reviewDrawer); setReviewDrawer(null); }}
          onMarkFeatured={() => { markFeatured(reviewDrawer); setReviewDrawer(null); }}
        />
      )}
      {metadataDrawer && (
        <MetadataEditDrawer
          token={toModItem(metadataDrawer)}
          onClose={() => setMetadataDrawer(null)}
          onSave={handleMetadataSave}
        />
      )}

      {/* Delete confirm */}
      <ConfirmationModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete token?"
        description={`This removes ${deleteTarget?.symbol ?? 'the token'} from the CrackerSwap registry. This does not affect the on-chain contract.`}
        confirmLabel="Delete Token"
        variant="danger"
      />
    </div>
  );
}
