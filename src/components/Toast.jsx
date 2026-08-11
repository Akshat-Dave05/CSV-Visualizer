import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return CheckCircle2;
      case 'error': return AlertCircle;
      default: return Info;
    }
  };

  const Icon = getIcon();

  return (
    <div className={`toast-container ${toast.type} animate-fade-in`}>
      <Icon size={18} className="toast-icon" />
      <span className="toast-message">{toast.message}</span>
      <button onClick={onClose} className="toast-close-btn" aria-label="Close notification">
        <X size={14} />
      </button>

      <style>{`
        .toast-container {
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          z-index: 2000;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          font-size: 0.875rem;
          font-weight: 500;
          max-width: 400px;
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          color: var(--text-main);
        }

        .toast-container.success {
          border-color: var(--success-border);
          background-color: var(--success-bg);
          color: var(--success);
        }

        .toast-container.error {
          border-color: var(--error-border);
          background-color: var(--error-bg);
          color: var(--error);
        }

        .toast-icon {
          flex-shrink: 0;
        }

        .toast-message {
          flex: 1;
        }

        .toast-close-btn {
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          opacity: 0.7;
          display: flex;
          align-items: center;
        }

        .toast-close-btn:hover {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
