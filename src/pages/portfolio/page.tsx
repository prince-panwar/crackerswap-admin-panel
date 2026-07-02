import { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import PortfolioOverview from './components/PortfolioOverview';
import PortfolioAssets from './components/PortfolioAssets';
import PortfolioLPExposure from './components/PortfolioLPExposure';
import PortfolioActivity from './components/PortfolioActivity';
import TokenBalanceDrawer from './components/TokenBalanceDrawer';
import LPExposureDrawer from './components/LPExposureDrawer';
import TransactionDetailDrawer from './components/TransactionDetailDrawer';
import ConnectWalletModal from './components/ConnectWalletModal';
import { portfolioSummary } from '@/mocks/portfolioData';
import type { PortfolioToken, LPExposure, PortfolioTransaction } from '@/mocks/portfolioData';

type TabId = 'overview' | 'assets' | 'lp' | 'activity';

const tabs = [
  { id: 'overview' as TabId, label: 'Overview' },
  { id: 'assets' as TabId, label: 'Assets' },
  { id: 'lp' as TabId, label: 'LP Exposure' },
  { id: 'activity' as TabId, label: 'Activity' },
];

export default function PortfolioPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabFromUrl = (searchParams.get('tab') || 'overview') as TabId;
  const validTab = tabs.some((t) => t.id === tabFromUrl) ? tabFromUrl : 'overview';
  const [activeTab, setActiveTab] = useState<TabId>(validTab);

  const [walletConnected, setWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [unsupportedNetwork, setUnsupportedNetwork] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [balanceDrawerToken, setBalanceDrawerToken] = useState<PortfolioToken | null>(null);
  const [lpDrawerExposure, setLpDrawerExposure] = useState<LPExposure | null>(null);
  const [txDrawerTx, setTxDrawerTx] = useState<PortfolioTransaction | null>(null);

  useEffect(() => {
    if (tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const switchTab = useCallback((tab: string) => {
    setActiveTab(tab as TabId);
    setSearchParams({ tab });
  }, [setSearchParams]);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2200);
  }, []);

  const openConnectModal = () => {
    setShowConnectModal(true);
    setIsConnecting(false);
  };

  const closeConnectModal = () => {
    if (!isConnecting) {
      setShowConnectModal(false);
    }
  };

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setShowConnectModal(false);
      setWalletAddress(portfolioSummary.walletAddress);
      setWalletConnected(true);
      setLoading(true);
      setTimeout(() => setLoading(false), 800);
    }, 2000);
  };

  const handleDisconnect = () => {
    setWalletConnected(false);
    setWalletAddress('');
    setActiveTab('overview');
    setSearchParams({});
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress).then(() => {
      showToast('Wallet address copied');
    }).catch(() => {});
  };

  const handleTradeToken = (symbol: string) => {
    navigate(`/swap?from=${symbol}&to=USDC`);
  };

  const handleViewToken = (token: PortfolioToken) => {
    setBalanceDrawerToken(token);
  };

  const handleViewLP = (exposure: LPExposure) => {
    setLpDrawerExposure(exposure);
  };

  const handleViewTx = (tx: PortfolioTransaction) => {
    setTxDrawerTx(tx);
  };

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-[#070214] text-[#F6F2EA] relative overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[0%] left-[50%] -translate-x-1/2 w-[700px] h-[500px] bg-[#FF6A1A]/[0.025] rounded-full blur-[140px]" />
        <div className="absolute top-[15%] right-[5%] w-[500px] h-[500px] bg-[#6C4DFF]/[0.025] rounded-full blur-[140px]" />
        <div className="absolute top-[55%] left-[0%] w-[400px] h-[400px] bg-[#6C4DFF]/[0.02] rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[20%] w-[300px] h-[300px] bg-[#FF6A1A]/[0.02] rounded-full blur-[100px]" />
      </div>

      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[150] px-4 py-2.5 rounded-full bg-[#34D07F]/15 border border-[#34D07F]/20 text-[#34D07F] text-[11px] font-medium backdrop-blur-md shadow-lg animate-fade-in-out">
          <i className="ri-check-line mr-1.5 text-[10px]"></i>
          {toastMsg}
        </div>
      )}

      {/* Navbar */}
      <div className="relative z-50 pt-6 px-6">
        <div className="max-w-[1200px] mx-auto">
          <nav className="h-[52px] liquid-glass-nav flex items-center justify-between px-2">
            <div className="relative z-10 flex items-center gap-2 pl-3">
              <Link to="/v2" className="flex items-center gap-2 cursor-pointer group">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF6A1A] to-[#FF7A22] flex items-center justify-center shadow-[0_0_12px_rgba(255,106,26,0.25)]">
                  <i className="ri-flashlight-fill text-white text-sm"></i>
                </div>
                <span className="text-[#F6F2EA] font-semibold text-sm tracking-tight">CrackerSwap</span>
              </Link>
            </div>

            <div className="relative z-10 flex items-center gap-1">
              {[
                { label: 'Tokens', path: '/v2' },
                { label: 'Swap', path: '/swap' },
                { label: 'Pools', path: '/pools' },
                { label: 'Positions', path: '/positions' },
                { label: 'Portfolio', path: '/portfolio' },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap relative z-10 ${
                    item.label === 'Portfolio'
                      ? 'bg-[#FF6A1A]/12 text-[#FF7A22] border border-[#FF6A1A]/20'
                      : 'text-[#6E667E] hover:text-[#F6F2EA]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="relative z-10 flex items-center gap-2 pr-3">
              {walletConnected ? (
                <>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium text-[#34D07F] liquid-glass-badge">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34D07F] relative z-10"></span>
                    <span className="relative z-10">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
                  </span>
                  <button
                    onClick={copyAddress}
                    className="liquid-glass-icon-btn w-7 h-7 rounded-full flex items-center justify-center text-[#6E667E] hover:text-[#F6F2EA] transition-colors cursor-pointer"
                    aria-label="Copy wallet address"
                  >
                    <i className="ri-file-copy-line text-xs relative z-10"></i>
                  </button>
                  <button
                    onClick={handleDisconnect}
                    className="px-3 py-1.5 rounded-full text-[11px] font-medium text-[#A69DB7] bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] hover:text-[#FF5B5B] transition-all cursor-pointer whitespace-nowrap relative"
                  >
                    <span className="relative z-10">Disconnect</span>
                  </button>
                </>
              ) : (
                <>
                  <button className="liquid-glass-icon-btn w-7 h-7 rounded-full flex items-center justify-center text-[#6E667E] hover:text-[#F6F2EA] transition-colors cursor-pointer">
                    <i className="ri-refresh-line text-xs relative z-10"></i>
                  </button>
                  <button
                    onClick={openConnectModal}
                    className="liquid-glass-btn-primary px-3.5 py-1.5 text-[#F6F2EA] text-[11px] font-semibold cursor-pointer whitespace-nowrap relative z-10"
                  >
                    <i className="ri-wallet-3-line text-[10px] mr-1 relative z-10"></i>
                    <span className="relative z-10">Connect Wallet</span>
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-6 flex flex-col gap-5">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-bold text-[#F6F2EA] tracking-tight">Portfolio</h1>
            <p className="text-[12px] text-[#A69DB7] mt-1">Track your wallet balances, LP exposure, and CrackerSwap activity.</p>
          </div>
          {walletConnected && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#6E667E] flex items-center gap-1.5 liquid-glass-badge px-2.5 py-1">
                <span className="relative z-10">Data updated {portfolioSummary.lastUpdated}</span>
              </span>
              <button
                onClick={handleRetry}
                className="liquid-glass-icon-btn w-7 h-7 rounded-full flex items-center justify-center text-[#6E667E] hover:text-[#F6F2EA] transition-colors cursor-pointer"
              >
                <i className="ri-refresh-line text-xs relative z-10"></i>
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`px-4 py-2 rounded-full text-[12px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#FF6A1A]/12 text-[#FF7A22] border border-[#FF6A1A]/20'
                  : 'bg-white/[0.04] text-[#A69DB7] border border-white/[0.07] hover:bg-white/[0.06] hover:text-[#F6F2EA]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Unsupported Network Banner */}
        {unsupportedNetwork && walletConnected && (
          <div className="liquid-glass-card p-5 border border-[#FF6A1A]/[0.15]">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-[#FF6A1A]/[0.12] border border-[#FF6A1A]/[0.18] flex items-center justify-center shrink-0">
                  <i className="ri-alert-line text-lg text-[#FF7A22]"></i>
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-[#F6F2EA]">Unsupported network</h3>
                  <p className="text-[11px] text-[#A69DB7]">Switch to Base or Monad to view your CrackerSwap portfolio.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 rounded-full text-[11px] font-semibold bg-[#FF6A1A]/12 text-[#FF7A22] border border-[#FF6A1A]/20 hover:bg-[#FF6A1A]/18 transition-all cursor-pointer whitespace-nowrap">
                  Switch to Base
                </button>
                <button className="px-4 py-2 rounded-full text-[11px] font-semibold bg-[#6C4DFF]/12 text-[#7B61FF] border border-[#6C4DFF]/20 hover:bg-[#6C4DFF]/18 transition-all cursor-pointer whitespace-nowrap">
                  Switch to Monad
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && walletConnected && (
          <div className="liquid-glass-card p-10 text-center">
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#FF6A1A]/[0.08] border border-[#FF6A1A]/[0.15] flex items-center justify-center">
                <i className="ri-error-warning-line text-2xl text-[#FF7A22]"></i>
              </div>
              <h3 className="text-[16px] font-semibold text-[#F6F2EA] mb-2">Portfolio data unavailable</h3>
              <p className="text-[12px] text-[#A69DB7] mb-5 max-w-[400px] mx-auto leading-relaxed">
                We could not refresh your portfolio data right now. Please try again.
              </p>
              <button
                onClick={handleRetry}
                className="liquid-glass-btn-primary px-5 py-2.5 text-[#F6F2EA] text-[12px] font-semibold cursor-pointer whitespace-nowrap relative z-10"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <i className="ri-refresh-line text-[13px]"></i>
                  Retry
                </span>
              </button>
              <p className="text-[10px] text-[#6E667E] mt-3">Last successful update: {portfolioSummary.lastUpdated}</p>
            </div>
          </div>
        )}

        {/* No Wallet Connected State */}
        {!walletConnected && !error && (
          <div className="liquid-glass-card p-12 text-center">
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#6C4DFF]/[0.08] border border-[#6C4DFF]/[0.15] flex items-center justify-center">
                <i className="ri-wallet-3-line text-3xl text-[#7B61FF]"></i>
              </div>
              <h3 className="text-[20px] font-bold text-[#F6F2EA] mb-3">Connect wallet to view your portfolio</h3>
              <p className="text-[13px] text-[#A69DB7] mb-6 max-w-[480px] mx-auto leading-relaxed">
                Your token balances, LP exposure, and CrackerSwap activity will appear here once your wallet is connected.
              </p>
              <button
                onClick={openConnectModal}
                className="liquid-glass-btn-primary px-6 py-3 text-[#F6F2EA] text-[14px] font-semibold cursor-pointer whitespace-nowrap relative z-10"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <i className="ri-wallet-3-line text-[15px]"></i>
                  Connect Wallet
                </span>
              </button>
              <p className="text-[11px] text-[#6E667E] mt-4">CrackerSwap only displays view-only portfolio analytics.</p>
            </div>
            <div className="absolute top-[10%] left-[15%] w-[300px] h-[250px] bg-[#6C4DFF]/[0.04] rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[10%] right-[15%] w-[300px] h-[250px] bg-[#FF6A1A]/[0.04] rounded-full blur-[100px] pointer-events-none" />
          </div>
        )}

        {/* Loading State */}
        {loading && walletConnected && !error && (
          <div className="flex flex-col gap-5">
            <div className="liquid-glass-card p-6 animate-pulse">
              <div className="relative z-10 space-y-3">
                <div className="h-3 w-32 bg-white/[0.06] rounded-full" />
                <div className="h-8 w-48 bg-white/[0.06] rounded-full" />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="liquid-glass-card p-4 min-h-[110px] animate-pulse">
                  <div className="relative z-10 space-y-2">
                    <div className="h-2.5 w-20 bg-white/[0.06] rounded-full" />
                    <div className="h-6 w-16 bg-white/[0.06] rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Connected Content */}
        {walletConnected && !loading && !error && (
          <>
            {activeTab === 'overview' && (
              <PortfolioOverview onSwitchTab={switchTab} />
            )}
            {activeTab === 'assets' && (
              <PortfolioAssets
                onViewToken={handleViewToken}
                onTradeToken={handleTradeToken}
              />
            )}
            {activeTab === 'lp' && (
              <PortfolioLPExposure onViewDetails={handleViewLP} />
            )}
            {activeTab === 'activity' && (
              <PortfolioActivity onViewTransaction={handleViewTx} />
            )}
          </>
        )}
      </div>

      {/* Drawers */}
      <TokenBalanceDrawer
        token={balanceDrawerToken}
        isOpen={balanceDrawerToken !== null}
        onClose={() => setBalanceDrawerToken(null)}
      />
      <LPExposureDrawer
        exposure={lpDrawerExposure}
        isOpen={lpDrawerExposure !== null}
        onClose={() => setLpDrawerExposure(null)}
      />
      <TransactionDetailDrawer
        tx={txDrawerTx}
        isOpen={txDrawerTx !== null}
        onClose={() => setTxDrawerTx(null)}
      />

      {/* Connect Wallet Modal */}
      <ConnectWalletModal
        isOpen={showConnectModal}
        onClose={closeConnectModal}
        onConnect={handleConnect}
        isConnecting={isConnecting}
      />

      {/* Footer */}
      <footer className="relative z-10 mt-6 pb-6">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <span className="text-[10px] text-[#6E667E]">2024 CrackerSwap</span>
          <span className="text-[10px] text-[#6E667E]">crackerswap.app</span>
        </div>
      </footer>
    </div>
  );
}