import React from 'react';

export default function StatusBadge({ status }) {
  const isActive = status.toLowerCase() === 'active';
  
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 12px',
      borderRadius: 'var(--radius-full)',
      fontSize: '0.75rem',
      fontWeight: '600',
      textTransform: 'capitalize',
      backgroundColor: isActive ? 'var(--status-active-bg)' : 'var(--status-passive-bg)',
      color: isActive ? 'var(--status-active-text)' : 'var(--status-passive-text)',
      border: `1px solid ${isActive ? 'rgba(74, 222, 128, 0.2)' : 'rgba(161, 161, 170, 0.2)'}`
    }}>
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: isActive ? 'var(--status-active-text)' : 'var(--status-passive-text)',
        boxShadow: isActive ? '0 0 4px var(--status-active-text)' : 'none'
      }} />
      {status}
    </span>
  );
}
