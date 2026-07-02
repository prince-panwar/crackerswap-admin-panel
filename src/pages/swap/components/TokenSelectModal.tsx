import { useState, useMemo } from 'react';
import type { Token } from '@/mocks/discoveryTokens';
import { discoveryTokens } from '@/mocks/discoveryTokens';

interface TokenSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
  excludeToken?: Token | null;
  title: string;
}

export default function TokenSelectModal({
  isOpen,
  onClose,
  onSelect,
  excludeToken,
  title,
}: TokenSelectModalProps) {
  const [search, setSearch] = useState('');

  const filteredTokens = useMemo(() => {
    const query = search.toLowerCase();
    return discoveryTokens.filter((t) => {
      if (excludeToken && t.id === excludeToken.id) return false;
      return (
        t.name.toLowerCase().includes(query) ||
        t.symbol.toLowerCase().includes(query)
      );
    });
  }, [search, excludeToken]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full sm:w-[420px] max-h-[80vh] bg-[#0A0A1A] rounded-t-2xl sm:rounded-[20px] border border-[#1A1A2E]/60 flex flex-col animate-in">
        <div className="flex items-center justify-between p-5 border-b border-[#1A1A2E]/60">
          <h3 className="text-lg font-semibold text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1A1A2E]/60 hover:bg-[#1A1A2E] text-[#8B8FA3] hover:text-white transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        <div className="p-4">
          <div className="relative">
            <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B8FA3] text-base"></i>
            <input
              type="text"
              placeholder="Search by name or symbol..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-[12px] bg-[#1A1A2E]/60 border border-[#1A1A2E]/60 text-white placeholder:text-[#5A5A6E] text-sm outline-none focus:border-[#6C4DFF]/40 transition-colors"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="space-y-1">
            {filteredTokens.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-[#8B8FA3] text-sm">No tokens found</p>
              </div>
            ) : (
              filteredTokens.map((token) => {
                const handleClick = () => {
                  onSelect(token);
                  setSearch('');
                };
                return (
                  <button
                    key={token.id}
                    onClick={handleClick}
                    className="w-full flex items-center gap-3 p-3 rounded-[12px] hover:bg-[#1A1A2E]/40 transition-colors cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#2A2A4A] flex items-center justify-center group-hover:ring-1 ring-[#6C4DFF]/30 transition-all">
                      <i className={`${token.icon} text-xl text-[#8B8FA3]`}></i>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">
                          {token.symbol}
                        </span>
                        <span className="text-xs px-1.5 py-0.5 rounded-[4px] bg-[#1A1A2E]/60 text-[#8B8FA3]">
                          {token.name}
                        </span>
                      </div>
                      <p className="text-xs text-[#8B8FA3] mt-0.5">
                        ${token.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">
                        {token.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                      </p>
                      <p className="text-xs text-[#8B8FA3]">Balance</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}