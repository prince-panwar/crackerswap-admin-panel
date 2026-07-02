import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type { Token } from '@/mocks/swapTokens';
import { swapTokens, baseTokens, monadTokens } from '@/mocks/swapTokens';
import ChainSelector from './ChainSelector';
import TokenSelector from './TokenSelector';
import SwapSettingsModal from './SwapSettingsModal';
import ReviewSwapModal from './ReviewSwapModal';
import TransactionStatusModal from './TransactionStatusModal';
import ConnectWalletModal from './ConnectWalletModal';
import Toast from './Toast';

interface SwapCardProps {
  walletAddress: string | null;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  onSwapSuccess: (tx: SwapTx) => void;
}

interface SwapTx {
  id: string;
  type: 'swap';
  asset: string;
  pair: string;
  chain: string;
  sentAmount: string;
  receivedAmount: string;
  value: number;
  status: 'success';
  time: string;
  txHash: string;
  from: string;
  to: string;
  gasFee: number;
  slippage: number;
  route: string;
}

export default function SwapCard({ walletAddress, onConnectWallet, onDisconnectWallet, onSwapSuccess }: SwapCardProps) {
  const [chain, setChain] = useState<string | null>(null);
  const [chainDropdownOpen, setChainDropdownOpen] = useState(false);
  const [payToken, setPayToken] = useState<Token | null>(null);
  const [receiveToken, setReceiveToken] = useState<Token | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [payTokenOpen, setPayTokenOpen] = useState(false);
  const [receiveTokenOpen, setReceiveTokenOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const [deadline, setDeadline] = useState(20);
  const [mevProtection, setMevProtection] = useState(true);
  const [expertMode, setExpertMode] = useState(false);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [txStatus, setTxStatus] = useState<TransactionStatus | null>(null);
  const [connectOpen, setConnectOpen] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState(false);
  const [noRoute, setNoRoute] = useState(false);
  const [quoteExpired, setQuoteExpired] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [routeDetailsOpen, setRouteDetailsOpen] = useState(false);
  const [unsupportedNetwork, setUnsupportedNetwork] = useState(false);
  const [needsApproval, setNeedsApproval] = useState(false);
  const [approvalInProgress, setApprovalInProgress] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<'idle' | 'pending' | 'success' | 'rejected' | 'failed'>('idle');
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Token[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const hasAmount = payAmount && parseFloat(payAmount) > 0;

  const exchangeRate = useMemo(() => {
    if (!payToken || !receiveToken) return 0;
    return payToken.price / receiveToken.price;
  }, [payToken, receiveToken]);

  const receiveAmount = useMemo(() => {
    const amount = parseFloat(payAmount);
    if (!payToken || !receiveToken || isNaN(amount) || amount <= 0) return '';
    return (amount * exchangeRate).toFixed(receiveToken.symbol === 'USDT' || receiveToken.symbol === 'USDC' ? 2 : 6);
  }, [payAmount, exchangeRate, receiveToken, payToken]);

  const usdValue = useMemo(() => {
    const amount = parseFloat(payAmount);
    if (!payToken || isNaN(amount) || amount <= 0) return '';
    return (amount * payToken.price).toFixed(2);
  }, [payAmount, payToken]);

  const receiveUsd = useMemo(() => {
    const amount = parseFloat(receiveAmount);
    if (!receiveToken || isNaN(amount) || amount <= 0) return '';
    return (amount * receiveToken.price).toFixed(2);
  }, [receiveAmount, receiveToken]);

  const priceImpact = useMemo(() => {
    const amount = parseFloat(payAmount);
    if (!payToken || isNaN(amount) || amount <= 0) return 0;
    if (amount > 10000) return 1.16;
    if (amount > 5000) return 0.85;
    if (amount > 1000) return 0.32;
    if (amount > 500) return 0.12;
    return 0.05;
  }, [payAmount, payToken]);

  const networkFee = useMemo(() => {
    const amount = parseFloat(payAmount);
    if (!payToken || isNaN(amount) || amount <= 0) return 0;
    return (amount * payToken.price * 0.0015).toFixed(2);
  }, [payAmount, payToken]);

  const platformFee = useMemo(() => {
    const amount = parseFloat(payAmount);
    if (!payToken || isNaN(amount) || amount <= 0) return 0;
    return (amount * payToken.price * 0.001).toFixed(2);
  }, [payAmount, payToken]);

  const minimumReceived = useMemo(() => {
    const rAmount = parseFloat(receiveAmount);
    if (!receiveToken || isNaN(rAmount) || rAmount <= 0) return '0';
    return (rAmount * (1 - slippage / 100)).toFixed(receiveToken.symbol === 'USDT' || receiveToken.symbol === 'USDC' ? 2 : 6);
  }, [receiveAmount, slippage, receiveToken]);

  const gasEth = useMemo(() => {
    const amount = parseFloat(payAmount);
    if (!payToken || isNaN(amount) || amount <= 0) return '0.0001';
    const gas = (amount * payToken.price * 0.0015 / payToken.price);
    if (gas < 0.0001) return '0.0001';
    return gas.toFixed(5);
  }, [payAmount, payToken]);

  // Check balance
  useEffect(() => {
    if (payToken && hasAmount && walletAddress) {
      setInsufficientBalance(parseFloat(payAmount) > payToken.balance);
    } else {
      setInsufficientBalance(false);
    }
  }, [payToken, payAmount, walletAddress]);

  // Auto fetch quote when amount changes
  useEffect(() => {
    if (!payToken || !receiveToken || !hasAmount || !walletAddress || insufficientBalance) {
      setQuote(null);
      setNoRoute(false);
      setQuoteExpired(false);
      return;
    }
    const timer = setTimeout(() => {
      setQuoteLoading(true);
      setNoRoute(false);
      setQuoteExpired(false);
      setTimeout(() => {
        const amount = parseFloat(payAmount);
        if (payToken.symbol === 'MON' && receiveToken.symbol === 'USDC') {
          setNoRoute(true);
          setQuote(null);
        } else {
          const rate = payToken.price / receiveToken.price;
          const receiveVal = amount * rate;
          const minRecv = (receiveVal * (1 - slippage / 100)).toFixed(receiveToken.symbol === 'USDT' || receiveToken.symbol === 'USDC' ? 2 : 6);
          setQuote({
            exchangeRate: rate,
            receiveAmount: receiveVal,
            minimumReceived: minRecv,
            priceImpact: amount > 10000 ? 1.16 : amount > 5000 ? 0.85 : amount > 1000 ? 0.32 : amount > 500 ? 0.12 : 0.05,
            networkFee: (amount * payToken.price * 0.0015).toFixed(2),
            platformFee: (amount * payToken.price * 0.001).toFixed(2),
            gasFee: amount * payToken.price * 0.0015 / payToken.price,
            slippage: slippage,
            route: `${payToken.symbol} → ${payToken.symbol === 'ETH' ? 'WETH' : payToken.symbol} → ${receiveToken.symbol}`,
            protocol: 'Uniswap V3',
            routeType: 'Optimized',
          });
        }
        setQuoteLoading(false);
      }, 800);
    }, 600);
    return () => clearTimeout(timer);
  }, [payAmount, payToken, receiveToken, slippage, walletAddress, insufficientBalance]);

  // Reset quote when inputs change
  const handlePayAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setPayAmount(val);
      setQuote(null);
      setQuoteExpired(false);
      setNoRoute(false);
    }
  };

  // ---- Search token bar logic ----
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const term = searchTerm.toLowerCase();
    const tokens = chain === 'Monad' ? monadTokens : baseTokens;
    const results = tokens.filter(
      (t) =>
        t.name.toLowerCase().includes(term) ||
        t.symbol.toLowerCase().includes(term) ||
        (t.address && t.address.toLowerCase().includes(term))
    );
    setSearchResults(results);
  }, [searchTerm, chain]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearchSelect = (token: Token) => {
    if (!payToken) {
      setPayToken(token);
      setSearchTerm('');
      setSearchOpen(false);
    } else if (!receiveToken && token.id !== payToken.id) {
      setReceiveToken(token);
      setSearchTerm('');
      setSearchOpen(false);
    } else if (token.id !== payToken.id && token.id !== (receiveToken?.id || '')) {
      setReceiveToken(token);
      setSearchTerm('');
      setSearchOpen(false);
    }
    setQuote(null);
    setQuoteExpired(false);
    setNoRoute(false);
  };

  // Simulate quote expiry
  useEffect(() => {
    if (quote) {
      const timer = setTimeout(() => {
        setQuoteExpired(true);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [quote]);

  const swapTokens = useCallback(() => {
    const temp = payToken;
    setPayToken(receiveToken);
    setReceiveToken(temp);
    setPayAmount('');
    setQuote(null);
    setQuoteExpired(false);
    setNoRoute(false);
  }, [payToken, receiveToken]);

  const setMaxAmount = useCallback(() => {
    if (payToken) {
      setPayAmount(payToken.balance.toString());
    }
  }, [payToken]);

  const handlePaySelect = (token: Token) => {
    setPayToken(token);
    setPayTokenOpen(false);
    if (receiveToken && receiveToken.id === token.id) {
      setReceiveToken(null);
    }
    setQuote(null);
    setQuoteExpired(false);
    setNoRoute(false);
    setNeedsApproval(false);
  };

  const handleReceiveSelect = (token: Token) => {
    setReceiveToken(token);
    setReceiveTokenOpen(false);
    if (payToken && payToken.id === token.id) {
      setPayToken(null);
    }
    setQuote(null);
    setQuoteExpired(false);
    setNoRoute(false);
  };

  const handleChainSelect = (selectedChain: string) => {
    setChain(selectedChain);
    setChainDropdownOpen(false);
    setPayToken(null);
    setReceiveToken(null);
    setPayAmount('');
    setQuote(null);
    setQuoteExpired(false);
    setNoRoute(false);
  };

  const handleReview = () => {
    if (needsApproval) {
      // Handle approval
      setApprovalInProgress(true);
      setApprovalStatus('pending');
      setTimeout(() => {
        setApprovalStatus('success');
        setApprovalInProgress(false);
        setNeedsApproval(false);
        setToast({ message: 'Approval successful', type: 'success' });
      }, 2000);
      return;
    }
    setReviewOpen(true);
  };

  const handleConfirmSwap = () => {
    setReviewOpen(false);
    setTxStatus({
      stage: 'preparing',
      txHash: '0x8ab3e9c2d5f4a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
      fromToken: payToken,
      toToken: receiveToken,
      fromAmount: payAmount,
      toAmount: receiveAmount,
      chain: chain || 'Base',
      route: `${payToken?.symbol} → ${receiveToken?.symbol}`,
    });

    // Simulate transaction flow
    setTimeout(() => {
      setTxStatus(prev => prev ? { ...prev, stage: 'confirm' } : null);
    }, 1500);

    setTimeout(() => {
      setTxStatus(prev => prev ? { ...prev, stage: 'pending' } : null);
    }, 3500);

    // Simulate random success (90% chance) or failure
    setTimeout(() => {
      const success = Math.random() > 0.1;
      if (success) {
        setTxStatus(prev => prev ? { ...prev, stage: 'success' } : null);
        setToast({ message: 'Swap successful!', type: 'success' });
        if (payToken && receiveToken) {
          const value = parseFloat(payAmount) * payToken.price;
          const tx: SwapTx = {
            id: `tx-${Date.now()}`,
            type: 'swap',
            asset: `${payToken.symbol} → ${receiveToken.symbol}`,
            pair: `${payToken.symbol} / ${receiveToken.symbol}`,
            chain: chain || 'Base',
            sentAmount: `${payAmount} ${payToken.symbol}`,
            receivedAmount: `${receiveAmount} ${receiveToken.symbol}`,
            value: value,
            status: 'success',
            time: 'Just now',
            txHash: '0x8ab3e9c2d5f4a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
            from: walletAddress || '0x7b9...',
            to: '0xDef1...C83b',
            gasFee: parseFloat(networkFee),
            slippage: slippage,
            route: 'Uniswap V3',
          };
          onSwapSuccess(tx);
        }
      } else {
        const rejected = Math.random() > 0.5;
        setTxStatus(prev => prev ? {
          ...prev,
          stage: rejected ? 'rejected' : 'failed',
          failureReason: rejected ? 'You cancelled the transaction in your wallet.' : 'The transaction could not be completed. Please try again.',
        } : null);
      }
    }, 6000);
  };

  const handleReset = () => {
    setTxStatus(null);
    setPayAmount('');
    setQuote(null);
    setQuoteExpired(false);
    setNoRoute(false);
    setApprovalStatus('idle');
  };

  const handleTryAgain = () => {
    setTxStatus(null);
    setReviewOpen(true);
  };

  const handleConnect = () => {
    setConnectOpen(true);
  };

  const handleWalletConnect = (wallet: string) => {
    setConnectOpen(false);
    setConnectingWallet(true);
    setTimeout(() => {
      setConnectingWallet(false);
      // Mock wallet address
      const addr = '0x1F2b3C4d5E6f7A8b9C0d1E2f3A4b5C6d7e8f9A0b1c2d3e4f5a6B7c8D9e0F1a2b3c4';
      onConnectWallet();
      setToast({ message: 'Wallet connected', type: 'success' });
    }, 2000);
  };

  const handleDisconnect = () => {
    onDisconnectWallet();
    setToast({ message: 'Wallet disconnected', type: 'info' });
  };

  const handleUnsupportedNetwork = () => {
    setUnsupportedNetwork(true);
  };

  const handleSwitchNetwork = (net: string) => {
    setUnsupportedNetwork(false);
    setToast({ message: `Switched to ${net}`, type: 'success' });
  };

  // Check if needs approval
  useEffect(() => {
    if (payToken && payToken.symbol !== 'ETH' && payToken.symbol !== 'MON' && walletAddress && hasAmount) {
      setNeedsApproval(true);
    } else {
      setNeedsApproval(false);
    }
  }, [payToken, walletAddress, hasAmount]);

  const handleRefreshQuote = () => {
    setQuoteExpired(false);
    setQuoteLoading(true);
    setTimeout(() => {
      setQuoteLoading(false);
    }, 600);
  };

  // Determine available tokens
  const availableTokens = chain === 'Monad' ? monadTokens : baseTokens;

  // CTA button text
  const getCtaText = () => {
    if (!walletAddress) return 'Connect Wallet';
    if (!payToken) return 'Select token';
    if (!receiveToken) return 'Select output token';
    if (!hasAmount) return 'Enter an amount';
    if (insufficientBalance) return `Insufficient ${payToken.symbol} balance`;
    if (noRoute) return 'No route found';
    if (quoteLoading) return 'Fetching quote...';
    if (quoteExpired) return 'Quote expired';
    if (needsApproval) return `Approve ${payToken.symbol}`;
    if (priceImpact > 5) return 'High price impact';
    return 'Review Swap';
  };

  const ctaDisabled = () => {
    if (!walletAddress) return false;
    if (!payToken || !receiveToken || !hasAmount) return true;
    if (insufficientBalance) return true;
    if (noRoute) return true;
    if (quoteLoading) return true;
    if (quoteExpired) return true;
    if (priceImpact > 15 && !expertMode) return true;
    return false;
  };

  const handleCtaClick = () => {
    if (!walletAddress) {
      handleConnect();
      return;
    }
    if (quoteExpired) {
      handleRefreshQuote();
      return;
    }
    if (needsApproval) {
      handleReview();
      return;
    }
    handleReview();
  };

  return (
    <>
      <div className="w-full max-w-[460px] mx-auto">
        {/* Token Search Bar */}
        <div ref={searchRef} className="relative mb-3">
          <div className="swap-card rounded-[16px] overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3">
              <i className="ri-search-line text-[#A69DB7] text-sm shrink-0"></i>
              <input
                type="text"
                placeholder={payToken && receiveToken ? 'Search and replace output token...' : payToken ? 'Search output token...' : 'Search token by name, symbol, or address...'}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => {
                  if (searchTerm.trim()) setSearchOpen(true);
                }}
                className="flex-1 bg-transparent text-[14px] text-white placeholder:text-[#6E667E] outline-none border-none"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSearchResults([]);
                    setSearchOpen(false);
                  }}
                  className="text-[#6E667E] hover:text-[#A69DB7] cursor-pointer shrink-0"
                  aria-label="Clear search"
                >
                  <i className="ri-close-circle-fill text-sm"></i>
                </button>
              )}
            </div>
          </div>

          {/* Search Results Dropdown */}
          {searchOpen && searchTerm.trim() && (
            <div className="absolute top-full left-0 right-0 mt-1 z-50 liquid-glass rounded-[16px] border border-[#1A1A2E]/60 overflow-hidden max-h-[260px] overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map((token) => {
                  const isPay = payToken?.id === token.id;
                  const isReceive = receiveToken?.id === token.id;
                  const isSelected = isPay || isReceive;
                  return (
                    <button
                      key={token.id}
                      onClick={() => !isSelected && handleSearchSelect(token)}
                      disabled={isSelected}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-[#1A1A2E]/40'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: token.iconBgColor || '#2A2A4A' }}
                      >
                        <i className={`${token.icon} text-sm text-white`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-medium text-white">{token.symbol}</span>
                          <span className="text-[12px] text-[#A69DB7] truncate">{token.name}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="text-[11px] text-[#A69DB7] whitespace-nowrap">Selected</span>
                      )}
                      {!isSelected && chain && (
                        <span className="text-[11px] text-[#6E667E] whitespace-nowrap">{chain}</span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-6 text-center">
                  <i className="ri-search-eye-line text-[#6E667E] text-xl block mb-2"></i>
                  <p className="text-[13px] text-[#6E667E]">No tokens found for "{searchTerm}"</p>
                  {!chain && (
                    <p className="text-[12px] text-[#6E667E]/70 mt-1">Select a chain first to filter tokens</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chain + Settings row */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <ChainSelector
            chain={chain}
            onSelect={handleChainSelect}
            dropdownOpen={chainDropdownOpen}
            setDropdownOpen={setChainDropdownOpen}
          />
          <button
            onClick={() => setSettingsOpen(true)}
            className="liquid-glass-icon-btn w-9 h-9 flex items-center justify-center cursor-pointer"
            aria-label="Swap settings"
          >
            <i className="ri-settings-3-line text-[#A69DB7] text-sm"></i>
          </button>
        </div>

        {/* Main Swap Card */}
        <div className="swap-card rounded-[28px] overflow-hidden">
          <div className="relative p-5 space-y-1">
            {/* You Pay Panel */}
            <div className="swap-input-panel rounded-[20px] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-medium text-[#A69DB7] uppercase tracking-wider">
                  You Pay
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[#A69DB7]">
                    Balance: {walletAddress && payToken ? payToken.balance.toLocaleString(undefined, { maximumFractionDigits: 6 }) : '—'} {payToken?.symbol || ''}
                  </span>
                  {walletAddress && payToken && (
                    <button
                      onClick={setMaxAmount}
                      className="text-[12px] font-semibold text-[#FF7A22] hover:text-[#FF8A3D] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      MAX
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPayTokenOpen(true)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-[14px] bg-[#0A0A1A]/80 border border-[#1A1A2E]/80 hover:border-[#6C4DFF]/30 transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: payToken?.iconBgColor || '#2A2A4A' }}>
                    <i className={`${payToken?.icon || 'ri-question-line'} text-sm text-white`}></i>
                  </div>
                  <span className="text-[15px] font-semibold text-white">{payToken?.symbol || 'Select token'}</span>
                  <i className="ri-arrow-down-s-line text-[#A69DB7] text-sm"></i>
                </button>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0"
                  value={payAmount}
                  onChange={handlePayAmountChange}
                  className="flex-1 bg-transparent text-[32px] font-semibold text-white placeholder:text-[#5A5A6E] outline-none border-none text-right min-w-0"
                />
              </div>
              {usdValue && (
                <p className="text-[13px] text-[#A69DB7] mt-1 text-right">≈ ${usdValue}</p>
              )}
            </div>

            {/* Swap Direction Button */}
            <div className="flex justify-center -my-3 relative z-10">
              <button
                onClick={swapTokens}
                className="w-11 h-11 rounded-[14px] liquid-glass-icon-btn flex items-center justify-center cursor-pointer group border-2 border-[#0A0A1A]/80"
              >
                <i className="ri-arrow-up-down-line text-[#A69DB7] group-hover:text-[#6C4DFF] transition-colors text-base"></i>
              </button>
            </div>

            {/* You Receive Panel */}
            <div className="swap-input-panel rounded-[20px] p-4">
              <span className="text-[12px] font-medium text-[#A69DB7] uppercase tracking-wider block mb-2">
                You Receive
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setReceiveTokenOpen(true)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-[14px] bg-[#6C4DFF]/10 border border-[#6C4DFF]/20 hover:border-[#6C4DFF]/40 transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: receiveToken?.iconBgColor || '#2A2A4A' }}>
                    <i className={`${receiveToken?.icon || 'ri-question-line'} text-sm text-white`}></i>
                  </div>
                  <span className="text-[15px] font-semibold text-white">{receiveToken?.symbol || 'Select token'}</span>
                  <i className="ri-arrow-down-s-line text-[#A69DB7] text-sm"></i>
                </button>
                <div className="flex-1 text-right">
                  {quoteLoading ? (
                    <div className="h-8 bg-[#1A1A2E]/40 rounded-[8px] animate-pulse w-[120px] ml-auto"></div>
                  ) : (
                    <span className={`text-[32px] font-semibold min-w-0 ${receiveAmount ? 'text-white' : 'text-[#5A5A6E]'}`}>
                      {receiveAmount || '0'}
                    </span>
                  )}
                </div>
              </div>
              {receiveUsd && !quoteLoading && (
                <p className="text-[13px] text-[#A69DB7] mt-1 text-right">≈ ${receiveUsd}</p>
              )}
            </div>

            {/* Quote Summary */}
            {hasAmount && payToken && receiveToken && walletAddress && !noRoute && !quoteLoading && (
              <div className="space-y-2 pt-2">
                {/* Rate */}
                <div className="flex items-center justify-between text-[13px] px-1">
                  <span className="text-[#A69DB7]">1 {payToken.symbol} = {exchangeRate.toFixed(4)} {receiveToken.symbol}</span>
                  <button
                    onClick={() => setRouteDetailsOpen(!routeDetailsOpen)}
                    className="text-[#A69DB7] hover:text-[#6C4DFF] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <i className={`ri-${routeDetailsOpen ? 'arrow-up-s' : 'arrow-down-s'}-line text-sm`}></i>
                    Route details
                  </button>
                </div>

                {/* Route Details Expanded */}
                {routeDetailsOpen && (
                  <div className="rounded-[14px] border border-[#1A1A2E]/60 bg-[#0A0A1A]/60 p-3 space-y-1.5">
                    <div className="flex items-center gap-2 text-[12px] text-[#A69DB7]">
                      <span className="px-2 py-1 rounded-[8px] bg-[#6C4DFF]/10 text-[#6C4DFF]">{payToken.symbol}</span>
                      <i className="ri-arrow-right-line text-[#A69DB7]"></i>
                      {payToken.symbol === 'ETH' && <span className="px-2 py-1 rounded-[8px] bg-[#2A2A4A]/60 text-[#A69DB7]">WETH</span>}
                      {payToken.symbol === 'ETH' && <i className="ri-arrow-right-line text-[#A69DB7]"></i>}
                      <span className="px-2 py-1 rounded-[8px] bg-[#FF6A1A]/10 text-[#FF7A22]">{receiveToken.symbol}</span>
                    </div>
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-[#A69DB7]">Protocol</span>
                      <span className="text-[#D8D1E6] font-medium">Uniswap V3</span>
                    </div>
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-[#A69DB7]">Route type</span>
                      <span className="text-[#D8D1E6] font-medium">Optimized</span>
                    </div>
                    <p className="text-[11px] text-[#A69DB7]/70 mt-1">Best available execution path for this pair and amount.</p>
                  </div>
                )}

                {/* Quote Details */}
                <div className="space-y-1.5 px-1">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-[#A69DB7]">Network Fee</span>
                    <span className="text-[#D8D1E6] font-medium">{networkFee ? `$${networkFee}` : '—'}</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-[#A69DB7]">Platform Fee</span>
                    <span className="text-[#D8D1E6] font-medium">{platformFee ? `$${platformFee}` : '—'}</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-[#A69DB7]">Expected Output</span>
                    <span className="text-[#D8D1E6] font-medium">{receiveAmount} {receiveToken.symbol}</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-[#A69DB7]">Minimum Received</span>
                    <span className="text-[#D8D1E6] font-medium">{minimumReceived} {receiveToken.symbol}</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-[#A69DB7]">Price Impact</span>
                    <span className={`font-medium ${priceImpact > 0.5 ? 'text-[#FF5B5B]' : priceImpact > 0.2 ? 'text-[#FF7A22]' : 'text-[#34D07F]'}`}>
                      {priceImpact < 0.01 ? '<0.01%' : `${priceImpact}%`}
                    </span>
                  </div>
                </div>

                {/* Gas + Slippage + MEV bar */}
                <div className="flex items-center gap-3 px-1 py-2 border-t border-[#1A1A2E]/60">
                  <span className="text-[12px] text-[#A69DB7]">Gas: <span className="text-[#D8D1E6] font-medium">{gasEth} {payToken?.symbol}</span></span>
                  <span className="text-[#1A1A2E]">|</span>
                  <span className="text-[12px] text-[#A69DB7]">Slippage: <span className="text-[#D8D1E6] font-medium">{slippage}%</span></span>
                  <span className="text-[#1A1A2E]">|</span>
                  <span className="text-[12px] text-[#A69DB7]">MEV: <span className="text-[#D8D1E6] font-medium">{mevProtection ? 'ON' : 'OFF'}</span></span>
                </div>

                {/* High price impact warning */}
                {priceImpact > 3 && !expertMode && (
                  <div className="rounded-[12px] border border-[#FF6A1A]/20 bg-[#FF6A1A]/5 p-3 flex items-start gap-2">
                    <i className="ri-alert-line text-[#FF7A22] text-base mt-0.5"></i>
                    <div>
                      <p className="text-[13px] font-semibold text-[#FF7A22]">High price impact</p>
                      <p className="text-[12px] text-[#A69DB7] mt-0.5">This trade may move the market significantly. Consider splitting into smaller transactions.</p>
                    </div>
                  </div>
                )}

                {/* Quote expired */}
                {quoteExpired && (
                  <div className="rounded-[12px] border border-[#FF6A1A]/20 bg-[#FF6A1A]/5 p-3 flex items-start gap-2">
                    <i className="ri-time-line text-[#FF7A22] text-base mt-0.5"></i>
                    <div className="flex-1">
                      <p className="text-[13px] font-semibold text-[#FF7A22]">Quote expired</p>
                      <p className="text-[12px] text-[#A69DB7] mt-0.5">Price may have changed. Refresh to get updated quote.</p>
                    </div>
                    <button
                      onClick={handleRefreshQuote}
                      className="text-[12px] font-semibold text-[#FF7A22] hover:text-[#FF8A3D] cursor-pointer whitespace-nowrap"
                    >
                      Refresh
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* No Route Found */}
            {noRoute && (
              <div className="rounded-[12px] border border-[#FF5B5B]/20 bg-[#FF5B5B]/5 p-3 flex items-start gap-2">
                <i className="ri-error-warning-line text-[#FF5B5B] text-base mt-0.5"></i>
                <div>
                  <p className="text-[13px] font-semibold text-[#FF5B5B]">No route found</p>
                  <p className="text-[12px] text-[#A69DB7] mt-0.5">We could not find a route for this token pair. Try another token or amount.</p>
                </div>
              </div>
            )}

            {/* Quote loading */}
            {quoteLoading && (
              <div className="py-3 space-y-2">
                <div className="flex items-center gap-2 text-[13px] text-[#A69DB7]">
                  <div className="w-4 h-4 border-2 border-[#6C4DFF]/30 border-t-[#6C4DFF] rounded-full animate-spin"></div>
                  Fetching best route...
                </div>
              </div>
            )}

            {/* Unsupported network */}
            {unsupportedNetwork && (
              <div className="rounded-[12px] border border-[#FF7A22]/20 bg-[#FF7A22]/5 p-3 flex items-start gap-2">
                <i className="ri-alert-line text-[#FF7A22] text-base mt-0.5"></i>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-[#FF7A22]">Unsupported network</p>
                  <p className="text-[12px] text-[#A69DB7] mt-0.5">Switch to Base or Monad to continue.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSwitchNetwork('Base')}
                    className="text-[12px] font-semibold text-[#FF7A22] hover:text-[#FF8A3D] cursor-pointer whitespace-nowrap"
                  >
                    Switch to Base
                  </button>
                  <button
                    onClick={() => handleSwitchNetwork('Monad')}
                    className="text-[12px] font-semibold text-[#FF7A22] hover:text-[#FF8A3D] cursor-pointer whitespace-nowrap"
                  >
                    Monad
                  </button>
                </div>
              </div>
            )}

            {/* CTA Button */}
            <div className="pt-2">
              <button
                onClick={handleCtaClick}
                disabled={ctaDisabled()}
                className={`w-full py-4 rounded-[16px] font-semibold text-[15px] transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  !walletAddress
                    ? 'bg-[#6C4DFF] text-white hover:bg-[#7B61FF] shadow-[0_0_20px_rgba(108,77,255,0.3)]'
                    : needsApproval
                    ? 'bg-[#FF7A22] text-white hover:bg-[#FF8A3D] shadow-[0_0_20px_rgba(255,122,34,0.3)]'
                    : insufficientBalance
                    ? 'bg-[#FF5B5B]/15 text-[#FF5B5B] border border-[#FF5B5B]/20 cursor-not-allowed'
                    : noRoute
                    ? 'bg-[#FF5B5B]/15 text-[#FF5B5B] border border-[#FF5B5B]/20 cursor-not-allowed'
                    : quoteLoading
                    ? 'bg-[#6C4DFF]/30 text-[#A69DB7] cursor-not-allowed'
                    : quoteExpired
                    ? 'bg-[#FF7A22] text-white hover:bg-[#FF8A3D]'
                    : 'bg-[#6C4DFF] text-white hover:bg-[#7B61FF] shadow-[0_0_20px_rgba(108,77,255,0.3)]'
                }`}
              >
                {getCtaText()}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TokenSelector
        isOpen={payTokenOpen}
        onClose={() => setPayTokenOpen(false)}
        onSelect={handlePaySelect}
        tokens={availableTokens}
        excludeToken={receiveToken}
        title="Select a token"
      />
      <TokenSelector
        isOpen={receiveTokenOpen}
        onClose={() => setReceiveTokenOpen(false)}
        onSelect={handleReceiveSelect}
        tokens={availableTokens}
        excludeToken={payToken}
        title="Select a token"
      />
      <SwapSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        slippage={slippage}
        onSlippageChange={setSlippage}
        deadline={deadline}
        onDeadlineChange={setDeadline}
        mevProtection={mevProtection}
        onMevProtectionChange={setMevProtection}
        expertMode={expertMode}
        onExpertModeChange={setExpertMode}
      />
      <ReviewSwapModal
        isOpen={reviewOpen}
        onClose={() => setReviewOpen(false)}
        onConfirm={handleConfirmSwap}
        payToken={payToken}
        receiveToken={receiveToken}
        payAmount={payAmount}
        receiveAmount={receiveAmount}
        exchangeRate={exchangeRate}
        minimumReceived={minimumReceived}
        priceImpact={priceImpact}
        networkFee={networkFee}
        slippage={slippage}
        route={`${payToken?.symbol} → ${receiveToken?.symbol}`}
        gasFee={gasEth}
        protocol="Uniswap V3"
      />
      <TransactionStatusModal
        status={txStatus}
        onClose={handleReset}
        onTryAgain={handleTryAgain}
        onBackToSwap={handleReset}
        onMakeAnother={handleReset}
      />
      <ConnectWalletModal
        isOpen={connectOpen}
        onClose={() => setConnectOpen(false)}
        onConnect={handleWalletConnect}
        connecting={connectingWallet}
      />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}

interface Quote {
  exchangeRate: number;
  receiveAmount: number;
  minimumReceived: string;
  priceImpact: number;
  networkFee: string;
  platformFee: string;
  gasFee: number;
  slippage: number;
  route: string;
  protocol: string;
  routeType: string;
}

interface TransactionStatus {
  stage: 'preparing' | 'confirm' | 'pending' | 'success' | 'rejected' | 'failed';
  txHash: string;
  fromToken: Token | null;
  toToken: Token | null;
  fromAmount: string;
  toAmount: string;
  chain: string;
  route: string;
  failureReason?: string;
}