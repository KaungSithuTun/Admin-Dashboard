import React, { useState } from 'react';
import { Search, Ban, Unlock, AlertTriangle, ShieldOff, Check } from 'lucide-react';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const mockUsers = [
  { id: 1, name: 'T. Malee', role: 'Teacher', reason: 'Off-platform solicitation', admin: 'Admin (Somsak)', status: 'Suspended', daysLeft: 12, details: 'Teacher - 6 active classes - 3 upcoming consultations' },
  { id: 2, name: 'S. Rattana', role: 'Student', reason: 'Repeated payment failures', admin: 'Admin (Priya)', status: 'Banned', daysLeft: null, details: 'Student - 0 active classes' },
  { id: 3, name: 'W. Chaiyarat', role: 'Teacher', reason: 'Harassment — student', admin: 'Admin (Somsak)', status: 'Suspended', daysLeft: 5, details: 'Teacher - 2 active classes' },
  { id: 4, name: 'P. Jaidee', role: 'Teacher', reason: 'Repeated no-show', admin: 'Admin (Priya)', status: 'Banned', daysLeft: null, details: 'Teacher - 0 active classes' },
  { id: 5, name: 'N. Wannasuk', role: 'Student', reason: 'Abusive chat behavior', admin: 'Admin (Somsak)', status: 'Suspended', daysLeft: 2, details: 'Student - 1 active class' },
];

export default function SuspensionBanning() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All'); // 'All', 'Suspended', 'Banned', 'ExpiringSoon'
  
  // Modals state
  const [activeUser, setActiveUser] = useState(null);
  const [isRestrictModalOpen, setIsRestrictModalOpen] = useState(false);
  const [restrictMode, setRestrictMode] = useState('Suspend'); // 'Suspend' or 'Ban'
  const [restrictReason, setRestrictReason] = useState('');
  const [restrictDuration, setRestrictDuration] = useState('14 days');
  const [restrictNote, setRestrictNote] = useState('');
  
  const [isBanConfirmOpen, setIsBanConfirmOpen] = useState(false);
  const [banConfirmText, setBanConfirmText] = useState('');

  const [isReinstateModalOpen, setIsReinstateModalOpen] = useState(false);
  const [reinstateNote, setReinstateNote] = useState('');

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.reason.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesType = true;
    if (filterType === 'Suspended') matchesType = u.status === 'Suspended';
    if (filterType === 'Banned') matchesType = u.status === 'Banned';
    if (filterType === 'ExpiringSoon') matchesType = u.status === 'Suspended' && u.daysLeft <= 7;
    return matchesSearch && matchesType;
  });

  const getStatusPill = (user) => {
    if (user.status === 'Banned') {
      return <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}>Banned</span>;
    }
    const isExpiringSoon = user.daysLeft <= 7;
    return (
      <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600', backgroundColor: 'var(--bg-tertiary)', color: isExpiringSoon ? '#F59E0B' : 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
        Suspended - {user.daysLeft}d left
      </span>
    );
  };

  const getRolePill = (role) => {
    return (
      <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '500', backgroundColor: role === 'Teacher' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)', color: role === 'Teacher' ? '#F59E0B' : '#3B82F6' }}>
        {role}
      </span>
    );
  };

  const handleOpenRestrict = (user, defaultMode = 'Suspend') => {
    setActiveUser(user);
    setRestrictMode(defaultMode);
    setRestrictReason('');
    setRestrictDuration('14 days');
    setRestrictNote('');
    setIsRestrictModalOpen(true);
  };

  const handleRestrictSubmit = () => {
    if (restrictMode === 'Ban') {
      setIsRestrictModalOpen(false);
      setIsBanConfirmOpen(true);
      setBanConfirmText('');
    } else {
      // Execute suspend
      const newUsers = users.map(u => {
        if (u.id === activeUser.id) {
          return { ...u, status: 'Suspended', daysLeft: parseInt(restrictDuration) };
        }
        return u;
      });
      setUsers(newUsers);
      setIsRestrictModalOpen(false);
    }
  };

  const handleConfirmBan = () => {
    if (banConfirmText !== activeUser.name) return;
    const newUsers = users.map(u => {
      if (u.id === activeUser.id) {
        return { ...u, status: 'Banned', daysLeft: null };
      }
      return u;
    });
    setUsers(newUsers);
    setIsBanConfirmOpen(false);
  };

  const handleOpenReinstate = (user) => {
    setActiveUser(user);
    setReinstateNote('');
    setIsReinstateModalOpen(true);
  };

  const handleConfirmReinstate = () => {
    const newUsers = users.filter(u => u.id !== activeUser.id); // Remove from list for demo
    setUsers(newUsers);
    setIsReinstateModalOpen(false);
  };

  return (
    <div style={{ paddingBottom: '64px', minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px' }}>Suspension & Banning</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage account restrictions and review automated policy enforcements</p>
        </div>
      </div>

      {/* KPIs Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500' }}>Currently suspended</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px', color: '#FBBF24' }}>{users.filter(u => u.status === 'Suspended').length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Temporary holds</div>
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500' }}>Permanently banned</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px', color: '#F87171' }}>{users.filter(u => u.status === 'Banned').length + 21}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>All time</div>
        </div>
        <div 
          className="glass-panel" 
          style={{ padding: '20px', cursor: 'pointer', border: filterType === 'ExpiringSoon' ? '1px solid #F59E0B' : '1px solid var(--border-color)' }}
          onClick={() => setFilterType(filterType === 'ExpiringSoon' ? 'All' : 'ExpiringSoon')}
        >
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500' }}>Suspensions expiring soon</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px' }}>{users.filter(u => u.status === 'Suspended' && u.daysLeft <= 7).length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Within 7 days</div>
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500' }}>Reinstated (this month)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px' }}>2</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>After suspension lifted</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex-between" style={{ marginBottom: '16px' }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 12px 10px 36px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', backgroundColor: 'var(--bg-secondary)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          {['Suspended', 'Banned', 'All'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              style={{
                padding: '6px 16px', border: 'none',
                background: filterType === tab ? 'var(--bg-tertiary)' : 'transparent',
                color: filterType === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                borderRadius: '4px', fontSize: '0.875rem', fontWeight: filterType === tab ? '500' : '400',
                cursor: 'pointer', transition: 'var(--transition)'
              }}
            >
              {tab === 'Suspended' && <ShieldOff size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }}/>}
              {tab === 'Banned' && <Ban size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }}/>}
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <div className="table-container" style={{ flex: 1, overflowY: 'auto' }}>
          <table className="premium-table">
            <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-secondary)', zIndex: 10 }}>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Reason</th>
                <th>Actioned by</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ fontWeight: '600' }}>{user.name}</td>
                  <td>{getRolePill(user.role)}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{user.reason}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{user.admin}</td>
                  <td>{getStatusPill(user)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                      <button className="btn-icon btn-ghost" title="Reinstate / Unlock" onClick={() => handleOpenReinstate(user)}><Unlock size={16} /></button>
                      {user.status === 'Suspended' && (
                        <button className="btn-icon btn-ghost" title="Escalate to Ban" style={{ color: 'var(--danger-text)' }} onClick={() => handleOpenRestrict(user, 'Ban')}><Ban size={16} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
                    No restricted users match your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restrict Account Modal */}
      {isRestrictModalOpen && activeUser && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="glass-panel" style={{ width: '480px', padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <ShieldOff size={20} color="#F87171" /> Restrict account
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Choose how to restrict this account. This action is logged and the user will be notified.</p>
            </div>
            
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', fontSize: '0.8rem' }}>
                  {activeUser.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{activeUser.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{activeUser.details}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                <div 
                  onClick={() => setRestrictMode('Suspend')}
                  style={{ padding: '12px', borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'center', border: `1px solid ${restrictMode === 'Suspend' ? '#F87171' : 'var(--border-color)'}`, backgroundColor: restrictMode === 'Suspend' ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-primary)' }}
                >
                  <div style={{ fontWeight: '600', color: restrictMode === 'Suspend' ? '#F87171' : 'var(--text-primary)', marginBottom: '4px' }}>Suspend</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Temporary · auto-lifts</div>
                </div>
                <div 
                  onClick={() => setRestrictMode('Ban')}
                  style={{ padding: '12px', borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'center', border: `1px solid ${restrictMode === 'Ban' ? '#EF4444' : 'var(--border-color)'}`, backgroundColor: restrictMode === 'Ban' ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg-primary)' }}
                >
                  <div style={{ fontWeight: '600', color: restrictMode === 'Ban' ? '#EF4444' : 'var(--text-primary)', marginBottom: '4px' }}>Ban</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Permanent · manual review</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>Reason</label>
                  <select value={restrictReason} onChange={(e) => setRestrictReason(e.target.value)} style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none' }}>
                    <option value="" disabled>Select reason...</option>
                    <option value="Off-platform payment solicitation">Off-platform payment solicitation</option>
                    <option value="Harassment">Harassment</option>
                    <option value="Repeated no-shows">Repeated no-shows</option>
                  </select>
                </div>

                {restrictMode === 'Suspend' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>Suspension duration</label>
                    <select value={restrictDuration} onChange={(e) => setRestrictDuration(e.target.value)} style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none' }}>
                      <option value="7">7 days</option>
                      <option value="14">14 days</option>
                      <option value="30">30 days</option>
                    </select>
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>Internal note (shown in audit log)</label>
                  <textarea rows={3} placeholder="Briefly describe why this action is being taken..." value={restrictNote} onChange={(e) => setRestrictNote(e.target.value)} style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none', resize: 'none' }} />
                </div>
              </div>

              {restrictMode === 'Suspend' ? (
                <div style={{ padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)', color: '#FCA5A5', fontSize: '0.75rem', lineHeight: '1.6', marginBottom: '24px' }}>
                  <strong style={{ display: 'block', marginBottom: '4px', color: '#F87171' }}>What happens on suspend:</strong>
                  Account login disabled · Upcoming classes cancelled and students notified · Pending payouts held until suspension lifts · Teacher can appeal via support email · Account auto-reinstates after {restrictDuration} unless escalated to ban
                </div>
              ) : (
                <div style={{ padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)', color: '#FCA5A5', fontSize: '0.75rem', lineHeight: '1.6', marginBottom: '24px' }}>
                  <strong style={{ display: 'block', marginBottom: '4px', color: '#F87171' }}>What happens on ban:</strong>
                  Account login permanently disabled · Banned users see a "your account has been permanently disabled" screen · Completed session payouts for teachers are still processed · Reinstatement requires manual admin review
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button className="btn btn-outline" onClick={() => setIsRestrictModalOpen(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleRestrictSubmit} disabled={!restrictReason || !restrictNote} style={{ opacity: (!restrictReason || !restrictNote) ? 0.5 : 1 }}>
                  {restrictMode === 'Suspend' ? 'Suspend account' : 'Ban account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Second Confirmation for Ban */}
      {isBanConfirmOpen && activeUser && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
          <div className="glass-panel" style={{ width: '400px', padding: '24px' }}>
            <div className="flex-center" style={{ gap: '12px', marginBottom: '16px' }}>
              <div style={{ padding: '8px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#F87171' }}>
                <AlertTriangle size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--danger-text)' }}>Confirm Permanent Ban</h3>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '16px', lineHeight: '1.6', textAlign: 'center' }}>
              You are about to permanently ban <strong>{activeUser.name}</strong>. This action will immediately block their access.
            </p>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.875rem', marginBottom: '8px', fontWeight: '500' }}>
              Type <strong>{activeUser.name}</strong> to confirm:
            </p>
            <input 
              type="text" 
              value={banConfirmText} 
              onChange={(e) => setBanConfirmText(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none', marginBottom: '24px' }} 
            />

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsBanConfirmOpen(false)}>Cancel</button>
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={handleConfirmBan} disabled={banConfirmText !== activeUser.name}>Permanently Ban</button>
            </div>
          </div>
        </div>
      )}

      {/* Reinstate Modal */}
      {isReinstateModalOpen && activeUser && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="glass-panel" style={{ width: '400px', padding: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' }}>Reinstate account</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>You are lifting the {activeUser.status.toLowerCase()} for <strong>{activeUser.name}</strong>. This requires a mandatory internal note.</p>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>Internal note (mandatory)</label>
              <textarea rows={3} placeholder="Explain why this account is being restored..." value={reinstateNote} onChange={(e) => setReinstateNote(e.target.value)} style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none', resize: 'none' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn btn-outline" onClick={() => setIsReinstateModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleConfirmReinstate} disabled={!reinstateNote.trim()}>Reinstate Account</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
