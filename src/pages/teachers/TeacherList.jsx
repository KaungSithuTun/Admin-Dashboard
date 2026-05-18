import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/ui/SearchBar';
import StatusBadge from '../../components/ui/StatusBadge';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { UserMinus, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

const mockTeachers = [
  { id: 1, name: 'Krittapon Somchai', email: 'krittapon.s@gmail.com', courses: ['IELTS Prep', 'Business English'], lastActive: 'Today', status: 'Active' },
  { id: 2, name: 'Araya Wongkam', email: 'araya.w@outlook.com', courses: ['Conversational Thai'], lastActive: '2 days ago', status: 'Active' },
  { id: 3, name: 'Nattawut Thongchai', email: 'natta.t@yahoo.com', courses: ['TOEIC Intensive'], lastActive: '1 week ago', status: 'Passive' },
];

export default function TeacherList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [teacherToDrop, setTeacherToDrop] = useState(null);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleDropClick = (e, teacher) => {
    e.stopPropagation();
    setTeacherToDrop(teacher);
    setIsConfirmOpen(true);
  };

  const handleConfirmDrop = () => {
    console.log(`Dropped teacher: ${teacherToDrop?.name}`);
    setIsConfirmOpen(false);
    setTeacherToDrop(null);
  };

  const handleRowClick = (teacherId) => {
    navigate(`/teachers/${teacherId}`);
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px' }}>Teachers</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage all registered teachers</p>
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>142</span> total
        </div>
      </div>

      <SearchBar 
        onSearch={handleSearch}
        onExport={() => console.log('Exporting data...')}
      />

      <div className="glass-panel table-container">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Teacher</th>
              <th>Classes Taught</th>
              <th>Last Active</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockTeachers.map((teacher) => (
              <tr key={teacher.id} onClick={() => handleRowClick(teacher.id)} className="group">
                <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="avatar">
                    {teacher.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{teacher.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{teacher.email}</div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {teacher.courses.slice(0, 2).map((course, idx) => (
                      <span key={idx} className="pill">{course}</span>
                    ))}
                    {teacher.courses.length > 2 && (
                      <span className="pill">+{teacher.courses.length - 2}</span>
                    )}
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{teacher.lastActive}</td>
                <td>
                  <StatusBadge status={teacher.status} />
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', opacity: '0.7', transition: 'var(--transition)' }} className="actions-wrapper">
                    <button className="btn-icon btn-ghost" onClick={(e) => { e.stopPropagation(); handleRowClick(teacher.id); }}>
                      <Eye size={18} />
                    </button>
                    <button className="btn-icon btn-danger-hover" onClick={(e) => handleDropClick(e, teacher)}>
                      <UserMinus size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="flex-between" style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Showing <span style={{ color: 'var(--text-primary)' }}>1-20</span> of 142 teachers
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-icon btn-outline" disabled><ChevronLeft size={16} /></button>
            <button className="btn-icon btn-outline" style={{ background: 'var(--accent-primary)', color: '#000', borderColor: 'var(--accent-primary)' }}>1</button>
            <button className="btn-icon btn-outline">2</button>
            <button className="btn-icon btn-outline">3</button>
            <button className="btn-icon btn-outline"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Drop Teacher"
        message={`Are you sure you want to drop ${teacherToDrop?.name}? They will be removed from all active classes and their account will be disabled. Completed sessions will still be paid out.`}
        confirmText="Drop Teacher"
        onConfirm={handleConfirmDrop}
        onCancel={() => setIsConfirmOpen(false)}
      />

      <style>{`
        .btn-danger-hover {
          color: var(--text-secondary);
          background: transparent;
          border: none;
          cursor: pointer;
        }
        .group:hover .btn-danger-hover {
          color: var(--danger-text);
        }
        .group:hover .btn-danger-hover:hover {
          background: var(--danger-bg);
        }
      `}</style>
    </div>
  );
}
