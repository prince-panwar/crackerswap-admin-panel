export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Moderator' | 'Viewer';
  status: 'Active' | 'Disabled';
  lastLogin: string;
  avatar: string;
}

export interface TokenQueueItem {
  id: string;
  tokenName: string;
  symbol: string;
  chain: string;
  contractAddress: string;
  liquidity: string;
  volume24h: string;
  dataStatus: 'Newly Detected' | 'Liquidity Detected' | 'Missing Metadata' | 'Insufficient Liquidity' | 'Ready for Review' | 'Rejected';
  detectionSource: string;
  firstDetected: string;
  reviewStatus: string;
}

export interface TokenModItem {
  id: string;
  tokenName: string;
  symbol: string;
  chain: string;
  contractAddress: string;
  liquidity: string;
  tvl: string;
  volume24h: string;
  holders: string;
  status: 'Approved' | 'Pending Review' | 'Hidden' | 'Flagged' | 'Insufficient Data';
  dataConfidence: 'High' | 'Medium' | 'Low';
  lastUpdated: string;
  logo: string;
  description: string;
  website: string;
  twitter: string;
  telegram: string;
  tags: string[];
}

export interface FeaturedToken {
  id: string;
  rank: number;
  tokenName: string;
  symbol: string;
  chain: string;
  label: string;
  status: string;
  startDate: string;
  endDate: string;
  contractAddress: string;
}

export interface MonitoringService {
  id: string;
  name: string;
  category: string;
  status: 'Healthy' | 'Degraded' | 'Delayed' | 'Failed' | 'Running' | 'Completed';
  latency: string;
  lastChecked: string;
  progress?: string;
}

export interface SystemEvent {
  id: string;
  timestamp: string;
  type: string;
  message: string;
  severity: 'Info' | 'Warning' | 'Error' | 'Critical';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  admin: string;
  role: string;
  action: string;
  entity: string;
  entityType: string;
  previousValue: string;
  newValue: string;
  ipDevice: string;
  status: string;
  reason: string;
}

export interface AdminSettings {
  discovery: {
    tokenListingThreshold: string;
    autoHideThreshold: string;
    requireLogoVerification: boolean;
    minimumDataConfidence: string;
  };
  featured: {
    maxSlots: number;
    maxPerChain: number;
    autoRotateEnabled: boolean;
    rotationIntervalHours: number;
  };
  maintenance: {
    bannerEnabled: boolean;
    bannerText: string;
    bannerType: string;
  };
  data: {
    refreshIntervalSeconds: number;
    staleThresholdSeconds: number;
    cacheTtlMinutes: number;
  };
  notifications: {
    newTokenIngestion: boolean;
    tokenFlagged: boolean;
    syncJobDelayed: boolean;
    quoteServiceDegraded: boolean;
    adminActionRequired: boolean;
  };
}