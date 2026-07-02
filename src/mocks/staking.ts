export interface StakingPool {
  id: string;
  token: string;
  tokenIcon: string;
  apr: number;
  totalStaked: number;
  totalStakedUsd: number;
  rewardToken: string;
  lockPeriod: string;
  minStake: number;
  yourStake?: number;
  yourRewards?: number;
}

export interface StakingStats {
  totalValueLocked: number;
  totalRewardsDistributed: number;
  averageApr: number;
  activeStakers: number;
}

export const stakingStats: StakingStats = {
  totalValueLocked: 482500000,
  totalRewardsDistributed: 28700000,
  averageApr: 18.4,
  activeStakers: 12480,
};

export const stakingPools: StakingPool[] = [
  {
    id: 'pool-eth',
    token: 'ETH',
    tokenIcon: 'ri-bit-coin-line',
    apr: 8.2,
    totalStaked: 184200,
    totalStakedUsd: 832000000,
    rewardToken: 'ETH',
    lockPeriod: 'Flexible',
    minStake: 0.01,
    yourStake: 0.85,
    yourRewards: 0.023,
  },
  {
    id: 'pool-sol',
    token: 'SOL',
    tokenIcon: 'ri-sun-line',
    apr: 12.5,
    totalStaked: 2850000,
    totalStakedUsd: 534000000,
    rewardToken: 'SOL',
    lockPeriod: '30 Days',
    minStake: 1,
    yourStake: 22.5,
    yourRewards: 0.84,
  },
  {
    id: 'pool-usdc',
    token: 'USDC',
    tokenIcon: 'ri-coin-line',
    apr: 22.8,
    totalStaked: 48500000,
    totalStakedUsd: 48500000,
    rewardToken: 'USDC',
    lockPeriod: '90 Days',
    minStake: 100,
    yourStake: 2500,
    yourRewards: 142.50,
  },
  {
    id: 'pool-link',
    token: 'LINK',
    tokenIcon: 'ri-link',
    apr: 15.3,
    totalStaked: 4200000,
    totalStakedUsd: 79400000,
    rewardToken: 'LINK',
    lockPeriod: '60 Days',
    minStake: 10,
    yourStake: 45,
    yourRewards: 2.15,
  },
  {
    id: 'pool-uni',
    token: 'UNI',
    tokenIcon: 'ri-arrow-left-right-line',
    apr: 18.7,
    totalStaked: 8200000,
    totalStakedUsd: 77600000,
    rewardToken: 'UNI',
    lockPeriod: '30 Days',
    minStake: 20,
    yourStake: 85,
    yourRewards: 5.30,
  },
];