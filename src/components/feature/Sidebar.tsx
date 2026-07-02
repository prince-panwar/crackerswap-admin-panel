import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: 'swap', label: 'Swap', path: '/swap', icon: 'ri-arrow-left-right-line' },
  { id: 'tokens', label: 'Tokens', path: '/v2', icon: 'ri-coins-line' },
  { id: 'pools', label: 'Pools', path: '/pools', icon: 'ri-water-flash-line' },
  { id: 'positions', label: 'Positions', path: '/positions', icon: 'ri-stack-line' },
  { id: 'portfolio', label: 'Portfolio', path: '/portfolio', icon: 'ri-wallet-3-line' },
  { id: 'analytics', label: 'Analytics', path: '/analytics', icon: 'ri-bar-chart-2-line' },
  { id: 'watchlist', label: 'Watchlist', path: '/watchlist', icon: 'ri-star-line' },
];

const chainItems = [
  { id: 'base', label: 'Base', icon: 'ri-circle-fill' },
  { id: 'monad', label: 'Monad', icon: 'ri-circle-fill' },
];

const socialItems = [
  { id: 'twitter', icon: 'ri-twitter-x-line', label: 'Twitter' },
  { id: 'discord', icon: 'ri-discord-line', label: 'Discord' },
  { id: 'github', icon: 'ri-github-line', label: 'GitHub' },
];

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/pools') return location.pathname === '/pools' || location.pathname.startsWith('/pools/');
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  };

  return (
    <aside className="w-[240px] min-h-screen flex-shrink-0 flex flex-col border-r border-[#1A1A2E]/60 bg-[#09031A]/95 backdrop-blur-xl relative">
      {/* Logo */}
      <div className="p-5">
        <Link to="/" className="flex items-center gap-2.5 cursor-pointer group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6A1A] to-[#FF7A22] flex items-center justify-center shadow-[0_0_10px_rgba(255,106,26,0.3)]">
            <i className="ri-flashlight-fill text-white text-sm"></i>
          </div>
          <span className="text-[#F6F2EA] font-semibold text-[15px] tracking-tight">
            CrackerSwap
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 cursor-pointer ${
                active
                  ? 'bg-[#FF6A1A]/10 text-[#FF7A22] border border-[#FF6A1A]/15'
                  : 'text-[#A69DB7] hover:text-[#F6F2EA] hover:bg-[#FF6A1A]/5 border border-transparent'
              }`}
            >
              <div className={`w-5 h-5 flex items-center justify-center ${active ? 'text-[#FF7A22]' : ''}`}>
                <i className={item.icon}></i>
              </div>
              {item.label}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="my-3 mx-1 h-px bg-[#1A1A2E]/60" />

        {/* Chains */}
        <div className="px-3 mb-2">
          <span className="text-[11px] font-semibold text-[#6E667E] uppercase tracking-wider">Chains</span>
        </div>
        {chainItems.map((chain) => (
          <button
            key={chain.id}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#A69DB7] hover:text-[#F6F2EA] hover:bg-[#FF6A1A]/5 border border-transparent transition-all duration-200 cursor-pointer"
          >
            <div className={`w-5 h-5 flex items-center justify-center ${chain.id === 'base' ? 'text-[#0052FF]' : 'text-[#FF6A1A]'}`}>
              <i className={chain.icon}></i>
            </div>
            {chain.label}
          </button>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-3 mt-auto">
        {/* Social icons */}
        <div className="flex items-center gap-1 mb-3 px-2">
          {socialItems.map((item) => (
            <button
              key={item.id}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6E667E] hover:text-[#F6F2EA] hover:bg-[#1A1A2E]/40 transition-all duration-200 cursor-pointer"
              aria-label={item.label}
            >
              <i className={item.icon}></i>
            </button>
          ))}
        </div>

        {/* Footer text */}
        <div className="px-2">
          <p className="text-[11px] text-[#6E667E]">
            &copy; 2025 CrackerSwap
          </p>
          <p className="text-[11px] text-[#6E667E]/60 mt-0.5">
            All rights reserved.
          </p>
        </div>
      </div>
    </aside>
  );
}