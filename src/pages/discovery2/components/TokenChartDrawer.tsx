import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Token } from '@/mocks/discoveryTokens';
import { timeframeTemplates, tokenMetrics } from '@/mocks/tokenChartData';
import type { ChartPoint } from '@/mocks/tokenChartData';

type TimeframeKey = '1H' | '24H' | '7D' | '30D' | '1Y';

interface TokenChartDrawerProps {
  token: Token | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleWatchlist: (tokenId: string) => void;
  isWatchlisted: boolean;
}

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

const formatNum = (n: number) => {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K';
  return n.toLocaleString();
};

const badgeStyle = (badge: string) => {
  switch (badge) {
    case 'HOT': return { bg: 'rgba(255, 106, 26, 0.12)', color: '#FF7A22', border: 'rgba(255, 106, 26, 0.15)' };
    case 'NEW': return { bg: 'rgba(108, 77, 255, 0.12)', color: '#7B61FF', border: 'rgba(108, 77, 255, 0.15)' };
    case 'VERIFIED': return { bg: 'rgba(52, 208, 127, 0.12)', color: '#34D07F', border: 'rgba(52, 208, 127, 0.15)' };
    case 'HIGH VOL': return { bg: 'rgba(255, 91, 91, 0.12)', color: '#FF5B5B', border: 'rgba(255, 91, 91, 0.15)' };
    default: return { bg: 'rgba(255,255,255,0.05)', color: '#6E667E', border: 'rgba(255,255,255,0.08)' };
  }
};

export default function TokenChartDrawer({ token, isOpen, onClose, onToggleWatchlist, isWatchlisted }: TokenChartDrawerProps) {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState<TimeframeKey>('24H');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
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

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2200);
  }, []);

  const chartData = useMemo(() => {
    if (!token) return [];
    const template = timeframeTemplates[timeframe];
    if (!template) return [];
    const basePct = template[0].value;
    return template.map((p: ChartPoint) => {
      const pctChange = (p.value - basePct) / 100;
      return { time: p.time, value: token.price * (1 + pctChange) };
    });
  }, [token, timeframe]);

  const metrics = useMemo(() => {
    if (!token) return null;
    return tokenMetrics[token.id] || { high24h: token.price * 1.05, low24h: token.price * 0.95, transactions24h: 100000 };
  }, [token]);

  const chartColor = useMemo(() => {
    if (!token || chartData.length < 2) return '#7B61FF';
    return chartData[chartData.length - 1].value >= chartData[0].value ? '#34D07F' : '#FF5B5B';
  }, [token, chartData]);

  const chartSvg = useMemo(() => {
    if (!chartData.length) return null;
    const w = 400;
    const h = 200;
    const pad = { top: 16, right: 44, bottom: 24, left: 8 };
    const pw = w - pad.left - pad.right;
    const ph = h - pad.top - pad.bottom;
    const values = chartData.map((d: { value: number }) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const rangePad = range * 0.08;
    const yMin = min - rangePad;
    const yMax = max + rangePad;
    const yRange = yMax - yMin;

    const points = values.map((v: number, i: number) => {
      const x = pad.left + (i / (values.length - 1)) * pw;
      const y = pad.top + ((yMax - v) / yRange) * ph;
      return `${x},${y}`;
    });

    const polylinePoints = points.join(' ');
    const areaPoints = `${pad.left},${pad.top + ph} ${points.join(' ')} ${pad.left + pw},${pad.top + ph}`;

    const gridLines = [];
    for (let i = 1; i <= 4; i++) {
      const yVal = yMin + (yRange * i) / 5;
      const y = pad.top + ((yMax - yVal) / yRange) * ph;
      gridLines.push(
        <g key={`grid-${i}`}>
          <line x1={pad.left} y1={y} x2={pad.left + pw} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
          <text x={pad.left + pw + 6} y={y + 3} textAnchor="start" fill="#6E667E" fontSize={9} fontFamily="Inter, sans-serif">
            {yVal >= 1 ? '$' + yVal.toFixed(2) : yVal >= 0.01 ? '$' + yVal.toFixed(4) : '$' + yVal.toExponential(2)}
          </text>
        </g>
      );
    }

    const xLabels = [];
    const labelIndices = timeframe === '1H' ? [0, 3, 6, 9, 11]
      : timeframe === '24H' ? [0, 6, 12, 18, 23]
      : timeframe === '7D' ? [0, 1, 3, 5, 6]
      : timeframe === '30D' ? [0, 7, 14, 21, 28]
      : [0, 3, 6, 9, 11];

    labelIndices.forEach((idx) => {
      if (idx >= chartData.length) return;
      const x = pad.left + (idx / (chartData.length - 1)) * pw;
      xLabels.push(
        <text key={`xl-${idx}`} x={x} y={h - 4} textAnchor="middle" fill="#6E667E" fontSize={9} fontFamily="Inter, sans-serif">
          {chartData[idx].time}
        </text>
      );
    });

    return (
      <svg width="100%" height="220" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" className="w-full">
        <defs>
          <linearGradient id="chart-area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chartColor} stopOpacity={0.18} />
            <stop offset="100%" stopColor={chartColor} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        {gridLines}
        <polygon points={`${areaPoints}`} fill="url(#chart-area-fill)" />
        <polyline
          points={polylinePoints}
          fill="none"
          stroke={chartColor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={points[points.length - 1].split(',')[0]} cy={points[points.length - 1].split(',')[1]} r={3.5} fill={chartColor} stroke="#070214" strokeWidth={2} />
        {xLabels}
      </svg>
    );
  }, [chartData, timeframe, chartColor]);

  if (!token) return null;

  const handleTrade = () => {
    navigate(`/swap?from=${token.symbol}&to=USDC`);
    onClose();
  };

  const handleCopyContract = () => {
    const addr = `0x${token.id}${'0'.repeat(32 - token.id.length)}${'a1b2c3d4e5f6'}`;
    navigator.clipboard.writeText(addr).then(() => {
      showToast('Contract address copied');
    }).catch(() => {
      showToast('Failed to copy');
    });
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-[4px] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Chart for ${token.name}`}
        className={`fixed z-[101] bg-[#0D0620]/95 backdrop-blur-2xl border-l border-white/[0.08] shadow-[0_0_120px_rgba(0,0,0,0.6)] flex flex-col transition-all duration-[350ms] ease-out
          right-0 top-0 bottom-0 w-full sm:w-[460px] rounded-t-2xl sm:rounded-t-none sm:rounded-l-2xl
          ${isOpen ? 'translate-y-0 sm:translate-x-0' : 'translate-y-full sm:translate-y-0 sm:translate-x-full'}`}
      >
        {/* Inner ambient glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-[200px] h-[200px] bg-[#FF6A1A]/[0.04] rounded-full blur-[80px]" />
          <div className="absolute bottom-[30%] right-0 w-[180px] h-[180px] bg-[#6C4DFF]/[0.04] rounded-full blur-[80px]" />
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[110] px-4 py-2 rounded-full bg-[#34D07F]/15 border border-[#34D07F]/20 text-[#34D07F] text-[11px] font-medium backdrop-blur-md shadow-lg animate-fade-in-out">
            <i className="ri-check-line mr-1.5 text-[10px]"></i>
            {toastMsg}
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close chart"
          className="absolute top-4 right-4 z-[110] w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.06] border border-white/[0.10] text-[#A69DB7] hover:text-[#F6F2EA] hover:bg-white/[0.10] transition-all cursor-pointer backdrop-blur-md"
        >
          <i className="ri-close-line"></i>
        </button>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6 sm:py-7 relative z-10">
          {/* ─── Header ─── */}
          <div className="flex items-start gap-3.5 mb-5 pr-8">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: token.iconBgColor + '20' }}
            >
              <i className={token.icon} style={{ fontSize: 20, color: token.iconBgColor }}></i>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="text-[17px] font-bold text-[#F6F2EA] leading-tight">{token.name}</h3>
                <span className="text-[13px] text-[#6E667E] font-medium">{token.symbol}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-[#A69DB7] liquid-glass-badge">
                  <span className="relative z-10 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: token.chainColor }}></span>
                    {token.chain}
                  </span>
                </span>
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

          {/* ─── Price Summary ─── */}
          <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <div>
              <p className="text-[10px] text-[#6E667E] uppercase tracking-[0.1em] mb-1">Current Price</p>
              <div className="flex items-baseline gap-2">
                <span className="text-[22px] font-bold text-[#F6F2EA]">{formatPrice(token.price)}</span>
                <span className={`text-[12px] font-semibold ${token.priceChange24h >= 0 ? 'text-[#34D07F]' : 'text-[#FF5B5B]'}`}>
                  {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-2 text-right">
              <div>
                <p className="text-[9px] text-[#6E667E]">24h Vol</p>
                <p className="text-[11px] font-medium text-[#D8D1E6]">{formatCompact(token.volume24h)}</p>
              </div>
              <div>
                <p className="text-[9px] text-[#6E667E]">Liquidity</p>
                <p className="text-[11px] font-medium text-[#D8D1E6]">{formatCompact(token.liquidity)}</p>
              </div>
              <div>
                <p className="text-[9px] text-[#6E667E]">Market Cap</p>
                <p className="text-[11px] font-medium text-[#D8D1E6]">{formatCompact(token.marketCap)}</p>
              </div>
              <div>
                <p className="text-[9px] text-[#6E667E]">Change</p>
                <p className={`text-[11px] font-medium ${token.priceChange24h >= 0 ? 'text-[#34D07F]' : 'text-[#FF5B5B]'}`}>
                  {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          {/* ─── Chart ─── */}
          <div className="mb-5 p-4 rounded-xl bg-white/[0.025] border border-white/[0.06]">
            <h4 className="text-[12px] font-semibold text-[#D8D1E6] mb-3">Price Chart</h4>

            {/* Timeframe Tabs */}
            <div className="flex items-center gap-1 mb-4">
              {(['1H', '24H', '7D', '30D', '1Y'] as TimeframeKey[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    timeframe === tf
                      ? 'bg-[#FF6A1A]/12 text-[#FF7A22] border border-[#FF6A1A]/20'
                      : 'bg-white/[0.04] text-[#A69DB7] border border-white/[0.07] hover:bg-white/[0.06] hover:text-[#F6F2EA]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Chart SVG */}
            <div className="w-full bg-white/[0.015] rounded-lg border border-white/[0.04] overflow-hidden">
              {chartSvg}
            </div>

            {/* Mini Metrics Grid */}
            {metrics && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                <div className="text-center p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-[9px] text-[#6E667E] mb-1">24H High</p>
                  <p className="text-[12px] font-semibold text-[#34D07F]">{formatPrice(metrics.high24h)}</p>
                </div>
                <div className="text-center p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-[9px] text-[#6E667E] mb-1">24H Low</p>
                  <p className="text-[12px] font-semibold text-[#FF5B5B]">{formatPrice(metrics.low24h)}</p>
                </div>
                <div className="text-center p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-[9px] text-[#6E667E] mb-1">Liquidity</p>
                  <p className="text-[12px] font-semibold text-[#D8D1E6]">{formatCompact(token.liquidity)}</p>
                </div>
                <div className="text-center p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-[9px] text-[#6E667E] mb-1">24H Txns</p>
                  <p className="text-[12px] font-semibold text-[#D8D1E6]">{formatNum(metrics.transactions24h)}</p>
                </div>
              </div>
            )}
          </div>

          {/* ─── Actions ─── */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={handleTrade}
              className="liquid-glass-btn-primary w-full px-5 py-3 text-[#F6F2EA] text-[13px] font-semibold cursor-pointer whitespace-nowrap relative z-10"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <i className="ri-swap-box-line text-sm"></i>
                Trade {token.symbol}
              </span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleWatchlist(token.id)}
                className={`flex-1 px-4 py-2.5 rounded-full text-[12px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap relative border ${
                  isWatchlisted
                    ? 'bg-[#FF6A1A]/10 text-[#FF7A22] border-[#FF6A1A]/20'
                    : 'bg-white/[0.04] text-[#A69DB7] border-white/[0.08] hover:bg-white/[0.06] hover:text-[#F6F2EA]'
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-1.5">
                  <i className={`${isWatchlisted ? 'ri-star-fill' : 'ri-star-line'} text-[11px]`}></i>
                  {isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </span>
              </button>

              <button
                onClick={handleCopyContract}
                className="px-4 py-2.5 rounded-full text-[12px] font-medium text-[#A69DB7] bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] hover:text-[#F6F2EA] transition-all duration-200 cursor-pointer whitespace-nowrap relative"
              >
                <span className="relative z-10 flex items-center justify-center gap-1.5">
                  <i className="ri-file-copy-line text-[11px]"></i>
                  Copy Contract
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}