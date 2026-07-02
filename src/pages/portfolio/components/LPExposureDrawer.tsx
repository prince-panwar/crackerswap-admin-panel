import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LPExposure } from '@/mocks/portfolioData';

interface LPExposureDrawerProps {
  exposure: LPExposure | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatValue = (v: number) => {
  if (v >= 1e6) return '$' + (v / 1e6).toFixed(1) + 'M';
  if (v >= 1e3) return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return '$' + v.toFixed(2);
};

export default function LPExposureDrawer({ exposure, isOpen, onClose }: LPExposureDrawerProps) {
  const navigate = useNavigate();
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

  if (!exposure) return null;

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
        aria-label={`LP details for ${exposure.pair}`}
        className={`fixed z-[101] bg-[#0D0620]/95 backdrop-blur-2xl border-l border-white/[0.08] shadow-[0_0_120px_rgba(0,0,0,0.6)] flex flex-col transition-all duration-[350ms] ease-out
          right-0 top-0 bottom-0 w-full sm:w-[460px] rounded-t-2xl sm:rounded-t-none sm:rounded-l-2xl
          ${isOpen ? 'translate-y-0 sm:translate-x-0' : 'translate-y-full sm:translate-y-0 sm:translate-x-full'}`}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-[200px] h-[200px] bg-[#FF6A1A]/[0.04] rounded-full blur-[80px]" />
          <div className="absolute bottom-[30%] right-0 w-[180px] h-[180px] bg-[#6C4DFF]/[0.04] rounded-full blur-[80px]" />
        </div>

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-[110] w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.06] border border-white/[0.10] text-[#A69DB7] hover:text-[#F6F2EA] hover:bg-white/[0.10] transition-all cursor-pointer backdrop-blur-md"
        >
          <i className="ri-close-line"></i>
        </button>

        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6 sm:py-7 relative z-10">
          {/* Header */}
          <div className="mb-5 pr-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center -space-x-2">
                <div className="w-10 h-10 rounded-full bg-[#627EEA]/20 flex items-center justify-center border-2 border-[#0D0620] z-10">
                  <span className="text-[#627EEA] text-[11px] font-bold">{exposure.token0Symbol}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#2775CA]/20 flex items-center justify-center border-2 border-[#0D0620]">
                  <span className="text-[#2775CA] text-[11px] font-bold">{exposure.token1Symbol}</span>
                </div>
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-[#F6F2EA]">{exposure.pair}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-[#A69DB7] liquid-glass-badge">
                    <span className="relative z-10 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: exposure.chainColor }}></span>
                      {exposure.chain}
                    </span>
                  </span>
                  <span className="text-[10px] text-[#6E667E]">{exposure.dex}</span>
                </div>
              </div>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium text-[#A69DB7] liquid-glass-badge">
              <span className="relative z-10">Fee: {exposure.feeTier}</span>
            </span>
          </div>

          {/* Position Value */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] mb-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-[#6E667E] uppercase tracking-[0.1em] mb-1">Position Value</p>
                <p className="text-[22px] font-bold text-[#F6F2EA]">{formatValue(exposure.positionValue)}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#6E667E] uppercase tracking-[0.1em] mb-1">Share of Pool</p>
                <p className="text-[22px] font-bold text-[#F6F2EA]">{exposure.shareOfPool}%</p>
              </div>
              <div>
                <p className="text-[10px] text-[#6E667E] uppercase tracking-[0.1em] mb-1">24H Change</p>
                <p className={`text-[14px] font-semibold ${exposure.change24h >= 0 ? 'text-[#34D07F]' : 'text-[#FF5B5B]'}`}>
                  {exposure.change24h >= 0 ? '+' : ''}{exposure.change24h.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-[10px] text-[#6E667E] uppercase tracking-[0.1em] mb-1">Pool APR</p>
                <p className="text-[14px] font-semibold text-[#D8D1E6]">{exposure.poolAPR}%</p>
              </div>
            </div>
          </div>

          {/* Token Split */}
          <div className="p-4 rounded-xl bg-white/[0.025] border border-white/[0.06] mb-5">
            <h4 className="text-[12px] font-semibold text-[#D8D1E6] mb-3">Token Split</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#627EEA]/20 flex items-center justify-center">
                    <span className="text-[#627EEA] text-[10px] font-bold">{exposure.token0Symbol}</span>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#F6F2EA]">{exposure.token0Amount} {exposure.token0Symbol}</p>
                    <p className="text-[10px] text-[#6E667E]">{exposure.token0Share}%</p>
                  </div>
                </div>
                <p className="text-[13px] font-semibold text-[#D8D1E6]">{formatValue(exposure.token0Value)}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#2775CA]/20 flex items-center justify-center">
                    <span className="text-[#2775CA] text-[10px] font-bold">{exposure.token1Symbol}</span>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#F6F2EA]">{exposure.token1Amount} {exposure.token1Symbol}</p>
                    <p className="text-[10px] text-[#6E667E]">{exposure.token1Share}%</p>
                  </div>
                </div>
                <p className="text-[13px] font-semibold text-[#D8D1E6]">{formatValue(exposure.token1Value)}</p>
              </div>
            </div>
          </div>

          {/* Pool Stats */}
          <div className="p-4 rounded-xl bg-white/[0.025] border border-white/[0.06] mb-5">
            <h4 className="text-[12px] font-semibold text-[#D8D1E6] mb-3">Pool Stats</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[9px] text-[#6E667E] mb-1">TVL</p>
                <p className="text-[12px] font-semibold text-[#D8D1E6]">{formatValue(exposure.poolTVL)}</p>
              </div>
              <div className="text-center p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[9px] text-[#6E667E] mb-1">APR</p>
                <p className="text-[12px] font-semibold text-[#34D07F]">{exposure.poolAPR}%</p>
              </div>
              <div className="text-center p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[9px] text-[#6E667E] mb-1">24H Vol</p>
                <p className="text-[12px] font-semibold text-[#D8D1E6]">{formatValue(exposure.poolVolume24h)}</p>
              </div>
            </div>
          </div>

          {/* Notice */}
          <div className="p-3 rounded-xl bg-[#FF6A1A]/[0.04] border border-[#FF6A1A]/[0.08] mb-5">
            <p className="text-[10px] text-[#A69DB7] leading-relaxed">
              <i className="ri-information-line text-[#FF7A22] mr-1"></i>
              LP exposure is view-only on CrackerSwap. Liquidity management is not available in this module.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => { navigate(`/pools/${exposure.token0Symbol.toLowerCase()}-${exposure.token1Symbol.toLowerCase()}`); onClose(); }}
              className="liquid-glass-btn-primary w-full px-5 py-3 text-[#F6F2EA] text-[13px] font-semibold cursor-pointer whitespace-nowrap relative z-10"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <i className="ri-line-chart-line text-sm"></i>
                View Pool
              </span>
            </button>
            <button
              onClick={() => { navigate(`/swap?from=${exposure.token0Symbol}&to=${exposure.token1Symbol}`); onClose(); }}
              className="px-4 py-2.5 rounded-full text-[12px] font-medium text-[#A69DB7] bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] hover:text-[#F6F2EA] transition-all duration-200 cursor-pointer whitespace-nowrap relative"
            >
              <span className="relative z-10 flex items-center justify-center gap-1.5">
                <i className="ri-swap-box-line text-[11px]"></i>
                Trade Pair
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}