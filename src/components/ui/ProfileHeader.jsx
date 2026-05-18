import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function ProfileHeader({ name, email, phone, avatarText, statusNode, extraInfo, actionNode }) {
  return (
    <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--bg-tertiary)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '1.5rem', 
            fontWeight: '600',
            color: 'var(--text-primary)',
            boxShadow: '0 0 0 4px var(--bg-primary)'
          }}>
            {avatarText}
          </div>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>{name}</h1>
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '8px' }}>
              {email} • {phone}
            </div>
            {statusNode}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline">
            <MessageSquare size={16} />
            Message
          </button>
          {actionNode}
        </div>
      </div>

      {/* Grid of stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: '24px',
        paddingTop: '24px',
        borderTop: '1px solid var(--border-color)'
      }}>
        {extraInfo.map((info, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{info.label}</span>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>{info.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
