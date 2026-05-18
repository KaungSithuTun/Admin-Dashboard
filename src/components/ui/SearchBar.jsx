import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, ChevronDown } from 'lucide-react';

export default function SearchBar({ onSearch, onFilterChange, onExport, totalCount }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'var(--bg-secondary)',
      padding: '16px',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-color)',
      marginBottom: '24px'
    }}>
      {/* Left side: Search */}
      <div style={{ flex: '1 1 300px', position: 'relative' }}>
        <Search 
          size={18} 
          style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }} 
        />
        <input 
          type="text" 
          placeholder="Search by name, email, or course..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 16px 10px 40px',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            outline: 'none',
            transition: 'var(--transition)'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
        />
      </div>

      {/* Right side: Filters & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '16px', borderRight: '1px solid var(--border-color)' }}>
          <button className="btn btn-outline" style={{ display: 'flex', gap: '8px', padding: '8px 12px' }}>
            <Filter size={16} />
            Status
            <ChevronDown size={14} />
          </button>
          
          <button className="btn btn-outline" style={{ display: 'flex', gap: '8px', padding: '8px 12px' }}>
            Course
            <ChevronDown size={14} />
          </button>

          <button className="btn btn-outline" style={{ display: 'flex', gap: '8px', padding: '8px 12px' }}>
            Joined
            <ChevronDown size={14} />
          </button>
        </div>

        <button className="btn btn-primary" onClick={onExport} style={{ display: 'flex', gap: '8px' }}>
          <Download size={16} />
          Export
        </button>
      </div>
    </div>
  );
}
