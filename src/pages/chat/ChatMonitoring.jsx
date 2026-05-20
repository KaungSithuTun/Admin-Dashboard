import React, { useState } from 'react';
import { Flag, AlertTriangle, Check, Shield, User, Download, Ban, AlertCircle, Search } from 'lucide-react';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const mockReports = [
  {
    id: 'RPT-0071',
    teacher: 'T. Malee',
    student: 'P. Srisai',
    direction: 'T -> S',
    time: '2h ago',
    snippet: 'If you pay me directly outside the app I can give you a big discount...',
    tags: ['Auto-flagged', 'Off-platform payment', 'High priority'],
    status: 'Open',
    reportedBy: 'System (Keyword: PromptPay)',
    course: 'IELTS Prep',
    messages: [
      { sender: 'teacher', name: 'T. Malee', time: '14 May - 09:00', text: 'Hi Pimchanok, great session today. Your pronunciation is improving a lot!' },
      { sender: 'student', name: 'Pimchanok Srisai', time: '14 May - 09:05', text: 'Thank you! I feel like I\'m getting better. Same time next week?' },
      { sender: 'teacher', name: 'T. Malee', time: '15 May - 08:15', text: 'If you pay me directly via PromptPay instead of the app, I can give you 30% off. The app takes too much commission. Just between us!', isFlagged: true, flagReason: 'Auto-flagged - off-platform payment' },
      { sender: 'student', name: 'Pimchanok Srisai', time: '15 May - 09:20', text: 'I\'m not sure about that... I\'ll think about it.' }
    ]
  },
  {
    id: 'RPT-0072',
    teacher: 'K. Somchai',
    student: 'N. Thongchai',
    direction: 'S -> T',
    time: '5h ago',
    snippet: 'Student reported inappropriate comment during session...',
    tags: ['User-reported', 'Inappropriate content'],
    status: 'Open',
    reportedBy: 'Student',
    course: 'Basic English',
    messages: [
      { sender: 'student', name: 'N. Thongchai', time: '14 May - 10:00', text: 'I felt really uncomfortable when you asked about my personal life.', isFlagged: true, flagReason: 'Reported by Student' }
    ]
  },
  {
    id: 'RPT-0073',
    teacher: 'A. Wongkarn',
    student: 'A. Wichit',
    direction: 'T -> S',
    time: 'Yesterday',
    snippet: 'Auto-flagged: contact information shared outside platform...',
    tags: ['Auto-flagged', 'Contact info'],
    status: 'Open',
    reportedBy: 'System (Regex: Phone number)',
    course: 'Math Grade 9',
    messages: []
  }
];

const mockAllChats = [
  {
    id: 'CHAT-101',
    teacher: 'T. Malee',
    student: 'P. Srisai',
    course: 'IELTS Prep',
    lastMessageDate: '15 May - 09:20',
    messages: [
      { sender: 'teacher', name: 'T. Malee', time: '14 May - 09:00', text: 'Hi Pimchanok, great session today. Your pronunciation is improving a lot!' },
      { sender: 'student', name: 'Pimchanok Srisai', time: '14 May - 09:05', text: 'Thank you! I feel like I\'m getting better. Same time next week?' },
      { sender: 'teacher', name: 'T. Malee', time: '14 May - 09:10', text: 'Yes, same time next week. Please review chapters 4 and 5.' },
      { sender: 'student', name: 'Pimchanok Srisai', time: '14 May - 09:15', text: 'Will do. Thanks!' },
      { sender: 'teacher', name: 'T. Malee', time: '15 May - 08:15', text: 'If you pay me directly via PromptPay instead of the app, I can give you 30% off. The app takes too much commission. Just between us!' },
      { sender: 'student', name: 'Pimchanok Srisai', time: '15 May - 09:20', text: 'I\'m not sure about that... I\'ll think about it.' }
    ]
  },
  {
    id: 'CHAT-102',
    teacher: 'K. Somchai',
    student: 'N. Thongchai',
    course: 'Math Grade 9',
    lastMessageDate: '14 May - 10:15',
    messages: [
      { sender: 'teacher', name: 'K. Somchai', time: '14 May - 09:00', text: 'Hello N. Thongchai, ready for today\'s math lesson?' },
      { sender: 'student', name: 'N. Thongchai', time: '14 May - 09:05', text: 'Yes, I have some questions about algebra.' },
      { sender: 'teacher', name: 'K. Somchai', time: '14 May - 09:50', text: 'By the way, do you have a boyfriend?' },
      { sender: 'student', name: 'N. Thongchai', time: '14 May - 10:00', text: 'I felt really uncomfortable when you asked about my personal life.' },
      { sender: 'teacher', name: 'K. Somchai', time: '14 May - 10:15', text: 'Oh, sorry, just trying to be friendly.' }
    ]
  },
  {
    id: 'CHAT-103',
    teacher: 'A. Wichit',
    student: 'S. Kanya',
    course: 'Physics 101',
    lastMessageDate: '12 May - 16:30',
    messages: [
      { sender: 'student', name: 'S. Kanya', time: '12 May - 16:00', text: 'Hi teacher, I didn\'t understand the homework on thermodynamics.' },
      { sender: 'teacher', name: 'A. Wichit', time: '12 May - 16:15', text: 'No problem! Let\'s go over it in our next session. In the meantime, read page 42.' },
      { sender: 'student', name: 'S. Kanya', time: '12 May - 16:30', text: 'Got it, thank you!' }
    ]
  }
];

export default function ChatMonitoring() {
  const [viewMode, setViewMode] = useState('reports'); // 'reports' | 'search'
  
  const [activeTab, setActiveTab] = useState('Open');
  const [activeReportId, setActiveReportId] = useState(mockReports[0].id);
  const [verdict, setVerdict] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  // Search mode state
  const [searchTutor, setSearchTutor] = useState('');
  const [searchStudent, setSearchStudent] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);

  const activeReport = mockReports.find(r => r.id === activeReportId);
  const searchResults = hasSearched ? mockAllChats.filter(chat => 
    chat.teacher.toLowerCase().includes(searchTutor.toLowerCase()) && 
    chat.student.toLowerCase().includes(searchStudent.toLowerCase())
  ) : [];
  const activeSearchChat = mockAllChats.find(c => c.id === activeChatId);

  const handleSearch = () => {
    setHasSearched(true);
    const results = mockAllChats.filter(chat => 
      chat.teacher.toLowerCase().includes(searchTutor.toLowerCase()) && 
      chat.student.toLowerCase().includes(searchStudent.toLowerCase())
    );
    if (results.length > 0) setActiveChatId(results[0].id);
    else setActiveChatId(null);
  };

  const handleResolve = () => {
    if (!verdict) return;
    setIsResolving(true);
  };

  const confirmResolve = () => {
    console.log('Resolved report', activeReportId, 'with verdict', verdict);
    setIsResolving(false);
    setVerdict('');
  };

  const getTagStyle = (tag) => {
    if (tag === 'High priority' || tag.includes('payment') || tag.includes('Spam') || tag.includes('Harassment')) return { bg: 'rgba(239, 68, 68, 0.1)', color: '#F87171', border: 'rgba(239, 68, 68, 0.2)' };
    if (tag === 'Auto-flagged') return { bg: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: 'var(--border-color)' };
    if (tag === 'User-reported') return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', border: 'rgba(59, 130, 246, 0.2)' };
    return { bg: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: 'var(--border-color)' };
  };

  const renderChatMessages = (messages) => {
    if (!messages || messages.length === 0) {
      return (
        <div className="flex-center" style={{ height: '100%', color: 'var(--text-secondary)' }}>
          No messages available.
        </div>
      );
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {messages.map((msg, idx) => {
          const isTeacher = msg.sender === 'teacher';
          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: isTeacher ? 'flex-start' : 'flex-end' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                {isTeacher && <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>TM</div>}
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{msg.name} • {msg.time}</span>
                {!isTeacher && <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 'bold', color: '#000' }}>PS</div>}
              </div>
              
              <div style={{ 
                maxWidth: '70%', 
                padding: '12px 16px', 
                borderRadius: isTeacher ? '0 16px 16px 16px' : '16px 0 16px 16px',
                backgroundColor: msg.isFlagged ? 'rgba(239, 68, 68, 0.1)' : (isTeacher ? 'var(--bg-tertiary)' : 'var(--accent-primary-alpha)'),
                color: msg.isFlagged ? '#FCA5A5' : (isTeacher ? 'var(--text-primary)' : 'var(--accent-primary)'),
                border: msg.isFlagged ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid transparent',
                position: 'relative'
              }}>
                {msg.isFlagged && (
                  <div style={{ position: 'absolute', top: '-10px', left: '16px', backgroundColor: '#EF4444', color: '#FFF', fontSize: '0.65rem', fontWeight: '600', padding: '2px 8px', borderRadius: '10px', border: '2px solid var(--bg-primary)' }}>
                    {msg.flagReason}
                  </div>
                )}
                <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: '1.5' }}>{msg.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ paddingBottom: '64px', minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px' }}>Chat monitoring & reports</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Review flagged messages and search conversations between users</p>
        </div>
        <div style={{ display: 'flex', backgroundColor: 'var(--bg-secondary)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => setViewMode('reports')}
            className={`btn ${viewMode === 'reports' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '6px 16px', fontSize: '0.875rem', borderRadius: '4px' }}
          >Flagged Reports</button>
          <button 
            onClick={() => setViewMode('search')}
            className={`btn ${viewMode === 'search' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '6px 16px', fontSize: '0.875rem', borderRadius: '4px' }}
          >Search Chats</button>
        </div>
      </div>

      {viewMode === 'reports' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500' }}>Open reports</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px', color: '#F87171' }}>14</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Awaiting review</div>
          </div>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500' }}>Under review</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px', color: '#FBBF24' }}>6</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Assigned to admin</div>
          </div>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500' }}>Resolved (this month)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px' }}>38</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Avg 1.4 days to close</div>
          </div>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500' }}>Auto-flagged messages</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px' }}>22</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>By keyword filter</div>
          </div>
        </div>
      )}

      {/* Two-Panel Layout */}
      <div style={{ display: 'flex', gap: '24px', flex: 1, minHeight: '600px', flexWrap: 'wrap' }}>
        
        {/* Left Panel */}
        <div className="glass-panel" style={{ flex: '1 1 340px', maxWidth: '400px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          {viewMode === 'reports' ? (
            <>
              <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="flex-between" style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Reports queue</span>
                  <div style={{ display: 'flex', backgroundColor: 'var(--bg-primary)', padding: '2px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                    {['Open', 'All'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                          padding: '4px 12px', border: 'none', borderRadius: '2px', fontSize: '0.75rem', fontWeight: '500', cursor: 'pointer',
                          background: activeTab === tab ? 'var(--bg-tertiary)' : 'transparent',
                          color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                        }}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div style={{ overflowY: 'auto', flex: 1, padding: '12px' }}>
                {mockReports.map(report => (
                  <div 
                    key={report.id}
                    onClick={() => setActiveReportId(report.id)}
                    style={{
                      padding: '16px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                      backgroundColor: activeReportId === report.id ? 'var(--accent-primary-alpha)' : 'var(--bg-primary)',
                      border: `1px solid ${activeReportId === report.id ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                      marginBottom: '12px',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div className="flex-between" style={{ marginBottom: '8px' }}>
                      <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{report.teacher} → {report.student}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{report.time}</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      "{report.snippet}"
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {report.tags.map((tag, idx) => {
                        const style = getTagStyle(tag);
                        return (
                          <span key={idx} style={{ 
                            fontSize: '0.7rem', fontWeight: '600', padding: '2px 8px', borderRadius: '4px',
                            backgroundColor: style.bg, color: style.color, border: `1px solid ${style.border}`
                          }}>
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', display: 'block', marginBottom: '16px' }}>Search Chat History</span>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Tutor Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Malee" 
                      value={searchTutor}
                      onChange={(e) => setSearchTutor(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.875rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Student Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Srisai" 
                      value={searchStudent}
                      onChange={(e) => setSearchStudent(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.875rem' }}
                    />
                  </div>
                  <button 
                    onClick={handleSearch}
                    className="btn btn-primary" 
                    style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
                  >
                    <Search size={16} /> Search Messages
                  </button>
                </div>
              </div>

              <div style={{ overflowY: 'auto', flex: 1, padding: '12px' }}>
                {!hasSearched ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '24px' }}>
                    Enter names to search chat history between users.
                  </div>
                ) : searchResults.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '24px' }}>
                    No conversations found.
                  </div>
                ) : (
                  searchResults.map(chat => (
                    <div 
                      key={chat.id}
                      onClick={() => setActiveChatId(chat.id)}
                      style={{
                        padding: '16px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                        backgroundColor: activeChatId === chat.id ? 'var(--accent-primary-alpha)' : 'var(--bg-primary)',
                        border: `1px solid ${activeChatId === chat.id ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                        marginBottom: '12px',
                        transition: 'var(--transition)'
                      }}
                    >
                      <div className="flex-between" style={{ marginBottom: '8px' }}>
                        <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{chat.teacher} ↔ {chat.student}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        Course: <span style={{ color: 'var(--text-primary)' }}>{chat.course}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Last message: {chat.lastMessageDate}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

        </div>

        {/* Right Panel */}
        <div className="glass-panel" style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
          
          {viewMode === 'reports' ? (
            activeReport ? (
              <>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
                  <div className="flex-between" style={{ marginBottom: '16px' }}>
                    <div>
                      <h2 style={{ fontSize: '1.125rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={18} /> {activeReport.teacher} <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '400' }}>(teacher)</span>
                        <span style={{ color: 'var(--text-muted)', margin: '0 8px' }}>↔</span>
                        {activeReport.student} <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '400' }}>(student)</span>
                      </h2>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '6px 12px', display: 'flex', gap: '6px' }}><User size={14}/> View {activeReport.teacher}</button>
                      <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '6px 12px', display: 'flex', gap: '6px' }}><Download size={14}/> Export</button>
                      <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '6px 12px', color: 'var(--danger-text)', borderColor: 'var(--border-color)', display: 'flex', gap: '6px' }}><Ban size={14}/> Suspend</button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)' }}>
                    <Flag size={16} color="#F87171" />
                    <div style={{ fontSize: '0.875rem' }}>
                      <span style={{ color: 'var(--text-primary)' }}>Reported by {activeReport.reportedBy}</span> — 
                      <span style={{ color: 'var(--text-secondary)', marginLeft: '4px' }}>
                        Conversation in {activeReport.course} • Reported {activeReport.time} • Report #{activeReport.id}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '24px', backgroundColor: 'var(--bg-primary)' }}>
                  {renderChatMessages(activeReport.messages)}
                </div>

                <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '12px' }}>ADMIN ACTIONS</div>
                  
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    <button className="btn btn-outline" style={{ display: 'flex', gap: '6px' }}><AlertCircle size={14}/> Warn teacher</button>
                    <button className="btn btn-outline" style={{ display: 'flex', gap: '6px' }}><Ban size={14}/> Suspend teacher</button>
                    <button className="btn btn-outline" style={{ display: 'flex', gap: '6px', color: 'var(--danger-text)', borderColor: 'var(--border-color)' }}><Shield size={14}/> Ban teacher</button>
                    <button className="btn btn-outline" style={{ display: 'flex', gap: '6px' }}>Dismiss report</button>
                  </div>

                  <div className="flex-between" style={{ backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <select 
                      value={verdict} 
                      onChange={(e) => setVerdict(e.target.value)}
                      style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: '0.875rem', fontWeight: '500', minWidth: '200px' }}
                    >
                      <option value="" disabled>Select verdict...</option>
                      <option value="off-platform">Off-platform solicitation</option>
                      <option value="harassment">Harassment / Abuse</option>
                      <option value="spam">Spam</option>
                      <option value="false-alarm">False alarm (Dismiss)</option>
                    </select>
                    
                    <button 
                      className="btn btn-primary" 
                      disabled={!verdict}
                      onClick={handleResolve}
                      style={{ opacity: verdict ? 1 : 0.5, display: 'flex', gap: '8px' }}
                    >
                      <Check size={16} /> Resolve report
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-center" style={{ height: '100%', color: 'var(--text-secondary)' }}>Select a report to view context.</div>
            )
          ) : (
            activeSearchChat ? (
              <>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
                  <div className="flex-between" style={{ marginBottom: '16px' }}>
                    <div>
                      <h2 style={{ fontSize: '1.125rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={18} /> {activeSearchChat.teacher} <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '400' }}>(teacher)</span>
                        <span style={{ color: 'var(--text-muted)', margin: '0 8px' }}>↔</span>
                        {activeSearchChat.student} <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '400' }}>(student)</span>
                      </h2>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '6px 12px', display: 'flex', gap: '6px' }}><Download size={14}/> Export Log</button>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Viewing full communication history for <span style={{ color: 'var(--text-primary)' }}>{activeSearchChat.course}</span>
                  </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '24px', backgroundColor: 'var(--bg-primary)' }}>
                  {renderChatMessages(activeSearchChat.messages)}
                </div>
              </>
            ) : (
              <div className="flex-center" style={{ height: '100%', color: 'var(--text-secondary)' }}>
                {hasSearched && searchResults.length > 0 ? 'Select a conversation to view.' : 'Search and select a conversation to view history.'}
              </div>
            )
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isResolving}
        title="Resolve report"
        message={`Are you sure you want to resolve this report with the verdict: "${verdict}"? This action will be logged.`}
        confirmText="Confirm resolution"
        onConfirm={confirmResolve}
        onCancel={() => setIsResolving(false)}
        isDestructive={false}
      />

    </div>
  );
}
