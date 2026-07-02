import { useState } from 'react';

interface SwapSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  slippage: number;
  onSlippageChange: (val: number) => void;
  deadline: number;
  onDeadlineChange: (val: number) => void;
  mevProtection: boolean;
  onMevProtectionChange: (val: boolean) => void;
  expertMode: boolean;
  onExpertModeChange: (val: boolean) => void;
}

const slippagePresets = [0.1, 0.5, 1.0];

export default function SwapSettingsModal({
  isOpen,
  onClose,
  slippage,
  onSlippageChange,
  deadline,
  onDeadlineChange,
  mevProtection,
  onMevProtectionChange,
  expertMode,
  onExpertModeChange,
}: SwapSettingsModalProps) {
  const [customSlippage, setCustomSlippage] = useState('');

  if (!isOpen) return null;

  const handleSlippagePreset = (preset: number) => {
    onSlippageChange(preset);
    setCustomSlippage('');
  };

  const handleCustomSlippageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setCustomSlippage(val);
      const num = parseFloat(val);
      if (!isNaN(num) && num > 0 && num <= 50) {
        onSlippageChange(num);
      }
    }
  };

  const isCustom = customSlippage !== '';
  const isHighSlippage = slippage > 5;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:w-[400px] bg-[#0A0A1A] rounded-t-2xl sm:rounded-[20px] border border-[#1A1A2E]/60 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-[#1A1A2E]/60">
          <h3 className="text-lg font-semibold text-white">Settings</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1A1A2E]/60 hover:bg-[#1A1A2E] text-[#A69DB7] hover:text-white transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Slippage Tolerance */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[14px] font-semibold text-white">Slippage Tolerance</span>
              <span className="text-[14px] font-medium text-[#6C4DFF]">{slippage}%</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {slippagePresets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleSlippagePreset(preset)}
                  className={`px-3 py-2 rounded-[10px] text-[13px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                    slippage === preset && !isCustom
                      ? 'bg-[#6C4DFF]/15 text-[#6C4DFF] border border-[#6C4DFF]/20'
                      : 'bg-[#1A1A2E]/60 text-[#A69DB7] border border-[#1A1A2E]/60 hover:border-[#1A1A2E]/80'
                  }`}
                >
                  {preset}%
                </button>
              ))}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Custom"
                  value={customSlippage}
                  onChange={handleCustomSlippageChange}
                  className={`w-[80px] px-3 py-2 rounded-[10px] text-[13px] font-medium outline-none border transition-colors text-center ${
                    isCustom
                      ? 'bg-[#6C4DFF]/15 text-[#6C4DFF] border-[#6C4DFF]/20'
                      : 'bg-[#1A1A2E]/60 text-[#A69DB7] border-[#1A1A2E]/60'
                  }`}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[#A69DB7]">%</span>
              </div>
            </div>
            {isHighSlippage && (
              <div className="mt-2 rounded-[10px] border border-[#FF6A1A]/20 bg-[#FF6A1A]/5 p-2.5 flex items-start gap-2">
                <i className="ri-alert-line text-[#FF7A22] text-sm mt-0.5"></i>
                <p className="text-[12px] text-[#FF7A22]">High slippage setting. Your transaction may be vulnerable to frontrunning.</p>
              </div>
            )}
            <p className="text-[12px] text-[#A69DB7] mt-2">
              Your transaction will revert if the price changes unfavorably by more than this percentage.
            </p>
          </div>

          {/* Transaction Deadline */}
          <div>
            <span className="text-[14px] font-semibold text-white block mb-2">Transaction Deadline</span>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="number"
                  value={deadline}
                  onChange={(e) => onDeadlineChange(parseInt(e.target.value) || 20)}
                  className="w-full px-4 py-2.5 rounded-[12px] bg-[#1A1A2E]/60 border border-[#1A1A2E]/60 text-white text-[14px] outline-none focus:border-[#6C4DFF]/40"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#A69DB7]">min</span>
              </div>
            </div>
          </div>

          {/* MEV Protection Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[14px] font-semibold text-white block">MEV Protection</span>
              <p className="text-[12px] text-[#A69DB7] mt-0.5">Protect against sandwich attacks</p>
            </div>
            <button
              onClick={() => onMevProtectionChange(!mevProtection)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                mevProtection ? 'bg-[#6C4DFF]' : 'bg-[#1A1A2E]'
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                mevProtection ? 'translate-x-5' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {/* Expert Mode Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[14px] font-semibold text-white block">Expert Mode</span>
              <p className="text-[12px] text-[#A69DB7] mt-0.5">Bypass high price impact warnings</p>
            </div>
            <button
              onClick={() => onExpertModeChange(!expertMode)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                expertMode ? 'bg-[#FF7A22]' : 'bg-[#1A1A2E]'
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                expertMode ? 'translate-x-5' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}