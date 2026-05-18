import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", isDestructive = true }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '400px',
        padding: '24px',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <div className="flex-center" style={{ gap: '12px' }}>
            {isDestructive && (
              <div style={{
                padding: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--danger-bg)',
                color: 'var(--danger-text)'
              }}>
                <AlertTriangle size={20} />
              </div>
            )}
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>{title}</h3>
          </div>
          <button onClick={onCancel} className="btn-icon btn-ghost">
            <X size={20} />
          </button>
        </div>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '24px', lineHeight: '1.6' }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button className={`btn ${isDestructive ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
