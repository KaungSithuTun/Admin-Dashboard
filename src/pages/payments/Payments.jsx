import React, { useState, useMemo } from 'react';
import { 
  Search, Check, X, CreditCard, DollarSign, Clock, Users, 
  ArrowUpRight, AlertTriangle, Send, Download, Ban, 
  Unlock, Play, CheckCircle2, Info, Landmark, Edit2, FileText, BadgeAlert
} from 'lucide-react';

// Initial Mock Data
const initialScreenshots = [
  { 
    id: 'BK-4821', 
    student: 'P. Srisai', 
    studentFull: 'Pimchanok Srisai', 
    course: 'IELTS Prep', 
    courseFull: 'IELTS Preparation',
    amountDue: 3200, 
    submitted: '2h ago', 
    autoCheck: 'Mismatch', 
    status: 'Pending',
    expected: { amount: 3200, refNo: 'REF-20250517-4821', date: '17 May 2025', recipient: 'Platform Co. Ltd.' },
    actual: { amount: 3000, refNo: 'REF-20250517-4821', date: '17 May 2025 09:38', recipient: 'Platform Co. Ltd.' },
    adminNote: '',
    discrepancy: 'Amount mismatch: ฿200 short'
  },
  { 
    id: 'BK-4819', 
    student: 'N. Thongchai', 
    studentFull: 'Nawat Thongchai', 
    course: 'Math Gr.9', 
    courseFull: 'Math Grade 9 - Algebra',
    amountDue: 2800, 
    submitted: '4h ago', 
    autoCheck: 'Unreadable', 
    status: 'Pending',
    expected: { amount: 2800, refNo: 'REF-20250517-4819', date: '17 May 2025', recipient: 'Platform Co. Ltd.' },
    actual: { amount: 0, refNo: 'UNREADABLE', date: 'Unreadable', recipient: 'Unreadable' },
    adminNote: '',
    discrepancy: 'Unreadable image: blurry screenshot'
  },
  { 
    id: 'BK-4816', 
    student: 'A. Wongkam', 
    studentFull: 'Anong Wongkam', 
    course: 'Business Eng.', 
    courseFull: 'Business English - Advanced',
    amountDue: 2400, 
    submitted: 'Yesterday', 
    autoCheck: 'Matched', 
    status: 'Pending',
    expected: { amount: 2400, refNo: 'REF-20250516-4816', date: '16 May 2025', recipient: 'Platform Co. Ltd.' },
    actual: { amount: 2400, refNo: 'REF-20250516-4816', date: '16 May 2025 14:10', recipient: 'Platform Co. Ltd.' },
    adminNote: '',
    discrepancy: ''
  },
  { 
    id: 'BK-4814', 
    student: 'K. Pongpan', 
    studentFull: 'Korn Pongpan', 
    course: 'Guitar Basics', 
    courseFull: 'Acoustic Guitar Basics',
    amountDue: 1800, 
    submitted: '2 days ago', 
    autoCheck: 'Mismatch', 
    status: 'Pending',
    expected: { amount: 1800, refNo: 'REF-20250515-4814', date: '15 May 2025', recipient: 'Platform Co. Ltd.' },
    actual: { amount: 1800, refNo: 'REF-20250515-9999', date: '15 May 2025 11:22', recipient: 'Platform Co. Ltd.' },
    adminNote: '',
    discrepancy: 'Reference number mismatch'
  },
  { 
    id: 'BK-4810', 
    student: 'S. Rattana', 
    studentFull: 'Somchai Rattana', 
    course: 'IELTS Prep', 
    courseFull: 'IELTS Preparation',
    amountDue: 3200, 
    submitted: '3 days ago', 
    autoCheck: 'Mismatch', 
    status: 'Flagged',
    expected: { amount: 3200, refNo: 'REF-20250514-4810', date: '14 May 2025', recipient: 'Platform Co. Ltd.' },
    actual: { amount: 3200, refNo: 'REF-20250514-4810', date: '12 May 2025 08:30', recipient: 'Platform Co. Ltd.' },
    adminNote: 'Date is outside the acceptable booking window (2 days early)',
    discrepancy: 'Date range mismatch'
  }
];

const initialOverdueStudents = [
  { id: 'STU-001', name: 'M. Lertpanich', course: 'Guitar Basics', amount: 1800, dueDate: '14 May', overdueDays: 3, accessBlocked: false },
  { id: 'STU-002', name: 'S. Rattana', course: 'IELTS Prep', amount: 3200, dueDate: '10 May', overdueDays: 7, accessBlocked: false },
  { id: 'STU-003', name: 'W. Chalyarat', course: 'Business Eng.', amount: 2400, dueDate: '12 May', overdueDays: 5, accessBlocked: true },
  { id: 'STU-004', name: 'K. Somkiat', course: 'Math Gr.9', amount: 2800, dueDate: '13 May', overdueDays: 4, accessBlocked: false },
];

const initialTeachers = [
  { id: 'TCH-001', initials: 'KS', name: 'K. Somchai', sessions: 21, courses: 'IELTS Prep, Business Eng.', rate: 1000, commissionRate: 0.10, status: 'Verified', bankDetails: 'Kasikorn Bank (K-Bank) - 012-3-45678-9' },
  { id: 'TCH-002', initials: 'AW', name: 'A. Wichit', sessions: 18, courses: 'Business Eng.', rate: 1000, commissionRate: 0.15, status: 'Verified', bankDetails: 'Siam Commercial Bank (SCB) - 111-2-22222-3' },
  { id: 'TCH-003', initials: 'TM', name: 'T. Malee', sessions: 12, courses: 'Guitar Basics', rate: 800, commissionRate: 0.125, status: 'On hold', bankDetails: 'Bangkok Bank (BBL) - 987-6-54321-0', suspensionReason: 'Suspended · hold payout' },
  { id: 'TCH-004', initials: 'PN', name: 'P. Niran', sessions: 15, courses: 'Math Gr.9', rate: 1000, commissionRate: 0.15, status: 'Blocked', bankDetails: '', blockReason: 'Bank details missing' },
  { id: 'TCH-005', initials: 'SP', name: 'S. Priya', sessions: 10, courses: 'SAT Math', rate: 1000, commissionRate: 0.10, status: 'Verified', bankDetails: 'Krungthai Bank (KTB) - 555-5-55555-5' },
];

export default function Payments() {
  // Page States
  const [screenshots, setScreenshots] = useState(initialScreenshots);
  const [selectedScreenshotId, setSelectedScreenshotId] = useState('BK-4821');
  const [verificationSearch, setVerificationSearch] = useState('');
  const [verificationTab, setVerificationTab] = useState('Pending'); // 'Pending', 'Flagged', 'Verified'
  
  const [overdueStudents, setOverdueStudents] = useState(initialOverdueStudents);
  const [overdueSearch, setOverdueSearch] = useState('');
  const [overdueTab, setOverdueTab] = useState('3days'); // '3days', 'All'

  const [teachers, setTeachers] = useState(initialTeachers);
  const [selectedTeacherId, setSelectedTeacherId] = useState('TCH-001');
  const [teacherSearch, setTeacherSearch] = useState('');
  const [teacherFilter, setTeacherFilter] = useState('All'); // 'All', 'Unpaid', 'Paid'

  // Modal State for Fixing Bank Details
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [bankDetailsInput, setBankDetailsInput] = useState('');

  // Toast System
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Selected Screenshot Detail
  const selectedScreenshot = useMemo(() => {
    return screenshots.find(s => s.id === selectedScreenshotId) || screenshots[0];
  }, [screenshots, selectedScreenshotId]);

  // Selected Teacher Detail
  const selectedTeacher = useMemo(() => {
    return teachers.find(t => t.id === selectedTeacherId) || teachers[0];
  }, [teachers, selectedTeacherId]);

  // Derived KPIs
  const kpis = useMemo(() => {
    const pendingCount = screenshots.filter(s => s.status === 'Pending').length;
    const flaggedCount = screenshots.filter(s => s.status === 'Flagged').length;
    const verifiedCount = screenshots.filter(s => s.status === 'Verified').length;
    
    const overdueCount = overdueStudents.length;
    
    // Teacher payouts due calculation
    const duePayoutAmount = teachers
      .filter(t => t.status !== 'Paid')
      .reduce((sum, t) => sum + (t.sessions * t.rate * (1 - t.commissionRate)), 0);

    return {
      pending: pendingCount,
      flagged: flaggedCount,
      overdue: overdueCount,
      payoutDue: duePayoutAmount,
      autoVerified: 312 + verifiedCount, // offset mock
      matchRate: 84
    };
  }, [screenshots, overdueStudents, teachers]);

  // Filtered Screenshots
  const filteredScreenshots = useMemo(() => {
    return screenshots.filter(s => {
      const matchesSearch = s.studentFull.toLowerCase().includes(verificationSearch.toLowerCase()) ||
                            s.student.toLowerCase().includes(verificationSearch.toLowerCase()) ||
                            s.id.toLowerCase().includes(verificationSearch.toLowerCase());
      
      const matchesTab = s.status === verificationTab;
      return matchesSearch && matchesTab;
    });
  }, [screenshots, verificationSearch, verificationTab]);

  // Filtered Overdue Students
  const filteredOverdueStudents = useMemo(() => {
    return overdueStudents.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(overdueSearch.toLowerCase()) ||
                            student.course.toLowerCase().includes(overdueSearch.toLowerCase());
      
      if (overdueTab === '3days') {
        return matchesSearch && student.overdueDays >= 3;
      }
      return matchesSearch;
    });
  }, [overdueStudents, overdueSearch, overdueTab]);

  // Filtered Teachers
  const filteredTeachers = useMemo(() => {
    return teachers.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
                            t.courses.toLowerCase().includes(teacherSearch.toLowerCase());
      
      let matchesFilter = true;
      if (teacherFilter === 'Paid') {
        matchesFilter = t.status === 'Paid';
      } else if (teacherFilter === 'Unpaid') {
        matchesFilter = t.status !== 'Paid';
      }
      
      return matchesSearch && matchesFilter;
    });
  }, [teachers, teacherSearch, teacherFilter]);

  // Handlers for Receipt Manual Verification
  const handleApproveFull = (id) => {
    setScreenshots(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, status: 'Verified', autoCheck: 'Matched' };
      }
      return s;
    }));
    showToast(`Payment for #${id} approved in full!`, 'success');
  };

  const handleApprovePartial = (id, shortAmount = 200) => {
    setScreenshots(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, status: 'Verified', actual: { ...s.actual, amount: s.expected.amount - shortAmount } };
      }
      return s;
    }));
    showToast(`Approved partial payment. Sent request for ฿${shortAmount} balance to student.`, 'info');
  };

  const handleRejectReceipt = (id) => {
    setScreenshots(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, status: 'Flagged', autoCheck: 'Mismatch' };
      }
      return s;
    }));
    showToast(`Rejected receipt for #${id}. Student notified.`, 'error');
  };

  const handleAdminNoteChange = (id, val) => {
    setScreenshots(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, adminNote: val };
      }
      return s;
    }));
  };

  // Overdue Tracker Handlers
  const handleSendReminders = () => {
    showToast(`Payment reminders sent to ${filteredOverdueStudents.length} overdue students!`, 'success');
  };

  const toggleStudentAccess = (id) => {
    setOverdueStudents(prev => prev.map(s => {
      if (s.id === id) {
        const nextState = !s.accessBlocked;
        showToast(`${s.name}'s course access has been ${nextState ? 'blocked' : 'restored'}.`, nextState ? 'error' : 'success');
        return { ...s, accessBlocked: nextState };
      }
      return s;
    }));
  };

  // Payout Queue Handlers
  const handlePayTeacher = (id) => {
    setTeachers(prev => prev.map(t => {
      if (t.id === id) {
        const netAmount = t.sessions * t.rate * (1 - t.commissionRate);
        showToast(`Payout of ฿${netAmount.toLocaleString()} paid to ${t.name}!`, 'success');
        return { ...t, status: 'Paid' };
      }
      return t;
    }));
  };

  const openBankModal = (teacher) => {
    setEditingTeacher(teacher);
    setBankDetailsInput(teacher.bankDetails);
    setIsBankModalOpen(true);
  };

  const handleSaveBankDetails = () => {
    if (!editingTeacher) return;
    setTeachers(prev => prev.map(t => {
      if (t.id === editingTeacher.id) {
        const updatedStatus = bankDetailsInput.trim() ? 'Verified' : 'Blocked';
        showToast(`Updated bank details for ${t.name}. Status is now ${updatedStatus}.`, 'success');
        return { ...t, bankDetails: bankDetailsInput, status: updatedStatus };
      }
      return t;
    }));
    setIsBankModalOpen(false);
    setEditingTeacher(null);
  };

  // Helper colors
  const getAutoCheckBadge = (chk) => {
    switch (chk) {
      case 'Matched':
        return <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>Matched</span>;
      case 'Unreadable':
        return <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.2)' }}>Unreadable</span>;
      case 'Mismatch':
      default:
        return <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.2)' }}>Mismatch</span>;
    }
  };

  const getPayoutStatusBadge = (status) => {
    switch (status) {
      case 'Verified':
        return <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>Verified</span>;
      case 'On hold':
        return <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.2)' }}>On hold</span>;
      case 'Blocked':
        return <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.2)' }}>Blocked</span>;
      case 'Paid':
        return <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', border: '1px solid rgba(59, 130, 246, 0.2)' }}>Paid</span>;
      default:
        return <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{status}</span>;
    }
  };

  return (
    <div style={{ paddingBottom: '64px' }}>
      
      {/* Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 20px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: toast.type === 'error' ? 'var(--danger-bg)' : toast.type === 'info' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
          border: `1px solid ${toast.type === 'error' ? '#F87171' : toast.type === 'info' ? '#3B82F6' : '#10B981'}`,
          color: toast.type === 'error' ? '#F87171' : toast.type === 'info' ? '#93C5FD' : '#4ADE80',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(8px)',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <CheckCircle2 size={18} />
          <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px' }}>Payment Systems</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Verify student transactions, track unpaid student accounts, and process teacher payouts.</p>
        </div>
        <div>
          <button className="btn btn-outline" style={{ display: 'flex', gap: '8px' }}>
            <Download size={16} /> Export financial records
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <Clock size={16} color="#F59E0B" />
            <span>Pending verification</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#F59E0B' }}>
            {kpis.pending + kpis.flagged}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {kpis.pending} awaiting review · {kpis.flagged} flagged
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <AlertTriangle size={16} color="#F87171" />
            <span>Unpaid students</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#F87171' }}>
            {kpis.overdue}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Invoice overdue by 3+ days
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <DollarSign size={16} color="var(--accent-primary)" />
            <span>Teacher payouts due</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>
            ฿{kpis.payoutDue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            End of May cycle · {teachers.filter(t=>t.status !== 'Paid').length} teachers due
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <Check size={16} color="#10B981" />
            <span>Auto-verified (this month)</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#10B981' }}>
            {kpis.autoVerified}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {kpis.matchRate}% matching OCR accuracy rate
          </div>
        </div>
      </div>

      {/* STUDENT PAYMENT VERIFICATION SCREEN */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Student Payment Verification — Screenshot Queue
        </h2>

        {/* Automation Disclaimer Box */}
        <div style={{
          display: 'flex',
          gap: '12px',
          padding: '14px 18px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(245, 158, 11, 0.05)',
          border: '1px solid rgba(245, 158, 11, 0.15)',
          color: '#F59E0B',
          fontSize: '0.875rem',
          lineHeight: '1.45',
          marginBottom: '20px'
        }}>
          <Info size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Automation checks</strong> each screenshot for amount, date, and reference number. 
            Matches are auto-approved. Mismatches and unreadable screenshots are flagged for manual review below.
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search by student name..."
              value={verificationSearch}
              onChange={(e) => setVerificationSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['Pending', 'Flagged', 'Verified'].map(tab => (
              <button 
                key={tab}
                onClick={() => setVerificationTab(tab)}
                className="btn"
                style={{
                  padding: '8px 16px',
                  backgroundColor: verificationTab === tab ? 'var(--bg-tertiary)' : 'transparent',
                  border: `1px solid ${verificationTab === tab ? 'var(--text-muted)' : 'transparent'}`,
                  borderRadius: 'var(--radius-md)',
                  color: verificationTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)'
                }}
              >
                {tab} ({screenshots.filter(s => s.status === tab).length})
              </button>
            ))}
            <button className="btn btn-outline" style={{ display: 'flex', gap: '6px' }}><Download size={14}/> Export</button>
          </div>
        </div>

        {/* Verification Queue Table */}
        <div className="table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Booking</th>
                <th>Student</th>
                <th>Course</th>
                <th>Amount Due</th>
                <th>Submitted</th>
                <th>Auto-Check</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredScreenshots.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                    No receipts found for this view.
                  </td>
                </tr>
              ) : (
                filteredScreenshots.map(item => (
                  <tr 
                    key={item.id} 
                    onClick={() => setSelectedScreenshotId(item.id)}
                    style={{ 
                      backgroundColor: selectedScreenshotId === item.id ? 'var(--bg-tertiary)' : 'transparent',
                    }}
                  >
                    <td>
                      <span style={{ color: 'var(--accent-primary)', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}>
                        #{item.id}
                      </span>
                    </td>
                    <td style={{ fontWeight: '500' }}>{item.studentFull}</td>
                    <td>{item.course}</td>
                    <td style={{ fontWeight: '600' }}>฿{item.amountDue.toLocaleString()}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{item.submitted}</td>
                    <td>{getAutoCheckBadge(item.autoCheck)}</td>
                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button 
                          className="btn-icon btn-ghost" 
                          title="View detail & receipt" 
                          onClick={() => setSelectedScreenshotId(item.id)}
                          style={{ color: selectedScreenshotId === item.id ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
                        >
                          <FileText size={16} />
                        </button>
                        {item.status !== 'Verified' && (
                          <>
                            <button 
                              className="btn-icon btn-ghost" 
                              style={{ color: '#10B981' }} 
                              title="Quick approve"
                              onClick={() => handleApproveFull(item.id)}
                            >
                              <Check size={16} />
                            </button>
                            <button 
                              className="btn-icon btn-ghost" 
                              style={{ color: '#F87171' }} 
                              title="Quick reject"
                              onClick={() => handleRejectReceipt(item.id)}
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Screenshot Detail & Manual Verification Split-Screen Panel */}
        {selectedScreenshot && (
          <div style={{
            marginTop: '24px',
            padding: '24px',
            borderTop: '1px solid var(--border-color)',
            backgroundColor: 'rgba(255, 255, 255, 0.01)',
            borderRadius: 'var(--radius-lg)'
          }}>
            <div className="flex-between" style={{ marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Screenshot Detail & Manual Verification — Booking #{selectedScreenshot.id}
                </h3>
                <div style={{ fontSize: '1.125rem', fontWeight: '700', marginTop: '4px' }}>
                  {selectedScreenshot.studentFull} — {selectedScreenshot.courseFull} · ฿{selectedScreenshot.amountDue.toLocaleString()} due
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Screenshot submitted 17 May - 09:41 · Auto-check result: {selectedScreenshot.discrepancy || 'Matched'}
                </div>
              </div>
              <div>
                {selectedScreenshot.status === 'Verified' ? (
                  <span style={{ padding: '6px 14px', borderRadius: 'var(--radius-full)', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#4ADE80', fontWeight: '600', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '0.875rem' }}>
                    Payment Verified
                  </span>
                ) : (
                  <span style={{ padding: '6px 14px', borderRadius: 'var(--radius-full)', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#F87171', fontWeight: '600', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.875rem' }}>
                    {selectedScreenshot.autoCheck} details
                  </span>
                )}
              </div>
            </div>

            {/* Comparison Side-by-Side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '32px', marginBottom: '24px' }}>
              
              {/* PromptPay Receipt Render */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>Payment Screenshot</div>
                
                {/* PromptPay CSS mockup */}
                <div style={{
                  background: '#FFFFFF',
                  color: '#1A202C',
                  fontFamily: 'system-ui, sans-serif',
                  padding: '24px 20px',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  border: '1px solid #E2E8F0',
                  position: 'relative'
                }}>
                  {/* PromptPay header logo */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px dashed #E2E8F0', paddingBottom: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <div style={{ width: '16px', height: '16px', backgroundColor: '#00549A', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: '0.6rem', fontWeight: 'bold' }}>฿</div>
                      <span style={{ color: '#00549A', fontWeight: '800', fontSize: '0.875rem', letterSpacing: '-0.02em' }}>Prompt Pay</span>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: '#718096' }}>Successful Transaction</span>
                  </div>

                  {/* Receipt details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.75rem' }}>
                    <div className="flex-between">
                      <span style={{ color: '#718096' }}>To</span>
                      <strong style={{ color: '#2D3748' }}>Platform Co. Ltd.</strong>
                    </div>
                    
                    <div className="flex-between">
                      <span style={{ color: '#718096' }}>Ref no.</span>
                      <strong style={{ color: '#2D3748', fontFamily: 'monospace' }}>
                        {selectedScreenshot.actual.refNo}
                      </strong>
                    </div>

                    <div className="flex-between">
                      <span style={{ color: '#718096' }}>Date</span>
                      <strong style={{ color: '#2D3748' }}>{selectedScreenshot.actual.date}</strong>
                    </div>

                    <div style={{ height: '1px', backgroundColor: '#E2E8F0', margin: '4px 0' }} />

                    <div className="flex-between" style={{ padding: '8px 0' }}>
                      <span style={{ color: '#718096', fontSize: '0.875rem', fontWeight: '500' }}>Amount</span>
                      <strong style={{ 
                        fontSize: '1.25rem', 
                        color: selectedScreenshot.autoCheck === 'Mismatch' && selectedScreenshot.expected.amount !== selectedScreenshot.actual.amount ? '#E53E3E' : '#2F855A'
                      }}>
                        ฿{(selectedScreenshot.actual.amount || 0).toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  {/* Watermark/Verified check */}
                  {selectedScreenshot.status === 'Verified' && (
                    <div style={{
                      position: 'absolute',
                      top: '40%',
                      left: '50%',
                      transform: 'translate(-50%, -50%) rotate(-15deg)',
                      border: '3px solid rgba(47, 133, 90, 0.4)',
                      color: 'rgba(47, 133, 90, 0.6)',
                      borderRadius: '8px',
                      padding: '4px 12px',
                      fontSize: '1.125rem',
                      fontWeight: 'bold',
                      pointerEvents: 'none',
                      textTransform: 'uppercase'
                    }}>
                      Approved
                    </div>
                  )}
                </div>

                <button className="btn btn-outline" style={{ width: '100%', marginTop: '12px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <Search size={14} /> View full image
                </button>
              </div>

              {/* Match Comparison & Notes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Verification Checkpoints</div>
                
                <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: 'var(--bg-primary)' }}>
                  
                  {/* Expected vs Actual details */}
                  <div className="flex-between" style={{ fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Expected amount</span>
                    <strong style={{ color: 'var(--text-primary)' }}>฿{selectedScreenshot.expected.amount.toLocaleString()}</strong>
                  </div>

                  <div className="flex-between" style={{ fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Screenshot amount</span>
                    {selectedScreenshot.expected.amount !== selectedScreenshot.actual.amount ? (
                      <span style={{ color: '#F87171', fontWeight: '600' }}>
                        ฿{(selectedScreenshot.actual.amount || 0).toLocaleString()} — ฿{(selectedScreenshot.expected.amount - selectedScreenshot.actual.amount).toLocaleString()} short
                      </span>
                    ) : (
                      <span style={{ color: '#4ADE80', fontWeight: '600' }}>
                        ฿{selectedScreenshot.actual.amount.toLocaleString()} (Correct)
                      </span>
                    )}
                  </div>

                  <div style={{ height: '1px', background: 'var(--border-color)' }} />

                  <div className="flex-between" style={{ fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Reference number</span>
                    <span style={{ 
                      color: selectedScreenshot.expected.refNo === selectedScreenshot.actual.refNo ? '#4ADE80' : '#F87171',
                      fontWeight: '500'
                    }}>
                      {selectedScreenshot.actual.refNo} {selectedScreenshot.expected.refNo === selectedScreenshot.actual.refNo ? '✓' : '✗'}
                    </span>
                  </div>

                  <div className="flex-between" style={{ fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Payment date</span>
                    <span style={{ color: '#4ADE80', fontWeight: '500' }}>
                      {selectedScreenshot.expected.date} ✓
                    </span>
                  </div>

                  <div className="flex-between" style={{ fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Recipient name</span>
                    <span style={{ color: '#4ADE80', fontWeight: '500' }}>
                      {selectedScreenshot.expected.recipient} ✓
                    </span>
                  </div>

                  <div style={{ height: '1px', background: 'var(--border-color)' }} />

                  <div className="flex-between" style={{ fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Auto-check result</span>
                    {selectedScreenshot.status === 'Verified' ? (
                      <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#4ADE80' }}>
                        Success: Match
                      </span>
                    ) : (
                      <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#F87171' }}>
                        {selectedScreenshot.discrepancy || 'Manual Review Required'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Admin Note Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Admin note</label>
                  <textarea 
                    rows={2} 
                    placeholder="Add a note explaining your action before approving or rejecting..."
                    value={selectedScreenshot.adminNote}
                    onChange={(e) => handleAdminNoteChange(selectedScreenshot.id, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      resize: 'none',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

              </div>
            </div>

            {/* Resolution buttons */}
            <div className="flex-between" style={{ flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleApproveFull(selectedScreenshot.id)}
                  disabled={selectedScreenshot.status === 'Verified'}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000', backgroundColor: selectedScreenshot.status === 'Verified' ? 'var(--border-color)' : 'var(--accent-primary)' }}
                >
                  <Check size={16} /> Approve — mark paid
                </button>
                <button 
                  className="btn btn-outline" 
                  onClick={() => handleApprovePartial(selectedScreenshot.id)}
                  disabled={selectedScreenshot.status === 'Verified'}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F59E0B', borderColor: 'rgba(245, 158, 11, 0.3)' }}
                >
                  <Edit2 size={16} /> Approve partial — request ฿200 balance
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={() => handleRejectReceipt(selectedScreenshot.id)}
                  disabled={selectedScreenshot.status === 'Verified'}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <X size={16} /> Reject — notify student
                </button>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={14} color="#10B981" /> Auto-verified if matched
                </span>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* UNPAID STUDENTS — OVERDUE TRACKER */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Unpaid Students — Overdue Tracker
        </h2>

        {/* Filter bar */}
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search student or course..."
              value={overdueSearch}
              onChange={(e) => setOverdueSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setOverdueTab('3days')}
              className="btn"
              style={{
                padding: '8px 16px',
                backgroundColor: overdueTab === '3days' ? 'var(--bg-tertiary)' : 'transparent',
                border: `1px solid ${overdueTab === '3days' ? 'var(--text-muted)' : 'transparent'}`,
                borderRadius: 'var(--radius-md)',
                color: overdueTab === '3days' ? 'var(--text-primary)' : 'var(--text-secondary)'
              }}
            >
              Overdue 3+ days
            </button>
            <button 
              onClick={() => setOverdueTab('All')}
              className="btn"
              style={{
                padding: '8px 16px',
                backgroundColor: overdueTab === 'All' ? 'var(--bg-tertiary)' : 'transparent',
                border: `1px solid ${overdueTab === 'All' ? 'var(--text-muted)' : 'transparent'}`,
                borderRadius: 'var(--radius-md)',
                color: overdueTab === 'All' ? 'var(--text-primary)' : 'var(--text-secondary)'
              }}
            >
              All unpaid
            </button>
            <button 
              onClick={handleSendReminders}
              className="btn" 
              style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--accent-primary)', color: '#000' }}
            >
              <Send size={14} /> Send reminders
            </button>
          </div>
        </div>

        {/* Overdue Tracker Table */}
        <div className="table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Amount</th>
                <th>Due date</th>
                <th>Overdue by</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOverdueStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                    No overdue students in this filter.
                  </td>
                </tr>
              ) : (
                filteredOverdueStudents.map(student => (
                  <tr key={student.id}>
                    <td style={{ fontWeight: '500' }}>{student.name}</td>
                    <td>{student.course}</td>
                    <td style={{ fontWeight: '600' }}>฿{student.amount.toLocaleString()}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{student.dueDate}</td>
                    <td>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: 'var(--radius-full)', 
                        fontSize: '0.75rem', 
                        fontWeight: '600', 
                        backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                        color: '#F87171' 
                      }}>
                        {student.overdueDays} days
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
                        <button className="btn-icon btn-ghost" title="View student account logs">
                          <Info size={16} />
                        </button>
                        
                        {student.accessBlocked ? (
                          <button 
                            className="btn btn-outline" 
                            style={{ 
                              padding: '4px 12px', 
                              fontSize: '0.75rem', 
                              borderColor: '#10B981', 
                              color: '#10B981',
                              display: 'flex',
                              gap: '4px' 
                            }}
                            onClick={() => toggleStudentAccess(student.id)}
                          >
                            <Unlock size={12} /> Restore access
                          </button>
                        ) : (
                          <button 
                            className="btn btn-outline" 
                            style={{ 
                              padding: '4px 12px', 
                              fontSize: '0.75rem', 
                              borderColor: '#F87171', 
                              color: '#F87171',
                              display: 'flex',
                              gap: '4px' 
                            }}
                            onClick={() => toggleStudentAccess(student.id)}
                          >
                            <Ban size={12} /> Block access
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TEACHER PAYOUT QUEUE */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px', marginBottom: '32px' }}>
        
        {/* Left Side: Payout Queue */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Teacher Payout Queue — May 2025
              </h2>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Teachers awaiting payout</span>
            </div>
          </div>

          {/* Teacher Filter Toolbar */}
          <div className="flex-between" style={{ marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search teacher name or subject..."
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {['All', 'Unpaid', 'Paid'].map(filterTab => (
                <button 
                  key={filterTab}
                  onClick={() => setTeacherFilter(filterTab)}
                  className="btn"
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.825rem',
                    backgroundColor: teacherFilter === filterTab ? 'var(--bg-tertiary)' : 'transparent',
                    border: `1px solid ${teacherFilter === filterTab ? 'var(--text-muted)' : 'transparent'}`,
                    borderRadius: 'var(--radius-md)',
                    color: teacherFilter === filterTab ? 'var(--text-primary)' : 'var(--text-secondary)'
                  }}
                >
                  {filterTab} ({
                    filterTab === 'All' ? teachers.length :
                    filterTab === 'Paid' ? teachers.filter(t => t.status === 'Paid').length :
                    teachers.filter(t => t.status !== 'Paid').length
                  })
                </button>
              ))}
              <button className="btn btn-outline" style={{ display: 'flex', gap: '6px', padding: '6px 12px', fontSize: '0.825rem' }}><Download size={14}/> Export</button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredTeachers.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No teachers found matching search or filter.
              </div>
            ) : (
              filteredTeachers.map(teacher => {
                const netAmount = teacher.sessions * teacher.rate * (1 - teacher.commissionRate);
                const isSelected = selectedTeacherId === teacher.id;
                
                return (
                  <div 
                    key={teacher.id}
                    onClick={() => setSelectedTeacherId(teacher.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      borderRadius: 'var(--radius-lg)',
                      border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                      backgroundColor: isSelected ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div className="avatar" style={{ backgroundColor: 'var(--bg-primary)' }}>
                        {teacher.initials}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{teacher.name}</span>
                          {teacher.status === 'On hold' && (
                            <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}>
                              Suspended · hold payout
                            </span>
                          )}
                          {teacher.status === 'Blocked' && (
                            <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#F87171' }}>
                              Bank details missing
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {teacher.sessions} sessions · {teacher.courses}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '700', fontSize: '1.05rem' }}>
                          ฿{netAmount.toLocaleString()}
                        </div>
                        <div style={{ marginTop: '4px' }}>
                          {getPayoutStatusBadge(teacher.status)}
                        </div>
                      </div>

                      <div onClick={(e) => e.stopPropagation()}>
                        {teacher.status === 'Verified' && (
                          <button 
                            className="btn btn-outline" 
                            style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                            onClick={() => handlePayTeacher(teacher.id)}
                          >
                            Pay now
                          </button>
                        )}
                        {teacher.status === 'Blocked' && (
                          <button 
                            className="btn btn-outline" 
                            style={{ fontSize: '0.75rem', padding: '6px 12px', color: '#F87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                            onClick={() => openBankModal(teacher)}
                          >
                            Fix details
                          </button>
                        )}
                        {(teacher.status === 'On hold' || teacher.status === 'Paid') && (
                          <button 
                            className="btn btn-outline" 
                            disabled 
                            style={{ fontSize: '0.75rem', padding: '6px 12px', opacity: 0.4 }}
                          >
                            Pay now
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: selected Teacher payout details */}
        {selectedTeacher && (
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '20px' }}>
                Payout Calculation Breakdown
              </h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div className="avatar" style={{ width: '48px', height: '48px', fontSize: '1.125rem' }}>
                  {selectedTeacher.initials}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: '700' }}>{selectedTeacher.name}</h4>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Payout cycle: May 2025
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <div className="flex-between" style={{ fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Sessions Completed</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{selectedTeacher.sessions} sessions</strong>
                </div>

                <div className="flex-between" style={{ fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Base Teacher Rate</span>
                  <strong style={{ color: 'var(--text-primary)' }}>฿{selectedTeacher.rate.toLocaleString()} / hr</strong>
                </div>

                <div className="flex-between" style={{ fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Gross Earnings</span>
                  <strong style={{ color: 'var(--text-primary)' }}>฿{(selectedTeacher.sessions * selectedTeacher.rate).toLocaleString()}</strong>
                </div>

                <div className="flex-between" style={{ fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Commission Deducted ({selectedTeacher.commissionRate * 100}%)</span>
                  <strong style={{ color: '#F87171' }}>-฿{(selectedTeacher.sessions * selectedTeacher.rate * selectedTeacher.commissionRate).toLocaleString()}</strong>
                </div>

                <div style={{ height: '1px', background: 'var(--border-color)', margin: '4px 0' }} />

                <div className="flex-between" style={{ fontSize: '1rem', fontWeight: '700' }}>
                  <span style={{ color: 'var(--text-primary)' }}>Net payout due</span>
                  <span style={{ color: 'var(--accent-primary)' }}>
                    ฿{(selectedTeacher.sessions * selectedTeacher.rate * (1 - selectedTeacher.commissionRate)).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '16px', backgroundColor: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Landmark size={14} /> Bank Transfer Details
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: selectedTeacher.bankDetails ? 'var(--text-primary)' : '#F87171' }}>
                  {selectedTeacher.bankDetails || 'No bank account details provided yet. Payout blocked.'}
                </div>
                {selectedTeacher.status === 'Blocked' && (
                  <button 
                    className="btn btn-outline" 
                    style={{ fontSize: '0.75rem', padding: '6px 12px', marginTop: '8px', alignSelf: 'flex-start' }}
                    onClick={() => openBankModal(selectedTeacher)}
                  >
                    <Edit2 size={12} /> Provide bank details
                  </button>
                )}
              </div>
            </div>

            <div>
              {selectedTeacher.status === 'Verified' ? (
                <button 
                  className="btn" 
                  style={{ width: '100%', backgroundColor: '#10B981', color: '#000', fontWeight: '600', display: 'flex', gap: '8px', justifyContent: 'center' }}
                  onClick={() => handlePayTeacher(selectedTeacher.id)}
                >
                  <Play size={14} fill="#000" /> Process Payout Now
                </button>
              ) : selectedTeacher.status === 'Paid' ? (
                <button 
                  className="btn" 
                  disabled
                  style={{ width: '100%', backgroundColor: 'var(--border-color)', color: 'var(--text-muted)', fontWeight: '600', display: 'flex', gap: '8px', justifyContent: 'center', cursor: 'default' }}
                >
                  Payout Completed
                </button>
              ) : (
                <button 
                  className="btn" 
                  disabled
                  style={{ width: '100%', backgroundColor: 'var(--border-color)', color: 'var(--text-muted)', fontWeight: '600', display: 'flex', gap: '8px', justifyContent: 'center', opacity: 0.5, cursor: 'not-allowed' }}
                >
                  Payout Frozen ({selectedTeacher.status})
                </button>
              )}

              {/* Suspended Warning */}
              {selectedTeacher.status === 'On hold' && (
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px', color: '#F59E0B', fontSize: '0.75rem', lineHeight: '1.4' }}>
                  <Info size={16} style={{ flexShrink: 0 }} />
                  <span>
                    Earnings are held. Suspending or banning a teacher does not forfeit their historical earnings for completed sessions. Release them once suspension is cleared.
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Modal Dialog: Fix bank details */}
      {isBankModalOpen && editingTeacher && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div className="glass-panel" style={{ padding: '24px', width: '420px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Provide bank account details</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Enter valid banking coordinates for <strong>{editingTeacher.name}</strong> to resolve the blocked payout state.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Bank routing & account coordinates</label>
              <input 
                type="text" 
                placeholder="e.g. Kasikorn Bank (K-Bank) - 123-4-56789-0"
                value={bankDetailsInput}
                onChange={(e) => setBankDetailsInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button 
                className="btn btn-outline" 
                onClick={() => { setIsBankModalOpen(false); setEditingTeacher(null); }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                style={{ color: '#000' }}
                onClick={handleSaveBankDetails}
              >
                Verify & save details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>

    </div>
  );
}
