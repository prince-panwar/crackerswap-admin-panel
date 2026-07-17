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
      <div className="fixed inset-0 bg-overlay-backdrop backdrop-blur-sm z-[80]" onClick={onClose} />
      <div className="glass-card fixed top-0 right-0 h-full w-full max-w-lg z-[90] overflow-y-auto animate-slide-up-in">
        {/* Header */}
        <div className="sticky top-0 bg-surface-strong backdrop-blur-xl border-b border-card-border px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-inset flex items-center justify-center text-sm font-bold text-fg-secondary">
              {(token.symbol || '??').slice(0, 2)}
            </div>
            <div>
              <h3 className="text-base font-semibold text-fg">Token Review</h3>
              <p className="text-xs text-fg-tertiary">{token.tokenName} ({token.symbol})</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-fg-muted hover:text-fg hover:bg-surface cursor-pointer">
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        <div className="relative p-6 space-y-5">
          {/* Basic info the API provides */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-surface-inset">
              <p className="text-[10px] text-fg-subtle uppercase tracking-wider">Chain</p>
              <p className="text-sm font-medium text-fg mt-0.5">{token.chain}</p>
            </div>
            <div className="p-3 rounded-xl bg-surface-inset">
              <p className="text-[10px] text-fg-subtle uppercase tracking-wider">Contract</p>
              <p className="text-xs font-mono text-fg-secondary mt-0.5 truncate">{token.contractAddress.slice(0, 10)}...{token.contractAddress.slice(-6)}</p>
            </div>
            <div className="p-3 rounded-xl bg-surface-inset">
              <p className="text-[10px] text-fg-subtle uppercase tracking-wider">Status</p>
              <p className="text-sm font-medium text-fg mt-0.5">{token.status}</p>
            </div>
            <div className="p-3 rounded-xl bg-surface-inset">
              <p className="text-[10px] text-fg-subtle uppercase tracking-wider">Last Updated</p>
              <p className="text-xs text-fg-secondary mt-0.5">{token.lastUpdated}</p>
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
          <div className="flex flex-wrap gap-2 pt-2 border-t border-card-border">
            {onApprove && (
              <button onClick={onApprove} className="px-4 py-2.5 rounded-full bg-success-soft border border-success-soft text-success text-sm font-semibold hover:brightness-110 transition-all cursor-pointer whitespace-nowrap">
                <i className="ri-check-line mr-1.5"></i>Verify Token
              </button>
            )}
            {onHide && (
              <button onClick={onHide} className="px-4 py-2.5 rounded-full bg-warning-soft border border-warning-soft text-warning text-sm font-semibold hover:brightness-110 transition-all cursor-pointer whitespace-nowrap">
                <i className="ri-eye-off-line mr-1.5"></i>Unverify Token
              </button>
            )}
            {onEditMetadata && (
              <button onClick={onEditMetadata} className="px-4 py-2.5 rounded-full bg-accent-soft border border-accent-soft text-accent text-sm font-semibold hover:brightness-110 transition-all cursor-pointer whitespace-nowrap">
                <i className="ri-edit-line mr-1.5"></i>Edit Metadata
              </button>
            )}
            {onMarkFeatured && (
              <button onClick={onMarkFeatured} className="px-4 py-2.5 rounded-full bg-warning-soft border border-warning-soft text-warning text-sm font-semibold hover:brightness-110 transition-all cursor-pointer whitespace-nowrap">
                <i className="ri-star-line mr-1.5"></i>Mark Featured
              </button>
            )}
          </div>

          <p className="text-[10px] text-fg-subtle text-center">
            This drawer controls CrackerSwap display/verification status. It does not change on-chain token contracts.
          </p>
        </div>
      </div>
    </>
  );
}
