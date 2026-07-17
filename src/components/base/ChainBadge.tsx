interface ChainBadgeProps {
  chain: string;
  size?: 'sm' | 'md';
}

// Base's blue is Coinbase's actual Base-chain brand color (external, kept
// as-is — not part of this app's own palette). Monad had no real brand color
// here before (it was just this app's own retired orange); it now falls back
// to the app's brand accent (violet) rather than a guessed Monad hex.
const chainStyles: Record<string, { color: string; bg: string }> = {
  Base: { color: 'text-[#0052FF]', bg: 'bg-[#0052FF]/10' },
  Monad: { color: 'text-accent', bg: 'bg-accent-soft' },
};

export default function ChainBadge({ chain, size = 'sm' }: ChainBadgeProps) {
  const style = chainStyles[chain] || { color: 'text-fg-tertiary', bg: 'bg-surface' };
  const sizeClasses = size === 'md' ? 'px-3 py-1.5 text-[13px] gap-2' : 'px-2.5 py-1 text-[11px] gap-1.5';

  return (
    <span className={`inline-flex items-center rounded-full border border-card-border ${style.bg} ${style.color} ${sizeClasses} font-medium`}>
      <i className="ri-circle-fill text-[6px]" />
      {chain}
    </span>
  );
}