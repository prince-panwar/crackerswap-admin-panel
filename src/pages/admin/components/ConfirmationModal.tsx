interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
  children?: React.ReactNode;
}

export default function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  children,
}: ConfirmationModalProps) {
  if (!open) return null;

  const confirmStyles: Record<string, string> = {
    danger: 'bg-danger-soft border-danger-soft text-danger hover:brightness-110',
    warning: 'bg-warning-soft border-warning-soft text-warning hover:brightness-110',
    default: 'bg-accent-soft border-accent-soft text-accent hover:brightness-110',
  };

  const iconStyles: Record<string, string> = {
    danger: 'bg-danger-soft text-danger',
    warning: 'bg-warning-soft text-warning',
    default: 'bg-accent-soft text-accent',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-overlay-backdrop backdrop-blur-sm" onClick={onClose} />
      <div className="glass-card relative z-10 w-full max-w-md rounded-[24px] overflow-hidden animate-slide-up-in">
        <div className="relative p-6">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconStyles[variant]}`}>
              <i className={`text-lg ${variant === 'danger' ? 'ri-error-warning-line' : variant === 'warning' ? 'ri-alert-line' : 'ri-question-line'}`}></i>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-fg">{title}</h3>
              <p className="text-sm text-fg-tertiary mt-1.5">{description}</p>
            </div>
          </div>

          {children && <div className="mt-4">{children}</div>}

          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-full border border-card-border text-sm font-medium text-fg-secondary hover:bg-surface transition-all cursor-pointer whitespace-nowrap"
            >
              {cancelLabel}
            </button>
            <button
              onClick={() => { onConfirm(); onClose(); }}
              className={`flex-1 px-4 py-2.5 rounded-full border text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${confirmStyles[variant]}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}