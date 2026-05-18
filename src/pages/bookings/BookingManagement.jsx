import React, { useState } from 'react';
import { Search, Calendar, Filter, BookOpen, Download, Edit2, X, Eye, Check, RefreshCw, XCircle } from 'lucide-react';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const mockBookings = [
  { id: 'BK-4821', student: 'P. Srisai', teacher: 'K. Somchai', course: 'IELTS Prep', datetime: '18 May 10:00', status: 'Upcoming', duration: '60 min', fee: '฿900', paymentStatus: 'Paid', bookedBy: 'Student (app)', studentFull: 'Pimchanok Srisai', courseFull: 'IELTS Preparation' },
  { id: 'BK-4818', student: 'A. Wongkarn', teacher: 'A. Wichit', course: 'Business English', datetime: '17 May 14:00', status: 'Disputed', duration: '60 min', fee: '฿850', paymentStatus: 'Paid', bookedBy: 'Student (app)', studentFull: 'Anong Wongkarn', courseFull: 'Business English - Advanced' },
  { id: 'BK-4820', student: 'N. Thongchai', teacher: 'P. Niran', course: 'Math Grade 9', datetime: '17 May 09:00', status: 'Completed', duration: '90 min', fee: '฿1200', paymentStatus: 'Paid', bookedBy: 'Parent', studentFull: 'Nawat Thongchai', courseFull: 'Math Grade 9 - Algebra' },
  { id: 'BK-4815', student: 'K. Pongpae', teacher: 'T. Malee', course: 'Guitar Basics', datetime: '16 May 16:00', status: 'Cancelled', duration: '60 min', fee: '฿700', paymentStatus: 'Refunded', bookedBy: 'Student (app)', studentFull: 'Korn Pongpae', courseFull: 'Acoustic Guitar Basics' },
  { id: 'BK-4812', student: 'M. Lertpanich', teacher: 'K. Somchai', course: 'IELTS Prep', datetime: '20 May 11:00', status: 'Upcoming', duration: '60 min', fee: '฿900', paymentStatus: 'Paid', bookedBy: 'Admin', studentFull: 'Manee Lertpanich', courseFull: 'IELTS Preparation' },
];

const mockReplacementTeachers = [
  { name: 'S. Priya', rating: 4.8 },
  { name: 'J. Doe', rating: 4.5 },
  { name: 'M. Lee', rating: 4.9 },
];

export default function BookingManagement() {
  const [bookings, setBookings] = useState(mockBookings);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [actionType, setActionType] = useState(null); // 'reassign', 'cancel_refund', 'cancel_no_refund', 'complete'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState('');

  const selectedBooking = bookings.find(b => b.id === selectedBookingId);

  // Sorting logic to put Disputed first, as per specs: "Disputed bookings always surface first"
  const sortedBookings = [...bookings]
    .filter(b => b.student.toLowerCase().includes(searchTerm.toLowerCase()) || b.teacher.toLowerCase().includes(searchTerm.toLowerCase()) || b.course.toLowerCase().includes(searchTerm.toLowerCase()) || b.id.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (a.status === 'Disputed' && b.status !== 'Disputed') return -1;
      if (b.status === 'Disputed' && a.status !== 'Disputed') return 1;
      return 0;
    });

  const getStatusPill = (status) => {
    switch (status) {
      case 'Upcoming':
        return <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', border: '1px solid rgba(59, 130, 246, 0.2)' }}>{status}</span>;
      case 'Completed':
        return <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>{status}</span>;
      case 'Disputed':
        return <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', border: '1px solid rgba(239, 68, 68, 0.5)' }}>{status}</span>;
      case 'Cancelled':
      default:
        return <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>{status}</span>;
    }
  };

  const handleAction = (type) => {
    setActionType(type);
    setIsModalOpen(true);
  };

  const confirmAction = () => {
    if (!selectedBooking) return;

    const newBookings = [...bookings];
    const idx = newBookings.findIndex(b => b.id === selectedBooking.id);

    if (actionType === 'complete') {
      newBookings[idx].status = 'Completed';
    } else if (actionType === 'cancel_refund') {
      newBookings[idx].status = 'Cancelled';
      newBookings[idx].paymentStatus = 'Refunded';
    } else if (actionType === 'cancel_no_refund') {
      newBookings[idx].status = 'Cancelled';
    } else if (actionType === 'reassign' && selectedTeacher) {
      newBookings[idx].teacher = selectedTeacher;
    }

    setBookings(newBookings);
    setIsModalOpen(false);
    setActionType(null);
    setSelectedTeacher('');
  };

  const renderModalContent = () => {
    if (actionType === 'reassign') {
      return (
        <div style={{ padding: '24px', width: '400px' }} className="glass-panel">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px' }}>Reassign teacher</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Select a replacement teacher who teaches <strong>{selectedBooking?.course}</strong>.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
            {mockReplacementTeachers.map(t => (
              <label key={t.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                <input type="radio" name="teacher" value={t.name} onChange={(e) => setSelectedTeacher(e.target.value)} />
                <span style={{ fontWeight: '500' }}>{t.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>⭐ {t.rating}</span>
              </label>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={confirmAction} disabled={!selectedTeacher}>Confirm reassignment</button>
          </div>
        </div>
      );
    }

    const modalConfigs = {
      complete: { title: 'Mark completed', desc: 'Manually mark this session as completed. This will trigger the normal payout flow for the teacher.', confirm: 'Mark completed' },
      cancel_refund: { title: 'Cancel & refund', desc: 'Cancel this booking and issue a full refund to the student. Use this when the fault is on the platform or teacher side.', confirm: 'Cancel & refund', isDestructive: true },
      cancel_no_refund: { title: 'Cancel, no refund', desc: 'Cancel this booking without issuing a refund. Use this when the student no-showed or violated terms.', confirm: 'Cancel, no refund', isDestructive: true },
    };

    const config = modalConfigs[actionType];
    if (!config) return null;

    return (
      <div style={{ padding: '24px', width: '400px' }} className="glass-panel">
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px' }}>{config.title}</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.5' }}>{config.desc}</p>
        
        {(actionType === 'cancel_refund' || actionType === 'cancel_no_refund') && (
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', marginBottom: '8px' }}>Mandatory reason</label>
            <textarea rows={3} placeholder="Explain why..." style={{ width: '100%', padding: '10px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none', resize: 'none' }} />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
          <button className={`btn ${config.isDestructive ? 'btn-danger' : 'btn-primary'}`} onClick={confirmAction}>{config.confirm}</button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ paddingBottom: '64px', height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px' }}>Booking Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage scheduled sessions, resolve disputes, and handle overrides</p>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500' }}>Upcoming bookings</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px' }}>324</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Next 7 days</div>
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500' }}>Completed today</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px' }}>41</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Out of 48 scheduled</div>
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500' }}>Cancellations (this week)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px', color: '#F87171' }}>18</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>7 by teacher · 11 by student</div>
        </div>
        <div className="glass-panel" style={{ padding: '20px', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500' }}>Disputed bookings</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px', color: '#F59E0B' }}>4</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Require admin action</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex-between" style={{ marginBottom: '16px' }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by student, teacher, or course..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 12px 10px 36px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-outline" style={{ display: 'flex', gap: '8px' }}><Calendar size={16} /> All dates</button>
          <button className="btn btn-outline" style={{ display: 'flex', gap: '8px' }}><Filter size={16} /> Status</button>
          <button className="btn btn-outline" style={{ display: 'flex', gap: '8px' }}><BookOpen size={16} /> Course</button>
          <button className="btn btn-outline" style={{ display: 'flex', gap: '8px' }}><Download size={16} /> Export</button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <div className="table-container" style={{ flex: 1, overflowY: 'auto' }}>
          <table className="premium-table">
            <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-secondary)', zIndex: 10 }}>
              <tr>
                <th>Booking ID</th>
                <th>Student</th>
                <th>Teacher</th>
                <th>Course</th>
                <th>Date & time</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedBookings.map(booking => (
                <tr 
                  key={booking.id} 
                  onClick={() => setSelectedBookingId(booking.id)}
                  style={{ 
                    cursor: 'pointer', 
                    backgroundColor: selectedBookingId === booking.id ? 'var(--bg-tertiary)' : 'transparent',
                    borderBottom: '1px solid var(--border-color)'
                  }}
                >
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: 'monospace' }}>{booking.id}</td>
                  <td style={{ fontWeight: '500' }}>{booking.student}</td>
                  <td style={{ fontWeight: '500' }}>{booking.teacher}</td>
                  <td>{booking.course}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{booking.datetime}</td>
                  <td>{getStatusPill(booking.status)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                      <button className="btn-icon btn-ghost"><Eye size={16} /></button>
                      {(booking.status === 'Upcoming' || booking.status === 'Disputed') && (
                        <button className="btn-icon btn-ghost" style={{ color: 'var(--danger-text)' }}><X size={16} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Admin Override Panel */}
        {selectedBooking && (
          <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Edit2 size={16} /> Booking {selectedBooking.id} — admin override panel
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Student</div>
                <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>{selectedBooking.studentFull}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Teacher</div>
                <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>{selectedBooking.teacher}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Course</div>
                <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>{selectedBooking.courseFull}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Scheduled</div>
                <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>{selectedBooking.datetime}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Duration</div>
                <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>{selectedBooking.duration}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Session fee</div>
                <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>{selectedBooking.fee}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Payment status</div>
                <div>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600', backgroundColor: selectedBooking.paymentStatus === 'Paid' ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-secondary)', color: selectedBooking.paymentStatus === 'Paid' ? '#10B981' : 'var(--text-secondary)' }}>
                    {selectedBooking.paymentStatus}
                  </span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Booked by</div>
                <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>{selectedBooking.bookedBy}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button className="btn btn-outline" style={{ display: 'flex', gap: '6px' }} disabled={selectedBooking.status === 'Completed' || selectedBooking.status === 'Cancelled'}>
                <Calendar size={14}/> Reschedule
              </button>
              <button className="btn btn-outline" style={{ display: 'flex', gap: '6px' }} onClick={() => handleAction('reassign')} disabled={selectedBooking.status === 'Completed' || selectedBooking.status === 'Cancelled'}>
                <RefreshCw size={14}/> Reassign teacher
              </button>
              <button className="btn btn-outline" style={{ display: 'flex', gap: '6px' }} onClick={() => handleAction('complete')} disabled={selectedBooking.status === 'Completed' || selectedBooking.status === 'Cancelled'}>
                <Check size={14}/> Mark completed
              </button>
              <button className="btn btn-outline" style={{ display: 'flex', gap: '6px', color: 'var(--danger-text)', borderColor: 'var(--border-color)' }} onClick={() => handleAction('cancel_refund')} disabled={selectedBooking.status === 'Cancelled'}>
                <X size={14}/> Cancel & refund
              </button>
              <button className="btn btn-outline" style={{ display: 'flex', gap: '6px', color: 'var(--danger-text)', borderColor: 'var(--border-color)' }} onClick={() => handleAction('cancel_no_refund')} disabled={selectedBooking.status === 'Cancelled'}>
                <XCircle size={14}/> Cancel, no refund
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          {renderModalContent()}
        </div>
      )}

    </div>
  );
}
