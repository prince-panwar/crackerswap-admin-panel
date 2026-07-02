import { chains } from '@/mocks/swapTokens';

interface ChainSelectorProps {
  chain: string | null;
  onSelect: (chain: string) => void;
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
}

export default function ChainSelector({ chain, onSelect, dropdownOpen, setDropdownOpen }: ChainSelectorProps) {
  const selectedChain = chains.find((c) => c.id === chain);

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="liquid-glass-dropdown flex items-center gap-2 px-3 py-2 cursor-pointer"
      >
        {selectedChain ? (
          <>
            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: selectedChain.iconBgColor }}>
              <i className={`${selectedChain.icon} text-white text-[10px]`}></i>
            </div>
            <span className="text-[13px] font-medium text-white">{selectedChain.name}</span>
          </>
        ) : (
          <>
            <i className="ri-globe-line text-[#A69DB7] text-[13px]"></i>
            <span className="text-[13px] font-medium text-[#A69DB7]">Select chain</span>
          </>
        )}
        <i className={`ri-arrow-down-s-line text-[#A69DB7] text-sm transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {dropdownOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-[260px] liquid-glass-dropdown rounded-[16px] overflow-hidden border border-[#1A1A2E]/80">
          <div className="p-2">
            {chains.map((c) => {
              const isActive = c.id === chain;
              return (
                <button
                  key={c.id}
                  onClick={() => onSelect(c.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-[12px] transition-all cursor-pointer ${
                    isActive ? 'bg-[#6C4DFF]/15 border border-[#6C4DFF]/20' : 'hover:bg-[#1A1A2E]/40'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: c.iconBgColor }}>
                    <i className={`${c.icon} text-white text-sm`}></i>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold text-white">{c.name}</span>
                      {isActive && <i className="ri-check-line text-[#6C4DFF] text-sm"></i>}
                    </div>
                    <p className="text-[12px] text-[#A69DB7] mt-0.5">{c.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}