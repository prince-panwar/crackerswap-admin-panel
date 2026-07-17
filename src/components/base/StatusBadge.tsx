interface StatusBadgeProps {
  status: 'Healthy' | 'Low Data' | 'Success' | 'Pending' | 'Failed' | 'Detected';
  size?: 'sm' | 'md';
}

// Colors: `success`/`danger`/`warning` are the frontend's real semantic
// tokens (see src/index.css); `warning` and its `-soft` tint are this app's
// own addition since the frontend has no pending/low-data moderation state.
// "Detected" maps to `accent` (violet) — closer to the frontend's actual
// brand accent than a generic info-blue for a "special/flagged" highlight.
const statusStyles: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Healthy: {
    bg: 'bg-success-soft',
    text: 'text-success',
    border: 'border-success-soft',
    dot: 'bg-success',
  },
  'Low Data': {
    bg: 'bg-warning-soft',
    text: 'text-warning',
    border: 'border-warning-soft',
    dot: 'bg-warning',
  },
  Success: {
    bg: 'bg-success-soft',
    text: 'text-success',
    border: 'border-success-soft',
    dot: 'bg-success',
  },
  Pending: {
    bg: 'bg-warning-soft',
    text: 'text-warning',
    border: 'border-warning-soft',
    dot: 'bg-warning',
  },
  Failed: {
    bg: 'bg-danger-soft',
    text: 'text-danger',
    border: 'border-danger-soft',
    dot: 'bg-danger',
  },
  Detected: {
    bg: 'bg-accent-soft',
    text: 'text-accent',
    border: 'border-accent-soft',
    dot: 'bg-accent',
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