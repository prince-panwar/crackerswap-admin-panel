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
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#070214]/80 border border-[#1A1A2E]/40">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D07F] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34D07F]" />
        </span>
        <span className="text-[12px] text-[#D8D1E6]">
          Data updated {lastUpdated}s ago
        </span>
      </div>
      <button
        onClick={handleRefresh}
        className="w-8 h-8 rounded-full flex items-center justify-center text-[#A69DB7] hover:text-[#F6F2EA] hover:bg-[#1A1A2E]/40 transition-all duration-200 cursor-pointer"
        aria-label="Refresh data"
        disabled={isRefreshing}
      >
        <i className={`ri-refresh-line text-sm ${isRefreshing ? 'animate-spin' : ''}`}></i>
      </button>
    </div>
  );
}