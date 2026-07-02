import { useEffect, useRef } from 'react';

interface MenuItem {
  icon: string;
  label: string;
  action: () => void;
  danger?: boolean;
}

interface Props {
  items: MenuItem[];
  position: { x: number; y: number };
  onClose: () => void;
}

export default function PositionQuickActionsMenu({ items, position, onClose }: Props) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed z-[90] w-[200px] liquid-glass-card border border-white/[0.08] rounded-[14px] py-1.5 shadow-[0_16px_48px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
      style={{ top: position.y, left: position.x }}
    >
      {items.map((item, i) => (
        <button
          key={i}
          onClick={() => { item.action(); onClose(); }}
          className={`w-full flex items-center gap-2.5 px-4 py-2 text-[12px] transition-colors cursor-pointer whitespace-nowrap ${
            item.danger
              ? 'text-[#FF5B5B] hover:bg-[#FF5B5B]/8'
              : 'text-[#D8D1E6] hover:bg-[#1A1A2E]/40 hover:text-[#F6F2EA]'
          }`}
        >
          <i className={`${item.icon} text-[#A69DB7] text-sm w-4 text-center`}></i>
          {item.label}
        </button>
      ))}
    </div>
  );
}