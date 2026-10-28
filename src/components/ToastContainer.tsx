import React from 'react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div id="toast-container" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => {
        const iconClass =
          toast.type === 'success'
            ? 'ph ph-check-circle'
            : toast.type === 'error'
            ? 'ph ph-x-circle'
            : 'ph ph-info';

        return (
          <div
            key={toast.id}
            className={`toast toast--${toast.type}`}
            onClick={() => removeToast(toast.id)}
            style={{ cursor: 'pointer' }}
          >
            <i className={iconClass} aria-hidden="true"></i>
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
};
