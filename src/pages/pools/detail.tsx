import { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { pools, getPoolDetails } from '@/mocks/poolsData';
import type { Pool, PoolDetails } from '@/mocks/poolsData';
import DonutChart from './components/DonutChart';
import ActivityChart from './components/ActivityChart';

/* ─── Copy Button ─── */
function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 text-[#6E667E] hover:text-[#F6F2EA] transition-colors cursor-pointer"
      aria-label={`Copy ${label}`}
    >
      <i className={`${copied ? 'ri-check-line text-[#34D07F]' : 'ri-file-copy-line'} text-sm`}></i>
    </button>
  );
}

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

/* ─── Format Helpers ─── */
const formatM = (val: number) => {
  if (val >= 1) return `$${val.toFixed(2)}M`;
  return `$${(val * 1000).toFixed(1)}K`;
};
const formatK = (val: number) => `${(val / 1000).toFixed(1)}K`;

/* ─── Loading Skeleton ─── */
function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#070214]">
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-8 flex flex-col gap-6 animate-pulse">
        {/* Nav skeleton */}
        <div className="h-[52px] liquid-glass-nav" />
        {/* Header skeleton */}
        <div className="flex flex-col gap-3">
          <div className="h-4 w-24 bg-[#1A1A2E]/60 rounded-full" />
          <div className="h-8 w-64 bg-[#1A1A2E]/60 rounded-lg" />
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-[#1A1A2E]/60 rounded-full" />
            <div className="h-6 w-20 bg-[#1A1A2E]/60 rounded-full" />
            <div className="h-6 w-14 bg-[#1A1A2E]/60 rounded-full" />
          </div>
        </div>
        {/* Metric skeletons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="liquid-glass-card rounded-[16px] p-4 h-[100px]" />
          ))}
        </div>
        {/* Content grid skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="liquid-glass-card rounded-[20px] p-5 h-[320px]" />
          <div className="liquid-glass-card rounded-[20px] p-5 h-[320px]" />
          <div className="liquid-glass-card rounded-[20px] p-5 h-[320px]" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="liquid-glass-card rounded-[20px] p-5 h-[200px]" />
          <div className="liquid-glass-card rounded-[20px] p-5 h-[200px]" />
        </div>
      </div>
    </div>
  );
}

/* ─── Error State ─── */
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-[#070214] text-[#F6F2EA] flex items-center justify-center">
      <div className="text-center space-y-5 max-w-[420px]">
        <div className="w-16 h-16 rounded-2xl bg-[#1A1A2E]/60 flex items-center justify-center mx-auto">
          <i className="ri-error-warning-line text-[#FF8A3D] text-3xl"></i>
        </div>
        <h1 className="text-[20px] font-semibold">Unable to load pool data</h1>
        <p className="text-[13px] text-[#A69DB7] leading-relaxed">
          Pool data may be temporarily unavailable. Some data depends on RPC and external providers.
        </p>
        <button
          onClick={onRetry}
          className="liquid-glass-btn-primary px-6 py-2.5 text-[13px] text-white font-medium rounded-full cursor-pointer whitespace-nowrap"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

/* ─── Connection Card (for disconnected swap CTA) ─── */
function ConnectWalletCard() {
  return (
    <div className="liquid-glass-card rounded-[20px] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-semibold text-[#F6F2EA]">Your LP Exposure</h3>
        <span className="px-2.5 py-1 rounded-full bg-[#1A1A2E]/60 text-[10px] text-[#6E667E] font-medium border border-[#1A1A2E]">View Only</span>
      </div>
      <div className="text-center py-8 space-y-3">
        <div className="w-12 h-12 rounded-xl bg-[#1A1A2E]/60 flex items-center justify-center mx-auto">
          <i className="ri-wallet-3-line text-[#6E667E] text-xl"></i>
        </div>
        <p className="text-[14px] font-semibold text-[#F6F2EA]">Connect wallet to view LP exposure</p>
        <p className="text-[12px] text-[#A69DB7]">If your wallet has exposure to this pool, it will appear here.</p>
        <button className="liquid-glass-btn-primary px-5 py-2 text-[12px] text-white font-semibold rounded-full cursor-pointer whitespace-nowrap">
          Connect Wallet
        </button>
      </div>
      <div className="mt-3 pt-3 border-t border-[#1A1A2E]/30">
        <p className="text-[11px] text-[#6E667E]">Exposure is view-only on CrackerSwap.</p>
      </div>
    </div>
  );
}

/* ─── LP Exposure: No Position ─── */
function NoPositionCard() {
  return (
    <div className="liquid-glass-card rounded-[20px] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-semibold text-[#F6F2EA]">Your LP Exposure</h3>
        <span className="px-2.5 py-1 rounded-full bg-[#1A1A2E]/60 text-[10px] text-[#6E667E] font-medium border border-[#1A1A2E]">View Only</span>
      </div>
      <div className="text-center py-8 space-y-3">
        <div className="w-12 h-12 rounded-xl bg-[#1A1A2E]/60 flex items-center justify-center mx-auto">
          <i className="ri-stack-line text-[#6E667E] text-xl"></i>
        </div>
        <p className="text-[13px] text-[#A69DB7]">No LP exposure found</p>
        <p className="text-[12px] text-[#6E667E]">This wallet does not currently show exposure to this pool.</p>
      </div>
      <div className="mt-3 pt-3 border-t border-[#1A1A2E]/30">
        <p className="text-[11px] text-[#6E667E]">Exposure is view-only on CrackerSwap.</p>
      </div>
    </div>
  );
}

/* ─── LP Exposure: With Position ─── */
function LPExposureCard({ pool, details }: { pool: Pool; details: PoolDetails }) {
  const lp = details.lpExposure;
  if (!lp) return <NoPositionCard />;

  return (
    <div className="liquid-glass-card rounded-[20px] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-semibold text-[#F6F2EA]">Your LP Exposure</h3>
        <span className="px-2.5 py-1 rounded-full bg-[#1A1A2E]/60 text-[10px] text-[#6E667E] font-medium border border-[#1A1A2E]">View Only</span>
      </div>

      {/* Exposure value */}
      <div className="flex items-center gap-2 mb-4 px-3 py-2.5 rounded-xl bg-[#34D07F]/8 border border-[#34D07F]/12">
        <i className="ri-checkbox-circle-line text-[#34D07F] text-sm"></i>
        <div>
          <span className="text-[12px] text-[#34D07F] font-medium">~${details.positionValue.toLocaleString()}</span>
          <span className="text-[11px] text-[#6E667E] ml-2">{pool.pair}</span>
        </div>
      </div>

      {/* Token Split */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#09031A]/40 border border-[#1A1A2E]/30">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#FF6A1A]/15 flex items-center justify-center text-[10px] font-bold text-[#FF7A22]">
              {pool.token0Symbol[0]}
            </div>
            <span className="text-[13px] font-medium text-[#F6F2EA]">{pool.token0Symbol}</span>
          </div>
          <div className="text-right">
            <div className="text-[12px] font-semibold text-[#F6F2EA]">{lp.token0Amount}</div>
            <div className="text-[11px] text-[#6E667E]">{lp.token0Usd}</div>
          </div>
        </div>
        <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#09031A]/40 border border-[#1A1A2E]/30">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#6C4DFF]/15 flex items-center justify-center text-[10px] font-bold text-[#6C4DFF]">
              {pool.token1Symbol[0]}
            </div>
            <span className="text-[13px] font-medium text-[#F6F2EA]">{pool.token1Symbol}</span>
          </div>
          <div className="text-right">
            <div className="text-[12px] font-semibold text-[#F6F2EA]">{lp.token1Amount}</div>
            <div className="text-[11px] text-[#6E667E]">{lp.token1Usd}</div>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#1A1A2E]/30">
        <div>
          <div className="text-[10px] text-[#6E667E] uppercase tracking-wider">Pool Share</div>
          <div className="text-[12px] font-semibold text-[#F6F2EA]">{lp.poolShare}</div>
        </div>
        <div>
          <div className="text-[10px] text-[#6E667E] uppercase tracking-wider">Last Updated</div>
          <div className="text-[12px] font-semibold text-[#F6F2EA]">{lp.lastUpdated}</div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[#1A1A2E]/30">
        <p className="text-[11px] text-[#6E667E]">View-only &middot; no LP management actions available</p>
      </div>
    </div>
  );
}

/* ─── Quality Badge ─── */
function QualityBadge({ label, value }: { label: string; value: string }) {
  const colorMap: Record<string, string> = {
    Deep: '#34D07F',
    Moderate: '#FF8A3D',
    Shallow: '#FF5B5B',
    High: '#34D07F',
    Low: '#FF5B5B',
  };
  const color = colorMap[value] || '#A69DB7';
  return (
    <div className="flex items-center gap-1.5 text-[11px]">
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-[#6E667E]">{label}</span>
      <span className="text-[#D8D1E6] font-medium">{value}</span>
    </div>
  );
}

/* ─── Page ─── */
export default function PoolDetailPage() {
  const { poolId } = useParams<{ poolId: string }>();
  const navigate = useNavigate();

  // Simulated loading states
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [dataStale, setDataStale] = useState(false);

  useEffect(() => {
    // Simulate initial loading
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 900);

    // Simulate data going stale after some time
    const staleTimer = setTimeout(() => {
      setDataStale(true);
    }, 180000);

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(staleTimer);
    };
  }, [poolId]);

  const handleRetry = useCallback(() => {
    setLoadError(false);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 900);
  }, []);

  // Wallet mock state — toggle between 3 states: disconnected, connected-no-position, connected-with-position
  const [walletState, setWalletState] = useState<'disconnected' | 'connected-no-position' | 'connected-with-position'>('disconnected');

  // Toast
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 2200);
  };

  // Find pool
  const pool = pools.find(
    (p) => p.id === Number(poolId) || `${p.token0Symbol.toLowerCase()}-${p.token1Symbol.toLowerCase()}` === poolId
  );

  if (isLoading) return <DetailSkeleton />;
  if (loadError) return <ErrorState onRetry={handleRetry} />;

  if (!pool) {
    return (
      <div className="min-h-screen bg-[#070214] text-[#F6F2EA] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#1A1A2E]/60 flex items-center justify-center mx-auto">
            <i className="ri-error-warning-line text-[#FF8A3D] text-3xl"></i>
          </div>
          <h1 className="text-xl font-semibold">Pool not found</h1>
          <p className="text-[13px] text-[#A69DB7]">This pool does not exist in our database.</p>
          <Link
            to="/pools"
            className="inline-block liquid-glass-btn-primary px-6 py-2.5 text-[13px] text-white font-medium rounded-full cursor-pointer"
          >
            Back to Pools
          </Link>
        </div>
      </div>
    );
  }

  const details = getPoolDetails(String(pool.id));
  const isLowLiquidity = pool.tvl < 0.1;
  const aprUnavailable = !pool.aprReliable || pool.apr === 0;
  const chainParam = pool.chain === 'Monad' ? 'monad' : 'base';

  const statCards = [
    { label: 'TVL', value: formatM(pool.tvl), change: pool.tvlChange24h, icon: 'ri-lock-line' },
    { label: 'Liquidity', value: formatM(pool.liquidity), change: pool.liquidityChange24h, icon: 'ri-water-flash-line' },
    { label: '24H Volume', value: formatM(pool.volume24h), change: pool.volumeChange24h, icon: 'ri-bar-chart-box-line' },
    { label: 'Transactions', value: formatK(pool.txns24h), change: pool.txnsChange24h, icon: 'ri-exchange-line' },
    { label: 'Traders', value: formatK(pool.traders24h), change: pool.tradersChange24h, icon: 'ri-group-line' },
    { label: 'APR', value: aprUnavailable ? 'Unavailable' : `${pool.apr.toFixed(1)}%`, change: aprUnavailable ? null : pool.aprChange24h, icon: 'ri-percent-line', muted: aprUnavailable },
  ];

  const formatChange = (val: number | null) => {
    if (val === null) return null;
    const isPositive = val >= 0;
    return (
      <span className={`text-[11px] font-medium ${isPositive ? 'text-[#34D07F]' : 'text-[#FF5B5B]'}`}>
        {isPositive ? '▲' : '▼'} {Math.abs(val).toFixed(2)}%
      </span>
    );
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(pool.poolAddress);
    showToast('Pool address copied');
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

      {/* Floating Pill Navbar */}
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
              {dataStale && (
                <span className="px-2 py-1 rounded-full text-[10px] font-medium text-[#FF8A3D] bg-[#FF8A3D]/8 border border-[#FF8A3D]/15 whitespace-nowrap">
                  <i className="ri-time-line text-[10px] mr-1"></i>
                  Updating
                </span>
              )}
              <div className="relative">
                <button
                  onClick={() => setWalletState((s) => s === 'disconnected' ? 'connected-with-position' : s === 'connected-with-position' ? 'connected-no-position' : 'disconnected')}
                  className="liquid-glass-btn-primary px-3.5 py-1.5 text-[#F6F2EA] text-[11px] font-semibold cursor-pointer whitespace-nowrap relative z-10"
                >
                  <i className="ri-wallet-3-line text-[10px] mr-1 relative z-10"></i>
                  <span className="relative z-10">
                    {walletState === 'disconnected' ? 'Connect Wallet' : '0x1F2b...c4'}
                  </span>
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-8 flex flex-col gap-6">
        {/* Stale Data Banner */}
        {dataStale && (
          <div className="flex items-start gap-2 px-4 py-3 rounded-[12px] bg-[#FF8A3D]/6 border border-[#FF8A3D]/12">
            <i className="ri-time-line text-[#FF8A3D] text-sm mt-0.5 shrink-0"></i>
            <div>
              <p className="text-[12px] text-[#FF8A3D] font-medium">Some pool data may be delayed</p>
              <p className="text-[11px] text-[#A69DB7]">Last updated 3 min ago</p>
            </div>
          </div>
        )}

        {/* Low Liquidity Warning */}
        {isLowLiquidity && (
          <div className="flex items-start gap-3 px-5 py-4 rounded-[14px] bg-[#FF5B5B]/6 border border-[#FF5B5B]/12">
            <i className="ri-alert-line text-[#FF5B5B] text-lg mt-0.5 shrink-0"></i>
            <div>
              <p className="text-[13px] font-semibold text-[#FF5B5B]">Low liquidity pool — execution risk</p>
              <p className="text-[12px] text-[#A69DB7] mt-0.5">
                Trades through this pool may experience higher price impact or limited execution availability.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="space-y-3">
            {/* Back breadcrumb */}
            <button
              onClick={() => navigate('/pools')}
              className="flex items-center gap-1.5 text-[12px] text-[#A69DB7] hover:text-[#F6F2EA] transition-colors cursor-pointer"
            >
              <i className="ri-arrow-left-line text-sm"></i>
              Pools / {pool.token0Symbol}–{pool.token1Symbol}
            </button>

            {/* Token pair header */}
            <div className="flex items-center gap-4">
              <div className="relative flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#1A1A2E]/80 flex items-center justify-center text-[13px] font-bold text-[#FF7A22] border border-[#1A1A2E] shadow-lg">
                  {pool.token0Symbol[0]}
                </div>
                <div className="w-10 h-10 rounded-full bg-[#1A1A2E]/80 flex items-center justify-center text-[13px] font-bold text-[#6C4DFF] border border-[#1A1A2E] shadow-lg -ml-2">
                  {pool.token1Symbol[0]}
                </div>
              </div>
              <div>
                <h1 className="text-[22px] md:text-[26px] font-bold text-[#F6F2EA] tracking-tight">{pool.pair}</h1>
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium text-[#D8D1E6] bg-[#1A1A2E]/50 border border-[#1A1A2E]/40">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: pool.chain === 'Base' ? '#0052FF' : '#FF6A1A' }} />
                {pool.chain}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#1A1A2E]/60 bg-[#6C4DFF]/10 text-[#6C4DFF] text-[10px] font-medium">
                <i className="ri-exchange-line text-[9px]"></i>
                {pool.dex}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#FF6A1A]/20 bg-[#FF6A1A]/10 text-[#FF7A22] text-[10px] font-medium">
                {pool.feeTier} fee
              </span>
            </div>

            {/* Pool address */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[12px] text-[#6E667E]">
                Pool: {pool.poolAddress.slice(0, 6)}...{pool.poolAddress.slice(-4)}
              </span>
              <CopyButton text={pool.poolAddress} label="pool address" />
              <a
                href={`https://basescan.org/address/${pool.poolAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-[#6C4DFF] hover:text-[#8B72FF] font-medium cursor-pointer flex items-center gap-1"
              >
                <i className="ri-external-link-line text-xs"></i>
                Explorer
              </a>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-start">
            <Link
              to={`/swap?from=${pool.token0Symbol}&to=${pool.token1Symbol}&chain=${chainParam}`}
              className="liquid-glass-btn-primary px-5 py-2.5 text-[13px] text-white font-semibold rounded-full cursor-pointer whitespace-nowrap flex items-center gap-2"
            >
              Trade Pair
              <i className="ri-arrow-left-right-line text-sm"></i>
            </Link>
            <Link
              to={`/v2?token=${pool.token0Symbol}`}
              className="liquid-glass-btn px-5 py-2.5 text-[13px] text-[#F6F2EA] font-medium rounded-full cursor-pointer whitespace-nowrap flex items-center gap-2"
            >
              View Tokens
              <i className="ri-arrow-right-line text-sm"></i>
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {statCards.map((stat, i) => (
            <div key={i} className="liquid-glass-card rounded-[16px] p-4 relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-[#1A1A2E]/60 flex items-center justify-center">
                  <i className={`${stat.icon} text-[#A69DB7] text-sm`}></i>
                </div>
                <span className="text-[11px] text-[#6E667E]">{stat.label}</span>
              </div>
              <div className={`text-[18px] md:text-[20px] font-bold tracking-tight ${stat.muted ? 'text-[#6E667E]' : 'text-[#F6F2EA]'}`}>
                {stat.value}
              </div>
              {stat.change !== null && stat.change !== undefined && (
                <div className="mt-1">{formatChange(stat.change)}</div>
              )}
              {stat.change === null && (
                <div className="text-[11px] text-[#6E667E] mt-1">—</div>
              )}
            </div>
          ))}
        </div>

        {/* APR Unavailable Note */}
        {aprUnavailable && (
          <div className="flex items-start gap-2 px-4 py-3 rounded-[12px] bg-[#1A1A2E]/40 border border-[#1A1A2E]/40">
            <i className="ri-information-line text-[#6E667E] text-sm mt-0.5 shrink-0"></i>
            <p className="text-[12px] text-[#A69DB7]">
              APR requires reliable source data and sufficient pool activity. Pool analytics remain available even when APR is unavailable.
            </p>
          </div>
        )}

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Liquidity Composition */}
          <div className="liquid-glass-card rounded-[20px] p-5">
            <h3 className="text-[14px] font-semibold text-[#F6F2EA] mb-4">Liquidity Composition</h3>
            {details && (
              <>
                <DonutChart
                  token0={pool.token0}
                  token0Symbol={pool.token0Symbol}
                  token1={pool.token1}
                  token1Symbol={pool.token1Symbol}
                  token0Pct={details.token0Allocation}
                  token1Pct={details.token1Allocation}
                  token0Color="#FF6A1A"
                  token1Color="#6C4DFF"
                  totalLiquidity={formatM(pool.liquidity)}
                />

                {/* Quality indicators */}
                <div className="mt-4 pt-4 border-t border-[#1A1A2E]/40 flex items-center gap-4">
                  <QualityBadge label="Depth:" value={details.depth} />
                  <QualityBadge label="Activity:" value={details.activity} />
                  <QualityBadge label="Data:" value={details.dataConfidence} />
                </div>

                {/* Reserves */}
                <div className="mt-4 pt-4 border-t border-[#1A1A2E]/40">
                  <div className="text-[10px] font-semibold text-[#6E667E] uppercase tracking-wider mb-3">Reserves</div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#09031A]/40 border border-[#1A1A2E]/30">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#FF6A1A]/15 flex items-center justify-center text-[10px] font-bold text-[#FF7A22]">
                          {pool.token0Symbol[0]}
                        </div>
                        <span className="text-[13px] font-medium text-[#F6F2EA]">{pool.token0Symbol}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-[13px] font-semibold text-[#F6F2EA]">
                          {details.token0Reserve.toLocaleString(undefined, { maximumFractionDigits: 2 })} {pool.token0Symbol}
                        </div>
                        <div className="text-[11px] text-[#6E667E]">
                          ${(details.token0ReserveUsd / 1e6).toFixed(2)}M
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#09031A]/40 border border-[#1A1A2E]/30">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#6C4DFF]/15 flex items-center justify-center text-[10px] font-bold text-[#6C4DFF]">
                          {pool.token1Symbol[0]}
                        </div>
                        <span className="text-[13px] font-medium text-[#F6F2EA]">{pool.token1Symbol}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-[13px] font-semibold text-[#F6F2EA]">
                          {details.token1Reserve.toLocaleString(undefined, { maximumFractionDigits: 2 })} {pool.token1Symbol}
                        </div>
                        <div className="text-[11px] text-[#6E667E]">
                          ${(details.token1ReserveUsd / 1e6).toFixed(2)}M
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Center: Pool Activity */}
          <div className="liquid-glass-card rounded-[20px] p-5">
            <ActivityChart pool={pool} details={details} />
          </div>

          {/* Right: LP Exposure */}
          {walletState === 'disconnected' && <ConnectWalletCard />}
          {walletState === 'connected-no-position' && <NoPositionCard />}
          {walletState === 'connected-with-position' && details && details.hasExposure && (
            <LPExposureCard pool={pool} details={details} />
          )}
          {walletState === 'connected-with-position' && details && !details.hasExposure && (
            <NoPositionCard />
          )}
        </div>

        {/* Low liquidity: extra note */}
        {isLowLiquidity && (
          <div className="flex items-start gap-2 px-4 py-3 rounded-[12px] bg-[#FF5B5B]/5 border border-[#FF5B5B]/10">
            <i className="ri-alert-line text-[#FF5B5B] text-sm mt-0.5 shrink-0"></i>
            <p className="text-[12px] text-[#A69DB7]">
              Review route and quote carefully before trading. Low liquidity may cause significant slippage.
            </p>
          </div>
        )}

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* About This Pool */}
          <div className="liquid-glass-card rounded-[20px] p-5">
            <h3 className="text-[14px] font-semibold text-[#F6F2EA] mb-3">About This Pool</h3>
            <p className="text-[13px] text-[#D8D1E6] leading-relaxed mb-4">
              {details?.description}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="px-3 py-2.5 rounded-xl bg-[#09031A]/40 border border-[#1A1A2E]/30">
                <div className="text-[10px] text-[#6E667E] uppercase tracking-wider mb-1">Fee Tier</div>
                <div className="text-[13px] font-semibold text-[#F6F2EA]">{pool.feeTier}</div>
              </div>
              <div className="px-3 py-2.5 rounded-xl bg-[#09031A]/40 border border-[#1A1A2E]/30">
                <div className="text-[10px] text-[#6E667E] uppercase tracking-wider mb-1">DEX</div>
                <div className="text-[13px] font-semibold text-[#F6F2EA]">{pool.dex}</div>
              </div>
              <div className="px-3 py-2.5 rounded-xl bg-[#09031A]/40 border border-[#1A1A2E]/30">
                <div className="text-[10px] text-[#6E667E] uppercase tracking-wider mb-1">Chain</div>
                <div className="text-[13px] font-semibold text-[#F6F2EA]">{pool.chain}</div>
              </div>
              <div className="px-3 py-2.5 rounded-xl bg-[#09031A]/40 border border-[#1A1A2E]/30">
                <div className="text-[10px] text-[#6E667E] uppercase tracking-wider mb-1">Pool Created</div>
                <div className="text-[13px] font-semibold text-[#F6F2EA]">{pool.created}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="px-3 py-2.5 rounded-xl bg-[#09031A]/40 border border-[#1A1A2E]/30">
                <div className="text-[10px] text-[#6E667E] uppercase tracking-wider mb-1">Avg Txn Size</div>
                <div className="text-[13px] font-semibold text-[#F6F2EA]">${pool.avgTxnSize}</div>
              </div>
              <div className="px-3 py-2.5 rounded-xl bg-[#09031A]/40 border border-[#1A1A2E]/30">
                <div className="text-[10px] text-[#6E667E] uppercase tracking-wider mb-1">Status</div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${pool.status === 'Healthy' ? 'bg-[#34D07F]' : 'bg-[#FF8A3D]'}`} />
                  <span className="text-[13px] font-semibold text-[#F6F2EA]">{pool.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Actions */}
          <div className="liquid-glass-card rounded-[20px] p-5">
            <h3 className="text-[14px] font-semibold text-[#F6F2EA] mb-3">Related Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to={`/v2?token=${pool.token0Symbol}`}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#09031A]/40 border border-[#1A1A2E]/30 hover:border-[#1A1A2E]/60 transition-all cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-[#FF6A1A]/15 flex items-center justify-center text-[10px] font-bold text-[#FF7A22]">
                  {pool.token0Symbol[0]}
                </div>
                <span className="text-[13px] font-medium text-[#F6F2EA]">View {pool.token0Symbol} Token</span>
                <i className="ri-external-link-line text-[#6E667E] text-xs ml-auto"></i>
              </Link>
              <Link
                to={`/v2?token=${pool.token1Symbol}`}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#09031A]/40 border border-[#1A1A2E]/30 hover:border-[#1A1A2E]/60 transition-all cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-[#6C4DFF]/15 flex items-center justify-center text-[10px] font-bold text-[#6C4DFF]">
                  {pool.token1Symbol[0]}
                </div>
                <span className="text-[13px] font-medium text-[#F6F2EA]">View {pool.token1Symbol} Token</span>
                <i className="ri-external-link-line text-[#6E667E] text-xs ml-auto"></i>
              </Link>
              <a
                href={`https://basescan.org/address/${pool.poolAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#09031A]/40 border border-[#1A1A2E]/30 hover:border-[#1A1A2E]/60 transition-all cursor-pointer"
              >
                <i className="ri-external-link-line text-[#6E667E] text-sm"></i>
                <span className="text-[13px] font-medium text-[#F6F2EA]">View on Explorer</span>
                <i className="ri-arrow-right-up-line text-[#6E667E] text-xs ml-auto"></i>
              </a>
              <Link
                to={`/swap?from=${pool.token0Symbol}&to=${pool.token1Symbol}&chain=${chainParam}`}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl liquid-glass-btn-primary text-[13px] text-white font-medium cursor-pointer"
              >
                Trade Pair
                <i className="ri-arrow-left-right-line text-sm"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* Swap context note */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] bg-[#6C4DFF]/5 border border-[#6C4DFF]/10">
          <i className="ri-information-line text-[#6C4DFF] text-sm"></i>
          <span className="text-[12px] text-[#A69DB7]">
            Opened from {pool.pair} pool &middot; Trade Pair opens Swap with this pair prefilled.
          </span>
        </div>

        {/* Bottom info note */}
        <div className="flex items-center gap-2 px-4 py-3 rounded-[12px] bg-[#09031A]/60 border border-[#1A1A2E]/40">
          <i className="ri-information-line text-[#6E667E] text-sm"></i>
          <span className="text-[12px] text-[#A69DB7]">
            Pool data is aggregated from on-chain and third-party sources. APR is estimated and may vary. This is a view-only analytics page. CrackerSwap does not provide liquidity management.
          </span>
        </div>
      </div>

      {/* Toast */}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}