import Sidebar from '@/components/feature/Sidebar';
import CandlestickChart from '@/components/feature/CandlestickChart';
import TrendingTokens from './components/TrendingTokens';
import StakingWidget from './components/StakingWidget';
import SwapCard from './components/SwapCard';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background-50 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Primary purple glow - top right area */}
        <div className="absolute top-0 right-[20%] w-[600px] h-[500px] glow-purple opacity-50" />

        {/* Cyan glow - mid left */}
        <div className="absolute top-[40%] left-[20%] w-[500px] h-[400px] glow-cyan opacity-30" />

        {/* Violet glow - bottom right */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[450px] glow-violet opacity-40" />

        {/* Subtle purple up top */}
        <div className="absolute top-[-10%] left-[40%] w-[400px] h-[300px] glow-purple opacity-25" />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main content area - offset by sidebar width */}
      <div className="ml-[72px] flex h-screen">
        {/* Center panel - scrollable */}
        <main className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground-950 tracking-tight">
                Token Discovery
              </h1>
              <p className="text-xs text-foreground-500 mt-1">
                Real-time market data, trending tokens, and actionable insights
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-500 text-sm"></i>
                <input
                  type="text"
                  placeholder="Search tokens, pairs, or addresses..."
                  className="w-72 pl-10 pr-4 py-2.5 rounded-xl bg-background-200/50 backdrop-blur-xl border border-background-300/30 text-sm text-foreground-900 placeholder:text-foreground-500 outline-none focus:border-primary-400/30 transition-all"
                />
              </div>

              {/* Notifications */}
              <button className="relative w-10 h-10 rounded-xl bg-background-200/50 backdrop-blur-xl border border-background-300/30 flex items-center justify-center cursor-pointer hover:bg-background-200/80 transition-all">
                <i className="ri-notification-3-line text-lg text-foreground-600"></i>
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent-500 animate-pulse"></span>
              </button>

              {/* User avatar */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center cursor-pointer hover:from-primary-400 hover:to-secondary-400 transition-all nav-icon-glow">
                <i className="ri-user-3-line text-background-50 text-sm"></i>
              </div>
            </div>
          </div>

          {/* BTC/USD Chart */}
          <section className="mb-6">
            <CandlestickChart />
          </section>

          {/* Trending Tokens Table */}
          <section>
            <TrendingTokens />
          </section>
        </main>

        {/* Right panel - fixed width, scrollable */}
        <aside className="w-[380px] overflow-y-auto px-4 py-6 relative z-10 shrink-0">
          {/* Connect Wallet CTA */}
          <div className="glass-card rounded-2xl p-4 mb-4 bg-primary-500/5 border-primary-500/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center nav-icon-glow shrink-0">
                <i className="ri-wallet-3-line text-background-50 text-lg"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground-950 font-heading">
                  Connect Your Wallet
                </p>
                <p className="text-[10px] text-foreground-500 mt-0.5">
                  To start swapping, staking & earning rewards
                </p>
              </div>
              <button className="px-4 py-2 rounded-lg bg-primary-500 text-background-50 text-xs font-semibold cursor-pointer hover:bg-primary-400 transition-all whitespace-nowrap">
                Connect
              </button>
            </div>
          </div>

          {/* Swap Card */}
          <div className="mb-4">
            <SwapCard />
          </div>

          {/* Staking Widget */}
          <StakingWidget />
        </aside>
      </div>
    </div>
  );
}