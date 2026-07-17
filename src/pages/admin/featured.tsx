import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { chainName } from '@/lib/format';
import ConfirmationModal from './components/ConfirmationModal';
import { AdminErrorState, AdminLoadingState } from './components/AdminStates';
import { SUPPORTED_CHAINS, type AdminTokenResponse } from './api-types';

export default function FeaturedTokensPage() {
  const [items, setItems] = useState<AdminTokenResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmRemove, setConfirmRemove] = useState<AdminTokenResponse | null>(null);
  const [toast, setToast] = useState('');

  // Add form
  const [addChainId, setAddChainId] = useState<number>(SUPPORTED_CHAINS[0].id);
  const [addAddress, setAddAddress] = useState('');
  const [adding, setAdding] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    api
      .get<AdminTokenResponse[]>('/admin/featured')
      .then(setItems)
      .catch((e) => setError(e?.message || 'Failed to load featured tokens'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  // Reorder by swapping two adjacent items' ranks, then persisting both.
  const swapRanks = async (i: number, j: number) => {
    if (i < 0 || j < 0 || i >= items.length || j >= items.length) return;
    const a = items[i];
    const b = items[j];
    try {
      await Promise.all([
        api.patch(`/admin/featured/${a.id}`, { featuredRank: j + 1 }),
        api.patch(`/admin/featured/${b.id}`, { featuredRank: i + 1 }),
      ]);
      showToast('Featured order updated');
      load();
    } catch (e) {
      showToast((e as { message?: string })?.message || 'Reorder failed');
    }
  };

  const confirmRemoveFeatured = async () => {
    if (!confirmRemove) return;
    try {
      await api.delete(`/admin/featured/${confirmRemove.id}`);
      showToast('Featured token removed');
      setConfirmRemove(null);
      load();
    } catch (e) {
      showToast((e as { message?: string })?.message || 'Remove failed');
      setConfirmRemove(null);
    }
  };

  const handleAdd = async () => {
    const address = addAddress.trim();
    if (!address) {
      showToast('Enter a token contract address');
      return;
    }
    setAdding(true);
    try {
      await api.post('/admin/featured', { chainId: addChainId, address });
      setAddAddress('');
      showToast('Featured token added');
      load();
    } catch (e) {
      // Backend returns a helpful message when the token isn't in the registry
      // (it needs symbol/name/decimals to be added first).
      showToast((e as { message?: string })?.message || 'Failed to add featured token');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Featured Tokens */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="relative px-5 py-4 border-b border-card-border">
          <h3 className="text-sm font-semibold text-fg">Current Featured Tokens</h3>
        </div>

        {loading && <div className="relative p-4"><AdminLoadingState /></div>}
        {!loading && error && <AdminErrorState onRetry={load} message={error} />}

        {!loading && !error && (
          <div className="relative overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-card-border">
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-fg-subtle uppercase tracking-wider w-16">Rank</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-fg-subtle uppercase tracking-wider">Token</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-fg-subtle uppercase tracking-wider hidden md:table-cell">Chain</th>
                  {/* NO API: Label / Status / Start Date columns removed (no such fields). */}
                  <th className="text-right px-4 py-3 text-[11px] font-semibold text-fg-subtle uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-surface transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold text-fg">#{item.featuredRank ?? idx + 1}</span>
                    </td>
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
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => swapRanks(idx, idx - 1)} disabled={idx <= 0} className="w-7 h-7 rounded-lg flex items-center justify-center text-fg-muted hover:text-fg hover:bg-surface transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">
                          <i className="ri-arrow-up-s-line text-sm"></i>
                        </button>
                        <button onClick={() => swapRanks(idx, idx + 1)} disabled={idx >= items.length - 1} className="w-7 h-7 rounded-lg flex items-center justify-center text-fg-muted hover:text-fg hover:bg-surface transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">
                          <i className="ri-arrow-down-s-line text-sm"></i>
                        </button>
                        <button onClick={() => setConfirmRemove(item)} className="w-7 h-7 rounded-lg flex items-center justify-center text-danger hover:bg-danger-soft transition-all cursor-pointer">
                          <i className="ri-close-line text-sm"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {items.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-sm text-fg-tertiary">No featured tokens configured</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Featured Token */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="relative px-5 py-4 border-b border-card-border">
          <h3 className="text-sm font-semibold text-fg">Add Featured Token</h3>
        </div>
        <div className="relative p-5 flex flex-col sm:flex-row gap-3 items-end">
          <div className="w-full sm:w-40">
            <label className="block text-xs font-semibold text-fg-secondary mb-1.5">Chain</label>
            <select
              value={addChainId}
              onChange={(e) => setAddChainId(Number(e.target.value))}
              className="w-full px-3 py-3 rounded-xl bg-surface border border-card-border text-sm text-fg-secondary outline-none cursor-pointer"
            >
              {SUPPORTED_CHAINS.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-fg-secondary mb-1.5">Token Contract Address</label>
            <input
              type="text"
              value={addAddress}
              onChange={(e) => setAddAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 rounded-xl bg-surface border border-card-border text-sm text-fg placeholder-fg-subtle outline-none transition-colors focus:border-accent"
            />
          </div>
          {/* NO API: "Label" select removed — featured tokens have no label field. */}
          <button
            onClick={handleAdd}
            disabled={adding}
            className="px-6 py-3 rounded-full bg-accent-soft border border-accent-soft text-accent text-sm font-semibold hover:brightness-110 transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            <i className="ri-add-line mr-1.5"></i>{adding ? 'Adding...' : 'Add'}
          </button>
        </div>
        <p className="relative px-5 pb-4 text-[11px] text-fg-subtle">
          The token must already exist in the registry. Add it via Token Moderation first if it is new.
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <div className="glass-card fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] px-4 py-2.5 rounded-full text-sm text-fg-secondary animate-slide-down">
          <i className="relative ri-checkbox-circle-line text-success mr-2"></i>
          <span className="relative">{toast}</span>
        </div>
      )}

      {/* NO API: PublicPreviewModal removed — it rendered price/liquidity the API doesn't provide. */}

      {/* Confirmation */}
      <ConfirmationModal
        open={!!confirmRemove}
        onClose={() => setConfirmRemove(null)}
        onConfirm={confirmRemoveFeatured}
        title="Remove featured token?"
        description={`This removes ${confirmRemove?.name ?? 'the token'} from the featured list. The token remains in the registry.`}
        confirmLabel="Remove"
        variant="danger"
      />
    </div>
  );
}
