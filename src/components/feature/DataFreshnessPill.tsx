import { useState } from 'react';

export default function DataFreshnessPill() {
  const [lastUpdated, setLastUpdated] = useState(15);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(0);
      setIsRefreshing(false);
      setTimeout(() => {
        let seconds = 0;
        const interval = setInterval(() => {
          seconds += 1;
          setLastUpdated(seconds);
          if (seconds >= 15) clearInterval(interval);
        }, 1000);
      }, 1000);
    }, 1200);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-header-pill border border-header-pill-border">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
        </span>
        <span className="text-[12px] text-fg-secondary">
          Data updated {lastUpdated}s ago
        </span>
      </div>
      <button
        onClick={handleRefresh}
        className="w-8 h-8 rounded-full flex items-center justify-center text-fg-tertiary hover:text-fg hover:bg-surface transition-all duration-200 cursor-pointer"
        aria-label="Refresh data"
        disabled={isRefreshing}
      >
        <i className={`ri-refresh-line text-sm ${isRefreshing ? 'animate-spin' : ''}`}></i>
      </button>
    </div>
  );
}