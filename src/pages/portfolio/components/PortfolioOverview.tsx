import { portfolioSummary, allocationData, portfolioTransactions } from '@/mocks/portfolioData';

interface PortfolioOverviewProps {
  onSwitchTab: (tab: string) => void;
}

const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
  if (!data || data.length < 2) return null;
  const w = 72;
  const h = 22;
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

export default function PortfolioOverview({ onSwitchTab }: PortfolioOverviewProps) {
  const sum = portfolioSummary;
  const recentTxs = portfolioTransactions.slice(0, 5);

  const statusStyle = (status: string) => {
    switch (status) {
      case 'success': return { bg: 'rgba(52, 208, 127, 0.12)', color: '#34D07F', border: 'rgba(52, 208, 127, 0.15)' };
      case 'pending': return { bg: 'rgba(255, 106, 26, 0.12)', color: '#FF7A22', border: 'rgba(255, 106, 26, 0.15)' };
      case 'failed': return { bg: 'rgba(255, 91, 91, 0.12)', color: '#FF5B5B', border: 'rgba(255, 91, 91, 0.15)' };
      case 'detected': return { bg: 'rgba(108, 77, 255, 0.12)', color: '#7B61FF', border: 'rgba(108, 77, 255, 0.15)' };
      default: return { bg: 'rgba(255,255,255,0.05)', color: '#6E667E', border: 'rgba(255,255,255,0.08)' };
    }
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case 'swap': return 'ri-swap-box-line';
      case 'approval': return 'ri-shield-check-line';
      case 'failed': return 'ri-close-circle-line';
      case 'pending': return 'ri-time-line';
      case 'pool_trade': return 'ri-funds-line';
      case 'lp_detected': return 'ri-drop-line';
      default: return 'ri-exchange-line';
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Summary Card */}
      <div className="liquid-glass-card p-6">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold text-[#6E667E] uppercase tracking-[0.12em] mb-1">Total Portfolio Value</p>
            <div className="flex items-baseline gap-3">
              <span className="text-[32px] font-bold text-[#F6F2EA] leading-none">${sum.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              <span className={`text-[14px] font-semibold ${sum.change24hPct >= 0 ? 'text-[#34D07F]' : 'text-[#FF5B5B]'}`}>
                {sum.change24hPct >= 0 ? '+' : ''}{sum.change24h.toLocaleString('en-US', { minimumFractionDigits: 2 })} ({sum.change24hPct >= 0 ? '+' : ''}{sum.change24hPct.toFixed(2)}%)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:flex-col sm:items-end">
            <span className="text-[11px] text-[#A69DB7]">Wallet: <span className="text-[#D8D1E6] font-mono">{sum.walletAddress.slice(0, 6)}...{sum.walletAddress.slice(-4)}</span></span>
            <span className="text-[10px] text-[#6E667E] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D07F]"></span>
              {sum.network}
            </span>
          </div>
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'Total Assets', value: sum.totalAssets.toString(), icon: 'ri-coins-line', color: '#FF6A1A', colorLabel: '#FF7A22' },
          { label: 'Total Value', value: '$' + (sum.totalValue / 1000).toFixed(1) + 'K', icon: 'ri-funds-line', color: '#6C4DFF', colorLabel: '#7B61FF' },
          { label: '24H Change', value: (sum.change24hPct >= 0 ? '+' : '') + sum.change24hPct.toFixed(2) + '%', icon: 'ri-line-chart-line', color: '#34D07F', colorLabel: '#34D07F' },
          { label: 'LP Exposure', value: '$' + (sum.lpExposure / 1000).toFixed(1) + 'K', icon: 'ri-drop-line', color: '#7B61FF', colorLabel: '#8B72FF' },
          { label: 'Recent Activity', value: sum.recentActivity.toString() + ' txns', icon: 'ri-history-line', color: '#FF7A22', colorLabel: '#FF8A3D' },
        ].map((stat, i) => (
          <div key={i} className="liquid-glass-card p-4 flex flex-col justify-between min-h-[110px]">
            <div className="relative z-10 flex items-start justify-between">
              <p className="text-[10px] font-semibold text-[#6E667E] uppercase tracking-[0.10em]">{stat.label}</p>
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: stat.color + '15' }}>
                <i className={`${stat.icon} text-[11px]`} style={{ color: stat.colorLabel }}></i>
              </div>
            </div>
            <p className="relative z-10 text-[22px] font-bold text-[#F6F2EA] leading-none mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Allocation Card */}
        <div className="lg:col-span-3 liquid-glass-card p-5">
          <div className="relative z-10">
            <h3 className="text-[13px] font-semibold text-[#F6F2EA] mb-4">Portfolio Allocation</h3>
            <div className="space-y-3">
              {allocationData.map((item) => (
                <div key={item.symbol} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] font-medium text-[#D8D1E6]">{item.token}</span>
                      <span className="text-[12px] font-semibold text-[#F6F2EA]">{item.percentage.toFixed(2)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${item.percentage}%`, backgroundColor: item.color }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2 liquid-glass-card p-5">
          <div className="relative z-10">
            <h3 className="text-[13px] font-semibold text-[#F6F2EA] mb-4">Quick Actions</h3>
            <div className="space-y-2.5">
              {[
                { label: 'Trade', icon: 'ri-swap-box-line', action: () => onSwitchTab('assets'), color: '#FF6A1A' },
                { label: 'View Pools', icon: 'ri-funds-line', action: () => onSwitchTab('lp'), color: '#6C4DFF' },
                { label: 'View Activity', icon: 'ri-history-line', action: () => onSwitchTab('activity'), color: '#7B61FF' },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.10] transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: item.color + '15' }}>
                    <i className={`${item.icon} text-[13px]`} style={{ color: item.color }}></i>
                  </div>
                  <span className="text-[13px] font-medium text-[#D8D1E6] group-hover:text-[#F6F2EA] transition-colors">{item.label}</span>
                  <i className="ri-arrow-right-s-line text-[#6E667E] ml-auto"></i>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Preview */}
      <div className="liquid-glass-card overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 className="text-[13px] font-semibold text-[#F6F2EA]">Recent Activity</h3>
            <button
              onClick={() => onSwitchTab('activity')}
              className="text-[11px] font-medium text-[#A69DB7] hover:text-[#FF7A22] transition-colors cursor-pointer flex items-center gap-1"
            >
              View all <i className="ri-arrow-right-s-line text-[11px]"></i>
            </button>
          </div>
          <div>
            {recentTxs.map((tx) => {
              const s = statusStyle(tx.status);
              return (
                <div
                  key={tx.id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: s.bg }}>
                    <i className={`${typeIcon(tx.type)} text-[12px]`} style={{ color: s.color }}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-[#D8D1E6] truncate">{tx.pair}</p>
                    <p className="text-[10px] text-[#6E667E]">{tx.time}</p>
                  </div>
                  <div className="text-right">
                    {tx.value > 0 && (
                      <p className="text-[12px] font-medium text-[#F6F2EA]">${tx.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    )}
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: s.bg, color: s.color }}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}