import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { positionsData, positionTokens, positionLPExposures, recentPositionActivity } from '@/mocks/positionsData';
import type { PositionToken, PositionLPExposure, PositionActivity } from '@/mocks/positionsData';
import TokenHoldingDrawer from './components/TokenHoldingDrawer';
import LPExposureDrawer from './components/LPExposureDrawer';
import PositionQuickActionsMenu from './components/PositionQuickActionsMenu';

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

/* ─── Loading Skeleton ─── */
function PositionsSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="liquid-glass-card rounded-[16px] p-5 h-[100px]" />
        ))}
      </div>
      {/* Tabs */}
      <div className="flex gap-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-9 w-28 rounded-full bg-white/[0.04]" />
        ))}
      </div>
      {/* Filters */}
      <div className="flex gap-3">
        <div className="flex-1 h-[42px] rounded-[14px] bg-white/[0.04]" />
        <div className="w-[140px] h-[42px] rounded-[14px] bg-white/[0.04]" />
        <div className="w-[140px] h-[42px] rounded-[14px] bg-white/[0.04]" />
      </div>
      {/* Table */}
      <div className="liquid-glass-table rounded-[20px] h-[400px]" />
    </div>
  );
}

/* ─── Error State ─── */
function ErrorState({ onRetry, lastUpdated }: { onRetry: () => void; lastUpdated: string }) {
  return (
    <div className="liquid-glass-card rounded-[20px] p-10 text-center">
      <div className="relative z-10">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#FF8A3D]/8 border border-[#FF8A3D]/15 flex items-center justify-center">
          <i className="ri-error-warning-line text-[#FF8A3D] text-2xl"></i>
        </div>
        <h3 className="text-[16px] font-semibold text-[#F6F2EA] mb-2">Unable to load positions</h3>
        <p className="text-[12px] text-[#A69DB7] mb-5 max-w-[420px] mx-auto leading-relaxed">
          Position data may be temporarily unavailable. Some data depends on wallet indexing, RPC reads, and external providers.
        </p>
        <button
          onClick={onRetry}
          className="liquid-glass-btn-primary px-5 py-2.5 text-[13px] text-white font-semibold rounded-full cursor-pointer whitespace-nowrap"
        >
          Retry
        </button>
        <p className="text-[11px] text-[#6E667E] mt-3">Last successful update: {lastUpdated}</p>
      </div>
    </div>
  );
}

/* ─── Unsupported Network ─── */
function UnsupportedNetwork() {
  return (
    <div className="liquid-glass-card rounded-[20px] p-8 text-center">
      <div className="relative z-10">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#FF8A3D]/8 border border-[#FF8A3D]/15 flex items-center justify-center">
          <i className="ri-global-line text-[#FF8A3D] text-2xl"></i>
        </div>
        <h3 className="text-[16px] font-semibold text-[#F6F2EA] mb-2">Unsupported network</h3>
        <p className="text-[12px] text-[#A69DB7] mb-6 max-w-[400px] mx-auto leading-relaxed">
          Switch to Base or Monad to view CrackerSwap positions.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button className="liquid-glass-btn-primary px-5 py-2.5 text-[13px] text-white font-semibold rounded-full cursor-pointer whitespace-nowrap">
            Switch to Base
          </button>
          <button className="liquid-glass-btn px-5 py-2.5 text-[13px] text-[#F6F2EA] font-medium rounded-full cursor-pointer whitespace-nowrap">
            Switch to Monad
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Recent Position Activity ─── */
function RecentPositionActivity({ onViewAll }: { onViewAll: () => void }) {
  return (
    <div className="liquid-glass-card rounded-[20px] p-5">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[14px] font-semibold text-[#F6F2EA]">Recent Position Activity</h3>
          <button
            onClick={onViewAll}
            className="text-[11px] text-[#6C4DFF] hover:text-[#8B72FF] font-medium cursor-pointer whitespace-nowrap transition-colors"
          >
            View full activity <i className="ri-arrow-right-line text-[10px] ml-0.5"></i>
          </button>
        </div>
        <div className="space-y-2">
          {recentPositionActivity.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                activity.type === 'swap' ? 'bg-[#6C4DFF]/10 text-[#6C4DFF]' :
                activity.type === 'approval' ? 'bg-[#34D07F]/10 text-[#34D07F]' :
                activity.type === 'lp_detected' ? 'bg-[#FF7A22]/10 text-[#FF7A22]' :
                'bg-[#A69DB7]/10 text-[#A69DB7]'
              }`}>
                <i className={`${
                  activity.type === 'swap' ? 'ri-arrow-left-right-line' :
                  activity.type === 'approval' ? 'ri-check-line' :
                  activity.type === 'lp_detected' ? 'ri-stack-line' :
                  'ri-refresh-line'
                } text-sm`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-medium text-[#F6F2EA] truncate">{activity.label}</div>
                <div className="text-[11px] text-[#6E667E]">{activity.detail}</div>
              </div>
              <div className="text-right shrink-0">
                {activity.value > 0 && (
                  <div className="text-[12px] font-medium text-[#F6F2EA]">${activity.value.toLocaleString()}</div>
                )}
                <div className="text-[10px] text-[#6E667E]">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Format helpers ─── */
type TabId = 'all' | 'tokens' | 'lp';

export default function PositionsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Core state
  const [walletState, setWalletState] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [unsupportedNetwork, setUnsupportedNetwork] = useState(false);
  const [stale, setStale] = useState(false);
  const [partialStale, setPartialStale] = useState(false);

  // Tab state from URL
  const tabFromUrl = (searchParams.get('tab') || 'all') as TabId;
  const [activeTab, setActiveTab] = useState<TabId>(tabFromUrl);

  // Filter & search
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [chainFilter, setChainFilter] = useState(searchParams.get('chain') || 'All Chains');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || 'all');

  // Toast
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 2200);
  }, []);

  // Context restore flag
  const [contextRestored, setContextRestored] = useState(false);

  // Drawers
  const [tokenDrawer, setTokenDrawer] = useState<PositionToken | null>(null);
  const [lpDrawer, setLpDrawer] = useState<PositionLPExposure | null>(null);

  // Context menu
  const [contextMenu, setContextMenu] = useState<{
    items: { icon: string; label: string; action: () => void; danger?: boolean }[];
    x: number;
    y: number;
  } | null>(null);

  // Stale timer
  useEffect(() => {
    if (walletState === 'connected') {
      const timer = setTimeout(() => {
        setStale(true);
      }, 60000);
      return () => clearTimeout(timer);
    }
  }, [walletState]);

  // Context restore check
  useEffect(() => {
    const hasParams = searchParams.get('tab') || searchParams.get('chain') || searchParams.get('type') || searchParams.get('q');
    if (hasParams) {
      setContextRestored(true);
      const timer = setTimeout(() => setContextRestored(false), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Sync tab from URL
  useEffect(() => {
    if (tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const syncParams = useCallback((tab: string, chain: string, type: string, q: string) => {
    const params = new URLSearchParams();
    if (tab !== 'all') params.set('tab', tab);
    if (chain !== 'All Chains') params.set('chain', chain);
    if (type !== 'all') params.set('type', type);
    if (q) params.set('q', q);
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  const switchTab = (tab: TabId) => {
    setActiveTab(tab);
    syncParams(tab, chainFilter, typeFilter, searchQuery);
  };

  // Wallet actions
  const handleConnect = () => {
    setWalletState('connecting');
    setTimeout(() => {
      setWalletState('connected');
      setLoading(true);
      setTimeout(() => setLoading(false), 700);
    }, 1500);
  };

  const handleCancelConnect = () => {
    setWalletState('disconnected');
  };

  const handleDisconnect = () => {
    setWalletState('disconnected');
  };

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  const handleRefresh = () => {
    showToast('Position data refreshed');
    setStale(false);
    setPartialStale(false);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(positionsData.walletAddress);
    showToast('Wallet address copied');
  };

  const copyContract = (address: string) => {
    navigator.clipboard.writeText(address);
    showToast('Contract address copied');
  };

  const copyPoolAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    showToast('Pool address copied');
  };

  // Navigation
  const handleTrade = (from: string, to: string, chain: string, context?: string) => {
    navigate(`/swap?from=${from}&to=${to}&chain=${chain === 'Base' ? 'base' : 'monad'}`);
    if (context) showToast(context);
  };

  const handleTradeToken = (symbol: string) => {
    navigate(`/swap?from=${symbol}&to=USDC&chain=base`);
  };

  const handleViewPool = (slug: string) => {
    navigate(`/pools/${slug}`);
  };

  const handleViewActivity = () => {
    navigate('/portfolio?tab=activity');
  };

  const handleExplorer = () => {
    window.open(`https://basescan.org/address/${positionsData.walletAddress}`, '_blank', 'noopener noreferrer');
  };

  const handleTokenExplorer = (address: string) => {
    window.open(`https://basescan.org/address/${address}`, '_blank', 'noopener noreferrer');
  };

  const handlePoolExplorer = (address: string) => {
    window.open(`https://basescan.org/address/${address}`, '_blank', 'noopener noreferrer');
  };

  /* ─── Filtering ─── */
  const filteredTokens = positionTokens.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      t.name.toLowerCase().includes(q) ||
      t.symbol.toLowerCase().includes(q) ||
      t.contractAddress.toLowerCase().includes(q);
    const matchesChain = chainFilter === 'All Chains' || t.chain === chainFilter;
    return matchesSearch && matchesChain;
  });

  const filteredLP = positionLPExposures.filter((lp) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      lp.pair.toLowerCase().includes(q) ||
      lp.token0Symbol.toLowerCase().includes(q) ||
      lp.token1Symbol.toLowerCase().includes(q) ||
      lp.poolAddress.toLowerCase().includes(q);
    const matchesChain = chainFilter === 'All Chains' || lp.chain === chainFilter;
    return matchesSearch && matchesChain;
  });

  /* ─── Combined all-positions data ─── */
  const allPositions = [
    ...filteredTokens.map((t) => ({ type: 'token' as const, data: t })),
    ...filteredLP.map((lp) => ({ type: 'lp' as const, data: lp })),
  ];

  const summary = positionsData.summary;

  /* ─── Helper text ─── */
  const chainHelper = chainFilter === 'Base' ? 'Showing Base positions' : chainFilter === 'Monad' ? 'Showing Monad positions' : '';
  const typeHelper = typeFilter === 'tokens' ? 'Showing Token Holdings only' : typeFilter === 'lp' ? 'Showing LP Exposure only' : '';
  const searchHelper = searchQuery.trim() ? `${filteredTokens.length + filteredLP.length} ${(filteredTokens.length + filteredLP.length) === 1 ? 'result' : 'results'} for "${searchQuery.trim()}"` : '';

  const renderStatCards = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {[
        { label: 'Total Position Value', value: `$${summary.totalPositionValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: 'ri-funds-line', color: '#FF7A22' },
        { label: 'Token Holdings', value: summary.tokenHoldings.toString(), icon: 'ri-copper-coin-line', color: '#6C4DFF' },
        { label: 'LP Exposure', value: `$${summary.lpExposureValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: 'ri-stack-line', color: '#FF7A22' },
        { label: 'Chains', value: summary.chains, icon: 'ri-global-line', color: '#6C4DFF' },
        { label: 'Last Updated', value: stale ? '3 min ago' : summary.lastUpdated, icon: 'ri-time-line', color: stale ? '#FF8A3D' : '#34D07F' },
      ].map((stat, i) => (
        <div key={i} className="liquid-glass-card rounded-[16px] p-5 relative">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#1A1A2E]/60 flex items-center justify-center">
                <i className={`${stat.icon} text-sm`} style={{ color: stat.color }}></i>
              </div>
            </div>
            <div className="text-[11px] text-[#A69DB7] mb-1">{stat.label}</div>
            <div className={`text-[18px] md:text-[20px] font-bold tracking-tight ${stale && i === 4 ? 'text-[#FF8A3D]' : 'text-[#F6F2EA]'}`}>{stat.value}</div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFilters = () => (
    <div className="flex flex-col md:flex-row gap-3">
      {/* Search */}
      <div className="flex-1 min-w-0">
        <div className="liquid-glass-input rounded-[14px] flex items-center gap-2 px-4 py-2.5 h-[42px]">
          <i className="ri-search-line text-[#6E667E] text-sm"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); syncParams(activeTab, chainFilter, typeFilter, e.target.value); }}
            placeholder="Search token, pool, or address"
            className="flex-1 bg-transparent text-[13px] text-[#F6F2EA] placeholder:text-[#6E667E] outline-none min-w-0"
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(''); syncParams(activeTab, chainFilter, typeFilter, ''); }} className="text-[#6E667E] hover:text-[#F6F2EA] cursor-pointer shrink-0">
              <i className="ri-close-line text-sm"></i>
            </button>
          )}
        </div>
      </div>

      {/* Chain filter */}
      <div className="relative">
        <select
          value={chainFilter}
          onChange={(e) => { setChainFilter(e.target.value); syncParams(activeTab, e.target.value, typeFilter, searchQuery); }}
          className="liquid-glass-dropdown rounded-[14px] px-4 py-2.5 h-[42px] text-[13px] text-[#F6F2EA] bg-transparent outline-none appearance-none cursor-pointer pr-9"
        >
          <option value="All Chains">All Chains</option>
          <option value="Base">Base</option>
          <option value="Monad">Monad</option>
        </select>
        <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-[#A69DB7] text-xs pointer-events-none"></i>
      </div>

      {/* Type filter */}
      <div className="relative">
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); syncParams(activeTab, chainFilter, e.target.value, searchQuery); }}
          className={`liquid-glass-dropdown rounded-[14px] px-4 py-2.5 h-[42px] text-[13px] text-[#F6F2EA] bg-transparent outline-none appearance-none cursor-pointer pr-9 ${typeFilter !== 'all' ? 'border-[#6C4DFF]/30 bg-[#6C4DFF]/5' : ''}`}
        >
          <option value="all">All</option>
          <option value="tokens">Token Holdings</option>
          <option value="lp">LP Exposure</option>
        </select>
        <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-[#A69DB7] text-xs pointer-events-none"></i>
      </div>
    </div>
  );

  /* ─── Token Holdings Row ─── */
  const renderTokenRow = (token: PositionToken) => {
    const isPositive = token.priceChange24h >= 0;

    const openTokenMenu = (e: React.MouseEvent) => {
      e.stopPropagation();
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setContextMenu({
        items: [
          { icon: 'ri-arrow-left-right-line', label: 'Trade Token', action: () => handleTradeToken(token.symbol) },
          { icon: 'ri-eye-line', label: 'View Token', action: () => setTokenDrawer(token) },
          { icon: 'ri-file-copy-line', label: 'Copy Contract', action: () => copyContract(token.contractAddress) },
          { icon: 'ri-external-link-line', label: 'Open on Explorer', action: () => handleTokenExplorer(token.contractAddress) },
        ],
        x: rect.left - 180,
        y: rect.bottom + 4,
      });
    };

    return (
      <div key={token.id} className="table-row-glass px-5 py-3.5 lg:grid lg:grid-cols-[1fr_80px_100px_100px_100px_110px_90px_120px] lg:gap-2 lg:items-center flex flex-col gap-2">
        {/* Token */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full bg-[#1A1A2E]/60 flex items-center justify-center text-[10px] font-bold text-[#FF7A22] border border-white/[0.06] shrink-0">
            {token.symbol[0]}
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-[#F6F2EA] truncate">{token.name} / {token.symbol}</div>
          </div>
        </div>

        {/* Chain */}
        <div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-[#D8D1E6] bg-[#1A1A2E]/50 border border-white/[0.06]">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: token.chain === 'Base' ? '#0052FF' : '#FF6A1A' }} />
            {token.chain}
          </span>
        </div>

        {/* Balance */}
        <div>
          <span className="text-[13px] font-semibold text-[#F6F2EA]">{token.balance.toLocaleString()} {token.symbol}</span>
        </div>

        {/* Price */}
        <div>
          <span className="text-[12px] text-[#D8D1E6]">${token.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>

        {/* Value */}
        <div>
          <span className="text-[13px] font-semibold text-[#F6F2EA]">${token.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>

        {/* 24H Change */}
        <div>
          <span className={`text-[12px] font-medium ${isPositive ? 'text-[#34D07F]' : 'text-[#FF5B5B]'}`}>
            {isPositive ? '+' : ''}{token.priceChange24h.toFixed(2)}%
          </span>
        </div>

        {/* Allocation */}
        <div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[#FF6A1A] to-[#6C4DFF]" style={{ width: `${token.allocation}%` }} />
            </div>
            <span className="text-[11px] text-[#A69DB7]">{token.allocation.toFixed(2)}%</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleTradeToken(token.symbol)}
            className="liquid-glass-btn-trade px-3 py-1.5 text-[11px] text-[#6C4DFF] font-medium cursor-pointer whitespace-nowrap rounded-full"
          >
            Trade
          </button>
          <button
            onClick={() => setTokenDrawer(token)}
            className="liquid-glass-btn px-3 py-1.5 text-[11px] text-[#F6F2EA] font-medium cursor-pointer whitespace-nowrap rounded-full"
          >
            View
          </button>
          <button
            onClick={openTokenMenu}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A69DB7] hover:text-[#F6F2EA] hover:bg-white/[0.04] transition-all cursor-pointer"
          >
            <i className="ri-more-2-line text-sm"></i>
          </button>
        </div>
      </div>
    );
  };

  /* ─── LP Exposure Row ─── */
  const renderLPRow = (lp: PositionLPExposure) => {
    const isLowData = lp.status === 'Low Data';
    const isPositive = lp.change24h >= 0;

    const openLPMenu = (e: React.MouseEvent) => {
      e.stopPropagation();
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setContextMenu({
        items: [
          { icon: 'ri-eye-line', label: 'View Details', action: () => setLpDrawer(lp) },
          { icon: 'ri-stack-line', label: 'View Pool', action: () => handleViewPool(lp.poolSlug) },
          { icon: 'ri-arrow-left-right-line', label: 'Trade Pair', action: () => handleTrade(lp.token0Symbol, lp.token1Symbol, lp.chain, `Opened from ${lp.pair} LP exposure`) },
          { icon: 'ri-file-copy-line', label: 'Copy Pool Address', action: () => copyPoolAddress(lp.poolAddress) },
          { icon: 'ri-external-link-line', label: 'Open on Explorer', action: () => handlePoolExplorer(lp.poolAddress) },
        ],
        x: rect.left - 180,
        y: rect.bottom + 4,
      });
    };

    return (
      <div key={lp.id} className="table-row-glass px-5 py-3.5 lg:grid lg:grid-cols-[1fr_80px_90px_80px_100px_90px_90px_90px_120px] lg:gap-2 lg:items-center flex flex-col gap-2">
        {/* Pool / Pair */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative flex items-center shrink-0">
            <div className={`w-7 h-7 rounded-full bg-[#1A1A2E]/60 flex items-center justify-center text-[10px] font-bold border border-white/[0.06] ${isLowData ? 'text-[#FF8A3D]' : 'text-[#FF7A22]'}`}>
              {lp.token0Symbol[0]}
            </div>
            <div className={`w-7 h-7 rounded-full bg-[#1A1A2E]/60 flex items-center justify-center text-[10px] font-bold border border-white/[0.06] -ml-2 ${isLowData ? 'text-[#FF8A3D]' : 'text-[#6C4DFF]'}`}>
              {lp.token1Symbol[0]}
            </div>
          </div>
          <div className="min-w-0">
            <div className={`text-[13px] font-semibold truncate ${isLowData ? 'text-[#FF8A3D]' : 'text-[#F6F2EA]'}`}>{lp.pair}</div>
          </div>
        </div>

        {/* Chain */}
        <div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-[#D8D1E6] bg-[#1A1A2E]/50 border border-white/[0.06]">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: lp.chain === 'Base' ? '#0052FF' : '#FF6A1A' }} />
            {lp.chain}
          </span>
        </div>

        {/* DEX */}
        <div>
          <span className="text-[12px] text-[#D8D1E6]">{lp.dex}</span>
        </div>

        {/* Fee Tier */}
        <div>
          <span className="text-[12px] text-[#D8D1E6] font-medium">{lp.feeTier}</span>
        </div>

        {/* Exposure Value */}
        <div>
          {isLowData ? (
            <span className="text-[12px] text-[#FF8A3D] font-medium">Detected</span>
          ) : (
            <span className="text-[13px] font-semibold text-[#F6F2EA]">${lp.exposureValue!.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          )}
        </div>

        {/* Pool Share */}
        <div>
          <span className={`text-[12px] ${isLowData ? 'text-[#FF8A3D]' : 'text-[#D8D1E6]'}`}>
            {lp.poolShare || 'Unavailable'}
          </span>
        </div>

        {/* 24H Change */}
        <div>
          {lp.change24h !== 0 ? (
            <span className={`text-[12px] font-medium ${isPositive ? 'text-[#34D07F]' : 'text-[#FF5B5B]'}`}>
              {isPositive ? '+' : ''}{lp.change24h.toFixed(2)}%
            </span>
          ) : (
            <span className="text-[12px] text-[#6E667E]">—</span>
          )}
        </div>

        {/* Status */}
        <div>
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
            lp.status === 'Low Data'
              ? 'bg-[#FF8A3D]/10 text-[#FF8A3D] border-[#FF8A3D]/20'
              : 'bg-[#6E667E]/10 text-[#6E667E] border-white/[0.06]'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${lp.status === 'Low Data' ? 'bg-[#FF8A3D]' : 'bg-[#6E667E]'}`} />
            {lp.status}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => setLpDrawer(lp)}
            className="liquid-glass-btn-trade px-3 py-1.5 text-[11px] text-[#6C4DFF] font-medium cursor-pointer whitespace-nowrap rounded-full"
          >
            View Details
          </button>
          <button
            onClick={() => handleViewPool(lp.poolSlug)}
            className="liquid-glass-btn px-3 py-1.5 text-[11px] text-[#F6F2EA] font-medium cursor-pointer whitespace-nowrap rounded-full"
          >
            View Pool
          </button>
          <button
            onClick={openLPMenu}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A69DB7] hover:text-[#F6F2EA] hover:bg-white/[0.04] transition-all cursor-pointer"
          >
            <i className="ri-more-2-line text-sm"></i>
          </button>
        </div>
      </div>
    );
  };

  /* ─── Empty states ─── */
  const renderNoTokens = () => (
    <div className="liquid-glass-card rounded-[20px] p-10 text-center">
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-[#1A1A2E]/60 flex items-center justify-center mx-auto mb-4">
          <i className="ri-copper-coin-line text-[#6E667E] text-2xl"></i>
        </div>
        <h3 className="text-[16px] font-semibold text-[#F6F2EA] mb-2">No token holdings found</h3>
        <p className="text-[13px] text-[#A69DB7] max-w-[400px] mx-auto mb-5">
          This wallet does not currently show supported token balances on Base or Monad.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate('/swap')}
            className="liquid-glass-btn-primary px-5 py-2.5 text-[13px] text-white font-semibold rounded-full cursor-pointer whitespace-nowrap"
          >
            Start Swapping
          </button>
          <button
            onClick={() => navigate('/v2')}
            className="liquid-glass-btn px-5 py-2.5 text-[13px] text-[#F6F2EA] font-medium rounded-full cursor-pointer whitespace-nowrap"
          >
            Explore Tokens
          </button>
        </div>
      </div>
    </div>
  );

  const renderNoLP = () => (
    <div className="liquid-glass-card rounded-[20px] p-10 text-center">
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-[#1A1A2E]/60 flex items-center justify-center mx-auto mb-4">
          <i className="ri-stack-line text-[#6E667E] text-2xl"></i>
        </div>
        <h3 className="text-[16px] font-semibold text-[#F6F2EA] mb-2">No LP exposure found</h3>
        <p className="text-[13px] text-[#A69DB7] max-w-[400px] mx-auto mb-5">
          This wallet does not currently have detected LP exposure across supported pools.
        </p>
        <button
          onClick={() => navigate('/pools')}
          className="liquid-glass-btn-primary px-5 py-2.5 text-[13px] text-white font-semibold rounded-full cursor-pointer whitespace-nowrap"
        >
          Explore Pools
        </button>
        <p className="text-[11px] text-[#6E667E] mt-4">LP visibility is read-only in this MVP.</p>
      </div>
    </div>
  );

  const renderEmptySearch = () => (
    <div className="liquid-glass-card rounded-[20px] p-10 text-center">
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-[#1A1A2E]/60 flex items-center justify-center mx-auto mb-4">
          <i className="ri-search-line text-[#6E667E] text-2xl"></i>
        </div>
        <h3 className="text-[16px] font-semibold text-[#F6F2EA] mb-2">No positions found</h3>
        <p className="text-[13px] text-[#A69DB7] max-w-[420px] mx-auto mb-5">
          Try searching by token, symbol, pool pair, or contract address. Only positions with detected data are shown.
        </p>
        <button
          onClick={() => { setSearchQuery(''); syncParams(activeTab, chainFilter, typeFilter, ''); }}
          className="liquid-glass-btn px-5 py-2.5 text-[13px] text-[#F6F2EA] font-medium rounded-full cursor-pointer whitespace-nowrap"
        >
          Clear search
        </button>
      </div>
    </div>
  );

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
              <Link to="/v2" className="flex items-center gap-2 cursor-pointer group">
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
                    item.label === 'Positions'
                      ? 'bg-[#FF6A1A]/12 text-[#FF7A22] border border-[#FF6A1A]/20'
                      : 'text-[#6E667E] hover:text-[#F6F2EA]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="relative z-10 flex items-center gap-2 pr-3">
              {walletState === 'connected' ? (
                <>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium text-[#34D07F] liquid-glass-badge">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34D07F] relative z-10"></span>
                    <span className="relative z-10">{positionsData.walletAddress.slice(0, 6)}...{positionsData.walletAddress.slice(-4)}</span>
                  </span>
                  <button
                    onClick={copyAddress}
                    className="liquid-glass-icon-btn w-7 h-7 rounded-full flex items-center justify-center text-[#6E667E] hover:text-[#F6F2EA] transition-colors cursor-pointer"
                  >
                    <i className="ri-file-copy-line text-xs relative z-10"></i>
                  </button>
                  <button
                    onClick={handleDisconnect}
                    className="px-3 py-1.5 rounded-full text-[11px] font-medium text-[#A69DB7] bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] hover:text-[#FF5B5B] transition-all cursor-pointer whitespace-nowrap relative"
                  >
                    <span className="relative z-10">Disconnect</span>
                  </button>
                </>
              ) : (
                <>
                  {walletState !== 'connecting' && (
                    <button
                      onClick={handleRefresh}
                      className="liquid-glass-icon-btn w-7 h-7 rounded-full flex items-center justify-center text-[#6E667E] hover:text-[#F6F2EA] transition-colors cursor-pointer"
                    >
                      <i className="ri-refresh-line text-xs relative z-10"></i>
                    </button>
                  )}
                  <button
                    onClick={handleConnect}
                    disabled={walletState === 'connecting'}
                    className="liquid-glass-btn-primary px-3.5 py-1.5 text-[#F6F2EA] text-[11px] font-semibold cursor-pointer whitespace-nowrap relative z-10 disabled:opacity-60 disabled:cursor-wait"
                  >
                    <i className="ri-wallet-3-line text-[10px] mr-1 relative z-10"></i>
                    <span className="relative z-10">
                      {walletState === 'connecting' ? 'Connecting...' : 'Connect Wallet'}
                    </span>
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-8 flex flex-col gap-6">
        {/* Title */}
        <div>
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#F6F2EA] tracking-tight">Positions</h1>
          <p className="text-[13px] text-[#A69DB7] mt-1">View your wallet holdings, valuation, and LP exposure across supported chains.</p>
          {contextRestored && (
            <div className="flex items-center gap-1.5 mt-2 text-[12px] text-[#34D07F]">
              <i className="ri-check-line text-sm"></i>
              Positions context restored
            </div>
          )}
        </div>

        {/* ─── No Wallet Connected ─── */}
        {walletState === 'disconnected' && (
          <div className="liquid-glass-card rounded-[24px] p-12 text-center">
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#6C4DFF]/8 border border-[#6C4DFF]/15 flex items-center justify-center">
                <i className="ri-wallet-3-line text-[#7B61FF] text-3xl"></i>
              </div>
              <h3 className="text-[20px] font-bold text-[#F6F2EA] mb-3">Connect wallet to view positions</h3>
              <p className="text-[13px] text-[#A69DB7] mb-6 max-w-[480px] mx-auto leading-relaxed">
                Your token holdings, USD valuation, and LP exposure will appear here once your wallet is connected.
              </p>
              <button
                onClick={handleConnect}
                className="liquid-glass-btn-primary px-6 py-3 text-[14px] text-white font-semibold rounded-full cursor-pointer whitespace-nowrap"
              >
                <i className="ri-wallet-3-line text-[15px] mr-2"></i>
                Connect Wallet
              </button>
              <p className="text-[11px] text-[#6E667E] mt-4">CrackerSwap displays wallet visibility and view-only LP analytics.</p>
            </div>
          </div>
        )}

        {/* ─── Wallet Connecting ─── */}
        {walletState === 'connecting' && (
          <div className="liquid-glass-card rounded-[24px] p-12 text-center">
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-6">
                <div className="w-full h-full rounded-full border-2 border-[#6C4DFF]/30 border-t-[#6C4DFF] animate-spin" />
              </div>
              <h3 className="text-[18px] font-bold text-[#F6F2EA] mb-2">Connecting wallet...</h3>
              <p className="text-[13px] text-[#A69DB7] mb-6">Waiting for wallet approval.</p>
              <button
                onClick={handleCancelConnect}
                className="liquid-glass-btn px-5 py-2.5 text-[13px] text-[#F6F2EA] font-medium rounded-full cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ─── Connected Content ─── */}
        {walletState === 'connected' && (
          <>
            {/* Stale banner */}
            {stale && (
              <div className="flex items-start gap-2 px-4 py-3 rounded-[12px] bg-[#FF8A3D]/6 border border-[#FF8A3D]/12">
                <i className="ri-time-line text-[#FF8A3D] text-sm mt-0.5 shrink-0"></i>
                <div>
                  <p className="text-[12px] text-[#FF8A3D] font-medium">Some position data may be delayed</p>
                  <p className="text-[11px] text-[#A69DB7]">Last updated 3 min ago</p>
                </div>
              </div>
            )}

            {/* Partial stale banner */}
            {partialStale && !stale && (
              <div className="flex items-start gap-2 px-4 py-3 rounded-[12px] bg-[#FF8A3D]/6 border border-[#FF8A3D]/12">
                <i className="ri-alert-line text-[#FF8A3D] text-sm mt-0.5 shrink-0"></i>
                <div>
                  <p className="text-[12px] text-[#FF8A3D] font-medium">Some position data may be delayed</p>
                  <p className="text-[11px] text-[#A69DB7]">Balances loaded, but LP exposure is still updating.</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && <ErrorState onRetry={handleRetry} lastUpdated={summary.lastUpdated} />}

            {/* Unsupported Network */}
            {unsupportedNetwork && <UnsupportedNetwork />}

            {/* Loading */}
            {loading && <PositionsSkeleton />}

            {/* Loaded Content */}
            {!loading && !error && !unsupportedNetwork && (
              <>
                {/* Wallet pill row */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium text-[#F6F2EA] bg-white/[0.04] border border-white/[0.08]">
                    <i className="ri-wallet-3-line text-[#FF7A22] text-sm"></i>
                    {positionsData.walletAddress.slice(0, 6)}...{positionsData.walletAddress.slice(-4)}
                  </span>
                  <button onClick={copyAddress} className="text-[12px] text-[#A69DB7] hover:text-[#F6F2EA] cursor-pointer flex items-center gap-1 transition-colors">
                    <i className="ri-file-copy-line text-xs"></i> Copy
                  </button>
                  <button onClick={handleExplorer} className="text-[12px] text-[#6C4DFF] hover:text-[#8B72FF] cursor-pointer flex items-center gap-1 transition-colors">
                    <i className="ri-external-link-line text-xs"></i> Explorer
                  </button>
                  <span className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium text-[#34D07F] liquid-glass-badge ml-auto">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34D07F] animate-pulse relative z-10"></span>
                    <span className="relative z-10">Data updated {summary.lastUpdated}</span>
                  </span>
                  <button
                    onClick={handleRefresh}
                    className="liquid-glass-icon-btn w-7 h-7 rounded-full flex items-center justify-center text-[#6E667E] hover:text-[#F6F2EA] transition-colors cursor-pointer"
                  >
                    <i className="ri-refresh-line text-xs relative z-10"></i>
                  </button>
                </div>

                {/* Info note */}
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] bg-[#09031A]/60 border border-[#1A1A2E]/40">
                  <i className="ri-information-line text-[#6E667E] text-sm shrink-0"></i>
                  <span className="text-[12px] text-[#A69DB7]">
                    Balances and LP exposure are derived from wallet-linked data and external market sources.
                  </span>
                </div>

                {/* Summary Cards */}
                {renderStatCards()}

                {/* Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1">
                  {[
                    { id: 'all' as TabId, label: 'All Positions' },
                    { id: 'tokens' as TabId, label: 'Token Holdings' },
                    { id: 'lp' as TabId, label: 'LP Exposure' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => switchTab(tab.id)}
                      className={`px-4 py-2 rounded-full text-[12px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'bg-[#FF6A1A]/12 text-[#FF7A22] border border-[#FF6A1A]/20'
                          : 'bg-white/[0.04] text-[#A69DB7] border border-white/[0.07] hover:bg-white/[0.06] hover:text-[#F6F2EA]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Filters */}
                {renderFilters()}

                {/* Helper text */}
                {(chainHelper || typeHelper || searchHelper) && (
                  <div className="flex items-center gap-2 text-[12px] flex-wrap">
                    {chainHelper && <span className="text-[#A69DB7]">{chainHelper}</span>}
                    {typeHelper && <span className="text-[#A69DB7]">{typeHelper}</span>}
                    {searchHelper && <span className="text-[#A69DB7]">{searchHelper}</span>}
                  </div>
                )}

                {/* ─── All Positions Tab ─── */}
                {activeTab === 'all' && (
                  <>
                    {allPositions.length === 0 ? (
                      renderEmptySearch()
                    ) : (
                      <div className="liquid-glass-table rounded-[20px] overflow-hidden">
                        {/* Table Header */}
                        <div className="hidden lg:grid grid-cols-[100px_1fr_80px_90px_100px_100px_90px_120px] gap-2 px-5 py-3 text-[10px] font-semibold text-[#6E667E] uppercase tracking-[0.08em] border-b border-[#1A1A2E]/40 bg-[#09031A]/40">
                          <div>Type</div>
                          <div>Asset / Pool</div>
                          <div>Chain</div>
                          <div>Value</div>
                          <div>Balance / Exposure</div>
                          <div>24H Change</div>
                          <div>Status</div>
                          <div className="text-right">Actions</div>
                        </div>

                        <div className="divide-y divide-[#1A1A2E]/30">
                          {allPositions.map((item) => {
                            if (item.type === 'token') {
                              const t = item.data;
                              const isPositive = t.priceChange24h >= 0;
                              return (
                                <div key={`t-${t.id}`} className="table-row-glass px-5 py-3.5 lg:grid lg:grid-cols-[100px_1fr_80px_90px_100px_100px_90px_120px] lg:gap-2 lg:items-center flex flex-col gap-2">
                                  {/* Type */}
                                  <div>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#6C4DFF]/10 text-[#6C4DFF] border border-[#6C4DFF]/15">
                                      Token Holding
                                    </span>
                                  </div>

                                  {/* Asset */}
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-7 h-7 rounded-full bg-[#1A1A2E]/60 flex items-center justify-center text-[10px] font-bold text-[#FF7A22] border border-white/[0.06] shrink-0">
                                      {t.symbol[0]}
                                    </div>
                                    <span className="text-[13px] font-semibold text-[#F6F2EA] truncate">{t.name} / {t.symbol}</span>
                                  </div>

                                  {/* Chain */}
                                  <div>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-[#D8D1E6] bg-[#1A1A2E]/50 border border-white/[0.06]">
                                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.chain === 'Base' ? '#0052FF' : '#FF6A1A' }} />
                                      {t.chain}
                                    </span>
                                  </div>

                                  {/* Value */}
                                  <div>
                                    <span className="text-[13px] font-semibold text-[#F6F2EA]">${t.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                  </div>

                                  {/* Balance */}
                                  <div>
                                    <span className="text-[12px] text-[#D8D1E6]">{t.balance.toLocaleString()} {t.symbol}</span>
                                  </div>

                                  {/* 24H Change */}
                                  <div>
                                    <span className={`text-[12px] font-medium ${isPositive ? 'text-[#34D07F]' : 'text-[#FF5B5B]'}`}>
                                      {isPositive ? '+' : ''}{t.priceChange24h.toFixed(2)}%
                                    </span>
                                  </div>

                                  {/* Status */}
                                  <div>
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                                      t.status === 'Low Data' ? 'bg-[#FF8A3D]/10 text-[#FF8A3D] border-[#FF8A3D]/20' : 'bg-[#34D07F]/10 text-[#34D07F] border-[#34D07F]/20'
                                    }`}>
                                      <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'Low Data' ? 'bg-[#FF8A3D]' : 'bg-[#34D07F]'}`} />
                                      {t.status}
                                    </span>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button onClick={() => handleTradeToken(t.symbol)} className="liquid-glass-btn-trade px-3 py-1.5 text-[11px] text-[#6C4DFF] font-medium cursor-pointer whitespace-nowrap rounded-full">Trade</button>
                                    <button onClick={() => setTokenDrawer(t)} className="liquid-glass-btn px-3 py-1.5 text-[11px] text-[#F6F2EA] font-medium cursor-pointer whitespace-nowrap rounded-full">View</button>
                                    <button onClick={(e) => {
                                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                      setContextMenu({
                                        items: [
                                          { icon: 'ri-arrow-left-right-line', label: 'Trade Token', action: () => handleTradeToken(t.symbol) },
                                          { icon: 'ri-eye-line', label: 'View Token', action: () => setTokenDrawer(t) },
                                          { icon: 'ri-file-copy-line', label: 'Copy Contract', action: () => copyContract(t.contractAddress) },
                                          { icon: 'ri-external-link-line', label: 'Open on Explorer', action: () => handleTokenExplorer(t.contractAddress) },
                                        ],
                                        x: rect.left - 180,
                                        y: rect.bottom + 4,
                                      });
                                    }} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A69DB7] hover:text-[#F6F2EA] hover:bg-white/[0.04] transition-all cursor-pointer">
                                      <i className="ri-more-2-line text-sm"></i>
                                    </button>
                                  </div>
                                </div>
                              );
                            } else {
                              const lp = item.data;
                              const isLowData = lp.status === 'Low Data';
                              const isPositive = lp.change24h >= 0;
                              return (
                                <div key={`lp-${lp.id}`} className="table-row-glass px-5 py-3.5 lg:grid lg:grid-cols-[100px_1fr_80px_90px_100px_100px_90px_120px] lg:gap-2 lg:items-center flex flex-col gap-2">
                                  {/* Type */}
                                  <div>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#FF7A22]/10 text-[#FF7A22] border border-[#FF7A22]/15">
                                      LP Exposure
                                    </span>
                                  </div>

                                  {/* Pool */}
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="relative flex items-center shrink-0">
                                      <div className={`w-7 h-7 rounded-full bg-[#1A1A2E]/60 flex items-center justify-center text-[10px] font-bold border border-white/[0.06] ${isLowData ? 'text-[#FF8A3D]' : 'text-[#FF7A22]'}`}>
                                        {lp.token0Symbol[0]}
                                      </div>
                                      <div className={`w-7 h-7 rounded-full bg-[#1A1A2E]/60 flex items-center justify-center text-[10px] font-bold border border-white/[0.06] -ml-2 ${isLowData ? 'text-[#FF8A3D]' : 'text-[#6C4DFF]'}`}>
                                        {lp.token1Symbol[0]}
                                      </div>
                                    </div>
                                    <span className={`text-[13px] font-semibold truncate ${isLowData ? 'text-[#FF8A3D]' : 'text-[#F6F2EA]'}`}>{lp.pair}</span>
                                  </div>

                                  {/* Chain */}
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-[#D8D1E6] bg-[#1A1A2E]/50 border border-white/[0.06]">
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: lp.chain === 'Base' ? '#0052FF' : '#FF6A1A' }} />
                                    {lp.chain}
                                  </span>

                                  {/* Value */}
                                  <div>
                                    {isLowData ? (
                                      <span className="text-[12px] text-[#FF8A3D] font-medium">Detected</span>
                                    ) : (
                                      <span className="text-[13px] font-semibold text-[#F6F2EA]">${lp.exposureValue!.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    )}
                                  </div>

                                  {/* Pool share */}
                                  <div>
                                    <span className={`text-[12px] ${isLowData ? 'text-[#FF8A3D]' : 'text-[#D8D1E6]'}`}>
                                      {lp.poolShare ? `Pool share ${lp.poolShare}` : 'Unavailable'}
                                    </span>
                                  </div>

                                  {/* 24H Change */}
                                  <div>
                                    {lp.change24h !== 0 ? (
                                      <span className={`text-[12px] font-medium ${isPositive ? 'text-[#34D07F]' : 'text-[#FF5B5B]'}`}>
                                        {isPositive ? '+' : ''}{lp.change24h.toFixed(2)}%
                                      </span>
                                    ) : <span className="text-[12px] text-[#6E667E]">—</span>}
                                  </div>

                                  {/* Status */}
                                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                                    lp.status === 'Low Data' ? 'bg-[#FF8A3D]/10 text-[#FF8A3D] border-[#FF8A3D]/20' : 'bg-[#6E667E]/10 text-[#6E667E] border-white/[0.06]'
                                  }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${lp.status === 'Low Data' ? 'bg-[#FF8A3D]' : 'bg-[#6E667E]'}`} />
                                    {lp.status}
                                  </span>

                                  {/* Actions */}
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button onClick={() => setLpDrawer(lp)} className="liquid-glass-btn-trade px-3 py-1.5 text-[11px] text-[#6C4DFF] font-medium cursor-pointer whitespace-nowrap rounded-full">View Details</button>
                                    <button onClick={() => handleViewPool(lp.poolSlug)} className="liquid-glass-btn px-3 py-1.5 text-[11px] text-[#F6F2EA] font-medium cursor-pointer whitespace-nowrap rounded-full">View Pool</button>
                                    <button onClick={(e) => {
                                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                      setContextMenu({
                                        items: [
                                          { icon: 'ri-eye-line', label: 'View Details', action: () => setLpDrawer(lp) },
                                          { icon: 'ri-stack-line', label: 'View Pool', action: () => handleViewPool(lp.poolSlug) },
                                          { icon: 'ri-arrow-left-right-line', label: 'Trade Pair', action: () => handleTrade(lp.token0Symbol, lp.token1Symbol, lp.chain, `Opened from ${lp.pair} LP exposure`) },
                                          { icon: 'ri-file-copy-line', label: 'Copy Pool Address', action: () => copyPoolAddress(lp.poolAddress) },
                                          { icon: 'ri-external-link-line', label: 'Open on Explorer', action: () => handlePoolExplorer(lp.poolAddress) },
                                        ],
                                        x: rect.left - 180,
                                        y: rect.bottom + 4,
                                      });
                                    }} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A69DB7] hover:text-[#F6F2EA] hover:bg-white/[0.04] transition-all cursor-pointer">
                                      <i className="ri-more-2-line text-sm"></i>
                                    </button>
                                  </div>
                                </div>
                              );
                            }
                          })}
                        </div>
                      </div>
                    )}

                    {/* Recent Activity Preview (only on All tab) */}
                    {allPositions.length > 0 && <RecentPositionActivity onViewAll={handleViewActivity} />}
                  </>
                )}

                {/* ─── Token Holdings Tab ─── */}
                {activeTab === 'tokens' && (
                  <>
                    {filteredTokens.length === 0 && searchQuery.trim() ? (
                      renderEmptySearch()
                    ) : filteredTokens.length === 0 ? (
                      renderNoTokens()
                    ) : (
                      <div className="liquid-glass-table rounded-[20px] overflow-hidden">
                        <div className="hidden lg:grid grid-cols-[1fr_80px_100px_100px_100px_110px_90px_120px] gap-2 px-5 py-3 text-[10px] font-semibold text-[#6E667E] uppercase tracking-[0.08em] border-b border-[#1A1A2E]/40 bg-[#09031A]/40">
                          <div>Token</div>
                          <div>Chain</div>
                          <div>Balance</div>
                          <div>Price</div>
                          <div>Value</div>
                          <div>24H Change</div>
                          <div>Allocation</div>
                          <div className="text-right">Actions</div>
                        </div>
                        <div className="divide-y divide-[#1A1A2E]/30">
                          {filteredTokens.map(renderTokenRow)}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* ─── LP Exposure Tab ─── */}
                {activeTab === 'lp' && (
                  <>
                    {filteredLP.length === 0 && searchQuery.trim() ? (
                      renderEmptySearch()
                    ) : filteredLP.length === 0 ? (
                      renderNoLP()
                    ) : (
                      <div className="liquid-glass-table rounded-[20px] overflow-hidden">
                        <div className="hidden lg:grid grid-cols-[1fr_80px_90px_80px_100px_90px_90px_90px_120px] gap-2 px-5 py-3 text-[10px] font-semibold text-[#6E667E] uppercase tracking-[0.08em] border-b border-[#1A1A2E]/40 bg-[#09031A]/40">
                          <div>Pool / Pair</div>
                          <div>Chain</div>
                          <div>DEX</div>
                          <div>Fee Tier</div>
                          <div>Exposure Value</div>
                          <div>Pool Share</div>
                          <div>Token Split</div>
                          <div>Status</div>
                          <div className="text-right">Actions</div>
                        </div>
                        <div className="divide-y divide-[#1A1A2E]/30">
                          {filteredLP.map(renderLPRow)}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* Bottom info note */}
        <div className="flex items-center gap-2 px-4 py-3 rounded-[12px] bg-[#09031A]/60 border border-[#1A1A2E]/40">
          <i className="ri-information-line text-[#6E667E] text-sm shrink-0"></i>
          <span className="text-[12px] text-[#A69DB7]">
            Position data is aggregated from wallet-linked data and external market sources. LP exposure is view-only. CrackerSwap does not provide liquidity management or advanced trading position features.
          </span>
        </div>
      </div>

      {/* ─── Drawers ─── */}
      <TokenHoldingDrawer
        token={tokenDrawer}
        isOpen={tokenDrawer !== null}
        onClose={() => setTokenDrawer(null)}
        onTrade={(symbol) => {
          handleTradeToken(symbol);
          setTokenDrawer(null);
        }}
        onCopyContract={() => {
          if (tokenDrawer) copyContract(tokenDrawer.contractAddress);
        }}
        onExplorer={() => {
          if (tokenDrawer) handleTokenExplorer(tokenDrawer.contractAddress);
        }}
      />

      <LPExposureDrawer
        exposure={lpDrawer}
        isOpen={lpDrawer !== null}
        onClose={() => setLpDrawer(null)}
        onViewPool={(slug) => {
          handleViewPool(slug);
          setLpDrawer(null);
        }}
        onTradePair={(t0, t1) => {
          const lp = lpDrawer;
          handleTrade(t0, t1, lp?.chain || 'Base', lp ? `Opened from ${lp.pair} LP exposure` : undefined);
          setLpDrawer(null);
        }}
      />

      {/* ─── Context Menu ─── */}
      {contextMenu && (
        <PositionQuickActionsMenu
          items={contextMenu.items}
          position={{ x: contextMenu.x, y: contextMenu.y }}
          onClose={() => setContextMenu(null)}
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