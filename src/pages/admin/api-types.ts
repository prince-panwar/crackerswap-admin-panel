// Response shapes returned by the CrackerSwap backend admin API (/v1/admin/*).

export type AdminRole = 'super_admin' | 'admin';

export interface AuthedAdmin {
  id: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  isSeeded: boolean;
}

export interface LoginResponse {
  accessToken: string;
  admin: AuthedAdmin;
}

export interface AdminUserResponse {
  id: string;
  email: string;
  role: string; // 'super_admin' | 'admin'
  isActive: boolean;
  isSeeded: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HealthComponent {
  name: string;
  status: 'up' | 'down' | 'skipped';
  detail?: string;
  latencyMs?: number;
}

export interface PlatformHealth {
  status: 'ok' | 'degraded';
  checkedAt: string;
  components: HealthComponent[];
}

export interface DashboardMetrics {
  listedTokens: number;
  featuredTokens: number;
  swapVolume24hUsd: number;
  swaps24h: number;
  connectedWallets: number;
  connectedWallets24h: number;
  apiStatuses: HealthComponent[];
  generatedAt: string;
}

export interface AdminTokenResponse {
  id: string;
  chainId: number;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI: string | null;
  isVerified: boolean;
  isNative: boolean;
  isFeatured: boolean;
  featuredRank: number | null;
  marketCap: number | null;
  usdPrice: number | null;
  source: string;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedTokens {
  items: AdminTokenResponse[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TransactionResponse {
  id: string;
  chainId: number;
  txHash: string;
  walletAddress: string;
  type: string;
  status: string;
  protocol: string | null;
  tokenIn: string | null;
  tokenOut: string | null;
  amountIn: string | null;
  amountOut: string | null;
  blockNumber: string | null;
  blockTimestamp: number | null;
  gasUsed: string | null;
  gasCostUsd: number | null;
  amountInUsd: number | null;
  amountOutUsd: number | null;
  errorReason: string | null;
  submittedAt: string;
  confirmedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedTransactions {
  items: TransactionResponse[];
  total: number;
  limit: number;
  offset: number;
}

// Enum-ish helpers mirroring the backend constants.
export const TX_TYPES = [
  'SWAP',
  'WRAP',
  'UNWRAP',
  'APPROVE',
  'LP_CREATE',
  'LP_INCREASE',
  'LP_DECREASE',
  'LP_COLLECT',
  'LP_BURN',
  'UNKNOWN',
] as const;

export const TX_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'FAILED',
  'DROPPED',
] as const;

export const SUPPORTED_CHAINS = [
  { id: 8453, name: 'Base' },
  { id: 143, name: 'Monad' },
  { id: 57073, name: 'Ink' },
] as const;
