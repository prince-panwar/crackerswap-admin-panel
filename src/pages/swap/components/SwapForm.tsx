import { useState, useMemo, useCallback } from 'react';
import type { Token } from '@/mocks/discoveryTokens';
import { discoveryTokens } from '@/mocks/discoveryTokens';
import TokenSelectModal from '@/pages/swap/components/TokenSelectModal';

export default function SwapForm() {
  const [payToken, setPayToken] = useState<Token>(discoveryTokens[0]);
  const [receiveToken, setReceiveToken] = useState<Token>(discoveryTokens[1]);
  const [payAmount, setPayAmount] = useState('');
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const [customSlippage, setCustomSlippage] = useState('');

  const exchangeRate = useMemo(() => {
    if (!payToken || !receiveToken) return 0;
    return payToken.price / receiveToken.price;
  }, [payToken, receiveToken]);

  const receiveAmount = useMemo(() => {
    const amount = parseFloat(payAmount);
    if (isNaN(amount) || amount <= 0) return '';
    return (amount * exchangeRate).toFixed(receiveToken.symbol === 'USDT' ? 2 : 6);
  }, [payAmount, exchangeRate, receiveToken]);

  const usdValue = useMemo(() => {
    const amount = parseFloat(payAmount);
    if (isNaN(amount) || amount <= 0) return '0.00';
    return (amount * payToken.price).toFixed(2);
  }, [payAmount, payToken]);

  const swapTokens = useCallback(() => {
    setPayToken(receiveToken);
    setReceiveToken(payToken);
    setPayAmount('');
  }, [payToken, receiveToken]);

  const setMaxAmount = useCallback(() => {
    setPayAmount(payToken.balance.toString());
  }, [payToken]);

  const handlePayAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setPayAmount(val);
    }
  };

  const slippagePresets = [0.1, 0.5, 1.0];

  const priceImpact = useMemo(() => {
    const amount = parseFloat(payAmount);
    if (isNaN(amount) || amount <= 0) return 0;
    if (amount > 10000) return 0.85;
    if (amount > 5000) return 0.32;
    if (amount > 1000) return 0.12;
    return 0.05;
  }, [payAmount]);

  const networkFee = useMemo(() => {
    const amount = parseFloat(payAmount);
    if (isNaN(amount) || amount <= 0) return 0;
    return (amount * payToken.price * 0.0015).toFixed(2);
  }, [payAmount, payToken]);

  const minimumReceived = useMemo(() => {
    const rAmount = parseFloat(receiveAmount);
    if (isNaN(rAmount) || rAmount <= 0) return '0';
    return (rAmount * (1 - slippage / 100)).toFixed(6);
  }, [receiveAmount, slippage]);

  const isInsufficient = parseFloat(payAmount) > payToken.balance;
  const hasAmount = payAmount && parseFloat(payAmount) > 0;

  return (
    <>
      <div className="w-full max-w-[480px] mx-auto">
        {/* Main card */}
        <div className="glass-card rounded-[20px] p-1.5 border border-[#1A1A2E]/60">
          {/* You Pay */}
          <div className="bg-[#0A0A1A]/80 rounded-[16px] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-[#8B8FA3] uppercase tracking-wider">
                You Pay
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#8B8FA3]">
                  Balance: {payToken.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </span>
                <button
                  onClick={setMaxAmount}
                  className="text-[11px] font-bold text-[#FF6A1A] hover:text-[#FF7A22] transition-colors cursor-pointer whitespace-nowrap"
                >
                  MAX
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                inputMode="decimal"
                placeholder="0.0"
                value={payAmount}
                onChange={handlePayAmountChange}
                className="flex-1 bg-transparent text-[28px] font-semibold text-white placeholder:text-[#5A5A6E] outline-none border-none min-w-0"
              />
              <button
                onClick={() => setPayModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-[12px] bg-[#1A1A2E]/60 hover:bg-[#1A1A2E]/80 border border-[#1A1A2E]/80 transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <div className="w-7 h-7 rounded-full bg-[#2A2A4A] flex items-center justify-center">
                  <i className={`${payToken.icon} text-sm text-[#8B8FA3]`}></i>
                </div>
                <span className="text-sm font-semibold text-white">{payToken.symbol}</span>
                <i className="ri-arrow-down-s-line text-[#8B8FA3] text-sm"></i>
              </button>
            </div>
            {payAmount && (
              <p className="text-[11px] text-[#8B8FA3] mt-2">≈ ${usdValue}</p>
            )}
          </div>

          {/* Swap Arrow */}
          <div className="flex justify-center -my-2.5 relative z-10">
            <button
              onClick={swapTokens}
              className="w-10 h-10 rounded-[12px] bg-[#1A1A2E] border-2 border-[#070214] hover:border-[#6C4DFF]/40 flex items-center justify-center transition-all cursor-pointer group"
            >
              <i className="ri-arrow-up-down-line text-[#8B8FA3] group-hover:text-[#6C4DFF] transition-colors text-sm"></i>
            </button>
          </div>

          {/* You Receive */}
          <div className="bg-[#0A0A1A]/80 rounded-[16px] p-4">
            <span className="text-[11px] font-semibold text-[#8B8FA3] uppercase tracking-wider block mb-3">
              You Receive
            </span>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={receiveAmount}
                readOnly
                placeholder="0.0"
                className="flex-1 bg-transparent text-[28px] font-semibold text-white placeholder:text-[#5A5A6E] outline-none border-none cursor-default min-w-0"
              />
              <button
                onClick={() => setReceiveModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-[12px] bg-[#6C4DFF]/15 hover:bg-[#6C4DFF]/20 border border-[#6C4DFF]/20 hover:border-[#6C4DFF]/30 transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <div className="w-7 h-7 rounded-full bg-[#2A2A4A] flex items-center justify-center">
                  <i className={`${receiveToken.icon} text-sm text-[#8B8FA3]`}></i>
                </div>
                <span className="text-sm font-semibold text-white">{receiveToken.symbol}</span>
                <i className="ri-arrow-down-s-line text-[#8B8FA3] text-sm"></i>
              </button>
            </div>
          </div>

          {/* Rate */}
          {hasAmount && (
            <div className="px-4 py-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#8B8FA3]">Rate</span>
                <span className="text-[#B0B0C0] font-medium">
                  1 {payToken.symbol} = {exchangeRate.toFixed(receiveToken.symbol === 'USDT' ? 2 : 6)} {receiveToken.symbol}
                </span>
              </div>
            </div>
          )}

          {/* Swap Button */}
          <div className="px-1 pb-1">
            <button
              className={`w-full py-3.5 rounded-[16px] font-semibold text-sm transition-all duration-200 cursor-pointer whitespace-nowrap ${
                isInsufficient
                  ? 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/20 cursor-not-allowed'
                  : !hasAmount
                  ? 'bg-[#6C4DFF] text-white hover:bg-[#7B61FF] shadow-[0_0_16px_rgba(108,77,255,0.3)]'
                  : 'bg-gradient-to-r from-[#FF6A1A] to-[#FF7A22] text-white shadow-[0_0_16px_rgba(255,106,26,0.3)] hover:shadow-[0_0_24px_rgba(255,106,26,0.45)]'
              }`}
            >
              {!hasAmount
                ? 'Enter an amount'
                : isInsufficient
                ? 'Insufficient balance'
                : 'Swap Tokens'}
            </button>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="mt-3 glass-card rounded-[20px] border border-[#1A1A2E]/60 overflow-hidden">
          <button
            onClick={() => setDetailsOpen(!detailsOpen)}
            className="w-full flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[#0A0A1A]/30 transition-colors"
          >
            <span className="text-sm font-medium text-[#8B8FA3]">Transaction Details</span>
            <i className={`${detailsOpen ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} text-[#8B8FA3]`}></i>
          </button>

          {detailsOpen && (
            <div className="px-4 pb-4 space-y-2.5 border-t border-[#1A1A2E]/40 pt-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#8B8FA3]">Rate</span>
                <span className="text-[#B0B0C0] font-medium">
                  1 {payToken.symbol} ≈ {exchangeRate.toFixed(receiveToken.symbol === 'USDT' ? 2 : 6)} {receiveToken.symbol}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#8B8FA3]">Slippage Tolerance</span>
                </div>
                <span className="text-[#B0B0C0] font-medium">{slippage}%</span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {slippagePresets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => { setSlippage(preset); setCustomSlippage(''); }}
                    className={`px-2.5 py-1 rounded-[8px] text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                      slippage === preset && !customSlippage
                        ? 'bg-[#FF6A1A]/15 text-[#FF7A22] border border-[#FF6A1A]/20'
                        : 'bg-[#0A0A1A]/60 text-[#8B8FA3] border border-[#1A1A2E]/60'
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
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || /^\d*\.?\d*$/.test(val)) {
                        setCustomSlippage(val);
                        const num = parseFloat(val);
                        if (!isNaN(num) && num > 0) {
                          setSlippage(num);
                        }
                      }
                    }}
                    className={`w-[72px] px-2 py-1 rounded-[8px] text-[11px] font-medium outline-none border transition-colors text-center ${
                      customSlippage
                        ? 'bg-[#FF6A1A]/15 text-[#FF7A22] border-[#FF6A1A]/20'
                        : 'bg-[#0A0A1A]/60 text-[#8B8FA3] border-[#1A1A2E]/60'
                    }`}
                  />
                  {customSlippage && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[#FF6A1A]">%</span>}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#8B8FA3]">Price Impact</span>
                <span className={`font-medium ${priceImpact > 0.5 ? 'text-[#EF4444]' : priceImpact > 0.2 ? 'text-[#FF6A1A]' : 'text-[#22C55E]'}`}>
                  {priceImpact < 0.01 ? '<0.01%' : `${priceImpact}%`}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#8B8FA3]">Network Fee</span>
                <span className="text-[#B0B0C0] font-medium">${networkFee}</span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#8B8FA3]">Route</span>
                <span className="text-[#B0B0C0] font-medium">
                  {payToken.symbol} → {receiveToken.symbol}
                </span>
              </div>

              {hasAmount && (
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#1A1A2E]/40">
                  <span className="text-[#8B8FA3]">Minimum Received</span>
                  <span className="text-[#B0B0C0] font-medium">
                    {minimumReceived} {receiveToken.symbol}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <TokenSelectModal
        isOpen={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        onSelect={(token) => {
          setPayToken(token);
          setPayModalOpen(false);
          if (token.id === receiveToken.id) {
            setReceiveToken(payToken);
          }
        }}
        excludeToken={receiveToken}
        title="Select Pay Token"
      />

      <TokenSelectModal
        isOpen={receiveModalOpen}
        onClose={() => setReceiveModalOpen(false)}
        onSelect={(token) => {
          setReceiveToken(token);
          setReceiveModalOpen(false);
          if (token.id === payToken.id) {
            setPayToken(receiveToken);
          }
        }}
        excludeToken={payToken}
        title="Select Receive Token"
      />
    </>
  );
}