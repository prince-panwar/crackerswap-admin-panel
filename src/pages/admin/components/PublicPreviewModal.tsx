import type { TokenModItem } from '../types';

interface PublicPreviewModalProps {
  token: TokenModItem;
  onClose: () => void;
}

export default function PublicPreviewModal({ token, onClose }: PublicPreviewModalProps) {
  return (
    <>
      <div className="fixed inset-0 bg-overlay-backdrop backdrop-blur-sm z-[80]" onClick={onClose} />
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
        <div className="glass-card w-full max-w-sm rounded-[24px] overflow-hidden animate-slide-up-in">
          {/* Preview header */}
          <div className="relative px-6 pt-6 pb-4 border-b border-card-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-fg-tertiary">Public Preview</span>
              <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-fg-muted hover:text-fg hover:bg-surface cursor-pointer">
                <i className="ri-close-line"></i>
              </button>
            </div>
            {/* Token discovery row preview */}
            <div className="rounded-xl bg-surface border border-card-border p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-inset flex items-center justify-center text-sm font-bold text-fg-secondary">
                {token.symbol.slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-fg">{token.tokenName}</p>
                <p className="text-[11px] text-fg-subtle">{token.symbol}</p>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                token.chain === 'Monad' ? 'bg-accent-soft text-accent border border-accent-soft' : 'bg-[#0052FF]/10 text-[#0052FF] border border-[#0052FF]/20'
              }`}>
                <i className="ri-circle-fill text-[5px]" />{token.chain}
              </span>
            </div>
          </div>

          {/* Preview details */}
          <div className="relative p-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-fg-tertiary">Price</span>
              <span className="text-sm font-medium text-fg">$3.84</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-fg-tertiary">Liquidity</span>
              <span className="text-sm font-medium text-fg">{token.liquidity}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-fg-tertiary">24H Volume</span>
              <span className="text-sm font-medium text-fg">{token.volume24h}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-fg-tertiary">Status</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                token.status === 'Approved' ? 'bg-success-soft text-success border-success-soft' : 'bg-warning-soft text-warning border-warning-soft'
              }`}>{token.status}</span>
            </div>
            <div className="pt-3">
              <button className="w-full py-2.5 rounded-full bg-accent-soft border border-accent-soft text-accent text-sm font-semibold hover:brightness-110 transition-all cursor-pointer whitespace-nowrap">
                Trade
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="relative px-6 pb-6 flex gap-2">
            <button onClick={onClose} className="flex-1 px-3 py-2 rounded-full border border-card-border text-xs text-fg-secondary hover:bg-surface transition-all cursor-pointer whitespace-nowrap">
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </>
  );
}