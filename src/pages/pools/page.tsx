import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { pools, globalPoolStats } from '@/mocks/poolsData';
import type { Pool } from '@/mocks/poolsData';

/* ─── Formats ─── */
const formatM = (val: number) => `$${val.toFixed(1)}M`;
const formatK = (val: number) => {
  if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
  return val.toString();
};

/* ─── Toast ─── */
function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-5 py-2.5 rounded-full text-[12px] font-medium text-[#F6F2EA] liquid-glass-card border border-[#1A1A2E]/50 backdrop-blur-xl transition-all duration-300 pointer-events-none ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      {message}
    </div>
  );
}

/* ─── Context Menu ─── */
function RowContextMenu({
  pool,
  position,
  onClose,
  onViewPool,
  onTrade,
  onViewToken,
  onCopyAddress,
  onExplorer,
}: {
  pool: Pool;
  position: { x: number; y: number };
  onClose: () => void;
  onViewPool: () => void;
  onTrade: () => void;
  onViewToken: (symbol: string) => void;
  onCopyAddress: () => void;
  onExplorer: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const items = [
    { icon: 'ri-eye-line', label: 'View Pool', action: onViewPool },
    { icon: 'ri-arrow-left-right-line', label: 'Trade Pair', action: onTrade },
    { icon: 'ri-copper-coin-line', label: `View ${pool.token0Symbol}`, action: () => onViewToken(pool.token0Symbol) },
    { icon: 'ri-copper-coin-line', label: `View ${pool.token1Symbol}`, action: () => onViewToken(pool.token1Symbol) },
    { icon: 'ri-file-copy-line', label: 'Copy Pool Address', action: onCopyAddress },
    { icon: 'ri-external-link-line', label: 'Open on Explorer', action: onExplorer },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed z-[80] w-[200px] liquid-glass-card border border-[#1A1A2E]/50 rounded-[14px] py-1.5 shadow-[0_16px_48px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
      style={{ top: position.y, left: position.x }}
    >
      {items.map((item, i) => (
        <button
          key={i}
          onClick={() => { item.action(); onClose(); }}
          className="w-full flex items-center gap-2.5 px-4 py-2 text-[12px] text-[#D8D1E6] hover:bg-[#1A1A2E]/40 hover:text-[#F6F2EA] transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className={`${item.icon} text-[#A69DB7] text-sm w-4 text-center`}></i>
          {item.label}
        </button>
      ))}
    </div>
  );
}

/* ─── Page ─── */
export default function PoolsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Restore context from URL params on mount
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedChain, setSelectedChain] = useState(searchParams.get('chain') || 'All Chains');
  const [selectedSource, setSelectedSource] = useState(searchParams.get('source') || 'All Sources');
  const [selectedSort, _setSelectedSort] = useState(searchParams.get('sort') || 'tvl-desc');
  const [currentPage, _setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [pageSize, _setPageSize] = useState(Number(searchParams.get('size')) || 10);
  const [contextMenu, setContextMenu] = useState<{ pool: Pool; x: number; y: number } | null>(null);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  const [refreshing, setRefreshing] = useState(false);
  const [contextRestored, setContextRestored] = useState(false);

  // Show context restored toast
  useEffect(() => {
    const hasParams = searchParams.get('sort') || searchParams.get('chain') || searchParams.get('source') || searchParams.get('q');
    if (hasParams) {
      setContextRestored(true);
      const timer = setTimeout(() => setContextRestored(false), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Sync state back to URL params
  const setSelectedSort = (val: string) => {
    _setSelectedSort(val);
    _setCurrentPage(1);
    syncParams(val, selectedChain, selectedSource, searchQuery, 1, pageSize);
  };
  const setCurrentPage = (val: number | ((p: number) => number)) => {
    const newPage = typeof val === 'function' ? val(currentPage) : val;
    _setCurrentPage(newPage);
    syncParams(selectedSort, selectedChain, selectedSource, searchQuery, newPage, pageSize);
  };
  const setPageSize = (val: number) => {
    _setPageSize(val);
    _setCurrentPage(1);
    syncParams(selectedSort, selectedChain, selectedSource, searchQuery, 1, val);
  };

  const syncParams = (sort: string, chain: string, source: string, q: string, page: number, size: number) => {
    const params = new URLSearchParams();
    if (sort !== 'tvl-desc') params.set('sort', sort);
    if (chain !== 'All Chains') params.set('chain', chain);
    if (source !== 'All Sources') params.set('source', source);
    if (q) params.set('q', q);
    if (page > 1) params.set('page', String(page));
    if (size !== 10) params.set('size', String(size));
    setSearchParams(params, { replace: true });
  };

  const chains = ['All Chains', 'Base', 'Monad'];
  const sources = ['All Sources', 'Uniswap V3', 'Other DEX'];

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 2200);
  }, []);

  /* ─── Filtering ─── */
  const filteredPools = pools.filter((pool) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      pool.pair.toLowerCase().includes(q) ||
      pool.token0Symbol.toLowerCase().includes(q) ||
      pool.token1Symbol.toLowerCase().includes(q) ||
      pool.poolAddress.toLowerCase().includes(q);
    const matchesChain = selectedChain === 'All Chains' || pool.chain === selectedChain;
    const matchesSource = selectedSource === 'All Sources' || pool.dex === selectedSource;
    return matchesSearch && matchesChain && matchesSource;
  });

  /* ─── Sorting ─── */
  const sortedPools = [...filteredPools].sort((a, b) => {
    switch (selectedSort) {
      case 'tvl-desc': return b.tvl - a.tvl;
      case 'volume-desc': return b.volume24h - a.volume24h;
      case 'apr-desc': {
        if (a.aprReliable && !b.aprReliable) return -1;
        if (!a.aprReliable && b.aprReliable) return 1;
        return b.apr - a.apr;
      }
      default: return b.tvl - a.tvl;
    }
  });

  const totalPages = Math.max(1, Math.ceil(sortedPools.length / pageSize));
  const paginatedPools = sortedPools.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const startIndex = sortedPools.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, sortedPools.length);

  /* ─── Address search detection ─── */
  const isAddressSearch = searchQuery.trim().startsWith('0x') && searchQuery.trim().length >= 10;
  const addressMatchPool = isAddressSearch
    ? pools.find((p) => p.poolAddress.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : null;

  /* ─── Helpers ─── */
  const getPoolSlug = (p: Pool) => `${p.token0Symbol.toLowerCase()}-${p.token1Symbol.toLowerCase()}`;

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showToast('Pool data refreshed');
    }, 800);
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    showToast('Pool address copied');
  };

  const handleOpenExplorer = (address: string) => {
    window.open(`https://basescan.org/address/${address}`, '_blank', 'noopener noreferrer');
  };

  const handleViewToken = (symbol: string) => {
    navigate(`/v2?token=${symbol}`);
  };

  /* ─── Stat cards data ─── */
  const statCards = [
    { label: 'Total Liquidity', value: `$${globalPoolStats.totalLiquidity}M`, icon: 'ri-water-flash-line', color: '#FF7A22' },
    { label: '24H Volume', value: `$${globalPoolStats.volume24h}M`, icon: 'ri-bar-chart-box-line', color: '#6C4DFF' },
    { label: 'Active Pools', value: globalPoolStats.activePools.toString(), icon: 'ri-stack-line', color: '#FF7A22' },
    { label: 'Active Traders', value: formatK(globalPoolStats.activeTraders), icon: 'ri-group-line', color: '#6C4DFF' },
  ];

  /* ─── Sort helper text ─── */
  const sortHelper = selectedSort === 'tvl-desc'
    ? 'Sorted by highest total value locked'
    : selectedSort === 'volume-desc'
    ? 'Sorted by highest recent trading activity'
    : selectedSort === 'apr-desc'
    ? 'APR may be unavailable for pools with incomplete source data. Only shown where reliable.'
    : '';

  /* ─── Chain helper text ─── */
  const chainHelper = selectedChain === 'Base'
    ? 'Showing Base pools'
    : selectedChain === 'Monad'
    ? 'Showing Monad pools'
    : '';

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
                    item.label === 'Pools'
                      ? 'bg-[#FF6A1A]/12 text-[#FF7A22] border border-[#FF6A1A]/20'
                      : 'text-[#6E667E] hover:text-[#F6F2EA]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="relative z-10 flex items-center gap-2 pr-3">
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium text-[#34D07F] liquid-glass-badge">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34D07F] animate-pulse relative z-10"></span>
                <span className="relative z-10">Live Tx</span>
              </span>
              <button
                onClick={handleRefresh}
                className={`liquid-glass-icon-btn w-7 h-7 rounded-full flex items-center justify-center text-[#6E667E] hover:text-[#F6F2EA] transition-colors cursor-pointer ${refreshing ? 'animate-spin' : ''}`}
              >
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
        {/* Title */}
        <div>
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#F6F2EA] tracking-tight">Pools</h1>
          <p className="text-[13px] text-[#A69DB7] mt-1">Discover liquidity pools across Base and Monad.</p>
          {contextRestored && (
            <div className="flex items-center gap-1.5 mt-2 text-[12px] text-[#34D07F]">
              <i className="ri-check-line text-sm"></i>
              Discovery context restored
            </div>
          )}
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {statCards.map((stat, i) => (
            <div key={i} className="liquid-glass-card rounded-[16px] p-5 relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#1A1A2E]/60 flex items-center justify-center">
                  <i className={`${stat.icon} text-sm`} style={{ color: stat.color }}></i>
                </div>
              </div>
              <div className="text-[11px] text-[#A69DB7] mb-1">{stat.label}</div>
              <div className="text-[22px] md:text-[24px] font-bold text-[#F6F2EA] tracking-tight">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 min-w-0">
            <div className="liquid-glass-input rounded-[14px] flex items-center gap-2 px-4 py-2.5 h-[42px]">
              <i className="ri-search-line text-[#6E667E] text-sm"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); syncParams(selectedSort, selectedChain, selectedSource, e.target.value, 1, pageSize); }}
                placeholder="Search pair, token, or pool address"
                className="flex-1 bg-transparent text-[13px] text-[#F6F2EA] placeholder:text-[#6E667E] outline-none min-w-0"
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(''); syncParams(selectedSort, selectedChain, selectedSource, '', currentPage, pageSize); }} className="text-[#6E667E] hover:text-[#F6F2EA] cursor-pointer shrink-0">
                  <i className="ri-close-line text-sm"></i>
                </button>
              )}
            </div>
          </div>

          {/* Chain filter */}
          <div className="relative">
            <select
              value={selectedChain}
              onChange={(e) => { setSelectedChain(e.target.value); setCurrentPage(1); syncParams(selectedSort, e.target.value, selectedSource, searchQuery, 1, pageSize); }}
              className="liquid-glass-dropdown rounded-[14px] px-4 py-2.5 h-[42px] text-[13px] text-[#F6F2EA] bg-transparent outline-none appearance-none cursor-pointer pr-9"
            >
              {chains.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-[#A69DB7] text-xs pointer-events-none"></i>
          </div>

          {/* DEX filter */}
          <div className="relative">
            <select
              value={selectedSource}
              onChange={(e) => { setSelectedSource(e.target.value); setCurrentPage(1); syncParams(selectedSort, selectedChain, e.target.value, searchQuery, 1, pageSize); }}
              className={`liquid-glass-dropdown rounded-[14px] px-4 py-2.5 h-[42px] text-[13px] text-[#F6F2EA] bg-transparent outline-none appearance-none cursor-pointer pr-9 ${
                selectedSource !== 'All Sources' ? 'border-[#6C4DFF]/30 bg-[#6C4DFF]/5' : ''
              }`}
            >
              {sources.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-[#A69DB7] text-xs pointer-events-none"></i>
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={selectedSort}
              onChange={(e) => { setSelectedSort(e.target.value); }}
              className="liquid-glass-dropdown rounded-[14px] px-4 py-2.5 h-[42px] text-[13px] text-[#F6F2EA] bg-transparent outline-none appearance-none cursor-pointer pr-9"
            >
              <option value="tvl-desc">TVL ↓</option>
              <option value="volume-desc">24H vol ↓</option>
              <option value="apr-desc">APR ↓</option>
            </select>
            <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-[#A69DB7] text-xs pointer-events-none"></i>
          </div>
        </div>

        {/* Helper / info text */}
        {(sortHelper || chainHelper || (searchQuery.trim() && !isAddressSearch)) && (
          <div className="flex items-center gap-2 text-[12px]">
            {chainHelper && (
              <span className="text-[#A69DB7]">{chainHelper}</span>
            )}
            {searchQuery.trim() && !isAddressSearch && filteredPools.length > 0 && (
              <span className="text-[#A69DB7]">
                {filteredPools.length} {filteredPools.length === 1 ? 'result' : 'results'} for &ldquo;{searchQuery.trim()}&rdquo;
              </span>
            )}
          </div>
        )}

        {/* APR sort banner */}
        {selectedSort === 'apr-desc' && (
          <div className="flex items-start gap-2 px-4 py-3 rounded-[12px] bg-[#FF8A3D]/8 border border-[#FF8A3D]/15">
            <i className="ri-information-line text-[#FF8A3D] text-sm mt-0.5 shrink-0"></i>
            <div>
              <p className="text-[12px] text-[#FF8A3D] font-medium">{sortHelper}</p>
              <p className="text-[11px] text-[#A69DB7] mt-0.5">APR is shown only where protocol-level data is consistent and verifiable.</p>
            </div>
          </div>
        )}

        {/* Address search match card */}
        {isAddressSearch && addressMatchPool && (
          <div className="liquid-glass-card rounded-[20px] p-6 border border-[#6C4DFF]/20">
            <div className="flex items-center gap-2 mb-4">
              <i className="ri-checkbox-circle-line text-[#34D07F] text-sm"></i>
              <span className="text-[13px] font-semibold text-[#F6F2EA]">Pool match detected</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              <div>
                <div className="text-[10px] text-[#6E667E] uppercase tracking-wider mb-1">Pool / Pair</div>
                <div className="flex items-center gap-2">
                  <div className="relative flex items-center">
                    <div className="w-7 h-7 rounded-full bg-[#1A1A2E]/60 flex items-center justify-center text-[10px] font-bold text-[#FF7A22] border border-[#1A1A2E]">
                      {addressMatchPool.token0Symbol[0]}
                    </div>
                    <div className="w-7 h-7 rounded-full bg-[#1A1A2E]/60 flex items-center justify-center text-[10px] font-bold text-[#6C4DFF] border border-[#1A1A2E] -ml-2">
                      {addressMatchPool.token1Symbol[0]}
                    </div>
                  </div>
                  <span className="text-[14px] font-semibold text-[#F6F2EA]">{addressMatchPool.pair}</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[#6E667E] uppercase tracking-wider mb-1">Chain · DEX · Fee</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#1A1A2E]/60 text-[#D8D1E6] border border-[#1A1A2E]">{addressMatchPool.chain}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#6C4DFF]/10 text-[#7B61FF] border border-[#6C4DFF]/15">{addressMatchPool.dex}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#FF6A1A]/10 text-[#FF7A22] border border-[#FF6A1A]/15">{addressMatchPool.feeTier}</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[#6E667E] uppercase tracking-wider mb-1">TVL · Liquidity</div>
                <div className="text-[13px] font-semibold text-[#F6F2EA]">TVL {formatM(addressMatchPool.tvl)}</div>
                <div className="text-[11px] text-[#6E667E]">Liquidity {formatM(addressMatchPool.liquidity)}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#6E667E] uppercase tracking-wider mb-1">Pool Address</div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] text-[#D8D1E6] font-mono">
                    {addressMatchPool.poolAddress.slice(0, 6)}...{addressMatchPool.poolAddress.slice(-4)}
                  </span>
                  <button
                    onClick={() => handleCopyAddress(addressMatchPool.poolAddress)}
                    className="text-[#6E667E] hover:text-[#F6F2EA] cursor-pointer"
                  >
                    <i className="ri-file-copy-line text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/pools/${getPoolSlug(addressMatchPool)}`)}
                className="liquid-glass-btn px-5 py-2 text-[13px] text-[#F6F2EA] font-medium cursor-pointer whitespace-nowrap rounded-full"
              >
                View Pool
              </button>
              <Link
                to={`/swap?from=${addressMatchPool.token0Symbol}&to=${addressMatchPool.token1Symbol}&chain=${addressMatchPool.chainId}`}
                className="liquid-glass-btn-primary px-5 py-2 text-[13px] text-white font-medium cursor-pointer whitespace-nowrap rounded-full"
              >
                Trade Pair
              </Link>
              <button
                onClick={() => handleCopyAddress(addressMatchPool.poolAddress)}
                className="liquid-glass-btn px-4 py-2 text-[12px] text-[#D8D1E6] font-medium cursor-pointer whitespace-nowrap rounded-full flex items-center gap-1.5"
              >
                <i className="ri-file-copy-line text-xs"></i>
                Copy Address
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isAddressSearch && filteredPools.length === 0 && searchQuery.trim() && (
          <div className="liquid-glass-card rounded-[20px] p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#1A1A2E]/60 flex items-center justify-center mx-auto mb-4">
              <i className="ri-search-line text-[#6E667E] text-2xl"></i>
            </div>
            <h3 className="text-[16px] font-semibold text-[#F6F2EA] mb-2">No pools found</h3>
            <p className="text-[13px] text-[#A69DB7] max-w-[420px] mx-auto mb-5">
              Try searching by pair, token symbol, or pool address. Only pools with detected liquidity and sufficient data are shown.
            </p>
            <button
              onClick={() => { setSearchQuery(''); syncParams(selectedSort, selectedChain, selectedSource, '', currentPage, pageSize); }}
              className="liquid-glass-btn px-5 py-2.5 text-[13px] text-[#F6F2EA] font-medium cursor-pointer whitespace-nowrap rounded-full"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Empty state for DEX filter */}
        {!isAddressSearch && filteredPools.length === 0 && !searchQuery.trim() && selectedSource !== 'All Sources' && (
          <div className="liquid-glass-card rounded-[20px] p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#1A1A2E]/60 flex items-center justify-center mx-auto mb-4">
              <i className="ri-filter-3-line text-[#6E667E] text-2xl"></i>
            </div>
            <h3 className="text-[16px] font-semibold text-[#F6F2EA] mb-2">No pools from {selectedSource}</h3>
            <p className="text-[13px] text-[#A69DB7] max-w-[420px] mx-auto mb-5">
              No pools are currently tracked from this DEX source. Try selecting a different source or view all pools.
            </p>
            <button
              onClick={() => { setSelectedSource('All Sources'); syncParams(selectedSort, selectedChain, 'All Sources', searchQuery, currentPage, pageSize); }}
              className="liquid-glass-btn px-5 py-2.5 text-[13px] text-[#F6F2EA] font-medium cursor-pointer whitespace-nowrap rounded-full"
            >
              Show all sources
            </button>
          </div>
        )}

        {/* Table (hide when address match card is showing or empty state) */}
        {!isAddressSearch && filteredPools.length > 0 && (() => {
          const showTable = !(filteredPools.length === 0 && !searchQuery.trim());
          if (!showTable) return null;
          return (
            <div className="liquid-glass-table rounded-[20px] overflow-hidden">
              {/* Table Header */}
              <div className="hidden lg:grid grid-cols-[44px_1fr_100px_110px_90px_105px_105px_110px_90px_90px_130px] gap-2 px-5 py-3 text-[10px] font-semibold text-[#6E667E] uppercase tracking-[0.08em] border-b border-[#1A1A2E]/40 bg-[#09031A]/40">
                <div className="text-center">Rank</div>
                <div>Pool / Pair</div>
                <div>Chain</div>
                <div>DEX</div>
                <div>Fee</div>
                <div className="text-right">TVL</div>
                <div className="text-right">Liquidity</div>
                <div className="text-right">24H Volume</div>
                <div className="text-right">Txns</div>
                <div className="text-right">APR</div>
                <div className="text-right">Actions</div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-[#1A1A2E]/30">
                {paginatedPools.map((pool, index) => (
                  <div
                    key={pool.id}
                    className="table-row-glass px-5 py-3.5 lg:grid lg:grid-cols-[44px_1fr_100px_110px_90px_105px_105px_110px_90px_90px_130px] lg:gap-2 lg:items-center flex flex-col gap-2"
                  >
                    {/* Rank */}
                    <div className="text-center text-[12px] text-[#6E667E] font-medium">
                      {startIndex + index}
                    </div>

                    {/* Pool / Pair */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative flex items-center shrink-0">
                        <div className="w-7 h-7 rounded-full bg-[#1A1A2E]/60 flex items-center justify-center text-[10px] font-bold text-[#FF7A22] border border-[#1A1A2E]">
                          {pool.token0Symbol[0]}
                        </div>
                        <div className="w-7 h-7 rounded-full bg-[#1A1A2E]/60 flex items-center justify-center text-[10px] font-bold text-[#6C4DFF] border border-[#1A1A2E] -ml-2">
                          {pool.token1Symbol[0]}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-[#F6F2EA] truncate">{pool.pair}</div>
                      </div>
                    </div>

                    {/* Chain */}
                    <div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-[#D8D1E6] bg-[#1A1A2E]/50 border border-[#1A1A2E]/40">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: pool.chain === 'Base' ? '#0052FF' : '#FF6A1A' }}></span>
                        {pool.chain}
                      </span>
                    </div>

                    {/* DEX */}
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded bg-[#6C4DFF]/10 flex items-center justify-center shrink-0">
                        <i className="ri-exchange-line text-[#6C4DFF] text-[8px]"></i>
                      </div>
                      <span className="text-[12px] text-[#D8D1E6]">{pool.dex}</span>
                    </div>

                    {/* Fee */}
                    <div>
                      <span className="text-[12px] text-[#D8D1E6] font-medium">{pool.feeTier}</span>
                    </div>

                    {/* TVL */}
                    <div className="text-right">
                      <span className="text-[13px] font-semibold text-[#F6F2EA]">{formatM(pool.tvl)}</span>
                    </div>

                    {/* Liquidity */}
                    <div className="text-right">
                      <span className="text-[12px] text-[#D8D1E6]">{formatM(pool.liquidity)}</span>
                    </div>

                    {/* 24H Volume */}
                    <div className="text-right">
                      <span className="text-[12px] text-[#D8D1E6]">{formatM(pool.volume24h)}</span>
                    </div>

                    {/* Txns */}
                    <div className="text-right">
                      <span className="text-[12px] text-[#D8D1E6]">{(pool.txns24h / 1000).toFixed(1)}K</span>
                    </div>

                    {/* APR */}
                    <div className="text-right">
                      {pool.aprReliable ? (
                        <span className="text-[12px] font-semibold text-[#34D07F]">{pool.apr.toFixed(1)}%</span>
                      ) : (
                        <span className="text-[11px] text-[#FF8A3D]">Unavailable</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/pools/${getPoolSlug(pool)}`)}
                        className="liquid-glass-btn px-3 py-1.5 text-[11px] text-[#F6F2EA] font-medium cursor-pointer whitespace-nowrap"
                      >
                        View Pool
                      </button>
                      <Link
                        to={`/swap?from=${pool.token0Symbol}&to=${pool.token1Symbol}&chain=${pool.chainId}`}
                        className="liquid-glass-btn-primary px-3 py-1.5 text-[11px] text-white font-medium cursor-pointer whitespace-nowrap"
                      >
                        Trade
                      </Link>
                      <button
                        onClick={(e) => {
                          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                          setContextMenu({ pool, x: rect.left - 180, y: rect.bottom + 4 });
                        }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A69DB7] hover:text-[#F6F2EA] hover:bg-[#1A1A2E]/40 transition-all cursor-pointer"
                      >
                        <i className="ri-more-2-line text-sm"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Pagination */}
        {!isAddressSearch && filteredPools.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[12px] text-[#6E667E]">
              Showing {startIndex} to {endIndex} of {sortedPools.length} pools
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#A69DB7] hover:text-[#F6F2EA] hover:bg-[#1A1A2E]/40 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                <i className="ri-arrow-left-s-line text-sm"></i>
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-medium transition-all cursor-pointer ${
                    currentPage === p
                      ? 'liquid-glass-pagination-active text-white'
                      : 'liquid-glass-pagination text-[#A69DB7]'
                  }`}
                >
                  {p}
                </button>
              ))}
              {totalPages > 5 && (
                <>
                  <span className="text-[#6E667E] text-[12px] px-0.5">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-medium transition-all cursor-pointer ${
                      currentPage === totalPages ? 'liquid-glass-pagination-active text-white' : 'liquid-glass-pagination text-[#A69DB7]'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#A69DB7] hover:text-[#F6F2EA] hover:bg-[#1A1A2E]/40 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                <i className="ri-arrow-right-s-line text-sm"></i>
              </button>
              <div className="relative ml-2">
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                  className="liquid-glass-dropdown rounded-[12px] px-3 py-2 text-[12px] text-[#F6F2EA] bg-transparent outline-none appearance-none cursor-pointer pr-7"
                >
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                  <option value={50}>50 / page</option>
                </select>
                <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-[#A69DB7] text-xs pointer-events-none"></i>
              </div>
            </div>
          </div>
        )}

        {/* Info bar */}
        <div className="flex items-center justify-between px-4 py-3 rounded-[12px] bg-[#09031A]/60 border border-[#1A1A2E]/40">
          <div className="flex items-center gap-2">
            <i className="ri-information-line text-[#6E667E] text-sm"></i>
            <span className="text-[12px] text-[#A69DB7]">
              Pools data is aggregated from multiple DEX sources. APR is based on 24H fee revenue and may vary.
            </span>
          </div>
          <button className="text-[12px] text-[#6C4DFF] hover:text-[#8B72FF] font-medium cursor-pointer whitespace-nowrap">
            Learn more
          </button>
        </div>
      </div>

      {/* ─── Context Menu ─── */}
      {contextMenu && (
        <RowContextMenu
          pool={contextMenu.pool}
          position={{ x: contextMenu.x, y: contextMenu.y }}
          onClose={() => setContextMenu(null)}
          onViewPool={() => navigate(`/pools/${getPoolSlug(contextMenu.pool)}`)}
          onTrade={() => navigate(`/swap?from=${contextMenu.pool.token0Symbol}&to=${contextMenu.pool.token1Symbol}&chain=${contextMenu.pool.chainId}`)}
          onViewToken={handleViewToken}
          onCopyAddress={() => handleCopyAddress(contextMenu.pool.poolAddress)}
          onExplorer={() => handleOpenExplorer(contextMenu.pool.poolAddress)}
        />
      )}

      {/* ─── Toast ─── */}
      <Toast message={toast.message} visible={toast.visible} />

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