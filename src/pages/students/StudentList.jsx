import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/ui/SearchBar';
import StatusBadge from '../../components/ui/StatusBadge';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { UserMinus, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

const mockStudents = [
  { id: 1, name: 'Pimchanok Srisai', email: 'pim.srisai@gmail.com', courses: ['IELTS Prep', 'Business Grammar'], lastActive: 'Today', status: 'Active' },
  { id: 2, name: 'Nattawut Thongchai', email: 'natta.wut@outlook.com', courses: ['Math G.9', 'SAT Math'], lastActive: '2 days ago', status: 'Active' },
  { id: 3, name: 'Malee Lertpanich', email: 'malee.lert@yahoo.com', courses: ['Guitar Basics', 'Advanced Theory', 'Vocal Train'], lastActive: '1 week ago', status: 'Passive' },
  { id: 4, name: 'Amyn Wongkam', email: 'amyn.w@hotmail.com', courses: ['IELTS Prep'], lastActive: '3 days ago', status: 'Active' },
  { id: 5, name: 'Kritsada Pongpan', email: 'kritsada.p@gmail.com', courses: ['Business Eng.', 'Math G.9', 'Physics 101'], lastActive: '2 weeks ago', status: 'Passive' },
];

export default function StudentList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [studentToDrop, setStudentToDrop] = useState(null);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleDropClick = (e, student) => {
    e.stopPropagation(); // Prevent row click
    setStudentToDrop(student);
    setIsConfirmOpen(true);
  };

  const handleConfirmDrop = () => {
    console.log(`Dropped student: ${studentToDrop?.name}`);
    setIsConfirmOpen(false);
    setStudentToDrop(null);
  };

  const handleRowClick = (studentId) => {
    navigate(`/students/${studentId}`);
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px' }}>Students</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage all registered students</p>
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>3,218</span> total
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
              <th>Student</th>
              <th>Courses Enrolled</th>
              <th>Last Active</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockStudents.map((student) => (
              <tr key={student.id} onClick={() => handleRowClick(student.id)} className="group">
                <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="avatar">
                    {student.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{student.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{student.email}</div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {student.courses.slice(0, 2).map((course, idx) => (
                      <span key={idx} className="pill">{course}</span>
                    ))}
                    {student.courses.length > 2 && (
                      <span className="pill">+{student.courses.length - 2}</span>
                    )}
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{student.lastActive}</td>
                <td>
                  <StatusBadge status={student.status} />
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', opacity: '0.7', transition: 'var(--transition)' }} className="actions-wrapper">
                    <button className="btn-icon btn-ghost" onClick={(e) => { e.stopPropagation(); handleRowClick(student.id); }}>
                      <Eye size={18} />
                    </button>
                    <button className="btn-icon btn-danger-hover" onClick={(e) => handleDropClick(e, student)}>
                      <UserMinus size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination */}
        <div className="flex-between" style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Showing <span style={{ color: 'var(--text-primary)' }}>1-20</span> of 3,218 students
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-icon btn-outline" disabled><ChevronLeft size={16} /></button>
            <button className="btn-icon btn-outline" style={{ background: 'var(--accent-primary)', color: '#000', borderColor: 'var(--accent-primary)' }}>1</button>
            <button className="btn-icon btn-outline">2</button>
            <button className="btn-icon btn-outline">3</button>
            <span style={{ display: 'flex', alignItems: 'center', padding: '0 8px', color: 'var(--text-muted)' }}>...</span>
            <button className="btn-icon btn-outline">161</button>
            <button className="btn-icon btn-outline"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Drop Student"
        message={`Are you sure you want to drop ${studentToDrop?.name}? They will be removed from all active classes and their account will be disabled. This action requires administrative override to undo.`}
        confirmText="Drop Student"
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
