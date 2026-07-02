import { useState } from 'react';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (wallet: string) => void;
  connecting: boolean;
}

const wallets = [
  { id: 'metamask', name: 'MetaMask', icon: 'ri-wallet-line', description: 'Popular browser wallet' },
  { id: 'walletconnect', name: 'WalletConnect', icon: 'ri-link-m', description: 'Connect via QR code' },
  { id: 'coinbase', name: 'Coinbase Wallet', icon: 'ri-coin-line', description: 'Coinbase ecosystem' },
  { id: 'rabby', name: 'Rabby', icon: 'ri-wallet-3-line', description: 'Secure DeFi wallet' },
];

export default function ConnectWalletModal({ isOpen, onClose, onConnect, connecting }: ConnectWalletModalProps) {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  if (!isOpen) return null;

  if (connecting) {
    return (
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative w-full sm:w-[360px] bg-[#0A0A1A] rounded-t-2xl sm:rounded-[20px] border border-[#1A1A2E]/60 flex flex-col">
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full border-4 border-[#6C4DFF]/20 border-t-[#6C4DFF] animate-spin mx-auto mb-4"></div>
            <h3 className="text-[20px] font-bold text-white mb-2">Connecting wallet...</h3>
            <p className="text-[13px] text-[#A69DB7]">Waiting for wallet approval. Check your wallet to continue.</p>
            <button
              onClick={onClose}
              className="mt-6 text-[13px] text-[#A69DB7] hover:text-white cursor-pointer underline"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:w-[400px] bg-[#0A0A1A] rounded-t-2xl sm:rounded-[20px] border border-[#1A1A2E]/60 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-[#1A1A2E]/60">
          <h3 className="text-lg font-semibold text-white">Connect Wallet</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1A1A2E]/60 hover:bg-[#1A1A2E] text-[#A69DB7] hover:text-white transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        <div className="p-4 space-y-2">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => {
                setSelectedWallet(wallet.id);
                onConnect(wallet.id);
              }}
              className={`w-full flex items-center gap-3 p-4 rounded-[14px] transition-all cursor-pointer border ${
                selectedWallet === wallet.id
                  ? 'bg-[#6C4DFF]/15 border-[#6C4DFF]/20'
                  : 'bg-[#1A1A2E]/40 border-[#1A1A2E]/60 hover:border-[#1A1A2E]/80'
              }`}
            >
              <div className="w-10 h-10 rounded-[10px] bg-[#2A2A4A] flex items-center justify-center">
                <i className={`${wallet.icon} text-[#6C4DFF] text-xl`}></i>
              </div>
              <div className="text-left">
                <p className="text-[14px] font-semibold text-white">{wallet.name}</p>
                <p className="text-[12px] text-[#A69DB7] mt-0.5">{wallet.description}</p>
              </div>
              <i className="ri-arrow-right-s-line text-[#A69DB7] ml-auto"></i>
            </button>
          ))}
        </div>

        <div className="p-5 border-t border-[#1A1A2E]/60 text-center">
          <p className="text-[12px] text-[#A69DB7]">CrackerSwap only displays view-only portfolio analytics.</p>
        </div>
      </div>
    </div>
  );
}