import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { discoveryTokens } from '@/mocks/discoveryTokens';
import type { Token } from '@/mocks/discoveryTokens';
import TokenChartDrawer from './components/TokenChartDrawer';

/* ─── Sparkline ─── */
const Sparkline = ({ data, color, width = 60, height = 22, fill = false }: { data: number[]; color?: string; width?: number; height?: number; fill?: boolean }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = width;
  const h = height;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  const c = color || '#22C55E';

  if (fill) {
    const fillPoints = `${points} ${w},${h} 0,${h}`;
    return (
      <svg width={w} height={h} className="shrink-0">
        <polygon points={fillPoints} fill={c} opacity={0.12} />
        <polyline points={points} fill="none" stroke={c} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

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
  if (price >= 10000) return '$' + price.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (price >= 1) return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return '$' + price.toFixed(8);
};

const formatCompact = (n: number) => {
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(0) + 'M';
  return '$' + (n / 1e3).toFixed(0) + 'K';
};

/* ─── Token Icon Circle ─── */
const TokenIcon = ({ token, size = 32 }: { token: Token; size?: number }) => (
  <div
    className="rounded-full flex items-center justify-center shrink-0 relative z-10"
    style={{ width: size, height: size, backgroundColor: token.iconBgColor + '18' }}
  >
    <i className={`${token.icon}`} style={{ fontSize: size * 0.45, color: token.iconBgColor }}></i>
  </div>
);

/* ─── Stat Card ─── */
const StatCard = ({
  label,
  value,
  sub,
  trend,
  trendUp,
  icon,
  sparkData,
  sparkColor,
  iconColor,
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: string;
  trendUp?: boolean;
  icon: string;
  sparkData: number[];
  sparkColor: string;
  iconColor: string;
}) => (
  <div className="liquid-glass-card p-5 relative flex flex-col justify-between min-h-[140px] group">
    <div className="relative z-10 flex items-start justify-between">
      <div>
        <p className="text-[10px] font-semibold text-[#6E667E] uppercase tracking-[0.12em] mb-2">{label}</p>
        <p className="text-[28px] font-bold text-[#F6F2EA] leading-none tracking-tight">{value}</p>
      </div>
      <div className="liquid-glass-icon-btn w-9 h-9 rounded-full flex items-center justify-center">
        <i className={`${icon} text-sm relative z-10`} style={{ color: iconColor }}></i>
      </div>
    </div>
    <div className="relative z-10 flex items-center justify-between mt-3">
      <div className="flex items-center gap-1.5">
        {trend && (
          <span className={`text-[11px] font-semibold ${trendUp ? 'text-[#34D07F]' : 'text-[#FF5B5B]'}`}>
            {trendUp ? '+' : ''}{trend}
          </span>
        )}
        {sub && <span className="text-[10px] text-[#6E667E]">{sub}</span>}
      </div>
      <div className="opacity-60">
        <Sparkline data={sparkData} color={sparkColor} width={64} height={20} />
      </div>
    </div>
  </div>
);

/* ─── Highlight Card ─── */
const HighlightCard = ({
  title,
  titleColor,
  token,
  metric,
  metricLabel,
  metricColor,
}: {
  title: string;
  titleColor: string;
  token: Token;
  metric: string;
  metricLabel: string;
  metricColor: string;
}) => (
  <div className="liquid-glass-card p-4 relative">
    <div className="relative z-10 flex items-center justify-between mb-3">
      <span className="text-[9px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full liquid-glass-badge" style={{ color: titleColor }}>
        <span className="relative z-10">{title}</span>
      </span>
      <button className="liquid-glass-icon-btn w-6 h-6 rounded-full flex items-center justify-center text-[#6E667E] hover:text-[#F6F2EA] transition-colors cursor-pointer">
        <i className="ri-external-link-line text-[10px] relative z-10"></i>
      </button>
    </div>
    <div className="relative z-10 flex items-center gap-3 mb-3">
      <TokenIcon token={token} size={40} />
      <div>
        <div className="text-[13px] font-semibold text-[#F6F2EA]">{token.name}</div>
        <div className="text-[10px] text-[#6E667E] font-medium">{token.symbol}</div>
      </div>
    </div>
    <div className="relative z-10 flex items-center gap-1.5 mb-2">
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: token.chainColor }}></span>
      <span className="text-[10px] text-[#6E667E]">{token.chain}</span>
    </div>
    <div className="relative z-10 flex items-end justify-between">
      <div>
        <span className="text-lg font-bold" style={{ color: metricColor }}>{metric}</span>
        <span className="text-[10px] text-[#6E667E] ml-1.5">{metricLabel}</span>
      </div>
      <div className="opacity-50">
        <Sparkline data={token.sparkline} color={metricColor} width={52} height={18} />
      </div>
    </div>
    <div className="relative z-10 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <button className="text-[11px] font-medium text-[#6E667E] hover:text-[#FF7A22] transition-colors cursor-pointer flex items-center gap-1">
        View <i className="ri-arrow-right-up-line text-[10px]"></i>
      </button>
    </div>
  </div>
);

/* ─── Page ─── */
export default function TokenDiscoveryV2Page() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeChain, setActiveChain] = useState('All Chains');
  const [sortBy, setSortBy] = useState('volume');
  const [page, setPage] = useState(1);
  const [drawerToken, setDrawerToken] = useState<Token | null>(null);
  const [watchlistSet, setWatchlistSet] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    discoveryTokens.forEach((t) => { if (t.watchlisted) initial.add(t.id); });
    return initial;
  });
  const perPage = 10;

  const toggleWatchlist = (tokenId: string) => {
    setWatchlistSet((prev) => {
      const next = new Set(prev);
      if (next.has(tokenId)) next.delete(tokenId);
      else next.add(tokenId);
      return next;
    });
  };

  const openChartDrawer = (token: Token) => setDrawerToken(token);
  const closeChartDrawer = () => setDrawerToken(null);

  const tokensWithWatchlist = useMemo(
    () => discoveryTokens.map((t) => ({ ...t, watchlisted: watchlistSet.has(t.id) })),
    [watchlistSet]
  );

  const filtered = useMemo(() => {
    let list = [...tokensWithWatchlist];
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
      if (sortBy === 'volume') list.sort((a, b) => b.volume24h - a.volume24h);
      else if (sortBy === 'price') list.sort((a, b) => b.price - a.price);
      else if (sortBy === 'change') list.sort((a, b) => b.priceChange24h - a.priceChange24h);
      else if (sortBy === 'marketCap') list.sort((a, b) => b.marketCap - a.marketCap);
      else if (sortBy === 'liquidity') list.sort((a, b) => b.liquidity - a.liquidity);
    }
    return list;
  }, [search, activeCategory, activeChain, sortBy, tokensWithWatchlist]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const highlightTokens = useMemo(() => ({
    topGainer: discoveryTokens.reduce((a, b) => (a.priceChange24h > b.priceChange24h ? a : b)),
    highestVolume: discoveryTokens.reduce((a, b) => (a.volume24h > b.volume24h ? a : b)),
    newListing: discoveryTokens.find((t) => t.badges.includes('NEW')) || discoveryTokens[0],
    mostWatched: discoveryTokens[1],
  }), [discoveryTokens]);

  const heroPills = [
    { label: 'All Chains', icon: 'ri-global-line' },
    { label: 'Trending', icon: 'ri-fire-line' },
    { label: 'Top Volume', icon: 'ri-bar-chart-box-line' },
    { label: 'New Listings', icon: 'ri-sparkling-line' },
    { label: 'Watchlist', icon: 'ri-star-line' },
  ];

  const badgeStyle = (badge: string) => {
    switch (badge) {
      case 'HOT': return { bg: 'rgba(255, 106, 26, 0.12)', color: '#FF7A22', border: 'rgba(255, 106, 26, 0.15)' };
      case 'NEW': return { bg: 'rgba(108, 77, 255, 0.12)', color: '#7B61FF', border: 'rgba(108, 77, 255, 0.15)' };
      case 'VERIFIED': return { bg: 'rgba(52, 208, 127, 0.12)', color: '#34D07F', border: 'rgba(52, 208, 127, 0.15)' };
      case 'HIGH VOL': return { bg: 'rgba(255, 91, 91, 0.12)', color: '#FF5B5B', border: 'rgba(255, 91, 91, 0.15)' };
      default: return { bg: 'rgba(255,255,255,0.05)', color: '#6E667E', border: 'rgba(255,255,255,0.08)' };
    }
  };

  return (
    <div className="min-h-screen bg-[#070214] text-[#F6F2EA] relative overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[0%] left-[50%] -translate-x-1/2 w-[700px] h-[500px] bg-[#FF6A1A]/[0.025] rounded-full blur-[140px]" />
        <div className="absolute top-[15%] right-[5%] w-[500px] h-[500px] bg-[#6C4DFF]/[0.025] rounded-full blur-[140px]" />
        <div className="absolute top-[55%] left-[0%] w-[400px] h-[400px] bg-[#6C4DFF]/[0.02] rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[20%] w-[300px] h-[300px] bg-[#FF6A1A]/[0.02] rounded-full blur-[100px]" />
      </div>

      {/* ─── Floating Pill Navbar ─── */}
      <div className="relative z-50 pt-6 px-6">
        <div className="max-w-[1200px] mx-auto">
          <nav className="h-[52px] liquid-glass-nav flex items-center justify-between px-2">
            <div className="relative z-10 flex items-center gap-2 pl-3">
              <Link to="/" className="flex items-center gap-2 cursor-pointer group">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF6A1A] to-[#FF7A22] flex items-center justify-center shadow-[0_0_12px_rgba(255,106,26,0.25)]">
                  <i className="ri-flashlight-fill text-white text-sm"></i>
                </div>
                <span className="text-[#F6F2EA] font-semibold text-sm tracking-tight">CrackerSwap</span>
              </Link>
            </div>

            <div className="relative z-10 flex items-center gap-1">
              {[
                { label: 'Tokens', path: '/v2' },
                { label: 'Swap', path: '/swap' },
                { label: 'Pools', path: '/pools' },
                { label: 'Positions', path: '/positions' },
                { label: 'Portfolio', path: '/portfolio' },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap relative z-10 ${
                    item.label === 'Tokens'
                      ? 'bg-[#FF6A1A]/12 text-[#FF7A22] border border-[#FF6A1A]/20'
                      : 'text-[#6E667E] hover:text-[#F6F2EA]'
                  }`}
                >
                  {item.label === 'Tokens' && (
                    <i className="ri-copper-coin-fill text-[10px] mr-1"></i>
                  )}
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="relative z-10 flex items-center gap-2 pr-3">
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium text-[#34D07F] liquid-glass-badge">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34D07F] animate-pulse relative z-10"></span>
                <span className="relative z-10">Live Tx</span>
              </span>
              <button className="liquid-glass-icon-btn w-7 h-7 rounded-full flex items-center justify-center text-[#6E667E] hover:text-[#F6F2EA] transition-colors cursor-pointer">
                <i className="ri-refresh-line text-xs relative z-10"></i>
              </button>
              <button className="liquid-glass-btn-primary px-3.5 py-1.5 text-[#F6F2EA] text-[11px] font-semibold cursor-pointer whitespace-nowrap relative z-10">
                <i className="ri-wallet-3-line text-[10px] mr-1 relative z-10"></i>
                <span className="relative z-10">Connect Wallet</span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-8 flex flex-col gap-6">

        {/* Hero Card */}
        <div className="hero-discovery-card">
          {/* Ambient glow orbs inside the hero */}
          <div className="absolute top-0 left-[5%] w-[350px] h-[280px] bg-[#FF6A1A]/[0.04] rounded-full blur-[120px] pointer-events-none z-0" />
          <div className="absolute top-0 right-[5%] w-[350px] h-[280px] bg-[#6C4DFF]/[0.03] rounded-full blur-[120px] pointer-events-none z-0" />

          <div className="relative z-10 p-8 md:p-14">
            {/* Eyebrow label */}
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#FF7A22] tracking-[0.15em] uppercase mb-5 px-3 py-1.5 rounded-full border border-[#FF6A1A]/15 bg-[#FF6A1A]/8">
              <i className="ri-sparkling-line text-[10px]"></i>
              TOKEN DISCOVERY
            </span>

            {/* Title */}
            <h1 className="text-[36px] md:text-[44px] font-bold text-[#F6F2EA] leading-[1.12] mb-4 tracking-tight">
              Discover what&apos;s <span className="text-[#FF7A22]">moving</span> on-<br className="hidden md:block" />chain.
            </h1>

            {/* Subtitle */}
            <p className="text-[13px] md:text-[14px] text-[#A69DB7] max-w-[620px] leading-relaxed mb-8">
              Track trending tokens, new listings, volume leaders, and market signals across chains — built for fair launches and real teams.
            </p>

            {/* Search bar — integrated, not a separate card */}
            <div className="relative mb-3 max-w-[720px]">
              <div className="relative flex items-center h-[52px] md:h-[54px] rounded-full bg-white/[0.035] border border-white/[0.08] backdrop-blur-[16px] saturate-[130%] px-5 transition-all duration-200 focus-within:border-[#6C4DFF]/25 focus-within:shadow-[0_0_0_3px_rgba(108,77,255,0.06)]">
                <i className="ri-search-line text-[#6E667E] text-[15px] mr-3 shrink-0"></i>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search by token name or contract address"
                  className="flex-1 bg-transparent text-[#F6F2EA] text-[13px] placeholder:text-[#6E667E] outline-none min-w-0"
                />
                <span className="text-[10px] text-[#6E667E] font-medium px-1.5 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] shrink-0 ml-2">
                  ⌘K
                </span>
              </div>
            </div>

            {/* Filter pills — directly below search, no extra card */}
            <div className="flex items-center gap-2 flex-wrap">
              {heroPills.map((pill) => (
                <button
                  key={pill.label}
                  onClick={() => {
                    setActiveCategory(pill.label === 'All Chains' ? 'All' : pill.label);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    (activeCategory === (pill.label === 'All Chains' ? 'All' : pill.label))
                      ? 'bg-[#FF6A1A]/12 text-[#FF7A22] border border-[#FF6A1A]/20'
                      : 'bg-white/[0.04] text-[#A69DB7] border border-white/[0.07] hover:bg-white/[0.06] hover:text-[#F6F2EA] hover:border-white/[0.10]'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            label="Total Tokens Tracked"
            value="24,583"
            sub="Across 2 chains"
            icon="ri-database-2-line"
            sparkData={[20000, 21000, 22000, 23000, 24000, 24500, 24583]}
            sparkColor="#FF6A1A"
            iconColor="#FF6A1A"
          />
          <StatCard
            label="24h Volume"
            value="$9.08B"
            trend="12.4%"
            trendUp
            sub="from yesterday"
            icon="ri-bar-chart-grouped-line"
            sparkData={[7.8, 8.1, 8.4, 8.9, 9.0, 9.0, 9.08]}
            sparkColor="#6C4DFF"
            iconColor="#6C4DFF"
          />
          <StatCard
            label="Trending Tokens"
            value="11"
            sub="Last 1h"
            icon="ri-fire-line"
            sparkData={[8, 9, 10, 11, 11, 11, 11]}
            sparkColor="#FF6A1A"
            iconColor="#FF6A1A"
          />
          <StatCard
            label="New Tokens Listed"
            value="5"
            sub="Last 24h"
            icon="ri-sparkling-line"
            sparkData={[2, 3, 4, 5, 5, 5, 5]}
            sparkColor="#6C4DFF"
            iconColor="#6C4DFF"
          />
        </div>

        {/* Market Highlights */}
        <div>
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="text-[15px] font-semibold text-[#F6F2EA] tracking-tight">Market Highlights</h2>
              <p className="text-[11px] text-[#6E667E] mt-0.5">Signals from the last hour across all tracked chains.</p>
            </div>
            <button className="text-[11px] font-medium text-[#A69DB7] hover:text-[#FF7A22] transition-colors cursor-pointer flex items-center gap-1">
              View all <i className="ri-arrow-right-s-line"></i>
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <HighlightCard
              title="Top Gainer"
              titleColor="#FF6A1A"
              token={highlightTokens.topGainer}
              metric={`+${highlightTokens.topGainer.priceChange24h.toFixed(2)}%`}
              metricLabel="24h"
              metricColor="#34D07F"
            />
            <HighlightCard
              title="Highest Volume"
              titleColor="#6C4DFF"
              token={highlightTokens.highestVolume}
              metric={formatCompact(highlightTokens.highestVolume.volume24h)}
              metricLabel="24h Vol"
              metricColor="#34D07F"
            />
            <HighlightCard
              title="New Listing"
              titleColor="#6C4DFF"
              token={highlightTokens.newListing}
              metric={`+${highlightTokens.newListing.priceChange24h.toFixed(2)}%`}
              metricLabel="24h"
              metricColor="#34D07F"
            />
            <HighlightCard
              title="Most Watched"
              titleColor="#FF6A1A"
              token={highlightTokens.mostWatched}
              metric="12.4k"
              metricLabel="watching"
              metricColor="#6C4DFF"
            />
          </div>
        </div>

        {/* Token Table */}
        <div className="liquid-glass-table overflow-hidden">
          <div className="relative z-10">
            {/* Filter bar */}
            <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-1">
                {['All', 'Trending', 'Top Movers', 'New Tokens', 'Watchlist'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setPage(1); }}
                    className={`px-3.5 py-2 rounded-full text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                      activeCategory === cat
                        ? 'liquid-glass-btn-orange text-[#F6F2EA] relative z-10'
                        : 'liquid-glass-btn text-[#A69DB7] hover:text-[#F6F2EA] relative z-10'
                    }`}
                  >
                    <span className="relative z-10">{cat}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="relative liquid-glass-dropdown">
                  <select
                    value={activeChain}
                    onChange={(e) => { setActiveChain(e.target.value); setPage(1); }}
                    className="appearance-none bg-transparent rounded-full px-3.5 py-2 pr-7 text-[11px] text-[#A69DB7] outline-none cursor-pointer relative z-10"
                  >
                    <option value="All Chains" className="bg-[#0D0620]">All Chains</option>
                    {['Ethereum', 'Base', 'Arbitrum', 'Optimism', 'Polygon'].map((c) => (
                      <option key={c} value={c} className="bg-[#0D0620]">{c}</option>
                    ))}
                  </select>
                  <i className="ri-arrow-down-s-line absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6E667E] text-[10px] pointer-events-none relative z-10"></i>
                </div>
                <div className="relative liquid-glass-dropdown">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-transparent rounded-full px-3.5 py-2 pr-7 text-[11px] text-[#A69DB7] outline-none cursor-pointer relative z-10"
                  >
                    {[
                      { value: 'volume', label: 'Volume' },
                      { value: 'price', label: 'Price' },
                      { value: 'change', label: '24h Change' },
                      { value: 'marketCap', label: 'Market Cap' },
                      { value: 'liquidity', label: 'Liquidity' },
                    ].map((s) => (
                      <option key={s.value} value={s.value} className="bg-[#0D0620]">{s.label}</option>
                    ))}
                  </select>
                  <i className="ri-arrow-down-s-line absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6E667E] text-[10px] pointer-events-none relative z-10"></i>
                </div>
              </div>
            </div>

            {/* Table header */}
            <div className="grid gap-2 px-5 py-2.5 text-[10px] font-semibold text-[#6E667E] uppercase tracking-[0.1em]" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', gridTemplateColumns: '44px 1fr 110px 100px 110px 95px 95px 100px 130px' }}>
              <span className="text-center flex items-center justify-center gap-1">
                <i className="ri-star-line text-[10px]"></i>
              </span>
              <span>Token</span>
              <span>Chain</span>
              <span className="text-right">Price</span>
              <span className="text-right">24h Chg</span>
              <span className="text-right">Vol 24h</span>
              <span className="text-right">Liquidity</span>
              <span className="text-right">MCap</span>
              <span className="text-right">Action</span>
            </div>

            {/* Table rows */}
            <div>
              {paginated.map((token) => (
                <div
                  key={token.id}
                  className="table-row-glass grid gap-2 px-5 py-3 items-center group"
                  style={{ gridTemplateColumns: '44px 1fr 110px 100px 110px 95px 95px 100px 130px' }}
                >
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => toggleWatchlist(token.id)}
                      className="text-[#6E667E] hover:text-[#FF6A1A] transition-colors cursor-pointer"
                      aria-label={`${token.watchlisted ? 'Remove' : 'Add'} ${token.symbol} ${token.watchlisted ? 'from' : 'to'} watchlist`}
                    >
                      <i className={`${token.watchlisted ? 'ri-star-fill text-[#FF6A1A]' : 'ri-star-line'} text-xs`}></i>
                    </button>
                    <span className="text-[10px] text-[#6E667E] font-mono">{token.rank}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <TokenIcon token={token} size={32} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[13px] font-semibold text-[#F6F2EA]">{token.name}</span>
                        <span className="text-[10px] text-[#6E667E] font-medium">{token.symbol}</span>
                        {token.badges.map((badge) => {
                          const style = badgeStyle(badge);
                          return (
                            <span key={badge} className="text-[8px] px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
                              {badge}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium text-[#A69DB7] liquid-glass-badge">
                      <span className="relative z-10 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: token.chainColor }}></span>
                        {token.chain}
                      </span>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[13px] font-semibold text-[#F6F2EA]">{formatPrice(token.price)}</span>
                  </div>

                  <div className="text-right flex items-center justify-end gap-2">
                    <span className={`text-[11px] font-semibold ${token.priceChange24h >= 0 ? 'text-[#34D07F]' : 'text-[#FF5B5B]'}`}>
                      {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                    </span>
                    <Sparkline data={token.sparkline} color={token.priceChange24h >= 0 ? '#34D07F' : '#FF5B5B'} width={48} height={16} />
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-[#A69DB7] font-medium">{formatCompact(token.volume24h)}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-[#A69DB7] font-medium">{formatCompact(token.liquidity)}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-[#A69DB7] font-medium">{formatCompact(token.marketCap)}</span>
                  </div>

                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => openChartDrawer(token)}
                      className="liquid-glass-icon-btn w-7 h-7 flex items-center justify-center text-[#A69DB7] hover:text-[#F6F2EA] transition-all cursor-pointer"
                      aria-label={`View chart for ${token.symbol}`}
                    >
                      <i className="ri-bar-chart-line text-xs relative z-10"></i>
                    </button>
                    <button
                      onClick={() => navigate(`/swap?from=${token.symbol}&to=USDC`)}
                      className="liquid-glass-btn-trade px-3.5 py-1.5 text-[#7B61FF] text-[11px] font-semibold cursor-pointer whitespace-nowrap relative z-10"
                    >
                      <span className="relative z-10">Trade</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3.5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="text-[10px] text-[#6E667E]">
                Showing {paginated.length > 0 ? (page - 1) * perPage + 1 : 0}–{(page - 1) * perPage + paginated.length} of {filtered.length} tokens
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="liquid-glass-pagination w-7 h-7 flex items-center justify-center text-[#A69DB7] hover:text-[#F6F2EA] transition-all disabled:opacity-30 cursor-pointer relative z-10"
                >
                  <i className="ri-arrow-left-s-line text-xs relative z-10"></i>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-7 h-7 rounded-full text-[11px] font-semibold transition-all cursor-pointer relative z-10 ${
                      p === page
                        ? 'liquid-glass-pagination-active text-[#F6F2EA]'
                        : 'liquid-glass-pagination text-[#A69DB7] hover:text-[#F6F2EA]'
                    }`}
                  >
                    <span className="relative z-10">{p}</span>
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="liquid-glass-pagination w-7 h-7 flex items-center justify-center text-[#A69DB7] hover:text-[#F6F2EA] transition-all disabled:opacity-30 cursor-pointer relative z-10"
                >
                  <i className="ri-arrow-right-s-line text-xs relative z-10"></i>
                </button>
                <div className="relative liquid-glass-dropdown ml-1.5">
                  <select className="appearance-none bg-transparent rounded-full px-2.5 py-1 pr-6 text-[10px] text-[#A69DB7] outline-none cursor-pointer relative z-10">
                    <option className="bg-[#0D0620]">10 / page</option>
                    <option className="bg-[#0D0620]">20 / page</option>
                    <option className="bg-[#0D0620]">50 / page</option>
                  </select>
                  <i className="ri-arrow-down-s-line absolute right-1.5 top-1/2 -translate-y-1/2 text-[#6E667E] text-[9px] pointer-events-none relative z-10"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Token Chart Drawer ─── */}
      <TokenChartDrawer
        token={drawerToken}
        isOpen={drawerToken !== null}
        onClose={closeChartDrawer}
        onToggleWatchlist={toggleWatchlist}
        isWatchlisted={drawerToken ? watchlistSet.has(drawerToken.id) : false}
      />

      {/* ─── Footer ─── */}
      <footer className="relative z-10 mt-8 pb-6">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <span className="text-[10px] text-[#6E667E]">© 2024 CrackerSwap</span>
          <span className="text-[10px] text-[#6E667E]">crackerswap.app</span>
        </div>
      </footer>
    </div>
  );
}