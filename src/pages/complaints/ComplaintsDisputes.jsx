import React, { useState } from 'react';
import { ShieldAlert, User, Check, MessageSquare, AlertCircle, FileText, Link, Clock, Shield } from 'lucide-react';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const mockCases = [
  { id: 'DSP-0044', title: 'Refund — no-show teacher', status: 'Escalated', time: '3h ago', complainant: 'Araya Wongkarn (student)', against: 'A. Wichit (teacher)', category: 'Teacher no-show', sessionDate: '17 May - 09:00-09:45', amount: '฿2,400', linkedBooking: '#BK-4818', admin: 'Admin (Somsak)', filed: '17 May 2025', complaint: 'My teacher A. Wichit did not show up for our scheduled Business English session on 17 May at 9am. I waited 20 minutes and sent messages but received no reply. I am requesting a full refund for the session and would like to reschedule with a different teacher.',
    timeline: [
      { text: 'Case filed by Araya Wongkarn via app', time: '17 May - 09:28', type: 'student' },
      { text: 'Auto-assigned to Admin (Somsak). Status set to "Under review"', time: '17 May - 09:30', type: 'system' },
      { text: 'Teacher A. Wichit notified and asked to respond within 24 hours', time: '17 May - 09:35', type: 'system' },
      { text: 'No response from teacher after 12 hours. Case escalated automatically', time: '17 May - 21:35', type: 'escalated' },
      { text: 'Awaiting admin resolution...', time: 'Now', type: 'pending' },
    ]
  },
  { id: 'DSP-0041', title: 'Teacher harassment complaint', status: 'Escalated', time: '3 days ago' },
  { id: 'DSP-0043', title: 'Session quality complaint', status: 'Open', time: 'Yesterday' },
  { id: 'DSP-0042', title: 'Incorrect charge — extra session', status: 'Open', time: '2 days ago' },
  { id: 'DSP-0039', title: 'Booking dispute — cancellation fee', status: 'Under review', time: '4 days ago' },
  { id: 'DSP-0038', title: 'Student no-show refund request', status: 'Under review', time: '5 days ago' },
];

export default function ComplaintsDisputes() {
  const [activeCaseId, setActiveCaseId] = useState(mockCases[0].id);
  const [resolution, setResolution] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');
  const [isClosing, setIsClosing] = useState(false);

  const activeCase = mockCases.find(c => c.id === activeCaseId);

  // Note: "Cases are sorted by escalation status first, then age."
  // Already mocked in order, but let's enforce logically if this were real data.

  const getStatusPill = (status) => {
    if (status === 'Escalated') return <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}>{status}</span>;
    if (status === 'Open') return <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#FBBF24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>{status}</span>;
    if (status === 'Under review') return <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60A5FA', border: '1px solid rgba(59, 130, 246, 0.3)' }}>{status}</span>;
    return <span>{status}</span>;
  };

  const getTimelineDot = (type) => {
    if (type === 'student' || type === 'teacher') return '#F87171'; // App action (redish in mock)
    if (type === 'system') return '#60A5FA'; // System action (blueish)
    if (type === 'escalated') return '#F87171'; // Escalation (red)
    if (type === 'pending') return '#9CA3AF'; // Pending (gray)
    return '#FBBF24'; // Warning/other
  };

  const handleCloseCase = () => {
    setIsClosing(true);
  };

  const confirmClose = () => {
    console.log('Case closed with resolution:', resolution, 'and note:', resolutionNote);
    setIsClosing(false);
    setResolution('');
    setResolutionNote('');
  };

  return (
    <div style={{ paddingBottom: '64px', minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px' }}>Complaints and disputes</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage escalated issues, refunds, and policy violations</p>
        </div>
      </div>

      {/* KPIs Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500' }}>Open cases</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px', color: '#F87171' }}>12</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>3 escalated</div>
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500' }}>Under review</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px', color: '#FBBF24' }}>5</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Assigned to admin</div>
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500' }}>Resolved (this month)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px' }}>29</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Avg 2.1 days to close</div>
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500' }}>Refunds issued</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px' }}>฿14,200</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>This month</div>
        </div>
      </div>

      {/* Two-Panel Layout */}
      <div style={{ display: 'flex', gap: '24px', flex: 1, minHeight: '600px' }}>
        
        {/* Left Panel: Cases Queue */}
        <div className="glass-panel" style={{ width: '340px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Cases queue</span>
          </div>
          
          <div style={{ overflowY: 'auto', flex: 1, padding: '12px' }}>
            {mockCases.map(c => (
              <div 
                key={c.id}
                onClick={() => setActiveCaseId(c.id)}
                style={{
                  padding: '16px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                  backgroundColor: activeCaseId === c.id ? 'var(--accent-primary-alpha)' : 'var(--bg-primary)',
                  border: `1px solid ${activeCaseId === c.id ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                  marginBottom: '12px',
                  transition: 'var(--transition)'
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: '4px' }}>{c.id}</div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '12px', lineHeight: '1.4' }}>{c.title}</h3>
                <div className="flex-between">
                  {getStatusPill(c.status)}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Case Detail */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {activeCase && activeCase.timeline ? (
            <>
              {/* Header Actions (Floating outside card) */}
              <div className="flex-between" style={{ padding: '0 8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={20} color="#F87171" />
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{activeCase.id} — {activeCase.title}</h2>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-outline" style={{ display: 'flex', gap: '6px', fontSize: '0.75rem', padding: '6px 12px' }}><User size={14}/> View teacher</button>
                  <button className="btn btn-outline" style={{ display: 'flex', gap: '6px', fontSize: '0.75rem', padding: '6px 12px' }}><User size={14}/> View student</button>
                  <button className="btn btn-outline" style={{ display: 'flex', gap: '6px', fontSize: '0.75rem', padding: '6px 12px', color: '#F87171', borderColor: 'var(--border-color)' }}>↑ Escalate manual</button>
                </div>
              </div>

              {/* Stacked Card 1: Case Summary */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Filed {activeCase.filed} · Linked booking {activeCase.linkedBooking} · Assigned to {activeCase.admin}
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Complainant</div>
                    <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>{activeCase.complainant}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Against</div>
                    <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>{activeCase.against}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Category</div>
                    <div><span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>{activeCase.category}</span></div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Session date</div>
                    <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>{activeCase.sessionDate}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Amount in dispute</div>
                    <div style={{ fontWeight: '500', fontSize: '0.875rem', color: '#3B82F6' }}>{activeCase.amount}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Priority</div>
                    <div>{getStatusPill(activeCase.status)}</div>
                  </div>
                </div>

                <div style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600', marginBottom: '8px', color: 'var(--text-secondary)' }}>Student's complaint</div>
                  <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0 }}>"{activeCase.complaint}"</p>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Evidence attached</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button className="btn btn-outline" style={{ display: 'flex', gap: '6px', fontSize: '0.75rem', padding: '6px 12px' }}><MessageSquare size={14}/> Chat log — 17 May</button>
                    <button className="btn btn-outline" style={{ display: 'flex', gap: '6px', fontSize: '0.75rem', padding: '6px 12px' }}><FileText size={14}/> Screenshot — waiting room</button>
                    <button className="btn btn-outline" style={{ display: 'flex', gap: '6px', fontSize: '0.75rem', padding: '6px 12px' }}><Link size={14}/> Booking record</button>
                  </div>
                </div>
              </div>

              {/* Stacked Card 2: Timeline */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} color="var(--text-muted)" /> Case timeline
                </h3>
                
                <div style={{ position: 'relative', paddingLeft: '16px' }}>
                  {/* Vertical connecting line */}
                  <div style={{ position: 'absolute', left: '20px', top: '8px', bottom: '8px', width: '2px', backgroundColor: 'var(--border-color)' }} />
                  
                  {activeCase.timeline.map((event, idx) => (
                    <div key={idx} style={{ position: 'relative', marginBottom: idx === activeCase.timeline.length - 1 ? 0 : '24px', paddingLeft: '24px' }}>
                      <div style={{ position: 'absolute', left: '0', top: '6px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: getTimelineDot(event.type), border: '2px solid var(--bg-primary)', zIndex: 1 }} />
                      <div style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '4px', color: event.type === 'pending' ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{event.text}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{event.time}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stacked Card 3: Resolution */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={16} color="var(--text-muted)" /> Resolution
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  {[
                    { id: 'full-refund', title: 'Full refund to student — teacher at fault', desc: 'Refund ฿2,400 to student. Deduct from teacher\'s next payout. Issue a warning to teacher.' },
                    { id: 'partial-refund', title: 'Partial refund — shared responsibility', desc: 'Admin sets refund amount. Split deduction between platform and teacher.' },
                    { id: 'no-refund', title: 'No refund — student at fault or no violation', desc: 'Close case without financial action. Notify both parties.' },
                    { id: 'reschedule-only', title: 'Reschedule only — no refund', desc: 'Offer a free replacement session. No money movement.' }
                  ].map(option => (
                    <label 
                      key={option.id} 
                      style={{ 
                        display: 'block', padding: '16px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                        border: `1px solid ${resolution === option.id ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                        backgroundColor: resolution === option.id ? 'var(--accent-primary-alpha)' : 'var(--bg-primary)',
                        transition: 'var(--transition)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                        <input type="radio" name="resolution" value={option.id} onChange={(e) => setResolution(e.target.value)} />
                        <span style={{ fontWeight: '600', fontSize: '0.875rem', color: resolution === option.id ? 'var(--accent-primary)' : 'var(--text-primary)' }}>{option.title}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', paddingLeft: '26px' }}>{option.desc}</div>
                    </label>
                  ))}
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <textarea 
                    rows={4} 
                    placeholder="Add an internal note explaining the resolution decision (required before closing)..." 
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    style={{ width: '100%', padding: '12px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none', resize: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button className="btn btn-outline">Save draft</button>
                  <button 
                    className="btn btn-primary" 
                    disabled={!resolution || !resolutionNote}
                    onClick={handleCloseCase}
                    style={{ opacity: (resolution && resolutionNote) ? 1 : 0.5, display: 'flex', gap: '8px' }}
                  >
                    <Check size={16} /> Close case
                  </button>
                </div>
              </div>

            </>
          ) : (
            <div className="flex-center" style={{ height: '100%', color: 'var(--text-secondary)' }}>Select a case from the queue to view details.</div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isClosing}
        title="Confirm case resolution"
        message="Closing this case will automatically trigger refunds/deductions and notify both the student and the teacher. This action is final."
        confirmText="Confirm & close case"
        onConfirm={confirmClose}
        onCancel={() => setIsClosing(false)}
        isDestructive={false}
      />

    </div>
  );
}
