import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  id: string;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { id: 'tokens', label: 'Tokens', path: '/' },
  { id: 'swap', label: 'Swap', path: '/swap' },
  { id: 'pools', label: 'Pools', path: '/pools' },
  { id: 'positions', label: 'Positions', path: '/positions' },
  { id: 'portfolio', label: 'Portfolio', path: '/portfolio' },
];

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center">
      {/* Background glass */}
      <div className="absolute inset-0 bg-[#080418]/80 backdrop-blur-xl border-b border-[#1A1A2E]/60" />

      <div className="relative z-10 w-full flex items-center justify-between px-6 max-w-[1440px] mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 cursor-pointer group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6A1A] to-[#FF7A22] flex items-center justify-center shadow-[0_0_12px_rgba(255,106,26,0.35)]">
            <i className="ri-flashlight-fill text-white text-lg"></i>
          </div>
          <span className="text-white font-semibold text-base tracking-tight font-heading">
            CrackerSwap
          </span>
        </Link>

        {/* Center nav */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#FF6A1A]/15 text-[#FF7A22] border border-[#FF6A1A]/20'
                    : 'text-[#8B8FA3] hover:text-white border border-transparent'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-[#8B8FA3] hover:text-white transition-colors cursor-pointer">
            <i className="ri-star-line text-lg"></i>
          </button>
          <button className="relative w-9 h-9 rounded-full flex items-center justify-center text-[#8B8FA3] hover:text-white transition-colors cursor-pointer">
            <i className="ri-notification-3-line text-lg"></i>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF6A1A]" />
          </button>
          <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#6C4DFF] to-[#7B61FF] text-white text-sm font-semibold shadow-[0_0_16px_rgba(108,77,255,0.35)] hover:shadow-[0_0_24px_rgba(108,77,255,0.5)] transition-all cursor-pointer whitespace-nowrap">
            Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  );
}