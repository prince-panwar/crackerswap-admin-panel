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
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80]" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-[#0F0D1A] border-l border-[#1A1A2E] shadow-[0_0_80px_rgba(0,0,0,0.6)] z-[90] overflow-y-auto animate-slide-up-in">
        <div className="sticky top-0 bg-[#0F0D1A] border-b border-[#1A1A2E]/40 px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-base font-semibold text-[#F6F2EA]">Edit Token Metadata</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8B8FA3] hover:text-white hover:bg-[#1A1A2E]/40 cursor-pointer">
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#D8D1E6] mb-1.5">Token Display Name</label>
            <input
              type="text"
              value={form.tokenName}
              onChange={(e) => handleChange('tokenName', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0A0618] border border-[#1A1A2E] text-sm text-[#F6F2EA] outline-none focus:border-[#6C4DFF]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D8D1E6] mb-1.5">Symbol</label>
            <input
              type="text"
              value={form.symbol}
              onChange={(e) => handleChange('symbol', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0A0618] border border-[#1A1A2E] text-sm text-[#F6F2EA] outline-none focus:border-[#6C4DFF]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D8D1E6] mb-1.5">Logo URL</label>
            <input
              type="text"
              value={form.logo}
              onChange={(e) => handleChange('logo', e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-xl bg-[#0A0618] border border-[#1A1A2E] text-sm text-[#F6F2EA] placeholder-[#6E667E] outline-none focus:border-[#6C4DFF]/30"
            />
          </div>

          {/*
            NO API — the Token entity has no description/website/twitter/
            telegram/tags columns, so these editable fields are commented out.
            Only name, symbol and logo (logoURI) are persisted via PATCH.
          */}

          <div className="flex gap-3 pt-4 border-t border-[#1A1A2E]/40">
            <button
              onClick={() => setForm({ ...token })}
              className="flex-1 px-4 py-2.5 rounded-full border border-[#2A2A3E]/60 text-sm font-medium text-[#A69DB7] hover:bg-[#1A1A2E]/40 transition-all cursor-pointer whitespace-nowrap"
            >
              Reset to Source Data
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2.5 rounded-full bg-[#6C4DFF]/10 border border-[#6C4DFF]/20 text-[#7B61FF] text-sm font-semibold hover:bg-[#6C4DFF]/20 transition-all cursor-pointer whitespace-nowrap"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <>
          <div className="fixed inset-0 bg-black/80 z-[100]" onClick={() => setShowConfirm(false)} />
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-[24px] bg-[#0F0D1A] border border-[#1A1A2E] shadow-[0_24px_80px_rgba(0,0,0,0.6)] overflow-hidden animate-slide-up-in">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FF8A3D]/10 flex items-center justify-center flex-shrink-0">
                    <i className="ri-alert-line text-lg text-[#FF8A3D]"></i>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#F6F2EA]">Confirm metadata override</h3>
                    <p className="text-sm text-[#A69DB7] mt-1.5">This will update how {form.tokenName} appears on CrackerSwap. It will not change on-chain token data.</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowConfirm(false)} className="flex-1 px-4 py-2.5 rounded-full border border-[#2A2A3E]/60 text-sm font-medium text-[#D8D1E6] hover:bg-[#1A1A2E]/40 transition-all cursor-pointer whitespace-nowrap">Cancel</button>
                  <button onClick={() => { onSave(form); onClose(); }} className="flex-1 px-4 py-2.5 rounded-full bg-[#6C4DFF]/10 border border-[#6C4DFF]/20 text-[#7B61FF] text-sm font-semibold hover:bg-[#6C4DFF]/20 transition-all cursor-pointer whitespace-nowrap">Confirm & Save</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}