import { useState, useMemo } from 'react';
import { getActivityData, getActivityData7D, getActivityData30D, getActivityData1H, getActivityData6H } from '@/mocks/poolsData';
import type { Pool } from '@/mocks/poolsData';

interface ActivityChartProps {
  pool: Pool;
  details?: {
    volume24hHigh: number;
    volume24hLow: number;
  } | null;
}

type Timeframe = '1H' | '6H' | '24H' | '7D' | '30D';
type Metric = 'volume' | 'liquidity' | 'txns';

const timeframes: Timeframe[] = ['1H', '6H', '24H', '7D', '30D'];

const metricColors: Record<Metric, string> = {
  volume: '#6C4DFF',
  liquidity: '#FF8A3D',
  txns: '#34D07F',
};

const metricLabels: Record<Metric, string> = {
  volume: 'Volume (USD)',
  liquidity: 'Liquidity (USD)',
  txns: 'Transactions',
};

export default function ActivityChart({ pool, details }: ActivityChartProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>('24H');
  const [activeMetrics, setActiveMetrics] = useState<Metric[]>(['volume']);

  const data = useMemo(() => {
    switch (timeframe) {
      case '1H': return getActivityData1H(String(pool.id));
      case '6H': return getActivityData6H(String(pool.id));
      case '24H': return getActivityData(String(pool.id));
      case '7D': return getActivityData7D(String(pool.id));
      case '30D': return getActivityData30D(String(pool.id));
      default: return getActivityData(String(pool.id));
    }
  }, [timeframe, pool.id]);

  const toggleMetric = (metric: Metric) => {
    setActiveMetrics((prev) => {
      if (prev.includes(metric)) {
        if (prev.length === 1) return prev;
        return prev.filter((m) => m !== metric);
      }
      return [...prev, metric];
    });
  };

  const formatM = (val: number, small?: boolean) => {
    if (small && val < 1) return `$${(val * 1000).toFixed(1)}K`;
    if (val >= 1) return `$${val.toFixed(2)}M`;
    return `$${(val * 1000).toFixed(1)}K`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-[#F6F2EA]">Pool Activity</h3>
        <div className="flex items-center gap-0.5">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1.5 rounded-full text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                timeframe === tf
                  ? 'bg-[#6C4DFF]/20 text-[#6C4DFF] border border-[#6C4DFF]/20'
                  : 'text-[#A69DB7] hover:text-[#F6F2EA] border border-transparent'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Toggles */}
      <div className="flex items-center gap-2">
        {(Object.keys(metricColors) as Metric[]).map((metric) => {
          const active = activeMetrics.includes(metric);
          return (
            <button
              key={metric}
              onClick={() => toggleMetric(metric)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                active
                  ? 'bg-[#1A1A2E]/60 border border-white/10 text-[#D8D1E6]'
                  : 'text-[#6E667E] border border-transparent hover:text-[#A69DB7]'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: active ? metricColors[metric] : '#6E667E' }}
              />
              {metricLabels[metric]}
            </button>
          );
        })}
      </div>

      {/* Chart Area */}
      <ChartBars data={data} activeMetrics={activeMetrics} metricColors={metricColors} />

      {/* Summary Values */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#1A1A2E]/40">
        <div className="px-2 py-2 rounded-lg bg-[#09031A]/40">
          <div className="text-[10px] text-[#6E667E] uppercase tracking-wider">24H Volume</div>
          <div className="text-[13px] font-semibold text-[#F6F2EA]">${pool.volume24h.toFixed(2)}M</div>
        </div>
        <div className="px-2 py-2 rounded-lg bg-[#09031A]/40">
          <div className="text-[10px] text-[#6E667E] uppercase tracking-wider">24H High</div>
          <div className="text-[13px] font-semibold text-[#F6F2EA]">
            {details ? formatM(details.volume24hHigh) : '—'}
          </div>
        </div>
        <div className="px-2 py-2 rounded-lg bg-[#09031A]/40">
          <div className="text-[10px] text-[#6E667E] uppercase tracking-wider">24H Low</div>
          <div className="text-[13px] font-semibold text-[#F6F2EA]">
            {details ? formatM(details.volume24hLow) : '—'}
          </div>
        </div>
        <div className="px-2 py-2 rounded-lg bg-[#09031A]/40">
          <div className="text-[10px] text-[#6E667E] uppercase tracking-wider">Liquidity</div>
          <div className="text-[13px] font-semibold text-[#F6F2EA]">${pool.liquidity.toFixed(2)}M</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Chart Bars Sub-component ─── */
function ChartBars({
  data,
  activeMetrics,
  metricColors,
}: {
  data: { time: string; volume: number; liquidity: number }[];
  activeMetrics: Metric[];
  metricColors: Record<Metric, string>;
}) {
  const maxes = useMemo(() => {
    const vols = data.map((d) => d.volume);
    const liqs = data.map((d) => d.liquidity);
    const txns = data.map((_, i) => (data.length > 0 ? i * 12 + Math.random() * 8 : 1));
    return {
      volume: Math.max(...vols, 0.001),
      liquidity: Math.max(...liqs, 0.001),
      txns: Math.max(...txns, 1),
    };
  }, [data]);

  const chartH = 140;
  const paddingLeft = 24;
  const paddingRight = 16;
  const usableWidth = 100 - paddingLeft - paddingRight;
  const barTotalWidth = usableWidth / data.length;
  const barWidth = activeMetrics.length === 1 ? barTotalWidth * 0.7 : barTotalWidth * 0.5;
  const groupOffset = activeMetrics.length === 1 ? 0 : barWidth / 2;

  return (
    <div className="relative w-full" style={{ height: `${chartH}px` }}>
      <svg viewBox={`0 0 100 ${chartH}`} className="w-full h-full" preserveAspectRatio="none">
        {/* Horizontal grid lines */}
        {[0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = chartH - 8 - ratio * (chartH - 20);
          return (
            <line
              key={ratio}
              x1={paddingLeft}
              y1={y}
              x2={100 - paddingRight}
              y2={y}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          return (
            <g key={i}>
              {activeMetrics.map((metric, mi) => {
                const maxVal = maxes[metric] || 0.001;
                const value = metric === 'volume' ? d.volume : metric === 'liquidity' ? d.liquidity : (i * 12 + 8);
                const ratio = value / maxVal;
                const barH = Math.max(ratio * (chartH - 20), 1.5);
                const barX = paddingLeft + i * barTotalWidth + barTotalWidth / 2 + (mi - (activeMetrics.length - 1) / 2) * barWidth;
                const barY = chartH - 8 - barH;

                return (
                  <rect
                    key={`${metric}-${i}`}
                    x={barX - barWidth / 2}
                    y={barY}
                    width={barWidth}
                    height={barH}
                    rx={activeMetrics.length > 1 ? 1 : 2}
                    fill={metricColors[metric]}
                    opacity={activeMetrics.length > 1 ? 0.7 : 0.75}
                  />
                );
              })}
            </g>
          );
        })}
      </svg>
      {/* X-axis labels */}
      <div className="flex justify-between px-1 mt-0.5">
        {data.map((d, i) => (
          <span
            key={i}
            className="text-[10px] text-[#6E667E] text-center"
            style={{ width: `${100 / data.length}%`, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {d.time}
          </span>
        ))}
      </div>
    </div>
  );
}