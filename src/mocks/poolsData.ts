export interface Pool {
  id: number;
  pair: string;
  token0: string;
  token0Symbol: string;
  token1: string;
  token1Symbol: string;
  chain: string;
  chainId: string;
  dex: string;
  feeTier: string;
  tvl: number;
  tvlChange24h: number;
  liquidity: number;
  liquidityChange24h: number;
  volume24h: number;
  volumeChange24h: number;
  apr: number;
  aprChange24h: number;
  txns24h: number;
  txnsChange24h: number;
  traders24h: number;
  tradersChange24h: number;
  avgTxnSize: number;
  status: 'Healthy' | 'Low Data';
  aprReliable: boolean;
  poolAddress: string;
  created: string;
}

export interface PoolDetails {
  pool: Pool;
  token0Reserve: number;
  token1Reserve: number;
  token0ReserveUsd: number;
  token1ReserveUsd: number;
  token0Allocation: number;
  token1Allocation: number;
  poolTVL: number;
  poolVolume: number;
  poolAPR: number;
  poolStatus: string;
  positionValue: number;
  shareOfPool: string;
  hasExposure: boolean;
  description: string;
  depth: 'Deep' | 'Moderate' | 'Shallow';
  activity: 'High' | 'Moderate' | 'Low';
  dataConfidence: 'High' | 'Moderate' | 'Low';
  lpExposure: { token0Amount: string; token1Amount: string; token0Usd: string; token1Usd: string; poolShare: string; lastUpdated: string } | null;
  volume24hHigh: number;
  volume24hLow: number;
}

export interface ActivityPoint {
  time: string;
  volume: number;
  liquidity: number;
}

export const globalPoolStats = {
  totalLiquidity: 182.4,
  volume24h: 48.6,
  activePools: 148,
  activeTraders: 12400,
  tvlChange24h: 2.16,
  volumeChange24h: 2.16,
};

export const pools: Pool[] = [
  {
    id: 1,
    pair: 'ETH / USDC',
    token0: 'Ethereum',
    token0Symbol: 'ETH',
    token1: 'USD Coin',
    token1Symbol: 'USDC',
    chain: 'Base',
    chainId: 'base',
    dex: 'Uniswap V3',
    feeTier: '0.3%',
    tvl: 28.4,
    tvlChange24h: 3.21,
    liquidity: 14.2,
    liquidityChange24h: 2.11,
    volume24h: 18.6,
    volumeChange24h: 8.45,
    apr: 12.4,
    aprChange24h: 1.2,
    txns24h: 12432,
    txnsChange24h: 8.12,
    traders24h: 6200,
    tradersChange24h: 5.44,
    avgTxnSize: 440,
    status: 'Healthy',
    aprReliable: true,
    poolAddress: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8',
    created: 'Mar 12, 2024',
  },
  {
    id: 2,
    pair: 'ETH / USDT',
    token0: 'Ethereum',
    token0Symbol: 'ETH',
    token1: 'Tether',
    token1Symbol: 'USDT',
    chain: 'Base',
    chainId: 'base',
    dex: 'Uniswap V3',
    feeTier: '0.05%',
    tvl: 18.1,
    tvlChange24h: 1.45,
    liquidity: 9.05,
    liquidityChange24h: 0.95,
    volume24h: 12.4,
    volumeChange24h: 6.21,
    apr: 8.6,
    aprChange24h: 0.55,
    txns24h: 9231,
    txnsChange24h: 4.21,
    traders24h: 4800,
    tradersChange24h: 3.12,
    avgTxnSize: 380,
    status: 'Healthy',
    aprReliable: true,
    poolAddress: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8',
    created: 'Mar 15, 2024',
  },
  {
    id: 3,
    pair: 'WBTC / ETH',
    token0: 'Wrapped Bitcoin',
    token0Symbol: 'WBTC',
    token1: 'Ethereum',
    token1Symbol: 'ETH',
    chain: 'Base',
    chainId: 'base',
    dex: 'Uniswap V3',
    feeTier: '0.3%',
    tvl: 11.2,
    tvlChange24h: -0.45,
    liquidity: 5.6,
    liquidityChange24h: -0.22,
    volume24h: 7.8,
    volumeChange24h: -1.12,
    apr: 0,
    aprChange24h: 0,
    txns24h: 1432,
    txnsChange24h: -0.75,
    traders24h: 3100,
    tradersChange24h: -1.25,
    avgTxnSize: 520,
    status: 'Low Data',
    aprReliable: false,
    poolAddress: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8',
    created: 'Mar 20, 2024',
  },
  {
    id: 4,
    pair: 'MON / USDC',
    token0: 'Monad',
    token0Symbol: 'MON',
    token1: 'USD Coin',
    token1Symbol: 'USDC',
    chain: 'Monad',
    chainId: 'monad',
    dex: 'Uniswap V3',
    feeTier: '0.3%',
    tvl: 6.8,
    tvlChange24h: 2.45,
    liquidity: 3.4,
    liquidityChange24h: 1.22,
    volume24h: 5.2,
    volumeChange24h: 3.15,
    apr: 18.2,
    aprChange24h: 4.5,
    txns24h: 2112,
    txnsChange24h: 2.31,
    traders24h: 1800,
    tradersChange24h: 1.45,
    avgTxnSize: 245,
    status: 'Healthy',
    aprReliable: true,
    poolAddress: '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8',
    created: 'Apr 02, 2024',
  },
  {
    id: 5,
    pair: 'BRETT / ETH',
    token0: 'Brett',
    token0Symbol: 'BRETT',
    token1: 'Ethereum',
    token1Symbol: 'ETH',
    chain: 'Base',
    chainId: 'base',
    dex: 'Uniswap V3',
    feeTier: '1%',
    tvl: 3.2,
    tvlChange24h: -2.11,
    liquidity: 1.6,
    liquidityChange24h: -1.05,
    volume24h: 2.1,
    volumeChange24h: -4.32,
    apr: 0,
    aprChange24h: 0,
    txns24h: 845,
    txnsChange24h: -3.21,
    traders24h: 620,
    tradersChange24h: -2.11,
    avgTxnSize: 195,
    status: 'Low Data',
    aprReliable: false,
    poolAddress: '0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1',
    created: 'May 18, 2024',
  },
  {
    id: 6,
    pair: 'USDC / DAI',
    token0: 'USD Coin',
    token0Symbol: 'USDC',
    token1: 'Dai',
    token1Symbol: 'DAI',
    chain: 'Monad',
    chainId: 'monad',
    dex: 'Uniswap V3',
    feeTier: '0.01%',
    tvl: 4.8,
    tvlChange24h: -0.35,
    liquidity: 4.8,
    liquidityChange24h: -0.18,
    volume24h: 2.5,
    volumeChange24h: 0.21,
    apr: 1.5,
    aprChange24h: -0.08,
    txns24h: 432,
    txnsChange24h: -0.12,
    traders24h: 280,
    tradersChange24h: -0.05,
    avgTxnSize: 580,
    status: 'Low Data',
    aprReliable: false,
    poolAddress: '0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8',
    created: 'Apr 08, 2024',
  },
  {
    id: 7,
    pair: 'NTK / MON',
    token0: 'Nektar',
    token0Symbol: 'NTK',
    token1: 'Monad',
    token1Symbol: 'MON',
    chain: 'Monad',
    chainId: 'monad',
    dex: 'Uniswap V3',
    feeTier: '1%',
    tvl: 0.048,
    tvlChange24h: -8.21,
    liquidity: 0.024,
    liquidityChange24h: -4.10,
    volume24h: 0.0042,
    volumeChange24h: -6.45,
    apr: 0,
    aprChange24h: 0,
    txns24h: 12,
    txnsChange24h: -2.50,
    traders24h: 8,
    tradersChange24h: -1.10,
    avgTxnSize: 35,
    status: 'Low Data',
    aprReliable: false,
    poolAddress: '0x8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a',
    created: 'Jun 02, 2024',
  },
];

export const getPoolDetails = (poolId: string): PoolDetails | null => {
  const pool = pools.find((p) => p.id === Number(poolId) || `${p.token0Symbol.toLowerCase()}-${p.token1Symbol.toLowerCase()}` === poolId);
  if (!pool) return null;

  // Per-pool specific reserve and pricing data
  const config: Record<number, { token0Reserve: number; token1Reserve: number; token0Price: number; token1Price: number; positionValue: number; shareOfPool: string; hasExposure: boolean; description: string; depth: 'Deep' | 'Moderate' | 'Shallow'; activity: 'High' | 'Moderate' | 'Low'; dataConfidence: 'High' | 'Moderate' | 'Low'; lpExposure: { token0Amount: string; token1Amount: string; token0Usd: string; token1Usd: string; poolShare: string; lastUpdated: string } | null; volume24hHigh: number; volume24hLow: number; }> = {
    1: {
      token0Reserve: 5714, token1Reserve: 13200000, token0Price: 3842.50, token1Price: 1.00,
      positionValue: 2480, shareOfPool: '0.0087%', hasExposure: true,
      description: `ETH / USDC is the deepest liquidity pair on Base, powered by Uniswap V3 concentrated liquidity. With a 0.3% fee tier, it captures significant swap volume from retail and institutional traders. The pool maintains healthy reserves and shows consistent fee generation.`,
      depth: 'Deep', activity: 'High', dataConfidence: 'High',
      lpExposure: { token0Amount: '0.48 ETH', token1Amount: '1,244 USDC', token0Usd: '$1,844', token1Usd: '$636', poolShare: '0.0087%', lastUpdated: '2 min ago' },
      volume24hHigh: 9.2, volume24hLow: 3.4,
    },
    2: {
      token0Reserve: 1823.45, token1Reserve: 4823891.23, token0Price: 3842.50, token1Price: 1.00,
      positionValue: 0, shareOfPool: '0%', hasExposure: false,
      description: `ETH / USDT is a high-volume stable pair on Base with a competitive 0.05% fee tier. This pool attracts arbitrageurs and high-frequency traders seeking minimal swap costs. Liquidity depth is moderate but sufficient for most trade sizes.`,
      depth: 'Moderate', activity: 'High', dataConfidence: 'High',
      lpExposure: null,
      volume24hHigh: 14.1, volume24hLow: 10.2,
    },
    3: {
      token0Reserve: 18.42, token1Reserve: 234.56, token0Price: 68420.00, token1Price: 3842.50,
      positionValue: 0, shareOfPool: '0%', hasExposure: false,
      description: `WBTC / ETH is a major cross-asset pair connecting Bitcoin exposure to the Ethereum ecosystem on Base. APR data is unreliable due to inconsistent fee reporting across protocol aggregators. Pool analytics remain available for TVL, volume, and liquidity metrics.`,
      depth: 'Deep', activity: 'Moderate', dataConfidence: 'Moderate',
      lpExposure: null,
      volume24hHigh: 9.5, volume24hLow: 6.1,
    },
    4: {
      token0Reserve: 52138.45, token1Reserve: 112409.32, token0Price: 2.16, token1Price: 1.00,
      positionValue: 0, shareOfPool: '0%', hasExposure: false,
      description: `MON / USDC is the primary stable pair for Monad's native token. With a 0.3% fee tier and growing adoption, it offers strong yield for LPs. Volume has been trending upward as Monad ecosystem expands.`,
      depth: 'Deep', activity: 'High', dataConfidence: 'High',
      lpExposure: null,
      volume24hHigh: 6.2, volume24hLow: 4.1,
    },
    5: {
      token0Reserve: 2150000, token1Reserve: 38.5, token0Price: 0.083, token1Price: 3842.50,
      positionValue: 0, shareOfPool: '0%', hasExposure: false,
      description: `BRETT / ETH is a memecoin liquidity pool on Base. The 1% fee tier reflects higher volatility and risk. Volume is sporadic and liquidity can be thin. Exercise caution when trading this pair.`,
      depth: 'Shallow', activity: 'Low', dataConfidence: 'Low',
      lpExposure: null,
      volume24hHigh: 3.8, volume24hLow: 1.2,
    },
    6: {
      token0Reserve: 3740122.50, token1Reserve: 3740122.50, token0Price: 1.00, token1Price: 1.00,
      positionValue: 0, shareOfPool: '0%', hasExposure: false,
      description: `USDC / DAI is a stablecoin-to-stablecoin pool with the lowest 0.01% fee tier. Deep liquidity and minimal slippage make it ideal for stablecoin conversions. APR is marginal but consistent.`,
      depth: 'Deep', activity: 'Moderate', dataConfidence: 'Moderate',
      lpExposure: null,
      volume24hHigh: 2.9, volume24hLow: 2.1,
    },
    7: {
      token0Reserve: 680429, token1Reserve: 11080, token0Price: 0.0045, token1Price: 2.16,
      positionValue: 0, shareOfPool: '0%', hasExposure: false,
      description: `NTK / MON is a low-liquidity pair on Monad. The 1% fee tier reflects the pool's early stage and high volatility risk. Trades may experience significant price impact. Review route and quote carefully before trading.`,
      depth: 'Shallow', activity: 'Low', dataConfidence: 'Low',
      lpExposure: null,
      volume24hHigh: 0.005, volume24hLow: 0.0032,
    },
  };

  const c = config[pool.id];
  if (!c) return null;

  const token0ReserveUsd = c.token0Reserve * c.token0Price;
  const token1ReserveUsd = c.token1Reserve * c.token1Price;
  const totalReserve = token0ReserveUsd + token1ReserveUsd;
  const token0Allocation = Number(((token0ReserveUsd / totalReserve) * 100).toFixed(2));
  const token1Allocation = Number((100 - token0Allocation).toFixed(2));

  return {
    pool,
    token0Reserve: c.token0Reserve,
    token1Reserve: c.token1Reserve,
    token0ReserveUsd,
    token1ReserveUsd,
    token0Allocation,
    token1Allocation,
    poolTVL: pool.tvl,
    poolVolume: pool.volume24h,
    poolAPR: pool.apr,
    poolStatus: pool.status === 'Healthy' ? 'Sufficient Liquidity' : 'Limited Data',
    positionValue: c.positionValue,
    shareOfPool: c.shareOfPool,
    hasExposure: c.hasExposure,
    description: c.description,
    depth: c.depth,
    activity: c.activity,
    dataConfidence: c.dataConfidence,
    lpExposure: c.lpExposure,
    volume24hHigh: c.volume24hHigh,
    volume24hLow: c.volume24hLow,
  };
};

export const getActivityData = (poolId: string): ActivityPoint[] => {
  const pool = pools.find((p) => p.id === Number(poolId) || `${p.token0Symbol.toLowerCase()}-${p.token1Symbol.toLowerCase()}` === poolId);
  const baseLiquidity = pool ? pool.liquidity : 22;
  const baseVolume = pool ? pool.volume24h : 98;

  return [
    { time: '12am', volume: baseVolume * 0.15, liquidity: baseLiquidity * 0.92 },
    { time: '3am', volume: baseVolume * 0.08, liquidity: baseLiquidity * 0.93 },
    { time: '6am', volume: baseVolume * 0.12, liquidity: baseLiquidity * 0.94 },
    { time: '9am', volume: baseVolume * 0.25, liquidity: baseLiquidity * 0.95 },
    { time: '12pm', volume: baseVolume * 0.45, liquidity: baseLiquidity * 0.96 },
    { time: '3pm', volume: baseVolume * 0.55, liquidity: baseLiquidity * 0.97 },
    { time: '6pm', volume: baseVolume * 0.42, liquidity: baseLiquidity * 0.98 },
    { time: '9pm', volume: baseVolume * 0.28, liquidity: baseLiquidity * 0.99 },
  ];
};

export const getActivityData7D = (poolId: string): ActivityPoint[] => {
  const pool = pools.find((p) => p.id === Number(poolId) || `${p.token0Symbol.toLowerCase()}-${p.token1Symbol.toLowerCase()}` === poolId);
  const baseLiquidity = pool ? pool.liquidity : 22;
  const baseVolume = pool ? pool.volume24h : 98;

  return [
    { time: 'Mon', volume: baseVolume * 0.85, liquidity: baseLiquidity * 0.88 },
    { time: 'Tue', volume: baseVolume * 0.92, liquidity: baseLiquidity * 0.90 },
    { time: 'Wed', volume: baseVolume * 0.78, liquidity: baseLiquidity * 0.91 },
    { time: 'Thu', volume: baseVolume * 1.05, liquidity: baseLiquidity * 0.93 },
    { time: 'Fri', volume: baseVolume * 1.15, liquidity: baseLiquidity * 0.95 },
    { time: 'Sat', volume: baseVolume * 0.72, liquidity: baseLiquidity * 0.96 },
    { time: 'Sun', volume: baseVolume * 0.68, liquidity: baseLiquidity * 0.97 },
  ];
};

export const getActivityData30D = (poolId: string): ActivityPoint[] => {
  const pool = pools.find((p) => p.id === Number(poolId) || `${p.token0Symbol.toLowerCase()}-${p.token1Symbol.toLowerCase()}` === poolId);
  const baseLiquidity = pool ? pool.liquidity : 22;
  const baseVolume = pool ? pool.volume24h : 98;

  return Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const vol = baseVolume * (0.5 + Math.sin(i * 0.3) * 0.3 + Math.random() * 0.2);
    const liq = baseLiquidity * (0.85 + i * 0.005);
    return { time: `${day}`, volume: vol, liquidity: liq };
  });
};

export const getActivityData1H = (poolId: string): ActivityPoint[] => {
  const pool = pools.find((p) => p.id === Number(poolId) || `${p.token0Symbol.toLowerCase()}-${p.token1Symbol.toLowerCase()}` === poolId);
  const baseLiquidity = pool ? pool.liquidity : 22;
  const baseVolume = pool ? pool.volume24h / 24 : 4;

  return [
    { time: '0m', volume: baseVolume * 0.12, liquidity: baseLiquidity * 0.985 },
    { time: '5m', volume: baseVolume * 0.18, liquidity: baseLiquidity * 0.986 },
    { time: '10m', volume: baseVolume * 0.22, liquidity: baseLiquidity * 0.987 },
    { time: '15m', volume: baseVolume * 0.35, liquidity: baseLiquidity * 0.988 },
    { time: '20m', volume: baseVolume * 0.28, liquidity: baseLiquidity * 0.989 },
    { time: '25m', volume: baseVolume * 0.42, liquidity: baseLiquidity * 0.990 },
    { time: '30m', volume: baseVolume * 0.38, liquidity: baseLiquidity * 0.991 },
    { time: '35m', volume: baseVolume * 0.55, liquidity: baseLiquidity * 0.992 },
    { time: '40m', volume: baseVolume * 0.48, liquidity: baseLiquidity * 0.993 },
    { time: '45m', volume: baseVolume * 0.62, liquidity: baseLiquidity * 0.994 },
    { time: '50m', volume: baseVolume * 0.52, liquidity: baseLiquidity * 0.995 },
    { time: '55m', volume: baseVolume * 0.45, liquidity: baseLiquidity * 0.996 },
  ];
};

export const getActivityData6H = (poolId: string): ActivityPoint[] => {
  const pool = pools.find((p) => p.id === Number(poolId) || `${p.token0Symbol.toLowerCase()}-${p.token1Symbol.toLowerCase()}` === poolId);
  const baseLiquidity = pool ? pool.liquidity : 22;
  const baseVolume = pool ? pool.volume24h / 4 : 25;

  return [
    { time: '12am', volume: baseVolume * 0.10, liquidity: baseLiquidity * 0.94 },
    { time: '1am', volume: baseVolume * 0.08, liquidity: baseLiquidity * 0.94 },
    { time: '2am', volume: baseVolume * 0.06, liquidity: baseLiquidity * 0.935 },
    { time: '3am', volume: baseVolume * 0.05, liquidity: baseLiquidity * 0.935 },
    { time: '4am', volume: baseVolume * 0.12, liquidity: baseLiquidity * 0.94 },
    { time: '5am', volume: baseVolume * 0.18, liquidity: baseLiquidity * 0.945 },
  ];
};