import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PortfolioToken } from '@/mocks/portfolioData';

interface TokenBalanceDrawerProps {
  token: PortfolioToken | null;
  isOpen: boolean;
  onClose: () => void;
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

const Sparkline = ({ data, color, width = 380, height = 160 }: { data: number[]; color: string; width?: number; height?: number }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = { top: 12, right: 8, bottom: 16, left: 8 };
  const pw = width - pad.left - pad.right;
  const ph = height - pad.top - pad.bottom;
  const points = data.map((v, i) => {
    const x = pad.left + (i / (data.length - 1)) * pw;
    const y = pad.top + ((max - v) / range) * ph;
    return `${x},${y}`;
  });
  const polylinePoints = points.join(' ');
  const areaPoints = `${pad.left},${pad.top + ph} ${points.join(' ')} ${pad.left + pw},${pad.top + ph}`;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" className="w-full">
      <defs>
        <linearGradient id={`bal-chart-fill-${data[0]}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.18} />
          <stop offset="100%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#bal-chart-fill-${data[0]})`} />
      <polyline points={polylinePoints} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={points[points.length - 1].split(',')[0]} cy={points[points.length - 1].split(',')[1]} r={3.5} fill={color} stroke="#070214" strokeWidth={2} />
    </svg>
  );
};

export default function TokenBalanceDrawer({ token, isOpen, onClose }: TokenBalanceDrawerProps) {
  const navigate = useNavigate();
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

  if (!token) return null;

  const handleTrade = () => {
    navigate(`/swap?from=${token.symbol}&to=USDC`);
    onClose();
  };

  const handleCopyContract = () => {
    const addr = `0x${token.id}${'0'.repeat(28)}a1b2c3d4`;
    navigator.clipboard.writeText(addr).then(() => {
      showToast('Contract address copied');
    }).catch(() => {
      showToast('Failed to copy');
    });
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-[4px] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Balance details for ${token.name}`}
        className={`fixed z-[101] bg-[#0D0620]/95 backdrop-blur-2xl border-l border-white/[0.08] shadow-[0_0_120px_rgba(0,0,0,0.6)] flex flex-col transition-all duration-[350ms] ease-out
          right-0 top-0 bottom-0 w-full sm:w-[460px] rounded-t-2xl sm:rounded-t-none sm:rounded-l-2xl
          ${isOpen ? 'translate-y-0 sm:translate-x-0' : 'translate-y-full sm:translate-y-0 sm:translate-x-full'}`}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-[200px] h-[200px] bg-[#FF6A1A]/[0.04] rounded-full blur-[80px]" />
          <div className="absolute bottom-[30%] right-0 w-[180px] h-[180px] bg-[#6C4DFF]/[0.04] rounded-full blur-[80px]" />
        </div>

        {toastMsg && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[110] px-4 py-2 rounded-full bg-[#34D07F]/15 border border-[#34D07F]/20 text-[#34D07F] text-[11px] font-medium backdrop-blur-md shadow-lg animate-fade-in-out">
            <i className="ri-check-line mr-1.5 text-[10px]"></i>
            {toastMsg}
          </div>
        )}

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-[110] w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.06] border border-white/[0.10] text-[#A69DB7] hover:text-[#F6F2EA] hover:bg-white/[0.10] transition-all cursor-pointer backdrop-blur-md"
        >
          <i className="ri-close-line"></i>
        </button>

        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6 sm:py-7 relative z-10">
          {/* Header */}
          <div className="flex items-start gap-3.5 mb-5 pr-8">
            <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: token.iconBgColor + '20' }}>
              <i className={token.icon} style={{ fontSize: 20, color: token.iconBgColor }}></i>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[17px] font-bold text-[#F6F2EA]">{token.name}</h3>
                <span className="text-[13px] text-[#6E667E] font-medium">{token.symbol}</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-[#A69DB7] liquid-glass-badge">
                <span className="relative z-10 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: token.chainColor }}></span>
                  {token.chain}
                </span>
              </span>
            </div>
          </div>

          {/* Balance & Value */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] mb-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-[#6E667E] uppercase tracking-[0.1em] mb-1">Balance</p>
                <p className="text-[20px] font-bold text-[#F6F2EA]">{token.balance.toLocaleString('en-US')} {token.symbol}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#6E667E] uppercase tracking-[0.1em] mb-1">Value</p>
                <p className="text-[20px] font-bold text-[#F6F2EA]">{formatValue(token.value)}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#6E667E] uppercase tracking-[0.1em] mb-1">Price</p>
                <p className="text-[14px] font-semibold text-[#D8D1E6]">{formatPrice(token.price)}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#6E667E] uppercase tracking-[0.1em] mb-1">24H Change</p>
                <p className={`text-[14px] font-semibold ${token.priceChange24h >= 0 ? 'text-[#34D07F]' : 'text-[#FF5B5B]'}`}>
                  {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          {/* Mini Chart */}
          <div className="p-4 rounded-xl bg-white/[0.025] border border-white/[0.06] mb-5">
            <h4 className="text-[12px] font-semibold text-[#D8D1E6] mb-3">Price Chart (24H)</h4>
            <div className="w-full bg-white/[0.015] rounded-lg border border-white/[0.04] overflow-hidden">
              <Sparkline data={token.sparkline} color={token.priceChange24h >= 0 ? '#34D07F' : '#FF5B5B'} />
            </div>
          </div>

          {/* Allocation */}
          <div className="p-4 rounded-xl bg-white/[0.025] border border-white/[0.06] mb-5">
            <h4 className="text-[12px] font-semibold text-[#D8D1E6] mb-2">Portfolio Allocation</h4>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${token.allocation}%`, backgroundColor: token.iconBgColor }} />
              </div>
              <span className="text-[13px] font-semibold text-[#F6F2EA]">{token.allocation.toFixed(2)}%</span>
            </div>
          </div>

          {/* Actions */}
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
    </>
  );
}