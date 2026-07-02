import { useEffect, useRef } from 'react';
import type { Token } from '@/mocks/swapTokens';

interface TransactionStatusProps {
  status: {
    stage: 'preparing' | 'confirm' | 'pending' | 'success' | 'rejected' | 'failed';
    txHash: string;
    fromToken: Token | null;
    toToken: Token | null;
    fromAmount: string;
    toAmount: string;
    chain: string;
    route: string;
    failureReason?: string;
  } | null;
  onClose: () => void;
  onTryAgain: () => void;
  onBackToSwap: () => void;
  onMakeAnother: () => void;
}

export default function TransactionStatusModal({
  status,
  onClose,
  onTryAgain,
  onBackToSwap,
  onMakeAnother,
}: TransactionStatusProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [status, onClose]);

  if (!status) return null;

  const { stage, txHash, fromToken, toToken, fromAmount, toAmount, chain, failureReason } = status;

  const getStageContent = () => {
    switch (stage) {
      case 'preparing':
        return (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full border-4 border-[#6C4DFF]/20 border-t-[#6C4DFF] animate-spin mx-auto mb-4"></div>
            <h3 className="text-[20px] font-bold text-white mb-1">Preparing transaction...</h3>
            <p className="text-[13px] text-[#A69DB7]">Building your swap request</p>
          </div>
        );
      case 'confirm':
        return (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[#6C4DFF]/10 border-2 border-[#6C4DFF]/20 flex items-center justify-center mx-auto mb-4">
              <i className="ri-lock-line text-[#6C4DFF] text-2xl"></i>
            </div>
            <h3 className="text-[20px] font-bold text-white mb-1">Confirm in your wallet</h3>
            <p className="text-[13px] text-[#A69DB7]">Review and approve the transaction to continue.</p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF6A1A]/10 border border-[#FF6A1A]/20">
              <div className="w-2 h-2 rounded-full bg-[#FF7A22] animate-pulse"></div>
              <span className="text-[12px] text-[#FF7A22] font-medium">Waiting for wallet signature...</span>
            </div>
          </div>
        );
      case 'pending':
        return (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full border-4 border-[#FF6A1A]/20 border-t-[#FF7A22] animate-spin mx-auto mb-4"></div>
            <h3 className="text-[20px] font-bold text-white mb-1">Transaction submitted</h3>
            <p className="text-[13px] text-[#A69DB7]">Waiting for network confirmation</p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF6A1A]/10 border border-[#FF6A1A]/20">
              <div className="w-2 h-2 rounded-full bg-[#FF7A22] animate-pulse"></div>
              <span className="text-[12px] text-[#FF7A22] font-medium">Pending confirmation...</span>
            </div>
            <div className="mt-3 text-[12px] text-[#A69DB7] font-mono">{txHash.slice(0, 18)}...{txHash.slice(-8)}</div>
            <button
              className="mt-2 text-[12px] text-[#6C4DFF] hover:text-[#7B61FF] cursor-pointer underline"
              onClick={() => {/* mock open explorer */}}
            >
              View on Explorer
            </button>
          </div>
        );
      case 'success':
        return (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[#34D07F]/10 border-2 border-[#34D07F]/20 flex items-center justify-center mx-auto mb-4">
              <i className="ri-check-line text-[#34D07F] text-2xl"></i>
            </div>
            <h3 className="text-[20px] font-bold text-white mb-1">Swap successful</h3>
            <p className="text-[13px] text-[#A69DB7]">
              {fromAmount} {fromToken?.symbol} swapped for {toAmount} {toToken?.symbol}
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#34D07F]/10 border border-[#34D07F]/20">
              <i className="ri-check-line text-[#34D07F] text-[12px]"></i>
              <span className="text-[12px] text-[#34D07F] font-medium">Confirmed on {chain}</span>
            </div>
            <div className="mt-3 text-[12px] text-[#A69DB7] font-mono">{txHash.slice(0, 18)}...{txHash.slice(-8)}</div>
            <button
              className="mt-2 text-[12px] text-[#6C4DFF] hover:text-[#7B61FF] cursor-pointer underline"
              onClick={() => {/* mock open explorer */}}
            >
              View on Explorer
            </button>
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={onMakeAnother}
                className="flex-1 py-3.5 rounded-[16px] font-semibold text-[14px] bg-[#6C4DFF] text-white hover:bg-[#7B61FF] shadow-[0_0_20px_rgba(108,77,255,0.3)] transition-all cursor-pointer whitespace-nowrap"
              >
                Make another swap
              </button>
            </div>
          </div>
        );
      case 'rejected':
        return (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[#FF5B5B]/10 border-2 border-[#FF5B5B]/20 flex items-center justify-center mx-auto mb-4">
              <i className="ri-close-line text-[#FF5B5B] text-2xl"></i>
            </div>
            <h3 className="text-[20px] font-bold text-white mb-1">Transaction rejected</h3>
            <p className="text-[13px] text-[#A69DB7]">You cancelled the transaction in your wallet.</p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF5B5B]/10 border border-[#FF5B5B]/20">
              <i className="ri-close-circle-line text-[#FF5B5B] text-[12px]"></i>
              <span className="text-[12px] text-[#FF5B5B] font-medium">User cancelled</span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={onBackToSwap}
                className="flex-1 py-3.5 rounded-[16px] font-semibold text-[14px] bg-[#1A1A2E]/60 text-[#A69DB7] border border-[#1A1A2E]/60 hover:border-[#1A1A2E]/80 transition-all cursor-pointer whitespace-nowrap"
              >
                Back to swap
              </button>
              <button
                onClick={onTryAgain}
                className="flex-1 py-3.5 rounded-[16px] font-semibold text-[14px] bg-[#6C4DFF] text-white hover:bg-[#7B61FF] shadow-[0_0_20px_rgba(108,77,255,0.3)] transition-all cursor-pointer whitespace-nowrap"
              >
                Try again
              </button>
            </div>
          </div>
        );
      case 'failed':
        return (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[#FF5B5B]/10 border-2 border-[#FF5B5B]/20 flex items-center justify-center mx-auto mb-4">
              <i className="ri-error-warning-line text-[#FF5B5B] text-2xl"></i>
            </div>
            <h3 className="text-[20px] font-bold text-white mb-1">Swap failed</h3>
            <p className="text-[13px] text-[#A69DB7]">The transaction could not be completed. Please try again.</p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF5B5B]/10 border border-[#FF5B5B]/20">
              <i className="ri-error-warning-line text-[#FF5B5B] text-[12px]"></i>
              <span className="text-[12px] text-[#FF5B5B] font-medium">Execution error</span>
            </div>
            {failureReason && (
              <div className="mt-3 rounded-[10px] border border-[#FF5B5B]/20 bg-[#FF5B5B]/5 p-3">
                <p className="text-[12px] text-[#FF5B5B]">{failureReason}</p>
              </div>
            )}
            <div className="mt-3 text-[12px] text-[#A69DB7] font-mono">{txHash.slice(0, 18)}...{txHash.slice(-8)}</div>
            <button
              className="mt-2 text-[12px] text-[#6C4DFF] hover:text-[#7B61FF] cursor-pointer underline"
              onClick={() => {/* mock open explorer */}}
            >
              View on Explorer
            </button>
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={onBackToSwap}
                className="flex-1 py-3.5 rounded-[16px] font-semibold text-[14px] bg-[#1A1A2E]/60 text-[#A69DB7] border border-[#1A1A2E]/60 hover:border-[#1A1A2E]/80 transition-all cursor-pointer whitespace-nowrap"
              >
                Back to swap
              </button>
              <button
                onClick={onTryAgain}
                className="flex-1 py-3.5 rounded-[16px] font-semibold text-[14px] bg-[#6C4DFF] text-white hover:bg-[#7B61FF] shadow-[0_0_20px_rgba(108,77,255,0.3)] transition-all cursor-pointer whitespace-nowrap"
              >
                Try again
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={stage === 'success' || stage === 'rejected' || stage === 'failed' ? onClose : undefined} />
      <div ref={containerRef} className="relative w-full sm:w-[400px] bg-[#0A0A1A] rounded-t-2xl sm:rounded-[20px] border border-[#1A1A2E]/60 flex flex-col max-h-[90vh]">
        <div className="p-5">
          {getStageContent()}
        </div>
      </div>
    </div>
  );
}