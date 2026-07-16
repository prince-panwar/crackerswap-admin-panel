import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { PlatformFeeConfig } from '@/pages/admin/api-types';
import { AdminErrorState, AdminLoadingState } from '@/pages/admin/components/AdminStates';

const MAX_FEE_PERCENT = 10; // mirrors the backend 1000 bps cap
const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;

export default function PlatformFeePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const [enabled, setEnabled] = useState(false);
  const [feePercent, setFeePercent] = useState('0');
  const [feeRecipient, setFeeRecipient] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const apply = (cfg: PlatformFeeConfig) => {
    setEnabled(cfg.enabled);
    setFeePercent((cfg.feeBps / 100).toString());
    setFeeRecipient(cfg.feeRecipient ?? '');
  };

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    api
      .get<PlatformFeeConfig>('/admin/platform/fee')
      .then(apply)
      .catch((e) => setError(e?.message || 'Failed to load fee settings'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const pct = parseFloat(feePercent);
  const recipientValid = ADDRESS_RE.test(feeRecipient.trim());
  const pctValid = !isNaN(pct) && pct >= 0 && pct <= MAX_FEE_PERCENT;
  // When enabled, a positive fee and a valid recipient are required.
  const canSave =
    pctValid && (!enabled || (pct > 0 && recipientValid)) && !saving;

  const save = async () => {
    const feeBps = Math.round(pct * 100);
    setSaving(true);
    try {
      const updated = await api.put<PlatformFeeConfig>('/admin/platform/fee', {
        enabled,
        feeBps,
        feeRecipient: feeRecipient.trim() || null,
      });
      apply(updated);
      showToast('Platform fee saved');
    } catch (e) {
      showToast((e as { message?: string })?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4"><AdminLoadingState /></div>;
  if (error) return <AdminErrorState onRetry={load} message={error} />;

  return (
    <div className="max-w-2xl space-y-5">
      <div className="rounded-2xl bg-[#0F0D1A] border border-[#1A1A2E]/60 overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1A1A2E]/40">
          <h3 className="text-sm font-semibold text-[#F6F2EA]">Swap Platform Fee</h3>
          <p className="text-xs text-[#8B8FA3] mt-1">
            When enabled, this fee is deducted from the input token of every swap
            and sent to the fee wallet. The remainder is swapped.
          </p>
        </div>

        <div className="p-5 space-y-5">
          {/* Enable toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#F6F2EA]">Fee enabled</p>
              <p className="text-xs text-[#8B8FA3] mt-0.5">
                Turn the platform fee on or off for all swaps.
              </p>
            </div>
            <button
              onClick={() => setEnabled((v) => !v)}
              className={`relative w-11 h-6 rounded-full transition-all cursor-pointer ${
                enabled ? 'bg-[#34D07F]' : 'bg-[#2A2A3E]'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                  enabled ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>

          {/* Fee percent */}
          <div>
            <label className="block text-xs font-semibold text-[#D8D1E6] mb-1.5">
              Fee (%)
            </label>
            <input
              type="number"
              min={0}
              max={MAX_FEE_PERCENT}
              step="0.01"
              value={feePercent}
              onChange={(e) => setFeePercent(e.target.value)}
              placeholder="0.30"
              className="w-full px-4 py-3 rounded-xl bg-[#0A0618] border border-[#1A1A2E] text-sm text-[#F6F2EA] placeholder-[#6E667E] outline-none focus:border-[#6C4DFF]/30"
            />
            <p className="text-[11px] text-[#6E667E] mt-1.5">
              Max {MAX_FEE_PERCENT}%. Stored as {isNaN(pct) ? 0 : Math.round(pct * 100)} bps.
              {!pctValid && (
                <span className="text-[#FF5B5B]"> · must be 0–{MAX_FEE_PERCENT}%</span>
              )}
            </p>
          </div>

          {/* Fee recipient */}
          <div>
            <label className="block text-xs font-semibold text-[#D8D1E6] mb-1.5">
              Fee wallet address
            </label>
            <input
              type="text"
              value={feeRecipient}
              onChange={(e) => setFeeRecipient(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 rounded-xl bg-[#0A0618] border border-[#1A1A2E] text-sm text-[#F6F2EA] placeholder-[#6E667E] outline-none focus:border-[#6C4DFF]/30 font-mono"
            />
            {feeRecipient.trim() !== '' && !recipientValid && (
              <p className="text-[11px] text-[#FF5B5B] mt-1.5">
                Enter a valid 0x-prefixed EVM address.
              </p>
            )}
            {enabled && feeRecipient.trim() === '' && (
              <p className="text-[11px] text-[#FF7A22] mt-1.5">
                A fee wallet is required while the fee is enabled.
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={save}
              disabled={!canSave}
              className="px-6 py-3 rounded-full bg-[#6C4DFF]/10 border border-[#6C4DFF]/20 text-[#7B61FF] text-sm font-semibold hover:bg-[#6C4DFF]/20 transition-all cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
            <button
              onClick={load}
              disabled={saving}
              className="px-6 py-3 rounded-full bg-transparent border border-[#1A1A2E] text-[#8B8FA3] text-sm font-semibold hover:text-white transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] px-4 py-2.5 rounded-full bg-[#0F0D1A] border border-[#1A1A2E] shadow-[0_12px_40px_rgba(0,0,0,0.5)] text-sm text-[#D8D1E6] animate-slide-down">
          <i className="ri-checkbox-circle-line text-[#34D07F] mr-2"></i>
          {toast}
        </div>
      )}
    </div>
  );
}
