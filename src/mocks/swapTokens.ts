export interface Token {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  iconBgColor: string;
  chain: string;
  balance: number;
  price: number;
  priceChange24h: number;
  address: string;
}

export const baseTokens: Token[] = [
  {
    id: 'eth-base',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: 'ri-copper-diamond-fill',
    iconBgColor: '#627EEA',
    chain: 'Base',
    balance: 2.096,
    price: 3842.50,
    priceChange24h: 2.14,
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  },
  {
    id: 'usdc-base',
    name: 'USD Coin',
    symbol: 'USDC',
    icon: 'ri-coin-fill',
    iconBgColor: '#2775CA',
    chain: 'Base',
    balance: 5240.00,
    price: 1.00,
    priceChange24h: 0.01,
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
  {
    id: 'usdt-base',
    name: 'Tether',
    symbol: 'USDT',
    icon: 'ri-copper-coin-fill',
    iconBgColor: '#FF6A1A',
    chain: 'Base',
    balance: 12096.00,
    price: 1.00,
    priceChange24h: -0.02,
    address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  },
  {
    id: 'wbtc-base',
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    icon: 'ri-bit-coin-fill',
    iconBgColor: '#F7931A',
    chain: 'Base',
    balance: 0.042,
    price: 68420.00,
    priceChange24h: 1.88,
    address: '0x68f180fcCe6836688e9084f035309E29Bf0A2095',
  },
  {
    id: 'weth-base',
    name: 'Wrapped Ether',
    symbol: 'WETH',
    icon: 'ri-copper-diamond-line',
    iconBgColor: '#627EEA',
    chain: 'Base',
    balance: 1.45,
    price: 3842.50,
    priceChange24h: 2.14,
    address: '0x4200000000000000000000000000000000000006',
  },
  {
    id: 'dai-base',
    name: 'Dai',
    symbol: 'DAI',
    icon: 'ri-currency-line',
    iconBgColor: '#F5AC37',
    chain: 'Base',
    balance: 850.00,
    price: 1.00,
    priceChange24h: -0.01,
    address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
  },
];

export const monadTokens: Token[] = [
  {
    id: 'mon-monad',
    name: 'Monad',
    symbol: 'MON',
    icon: 'ri-octagon-fill',
    iconBgColor: '#8B72FF',
    chain: 'Monad',
    balance: 540.35,
    price: 2.16,
    priceChange24h: -1.21,
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  },
  {
    id: 'usdc-monad',
    name: 'USD Coin',
    symbol: 'USDC',
    icon: 'ri-coin-fill',
    iconBgColor: '#2775CA',
    chain: 'Monad',
    balance: 1200.00,
    price: 1.00,
    priceChange24h: 0.01,
    address: '0xA0b86a33E644C8D2B27E0A0C8E8d8F5E2c3A4b5d',
  },
  {
    id: 'usdt-monad',
    name: 'Tether',
    symbol: 'USDT',
    icon: 'ri-copper-coin-fill',
    iconBgColor: '#FF6A1A',
    chain: 'Monad',
    balance: 800.00,
    price: 1.00,
    priceChange24h: -0.02,
    address: '0xB1c86a33E644C8D2B27E0A0C8E8d8F5E2c3A4b5d',
  },
];

export const swapTokens: Token[] = [...baseTokens, ...monadTokens];

export const chains = [
  { id: 'base', name: 'Base', description: 'Ethereum L2', icon: 'ri-base-station-fill', iconColor: '#0052FF', iconBgColor: '#0052FF' },
  { id: 'monad', name: 'Monad', description: 'EVM chain', icon: 'ri-octagon-fill', iconColor: '#8B72FF', iconBgColor: '#8B72FF' },
];