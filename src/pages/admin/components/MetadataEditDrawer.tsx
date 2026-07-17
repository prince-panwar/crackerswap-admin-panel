import { useState } from 'react';
import type { TokenModItem } from '../types';

interface MetadataEditDrawerProps {
  token: TokenModItem;
  onClose: () => void;
  onSave: (updated: TokenModItem) => void;
}

export default function MetadataEditDrawer({ token, onClose, onSave }: MetadataEditDrawerProps) {
  const [form, setForm] = useState({ ...token });
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (field: string, value: string | string[]) => {
    setForm({ ...form, [field]: value });
  };

  const handleSave = () => {
    setShowConfirm(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-overlay-backdrop backdrop-blur-sm z-[80]" onClick={onClose} />
      <div className="glass-card fixed top-0 right-0 h-full w-full max-w-lg z-[90] overflow-y-auto animate-slide-up-in">
        <div className="sticky top-0 bg-surface-strong backdrop-blur-xl border-b border-card-border px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-base font-semibold text-fg">Edit Token Metadata</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-fg-muted hover:text-fg hover:bg-surface cursor-pointer">
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        <div className="relative p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-fg-secondary mb-1.5">Token Display Name</label>
            <input
              type="text"
              value={form.tokenName}
              onChange={(e) => handleChange('tokenName', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface border border-card-border text-sm text-fg outline-none transition-colors focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-fg-secondary mb-1.5">Symbol</label>
            <input
              type="text"
              value={form.symbol}
              onChange={(e) => handleChange('symbol', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface border border-card-border text-sm text-fg outline-none transition-colors focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-fg-secondary mb-1.5">Logo URL</label>
            <input
              type="text"
              value={form.logo}
              onChange={(e) => handleChange('logo', e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-xl bg-surface border border-card-border text-sm text-fg placeholder-fg-subtle outline-none transition-colors focus:border-accent"
            />
          </div>

          {/*
            NO API — the Token entity has no description/website/twitter/
            telegram/tags columns, so these editable fields are commented out.
            Only name, symbol and logo (logoURI) are persisted via PATCH.
          */}

          <div className="flex gap-3 pt-4 border-t border-card-border">
            <button
              onClick={() => setForm({ ...token })}
              className="flex-1 px-4 py-2.5 rounded-full border border-card-border text-sm font-medium text-fg-tertiary hover:bg-surface transition-all cursor-pointer whitespace-nowrap"
            >
              Reset to Source Data
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2.5 rounded-full bg-accent-soft border border-accent-soft text-accent text-sm font-semibold hover:brightness-110 transition-all cursor-pointer whitespace-nowrap"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <>
          <div className="fixed inset-0 bg-overlay-backdrop z-[100]" onClick={() => setShowConfirm(false)} />
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-md rounded-[24px] overflow-hidden animate-slide-up-in">
              <div className="relative p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-warning-soft flex items-center justify-center flex-shrink-0">
                    <i className="ri-alert-line text-lg text-warning"></i>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-fg">Confirm metadata override</h3>
                    <p className="text-sm text-fg-tertiary mt-1.5">This will update how {form.tokenName} appears on CrackerSwap. It will not change on-chain token data.</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowConfirm(false)} className="flex-1 px-4 py-2.5 rounded-full border border-card-border text-sm font-medium text-fg-secondary hover:bg-surface transition-all cursor-pointer whitespace-nowrap">Cancel</button>
                  <button onClick={() => { onSave(form); onClose(); }} className="flex-1 px-4 py-2.5 rounded-full bg-accent-soft border border-accent-soft text-accent text-sm font-semibold hover:brightness-110 transition-all cursor-pointer whitespace-nowrap">Confirm & Save</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}