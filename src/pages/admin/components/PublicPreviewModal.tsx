import type { TokenModItem } from '../types';

interface PublicPreviewModalProps {
  token: TokenModItem;
  onClose: () => void;
}

export default function PublicPreviewModal({ token, onClose }: PublicPreviewModalProps) {
  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80]" onClick={onClose} />
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-[24px] bg-[#0F0D1A] border border-[#1A1A2E] shadow-[0_24px_80px_rgba(0,0,0,0.6)] overflow-hidden animate-slide-up-in">
          {/* Preview header */}
          <div className="px-6 pt-6 pb-4 border-b border-[#1A1A2E]/40">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-[#A69DB7]">Public Preview</span>
              <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8B8FA3] hover:text-white hover:bg-[#1A1A2E]/40 cursor-pointer">
                <i className="ri-close-line"></i>
              </button>
            </div>
            {/* Token discovery row preview */}
            <div className="rounded-xl bg-[#0A0618] border border-[#1A1A2E]/40 p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1A1A2E] flex items-center justify-center text-sm font-bold text-[#D8D1E6]">
                {token.symbol.slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#F6F2EA]">{token.tokenName}</p>
                <p className="text-[11px] text-[#6E667E]">{token.symbol}</p>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                token.chain === 'Monad' ? 'bg-[#FF6A1A]/10 text-[#FF6A1A] border border-[#FF6A1A]/20' : 'bg-[#0052FF]/10 text-[#0052FF] border border-[#0052FF]/20'
              }`}>
                <i className="ri-circle-fill text-[5px]" />{token.chain}
              </span>
            </div>
          </div>

          {/* Preview details */}
          <div className="p-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#A69DB7]">Price</span>
              <span className="text-sm font-medium text-[#F6F2EA]">$3.84</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#A69DB7]">Liquidity</span>
              <span className="text-sm font-medium text-[#F6F2EA]">{token.liquidity}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#A69DB7]">24H Volume</span>
              <span className="text-sm font-medium text-[#F6F2EA]">{token.volume24h}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#A69DB7]">Status</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                token.status === 'Approved' ? 'bg-[#34D07F]/10 text-[#34D07F] border-[#34D07F]/20' : 'bg-[#FF8A3D]/10 text-[#FF8A3D] border-[#FF8A3D]/20'
              }`}>{token.status}</span>
            </div>
            <div className="pt-3">
              <button className="w-full py-2.5 rounded-full bg-[#6C4DFF]/10 border border-[#6C4DFF]/20 text-[#7B61FF] text-sm font-semibold hover:bg-[#6C4DFF]/20 transition-all cursor-pointer whitespace-nowrap">
                Trade
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex gap-2">
            <button onClick={onClose} className="flex-1 px-3 py-2 rounded-full border border-[#2A2A3E]/60 text-xs text-[#D8D1E6] hover:bg-[#1A1A2E]/40 transition-all cursor-pointer whitespace-nowrap">
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </>
  );
}