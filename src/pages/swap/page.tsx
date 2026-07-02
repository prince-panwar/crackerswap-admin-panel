import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SwapCard from './components/SwapCard';

interface NavItem {
  id: string;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { id: 'tokens', label: 'Tokens', path: '/v2' },
  { id: 'swap', label: 'Swap', path: '/swap' },
  { id: 'bridge', label: 'Bridge', path: '#' },
];

export default function SwapPage() {
  const location = useLocation();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Parse query params for pre-selecting tokens
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const fromParam = params.get('from');
    const toParam = params.get('to');
    // Token pre-selection is handled in SwapCard
  }, [location.search]);

  const isActive = (path: string) => {
    if (path === '#' || path === '') return false;
    return location.pathname === path;
  };

  const handleConnectWallet = () => {
    setWalletAddress('0x1F2b3C4d5E6f7A8b9C0d1E2f3A4b5C6d7e8f9A0b1c2d3e4f5a6B7c8D9e0F1a2b3c4');
  };

  const handleDisconnectWallet = () => {
    setWalletAddress(null);
  };

  const handleSwapSuccess = (tx: SwapTx) => {
    // Could add to global activity state here
    console.log('Swap completed:', tx);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-[#070214] text-white relative overflow-x-hidden">
      {/* Background ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Large purple arc behind card */}
        <div className="absolute bottom-[-20%] left-[50%] -translate-x-1/2 w-[1400px] h-[700px] swap-bg-arc" />
        {/* Soft purple glow at center */}
        <div className="absolute top-[35%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] swap-glow-center" />
        {/* Subtle orange accent */}
        <div className="absolute top-[10%] left-[20%] w-[300px] h-[300px] swap-glow-orange" />
      </div>

      {/* Floating pill navbar */}
      <nav className="fixed top-4 left-4 sm:left-8 z-50">
        <div className="liquid-glass-nav px-1.5 py-1.5 flex items-center gap-1">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 pl-2 pr-2 cursor-pointer">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF6A1A] to-[#FF7A22] flex items-center justify-center shadow-[0_0_8px_rgba(255,106,26,0.35)]">
              <i className="ri-flashlight-fill text-white text-sm"></i>
            </div>
          </Link>
          <div className="w-px h-5 bg-[#1A1A2E]/60" />
          {/* Nav items */}
          <div className="flex items-center gap-0.5">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#1A1A2E]/60 text-white'
                      : item.path === '#'
                      ? 'text-[#6E667E] cursor-not-allowed'
                      : 'text-[#A69DB7] hover:text-white'
                  }`}
                  onClick={item.path === '#' ? (e) => e.preventDefault() : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Top right controls */}
      <div className="fixed top-4 right-4 sm:right-8 z-50 flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="liquid-glass-icon-btn w-9 h-9 flex items-center justify-center cursor-pointer"
          aria-label="Toggle theme"
        >
          <i className={`${isDark ? 'ri-moon-line' : 'ri-sun-line'} text-[#A69DB7] text-sm`}></i>
        </button>
        {/* Wallet pill */}
        {walletAddress ? (
          <div className="liquid-glass-nav flex items-center gap-2 px-3 py-1.5">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#FF6A1A] to-[#FF7A22] flex items-center justify-center">
              <i className="ri-wallet-line text-white text-[10px]"></i>
            </div>
            <span className="text-[13px] font-medium text-white">{formatAddress(walletAddress)}</span>
            <button
              onClick={handleDisconnectWallet}
              className="ml-1 text-[#A69DB7] hover:text-white cursor-pointer"
              aria-label="Disconnect wallet"
            >
              <i className="ri-close-line text-sm"></i>
            </button>
          </div>
        ) : (
          <button
            onClick={handleConnectWallet}
            className="liquid-glass-nav px-5 py-2 text-[13px] font-semibold text-white cursor-pointer whitespace-nowrap hover:bg-[#1A1A2E]/40"
          >
            Connect Wallet
          </button>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-4 right-4 z-[60] md:hidden liquid-glass-icon-btn w-9 h-9 flex items-center justify-center cursor-pointer"
      >
        <i className={`${mobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-[#A69DB7] text-sm`}></i>
      </button>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[55] bg-black/80 backdrop-blur-sm md:hidden">
          <div className="absolute top-16 right-4 left-4 liquid-glass rounded-[16px] p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className="block px-4 py-3 rounded-[12px] text-[14px] font-medium text-white hover:bg-[#1A1A2E]/40 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-[#1A1A2E]/60 pt-2 mt-2">
              {walletAddress ? (
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-[13px] text-white">{formatAddress(walletAddress)}</span>
                  <button
                    onClick={handleDisconnectWallet}
                    className="text-[13px] text-[#FF5B5B] cursor-pointer"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleConnectWallet();
                  }}
                  className="w-full text-center py-3 rounded-[12px] text-[14px] font-medium text-[#6C4DFF] cursor-pointer"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main swap area */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-20 pb-8 px-4">
        <SwapCard
          walletAddress={walletAddress}
          onConnectWallet={handleConnectWallet}
          onDisconnectWallet={handleDisconnectWallet}
          onSwapSuccess={handleSwapSuccess}
        />
      </main>
    </div>
  );
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