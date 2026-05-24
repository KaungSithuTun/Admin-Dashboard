import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Search, Eye, EyeOff, LayoutList, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const mockCategories = [
  { id: 1, name: 'Languages', description: 'English, Thai, Japanese, and more', subjectsCount: 12, activeCourses: 38, revenueShare: '38%' },
  { id: 2, name: 'Mathematics', description: 'Algebra, Geometry, Calculus', subjectsCount: 8, activeCourses: 24, revenueShare: '22%' },
  { id: 3, name: 'Music', description: 'Instruments, Vocal, Theory', subjectsCount: 6, activeCourses: 15, revenueShare: '18%' },
  { id: 4, name: 'Arts & design', description: 'Painting, Digital Art', subjectsCount: 4, activeCourses: 10, revenueShare: '8%' },
  { id: 5, name: 'Technology', description: 'Coding, Data Science', subjectsCount: 9, activeCourses: 28, revenueShare: '10%' },
  { id: 6, name: 'Sciences', description: 'Physics, Chemistry, Biology', subjectsCount: 5, activeCourses: 12, revenueShare: '4%' },
];

const mockSubjects = [
  { id: 101, categoryId: 1, name: 'IELTS preparation', activeCourses: 8, teachers: 5, status: 'Visible', slug: 'ielts-preparation' },
  { id: 102, categoryId: 1, name: 'Business English', activeCourses: 7, teachers: 4, status: 'Visible', slug: 'business-english' },
  { id: 103, categoryId: 1, name: 'Conversational English', activeCourses: 6, teachers: 6, status: 'Visible', slug: 'conversational-english' },
  { id: 104, categoryId: 1, name: 'TOEIC', activeCourses: 4, teachers: 3, status: 'Visible', slug: 'toeic' },
  { id: 105, categoryId: 1, name: 'Japanese N5-N2', activeCourses: 5, teachers: 3, status: 'Visible', slug: 'japanese-n5-n2' },
  { id: 106, categoryId: 1, name: 'Thai for foreigners', activeCourses: 3, teachers: 2, status: 'Hidden', slug: 'thai-for-foreigners' },
  { id: 107, categoryId: 1, name: 'Empty Subject', activeCourses: 0, teachers: 0, status: 'Visible', slug: 'empty-subject' }, // For testing deletion
];

const getSubjectDetails = (subjectId) => {
  const details = {
    101: {
      classesCount: 8,
      studentsCount: 12,
      activeClasses: [
        { courseName: 'IELTS Writing Intensive', teacherName: 'K. Somchai', studentName: 'Pimchanok Srisai', startDate: '12 Jan 2024' },
        { courseName: 'IELTS Speaking Practice', teacherName: 'K. Somchai', studentName: 'Nawat Thongchai', startDate: '15 Mar 2024' },
        { courseName: 'IELTS General Training', teacherName: 'S. Priya', studentName: 'Anong Wongkam', startDate: '05 Feb 2024' },
        { courseName: 'IELTS Academic Masterclass', teacherName: 'M. Lee', studentName: 'Korn Pongpan', startDate: '10 Apr 2024' },
      ]
    },
    102: {
      classesCount: 7,
      studentsCount: 9,
      activeClasses: [
        { courseName: 'Business Writing Essentials', teacherName: 'A. Wichit', studentName: 'Anong Wongkam', startDate: '22 Feb 2024' },
        { courseName: 'Executive English Coaching', teacherName: 'A. Wichit', studentName: 'Manee Lertpanich', startDate: '01 May 2024' },
        { courseName: 'Corporate Communications', teacherName: 'K. Somchai', studentName: 'Somchai Rattana', startDate: '18 Apr 2024' },
      ]
    },
    103: {
      classesCount: 6,
      studentsCount: 8,
      activeClasses: [
        { courseName: 'Everyday Conversation', teacherName: 'J. Doe', studentName: 'W. Chalyarat', startDate: '05 May 2024' },
        { courseName: 'Advanced Fluency Workshop', teacherName: 'S. Priya', studentName: 'K. Somkiat', startDate: '12 Feb 2024' },
      ]
    },
    104: {
      classesCount: 4,
      studentsCount: 5,
      activeClasses: [
        { courseName: 'TOEIC Grammar Crash Course', teacherName: 'A. Wichit', studentName: 'P. Srisai', startDate: '20 Mar 2024' },
      ]
    },
    105: {
      classesCount: 5,
      studentsCount: 6,
      activeClasses: [
        { courseName: 'Japanese N5 Basics', teacherName: 'S. Priya', studentName: 'N. Thongchai', startDate: '01 Mar 2024' },
      ]
    },
    106: {
      classesCount: 3,
      studentsCount: 4,
      activeClasses: [
        { courseName: 'Beginner Thai Conversations', teacherName: 'T. Malee', studentName: 'John Smith', startDate: '10 May 2024' },
      ]
    },
    107: {
      classesCount: 0,
      studentsCount: 0,
      activeClasses: []
    }
  };
  
  return details[subjectId] || {
    classesCount: 0,
    studentsCount: 0,
    activeClasses: []
  };
};

export default function Categories() {
  const [categories, setCategories] = useState(mockCategories);
  const [subjects, setSubjects] = useState(mockSubjects);
  const [selectedCategoryId, setSelectedCategoryId] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Modals state
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  
  // Delete Dialog state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // { type: 'subject' | 'category', item: object }
  const [deleteBlockedMsg, setDeleteBlockedMsg] = useState(null);

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const filteredSubjects = subjects.filter(s => 
    s.categoryId === selectedCategoryId && 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubject = () => {
    setEditingSubject(null);
    setIsSubjectModalOpen(true);
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setIsSubjectModalOpen(true);
  };

  const handleDeleteClick = (type, item) => {
    if (item.activeCourses > 0) {
      setDeleteBlockedMsg(`Move or archive ${item.activeCourses} courses before deleting.`);
      setItemToDelete(null);
      setDeleteConfirmOpen(true);
    } else {
      setDeleteBlockedMsg(null);
      setItemToDelete({ type, item });
      setDeleteConfirmOpen(true);
    }
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    
    if (itemToDelete.type === 'subject') {
      setSubjects(subjects.filter(s => s.id !== itemToDelete.item.id));
    } else {
      setCategories(categories.filter(c => c.id !== itemToDelete.item.id));
      if (selectedCategoryId === itemToDelete.item.id) {
        setSelectedCategoryId(categories[0]?.id);
      }
    }
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  const StatusPill = ({ status }) => (
    <span style={{
      padding: '4px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '500',
      backgroundColor: status === 'Visible' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(251, 146, 60, 0.1)', 
      color: status === 'Visible' ? '#4ADE80' : '#FB923C',
      border: `1px solid ${status === 'Visible' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(251, 146, 60, 0.2)'}`
    }}>
      {status}
    </span>
  );

  return (
    <div style={{ paddingBottom: '64px', height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px' }}>Categories & subjects</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Organise courses into categories and manage individual subjects</p>
        </div>
        <button className="btn btn-outline" style={{ display: 'flex', gap: '8px' }}>
          <Plus size={16} /> Add category
        </button>
      </div>

      <div style={{ display: 'flex', gap: '24px', flex: 1, minHeight: 0 }}>
        
        {/* Left Sidebar: Categories */}
        <div className="glass-panel" style={{ width: '280px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="flex-between" style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>CATEGORIES</span>
            <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><Plus size={16}/></button>
          </div>
          <div style={{ overflowY: 'auto', flex: 1, padding: '12px' }}>
            {categories.map(category => (
              <div 
                key={category.id}
                onClick={() => setSelectedCategoryId(category.id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                  backgroundColor: selectedCategoryId === category.id ? 'var(--accent-primary-alpha)' : 'transparent',
                  color: selectedCategoryId === category.id ? 'var(--accent-primary)' : 'var(--text-primary)',
                  marginBottom: '4px',
                  transition: 'var(--transition)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '500' }}>
                  <LayoutList size={18} />
                  {category.name}
                </div>
                <span style={{ fontSize: '0.875rem', color: selectedCategoryId === category.id ? 'var(--accent-primary)' : 'var(--text-secondary)', fontWeight: '600' }}>
                  {category.subjectsCount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Main Panel: Subjects */}
        <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {selectedCategory ? (
            <>
              {/* Category Header */}
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
                <div className="flex-between" style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--accent-primary-alpha)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <LayoutList size={24} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '4px' }}>{selectedCategory.name}</h2>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {selectedCategory.description} • {selectedCategory.subjectsCount} subjects • {selectedCategory.activeCourses} active courses
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-outline" style={{ display: 'flex', gap: '8px' }}><Edit3 size={16}/> Edit category</button>
                    <button className="btn btn-outline" style={{ color: 'var(--danger-text)', borderColor: 'var(--border-color)' }} onClick={() => handleDeleteClick('category', selectedCategory)}><Trash2 size={16}/> Delete</button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div style={{ padding: '16px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Subjects</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{selectedCategory.subjectsCount}</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Active courses</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{selectedCategory.activeCourses}</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Revenue share</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{selectedCategory.revenueShare}</div>
                  </div>
                </div>
              </div>

              {/* Subjects Table Area */}
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div className="flex-between" style={{ marginBottom: '16px' }}>
                  <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="text" 
                      placeholder="Search subjects..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px 8px 36px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none' }}
                    />
                  </div>
                  <button className="btn btn-primary" style={{ display: 'flex', gap: '8px' }} onClick={handleAddSubject}>
                    <Plus size={16} /> Add subject
                  </button>
                </div>

                <div className="table-container" style={{ flex: 1, overflowY: 'auto' }}>
                  <table className="premium-table">
                    <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-secondary)', zIndex: 10 }}>
                      <tr>
                        <th>Subject name</th>
                        <th>Active courses</th>
                        <th>Teachers</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubjects.map(subject => (
                        <tr 
                          key={subject.id} 
                          onClick={() => setSelectedSubject(subject)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td style={{ fontWeight: '500', color: 'var(--accent-primary)', textDecoration: 'underline' }}>{subject.name}</td>
                          <td>{subject.activeCourses}</td>
                          <td>{subject.teachers}</td>
                          <td><StatusPill status={subject.status} /></td>
                          <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                              <button className="btn-icon btn-ghost" onClick={() => handleEditSubject(subject)}><Edit3 size={16}/></button>
                              <button className="btn-icon btn-ghost" style={{ color: 'var(--danger-text)' }} onClick={() => handleDeleteClick('subject', subject)}><Trash2 size={16}/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredSubjects.length === 0 && (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
                            No subjects found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-center" style={{ height: '100%', color: 'var(--text-secondary)' }}>Select a category to view its subjects.</div>
          )}
        </div>
      </div>

      {/* Subject Modal */}
      {isSubjectModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="glass-panel" style={{ width: '480px', padding: '24px' }}>
            <div className="flex-between" style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{editingSubject ? 'Edit subject' : 'Add subject'}</h3>
              <button className="btn-icon btn-ghost" onClick={() => setIsSubjectModalOpen(false)}><X size={20}/></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>Subject name</label>
                <input type="text" defaultValue={editingSubject?.name || ''} placeholder="e.g. Advanced English writing" style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>Category</label>
                <select defaultValue={selectedCategory?.id} style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none', appearance: 'none' }}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>Description (optional)</label>
                <textarea rows={3} placeholder="Brief description shown to students and teachers..." style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none', resize: 'none' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>Slug (URL-safe ID)</label>
                <input type="text" defaultValue={editingSubject?.slug || ''} placeholder="e.g. advanced-english-writing" style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', outline: 'none' }} />
              </div>

              <div className="flex-between" style={{ padding: '16px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>Visible to students and teachers</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Hidden subjects won't appear in browsing.</div>
                </div>
                {/* Mock toggle */}
                <div style={{ width: '40px', height: '20px', borderRadius: '10px', backgroundColor: editingSubject?.status === 'Hidden' ? 'var(--bg-tertiary)' : 'var(--accent-primary)', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#fff', position: 'absolute', top: '2px', left: editingSubject?.status === 'Hidden' ? '2px' : '22px', transition: 'var(--transition)' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn btn-outline" onClick={() => setIsSubjectModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => setIsSubjectModalOpen(false)}>Save subject</button>
            </div>
          </div>
        </div>
      )}

      {/* Subject Detail Modal */}
      {selectedSubject && (() => {
        const details = getSubjectDetails(selectedSubject.id);
        return (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div className="glass-panel" style={{ width: '600px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '85vh', overflowY: 'auto' }}>
              <div className="flex-between">
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{selectedSubject.name}</h3>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Subject in category: <strong>{selectedCategory?.name}</strong>
                  </span>
                </div>
                <button className="btn-icon btn-ghost" onClick={() => setSelectedSubject(null)}><X size={20}/></button>
              </div>

              {/* Stats Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div style={{ padding: '16px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Active classes</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{details.classesCount}</div>
                </div>
                <div style={{ padding: '16px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Total students</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{details.studentsCount}</div>
                </div>
                <div style={{ padding: '16px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Status</div>
                  <div style={{ fontSize: '1rem', fontWeight: '600', marginTop: '6px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', 
                      backgroundColor: selectedSubject.status === 'Visible' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(251, 146, 60, 0.1)', 
                      color: selectedSubject.status === 'Visible' ? '#4ADE80' : '#FB923C' 
                    }}>
                      {selectedSubject.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Classes Detail List */}
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                  Enrolled Classes & Schedule details
                </h4>

                {details.activeClasses.length === 0 ? (
                  <div style={{ padding: '24px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    No active classes registered under this subject.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {details.activeClasses.map((cls, index) => (
                      <div 
                        key={index} 
                        style={{ 
                          padding: '16px', 
                          backgroundColor: 'var(--bg-primary)', 
                          border: '1px solid var(--border-color)', 
                          borderRadius: 'var(--radius-md)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}
                      >
                        <div className="flex-between">
                          <strong style={{ color: 'var(--text-primary)', fontSize: '0.925rem' }}>{cls.courseName}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Started {cls.startDate}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                          <div>
                            Teacher: <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{cls.teacherName}</span>
                          </div>
                          <div>
                            Student: <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{cls.studentName}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button className="btn btn-outline" onClick={() => setSelectedSubject(null)}>Close details</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Custom Delete Dialog (Handles block warnings too) */}
      {deleteConfirmOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="glass-panel" style={{ width: '400px', padding: '24px' }}>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <div className="flex-center" style={{ gap: '12px' }}>
                <div style={{ padding: '8px', borderRadius: '50%', backgroundColor: deleteBlockedMsg ? 'rgba(251, 146, 60, 0.1)' : 'var(--danger-bg)', color: deleteBlockedMsg ? '#FB923C' : 'var(--danger-text)' }}>
                  <AlertTriangle size={20} />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                  {deleteBlockedMsg ? 'Cannot delete' : `Delete ${itemToDelete?.type}`}
                </h3>
              </div>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '24px', lineHeight: '1.6' }}>
              {deleteBlockedMsg || `Are you sure you want to permanently delete "${itemToDelete?.item.name}"? This action cannot be undone.`}
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              {deleteBlockedMsg ? (
                <button className="btn btn-primary" onClick={() => setDeleteConfirmOpen(false)}>Understood</button>
              ) : (
                <>
                  <button className="btn btn-outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</button>
                  <button className="btn btn-danger" onClick={confirmDelete}>Delete permanently</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
