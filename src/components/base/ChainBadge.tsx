interface ChainBadgeProps {
  chain: string;
  size?: 'sm' | 'md';
}

const chainStyles: Record<string, { color: string; bg: string }> = {
  Base: { color: 'text-[#0052FF]', bg: 'bg-[#0052FF]/10' },
  Monad: { color: 'text-[#FF6A1A]', bg: 'bg-[#FF6A1A]/10' },
};

export default function ChainBadge({ chain, size = 'sm' }: ChainBadgeProps) {
  const style = chainStyles[chain] || { color: 'text-[#A69DB7]', bg: 'bg-[#A69DB7]/10' };
  const sizeClasses = size === 'md' ? 'px-3 py-1.5 text-[13px] gap-2' : 'px-2.5 py-1 text-[11px] gap-1.5';

  return (
    <span className={`inline-flex items-center rounded-full border border-[#1A1A2E]/60 ${style.bg} ${style.color} ${sizeClasses} font-medium`}>
      <i className="ri-circle-fill text-[6px]" />
      {chain}
    </span>
  );
}