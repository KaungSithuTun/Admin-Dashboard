import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, Sliders, Shield, AlertTriangle, Play, Edit3, Settings } from 'lucide-react';

const mockAuditLog = [
  { id: 1, time: '17 May - 11:02', admin: 'Somsak', module: 'System controls', action: 'Toggled "new bookings" OFF then ON', result: 'Success' },
  { id: 2, time: '14 May - 08:45', admin: 'Priya', module: 'System controls', action: 'Enabled maintenance mode (30 min)', result: 'Success' },
  { id: 3, time: '10 May - 15:30', admin: 'Somsak', module: 'Keyword filters', action: 'Added "GBPay" to off-platform list', result: 'Success' },
  { id: 4, time: '2 May - 09:12', admin: 'Priya', module: 'Payouts', action: 'Triggered manual payout run', result: 'Success' },
  { id: 5, time: '28 Apr - 13:55', admin: 'Somsak', module: 'System controls', action: 'Attempted payout freeze — cancelled', result: 'Cancelled' },
];

const ToggleSwitch = ({ label, desc, isOn, onToggle }) => (
  <div className="flex-between" style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
    <div>
      <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{desc}</div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={onToggle}>
      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: isOn ? '#10B981' : 'var(--text-muted)' }}>{isOn ? 'On' : 'Off'}</span>
      {isOn ? <ToggleRight size={28} color="#10B981" /> : <ToggleLeft size={28} color="var(--text-muted)" />}
    </div>
  </div>
);

export default function SystemControls() {
  // Toggles State
  const [toggles, setToggles] = useState({
    newBookings: true,
    studentCancellations: true,
    teacherCancellations: true,
    consultationBookings: true,
    selfRescheduling: true,
    newStudentReg: true,
    newTeacherApp: true,
    inAppChat: true,
    requireTeacherApproval: true
  });

  // Numeric Overrides State
  const [overrides, setOverrides] = useState({
    cancelWindow: 24,
    rescheduleWindow: 4,
    maxSessions: 8,
    refundDays: 5,
    payoutCycle: 'Monthly (last day)',
    slaReminder: 3
  });

  const [sensitivity, setSensitivity] = useState('Balanced');

  // Modals state
  const [toggleConfirm, setToggleConfirm] = useState(null); // stores the key of toggle to flip off
  
  const [dangerAction, setDangerAction] = useState(null); // stores which danger button was clicked
  const [dangerConfirmText, setDangerConfirmText] = useState('');
  const [dangerPassword, setDangerPassword] = useState('');
  const [maintenanceTime, setMaintenanceTime] = useState('');

  const handleToggleClick = (key) => {
    if (toggles[key]) {
      // Trying to turn OFF -> needs confirmation
      setToggleConfirm(key);
    } else {
      // Turning ON is safe
      setToggles(prev => ({ ...prev, [key]: true }));
    }
  };

  const confirmToggleOff = () => {
    setToggles(prev => ({ ...prev, [toggleConfirm]: false }));
    setToggleConfirm(null);
  };

  const handleDangerClick = (action) => {
    setDangerAction(action);
    setDangerConfirmText('');
    setDangerPassword('');
    setMaintenanceTime('');
  };

  const confirmDangerAction = () => {
    if (dangerConfirmText !== 'CONFIRM' || dangerPassword !== 'admin123') return;
    
    // In a real app, this would dispatch the action and log success.
    console.log(`Executed: ${dangerAction.title}`);
    setDangerAction(null);
  };

  const cancelDangerAction = () => {
    // Log the cancellation to audit trail
    console.log(`Attempted ${dangerAction.title.toLowerCase()} — cancelled`);
    setDangerAction(null);
  };

  return (
    <div style={{ paddingBottom: '64px' }}>
      
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px' }}>Manual overrides & system control</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Emergency levers, platform thresholds, and danger zone actions</p>
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: '600', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '16px' }}>PLATFORM FEATURE TOGGLES</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '16px', color: 'var(--text-primary)' }}>Booking & sessions</div>
            <ToggleSwitch label="New bookings" desc="Allow students to book new sessions" isOn={toggles.newBookings} onToggle={() => handleToggleClick('newBookings')} />
            <ToggleSwitch label="Student-initiated cancellations" desc="Allow students to cancel their own bookings" isOn={toggles.studentCancellations} onToggle={() => handleToggleClick('studentCancellations')} />
            <ToggleSwitch label="Teacher-initiated cancellations" desc="Allow teachers to cancel sessions" isOn={toggles.teacherCancellations} onToggle={() => handleToggleClick('teacherCancellations')} />
            <ToggleSwitch label="Consultation session bookings" desc="Allow consultation slots to be booked" isOn={toggles.consultationBookings} onToggle={() => handleToggleClick('consultationBookings')} />
            <ToggleSwitch label="Self-rescheduling by student" desc="Allow students to move their own sessions" isOn={toggles.selfRescheduling} onToggle={() => handleToggleClick('selfRescheduling')} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '16px', color: 'var(--text-primary)' }}>Registration & chat</div>
            <ToggleSwitch label="New student registrations" desc="Allow new accounts to be created" isOn={toggles.newStudentReg} onToggle={() => handleToggleClick('newStudentReg')} />
            <ToggleSwitch label="New teacher applications" desc="Accept teacher sign-ups for review" isOn={toggles.newTeacherApp} onToggle={() => handleToggleClick('newTeacherApp')} />
            <ToggleSwitch label="In-app chat" desc="Enable messaging between students and teachers" isOn={toggles.inAppChat} onToggle={() => handleToggleClick('inAppChat')} />
          </div>
        </div>
      </div>

      {/* Overrides */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: '600', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '24px' }}>BOOKING & PAYMENT OVERRIDES</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
          
          <div className="flex-between" style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '4px' }}>Cancellation window</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Minimum hours before a session that a student or teacher can cancel without penalty</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="number" value={overrides.cancelWindow} onChange={(e) => setOverrides({...overrides, cancelWindow: e.target.value})} style={{ width: '80px', padding: '6px 12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none', textAlign: 'right' }} />
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', width: '30px' }}>hrs</span>
            </div>
          </div>

          <div className="flex-between" style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '4px' }}>Reschedule window</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Minimum hours before a session that self-rescheduling is allowed</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="number" value={overrides.rescheduleWindow} onChange={(e) => setOverrides({...overrides, rescheduleWindow: e.target.value})} style={{ width: '80px', padding: '6px 12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none', textAlign: 'right' }} />
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', width: '30px' }}>hrs</span>
            </div>
          </div>

          <div className="flex-between" style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '4px' }}>Max sessions per teacher per day</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Hard cap to prevent overbooking. 0 = no limit.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="number" value={overrides.maxSessions} onChange={(e) => setOverrides({...overrides, maxSessions: e.target.value})} style={{ width: '80px', padding: '6px 12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none', textAlign: 'right' }} />
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', width: '30px' }}>ses.</span>
            </div>
          </div>

          <div className="flex-between" style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '4px' }}>Refund processing time</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Business days for refunds to reach the student's payment method</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="number" value={overrides.refundDays} onChange={(e) => setOverrides({...overrides, refundDays: e.target.value})} style={{ width: '80px', padding: '6px 12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none', textAlign: 'right' }} />
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', width: '30px' }}>days</span>
            </div>
          </div>

          <div className="flex-between" style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '4px' }}>Teacher payout cycle</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>How often completed session earnings are paid out to teachers</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select value={overrides.payoutCycle} onChange={(e) => setOverrides({...overrides, payoutCycle: e.target.value})} style={{ padding: '8px 12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none' }}>
                <option>Weekly (Friday)</option>
                <option>Bi-weekly</option>
                <option>Monthly (last day)</option>
              </select>
            </div>
          </div>

          <div className="flex-between" style={{ padding: '12px 0' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '4px' }}>Manual payout trigger</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Force an immediate payout run outside the normal cycle — use for dispute resolutions</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button className="btn btn-outline" style={{ display: 'flex', gap: '6px' }}><Play size={14}/> Run payout now</button>
            </div>
          </div>

        </div>
      </div>

      {/* Auto-flag Keywords */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: '600', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '16px' }}>AUTO-FLAG KEYWORD MANAGEMENT</h3>
        
        <div className="flex-between" style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '4px' }}>Off-platform payment keywords</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>PromptPay, TrueMoney, PayPal, "pay me directly", "outside the app", "bank transfer"</div>
          </div>
          <button className="btn btn-outline" style={{ display: 'flex', gap: '6px', fontSize: '0.75rem', padding: '6px 12px' }}><Edit3 size={14}/> Edit list</button>
        </div>

        <div className="flex-between" style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '4px' }}>Contact info patterns</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>LINE ID, WhatsApp, Telegram, @gmail.com, phone number regex (+66...)</div>
          </div>
          <button className="btn btn-outline" style={{ display: 'flex', gap: '6px', fontSize: '0.75rem', padding: '6px 12px' }}><Edit3 size={14}/> Edit list</button>
        </div>

        <div className="flex-between" style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '4px' }}>Profanity & harassment filter</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Custom word list — flagged messages go to chat monitoring queue</div>
          </div>
          <button className="btn btn-outline" style={{ display: 'flex', gap: '6px', fontSize: '0.75rem', padding: '6px 12px' }}><Edit3 size={14}/> Edit list</button>
        </div>

        <div className="flex-between" style={{ padding: '12px 0' }}>
          <div>
            <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '4px' }}>Auto-flag sensitivity</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>How strict the keyword matching is — strict catches more but generates false positives</div>
          </div>
          <select value={sensitivity} onChange={(e) => setSensitivity(e.target.value)} style={{ padding: '8px 12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none' }}>
            <option>Strict</option>
            <option>Balanced</option>
            <option>Lenient</option>
          </select>
        </div>
      </div>

      {/* Teacher Approval */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: '600', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '16px' }}>TEACHER APPROVAL SETTINGS</h3>
        
        <ToggleSwitch 
          label="Require manual approval for new teachers" 
          desc="If off, approved teachers can go live immediately after registration" 
          isOn={toggles.requireTeacherApproval} 
          onToggle={() => handleToggleClick('requireTeacherApproval')} 
        />

        <div className="flex-between" style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '4px' }}>Required documents for approval</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID verification, teaching certificate, profile photo</div>
          </div>
          <button className="btn btn-outline" style={{ display: 'flex', gap: '6px', fontSize: '0.75rem', padding: '6px 12px' }}><Settings size={14}/> Configure</button>
        </div>

        <div className="flex-between" style={{ padding: '12px 0' }}>
          <div>
            <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '4px' }}>Approval SLA reminder</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Remind admin to review pending applications after this many days</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="number" value={overrides.slaReminder} onChange={(e) => setOverrides({...overrides, slaReminder: e.target.value})} style={{ width: '80px', padding: '6px 12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none', textAlign: 'right' }} />
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', width: '30px' }}>days</span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div style={{ border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '24px', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: '600', letterSpacing: '0.05em', color: '#F87171', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={16} /> DANGER ZONE
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '24px' }}>
          These actions affect all users immediately or irreversibly. Each requires a two-step confirmation — type "CONFIRM" and enter your admin password before executing.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {[
            { id: 'maintenance', title: 'Enable maintenance mode', desc: 'Takes the platform offline for all users. Shows a maintenance page.' },
            { id: 'signout', title: 'Force sign-out all users', desc: 'Ends all active sessions platform-wide immediately.' },
            { id: 'pause_bookings', title: 'Pause all new bookings', desc: 'Blocks new booking creation without taking the site offline.' },
            { id: 'freeze_payouts', title: 'Freeze all payouts', desc: 'Halts all scheduled teacher payouts until manually released.' }
          ].map(action => (
            <div 
              key={action.id} 
              onClick={() => handleDangerClick(action)}
              style={{ padding: '16px', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-primary)', cursor: 'pointer', transition: 'var(--transition)' }}
            >
              <div style={{ fontWeight: '600', fontSize: '0.875rem', color: '#F87171', marginBottom: '4px' }}>{action.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{action.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: '600', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '16px' }}>SYSTEM AUDIT LOG</h3>
        <table className="premium-table" style={{ width: '100%', fontSize: '0.875rem' }}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Admin</th>
              <th>Module</th>
              <th>Action</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {mockAuditLog.map(log => (
              <tr key={log.id}>
                <td style={{ color: 'var(--text-secondary)' }}>{log.time}</td>
                <td style={{ fontWeight: '600' }}>{log.admin}</td>
                <td>{log.module}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{log.action}</td>
                <td>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600', backgroundColor: log.result === 'Success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: log.result === 'Success' ? '#10B981' : '#F59E0B' }}>
                    {log.result}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Toggle Off Confirm Modal */}
      {toggleConfirm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="glass-panel" style={{ width: '400px', padding: '24px' }}>
            <div className="flex-center" style={{ gap: '12px', marginBottom: '16px' }}>
              <div style={{ padding: '8px', borderRadius: '50%', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}>
                <AlertTriangle size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Confirm feature disable</h3>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '24px', lineHeight: '1.6', textAlign: 'center' }}>
              You are about to turn off <strong>{toggleConfirm}</strong>. This has an immediate platform-wide effect. Are you sure you want to proceed?
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setToggleConfirm(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1, backgroundColor: '#F59E0B', borderColor: '#F59E0B', color: '#000' }} onClick={confirmToggleOff}>Disable Feature</button>
            </div>
          </div>
        </div>
      )}

      {/* Danger Zone Confirm Modal */}
      {dangerAction && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
          <div className="glass-panel" style={{ width: '420px', padding: '24px', border: '1px solid rgba(239, 68, 68, 0.5)' }}>
            <div className="flex-center" style={{ gap: '12px', marginBottom: '16px' }}>
              <div style={{ padding: '8px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#F87171' }}>
                <AlertTriangle size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#F87171' }}>{dangerAction.title}</h3>
            </div>
            
            <p style={{ color: 'var(--text-primary)', fontSize: '0.875rem', marginBottom: '24px', lineHeight: '1.6', textAlign: 'center', fontWeight: '500' }}>
              {dangerAction.desc}
            </p>

            {dangerAction.id === 'maintenance' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '8px' }}>Scheduled End Time (required)</label>
                <input 
                  type="datetime-local" 
                  value={maintenanceTime}
                  onChange={(e) => setMaintenanceTime(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none' }} 
                />
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '8px' }}>Type CONFIRM to proceed</label>
              <input 
                type="text" 
                placeholder="CONFIRM"
                value={dangerConfirmText}
                onChange={(e) => setDangerConfirmText(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none' }} 
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '8px' }}>Admin Password</label>
              <input 
                type="password" 
                placeholder="Enter password (mock: admin123)"
                value={dangerPassword}
                onChange={(e) => setDangerPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none' }} 
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={cancelDangerAction}>Cancel</button>
              <button 
                className="btn btn-danger" 
                style={{ flex: 1 }} 
                onClick={confirmDangerAction} 
                disabled={dangerConfirmText !== 'CONFIRM' || dangerPassword === '' || (dangerAction.id === 'maintenance' && !maintenanceTime)}
              >
                Execute
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
