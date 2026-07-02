import type { Token } from '@/mocks/swapTokens';

interface ReviewSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  payToken: Token | null;
  receiveToken: Token | null;
  payAmount: string;
  receiveAmount: string;
  exchangeRate: number;
  minimumReceived: string;
  priceImpact: number;
  networkFee: string;
  slippage: number;
  route: string;
  gasFee: string;
  protocol: string;
}

export default function ReviewSwapModal({
  isOpen,
  onClose,
  onConfirm,
  payToken,
  receiveToken,
  payAmount,
  receiveAmount,
  exchangeRate,
  minimumReceived,
  priceImpact,
  networkFee,
  slippage,
  route,
  gasFee,
  protocol,
}: ReviewSwapModalProps) {
  if (!isOpen || !payToken || !receiveToken) return null;

  const impactColor = priceImpact > 0.5 ? 'text-[#FF5B5B]' : priceImpact > 0.2 ? 'text-[#FF7A22]' : 'text-[#34D07F]';
  const impactText = priceImpact < 0.01 ? '<0.01%' : `${priceImpact}%`;
  const payValue = (parseFloat(payAmount) * payToken.price).toFixed(2);

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:w-[420px] bg-[#0A0A1A] rounded-t-2xl sm:rounded-[20px] border border-[#1A1A2E]/60 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-[#1A1A2E]/60">
          <h3 className="text-lg font-semibold text-white">Review Swap</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1A1A2E]/60 hover:bg-[#1A1A2E] text-[#A69DB7] hover:text-white transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          {/* From */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: payToken.iconBgColor }}>
                <i className={`${payToken.icon} text-white text-lg`}></i>
              </div>
              <div>
                <p className="text-[18px] font-bold text-white">{payAmount} {payToken.symbol}</p>
                <p className="text-[13px] text-[#A69DB7]">≈ ${payValue}</p>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-[#1A1A2E] flex items-center justify-center">
              <i className="ri-arrow-down-line text-[#6C4DFF] text-sm"></i>
            </div>
          </div>

          {/* To */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: receiveToken.iconBgColor }}>
                <i className={`${receiveToken.icon} text-white text-lg`}></i>
              </div>
              <div>
                <p className="text-[18px] font-bold text-white">{receiveAmount} {receiveToken.symbol}</p>
                <p className="text-[13px] text-[#A69DB7]">≈ ${receiveAmount ? (parseFloat(receiveAmount) * receiveToken.price).toFixed(2) : '0.00'}</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#1A1A2E]/60 pt-3 space-y-2.5">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#A69DB7]">Exchange Rate</span>
              <span className="text-[#D8D1E6] font-medium">1 {payToken.symbol} = {exchangeRate.toFixed(4)} {receiveToken.symbol}</span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#A69DB7]">Minimum Received</span>
              <span className="text-[#D8D1E6] font-medium">{minimumReceived} {receiveToken.symbol}</span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#A69DB7]">Price Impact</span>
              <span className={`font-medium ${impactColor}`}>{impactText}</span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#A69DB7]">Network Fee</span>
              <span className="text-[#D8D1E6] font-medium">${networkFee}</span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#A69DB7]">Slippage</span>
              <span className="text-[#D8D1E6] font-medium">{slippage}%</span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#A69DB7]">Gas</span>
              <span className="text-[#D8D1E6] font-medium">{gasFee} {payToken.symbol}</span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#A69DB7]">Route</span>
              <span className="text-[#D8D1E6] font-medium">{route} via {protocol}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 rounded-[16px] font-semibold text-[14px] bg-[#1A1A2E]/60 text-[#A69DB7] border border-[#1A1A2E]/60 hover:border-[#1A1A2E]/80 transition-all cursor-pointer whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3.5 rounded-[16px] font-semibold text-[14px] bg-[#6C4DFF] text-white hover:bg-[#7B61FF] shadow-[0_0_20px_rgba(108,77,255,0.3)] transition-all cursor-pointer whitespace-nowrap"
            >
              Confirm Swap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}