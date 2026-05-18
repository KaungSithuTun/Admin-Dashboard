import React, { useState, useEffect } from 'react';
import { Megaphone, AlertTriangle, Tag, MessageSquare, Users, BookOpen, User, Bell, Mail, Smartphone, Save, Calendar, Send, Eye, Check, FileText } from 'lucide-react';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const mockHistory = [
  { id: 1, title: 'New reschedule feature', type: 'Announcement', audience: 'All users', reach: '3,402', sentBy: 'Somsak', date: '17 May 2025' },
  { id: 2, title: 'Maintenance — 14 May 02:00', type: 'System alert', audience: 'All users', reach: '3,389', sentBy: 'Priya', date: '12 May 2025' },
  { id: 3, title: 'Songkran holiday discount', type: 'Promotion', audience: 'Active students', reach: '2,841', sentBy: 'Somsak', date: '9 Apr 2025' },
  { id: 4, title: 'Teacher payout update', type: 'Announcement', audience: 'All teachers', reach: '184', sentBy: 'Priya', date: '1 Apr 2025' },
];

const templates = [
  { id: 1, title: 'Scheduled maintenance', type: 'System alert', audience: ['All students', 'All teachers'], body: 'The platform will be undergoing scheduled maintenance on [Date] from [Time]. You will not be able to log in during this window. We apologize for the inconvenience.' },
  { id: 2, title: 'New teacher welcome', type: 'Announcement', audience: ['All teachers'], body: 'Welcome to the platform! Please make sure your profile is fully complete and your availability calendar is up to date so students can start booking.' },
  { id: 3, title: 'Session reminder (custom)', type: 'Direct message', audience: ['Specific users'], body: 'Hi [Name], this is a reminder that you have an upcoming session in 24 hours. Please log in to confirm your attendance.' },
  { id: 4, title: 'Seasonal promotion', type: 'Promotion', audience: ['All students', 'Active only'], body: 'Enjoy 20% off all language courses this week! Use code LEARN20 at checkout.' },
];

export default function Notifications() {
  const [type, setType] = useState('Announcement');
  const [title, setTitle] = useState('New feature: reschedule sessions up to 4 hours');
  const [body, setBody] = useState('You can now reschedule any upcoming session up to 4 hours before it starts — directly from your booking page. No need to contact support.');
  const [link, setLink] = useState('https://platform.com/bookings');
  
  const [audience, setAudience] = useState(['All students', 'All teachers']);
  const [channels, setChannels] = useState(['In-app', 'Email']);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Audience toggle logic
  const toggleAudience = (chip) => {
    setAudience(prev => 
      prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]
    );
  };

  // Channel toggle logic
  const toggleChannel = (ch) => {
    setChannels(prev => 
      prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch]
    );
  };

  // Live estimate calc
  const getEstimatedReach = () => {
    let base = 0;
    if (audience.includes('All students')) base += 3218;
    if (audience.includes('All teachers')) base += 184;
    if (audience.includes('Specific users')) base = 1;
    if (audience.includes('Active only')) base = Math.floor(base * 0.85);
    if (base === 0 && audience.length > 0) base = 450; // mock 'By course'
    return base.toLocaleString();
  };

  // Auto-set channels based on type
  useEffect(() => {
    if (type === 'System alert') setChannels(['In-app', 'Email', 'Push']);
    if (type === 'Promotion') setChannels(['In-app']);
  }, [type]);

  const handleTemplateClick = (t) => {
    setType(t.type);
    setTitle(t.title);
    setBody(t.body);
    setAudience(t.audience);
    setLink('');
  };

  const handleSendNow = () => {
    setIsConfirmOpen(true);
  };

  const confirmSend = () => {
    console.log('Notification sent!', { type, title, body, audience, channels });
    setIsConfirmOpen(false);
  };

  const getTypeStyle = (t) => {
    switch (t) {
      case 'Announcement': return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', icon: <Megaphone size={16} /> };
      case 'System alert': return { bg: 'rgba(239, 68, 68, 0.1)', color: '#F87171', icon: <AlertTriangle size={16} /> };
      case 'Promotion': return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10B981', icon: <Tag size={16} /> };
      case 'Direct message': return { bg: 'var(--bg-tertiary)', color: 'var(--text-primary)', icon: <MessageSquare size={16} /> };
      default: return { bg: 'var(--bg-tertiary)', color: 'var(--text-primary)', icon: <Megaphone size={16} /> };
    }
  };

  return (
    <div style={{ paddingBottom: '64px' }}>
      
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px' }}>Notifications & announcements</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Send targeted messages, alerts, and promos to users</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Left: Compose */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Send size={18} /> Compose notification
          </h3>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '12px' }}>Notification type</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { id: 'Announcement', icon: <Megaphone size={16}/>, desc: 'Platform news, updates' },
                { id: 'System alert', icon: <AlertTriangle size={16}/>, desc: 'Downtime, urgent notice' },
                { id: 'Promotion', icon: <Tag size={16}/>, desc: 'Offers, discounts' },
                { id: 'Direct message', icon: <MessageSquare size={16}/>, desc: 'Specific user(s)' }
              ].map(t => (
                <div 
                  key={t.id} 
                  onClick={() => setType(t.id)}
                  style={{ 
                    padding: '12px', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '12px',
                    border: `1px solid ${type === t.id ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    backgroundColor: type === t.id ? 'var(--accent-primary-alpha)' : 'var(--bg-primary)',
                    transition: 'var(--transition)'
                  }}
                >
                  <div style={{ color: type === t.id ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>{t.icon}</div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.875rem', color: type === t.id ? 'var(--text-primary)' : 'var(--text-primary)' }}>{t.id}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none' }} 
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>Message body</label>
            <textarea 
              rows={4} 
              value={body} 
              onChange={e => setBody(e.target.value)} 
              style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none', resize: 'vertical' }} 
            />
            <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {body.length} / 300 characters
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>Link (optional)</label>
            <input 
              type="text" 
              value={link} 
              onChange={e => setLink(e.target.value)} 
              placeholder="https://"
              style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none' }} 
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '12px' }}>Send to</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              {[
                { id: 'All students', icon: <Users size={14}/> },
                { id: 'All teachers', icon: <Users size={14}/> },
                { id: 'Active only', icon: <Check size={14}/> },
                { id: 'By course', icon: <BookOpen size={14}/> },
                { id: 'Specific users', icon: <User size={14}/> }
              ].map(chip => (
                <button
                  key={chip.id}
                  onClick={() => toggleAudience(chip.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '500', cursor: 'pointer',
                    border: `1px solid ${audience.includes(chip.id) ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    backgroundColor: audience.includes(chip.id) ? 'var(--accent-primary-alpha)' : 'var(--bg-primary)',
                    color: audience.includes(chip.id) ? 'var(--accent-primary)' : 'var(--text-secondary)'
                  }}
                >
                  {chip.icon} {chip.id}
                </button>
              ))}
            </div>
            <div className="flex-between" style={{ padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Estimated reach</span>
              <span style={{ fontWeight: '700', fontSize: '1rem' }}>{getEstimatedReach()} <span style={{ fontSize: '0.75rem', fontWeight: '400', color: 'var(--text-muted)' }}>users</span></span>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '12px' }}>Delivery channels</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { id: 'In-app', icon: <Bell size={16}/> },
                { id: 'Email', icon: <Mail size={16}/> },
                { id: 'Push', icon: <Smartphone size={16}/> }
              ].map(ch => (
                <button
                  key={ch.id}
                  onClick={() => toggleChannel(ch.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer',
                    border: `1px solid ${channels.includes(ch.id) ? '#3B82F6' : 'var(--border-color)'}`,
                    backgroundColor: channels.includes(ch.id) ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-primary)',
                    color: channels.includes(ch.id) ? '#3B82F6' : 'var(--text-secondary)'
                  }}
                >
                  {ch.icon} {ch.id}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-between" style={{ paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Schedule for</span>
              <select style={{ padding: '8px 12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none' }}>
                <option>Send immediately</option>
                <option>Custom date/time...</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-outline" style={{ display: 'flex', gap: '6px' }}><Save size={14}/> Save draft</button>
              <button className="btn btn-outline" style={{ display: 'flex', gap: '6px' }}><Calendar size={14}/> Schedule</button>
              <button className="btn btn-primary" style={{ display: 'flex', gap: '6px' }} onClick={handleSendNow} disabled={!title || !body || audience.length === 0}>
                <Send size={14}/> Send now
              </button>
            </div>
          </div>
        </div>

        {/* Right: Preview & Templates */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-panel" style={{ padding: '24px', flex: 1 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={16} color="var(--text-muted)" /> Preview
            </h3>
            <div style={{ fontSize: '0.65rem', fontWeight: '600', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '8px' }}>IN-APP NOTIFICATION</div>
            
            <div style={{ backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)', padding: '16px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: getTypeStyle(type).bg, color: getTypeStyle(type).color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {getTypeStyle(type).icon}
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '4px', lineHeight: '1.4' }}>{title || 'Notification title'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '8px' }}>
                    {body || 'Notification message body will appear here...'}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Just now</div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} color="var(--text-muted)" /> Templates
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {templates.map(t => (
                <div 
                  key={t.id}
                  onClick={() => handleTemplateClick(t)}
                  style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer', backgroundColor: 'var(--bg-primary)', transition: 'var(--transition)' }}
                  className="hover:border-blue-500"
                >
                  <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '2px' }}>{t.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t.type} · {t.audience.join(', ')}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Sent History Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px' }}>Sent history</h3>
        <table className="premium-table" style={{ width: '100%', fontSize: '0.875rem' }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Audience</th>
              <th>Reach</th>
              <th>Sent by</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockHistory.map(h => (
              <tr key={h.id}>
                <td style={{ fontWeight: '600' }}>{h.title}</td>
                <td>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600', backgroundColor: getTypeStyle(h.type).bg, color: getTypeStyle(h.type).color }}>
                    {h.type}
                  </span>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{h.audience}</td>
                <td style={{ fontWeight: '500' }}>{h.reach}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{h.sentBy}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{h.date}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn-icon btn-ghost"><Eye size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Confirm sending notification"
        message={`You are about to send an ${type.toLowerCase()} to approximately ${getEstimatedReach()} users via ${channels.join(', ')}. This action cannot be undone once sent.`}
        confirmText="Send immediately"
        onConfirm={confirmSend}
        onCancel={() => setIsConfirmOpen(false)}
        isDestructive={false}
      />

    </div>
  );
}


