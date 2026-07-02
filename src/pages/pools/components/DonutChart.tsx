import { useMemo } from 'react';

interface DonutChartProps {
  token0: string;
  token0Symbol: string;
  token1: string;
  token1Symbol: string;
  token0Pct: number;
  token1Pct: number;
  token0Color: string;
  token1Color: string;
  totalLiquidity: string;
}

export default function DonutChart({
  token0Symbol,
  token1Symbol,
  token0Pct,
  token1Pct,
  token0Color,
  token1Color,
  totalLiquidity,
}: DonutChartProps) {
  const radius = 60;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const offset0 = (token0Pct / 100) * circumference;
  const offset1 = (token1Pct / 100) * circumference;

  const dashArray0 = `${offset0} ${circumference - offset0}`;
  const dashArray1 = `${offset1} ${circumference - offset1}`;

  return (
    <div className="flex items-center gap-6">
      <div className="relative flex-shrink-0">
        <svg width="160" height="160" viewBox="0 0 160 160" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={strokeWidth}
          />
          {/* Token 0 arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={token0Color}
            strokeWidth={strokeWidth}
            strokeDasharray={dashArray0}
            strokeDashoffset={0}
            strokeLinecap="round"
          />
          {/* Token 1 arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={token1Color}
            strokeWidth={strokeWidth}
            strokeDasharray={dashArray1}
            strokeDashoffset={-offset0}
            strokeLinecap="round"
          />
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] text-[#6E667E] uppercase tracking-wider">Total Liquidity</span>
          <span className="text-[16px] font-bold text-[#F6F2EA] mt-0.5">{totalLiquidity}</span>
        </div>
      </div>
      {/* Legend */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: token0Color }} />
          <span className="text-[13px] font-semibold text-[#F6F2EA]">{token0Symbol}</span>
          <span className="text-[13px] text-[#A69DB7] ml-auto">{token0Pct.toFixed(2)}%</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: token1Color }} />
          <span className="text-[13px] font-semibold text-[#F6F2EA]">{token1Symbol}</span>
          <span className="text-[13px] text-[#A69DB7] ml-auto">{token1Pct.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
}