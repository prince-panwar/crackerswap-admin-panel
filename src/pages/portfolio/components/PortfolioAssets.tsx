import { useState, useMemo } from 'react';
import { portfolioTokens } from '@/mocks/portfolioData';
import type { PortfolioToken } from '@/mocks/portfolioData';

interface PortfolioAssetsProps {
  onViewToken: (token: PortfolioToken) => void;
  onTradeToken: (symbol: string) => void;
}

const formatPrice = (price: number) => {
  if (price >= 10000) return '$' + price.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (price >= 1) return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return '$' + price.toFixed(8);
};

const formatValue = (v: number) => {
  if (v >= 1000) return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return '$' + v.toFixed(2);
};

const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
  if (!data || data.length < 2) return null;
  const w = 56;
  const h = 20;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default function PortfolioAssets({ onViewToken, onTradeToken }: PortfolioAssetsProps) {
  const [search, setSearch] = useState('');
  const [chainFilter, setChainFilter] = useState('All Chains');

  const filtered = useMemo(() => {
    let list = [...portfolioTokens];
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((t) => t.name.toLowerCase().includes(s) || t.symbol.toLowerCase().includes(s));
    }
    if (chainFilter !== 'All Chains') {
      list = list.filter((t) => t.chain === chainFilter);
    }
    return list;
  }, [search, chainFilter]);

  const chains = ['All Chains', ...Array.from(new Set(portfolioTokens.map((t) => t.chain)))];

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold text-[#F6F2EA]">Asset Balances</h2>
          <p className="text-[11px] text-[#6E667E] mt-0.5">Your token holdings across connected chains.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 max-w-[320px]">
          <div className="relative flex items-center h-[38px] rounded-full bg-white/[0.035] border border-white/[0.07] backdrop-blur-[12px] px-4 transition-all duration-200 focus-within:border-[#6C4DFF]/20">
            <i className="ri-search-line text-[#6E667E] text-[13px] mr-2 shrink-0"></i>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search token"
              className="flex-1 bg-transparent text-[#F6F2EA] text-[12px] placeholder:text-[#6E667E] outline-none min-w-0"
            />
          </div>
        </div>
        {/* Chain Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
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

      {/* Table */}
      <div className="liquid-glass-table overflow-hidden">
        <div className="relative z-10">
          <div className="hidden sm:grid gap-3 px-5 py-2.5 text-[10px] font-semibold text-[#6E667E] uppercase tracking-[0.1em]" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', gridTemplateColumns: '1fr 100px 100px 100px 100px 130px' }}>
            <span>Token</span>
            <span className="text-right">Balance</span>
            <span className="text-right">Price</span>
            <span className="text-right">Value</span>
            <span className="text-right">24H</span>
            <span className="text-right">Actions</span>
          </div>

          {filtered.map((token) => (
            <div
              key={token.id}
              className="table-row-glass grid gap-3 px-5 py-3 items-center group"
              style={{ gridTemplateColumns: '1fr 100px 100px 100px 100px 130px' }}
            >
              {/* Token */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: token.iconBgColor + '18' }}>
                  <i className={token.icon} style={{ fontSize: 14, color: token.iconBgColor }}></i>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-semibold text-[#F6F2EA]">{token.name}</span>
                    <span className="text-[10px] text-[#6E667E] font-medium">{token.symbol}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 mt-0.5 text-[9px] text-[#6E667E]">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: token.chainColor }}></span>
                    {token.chain}
                  </span>
                </div>
              </div>

              {/* Balance */}
              <div className="text-right">
                <span className="text-[12px] font-semibold text-[#F6F2EA]">{token.balance.toLocaleString('en-US')}</span>
                <span className="text-[10px] text-[#6E667E] ml-1">{token.symbol}</span>
              </div>

              {/* Price */}
              <div className="text-right">
                <span className="text-[12px] text-[#D8D1E6]">{formatPrice(token.price)}</span>
              </div>

              {/* Value */}
              <div className="text-right">
                <span className="text-[12px] font-semibold text-[#F6F2EA]">{formatValue(token.value)}</span>
              </div>

              {/* 24H */}
              <div className="text-right flex items-center justify-end gap-1.5">
                <span className={`text-[11px] font-semibold ${token.priceChange24h >= 0 ? 'text-[#34D07F]' : 'text-[#FF5B5B]'}`}>
                  {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                </span>
                <Sparkline data={token.sparkline} color={token.priceChange24h >= 0 ? '#34D07F' : '#FF5B5B'} />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-1.5">
                <button
                  onClick={() => onViewToken(token)}
                  className="liquid-glass-icon-btn w-7 h-7 flex items-center justify-center text-[#A69DB7] hover:text-[#F6F2EA] transition-all cursor-pointer"
                  aria-label={`View ${token.symbol} details`}
                >
                  <i className="ri-eye-line text-xs relative z-10"></i>
                </button>
                <button
                  onClick={() => onTradeToken(token.symbol)}
                  className="liquid-glass-btn-trade px-3 py-1.5 text-[#7B61FF] text-[11px] font-semibold cursor-pointer whitespace-nowrap relative z-10"
                >
                  <span className="relative z-10">Trade</span>
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="px-5 py-12 text-center">
              <p className="text-[13px] text-[#6E667E]">No tokens found matching your filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="liquid-glass-card p-4">
        <div className="relative z-10 flex items-center gap-4">
          <span className="text-[11px] font-medium text-[#A69DB7]">Quick Actions:</span>
          {[
            { label: 'Trade', icon: 'ri-swap-box-line', color: '#FF6A1A', action: () => onTradeToken('ETH') },
            { label: 'View Pools', icon: 'ri-funds-line', color: '#6C4DFF', action: () => {} },
            { label: 'View Activity', icon: 'ri-history-line', color: '#7B61FF', action: () => {} },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium bg-white/[0.04] border border-white/[0.07] text-[#A69DB7] hover:bg-white/[0.06] hover:text-[#F6F2EA] hover:border-white/[0.10] transition-all cursor-pointer whitespace-nowrap"
            >
              <i className={`${item.icon} text-[10px]`} style={{ color: item.color }}></i>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}