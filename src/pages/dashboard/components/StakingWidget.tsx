import { stakingStats, stakingPools } from '@/mocks/staking';

export default function StakingWidget() {
  const formatUsd = (val: number) => {
    if (val >= 1e9) return '$' + (val / 1e9).toFixed(2) + 'B';
    if (val >= 1e6) return '$' + (val / 1e6).toFixed(1) + 'M';
    if (val >= 1e3) return '$' + (val / 1e3).toFixed(1) + 'K';
    return '$' + val.toFixed(0);
  };

  const formatCrypto = (val: number, decimals = 2) => {
    return val.toLocaleString('en-US', { maximumFractionDigits: decimals });
  };

  return (
    <div className="glass-card rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-secondary-500/20 flex items-center justify-center">
          <i className="ri-stack-fill text-secondary-400"></i>
        </div>
        <h3 className="text-base font-heading font-bold text-foreground-950">Staking</h3>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-background-200/40 rounded-xl p-3">
          <span className="text-[10px] text-foreground-500 uppercase tracking-wider font-semibold block mb-1">
            Total Value Locked
          </span>
          <span className="text-lg font-heading font-bold text-foreground-950">
            {formatUsd(stakingStats.totalValueLocked)}
          </span>
        </div>
        <div className="bg-background-200/40 rounded-xl p-3">
          <span className="text-[10px] text-foreground-500 uppercase tracking-wider font-semibold block mb-1">
            Avg APR
          </span>
          <span className="text-lg font-heading font-bold text-accent-400">
            {stakingStats.averageApr}%
          </span>
        </div>
        <div className="bg-background-200/40 rounded-xl p-3">
          <span className="text-[10px] text-foreground-500 uppercase tracking-wider font-semibold block mb-1">
            Rewards Distributed
          </span>
          <span className="text-lg font-heading font-bold text-foreground-950">
            {formatUsd(stakingStats.totalRewardsDistributed)}
          </span>
        </div>
        <div className="bg-background-200/40 rounded-xl p-3">
          <span className="text-[10px] text-foreground-500 uppercase tracking-wider font-semibold block mb-1">
            Active Stakers
          </span>
          <span className="text-lg font-heading font-bold text-foreground-950">
            {stakingStats.activeStakers.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Your stakes */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-foreground-500 uppercase tracking-wider mb-3">
          Your Stakes
        </h4>
        <div className="space-y-2">
          {stakingPools
            .filter((p) => p.yourStake && p.yourStake > 0)
            .slice(0, 3)
            .map((pool) => (
              <div
                key={pool.id}
                className="flex items-center justify-between bg-background-200/30 rounded-xl px-3 py-2.5 hover:bg-background-200/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-background-300/50 flex items-center justify-center group-hover:ring-1 ring-secondary-400/30 transition-all">
                    <i className={`${pool.tokenIcon} text-sm text-foreground-600`}></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-foreground-950">{pool.token}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-accent-500/10 text-accent-400 font-semibold">
                        {pool.apr}% APR
                      </span>
                    </div>
                    <span className="text-[11px] text-foreground-500">
                      {pool.lockPeriod}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-foreground-900 font-heading block">
                    {formatCrypto(pool.yourStake!)} {pool.token}
                  </span>
                  <span className="text-[10px] text-green-400 font-medium">
                    +{formatCrypto(pool.yourRewards!)} earned
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* All pools quick view */}
      <div>
        <h4 className="text-xs font-semibold text-foreground-500 uppercase tracking-wider mb-3">
          Popular Pools
        </h4>
        <div className="space-y-1.5">
          {stakingPools.map((pool) => (
            <div
              key={pool.id}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-background-200/30 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground-900 font-heading w-8">
                  {pool.token}
                </span>
                <span className="text-[11px] text-foreground-500">{pool.lockPeriod}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-foreground-600 font-medium">
                  Min {pool.minStake} {pool.token}
                </span>
                <span className="text-sm font-bold text-accent-400 font-heading">
                  {pool.apr}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}