export interface PortfolioToken {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  iconBgColor: string;
  chain: string;
  chainColor: string;
  balance: number;
  price: number;
  value: number;
  priceChange24h: number;
  allocation: number;
  sparkline: number[];
}

export interface LPExposure {
  id: string;
  pair: string;
  token0: string;
  token0Symbol: string;
  token1: string;
  token1Symbol: string;
  chain: string;
  chainColor: string;
  dex: string;
  positionValue: number;
  shareOfPool: number;
  token0Share: number;
  token1Share: number;
  token0Amount: number;
  token1Amount: number;
  token0Value: number;
  token1Value: number;
  change24h: number;
  feeTier: string;
  poolTVL: number;
  poolAPR: number;
  poolVolume24h: number;
}

export interface PortfolioTransaction {
  id: string;
  type: 'swap' | 'approval' | 'failed' | 'pending' | 'pool_trade' | 'lp_detected';
  asset: string;
  pair: string;
  chain: string;
  chainColor: string;
  sentAmount: string;
  receivedAmount: string;
  value: number;
  status: 'success' | 'pending' | 'failed' | 'detected';
  time: string;
  txHash: string;
  from: string;
  to: string;
  gasFee: number;
  slippage?: number;
  priceImpact?: number;
  route?: string;
  failureReason?: string;
}

export const portfolioTokens: PortfolioToken[] = [
  {
    id: 'eth-port',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: 'ri-copper-diamond-fill',
    iconBgColor: '#627EEA',
    chain: 'Base',
    chainColor: '#0052FF',
    balance: 3.2432,
    price: 3842.50,
    value: 12456.10,
    priceChange24h: 2.14,
    allocation: 52.14,
    sparkline: [3760, 3790, 3820, 3800, 3830, 3845, 3842.50],
  },
  {
    id: 'usdc-port',
    name: 'USD Coin',
    symbol: 'USDC',
    icon: 'ri-coin-fill',
    iconBgColor: '#2775CA',
    chain: 'Base',
    chainColor: '#0052FF',
    balance: 2453.21,
    price: 1.00,
    value: 2453.21,
    priceChange24h: 0.01,
    allocation: 24.38,
    sparkline: [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00],
  },
  {
    id: 'usdt-port',
    name: 'Tether',
    symbol: 'USDT',
    icon: 'ri-copper-coin-fill',
    iconBgColor: '#FF6A1A',
    chain: 'Base',
    chainColor: '#0052FF',
    balance: 1420.12,
    price: 1.00,
    value: 1420.12,
    priceChange24h: -0.02,
    allocation: 12.61,
    sparkline: [1.00, 1.00, 1.00, 1.00, 0.999, 1.00, 1.00],
  },
  {
    id: 'wbtc-port',
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    icon: 'ri-bit-coin-fill',
    iconBgColor: '#F7931A',
    chain: 'Base',
    chainColor: '#0052FF',
    balance: 0.031,
    price: 68420.00,
    value: 2121.02,
    priceChange24h: 1.88,
    allocation: 8.42,
    sparkline: [67100, 67400, 67800, 68100, 68200, 68300, 68420],
  },
  {
    id: 'mon-port',
    name: 'Monad',
    symbol: 'MON',
    icon: 'ri-octagon-fill',
    iconBgColor: '#8B72FF',
    chain: 'Monad',
    chainColor: '#8B72FF',
    balance: 540.35,
    price: 2.16,
    value: 1167.15,
    priceChange24h: -1.21,
    allocation: 5.60,
    sparkline: [2.20, 2.18, 2.17, 2.16, 2.15, 2.16, 2.16],
  },
  {
    id: 'op-port',
    name: 'Optimism',
    symbol: 'OP',
    icon: 'ri-sun-foggy-fill',
    iconBgColor: '#FF0420',
    chain: 'Base',
    chainColor: '#0052FF',
    balance: 210.00,
    price: 3.12,
    value: 655.20,
    priceChange24h: 4.33,
    allocation: 3.85,
    sparkline: [2.85, 2.92, 2.98, 3.05, 3.08, 3.10, 3.12],
  },
];

export const lpExposures: LPExposure[] = [
  {
    id: 'lp-1',
    pair: 'ETH / USDC',
    token0: 'Ethereum',
    token0Symbol: 'ETH',
    token1: 'USD Coin',
    token1Symbol: 'USDC',
    chain: 'Base',
    chainColor: '#0052FF',
    dex: 'Uniswap V3',
    positionValue: 2140.82,
    shareOfPool: 0.0124,
    token0Share: 55.12,
    token1Share: 44.88,
    token0Amount: 0.307,
    token1Amount: 1180.50,
    token0Value: 1179.80,
    token1Value: 1180.50,
    change24h: 3.21,
    feeTier: '0.05%',
    poolTVL: 17264500,
    poolAPR: 18.4,
    poolVolume24h: 3420000,
  },
  {
    id: 'lp-2',
    pair: 'ETH / USDT',
    token0: 'Ethereum',
    token0Symbol: 'ETH',
    token1: 'Tether',
    token1Symbol: 'USDT',
    chain: 'Base',
    chainColor: '#0052FF',
    dex: 'Uniswap V3',
    positionValue: 980.44,
    shareOfPool: 0.0068,
    token0Share: 49.20,
    token1Share: 50.80,
    token0Amount: 0.126,
    token1Amount: 498.10,
    token0Value: 484.17,
    token1Value: 498.10,
    change24h: 1.11,
    feeTier: '0.30%',
    poolTVL: 14420000,
    poolAPR: 22.7,
    poolVolume24h: 2180000,
  },
];

export const portfolioTransactions: PortfolioTransaction[] = [
  {
    id: 'tx-1',
    type: 'swap',
    asset: 'ETH → USDC',
    pair: 'ETH / USDC',
    chain: 'Base',
    chainColor: '#0052FF',
    sentAmount: '0.45 ETH',
    receivedAmount: '1,245.32 USDC',
    value: 1245.32,
    status: 'success',
    time: '2 mins ago',
    txHash: '0x5095a40d8c2f5e3b6a7d8c9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
    from: '0x7b9D5E...9268',
    to: '0xDef1...C83b',
    gasFee: 3.80,
    slippage: 0.5,
    priceImpact: 0.03,
    route: 'Uniswap V3',
  },
  {
    id: 'tx-2',
    type: 'approval',
    asset: 'USDC Approval',
    pair: 'USDC',
    chain: 'Base',
    chainColor: '#0052FF',
    sentAmount: 'Unlimited',
    receivedAmount: '-',
    value: 0,
    status: 'success',
    time: '12 mins ago',
    txHash: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
    from: '0x7b9D5E...9268',
    to: '0xDef1...C83b',
    gasFee: 2.40,
  },
  {
    id: 'tx-3',
    type: 'pending',
    asset: 'USDT → ETH',
    pair: 'USDT / ETH',
    chain: 'Base',
    chainColor: '#0052FF',
    sentAmount: '500 USDT',
    receivedAmount: '0.13 ETH',
    value: 500.00,
    status: 'pending',
    time: 'Just now',
    txHash: '0xb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
    from: '0x7b9D5E...9268',
    to: '0xDef1...C83b',
    gasFee: 3.20,
    slippage: 0.5,
    route: 'Uniswap V3',
  },
  {
    id: 'tx-4',
    type: 'failed',
    asset: 'MON → USDC',
    pair: 'MON / USDC',
    chain: 'Monad',
    chainColor: '#8B72FF',
    sentAmount: '250 MON',
    receivedAmount: '540 USDC',
    value: 540.00,
    status: 'failed',
    time: '1 hour ago',
    txHash: '0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    from: '0x7b9D5E...9268',
    to: '0xDef1...C83b',
    gasFee: 2.80,
    slippage: 0.5,
    route: 'CrackerSwap',
    failureReason: 'Transaction reverted due to price movement. Try again with updated slippage.',
  },
  {
    id: 'tx-5',
    type: 'pool_trade',
    asset: 'ETH / USDC',
    pair: 'ETH / USDC',
    chain: 'Base',
    chainColor: '#0052FF',
    sentAmount: 'Pool execution',
    receivedAmount: '-',
    value: 1240.50,
    status: 'success',
    time: 'Yesterday',
    txHash: '0xd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
    from: '0x7b9D5E...9268',
    to: '0xDef1...C83b',
    gasFee: 4.10,
    route: 'Uniswap V3',
  },
  {
    id: 'tx-6',
    type: 'lp_detected',
    asset: 'ETH / USDC',
    pair: 'ETH / USDC',
    chain: 'Base',
    chainColor: '#0052FF',
    sentAmount: 'Detected',
    receivedAmount: '-',
    value: 2140.82,
    status: 'detected',
    time: 'Yesterday',
    txHash: '-',
    from: '0x7b9D5E...9268',
    to: '-',
    gasFee: 0,
  },
  {
    id: 'tx-7',
    type: 'swap',
    asset: 'WBTC → USDC',
    pair: 'WBTC / USDC',
    chain: 'Base',
    chainColor: '#0052FF',
    sentAmount: '0.008 WBTC',
    receivedAmount: '547.36 USDC',
    value: 547.36,
    status: 'success',
    time: '2 days ago',
    txHash: '0xe5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
    from: '0x7b9D5E...9268',
    to: '0xDef1...C83b',
    gasFee: 3.60,
    slippage: 0.5,
    route: 'Uniswap V3',
  },
  {
    id: 'tx-8',
    type: 'swap',
    asset: 'ETH → OP',
    pair: 'ETH / OP',
    chain: 'Base',
    chainColor: '#0052FF',
    sentAmount: '0.12 ETH',
    receivedAmount: '148.16 OP',
    value: 461.06,
    status: 'success',
    time: '3 days ago',
    txHash: '0xf6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
    from: '0x7b9D5E...9268',
    to: '0xDef1...C83b',
    gasFee: 3.90,
    slippage: 0.5,
    route: 'Uniswap V3',
  },
  {
    id: 'tx-9',
    type: 'approval',
    asset: 'ETH Approval',
    pair: 'ETH',
    chain: 'Base',
    chainColor: '#0052FF',
    sentAmount: 'Unlimited',
    receivedAmount: '-',
    value: 0,
    status: 'success',
    time: '3 days ago',
    txHash: '0xa7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
    from: '0x7b9D5E...9268',
    to: '0xDef1...C83b',
    gasFee: 2.10,
  },
  {
    id: 'tx-10',
    type: 'failed',
    asset: 'OP → ETH',
    pair: 'OP / ETH',
    chain: 'Base',
    chainColor: '#0052FF',
    sentAmount: '50 OP',
    receivedAmount: '0.04 ETH',
    value: 156.00,
    status: 'failed',
    time: '4 days ago',
    txHash: '0xb8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7',
    from: '0x7b9D5E...9268',
    to: '0xDef1...C83b',
    gasFee: 2.60,
    route: 'Uniswap V3',
    failureReason: 'Insufficient output amount.',
  },
  {
    id: 'tx-11',
    type: 'swap',
    asset: 'USDC → MON',
    pair: 'USDC / MON',
    chain: 'Monad',
    chainColor: '#8B72FF',
    sentAmount: '300 USDC',
    receivedAmount: '138.89 MON',
    value: 300.00,
    status: 'success',
    time: '5 days ago',
    txHash: '0xc9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
    from: '0x7b9D5E...9268',
    to: '0xDef1...C83b',
    gasFee: 3.40,
    slippage: 0.5,
    route: 'CrackerSwap',
  },
  {
    id: 'tx-12',
    type: 'swap',
    asset: 'ETH → USDT',
    pair: 'ETH / USDT',
    chain: 'Base',
    chainColor: '#0052FF',
    sentAmount: '0.2 ETH',
    receivedAmount: '768.50 USDT',
    value: 768.50,
    status: 'success',
    time: '6 days ago',
    txHash: '0xd0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9',
    from: '0x7b9D5E...9268',
    to: '0xDef1...C83b',
    gasFee: 3.70,
    slippage: 0.5,
    route: 'Uniswap V3',
  },
  {
    id: 'tx-13',
    type: 'swap',
    asset: 'MON → USDC',
    pair: 'MON / USDC',
    chain: 'Monad',
    chainColor: '#8B72FF',
    sentAmount: '100 MON',
    receivedAmount: '216 USDC',
    value: 216.00,
    status: 'success',
    time: '1 week ago',
    txHash: '0xe1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0',
    from: '0x7b9D5E...9268',
    to: '0xDef1...C83b',
    gasFee: 3.10,
    slippage: 0.5,
    route: 'CrackerSwap',
  },
  {
    id: 'tx-14',
    type: 'lp_detected',
    asset: 'ETH / USDT',
    pair: 'ETH / USDT',
    chain: 'Base',
    chainColor: '#0052FF',
    sentAmount: 'Detected',
    receivedAmount: '-',
    value: 980.44,
    status: 'detected',
    time: '1 week ago',
    txHash: '-',
    from: '0x7b9D5E...9268',
    to: '-',
    gasFee: 0,
  },
];

export const portfolioSummary = {
  totalValue: 12489.42,
  change24h: 374.18,
  change24hPct: 3.08,
  walletAddress: '0x7b9D5E0a1F2b3C4d5E6f7A8b9C0d1E2f3A4b5C9268',
  totalAssets: 6,
  lpExposure: 2140.82,
  recentActivity: 14,
  lastUpdated: '15s ago',
  network: 'All chains',
};

export const allocationData = [
  { token: 'ETH', symbol: 'ETH', color: '#627EEA', percentage: 52.14 },
  { token: 'USDC', symbol: 'USDC', color: '#2775CA', percentage: 24.38 },
  { token: 'USDT', symbol: 'USDT', color: '#FF6A1A', percentage: 12.61 },
  { token: 'WBTC', symbol: 'WBTC', color: '#F7931A', percentage: 8.42 },
  { token: 'Other', symbol: 'Other', color: '#6E667E', percentage: 2.45 },
];

export const portfolioTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'assets', label: 'Assets' },
  { id: 'lp', label: 'LP Exposure' },
  { id: 'activity', label: 'Activity' },
];