import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserMinus, BookOpen, CreditCard, Calendar, MessageCircle, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import ProfileHeader from '../../components/ui/ProfileHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [studentStatus, setStudentStatus] = useState('Active');
  
  // Dynamic Payments
  const [payments, setPayments] = useState([
    { id: 1, course: 'IELTS Prep — May session', date: '15 May 2025', amount: 3200, status: 'Paid' },
    { id: 2, course: 'Business English — May', date: '10 May 2025', amount: 2400, status: 'Pending' },
    { id: 3, course: 'Business English — Apr', date: '10 Apr 2025', amount: 2400, status: 'Paid' },
    { id: 4, course: 'IELTS Prep — Apr session', date: '15 Apr 2025', amount: 3200, status: 'Paid' },
    { id: 5, course: 'Conversational Thai — Mar', date: '10 Mar 2025', amount: 1800, status: 'Paid' },
  ]);

  // Session History Pagination
  const allSessions = [
    { id: 1, title: 'IELTS Preparation — Session 12', detail: 'K. Somchai - 12 May 2025 - 60 min', rating: '5/5', status: 'Completed' },
    { id: 2, title: 'Business English — Session 8', detail: 'A. Wichit - 10 May 2025 - 45 min', rating: '4/5', status: 'Completed' },
    { id: 3, title: 'IELTS Preparation — Session 11', detail: 'K. Somchai - 28 Apr 2025 - 60 min', rating: '5/5', status: 'Completed' },
    { id: 4, title: 'Business English — Session 7', detail: 'A. Wichit - 25 Apr 2025 - 45 min', rating: '-', status: 'Cancelled' },
    { id: 5, title: 'Conversational Thai — Session 10', detail: 'T. Malee - 20 Apr 2025 - 60 min', rating: '5/5', status: 'Completed' },
    { id: 6, title: 'IELTS Preparation — Session 10', detail: 'K. Somchai - 15 Apr 2025 - 60 min', rating: '4/5', status: 'Completed' },
  ];
  
  const [visibleSessionCount, setVisibleSessionCount] = useState(4);

  // Derived Values
  const totalPaid = payments.filter(p => p.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 10400); // Base + dynamic
  const pendingBalance = payments.filter(p => p.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);
  const totalRefunds = payments.filter(p => p.status === 'Refunded').reduce((acc, curr) => acc + curr.amount, 0);
  
  const formatCurrency = (amount) => `฿${amount.toLocaleString()}`;

  const handleDrop = () => {
    setStudentStatus('Passive');
    setIsConfirmOpen(false);
  };

  const handleRefund = (paymentId) => {
    if(window.confirm('Are you sure you want to issue a refund for this transaction?')) {
      setPayments(payments.map(p => p.id === paymentId ? { ...p, status: 'Refunded' } : p));
    }
  };

  const StatusPill = ({ status }) => {
    let bg = 'var(--bg-tertiary)', color = 'var(--text-secondary)', border = 'var(--border-color)';
    if(status === 'Ongoing' || status === 'Completed' || status === 'Done' || status === 'Paid') {
      bg = 'rgba(74, 222, 128, 0.1)'; color = '#4ADE80'; border = 'rgba(74, 222, 128, 0.2)';
    } else if (status === 'Pending' || status === 'Upcoming') {
      bg = 'rgba(251, 146, 60, 0.1)'; color = '#FB923C'; border = 'rgba(251, 146, 60, 0.2)';
    } else if (status === 'Cancelled' || status === 'Refunded') {
      bg = 'rgba(239, 68, 68, 0.1)'; color = '#F87171'; border = 'rgba(239, 68, 68, 0.2)';
    }

    return (
      <span style={{
        padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '500',
        backgroundColor: bg, color: color, border: `1px solid ${border}`
      }}>
        {status === 'Paid' ? `Paid ฿${payments.find(p=>p.status==='Paid')?.amount || ''}` : status} 
        {/* Wait, the mockup shows "Paid ฿3,200" but I will render the text directly if passed */}
      </span>
    );
  };

  return (
    <div style={{ paddingBottom: '64px' }}>
      <button 
        onClick={() => navigate('/students')} 
        className="btn btn-ghost" 
        style={{ marginBottom: '24px', paddingLeft: 0, color: 'var(--text-secondary)' }}
      >
        <ArrowLeft size={16} /> Back to students
      </button>

      <ProfileHeader 
        name="Pimchanok Srisai"
        email="pim.srisai@gmail.com"
        phone="+66 81 234 5678"
        avatarText="PS"
        statusNode={<StatusBadge status={studentStatus} />}
        extraInfo={[
          { label: 'Student ID', value: '#STU-00412' },
          { label: 'Joined', value: '12 Jan 2024' },
          { label: 'Last active', value: 'Today, 09:41' },
          { label: 'Total spent', value: formatCurrency(totalPaid) },
          { label: 'Sessions completed', value: '34' },
          { label: 'Avg rating given', value: '4.8 / 5' }
        ]}
        actionNode={
          <button 
            className="btn btn-outline" 
            onClick={() => setIsConfirmOpen(true)}
            disabled={studentStatus === 'Passive'}
            style={{ 
              borderColor: studentStatus === 'Passive' ? 'var(--border-color)' : 'rgba(239, 68, 68, 0.3)',
              color: studentStatus === 'Passive' ? 'var(--text-muted)' : 'var(--danger-text)',
              opacity: studentStatus === 'Passive' ? 0.5 : 1
            }}
          >
            <UserMinus size={16} />
            Drop student
          </button>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Left Card: Enrolled Courses */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', marginBottom: '20px' }}>
            <BookOpen size={18} className="text-muted" /> Enrolled courses
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div className="flex-between">
              <div>
                <div style={{ fontWeight: '600', marginBottom: '2px', cursor: 'pointer' }} className="hover-underline">IELTS Preparation</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>with K. Somchai - 60 min/session</div>
              </div>
              <StatusPill status="Ongoing" />
            </div>
            
            <div style={{ height: '1px', background: 'var(--border-color)' }} />
            
            <div className="flex-between">
              <div>
                <div style={{ fontWeight: '600', marginBottom: '2px', cursor: 'pointer' }} className="hover-underline">Business English</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>with A. Wichit - 45 min/session</div>
              </div>
              <StatusPill status="Ongoing" />
            </div>

            <div style={{ height: '1px', background: 'var(--border-color)' }} />
            
            <div className="flex-between">
              <div>
                <div style={{ fontWeight: '600', marginBottom: '2px', cursor: 'pointer' }} className="hover-underline">Conversational Thai</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>with T. Malee - 60 min/session</div>
              </div>
              <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '500', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>Completed</span>
            </div>

          </div>
        </div>

        {/* Right Card: Payment Summary */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', marginBottom: '20px' }}>
            <CreditCard size={18} className="text-muted" /> Payment summary
          </h3>
          
          <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Total paid</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{formatCurrency(totalPaid)}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Pending</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{formatCurrency(pendingBalance)}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Refunds</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{formatCurrency(totalRefunds)}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {payments.slice(0, 3).map((payment, idx) => (
              <div key={payment.id} className="flex-between group">
                <div>
                  <div style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '2px' }}>{payment.course}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{payment.date}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {payment.status === 'Paid' && (
                    <button 
                      onClick={() => handleRefund(payment.id)} 
                      className="btn-link opacity-0 group-hover-opacity-100 transition" 
                      style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Refund
                    </button>
                  )}
                  <span style={{ 
                    padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '500',
                    backgroundColor: payment.status === 'Paid' ? 'rgba(74, 222, 128, 0.1)' : payment.status === 'Pending' ? 'rgba(251, 146, 60, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                    color: payment.status === 'Paid' ? '#4ADE80' : payment.status === 'Pending' ? '#FB923C' : '#F87171',
                    border: `1px solid ${payment.status === 'Paid' ? 'rgba(74, 222, 128, 0.2)' : payment.status === 'Pending' ? 'rgba(251, 146, 60, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                  }}>
                    {payment.status} {formatCurrency(payment.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Bottom Left Card: Upcoming class schedule */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', marginBottom: '20px' }}>
            <Calendar size={18} className="text-muted" /> Upcoming class schedule
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ minWidth: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '1rem', fontWeight: '700' }}>18</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>May</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', marginBottom: '2px' }}>IELTS Preparation</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>K. Somchai</div>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>10:00 - 11:00</div>
            </div>

            <div style={{ height: '1px', background: 'var(--border-color)' }} />
            
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ minWidth: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '1rem', fontWeight: '700' }}>20</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>May</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', marginBottom: '2px' }}>Business English</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>A. Wichit</div>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>14:00 - 14:45</div>
            </div>

            <div style={{ height: '1px', background: 'var(--border-color)' }} />
            
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ minWidth: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '1rem', fontWeight: '700' }}>25</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>May</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', marginBottom: '2px' }}>IELTS Preparation</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>K. Somchai</div>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>10:00 - 11:00</div>
            </div>

          </div>
        </div>

        {/* Bottom Right Card: Consultation sessions */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', marginBottom: '20px' }}>
            <MessageCircle size={18} className="text-muted" /> Consultation sessions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div className="flex-between">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ADE80', marginTop: '6px' }} />
                <div>
                  <div style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '2px' }}>IELTS strategy session</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>with K. Somchai - 2 May 2025</div>
                </div>
              </div>
              <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '500', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>Done</span>
            </div>

            <div className="flex-between">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ADE80', marginTop: '6px' }} />
                <div>
                  <div style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '2px' }}>Course selection advice</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>with Admin - 14 Mar 2025</div>
                </div>
              </div>
              <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '500', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>Done</span>
            </div>

            <div className="flex-between">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3B82F6', marginTop: '6px' }} />
                <div>
                  <div style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '2px' }}>Progress review</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>with K. Somchai - 22 May 2025</div>
                </div>
              </div>
              <StatusPill status="Upcoming" />
            </div>

          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>3 total consultations</span>
            <button style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer' }}>View all</button>
          </div>
        </div>
      </div>

      {/* Full Width Card: Session History */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', marginBottom: '20px' }}>
          <Clock size={18} className="text-muted" /> Session history
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {allSessions.slice(0, visibleSessionCount).map((session, idx) => (
            <div key={session.id}>
              <div className="flex-between" style={{ padding: '16px 0' }}>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px', fontSize: '0.875rem' }}>{session.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{session.detail}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {session.rating !== '-' ? `Rated ${session.rating}` : '—'}
                  </div>
                  <StatusPill status={session.status} />
                </div>
              </div>
              {idx < visibleSessionCount - 1 && <div style={{ height: '1px', background: 'var(--border-color)' }} />}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>34 sessions total - 2 cancelled - 0 disputed</span>
          {visibleSessionCount < allSessions.length && (
            <button 
              className="btn btn-outline" 
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
              onClick={() => setVisibleSessionCount(allSessions.length)}
            >
              Load more
            </button>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Drop Student"
        message={`Are you sure you want to drop Pimchanok Srisai? They will be removed from all active classes and their account will be disabled.`}
        confirmText="Drop Student"
        onConfirm={handleDrop}
        onCancel={() => setIsConfirmOpen(false)}
      />

      <style>{`
        .hover-underline:hover {
          text-decoration: underline;
        }
        .opacity-0 { opacity: 0; }
        .group-hover-opacity-100:hover { opacity: 1; }
        .group:hover .group-hover-opacity-100 { opacity: 1; }
        .transition { transition: opacity 0.2s; }
      `}</style>
    </div>
  );
}
