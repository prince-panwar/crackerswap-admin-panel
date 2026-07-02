import { useState, useMemo, useCallback } from 'react';
import type { Token } from '@/mocks/tokens';
import { tokens } from '@/mocks/tokens';
import TokenSelectModal from '@/pages/swap/components/TokenSelectModal';

export default function SwapCard() {
  const [payToken, setPayToken] = useState<Token>(tokens[0]);
  const [receiveToken, setReceiveToken] = useState<Token>(tokens[1]);
  const [payAmount, setPayAmount] = useState('');
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [slippage, setSlippage] = useState(0.5);

  const exchangeRate = useMemo(() => {
    if (!payToken || !receiveToken) return 0;
    return payToken.price / receiveToken.price;
  }, [payToken, receiveToken]);

  const receiveAmount = useMemo(() => {
    const amount = parseFloat(payAmount);
    if (isNaN(amount) || amount <= 0) return '';
    return (amount * exchangeRate * (1 - slippage / 100)).toFixed(receiveToken.symbol === 'USDC' ? 2 : 6);
  }, [payAmount, exchangeRate, receiveToken, slippage]);

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
  const hasAmount = payAmount && parseFloat(payAmount) > 0;
  const insufficient = parseFloat(payAmount) > payToken.balance;

  const priceImpact = useMemo(() => {
    const amount = parseFloat(payAmount);
    if (isNaN(amount) || amount <= 0) return 0;
    if (amount > 10000) return 0.85;
    if (amount > 5000) return 0.32;
    if (amount > 1000) return 0.12;
    return 0.05;
  }, [payAmount]);

  return (
    <>
      <div className="glass-card rounded-2xl p-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-primary-500/15 flex items-center justify-center">
            <i className="ri-swap-line text-primary-400"></i>
          </div>
          <h3 className="text-base font-heading font-bold text-foreground-950">Quick Swap</h3>
        </div>

        {/* You Pay */}
        <div className="bg-background-200/40 rounded-xl p-3.5 mb-1.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold text-foreground-500 uppercase tracking-wider">
              You Pay
            </span>
            <button
              onClick={setMaxAmount}
              className="text-[10px] font-bold text-accent-400 hover:text-accent-300 transition-colors cursor-pointer whitespace-nowrap"
            >
              MAX
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={payAmount}
              onChange={handlePayAmountChange}
              className="flex-1 bg-transparent text-xl font-heading font-semibold text-foreground-950 placeholder:text-foreground-400 outline-none border-none min-w-0"
            />
            <button
              onClick={() => setPayModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-background-300/50 hover:bg-background-300/80 border border-background-300/30 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <div className="w-6 h-6 rounded-full bg-background-400/50 flex items-center justify-center">
                <i className={`${payToken.icon} text-xs text-foreground-600`}></i>
              </div>
              <span className="text-xs font-semibold text-foreground-950">{payToken.symbol}</span>
              <i className="ri-arrow-down-s-line text-foreground-500 text-xs"></i>
            </button>
          </div>
          {hasAmount && (
            <p className="text-[10px] text-foreground-500 mt-1.5">≈ ${usdValue} USD</p>
          )}
        </div>

        {/* Swap Arrow */}
        <div className="flex justify-center -my-1.5 relative z-10">
          <button
            onClick={swapTokens}
            className="w-7 h-7 rounded-lg bg-background-300 border-2 border-background-100 hover:border-primary-400/30 flex items-center justify-center transition-all cursor-pointer"
          >
            <i className="ri-arrow-up-down-line text-foreground-500 text-xs"></i>
          </button>
        </div>

        {/* You Receive */}
        <div className="bg-background-200/40 rounded-xl p-3.5 mb-4">
          <span className="text-[10px] font-semibold text-foreground-500 uppercase tracking-wider block mb-2">
            You Receive
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={receiveAmount}
              readOnly
              placeholder="0.00"
              className="flex-1 bg-transparent text-xl font-heading font-semibold text-foreground-950 placeholder:text-foreground-400 outline-none border-none cursor-default min-w-0"
            />
            <button
              onClick={() => setReceiveModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-background-300/50 hover:bg-background-300/80 border border-background-300/30 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <div className="w-6 h-6 rounded-full bg-background-400/50 flex items-center justify-center">
                <i className={`${receiveToken.icon} text-xs text-foreground-600`}></i>
              </div>
              <span className="text-xs font-semibold text-foreground-950">{receiveToken.symbol}</span>
              <i className="ri-arrow-down-s-line text-foreground-500 text-xs"></i>
            </button>
          </div>
        </div>

        {/* Slippage */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] text-foreground-500 font-medium">Slippage</span>
          <div className="flex items-center gap-1">
            {slippagePresets.map((preset) => (
              <button
                key={preset}
                onClick={() => setSlippage(preset)}
                className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  slippage === preset
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'bg-background-200/60 text-foreground-500 hover:bg-background-200'
                }`}
              >
                {preset}%
              </button>
            ))}
          </div>
        </div>

        {/* Rate + Impact */}
        {hasAmount && (
          <div className="space-y-1.5 mb-4 px-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-foreground-500">Rate</span>
              <span className="text-foreground-800 font-medium">
                1 {payToken.symbol} ≈ {exchangeRate.toFixed(receiveToken.symbol === 'USDC' ? 2 : 6)} {receiveToken.symbol}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-foreground-500">Price Impact</span>
              <span className={`font-medium ${priceImpact > 0.5 ? 'text-red-400' : 'text-green-400'}`}>
                {priceImpact < 0.01 ? '<0.01%' : `${priceImpact}%`}
              </span>
            </div>
          </div>
        )}

        {/* Connect Wallet / Swap Button */}
        <button
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer whitespace-nowrap ${
            insufficient
              ? 'bg-red-500/20 text-red-400 border border-red-500/20 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-background-50 hover:from-primary-400 hover:to-secondary-400 active:scale-[0.98] shadow-lg shadow-primary-500/20'
          }`}
        >
          {insufficient ? 'Insufficient Balance' : hasAmount ? 'Swap Tokens' : 'Connect Wallet'}
        </button>
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