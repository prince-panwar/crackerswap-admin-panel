import type { TokenModItem } from '../types';

interface TokenReviewDrawerProps {
  token: TokenModItem;
  onClose: () => void;
  onApprove?: () => void;
  onHide?: () => void;
  onEditMetadata?: () => void;
  onMarkFeatured?: () => void;
  // NO API: onFlag removed — the backend has no "flagged" token concept.
}

export default function TokenReviewDrawer({
  token,
  onClose,
  onApprove,
  onHide,
  onEditMetadata,
  onMarkFeatured,
}: TokenReviewDrawerProps) {
  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80]" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-[#0F0D1A] border-l border-[#1A1A2E] shadow-[0_0_80px_rgba(0,0,0,0.6)] z-[90] overflow-y-auto animate-slide-up-in">
        {/* Header */}
        <div className="sticky top-0 bg-[#0F0D1A] border-b border-[#1A1A2E]/40 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1A1A2E] flex items-center justify-center text-sm font-bold text-[#D8D1E6]">
              {(token.symbol || '??').slice(0, 2)}
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#F6F2EA]">Token Review</h3>
              <p className="text-xs text-[#A69DB7]">{token.tokenName} ({token.symbol})</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8B8FA3] hover:text-white hover:bg-[#1A1A2E]/40 cursor-pointer">
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Basic info the API provides */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#1A1A2E]/20">
              <p className="text-[10px] text-[#6E667E] uppercase tracking-wider">Chain</p>
              <p className="text-sm font-medium text-[#F6F2EA] mt-0.5">{token.chain}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#1A1A2E]/20">
              <p className="text-[10px] text-[#6E667E] uppercase tracking-wider">Contract</p>
              <p className="text-xs font-mono text-[#D8D1E6] mt-0.5 truncate">{token.contractAddress.slice(0, 10)}...{token.contractAddress.slice(-6)}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#1A1A2E]/20">
              <p className="text-[10px] text-[#6E667E] uppercase tracking-wider">Status</p>
              <p className="text-sm font-medium text-[#F6F2EA] mt-0.5">{token.status}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#1A1A2E]/20">
              <p className="text-[10px] text-[#6E667E] uppercase tracking-wider">Last Updated</p>
              <p className="text-xs text-[#D8D1E6] mt-0.5">{token.lastUpdated}</p>
            </div>
          </div>

          {/*
            NO API — commented out (Token entity carries none of these):
              - Detection Source, Data Confidence
              - Liquidity, 24H Volume, TVL, Holders tiles
              - Warnings (low-liquidity / missing description)
              - Internal Note / Reason-for-action inputs (not persisted anywhere)
          */}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-[#1A1A2E]/40">
            {onApprove && (
              <button onClick={onApprove} className="px-4 py-2.5 rounded-full bg-[#34D07F]/10 border border-[#34D07F]/20 text-[#34D07F] text-sm font-semibold hover:bg-[#34D07F]/20 transition-all cursor-pointer whitespace-nowrap">
                <i className="ri-check-line mr-1.5"></i>Verify Token
              </button>
            )}
            {onHide && (
              <button onClick={onHide} className="px-4 py-2.5 rounded-full bg-[#FF8A3D]/10 border border-[#FF8A3D]/20 text-[#FF8A3D] text-sm font-semibold hover:bg-[#FF8A3D]/20 transition-all cursor-pointer whitespace-nowrap">
                <i className="ri-eye-off-line mr-1.5"></i>Unverify Token
              </button>
            )}
            {onEditMetadata && (
              <button onClick={onEditMetadata} className="px-4 py-2.5 rounded-full bg-[#6C4DFF]/10 border border-[#6C4DFF]/20 text-[#7B61FF] text-sm font-semibold hover:bg-[#6C4DFF]/20 transition-all cursor-pointer whitespace-nowrap">
                <i className="ri-edit-line mr-1.5"></i>Edit Metadata
              </button>
            )}
            {onMarkFeatured && (
              <button onClick={onMarkFeatured} className="px-4 py-2.5 rounded-full bg-[#FF6A1A]/10 border border-[#FF6A1A]/20 text-[#FF6A1A] text-sm font-semibold hover:bg-[#FF6A1A]/20 transition-all cursor-pointer whitespace-nowrap">
                <i className="ri-star-line mr-1.5"></i>Mark Featured
              </button>
            )}
          </div>

          <p className="text-[10px] text-[#6E667E] text-center">
            This drawer controls CrackerSwap display/verification status. It does not change on-chain token contracts.
          </p>
        </div>
      </div>
    </>
  );
}
