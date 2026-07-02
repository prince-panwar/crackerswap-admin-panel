import { useState, useMemo } from 'react';
import type { Token } from '@/mocks/tokens';
import { trendingTokens } from '@/mocks/tokens';

const categories = ['All', 'Layer 1', 'Layer 2', 'DeFi', 'AI', 'Oracle', 'Stablecoin', 'Modular'];

export default function TrendingTokens() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'price' | 'change' | 'volume'>('change');

  const filtered = useMemo(() => {
    let list = trendingTokens;
    if (activeCategory !== 'All') {
      list = list.filter((t) => t.category === activeCategory);
    }

    if (sortBy === 'price') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'change') {
      return [...list].sort((a, b) => b.priceChange24h - a.priceChange24h);
    }
    return [...list].sort((a, b) => (b.volume24h ?? 0) - (a.volume24h ?? 0));
  }, [activeCategory, sortBy]);

  const Sparkline = ({ data }: { data: number[] }) => {
    if (!data || data.length < 2) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 80;
    const height = 28;
    const points = data
      .map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((v - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
      })
      .join(' ');

    const isPositive = data[data.length - 1] >= data[0];

    return (
      <svg width={width} height={height} className="shrink-0">
        <polyline
          points={points}
          fill="none"
          stroke={isPositive ? '#22c55e' : '#ef4444'}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const formatPrice = (price: number) => {
    if (price >= 1000) return '$' + price.toLocaleString('en-US', { maximumFractionDigits: 0 });
    if (price >= 1) return '$' + price.toLocaleString('en-US', { maximumFractionDigits: 2 });
    return '$' + price.toFixed(4);
  };

  const formatVolume = (vol: number) => {
    if (vol >= 1e9) return '$' + (vol / 1e9).toFixed(1) + 'B';
    if (vol >= 1e6) return '$' + (vol / 1e6).toFixed(0) + 'M';
    return '$' + (vol / 1e3).toFixed(0) + 'K';
  };

  return (
    <div className="glass-card rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent-500/15 flex items-center justify-center">
            <i className="ri-fire-line text-accent-400"></i>
          </div>
          <h3 className="text-base font-heading font-bold text-foreground-950">Trending Tokens</h3>
          <span className="text-xs px-2 py-0.5 rounded-md bg-accent-500/10 text-accent-400 font-semibold">
            {filtered.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-background-200/60 border border-background-300/30 rounded-lg px-3 py-1.5 text-xs font-medium text-foreground-700 outline-none cursor-pointer focus:border-primary-400/30 transition-colors"
          >
            <option value="change">24h Change</option>
            <option value="price">Price</option>
            <option value="volume">Volume</option>
          </select>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/25'
                : 'bg-background-200/50 text-foreground-500 hover:text-foreground-800 hover:bg-background-200/80 border border-transparent'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_120px_80px_80px_90px] gap-3 px-3 py-2.5 text-[11px] font-semibold text-foreground-500 uppercase tracking-wider border-b border-background-200/40">
          <span>Token</span>
          <span className="text-right">Price</span>
          <span className="text-right">24h</span>
          <span className="text-right">Volume</span>
          <span className="text-right">7D Chart</span>
        </div>

        {/* Table rows */}
        <div className="divide-y divide-background-200/20 max-h-[420px] overflow-y-auto">
          {filtered.map((token, idx) => (
            <div
              key={token.id}
              className="grid grid-cols-[1fr_120px_80px_80px_90px] gap-3 px-3 py-3 items-center hover:bg-background-100/30 transition-colors cursor-pointer group"
            >
              {/* Token info */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-foreground-500 w-5 font-mono">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div className="w-8 h-8 rounded-full bg-background-300/50 flex items-center justify-center group-hover:ring-1 ring-primary-400/30 transition-all">
                  <i className={`${token.icon} text-base ${token.symbol === 'BTC' ? 'text-orange-400' : 'text-foreground-600'}`}></i>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-foreground-950 group-hover:text-primary-400 transition-colors">
                      {token.symbol}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-background-200/60 text-foreground-500 font-medium">
                      {token.category}
                    </span>
                  </div>
                  <span className="text-[11px] text-foreground-500 truncate block">
                    {token.name}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="text-right">
                <span className="text-sm font-semibold text-foreground-900 font-heading">
                  {formatPrice(token.price)}
                </span>
              </div>

              {/* 24h Change */}
              <div className="text-right">
                <span
                  className={`text-sm font-semibold font-heading ${
                    token.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {token.priceChange24h >= 0 ? '+' : ''}
                  {token.priceChange24h.toFixed(2)}%
                </span>
              </div>

              {/* Volume */}
              <div className="text-right">
                <span className="text-xs text-foreground-600 font-medium">
                  {token.volume24h ? formatVolume(token.volume24h) : '-'}
                </span>
              </div>

              {/* Sparkline */}
              <div className="flex justify-end">
                {token.sparkline && <Sparkline data={token.sparkline} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}