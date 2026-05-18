import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function KPICard({ title, value, delta, isPositive, icon, linkTo, valueColor = 'var(--text-primary)' }) {
  const navigate = useNavigate();
  
  const content = (
    <div 
      className="glass-panel" 
      style={{ 
        padding: '24px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px',
        cursor: linkTo ? 'pointer' : 'default',
        transition: 'var(--transition)',
        height: '100%'
      }}
      onClick={() => { if(linkTo) navigate(linkTo); }}
      onMouseEnter={(e) => {
        if(linkTo) e.currentTarget.style.borderColor = 'var(--accent-primary)';
      }}
      onMouseLeave={(e) => {
        if(linkTo) e.currentTarget.style.borderColor = 'var(--border-color)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>
        {icon}
        <span>{title}</span>
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: '700', color: valueColor }}>
        {value}
      </div>
      {delta && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: isPositive ? '#4ADE80' : '#F87171', fontWeight: '500' }}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {delta} <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>vs last month</span>
        </div>
      )}
    </div>
  );

  return content;
}
