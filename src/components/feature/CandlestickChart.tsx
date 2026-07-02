import { useMemo, useState } from 'react';
import type { CandleData } from '@/mocks/chartCandles';
import { btcCandles } from '@/mocks/chartCandles';

const timeframes = ['1H', '4H', '1D', '1W', '1M'] as const;
type Timeframe = typeof timeframes[number];

interface CandlestickChartProps {
  candles?: CandleData[];
}

export default function CandlestickChart({ candles = btcCandles }: CandlestickChartProps) {
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('1H');

  const chartData = useMemo(() => {
    const prices = candles.flatMap((c) => [c.high, c.low]);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const priceRange = maxPrice - minPrice;
    const padding = priceRange * 0.1;
    const chartMin = minPrice - padding;
    const chartMax = maxPrice + padding;
    const chartRange = chartMax - chartMin;

    const candleWidth = 12;
    const candleGap = 5;
    const totalWidth = candles.length * (candleWidth + candleGap) + 40;
    const chartHeight = 280;
    const chartWidth = Math.max(totalWidth, 800);

    const yLabels = 6;
    const yStep = chartRange / (yLabels - 1);

    const lastClose = candles[candles.length - 1]?.close ?? 0;
    const firstClose = candles[0]?.close ?? 0;
    const isPositive = lastClose >= firstClose;

    return {
      candles,
      chartMin,
      chartMax,
      chartRange,
      candleWidth,
      candleGap,
      totalWidth,
      chartHeight,
      chartWidth,
      yLabels,
      yStep,
      lastClose,
      firstClose,
      isPositive,
    };
  }, [candles]);

  const formatPrice = (price: number) => {
    return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const { chartData: cd } = useMemo(() => ({ chartData }), [chartData]);

  const bullColor = '#22c55e';
  const bearColor = '#ef4444';

  return (
    <div className="glass-card rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-orange-500/20 flex items-center justify-center">
              <i className="ri-bit-coin-fill text-xl text-orange-400"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-heading font-bold text-foreground-950">BTC / USD</h3>
                <span className="text-xs px-2 py-0.5 rounded-md bg-accent-500/15 text-accent-400 font-semibold">
                  24H
                </span>
              </div>
              <span className="text-xs text-foreground-500">Bitcoin • Real-time</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Price display */}
          <div className="text-right mr-4">
            <div className="text-xl font-heading font-bold text-foreground-950">
              {formatPrice(cd.lastClose)}
            </div>
            <div
              className={`text-xs font-semibold ${
                cd.isPositive ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {cd.isPositive ? '+' : ''}
              {((cd.lastClose - cd.firstClose) / cd.firstClose * 100).toFixed(2)}%
            </div>
          </div>

          {/* Timeframe selector */}
          <div className="flex items-center bg-background-200/50 rounded-lg p-0.5">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setActiveTimeframe(tf)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  activeTimeframe === tf
                    ? 'bg-primary-500/25 text-primary-400'
                    : 'text-foreground-500 hover:text-foreground-800'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative overflow-x-auto">
        <svg
          viewBox={`0 0 ${cd.chartWidth} ${cd.chartHeight + 40}`}
          className="w-full"
          style={{ minWidth: '100%', height: 'auto' }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid lines and Y-axis labels */}
          {Array.from({ length: cd.yLabels }, (_, i) => {
            const y = 20 + (cd.chartHeight / (cd.yLabels - 1)) * i;
            const price = cd.chartMax - cd.yStep * i;
            return (
              <g key={`grid-${i}`}>
                <line
                  x1={40}
                  y1={y}
                  x2={cd.chartWidth}
                  y2={y}
                  stroke="oklch(var(--background-300) / 0.3)"
                  strokeWidth={0.5}
                  strokeDasharray="4 4"
                />
                <text
                  x={36}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px]"
                  fill="oklch(var(--foreground-500))"
                  fontFamily="var(--font-body)"
                >
                  {formatPrice(price)}
                </text>
              </g>
            );
          })}

          {/* Candlesticks */}
          {cd.candles.map((candle, i) => {
            const x = 44 + i * (cd.candleWidth + cd.candleGap);
            const openY = 20 + ((cd.chartMax - candle.open) / cd.chartRange) * cd.chartHeight;
            const closeY = 20 + ((cd.chartMax - candle.close) / cd.chartRange) * cd.chartHeight;
            const highY = 20 + ((cd.chartMax - candle.high) / cd.chartRange) * cd.chartHeight;
            const lowY = 20 + ((cd.chartMax - candle.low) / cd.chartRange) * cd.chartHeight;

            const isBullish = candle.close >= candle.open;
            const color = isBullish ? bullColor : bearColor;
            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.max(Math.abs(closeY - openY), 1);

            return (
              <g key={`candle-${i}`}>
                {/* Wick */}
                <line
                  x1={x + cd.candleWidth / 2}
                  y1={highY}
                  x2={x + cd.candleWidth / 2}
                  y2={lowY}
                  stroke={color}
                  strokeWidth={1}
                />
                {/* Body */}
                <rect
                  x={x}
                  y={bodyTop}
                  width={cd.candleWidth}
                  height={bodyHeight}
                  fill={color}
                  rx={1}
                  opacity={0.9}
                />
              </g>
            );
          })}

          {/* X-axis labels */}
          {cd.candles
            .filter((_, i) => i % 4 === 0)
            .map((candle, i) => {
              const originalIndex = i * 4;
              const x = 44 + originalIndex * (cd.candleWidth + cd.candleGap) + cd.candleWidth / 2;
              return (
                <text
                  key={`xlabel-${i}`}
                  x={x}
                  y={cd.chartHeight + 35}
                  textAnchor="middle"
                  className="text-[10px]"
                  fill="oklch(var(--foreground-500))"
                  fontFamily="var(--font-body)"
                >
                  {candle.time}
                </text>
              );
            })}
        </svg>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-8 mt-5 pt-4 border-t border-background-200/40">
        <div>
          <span className="text-[11px] text-foreground-500 block">24h Volume</span>
          <span className="text-sm font-semibold text-foreground-900 font-heading">
            $34.2B
          </span>
        </div>
        <div>
          <span className="text-[11px] text-foreground-500 block">24h High</span>
          <span className="text-sm font-semibold text-foreground-900 font-heading">
            {formatPrice(Math.max(...cd.candles.map((c) => c.high)))}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-foreground-500 block">24h Low</span>
          <span className="text-sm font-semibold text-foreground-900 font-heading">
            {formatPrice(Math.min(...cd.candles.map((c) => c.low)))}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-foreground-500 block">Market Cap</span>
          <span className="text-sm font-semibold text-foreground-900 font-heading">
            $1.91T
          </span>
        </div>
        <div>
          <span className="text-[11px] text-foreground-500 block">Vol / MCap</span>
          <span className="text-sm font-semibold text-green-400 font-heading">
            1.79%
          </span>
        </div>
      </div>
    </div>
  );
}