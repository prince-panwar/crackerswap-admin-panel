interface StatusBadgeProps {
  status: 'Healthy' | 'Low Data' | 'Success' | 'Pending' | 'Failed' | 'Detected';
  size?: 'sm' | 'md';
}

const statusStyles: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Healthy: {
    bg: 'bg-[#34D07F]/10',
    text: 'text-[#34D07F]',
    border: 'border-[#34D07F]/20',
    dot: 'bg-[#34D07F]',
  },
  'Low Data': {
    bg: 'bg-[#FF8A3D]/10',
    text: 'text-[#FF8A3D]',
    border: 'border-[#FF8A3D]/20',
    dot: 'bg-[#FF8A3D]',
  },
  Success: {
    bg: 'bg-[#34D07F]/10',
    text: 'text-[#34D07F]',
    border: 'border-[#34D07F]/20',
    dot: 'bg-[#34D07F]',
  },
  Pending: {
    bg: 'bg-[#FF8A3D]/10',
    text: 'text-[#FF8A3D]',
    border: 'border-[#FF8A3D]/20',
    dot: 'bg-[#FF8A3D]',
  },
  Failed: {
    bg: 'bg-[#FF5B5B]/10',
    text: 'text-[#FF5B5B]',
    border: 'border-[#FF5B5B]/20',
    dot: 'bg-[#FF5B5B]',
  },
  Detected: {
    bg: 'bg-[#6C4DFF]/10',
    text: 'text-[#6C4DFF]',
    border: 'border-[#6C4DFF]/20',
    dot: 'bg-[#6C4DFF]',
  },
};

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const style = statusStyles[status] || statusStyles['Low Data'];
  const sizeClasses = size === 'md' ? 'px-3 py-1.5 text-[13px]' : 'px-2.5 py-1 text-[11px]';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${style.bg} ${style.text} ${style.border} ${sizeClasses} font-medium`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}