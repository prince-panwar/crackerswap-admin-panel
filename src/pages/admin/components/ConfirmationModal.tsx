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
    danger: 'bg-[#FF5B5B]/20 border-[#FF5B5B]/30 text-[#FF5B5B] hover:bg-[#FF5B5B]/30',
    warning: 'bg-[#FF8A3D]/20 border-[#FF8A3D]/30 text-[#FF8A3D] hover:bg-[#FF8A3D]/30',
    default: 'bg-[#6C4DFF]/20 border-[#6C4DFF]/30 text-[#7B61FF] hover:bg-[#6C4DFF]/30',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-[24px] bg-[#0F0D1A] border border-[#1A1A2E] shadow-[0_24px_80px_rgba(0,0,0,0.6)] overflow-hidden animate-slide-up-in">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              variant === 'danger' ? 'bg-[#FF5B5B]/10 text-[#FF5B5B]' :
              variant === 'warning' ? 'bg-[#FF8A3D]/10 text-[#FF8A3D]' :
              'bg-[#6C4DFF]/10 text-[#7B61FF]'
            }`}>
              <i className={`text-lg ${variant === 'danger' ? 'ri-error-warning-line' : variant === 'warning' ? 'ri-alert-line' : 'ri-question-line'}`}></i>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-[#F6F2EA]">{title}</h3>
              <p className="text-sm text-[#A69DB7] mt-1.5">{description}</p>
            </div>
          </div>

          {children && <div className="mt-4">{children}</div>}

          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-full border border-[#2A2A3E]/60 text-sm font-medium text-[#D8D1E6] hover:bg-[#1A1A2E]/40 transition-all cursor-pointer whitespace-nowrap"
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