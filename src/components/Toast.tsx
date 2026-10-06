import React from 'react';

export interface ToastState {
  show: boolean;
  message: string;
  isAlert?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastProps {
  toast: ToastState;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  if (!toast.show) return null;

  return (
    <div
      role="status"
      className="fixed bottom-20 left-4 right-4 max-w-md mx-auto bg-on-surface text-surface py-3 px-4 rounded-xl shadow-2xl flex items-center justify-between z-50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 border border-surface-container-high/20"
    >
      <div className="flex items-center gap-2.5 min-w-0 pr-2">
        <span className="material-symbols-outlined text-[20px] text-secondary-fixed flex-shrink-0">
          {toast.isAlert ? 'warning' : 'check_circle'}
        </span>
        <span className="font-body-sm text-body-sm text-surface-container-lowest font-medium leading-snug line-clamp-2">
          {toast.message}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {toast.actionLabel && (
          <button
            onClick={() => {
              if (toast.onAction) toast.onAction();
              onClose();
            }}
            className="text-secondary-fixed hover:text-white font-label-sm text-label-sm uppercase font-bold px-2 py-1 rounded hover:bg-surface/10 transition-colors cursor-pointer"
          >
            {toast.actionLabel}
          </button>
        )}
        <button
          onClick={onClose}
          className="text-surface-variant hover:text-white p-1 rounded-full hover:bg-surface/10 transition-colors cursor-pointer"
          aria-label="Dismiss message"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    </div>
  );
};
