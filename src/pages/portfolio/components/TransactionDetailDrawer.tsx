import { useState, useEffect, useRef, useCallback } from 'react';
import type { PortfolioTransaction } from '@/mocks/portfolioData';

interface TransactionDetailDrawerProps {
  tx: PortfolioTransaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TransactionDetailDrawer({ tx, isOpen, onClose }: TransactionDetailDrawerProps) {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2200);
  }, []);

  if (!tx) return null;

  const statusStyle = () => {
    switch (tx.status) {
      case 'success': return { bg: 'rgba(52, 208, 127, 0.12)', color: '#34D07F', border: 'rgba(52, 208, 127, 0.15)' };
      case 'pending': return { bg: 'rgba(255, 106, 26, 0.12)', color: '#FF7A22', border: 'rgba(255, 106, 26, 0.15)' };
      case 'failed': return { bg: 'rgba(255, 91, 91, 0.12)', color: '#FF5B5B', border: 'rgba(255, 91, 91, 0.15)' };
      case 'detected': return { bg: 'rgba(108, 77, 255, 0.12)', color: '#7B61FF', border: 'rgba(108, 77, 255, 0.15)' };
      default: return { bg: 'rgba(255,255,255,0.05)', color: '#6E667E', border: 'rgba(255,255,255,0.08)' };
    }
  };

  const typeLabel = () => {
    switch (tx.type) {
      case 'swap': return 'Swap';
      case 'approval': return 'Approval';
      case 'failed': return 'Failed Swap';
      case 'pending': return 'Pending Swap';
      case 'pool_trade': return 'Pool Trade';
      case 'lp_detected': return 'LP Exposure Detected';
      default: return tx.type;
    }
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(tx.txHash).then(() => {
      showToast('Transaction hash copied');
    }).catch(() => {
      showToast('Failed to copy');
    });
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-[4px] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Transaction details`}
        className={`fixed z-[101] bg-[#0D0620]/95 backdrop-blur-2xl border-l border-white/[0.08] shadow-[0_0_120px_rgba(0,0,0,0.6)] flex flex-col transition-all duration-[350ms] ease-out
          right-0 top-0 bottom-0 w-full sm:w-[460px] rounded-t-2xl sm:rounded-t-none sm:rounded-l-2xl
          ${isOpen ? 'translate-y-0 sm:translate-x-0' : 'translate-y-full sm:translate-y-0 sm:translate-x-full'}`}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-[200px] h-[200px] bg-[#FF6A1A]/[0.04] rounded-full blur-[80px]" />
          <div className="absolute bottom-[30%] right-0 w-[180px] h-[180px] bg-[#6C4DFF]/[0.04] rounded-full blur-[80px]" />
        </div>

        {toastMsg && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[110] px-4 py-2 rounded-full bg-[#34D07F]/15 border border-[#34D07F]/20 text-[#34D07F] text-[11px] font-medium backdrop-blur-md shadow-lg animate-fade-in-out">
            <i className="ri-check-line mr-1.5 text-[10px]"></i>
            {toastMsg}
          </div>
        )}

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-[110] w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.06] border border-white/[0.10] text-[#A69DB7] hover:text-[#F6F2EA] hover:bg-white/[0.10] transition-all cursor-pointer backdrop-blur-md"
        >
          <i className="ri-close-line"></i>
        </button>

        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6 sm:py-7 relative z-10">
          {/* Status Badge + Type */}
          <div className="flex items-center gap-2 mb-5 pr-8">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold" style={{ backgroundColor: statusStyle().bg, color: statusStyle().color, border: `1px solid ${statusStyle().border}` }}>
              {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
            </span>
            <span className="text-[14px] font-semibold text-[#F6F2EA]">{typeLabel()}</span>
          </div>

          {/* Pair */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] mb-5">
            <p className="text-[10px] text-[#6E667E] uppercase tracking-[0.1em] mb-2">Asset / Pair</p>
            <p className="text-[16px] font-bold text-[#F6F2EA]">{tx.pair}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tx.chainColor }}></span>
              <span className="text-[11px] text-[#A69DB7]">{tx.chain}</span>
            </div>
          </div>

          {/* Amounts */}
          <div className="p-4 rounded-xl bg-white/[0.025] border border-white/[0.06] mb-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-[#6E667E] uppercase tracking-[0.1em] mb-1">Sent</p>
                <p className="text-[14px] font-semibold text-[#F6F2EA]">{tx.sentAmount}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#6E667E] uppercase tracking-[0.1em] mb-1">Received</p>
                <p className="text-[14px] font-semibold text-[#F6F2EA]">{tx.receivedAmount}</p>
              </div>
              {tx.value > 0 && (
                <div>
                  <p className="text-[10px] text-[#6E667E] uppercase tracking-[0.1em] mb-1">Value</p>
                  <p className="text-[14px] font-semibold text-[#D8D1E6]">${tx.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              )}
              <div>
                <p className="text-[10px] text-[#6E667E] uppercase tracking-[0.1em] mb-1">Gas Fee</p>
                <p className="text-[14px] font-semibold text-[#D8D1E6]">{tx.gasFee > 0 ? `$${tx.gasFee.toFixed(2)}` : '-'}</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-4 rounded-xl bg-white/[0.025] border border-white/[0.06] mb-5">
            <h4 className="text-[12px] font-semibold text-[#D8D1E6] mb-3">Details</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#6E667E]">From</span>
                <span className="text-[11px] font-mono text-[#A69DB7]">{tx.from}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#6E667E]">To</span>
                <span className="text-[11px] font-mono text-[#A69DB7]">{tx.to}</span>
              </div>
              {tx.route && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#6E667E]">Route</span>
                  <span className="text-[11px] text-[#A69DB7]">{tx.route}</span>
                </div>
              )}
              {tx.slippage !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#6E667E]">Slippage</span>
                  <span className="text-[11px] text-[#A69DB7]">{tx.slippage}%</span>
                </div>
              )}
              {tx.priceImpact !== undefined && tx.priceImpact > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#6E667E]">Price Impact</span>
                  <span className="text-[11px] text-[#FF7A22]">{tx.priceImpact}%</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#6E667E]">Time</span>
                <span className="text-[11px] text-[#A69DB7]">{tx.time}</span>
              </div>
            </div>
          </div>

          {/* Failure Reason */}
          {tx.status === 'failed' && tx.failureReason && (
            <div className="p-4 rounded-xl bg-[#FF5B5B]/[0.06] border border-[#FF5B5B]/[0.12] mb-5">
              <p className="text-[10px] text-[#FF5B5B] uppercase tracking-[0.1em] mb-1 font-semibold">Failure Reason</p>
              <p className="text-[12px] text-[#D8D1E6] leading-relaxed">{tx.failureReason}</p>
            </div>
          )}

          {/* Tx Hash */}
          {tx.txHash !== '-' && (
            <div className="p-4 rounded-xl bg-white/[0.025] border border-white/[0.06] mb-5">
              <p className="text-[10px] text-[#6E667E] uppercase tracking-[0.1em] mb-2">Transaction Hash</p>
              <p className="text-[11px] font-mono text-[#A69DB7] break-all mb-3">{tx.txHash}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyHash}
                  className="px-3 py-1.5 rounded-full text-[11px] font-medium text-[#A69DB7] bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] hover:text-[#F6F2EA] transition-all duration-200 cursor-pointer whitespace-nowrap relative"
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    <i className="ri-file-copy-line text-[10px]"></i>
                    Copy Hash
                  </span>
                </button>
                <button className="px-3 py-1.5 rounded-full text-[11px] font-medium text-[#A69DB7] bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] hover:text-[#F6F2EA] transition-all duration-200 cursor-pointer whitespace-nowrap relative">
                  <span className="relative z-10 flex items-center gap-1.5">
                    <i className="ri-external-link-line text-[10px]"></i>
                    View Explorer
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}