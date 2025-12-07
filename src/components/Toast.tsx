import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  show: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  show,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, duration]);

  if (!show) return null;

  const bgColor =
    type === 'success'
      ? 'bg-emerald-500'
      : type === 'error'
      ? 'bg-red-500'
      : 'bg-blue-500';

  return (
    <div className={`toast ${show ? 'show' : ''} ${bgColor} text-white`}>
      <div className="flex items-center gap-2">
        {type === 'success' && <i className="fas fa-check-circle"></i>}
        {type === 'error' && <i className="fas fa-exclamation-circle"></i>}
        {type === 'info' && <i className="fas fa-info-circle"></i>}
        <span>{message}</span>
      </div>
    </div>
  );
};

