import { useState, useMemo } from 'react';
import { discoveryTokens, tokenCategories, tokenChains, tokenSorts } from '@/mocks/discoveryTokens';
import type { Token } from '@/mocks/discoveryTokens';
import Navbar from '@/components/feature/Navbar';

/* ─── Sparkline ─── */
const Sparkline = ({ data, color }: { data: number[]; color?: string }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  const c = color || '#22C55E';
  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={c}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/* ─── Formats ─── */
const formatPrice = (price: number) => {
  if (price >= 1000) return '$' + price.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (price >= 1) return '$' + price.toLocaleString('en-US', { maximumFractionDigits: 2 });
  return '$' + price.toFixed(8);
};

const formatCompact = (n: number) => {
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(0) + 'M';
  return '$' + (n / 1e3).toFixed(0) + 'K';
};

/* ─── Page ─── */
export default function TokenDiscoveryPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeChain, setActiveChain] = useState('All Chains');
  const [sortBy, setSortBy] = useState('volume');
  const [page, setPage] = useState(1);
  const perPage = 10;

  const pageTokens = discoveryTokens;

  const filtered = useMemo(() => {
    let list = [...pageTokens];
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((t) =>
        t.name.toLowerCase().includes(s) || t.symbol.toLowerCase().includes(s)
      );
    }
    if (activeChain !== 'All Chains') {
      list = list.filter((t) => t.chain === activeChain);
    }
    if (activeCategory === 'Trending') {
      list = list.filter((t) => t.badges.includes('HOT'));
    } else if (activeCategory === 'Top Movers') {
      list = list.sort((a, b) => Math.abs(b.priceChange24h) - Math.abs(a.priceChange24h));
    } else if (activeCategory === 'New Tokens') {
      list = list.filter((t) => t.badges.includes('NEW'));
    } else if (activeCategory === 'Watchlist') {
      list = list.filter((t) => t.watchlisted);
    }

    if (activeCategory !== 'Top Movers') {
      if (sortBy === 'volume') {
        list.sort((a, b) => b.volume24h - a.volume24h);
      } else if (sortBy === 'price') {
        list.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'change') {
        list.sort((a, b) => b.priceChange24h - a.priceChange24h);
      } else if (sortBy === 'marketCap') {
        list.sort((a, b) => b.marketCap - a.marketCap);
      } else if (sortBy === 'liquidity') {
        list.sort((a, b) => b.liquidity - a.liquidity);
      }
    }
    return list;
  }, [search, activeCategory, activeChain, sortBy, pageTokens]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const highlightTokens = useMemo(() => ({
    topGainer: pageTokens.reduce((a, b) => a.priceChange24h > b.priceChange24h ? a : b),
    highestVolume: pageTokens.reduce((a, b) => a.volume24h > b.volume24h ? a : b),
    newListing: pageTokens.find((t) => t.badges.includes('NEW')) || pageTokens[0],
    mostWatched: pageTokens[1],
  }), [pageTokens]);

  const totalTokens = 24;
  const totalVolume = 9.08;
  const trendingCount = 11;
  const newCount = 5;

  const heroPills = [
    { label: 'All Chains', icon: 'ri-global-line' },
    { label: 'Trending', icon: 'ri-fire-line' },
    { label: 'Top Volume', icon: 'ri-bar-chart-box-line' },
    { label: 'New Listings', icon: 'ri-sparkling-line' },
    { label: 'Watchlist', icon: 'ri-star-line' },
  ];

  const badgeColor = (badge: string) => {
    switch (badge) {
      case 'HOT': return 'bg-[#FF6A1A]/15 text-[#FF7A22] border-[#FF6A1A]/25';
      case 'NEW': return 'bg-[#6C4DFF]/15 text-[#7B61FF] border-[#6C4DFF]/25';
      case 'VERIFIED': return 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/25';
      case 'HIGH VOL': return 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/25';
      default: return 'bg-white/10 text-white/60 border-white/10';
    }
  };

  return (
    <div className="min-h-screen bg-[#070214] text-white relative overflow-hidden">
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-[20%] w-[500px] h-[400px] glow-orange opacity-50" />
        <div className="absolute top-[10%] right-[15%] w-[400px] h-[350px] glow-purple opacity-40" />
        <div className="absolute bottom-[10%] left-[30%] w-[300px] h-[300px] glow-purple opacity-30" />
      </div>

      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 pt-[72px]">
        <div className="max-w-[1440px] mx-auto px-6 py-8">

          {/* ─── Hero ─── */}
          <div className="mb-8">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[#FF6A1A] text-xs font-semibold tracking-widest uppercase mb-3 block">
                  TOKEN DISCOVERY
                </span>
                <h1 className="text-[32px] font-bold text-white leading-tight mb-2">
                  Discover what&apos;s moving on-chain
                </h1>
                <p className="text-[#8B8FA3] text-sm max-w-[420px] leading-relaxed">
                  Track trending tokens, new listings, volume leaders, and market signals across chains.
                </p>
              </div>

              <div className="w-[520px] shrink-0">
                {/* Search bar */}
                <div className="relative mb-4">
                  <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-[#8B8FA3] text-lg"></i>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search by token name or contract address"
                    className="w-full h-[52px] pl-12 pr-14 rounded-[16px] bg-[#0A0A1A]/80 border border-[#1A1A2E]/80 text-white text-sm placeholder:text-[#5A5A6E] outline-none focus:border-[#6C4DFF]/50 transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5A5A6E] text-xs border border-[#1A1A2E] px-2 py-0.5 rounded-md">/</span>
                </div>

                {/* Filter pills */}
                <div className="flex items-center gap-2 flex-wrap">
                  {heroPills.map((pill) => (
                    <button
                      key={pill.label}
                      onClick={() => {
                        setActiveCategory(pill.label === 'All Chains' ? 'All' : pill.label);
                        setPage(1);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                        (activeCategory === (pill.label === 'All Chains' ? 'All' : pill.label))
                          ? 'bg-[#FF6A1A]/15 text-[#FF7A22] border border-[#FF6A1A]/20'
                          : 'bg-[#0A0A1A]/60 text-[#8B8FA3] border border-[#1A1A2E]/60 hover:text-white hover:border-[#1A1A2E]'
                      }`}
                    >
                      <i className={`${pill.icon} text-sm`}></i>
                      {pill.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ─── Stats Cards ─── */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="glass-card rounded-[16px] p-5 relative overflow-hidden">
              <div className="w-10 h-10 rounded-[12px] bg-[#FF6A1A]/15 flex items-center justify-center mb-3">
                <i className="ri-database-2-line text-[#FF7A22] text-lg"></i>
              </div>
              <p className="text-[#8B8FA3] text-xs font-medium mb-1">Total Tokens Tracked</p>
              <p className="text-[28px] font-bold text-white leading-none">{totalTokens}</p>
              <p className="text-[#5A5A6E] text-[10px] mt-1">Across all chains</p>
              <div className="absolute bottom-3 right-3 opacity-60">
                <Sparkline data={[20, 22, 21, 24, 23, 24, 24]} color="#FF6A1A" />
              </div>
            </div>

            <div className="glass-card rounded-[16px] p-5 relative overflow-hidden">
              <div className="w-10 h-10 rounded-[12px] bg-[#FF6A1A]/15 flex items-center justify-center mb-3">
                <i className="ri-bar-chart-grouped-line text-[#FF7A22] text-lg"></i>
              </div>
              <p className="text-[#8B8FA3] text-xs font-medium mb-1">24h Volume</p>
              <p className="text-[28px] font-bold text-white leading-none">${totalVolume}B</p>
              <p className="text-[#22C55E] text-[10px] mt-1 flex items-center gap-1">
                <i className="ri-arrow-up-line text-[10px]"></i>
                +12.4% from yesterday
              </p>
              <div className="absolute bottom-3 right-3 opacity-60">
                <Sparkline data={[7.8, 8.1, 8.4, 8.9, 9.0, 9.0, 9.08]} color="#FF6A1A" />
              </div>
            </div>

            <div className="glass-card rounded-[16px] p-5 relative overflow-hidden">
              <div className="w-10 h-10 rounded-[12px] bg-[#FF6A1A]/15 flex items-center justify-center mb-3">
                <i className="ri-fire-line text-[#FF7A22] text-lg"></i>
              </div>
              <p className="text-[#8B8FA3] text-xs font-medium mb-1">Trending Tokens</p>
              <p className="text-[28px] font-bold text-white leading-none">{trendingCount}</p>
              <p className="text-[#FF6A1A] text-[10px] mt-1">Last 1h</p>
              <div className="absolute bottom-3 right-3 opacity-60">
                <Sparkline data={[8, 9, 10, 11, 11, 11, 11]} color="#FF6A1A" />
              </div>
            </div>

            <div className="glass-card rounded-[16px] p-5 relative overflow-hidden">
              <div className="w-10 h-10 rounded-[12px] bg-[#6C4DFF]/15 flex items-center justify-center mb-3">
                <i className="ri-sparkling-line text-[#7B61FF] text-lg"></i>
              </div>
              <p className="text-[#8B8FA3] text-xs font-medium mb-1">New Tokens Listed</p>
              <p className="text-[28px] font-bold text-white leading-none">{newCount}</p>
              <p className="text-[#7B61FF] text-[10px] mt-1">Last 24h</p>
              <div className="absolute bottom-3 right-3 opacity-60">
                <Sparkline data={[2, 3, 4, 5, 5, 5, 5]} color="#7B61FF" />
              </div>
            </div>
          </div>

          {/* ─── Market Highlights ─── */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-white mb-4">Market Highlights</h2>
            <div className="grid grid-cols-4 gap-4">
              {/* Top Gainer */}
              <div className="glass-card rounded-[16px] p-4 relative overflow-hidden">
                <div className="text-[10px] font-semibold text-[#FF6A1A] uppercase tracking-wider mb-3">Top Gainer</div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#2A2A4A] flex items-center justify-center">
                    <i className="ri-link text-[#7B61FF] text-lg"></i>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{highlightTokens.topGainer.name}</div>
                    <div className="text-xs text-[#8B8FA3]">{highlightTokens.topGainer.symbol}</div>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-lg font-bold text-white">{formatPrice(highlightTokens.topGainer.price)}</span>
                    <span className="text-xs text-[#22C55E] ml-2 font-medium">+{highlightTokens.topGainer.priceChange24h.toFixed(2)}%</span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <Sparkline data={highlightTokens.topGainer.sparkline} color="#22C55E" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-4">
                  <span className="text-[10px] text-[#6C4DFF] font-medium flex items-center gap-1 cursor-pointer hover:text-[#7B61FF] transition-colors">
                    View token <i className="ri-arrow-right-line"></i>
                  </span>
                </div>
              </div>

              {/* Highest Volume */}
              <div className="glass-card rounded-[16px] p-4 relative overflow-hidden">
                <div className="text-[10px] font-semibold text-[#FF6A1A] uppercase tracking-wider mb-3">Highest Volume</div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#2A2A4A] flex items-center justify-center">
                    <i className="ri-copper-coin-fill text-[#FF6A1A] text-lg"></i>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{highlightTokens.highestVolume.name}</div>
                    <div className="text-xs text-[#8B8FA3]">{highlightTokens.highestVolume.symbol}</div>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-lg font-bold text-white">{formatCompact(highlightTokens.highestVolume.volume24h)}</span>
                    <span className="text-[10px] text-[#8B8FA3] ml-1 block">24h Volume</span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <Sparkline data={highlightTokens.highestVolume.sparkline} color="#FF6A1A" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-4">
                  <span className="text-[10px] text-[#6C4DFF] font-medium flex items-center gap-1 cursor-pointer hover:text-[#7B61FF] transition-colors">
                    View token <i className="ri-arrow-right-line"></i>
                  </span>
                </div>
              </div>

              {/* New Listing */}
              <div className="glass-card rounded-[16px] p-4 relative overflow-hidden">
                <div className="text-[10px] font-semibold text-[#7B61FF] uppercase tracking-wider mb-3">New Listing</div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#2A2A4A] flex items-center justify-center">
                    <i className="ri-sun-foggy-fill text-[#FF0420] text-lg"></i>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{highlightTokens.newListing.name}</div>
                    <div className="text-xs text-[#8B8FA3]">{highlightTokens.newListing.symbol}</div>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-[10px] text-[#8B8FA3] block">Just listed</span>
                    <span className="text-sm font-bold text-white mt-1 block">{formatPrice(highlightTokens.newListing.price)}</span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <Sparkline data={highlightTokens.newListing.sparkline} color="#7B61FF" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-4">
                  <span className="text-[10px] text-[#6C4DFF] font-medium flex items-center gap-1 cursor-pointer hover:text-[#7B61FF] transition-colors">
                    View token <i className="ri-arrow-right-line"></i>
                  </span>
                </div>
              </div>

              {/* Most Watched */}
              <div className="glass-card rounded-[16px] p-4 relative overflow-hidden">
                <div className="text-[10px] font-semibold text-[#FF6A1A] uppercase tracking-wider mb-3">Most Watched</div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#2A2A4A] flex items-center justify-center">
                    <i className="ri-copper-diamond-fill text-[#627EEA] text-lg"></i>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{highlightTokens.mostWatched.name}</div>
                    <div className="text-xs text-[#8B8FA3]">{highlightTokens.mostWatched.symbol}</div>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-lg font-bold text-white">96.4K</span>
                    <span className="text-[10px] text-[#8B8FA3] ml-1 block">Watchers</span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <Sparkline data={highlightTokens.mostWatched.sparkline} color="#FF6A1A" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-4">
                  <span className="text-[10px] text-[#6C4DFF] font-medium flex items-center gap-1 cursor-pointer hover:text-[#7B61FF] transition-colors">
                    View token <i className="ri-arrow-right-line"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Table Section ─── */}
          <div className="glass-card rounded-[16px] overflow-hidden">
            {/* Filter bar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1A1A2E]/60">
              <div className="flex items-center gap-1">
                {tokenCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setPage(1); }}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                      activeCategory === cat
                        ? 'bg-[#FF6A1A]/15 text-[#FF7A22] border border-[#FF6A1A]/20'
                        : 'text-[#8B8FA3] border border-transparent hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                {/* Chain dropdown */}
                <div className="relative">
                  <select
                    value={activeChain}
                    onChange={(e) => { setActiveChain(e.target.value); setPage(1); }}
                    className="appearance-none bg-[#0A0A1A]/60 border border-[#1A1A2E]/60 rounded-full px-4 py-2 pr-8 text-xs text-[#8B8FA3] outline-none cursor-pointer focus:border-[#6C4DFF]/30"
                  >
                    <option value="All Chains">All Chains</option>
                    {tokenChains.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-[#8B8FA3] text-xs pointer-events-none"></i>
                </div>
                {/* Sort dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-[#0A0A1A]/60 border border-[#1A1A2E]/60 rounded-full px-4 py-2 pr-8 text-xs text-[#8B8FA3] outline-none cursor-pointer focus:border-[#6C4DFF]/30"
                  >
                    {tokenSorts.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-[#8B8FA3] text-xs pointer-events-none"></i>
                </div>
              </div>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-[48px_1fr_120px_110px_100px_100px_100px_110px_140px] gap-2 px-5 py-3 text-[11px] font-semibold text-[#8B8FA3] uppercase tracking-wider border-b border-[#1A1A2E]/40">
              <span className="text-center">#</span>
              <span>Token</span>
              <span>Chain</span>
              <span className="text-right">Price</span>
              <span className="text-right">24h Change</span>
              <span className="text-right">24h Volume</span>
              <span className="text-right">Liquidity</span>
              <span className="text-right">Market Cap</span>
              <span className="text-right">Action</span>
            </div>

            {/* Table rows */}
            <div className="divide-y divide-[#1A1A2E]/30">
              {paginated.map((token) => (
                <div
                  key={token.id}
                  className="grid grid-cols-[48px_1fr_120px_110px_100px_100px_100px_110px_140px] gap-2 px-5 py-3.5 items-center hover:bg-[#0A0A1A]/50 transition-colors group"
                >
                  {/* Rank + Watchlist */}
                  <div className="flex items-center justify-center gap-1">
                    <button className="text-[#5A5A6E] hover:text-[#FF6A1A] transition-colors cursor-pointer">
                      <i className={`${token.watchlisted ? 'ri-star-fill text-[#FF6A1A]' : 'ri-star-line'} text-sm`}></i>
                    </button>
                    <span className="text-[11px] text-[#5A5A6E] font-mono">{token.rank}</span>
                  </div>

                  {/* Token info */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#2A2A4A] flex items-center justify-center shrink-0">
                      <i className={`${token.icon} text-[#8B8FA3] text-base`}></i>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-white">{token.name}</span>
                        <span className="text-[11px] text-[#5A5A6E] font-medium">{token.symbol}</span>
                        {token.badges.map((badge) => (
                          <span key={badge} className={`text-[9px] px-1.5 py-0.5 rounded-[4px] font-semibold border ${badgeColor(badge)}`}>
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Chain */}
                  <div>
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium text-white/80 border border-[#1A1A2E]/60"
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: token.chainColor }}></span>
                      {token.chain}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <span className="text-sm font-semibold text-white">{formatPrice(token.price)}</span>
                  </div>

                  {/* 24h Change */}
                  <div className="text-right flex items-center justify-end gap-2">
                    <Sparkline data={token.sparkline} color={token.priceChange24h >= 0 ? '#22C55E' : '#EF4444'} />
                    <span className={`text-xs font-semibold ${token.priceChange24h >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                      {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                    </span>
                  </div>

                  {/* 24h Volume */}
                  <div className="text-right">
                    <span className="text-xs text-[#B0B0C0] font-medium">{formatCompact(token.volume24h)}</span>
                  </div>

                  {/* Liquidity */}
                  <div className="text-right">
                    <span className="text-xs text-[#B0B0C0] font-medium">{formatCompact(token.liquidity)}</span>
                  </div>

                  {/* Market Cap */}
                  <div className="text-right">
                    <span className="text-xs text-[#B0B0C0] font-medium">{formatCompact(token.marketCap)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2">
                    <button className="px-4 py-2 rounded-full bg-gradient-to-r from-[#6C4DFF] to-[#7B61FF] text-white text-xs font-semibold shadow-[0_0_12px_rgba(108,77,255,0.25)] hover:shadow-[0_0_20px_rgba(108,77,255,0.4)] transition-all cursor-pointer whitespace-nowrap">
                      Trade
                    </button>
                    <button className="w-8 h-8 rounded-full border border-[#1A1A2E]/60 flex items-center justify-center text-[#8B8FA3] hover:text-white hover:border-[#3A3A4E] transition-all cursor-pointer">
                      <i className="ri-bar-chart-line text-sm"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-[#1A1A2E]/60">
              <span className="text-[11px] text-[#8B8FA3]">
                Showing {paginated.length > 0 ? (page - 1) * perPage + 1 : 0}–{(page - 1) * perPage + paginated.length} of {filtered.length} tokens
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 rounded-full border border-[#1A1A2E]/60 flex items-center justify-center text-[#8B8FA3] hover:text-white hover:border-[#3A3A4E] transition-all disabled:opacity-30 cursor-pointer"
                >
                  <i className="ri-arrow-left-s-line text-sm"></i>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      p === page
                        ? 'bg-[#FF6A1A] text-white shadow-[0_0_8px_rgba(255,106,26,0.4)]'
                        : 'border border-[#1A1A2E]/60 text-[#8B8FA3] hover:text-white hover:border-[#3A3A4E]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 rounded-full border border-[#1A1A2E]/60 flex items-center justify-center text-[#8B8FA3] hover:text-white hover:border-[#3A3A4E] transition-all disabled:opacity-30 cursor-pointer"
                >
                  <i className="ri-arrow-right-s-line text-sm"></i>
                </button>
                <div className="relative ml-2">
                  <select className="appearance-none bg-[#0A0A1A]/60 border border-[#1A1A2E]/60 rounded-full px-3 py-1.5 pr-7 text-[11px] text-[#8B8FA3] outline-none cursor-pointer">
                    <option>10 / page</option>
                    <option>20 / page</option>
                    <option>50 / page</option>
                  </select>
                  <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-[#8B8FA3] text-[10px] pointer-events-none"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}