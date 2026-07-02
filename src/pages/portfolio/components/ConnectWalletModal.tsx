import { useEffect, useRef } from 'react';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
  isConnecting: boolean;
}

export default function ConnectWalletModal({ isOpen, onClose, onConnect, isConnecting }: ConnectWalletModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isConnecting) onClose();
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, isConnecting, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-[4px] transition-opacity duration-300"
        onClick={isConnecting ? undefined : onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label={isConnecting ? 'Connecting wallet' : 'Connect wallet'}
          className="relative w-full max-w-[420px] liquid-glass-strong rounded-[24px] p-8"
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[24px]">
            <div className="absolute top-0 left-[10%] w-[250px] h-[200px] bg-[#FF6A1A]/[0.05] rounded-full blur-[80px]" />
            <div className="absolute bottom-[20%] right-0 w-[200px] h-[180px] bg-[#6C4DFF]/[0.05] rounded-full blur-[80px]" />
          </div>

          <div className="relative z-10 text-center">
            {isConnecting ? (
              <>
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#6C4DFF]/[0.12] border border-[#6C4DFF]/[0.20] flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-[#7B61FF] border-t-transparent rounded-full animate-spin" />
                </div>
                <h3 className="text-[18px] font-bold text-[#F6F2EA] mb-2">Connecting wallet...</h3>
                <p className="text-[13px] text-[#A69DB7] mb-6 leading-relaxed">
                  Waiting for wallet approval. Check your wallet to continue.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-full text-[12px] font-medium text-[#A69DB7] bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] hover:text-[#F6F2EA] transition-all cursor-pointer whitespace-nowrap relative"
                  >
                    <span className="relative z-10">Cancel</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#FF6A1A]/[0.10] border border-[#FF6A1A]/[0.18] flex items-center justify-center">
                  <i className="ri-wallet-3-line text-2xl text-[#FF7A22]"></i>
                </div>
                <h3 className="text-[18px] font-bold text-[#F6F2EA] mb-2">Connect your wallet</h3>
                <p className="text-[13px] text-[#A69DB7] mb-6 leading-relaxed">
                  Connect a wallet to view your portfolio, balances, and CrackerSwap activity.
                </p>

                <div className="space-y-3 mb-6">
                  {[
                    { name: 'MetaMask', icon: 'ri-shield-keyhole-fill', color: '#FF6A1A' },
                    { name: 'WalletConnect', icon: 'ri-link', color: '#6C4DFF' },
                    { name: 'Coinbase Wallet', icon: 'ri-coin-fill', color: '#0052FF' },
                  ].map((wallet) => (
                    <button
                      key={wallet.name}
                      onClick={onConnect}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: wallet.color + '18' }}>
                        <i className={`${wallet.icon} text-sm`} style={{ color: wallet.color }}></i>
                      </div>
                      <span className="text-[13px] font-medium text-[#D8D1E6] group-hover:text-[#F6F2EA] transition-colors">{wallet.name}</span>
                      <i className="ri-arrow-right-s-line text-[#6E667E] ml-auto"></i>
                    </button>
                  ))}
                </div>

                <p className="text-[10px] text-[#6E667E]">
                  By connecting, you agree to CrackerSwap&apos;s Terms of Service and Privacy Policy.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}