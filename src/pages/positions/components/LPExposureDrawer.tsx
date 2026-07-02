import { useEffect, useRef } from 'react';
import type { PositionLPExposure } from '@/mocks/positionsData';

interface Props {
  exposure: PositionLPExposure | null;
  isOpen: boolean;
  onClose: () => void;
  onViewPool: (slug: string) => void;
  onTradePair: (token0: string, token1: string) => void;
}

export default function LPExposureDrawer({ exposure, isOpen, onClose, onViewPool, onTradePair }: Props) {
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

  if (!exposure) return null;

  const isLowData = exposure.status === 'Low Data';

  return (
    <>
      {/* Backdrop */}
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 z-[80] h-full w-full sm:w-[480px] liquid-glass-strong rounded-l-[24px] transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="relative z-10 h-full flex flex-col p-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[16px] font-semibold text-[#F6F2EA]">{exposure.pair} LP Exposure</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-[#A69DB7] hover:text-[#F6F2EA] hover:bg-white/[0.06] transition-all cursor-pointer">
              <i className="ri-close-line text-lg"></i>
            </button>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap mb-5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium text-[#D8D1E6] bg-[#1A1A2E]/50 border border-white/[0.06]">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: exposure.chain === 'Base' ? '#0052FF' : '#FF6A1A' }} />
              {exposure.chain}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/[0.06] bg-[#6C4DFF]/10 text-[#6C4DFF] text-[10px] font-medium">
              <i className="ri-exchange-line text-[9px]"></i>
              {exposure.dex}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#FF6A1A]/20 bg-[#FF6A1A]/10 text-[#FF7A22] text-[10px] font-medium">
              {exposure.feeTier}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium border ${exposure.status === 'Low Data' ? 'bg-[#FF8A3D]/10 text-[#FF8A3D] border-[#FF8A3D]/20' : 'bg-[#6E667E]/10 text-[#6E667E] border-white/[0.06]'}`}>
              {exposure.status === 'Low Data' ? (
                <><span className="w-1.5 h-1.5 rounded-full bg-[#FF8A3D] inline-block mr-1.5" /> Low Data</>
              ) : 'View-only'}
            </span>
          </div>

          {/* Low Data Warning */}
          {isLowData && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-[12px] bg-[#FF8A3D]/6 border border-[#FF8A3D]/12 mb-5">
              <i className="ri-alert-line text-[#FF8A3D] text-sm mt-0.5 shrink-0"></i>
              <div>
                <p className="text-[12px] text-[#FF8A3D] font-medium">Limited LP data</p>
                <p className="text-[11px] text-[#A69DB7]">This position has limited source data. Exposure values may be estimated or delayed.</p>
              </div>
            </div>
          )}

          {/* Exposure Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="text-[10px] text-[#6E667E] uppercase tracking-wider mb-1">Exposure Value</div>
              <div className={`text-[15px] font-semibold ${isLowData ? 'text-[#FF8A3D]' : 'text-[#F6F2EA]'}`}>
                {isLowData ? 'Detected' : `$${exposure.exposureValue!.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="text-[10px] text-[#6E667E] uppercase tracking-wider mb-1">Pool Share</div>
              <div className={`text-[15px] font-semibold ${isLowData ? 'text-[#FF8A3D]' : 'text-[#F6F2EA]'}`}>
                {exposure.poolShare || 'Unavailable'}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="text-[10px] text-[#6E667E] uppercase tracking-wider mb-1">Pool TVL</div>
              <div className="text-[15px] font-semibold text-[#F6F2EA]">${exposure.poolTVL.toFixed(1)}M</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="text-[10px] text-[#6E667E] uppercase tracking-wider mb-1">Pool APR</div>
              <div className={`text-[15px] font-semibold ${exposure.poolAPR !== null ? 'text-[#34D07F]' : 'text-[#6E667E]'}`}>
                {exposure.poolAPR !== null ? `${exposure.poolAPR.toFixed(1)}%` : 'Unavailable'}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="text-[10px] text-[#6E667E] uppercase tracking-wider mb-1">24H Change</div>
              <div className={`text-[15px] font-semibold ${exposure.change24h >= 0 ? 'text-[#34D07F]' : 'text-[#FF5B5B]'}`}>
                {exposure.change24h !== 0 ? `${exposure.change24h >= 0 ? '+' : ''}${exposure.change24h.toFixed(2)}%` : '—'}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="text-[10px] text-[#6E667E] uppercase tracking-wider mb-1">Last Updated</div>
              <div className="text-[13px] font-semibold text-[#F6F2EA]">{exposure.lastUpdated}</div>
            </div>
          </div>

          {/* Token Split */}
          <div className="mb-5">
            <div className="text-[10px] font-semibold text-[#6E667E] uppercase tracking-wider mb-3">Token Split</div>
            {isLowData ? (
              <div className="p-3 rounded-xl bg-[#FF8A3D]/6 border border-[#FF8A3D]/12 text-[12px] text-[#A69DB7]">
                Token split data is partial or unavailable for this position.
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#FF6A1A]/15 flex items-center justify-center text-[10px] font-bold text-[#FF7A22]">
                      {exposure.token0Symbol[0]}
                    </div>
                    <span className="text-[13px] font-medium text-[#F6F2EA]">{exposure.token0Symbol}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[12px] font-semibold text-[#F6F2EA]">{exposure.token0Amount}</div>
                    <div className="text-[11px] text-[#6E667E]">{exposure.token0Usd} · {exposure.token0Split}%</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#6C4DFF]/15 flex items-center justify-center text-[10px] font-bold text-[#6C4DFF]">
                      {exposure.token1Symbol[0]}
                    </div>
                    <span className="text-[13px] font-medium text-[#F6F2EA]">{exposure.token1Symbol}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[12px] font-semibold text-[#F6F2EA]">{exposure.token1Amount}</div>
                    <div className="text-[11px] text-[#6E667E]">{exposure.token1Usd} · {exposure.token1Split}%</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notice */}
          <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] mb-5">
            <i className="ri-information-line text-[#6E667E] text-sm shrink-0"></i>
            <span className="text-[11px] text-[#A69DB7]">Liquidity management is not available in this module.</span>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 mt-auto">
            <button
              onClick={() => { onViewPool(exposure.poolSlug); onClose(); }}
              className="liquid-glass-btn-primary px-5 py-3 text-[13px] text-white font-semibold rounded-full cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
            >
              <i className="ri-eye-line text-sm"></i>
              View Pool
            </button>
            <button
              onClick={() => { onTradePair(exposure.token0Symbol, exposure.token1Symbol); onClose(); }}
              className="liquid-glass-btn px-5 py-3 text-[13px] text-[#F6F2EA] font-medium rounded-full cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
            >
              <i className="ri-arrow-left-right-line text-sm"></i>
              Trade Pair
            </button>
          </div>
        </div>
      </div>
    </>
  );
}