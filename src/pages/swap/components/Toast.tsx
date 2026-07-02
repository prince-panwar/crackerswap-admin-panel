import { useEffect, useState } from 'react';

interface ToastProps {
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  onClose: () => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const iconClass = {
    success: 'ri-check-line text-[#34D07F]',
    error: 'ri-error-warning-line text-[#FF5B5B]',
    info: 'ri-information-line text-[#6C4DFF]',
  };

  const bgClass = {
    success: 'bg-[#34D07F]/10 border-[#34D07F]/20',
    error: 'bg-[#FF5B5B]/10 border-[#FF5B5B]/20',
    info: 'bg-[#6C4DFF]/10 border-[#6C4DFF]/20',
  };

  return (
    <div className={`fixed top-6 left-1/2 z-[300] transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
      <div className={`flex items-center gap-2.5 px-5 py-3 rounded-[14px] border ${bgClass[toast.type]}`}>
        <i className={`${iconClass[toast.type]} text-lg`}></i>
        <span className="text-[14px] font-medium text-white">{toast.message}</span>
      </div>
    </div>
  );
}