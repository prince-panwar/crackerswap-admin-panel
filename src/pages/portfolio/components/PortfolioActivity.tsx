import { useState, useMemo } from 'react';
import { portfolioTransactions } from '@/mocks/portfolioData';
import type { PortfolioTransaction } from '@/mocks/portfolioData';

interface PortfolioActivityProps {
  onViewTransaction: (tx: PortfolioTransaction) => void;
}

export default function PortfolioActivity({ onViewTransaction }: PortfolioActivityProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [chainFilter, setChainFilter] = useState('All Chains');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');

  const filtered = useMemo(() => {
    let list = [...portfolioTransactions];
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((t) =>
        t.pair.toLowerCase().includes(s) || t.txHash.toLowerCase().includes(s)
      );
    }
    if (typeFilter !== 'All') {
      list = list.filter((t) => t.type === typeFilter.toLowerCase());
    }
    if (chainFilter !== 'All Chains') {
      list = list.filter((t) => t.chain === chainFilter);
    }
    if (statusFilter !== 'All') {
      list = list.filter((t) => t.status === statusFilter.toLowerCase());
    }
    return list;
  }, [search, typeFilter, chainFilter, statusFilter, dateFilter]);

  const statusStyle = (status: string) => {
    switch (status) {
      case 'success': return { bg: 'rgba(52, 208, 127, 0.12)', color: '#34D07F', border: 'rgba(52, 208, 127, 0.15)' };
      case 'pending': return { bg: 'rgba(255, 106, 26, 0.12)', color: '#FF7A22', border: 'rgba(255, 106, 26, 0.15)' };
      case 'failed': return { bg: 'rgba(255, 91, 91, 0.12)', color: '#FF5B5B', border: 'rgba(255, 91, 91, 0.15)' };
      case 'detected': return { bg: 'rgba(108, 77, 255, 0.12)', color: '#7B61FF', border: 'rgba(108, 77, 255, 0.15)' };
      default: return { bg: 'rgba(255,255,255,0.05)', color: '#6E667E', border: 'rgba(255,255,255,0.08)' };
    }
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case 'swap': return 'ri-swap-box-line';
      case 'approval': return 'ri-shield-check-line';
      case 'failed': return 'ri-close-circle-line';
      case 'pending': return 'ri-time-line';
      case 'pool_trade': return 'ri-funds-line';
      case 'lp_detected': return 'ri-drop-line';
      default: return 'ri-exchange-line';
    }
  };

  const typeLabel = (type: string) => {
    switch (type) {
      case 'swap': return 'Swap';
      case 'approval': return 'Approval';
      case 'failed': return 'Failed';
      case 'pending': return 'Pending';
      case 'pool_trade': return 'Pool';
      case 'lp_detected': return 'LP';
      default: return type;
    }
  };

  const chains = ['All Chains', 'Base', 'Monad'];

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold text-[#F6F2EA]">Activity</h2>
          <p className="text-[11px] text-[#6E667E] mt-0.5">Review your swaps, approvals, and wallet activity on CrackerSwap.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2">
        {/* Search */}
        <div className="relative max-w-[360px]">
          <div className="relative flex items-center h-[38px] rounded-full bg-white/[0.035] border border-white/[0.07] backdrop-blur-[12px] px-4 transition-all duration-200 focus-within:border-[#6C4DFF]/20">
            <i className="ri-search-line text-[#6E667E] text-[13px] mr-2 shrink-0"></i>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by token, pair, or tx hash"
              className="flex-1 bg-transparent text-[#F6F2EA] text-[12px] placeholder:text-[#6E667E] outline-none min-w-0"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Type Filter */}
          {['All', 'Swaps', 'Approvals', 'Failed', 'Pending'].map((f) => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                typeFilter === f
                  ? 'bg-[#FF6A1A]/12 text-[#FF7A22] border border-[#FF6A1A]/20'
                  : 'bg-white/[0.04] text-[#A69DB7] border border-white/[0.07] hover:bg-white/[0.06] hover:text-[#F6F2EA]'
              }`}
            >
              {f}
            </button>
          ))}

          <span className="w-px h-4 bg-white/[0.08] mx-1 hidden sm:block"></span>

          {/* Chain Filter */}
          {chains.map((c) => (
            <button
              key={c}
              onClick={() => setChainFilter(c)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                chainFilter === c
                  ? 'bg-[#6C4DFF]/12 text-[#7B61FF] border border-[#6C4DFF]/20'
                  : 'bg-white/[0.04] text-[#A69DB7] border border-white/[0.07] hover:bg-white/[0.06] hover:text-[#F6F2EA]'
              }`}
            >
              {c}
            </button>
          ))}

          <span className="w-px h-4 bg-white/[0.08] mx-1 hidden sm:block"></span>

          {/* Status Filter */}
          {['All', 'Success', 'Pending', 'Failed'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                statusFilter === s
                  ? 'bg-white/[0.05] text-[#F6F2EA] border border-white/[0.10]'
                  : 'bg-white/[0.04] text-[#A69DB7] border border-white/[0.07] hover:bg-white/[0.06] hover:text-[#F6F2EA]'
              }`}
            >
              {s}
            </button>
          ))}

          <span className="w-px h-4 bg-white/[0.08] mx-1 hidden sm:block"></span>

          {/* Date Filter */}
          {['24H', '7D', '30D', 'All'].map((d) => (
            <button
              key={d}
              onClick={() => setDateFilter(d)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                dateFilter === d
                  ? 'bg-white/[0.05] text-[#F6F2EA] border border-white/[0.10]'
                  : 'bg-white/[0.04] text-[#A69DB7] border border-white/[0.07] hover:bg-white/[0.06] hover:text-[#F6F2EA]'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="liquid-glass-table overflow-hidden">
        <div className="relative z-10">
          <div className="hidden sm:grid gap-3 px-5 py-2.5 text-[10px] font-semibold text-[#6E667E] uppercase tracking-[0.1em]" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', gridTemplateColumns: '90px 1fr 80px 150px 90px 90px 100px 110px 80px' }}>
            <span>Type</span>
            <span>Asset / Pair</span>
            <span>Chain</span>
            <span>Amount</span>
            <span className="text-right">Value</span>
            <span className="text-right">Status</span>
            <span className="text-right">Time</span>
            <span className="text-center">Tx Hash</span>
            <span className="text-right">Action</span>
          </div>

          {filtered.map((tx) => {
            const s = statusStyle(tx.status);
            return (
              <div
                key={tx.id}
                className="table-row-glass grid gap-3 px-5 py-3 items-center group cursor-pointer"
                style={{ gridTemplateColumns: '90px 1fr 80px 150px 90px 90px 100px 110px 80px' }}
                onClick={() => onViewTransaction(tx)}
              >
                {/* Type */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: s.bg }}>
                    <i className={`${typeIcon(tx.type)} text-[11px]`} style={{ color: s.color }}></i>
                  </div>
                  <span className="text-[11px] font-medium text-[#D8D1E6]">{typeLabel(tx.type)}</span>
                </div>

                {/* Asset / Pair */}
                <div className="min-w-0">
                  <span className="text-[12px] font-medium text-[#F6F2EA] truncate block">{tx.pair}</span>
                  <span className="text-[10px] text-[#6E667E]">{tx.sentAmount}</span>
                </div>

                {/* Chain */}
                <div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-[#A69DB7] liquid-glass-badge">
                    <span className="relative z-10 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tx.chainColor }}></span>
                      {tx.chain}
                    </span>
                  </span>
                </div>

                {/* Amount */}
                <div>
                  <span className="text-[12px] text-[#D8D1E6]">
                    {tx.type === 'approval' ? tx.sentAmount : (tx.receivedAmount !== '-' ? tx.receivedAmount : tx.sentAmount)}
                  </span>
                </div>

                {/* Value */}
                <div className="text-right">
                  <span className="text-[12px] font-medium text-[#F6F2EA]">
                    {tx.value > 0 ? '$' + tx.value.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '-'}
                  </span>
                </div>

                {/* Status */}
                <div className="text-right">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-semibold" style={{ backgroundColor: s.bg, color: s.color }}>
                    {tx.status}
                  </span>
                </div>

                {/* Time */}
                <div className="text-right">
                  <span className="text-[11px] text-[#6E667E]">{tx.time}</span>
                </div>

                {/* Tx Hash */}
                <div className="text-center">
                  {tx.txHash !== '-' ? (
                    <span className="text-[10px] font-mono text-[#6E667E]">{tx.txHash.slice(0, 6)}...{tx.txHash.slice(-4)}</span>
                  ) : (
                    <span className="text-[10px] text-[#6E667E]">-</span>
                  )}
                </div>

                {/* Action */}
                <div className="flex items-center justify-end">
                  <button
                    onClick={(e) => { e.stopPropagation(); onViewTransaction(tx); }}
                    className="liquid-glass-icon-btn w-7 h-7 flex items-center justify-center text-[#A69DB7] hover:text-[#F6F2EA] transition-all cursor-pointer"
                    aria-label={`View transaction details`}
                  >
                    <i className="ri-arrow-right-line text-xs relative z-10"></i>
                  </button>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="px-5 py-12 text-center">
              <p className="text-[13px] text-[#6E667E]">No transactions found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}