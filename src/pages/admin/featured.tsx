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
      <div className="rounded-2xl bg-[#0F0D1A] border border-[#1A1A2E]/60 overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1A1A2E]/40">
          <h3 className="text-sm font-semibold text-[#F6F2EA]">Current Featured Tokens</h3>
        </div>

        {loading && <div className="p-4"><AdminLoadingState /></div>}
        {!loading && error && <AdminErrorState onRetry={load} message={error} />}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1A1A2E]/40">
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6E667E] uppercase tracking-wider w-16">Rank</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6E667E] uppercase tracking-wider">Token</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#6E667E] uppercase tracking-wider hidden md:table-cell">Chain</th>
                  {/* NO API: Label / Status / Start Date columns removed (no such fields). */}
                  <th className="text-right px-4 py-3 text-[11px] font-semibold text-[#6E667E] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A2E]/20">
                {items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-[#1A1A2E]/20 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold text-[#F6F2EA]">#{item.featuredRank ?? idx + 1}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1A1A2E] flex items-center justify-center text-xs font-bold text-[#D8D1E6] overflow-hidden">
                          {item.logoURI ? (
                            <img src={item.logoURI} alt={item.symbol} className="w-full h-full object-cover" />
                          ) : (
                            item.symbol.slice(0, 2)
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#F6F2EA]">{item.name}</p>
                          <p className="text-[11px] text-[#6E667E]">{item.symbol}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#6C4DFF]/10 text-[#7B61FF] border border-[#6C4DFF]/20">
                        <i className="ri-circle-fill text-[6px]" />{chainName(item.chainId)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => swapRanks(idx, idx - 1)} disabled={idx <= 0} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8B8FA3] hover:text-white hover:bg-[#1A1A2E]/40 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">
                          <i className="ri-arrow-up-s-line text-sm"></i>
                        </button>
                        <button onClick={() => swapRanks(idx, idx + 1)} disabled={idx >= items.length - 1} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8B8FA3] hover:text-white hover:bg-[#1A1A2E]/40 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">
                          <i className="ri-arrow-down-s-line text-sm"></i>
                        </button>
                        <button onClick={() => setConfirmRemove(item)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#FF5B5B] hover:bg-[#FF5B5B]/10 transition-all cursor-pointer">
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
                <p className="text-sm text-[#A69DB7]">No featured tokens configured</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Featured Token */}
      <div className="rounded-2xl bg-[#0F0D1A] border border-[#1A1A2E]/60 overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1A1A2E]/40">
          <h3 className="text-sm font-semibold text-[#F6F2EA]">Add Featured Token</h3>
        </div>
        <div className="p-5 flex flex-col sm:flex-row gap-3 items-end">
          <div className="w-full sm:w-40">
            <label className="block text-xs font-semibold text-[#D8D1E6] mb-1.5">Chain</label>
            <select
              value={addChainId}
              onChange={(e) => setAddChainId(Number(e.target.value))}
              className="w-full px-3 py-3 rounded-xl bg-[#0A0618] border border-[#1A1A2E] text-sm text-[#D8D1E6] outline-none cursor-pointer"
            >
              {SUPPORTED_CHAINS.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-[#D8D1E6] mb-1.5">Token Contract Address</label>
            <input
              type="text"
              value={addAddress}
              onChange={(e) => setAddAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 rounded-xl bg-[#0A0618] border border-[#1A1A2E] text-sm text-[#F6F2EA] placeholder-[#6E667E] outline-none focus:border-[#6C4DFF]/30"
            />
          </div>
          {/* NO API: "Label" select removed — featured tokens have no label field. */}
          <button
            onClick={handleAdd}
            disabled={adding}
            className="px-6 py-3 rounded-full bg-[#6C4DFF]/10 border border-[#6C4DFF]/20 text-[#7B61FF] text-sm font-semibold hover:bg-[#6C4DFF]/20 transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            <i className="ri-add-line mr-1.5"></i>{adding ? 'Adding...' : 'Add'}
          </button>
        </div>
        <p className="px-5 pb-4 text-[11px] text-[#6E667E]">
          The token must already exist in the registry. Add it via Token Moderation first if it is new.
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] px-4 py-2.5 rounded-full bg-[#0F0D1A] border border-[#1A1A2E] shadow-[0_12px_40px_rgba(0,0,0,0.5)] text-sm text-[#D8D1E6] animate-slide-down">
          <i className="ri-checkbox-circle-line text-[#34D07F] mr-2"></i>
          {toast}
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
