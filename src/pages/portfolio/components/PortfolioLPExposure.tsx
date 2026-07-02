import { useState, useMemo } from 'react';
import { lpExposures } from '@/mocks/portfolioData';
import type { LPExposure } from '@/mocks/portfolioData';

interface PortfolioLPExposureProps {
  onViewDetails: (exposure: LPExposure) => void;
}

const formatValue = (v: number) => {
  if (v >= 1e6) return '$' + (v / 1e6).toFixed(1) + 'M';
  if (v >= 1e3) return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return '$' + v.toFixed(2);
};

export default function PortfolioLPExposure({ onViewDetails }: PortfolioLPExposureProps) {
  const [chainFilter, setChainFilter] = useState('All Chains');

  const chains = ['All Chains', 'Base', 'Monad'];

  const filtered = useMemo(() => {
    if (chainFilter === 'All Chains') return lpExposures;
    return lpExposures.filter((e) => e.chain === chainFilter);
  }, [chainFilter]);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold text-[#F6F2EA]">LP Exposure</h2>
          <p className="text-[11px] text-[#6E667E] mt-0.5">View detected pool exposure across supported chains.</p>
        </div>
        <div className="flex items-center gap-1.5">
          {chains.map((chain) => (
            <button
              key={chain}
              onClick={() => setChainFilter(chain)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                chainFilter === chain
                  ? 'bg-[#FF6A1A]/12 text-[#FF7A22] border border-[#FF6A1A]/20'
                  : 'bg-white/[0.04] text-[#A69DB7] border border-white/[0.07] hover:bg-white/[0.06] hover:text-[#F6F2EA]'
              }`}
            >
              {chain}
            </button>
          ))}
        </div>
      </div>

      {/* Notice */}
      <div className="p-3 rounded-xl bg-[#FF6A1A]/[0.04] border border-[#FF6A1A]/[0.08]">
        <p className="text-[11px] text-[#A69DB7] leading-relaxed">
          <i className="ri-information-line text-[#FF7A22] mr-1"></i>
          LP exposure is view-only on CrackerSwap. Liquidity management is not available in this module.
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="liquid-glass-table overflow-hidden">
          <div className="relative z-10">
            <div className="hidden sm:grid gap-3 px-5 py-2.5 text-[10px] font-semibold text-[#6E667E] uppercase tracking-[0.1em]" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', gridTemplateColumns: '1fr 100px 120px 100px 120px 100px 120px' }}>
              <span>Pool / Pair</span>
              <span className="text-right">Chain</span>
              <span className="text-right">DEX</span>
              <span className="text-right">Value</span>
              <span className="text-right">Share</span>
              <span className="text-right">24H</span>
              <span className="text-right">Action</span>
            </div>

            {filtered.map((exp) => (
              <div
                key={exp.id}
                className="table-row-glass grid gap-3 px-5 py-3.5 items-center group"
                style={{ gridTemplateColumns: '1fr 100px 120px 100px 120px 100px 120px' }}
              >
                {/* Pool / Pair */}
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center -space-x-1.5">
                    <div className="w-7 h-7 rounded-full bg-[#627EEA]/18 flex items-center justify-center border-2 border-[#0D0620] z-10">
                      <span className="text-[9px] font-bold text-[#627EEA]">{exp.token0Symbol}</span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-[#2775CA]/18 flex items-center justify-center border-2 border-[#0D0620]">
                      <span className="text-[9px] font-bold text-[#2775CA]">{exp.token1Symbol}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[13px] font-semibold text-[#F6F2EA]">{exp.pair}</span>
                    <div className="text-[9px] text-[#6E667E]">{exp.feeTier}</div>
                  </div>
                </div>

                {/* Chain */}
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-[#A69DB7] liquid-glass-badge">
                    <span className="relative z-10 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: exp.chainColor }}></span>
                      {exp.chain}
                    </span>
                  </span>
                </div>

                {/* DEX */}
                <div className="text-right">
                  <span className="text-[11px] text-[#A69DB7]">{exp.dex}</span>
                </div>

                {/* Value */}
                <div className="text-right">
                  <span className="text-[12px] font-semibold text-[#F6F2EA]">{formatValue(exp.positionValue)}</span>
                </div>

                {/* Share of Pool */}
                <div className="text-right">
                  <span className="text-[11px] text-[#A69DB7]">{exp.shareOfPool}%</span>
                </div>

                {/* 24H */}
                <div className="text-right">
                  <span className={`text-[11px] font-semibold ${exp.change24h >= 0 ? 'text-[#34D07F]' : 'text-[#FF5B5B]'}`}>
                    {exp.change24h >= 0 ? '+' : ''}{exp.change24h.toFixed(2)}%
                  </span>
                </div>

                {/* Action */}
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => onViewDetails(exp)}
                    className="liquid-glass-btn-trade px-3 py-1.5 text-[#7B61FF] text-[11px] font-semibold cursor-pointer whitespace-nowrap relative z-10"
                  >
                    <span className="relative z-10">View Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* No LP Exposure */
        <div className="liquid-glass-card p-10 text-center">
          <div className="relative z-10">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
              <i className="ri-drop-line text-xl text-[#6E667E]"></i>
            </div>
            <h3 className="text-[15px] font-semibold text-[#F6F2EA] mb-2">No LP exposure found</h3>
            <p className="text-[12px] text-[#A69DB7] mb-5 max-w-[400px] mx-auto leading-relaxed">
              This wallet does not currently have detected LP exposure across supported pools.
            </p>
            <button className="liquid-glass-btn-primary px-5 py-2.5 text-[#F6F2EA] text-[12px] font-semibold cursor-pointer whitespace-nowrap relative z-10">
              <span className="relative z-10 flex items-center gap-1.5">
                <i className="ri-funds-line text-[13px]"></i>
                Explore Pools
              </span>
            </button>
            <p className="text-[10px] text-[#6E667E] mt-3">CrackerSwap displays view-only LP analytics.</p>
          </div>
        </div>
      )}
    </div>
  );
}