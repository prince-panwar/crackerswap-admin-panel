import { useEffect, useRef } from 'react';
import type { PositionToken } from '@/mocks/positionsData';

interface Props {
  token: PositionToken | null;
  isOpen: boolean;
  onClose: () => void;
  onTrade: (symbol: string) => void;
  onCopyContract: () => void;
  onExplorer: () => void;
}

export default function TokenHoldingDrawer({ token, isOpen, onClose, onTrade, onCopyContract, onExplorer }: Props) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!token) return null;

  const isPositive = token.priceChange24h >= 0;

  return (
    <>
      {/* Backdrop */}
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 z-[80] h-full w-full sm:w-[480px] liquid-glass-strong rounded-l-[24px] transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="relative z-10 h-full flex flex-col p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[16px] font-semibold text-[#F6F2EA]">{token.symbol} Holdings</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-[#A69DB7] hover:text-[#F6F2EA] hover:bg-white/[0.06] transition-all cursor-pointer">
              <i className="ri-close-line text-lg"></i>
            </button>
          </div>

          {/* Token Header */}
          <div className="flex items-center gap-3 mb-5 pb-5 border-b border-white/[0.06]">
            <div className="w-12 h-12 rounded-xl bg-[#1A1A2E]/60 flex items-center justify-center text-[18px] font-bold text-[#FF7A22] border border-white/[0.06] shrink-0">
              {token.symbol[0]}
            </div>
            <div>
              <div className="text-[16px] font-semibold text-[#F6F2EA]">{token.name}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[13px] text-[#A69DB7]">{token.symbol}</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-[#D8D1E6] bg-[#1A1A2E]/50 border border-white/[0.06]">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: token.chain === 'Base' ? '#0052FF' : '#FF6A1A' }} />
                  {token.chain}
                </span>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="text-[10px] text-[#6E667E] uppercase tracking-wider mb-1">Balance</div>
              <div className="text-[15px] font-semibold text-[#F6F2EA]">{token.balance.toLocaleString()} {token.symbol}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="text-[10px] text-[#6E667E] uppercase tracking-wider mb-1">USD Value</div>
              <div className="text-[15px] font-semibold text-[#F6F2EA]">${token.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="text-[10px] text-[#6E667E] uppercase tracking-wider mb-1">Token Price</div>
              <div className="text-[15px] font-semibold text-[#F6F2EA]">${token.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="text-[10px] text-[#6E667E] uppercase tracking-wider mb-1">24H Change</div>
              <div className={`text-[15px] font-semibold ${isPositive ? 'text-[#34D07F]' : 'text-[#FF5B5B]'}`}>
                {isPositive ? '+' : ''}{token.priceChange24h.toFixed(2)}%
              </div>
            </div>
            <div className="col-span-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="text-[10px] text-[#6E667E] uppercase tracking-wider mb-1">Portfolio Allocation</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-white/[0.05] overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#FF6A1A] to-[#6C4DFF]" style={{ width: `${token.allocation}%` }} />
                </div>
                <span className="text-[13px] font-semibold text-[#F6F2EA]">{token.allocation.toFixed(2)}%</span>
              </div>
            </div>
          </div>

          {/* Contract Address */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] mb-5">
            <div className="text-[10px] text-[#6E667E] uppercase tracking-wider mb-1.5">Contract Address</div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-[#D8D1E6] font-mono">
                {token.contractAddress.slice(0, 8)}...{token.contractAddress.slice(-6)}
              </span>
              <button onClick={onCopyContract} className="text-[#A69DB7] hover:text-[#F6F2EA] cursor-pointer transition-colors">
                <i className="ri-file-copy-line text-sm"></i>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 mt-auto">
            <button
              onClick={() => { onTrade(token.symbol); onClose(); }}
              className="liquid-glass-btn-primary px-5 py-3 text-[13px] text-white font-semibold rounded-full cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
            >
              <i className="ri-arrow-left-right-line text-sm"></i>
              Trade Token
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => { onCopyContract(); }}
                className="flex-1 liquid-glass-btn px-4 py-2.5 text-[12px] text-[#F6F2EA] font-medium rounded-full cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5"
              >
                <i className="ri-file-copy-line text-xs"></i>
                Copy Contract
              </button>
              <button
                onClick={() => { onExplorer(); }}
                className="flex-1 liquid-glass-btn px-4 py-2.5 text-[12px] text-[#F6F2EA] font-medium rounded-full cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5"
              >
                <i className="ri-external-link-line text-xs"></i>
                Explorer
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}