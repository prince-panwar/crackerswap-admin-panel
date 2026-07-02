export interface PositionToken {
  id: string;
  name: string;
  symbol: string;
  chain: string;
  balance: number;
  price: number;
  value: number;
  priceChange24h: number;
  allocation: number;
  contractAddress: string;
  status: 'Active' | 'Low Data';
}

export interface PositionLPExposure {
  id: string;
  pair: string;
  token0: string;
  token0Symbol: string;
  token1: string;
  token1Symbol: string;
  chain: string;
  dex: string;
  feeTier: string;
  exposureValue: number | null;
  poolShare: string | null;
  token0Split: number;
  token1Split: number;
  token0Amount: string;
  token1Amount: string;
  token0Usd: string;
  token1Usd: string;
  poolTVL: number;
  poolAPR: number | null;
  change24h: number;
  status: 'View-only' | 'Low Data';
  poolAddress: string;
  lastUpdated: string;
  poolSlug: string;
}

export interface PositionActivity {
  id: string;
  type: 'swap' | 'approval' | 'lp_detected' | 'refresh';
  label: string;
  detail: string;
  chain: string;
  value: number;
  time: string;
}

export interface PositionsData {
  summary: {
    totalPositionValue: number;
    tokenHoldings: number;
    lpExposureValue: number;
    chains: string;
    lastUpdated: string;
  };
  walletAddress: string;
}

export const positionsData: PositionsData = {
  summary: {
    totalPositionValue: 12489.42,
    tokenHoldings: 6,
    lpExposureValue: 2140.82,
    chains: 'Base, Monad',
    lastUpdated: '15s ago',
  },
  walletAddress: '0x1F2b3C4d5E6f7A8b9C0d1E2f3A4b5C6d7e8f9A0b1c2d3e4f5a6B7c8D9hpa',
};

export const positionTokens: PositionToken[] = [
  {
    id: 'pos-eth',
    name: 'Ethereum',
    symbol: 'ETH',
    chain: 'Base',
    balance: 3.2432,
    price: 3842.50,
    value: 12456.10,
    priceChange24h: 2.14,
    allocation: 52.14,
    contractAddress: '0x7b9D5E0a1F2b3C4d5E6f7A8b9C0d1E2f3A4b5C9268',
    status: 'Active',
  },
  {
    id: 'pos-usdc',
    name: 'USD Coin',
    symbol: 'USDC',
    chain: 'Base',
    balance: 2453.21,
    price: 1.00,
    value: 2453.21,
    priceChange24h: 0.01,
    allocation: 24.38,
    contractAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    status: 'Active',
  },
  {
    id: 'pos-usdt',
    name: 'Tether',
    symbol: 'USDT',
    chain: 'Base',
    balance: 1420.12,
    price: 1.00,
    value: 1420.12,
    priceChange24h: -0.02,
    allocation: 12.61,
    contractAddress: '0xfde4C96c8593536E31F229EA8f37b2AD2699bb2',
    status: 'Active',
  },
  {
    id: 'pos-wbtc',
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    chain: 'Base',
    balance: 0.031,
    price: 68420.00,
    value: 2121.02,
    priceChange24h: 1.88,
    allocation: 8.42,
    contractAddress: '0x0555E30da8f982E3ad6aDe3Fb123B0DbC1E375FC',
    status: 'Active',
  },
  {
    id: 'pos-mon',
    name: 'Monad',
    symbol: 'MON',
    chain: 'Monad',
    balance: 540.35,
    price: 2.16,
    value: 1167.15,
    priceChange24h: -1.21,
    allocation: 5.60,
    contractAddress: '0x00000000000000000000000000000000000000AA',
    status: 'Active',
  },
];

export const positionLPExposures: PositionLPExposure[] = [
  {
    id: 'lp-1',
    pair: 'ETH / USDC',
    token0: 'Ethereum',
    token0Symbol: 'ETH',
    token1: 'USD Coin',
    token1Symbol: 'USDC',
    chain: 'Base',
    dex: 'Uniswap V3',
    feeTier: '0.3%',
    exposureValue: 2140.82,
    poolShare: '0.0124%',
    token0Split: 55.12,
    token1Split: 44.88,
    token0Amount: '0.48 ETH',
    token1Amount: '1,244 USDC',
    token0Usd: '$1,180.22',
    token1Usd: '$960.60',
    poolTVL: 28.4,
    poolAPR: 12.4,
    change24h: 3.21,
    status: 'View-only',
    poolAddress: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    lastUpdated: '2 min ago',
    poolSlug: 'eth-usdc',
  },
  {
    id: 'lp-2',
    pair: 'ETH / USDT',
    token0: 'Ethereum',
    token0Symbol: 'ETH',
    token1: 'Tether',
    token1Symbol: 'USDT',
    chain: 'Base',
    dex: 'Uniswap V3',
    feeTier: '0.05%',
    exposureValue: 980.44,
    poolShare: '0.0068%',
    token0Split: 49.20,
    token1Split: 50.80,
    token0Amount: '0.23 ETH',
    token1Amount: '498 USDT',
    token0Usd: '$482.44',
    token1Usd: '$498.00',
    poolTVL: 18.1,
    poolAPR: 8.6,
    change24h: 1.11,
    status: 'View-only',
    poolAddress: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    lastUpdated: '5 min ago',
    poolSlug: 'eth-usdt',
  },
  {
    id: 'lp-3',
    pair: 'MON / USDC',
    token0: 'Monad',
    token0Symbol: 'MON',
    token1: 'USD Coin',
    token1Symbol: 'USDC',
    chain: 'Monad',
    dex: 'Uniswap V3',
    feeTier: '0.3%',
    exposureValue: null,
    poolShare: null,
    token0Split: 0,
    token1Split: 0,
    token0Amount: 'Unavailable',
    token1Amount: 'Unavailable',
    token0Usd: '—',
    token1Usd: '—',
    poolTVL: 6.8,
    poolAPR: null,
    change24h: 0,
    status: 'Low Data',
    poolAddress: '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    lastUpdated: '—',
    poolSlug: 'mon-usdc',
  },
];

export const recentPositionActivity: PositionActivity[] = [
  {
    id: 'pa-1',
    type: 'swap',
    label: 'Swap ETH → USDC',
    detail: '0.45 ETH → 1,245.32 USDC',
    chain: 'Base',
    value: 1245.32,
    time: '2 min ago',
  },
  {
    id: 'pa-2',
    type: 'approval',
    label: 'Approval USDC',
    detail: 'Unlimited spend approved',
    chain: 'Base',
    value: 0,
    time: '12 min ago',
  },
  {
    id: 'pa-3',
    type: 'lp_detected',
    label: 'LP exposure detected',
    detail: 'ETH / USDC pool on Base',
    chain: 'Base',
    value: 2140.82,
    time: '1 hour ago',
  },
  {
    id: 'pa-4',
    type: 'refresh',
    label: 'Wallet balance refreshed',
    detail: 'All chains updated',
    chain: 'Base',
    value: 0,
    time: '2 min ago',
  },
  {
    id: 'pa-5',
    type: 'swap',
    label: 'Swap USDT → ETH',
    detail: '500 USDT → 0.13 ETH',
    chain: 'Base',
    value: 500.00,
    time: 'Just now',
  },
];