import React, { useState } from 'react';
import { CheckCircle, XCircle, Search, FileText, User, ShieldCheck, AlertCircle, Maximize2, ExternalLink } from 'lucide-react';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const mockApplications = [
  { id: 'APP-1042', name: 'Nadech K.', role: 'Teacher', date: '2 hours ago', status: 'Pending', documents: ['National ID', 'Teaching Certificate', 'Selfie'], statusText: 'Awaiting ID verification' },
  { id: 'APP-1041', name: 'Siri T.', role: 'Teacher', date: 'Yesterday', status: 'Pending', documents: ['Passport', 'Degree'], statusText: 'Awaiting certificate review' },
  { id: 'APP-1039', name: 'John Smith', role: 'Teacher', date: '2 days ago', status: 'Rejected', documents: ['Passport'], statusText: 'ID photo blurred' },
  { id: 'APP-1038', name: 'Mali S.', role: 'Teacher', date: '3 days ago', status: 'Approved', documents: ['National ID', 'Teaching Certificate'], statusText: 'Verified' },
];

export default function VerificationBadges() {
  const [activeAppId, setActiveAppId] = useState(mockApplications[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionType, setActionType] = useState(null); // 'Approve', 'Reject', 'RequestInfo'
  const [internalNote, setInternalNote] = useState('');
  
  const activeApp = mockApplications.find(a => a.id === activeAppId);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Approved': return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)' };
      case 'Rejected': return { bg: 'rgba(239, 68, 68, 0.1)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.3)' };
      case 'Pending': return { bg: 'rgba(245, 158, 11, 0.1)', color: '#FBBF24', border: '1px solid rgba(245, 158, 11, 0.3)' };
      default: return { bg: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' };
    }
  };

  const handleAction = () => {
    console.log(`Action: ${actionType} on ${activeAppId} with note: ${internalNote}`);
    setActionType(null);
    setInternalNote('');
  };

  return (
    <div style={{ paddingBottom: '64px', minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px' }}>Verification & Badges</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Review teacher identities, credentials, and assign platform badges</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500' }}>Pending applications</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px', color: '#FBBF24' }}>14</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Avg age: 1.2 days</div>
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500' }}>Approved this week</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px', color: '#10B981' }}>8</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>+2 from last week</div>
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500' }}>Rejected</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px', color: '#F87171' }}>3</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>This week</div>
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500' }}>Total verified teachers</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px' }}>152</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>With 'Verified ID' badge</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', flex: 1, minHeight: '600px' }}>
        
        {/* Left Panel: Queue */}
        <div className="glass-panel" style={{ width: '340px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search applicants..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '8px 12px 8px 36px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.875rem' }}
              />
            </div>
          </div>
          
          <div style={{ overflowY: 'auto', flex: 1, padding: '12px' }}>
            {mockApplications.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase())).map(app => (
              <div 
                key={app.id}
                onClick={() => setActiveAppId(app.id)}
                style={{
                  padding: '16px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                  backgroundColor: activeAppId === app.id ? 'var(--accent-primary-alpha)' : 'var(--bg-primary)',
                  border: `1px solid ${activeAppId === app.id ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                  marginBottom: '12px',
                  transition: 'var(--transition)'
                }}
              >
                <div className="flex-between" style={{ marginBottom: '8px' }}>
                  <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{app.name}</div>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: '600', ...getStatusStyle(app.status) }}>{app.status}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{app.statusText}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{app.id}</span>
                  <span>{app.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Review Area */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {activeApp ? (
            <>
              <div className="flex-between" style={{ padding: '0 8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold' }}>
                    {activeApp.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{activeApp.name}</h2>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Teacher application · {activeApp.id}</div>
                  </div>
                </div>
                <button className="btn btn-outline" style={{ display: 'flex', gap: '6px', fontSize: '0.75rem', padding: '6px 12px' }}><User size={14}/> View full profile</button>
              </div>

              {/* Document Review Section */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={16} color="var(--text-muted)" /> Submitted Documents
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  {activeApp.documents.map((doc, i) => (
                    <div key={i} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                      <div style={{ height: '140px', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <FileText size={32} color="var(--text-muted)" />
                        <button className="btn-icon" style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                          <Maximize2 size={14} color="#FFF" />
                        </button>
                      </div>
                      <div style={{ padding: '12px', borderTop: '1px solid var(--border-color)' }}>
                        <div style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '4px' }}>{doc}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>PDF · 2.4 MB</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions & Badges Section */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                
                {/* Decision */}
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={16} color="var(--text-muted)" /> Decision
                  </h3>
                  
                  {activeApp.status === 'Pending' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn btn-primary" style={{ flex: 1, display: 'flex', gap: '8px', justifyContent: 'center', backgroundColor: '#10B981', borderColor: '#10B981' }} onClick={() => setActionType('Approve')}><CheckCircle size={16} /> Approve</button>
                        <button className="btn btn-danger" style={{ flex: 1, display: 'flex', gap: '8px', justifyContent: 'center' }} onClick={() => setActionType('Reject')}><XCircle size={16} /> Reject</button>
                      </div>
                      <button className="btn btn-outline" style={{ display: 'flex', gap: '8px', justifyContent: 'center' }} onClick={() => setActionType('RequestInfo')}><AlertCircle size={16} /> Request more info</button>
                    </div>
                  ) : (
                    <div style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>Application {activeApp.status.toLowerCase()}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>This application was processed. No further action needed.</div>
                    </div>
                  )}
                </div>

                {/* Badges */}
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={16} color="var(--text-muted)" /> Platform Badges
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-tertiary)' }}>
                      <input type="checkbox" checked={activeApp.status === 'Approved'} readOnly />
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>Verified Identity</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Displays blue checkmark on profile</div>
                      </div>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-tertiary)' }}>
                      <input type="checkbox" />
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>Top Rated Teacher</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Manual award for exceptional service</div>
                      </div>
                    </label>
                  </div>
                </div>

              </div>

            </>
          ) : (
             <div className="flex-center" style={{ height: '100%', color: 'var(--text-secondary)' }}>Select an application to review.</div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!actionType}
        title={`Confirm ${actionType?.toLowerCase()}`}
        message={`Are you sure you want to ${actionType?.toLowerCase()} this application for ${activeApp?.name}? An automatic email will be sent.`}
        confirmText="Confirm action"
        onConfirm={handleAction}
        onCancel={() => setActionType(null)}
        isDestructive={actionType === 'Reject'}
      >
        <div style={{ marginTop: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>Internal Note (optional)</label>
          <textarea 
            rows={3} 
            value={internalNote}
            onChange={(e) => setInternalNote(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none', resize: 'none' }} 
          />
        </div>
      </ConfirmDialog>

    </div>
  );
}
