import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserMinus, Edit3, BadgeCheck, BookOpen, CreditCard, Calendar, MessageCircle, Star, PenTool, CheckCircle2 } from 'lucide-react';
import ProfileHeader from '../../components/ui/ProfileHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function TeacherDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [teacherStatus, setTeacherStatus] = useState('Active');
  
  // Editable fields state
  const [payRate, setPayRate] = useState(900);
  const [isEditingPayRate, setIsEditingPayRate] = useState(false);

  // Dynamic Payouts
  const [payouts, setPayouts] = useState([
    { id: 1, month: 'May payout', detail: 'Scheduled 31 May 2025 - 21 sessions', amount: 18900, status: 'Pending' },
    { id: 2, month: 'Apr payout', detail: 'Paid 30 Apr 2025 - 19 sessions', amount: 17100, status: 'Paid' },
    { id: 3, month: 'Mar payout', detail: 'Paid 31 Mar 2025 - 22 sessions', amount: 19800, status: 'Paid' },
  ]);

  // Derived Values
  const totalPaid = payouts.filter(p => p.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 147300); // base lifetime + recent
  const pendingPayout = payouts.filter(p => p.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);
  const totalLifetime = totalPaid + pendingPayout;
  
  const formatCurrency = (amount) => `฿${amount.toLocaleString()}`;

  const handleDrop = () => {
    setTeacherStatus('Passive');
    setIsConfirmOpen(false);
  };

  const handleManualPayout = (payoutId) => {
    if(window.confirm('Trigger manual payout for this month?')) {
      setPayouts(payouts.map(p => p.id === payoutId ? { ...p, status: 'Paid', detail: `Paid Today - ${p.detail.split(' - ')[1]}` } : p));
    }
  };

  const handlePayRateSave = (e) => {
    if (e.key === 'Enter') {
      setIsEditingPayRate(false);
    }
  };

  const StatusPill = ({ status, text }) => {
    let bg = 'var(--bg-tertiary)', color = 'var(--text-secondary)', border = 'var(--border-color)';
    if(status === 'Ongoing' || status === 'Completed' || status === 'Done' || status === 'Paid') {
      bg = 'rgba(74, 222, 128, 0.1)'; color = '#4ADE80'; border = 'rgba(74, 222, 128, 0.2)';
    } else if (status === 'Pending' || status === 'Upcoming' || status === 'Starts 1 Jun') {
      bg = 'rgba(251, 146, 60, 0.1)'; color = '#FB923C'; border = 'rgba(251, 146, 60, 0.2)';
    } else if (status === 'Cancelled' || status === 'Refunded') {
      bg = 'rgba(239, 68, 68, 0.1)'; color = '#F87171'; border = 'rgba(239, 68, 68, 0.2)';
    }

    return (
      <span style={{
        padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '500',
        backgroundColor: bg, color: color, border: `1px solid ${border}`, whiteSpace: 'nowrap'
      }}>
        {text || status}
      </span>
    );
  };

  const renderCalendar = () => {
    // A simple mock visual calendar 
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const calendarGrid = [];
    let dayCounter = 1;
    
    for (let i = 0; i < 5; i++) {
      let week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < 3) { // offset
          week.push(null);
        } else if (dayCounter <= 31) {
          week.push(dayCounter++);
        } else {
          week.push(null);
        }
      }
      calendarGrid.push(week);
    }

    const classDays = [2, 6, 9, 13, 16, 20, 23, 27, 30]; // Blue
    const consultationDays = [7, 14, 21, 22, 24, 28]; // Amber

    return (
      <div style={{ width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '8px', textAlign: 'center' }}>
          {days.map(d => <div key={d} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{d}</div>)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
          {calendarGrid.flat().map((day, idx) => {
            const isClass = classDays.includes(day);
            const isConsult = consultationDays.includes(day);
            return (
              <div key={idx} style={{ 
                aspectRatio: '1', 
                backgroundColor: day ? 'var(--bg-primary)' : 'transparent', 
                border: day ? '1px solid var(--border-color)' : 'none',
                borderRadius: 'var(--radius-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.875rem', fontWeight: '500',
                color: day ? 'var(--text-primary)' : 'transparent',
                position: 'relative',
                cursor: day ? 'pointer' : 'default'
              }} className="cal-day">
                {day}
                {(isClass || isConsult) && (
                  <div style={{
                    position: 'absolute', bottom: '4px', left: '50%', transform: 'translateX(-50%)',
                    width: '6px', height: '6px', borderRadius: '50%',
                    backgroundColor: isClass ? '#3B82F6' : '#FB923C'
                  }} />
                )}
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3B82F6' }}/> Class day</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FB923C' }}/> Consultation day</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', border: '1px solid var(--text-secondary)' }}/> Today</div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ paddingBottom: '64px' }}>
      <button 
        onClick={() => navigate('/teachers')} 
        className="btn btn-ghost" 
        style={{ marginBottom: '24px', paddingLeft: 0, color: 'var(--text-secondary)' }}
      >
        <ArrowLeft size={16} /> Back to teachers
      </button>

      <ProfileHeader 
        name="Krittapon Somchai"
        email="krittapon.s@gmail.com"
        phone="+66 89 012 3456"
        avatarText="KS"
        statusNode={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <StatusBadge status={teacherStatus} />
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#3B82F6', fontWeight: '500', backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '4px 8px', borderRadius: 'var(--radius-full)' }}>
              <BadgeCheck size={14} /> Verified
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', padding: '4px 8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)' }}>
              Teacher ID #TCH-00039
            </span>
          </div>
        }
        extraInfo={[
          { label: 'Joined', value: '3 Aug 2023' },
          { label: 'Last active', value: 'Today, 08:15' },
          { label: 'Sessions taught', value: '214' },
          { label: 'Avg rating', value: '4.9 / 5' },
          { label: 'Active students', value: '18' },
          { label: 'Total earned', value: formatCurrency(totalPaid) },
          { 
            label: 'Pay rate', 
            value: isEditingPayRate ? (
              <input 
                type="number" 
                value={payRate} 
                onChange={(e) => setPayRate(Number(e.target.value))}
                onKeyDown={handlePayRateSave}
                onBlur={() => setIsEditingPayRate(false)}
                autoFocus
                style={{ width: '60px', background: 'var(--bg-primary)', border: '1px solid var(--accent-primary)', color: 'white', outline: 'none', borderRadius: '4px', padding: '2px 4px' }}
              />
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                ฿{payRate} / hr 
                <button onClick={() => setIsEditingPayRate(true)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><PenTool size={12}/></button>
              </span>
            )
          },
          { label: 'Commission rate', value: '15%' }
        ]}
        actionNode={
          <>
            <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Edit3 size={16} /> Edit profile
            </button>
            <button 
              className="btn btn-outline" 
              onClick={() => setIsConfirmOpen(true)}
              disabled={teacherStatus === 'Passive'}
              style={{ 
                borderColor: teacherStatus === 'Passive' ? 'var(--border-color)' : 'rgba(239, 68, 68, 0.3)',
                color: teacherStatus === 'Passive' ? 'var(--text-muted)' : 'var(--danger-text)',
                opacity: teacherStatus === 'Passive' ? 0.5 : 1
              }}
            >
              <UserMinus size={16} />
              Drop teacher
            </button>
          </>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Left Card: Biography */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', marginBottom: '20px' }}>
            <UserMinus size={18} className="text-muted" style={{ display: 'none' }} /> {/* Just a placeholder icon */}
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
               Biography
            </span>
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
            Native English speaker with 8 years of IELTS and Business English teaching experience. Certified CELTA instructor. Previously taught at Chulalongkorn University and British Council Bangkok. Specialises in exam preparation and corporate communication.
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className="pill" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', border: '1px solid rgba(59, 130, 246, 0.2)' }}>IELTS</span>
            <span className="pill" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', border: '1px solid rgba(59, 130, 246, 0.2)' }}>Business English</span>
            <span className="pill" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', border: '1px solid rgba(59, 130, 246, 0.2)' }}>Conversational English</span>
            <span className="pill" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', border: '1px solid rgba(59, 130, 246, 0.2)' }}>TOEIC</span>
          </div>
        </div>

        {/* Right Card: Pay & earnings */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', marginBottom: '20px' }}>
            <CreditCard size={18} className="text-muted" /> Pay & earnings
          </h3>
          
          <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>This month</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{formatCurrency(18900)}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Pending payout</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{formatCurrency(pendingPayout)}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Total lifetime</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{formatCurrency(totalLifetime)}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {payouts.map((payout) => (
              <div key={payout.id} className="flex-between group">
                <div>
                  <div style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '2px' }}>{payout.month}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{payout.detail}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {payout.status === 'Pending' && (
                    <button 
                      onClick={() => handleManualPayout(payout.id)} 
                      className="btn-link opacity-0 group-hover-opacity-100 transition" 
                      style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Payout now
                    </button>
                  )}
                  <StatusPill status={payout.status} text={`${payout.status} ${formatCurrency(payout.amount)}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Bottom Left Card: Active classes */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', marginBottom: '20px' }}>
            <BookOpen size={18} className="text-muted" /> Active classes
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div className="flex-between">
              <div>
                <div style={{ fontWeight: '600', marginBottom: '2px' }}>IELTS Preparation</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>8 students enrolled - 60 min - Mon & Thu</div>
              </div>
              <StatusPill status="Ongoing" />
            </div>
            
            <div style={{ height: '1px', background: 'var(--border-color)' }} />
            
            <div className="flex-between">
              <div>
                <div style={{ fontWeight: '600', marginBottom: '2px' }}>Business English — Corporate</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>6 students enrolled - 45 min - Tue & Fri</div>
              </div>
              <StatusPill status="Ongoing" />
            </div>

            <div style={{ height: '1px', background: 'var(--border-color)' }} />
            
            <div className="flex-between">
              <div>
                <div style={{ fontWeight: '600', marginBottom: '2px' }}>TOEIC Intensive</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>4 students enrolled - 90 min - Sat</div>
              </div>
              <StatusPill status="Starts 1 Jun" />
            </div>

            <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>18 active students across 3 classes</span>
              <button style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer' }}>View all classes</button>
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
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3B82F6', marginTop: '6px' }} />
                <div>
                  <div style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '2px' }}>Progress review — Pimchanok S.</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>22 May 2025 - 13:00</div>
                </div>
              </div>
              <StatusPill status="Upcoming" />
            </div>

            <div className="flex-between">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3B82F6', marginTop: '6px' }} />
                <div>
                  <div style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '2px' }}>Needs assessment — Nattawut T.</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>24 May 2025 - 10:00</div>
                </div>
              </div>
              <StatusPill status="Upcoming" />
            </div>

            <div className="flex-between">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ADE80', marginTop: '6px' }} />
                <div>
                  <div style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '2px' }}>IELTS strategy — Pimchanok S.</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>2 May 2025 - 11:00</div>
                </div>
              </div>
              <StatusPill status="Done" />
            </div>

            <div className="flex-between">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ADE80', marginTop: '6px' }} />
                <div>
                  <div style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '2px' }}>Goal setting — Araya W.</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>18 Apr 2025 - 14:00</div>
                </div>
              </div>
              <StatusPill status="Done" />
            </div>

          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>2 upcoming · 12 completed</span>
            <button style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer' }}>View all</button>
          </div>
        </div>
      </div>

      {/* Full Width Card: Calendar */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', marginBottom: '20px' }}>
          <Calendar size={18} className="text-muted" /> May 2025 — class calendar
        </h3>
        {renderCalendar()}
      </div>

      {/* Full Width Card: Student Reviews */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', marginBottom: '20px' }}>
          <Star size={18} className="text-muted" /> Recent student reviews
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>Pimchanok Srisai</span>
              <div style={{ display: 'flex', color: '#FACC15' }}>
                <Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>5/5</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>IELTS Preparation - 12 May 2025</div>
            <p style={{ fontSize: '0.875rem', fontStyle: 'italic', color: 'var(--text-primary)' }}>"Really patient and explains things clearly. My score improved by 1.5 bands in 2 months."</p>
          </div>

          <div style={{ height: '1px', background: 'var(--border-color)' }} />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>Nattawut Thongchai</span>
              <div style={{ display: 'flex', color: '#FACC15' }}>
                <Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>5/5</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>IELTS Preparation - 9 May 2025</div>
            <p style={{ fontSize: '0.875rem', fontStyle: 'italic', color: 'var(--text-primary)' }}>"Excellent teaching style. Very structured lessons with clear goals each session."</p>
          </div>

          <div style={{ height: '1px', background: 'var(--border-color)' }} />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>Araya Wongkam</span>
              <div style={{ display: 'flex', color: '#FACC15' }}>
                <Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" />
                <Star size={12} fill="transparent" stroke="currentColor" />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>4/5</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Business English - 7 May 2025</div>
            <p style={{ fontSize: '0.875rem', fontStyle: 'italic', color: 'var(--text-primary)' }}>"Very knowledgeable but sessions sometimes run a little over time."</p>
          </div>

        </div>

        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Avg 4.9 / 5 from 87 reviews</span>
          <button style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer' }}>View all reviews</button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Drop Teacher"
        message={`Are you sure you want to drop Krittapon Somchai? They will be removed from all active classes and their account will be disabled. Completed sessions will still be paid out.`}
        confirmText="Drop Teacher"
        onConfirm={handleDrop}
        onCancel={() => setIsConfirmOpen(false)}
      />

      <style>{`
        .opacity-0 { opacity: 0; }
        .group-hover-opacity-100:hover { opacity: 1; }
        .group:hover .group-hover-opacity-100 { opacity: 1; }
        .transition { transition: opacity 0.2s; }
        .cal-day:hover { border-color: var(--text-muted) !important; }
      `}</style>
    </div>
  );
}
