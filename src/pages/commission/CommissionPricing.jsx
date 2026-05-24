import React, { useState, useEffect } from 'react';
import { AlertTriangle, Check, Plus, Trash2, HelpCircle } from 'lucide-react';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function CommissionPricing() {
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  
  // Settings State
  const [globalComm, setGlobalComm] = useState(15);
  const [trialComm, setTrialComm] = useState(10);
  const [trialDuration, setTrialDuration] = useState(3);
  const [consultComm, setConsultComm] = useState(10);



  // Tiers State
  const [tiers, setTiers] = useState([
    { id: 1, name: 'Starter', min: 0, max: 19, rate: 15 },
    { id: 2, name: 'Growth', min: 20, max: 49, rate: 13 },
    { id: 3, name: 'Pro', min: 50, max: 99, rate: 11 },
    { id: 4, name: 'Elite', min: 100, max: '', rate: 9 },
  ]);

  // Overrides State
  const [overrides, setOverrides] = useState([
    { id: 1, teacher: 'K. Somchai', reason: 'Top performer', customRate: 9, globalRate: 15, payRate: 900, expires: 'No expiry' },
    { id: 2, teacher: 'A. Wichit', reason: 'Negotiated contract', customRate: 10, globalRate: 15, payRate: 850, expires: '31 Dec 2025' },
    { id: 3, teacher: 'T. Malee', reason: 'Penalty — dispute', customRate: 20, globalRate: 15, payRate: 700, expires: '30 Jun 2025' },
  ]);

  // Track changes to prompt save
  useEffect(() => {
    // In a real app we'd deep compare with original state, here we just listen to interactions
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  const markChanged = () => setHasChanges(true);

  const handleSaveClick = () => {
    setIsSaveModalOpen(true);
  };

  const handleConfirmSave = () => {
    setHasChanges(false);
    setIsSaveModalOpen(false);
    console.log("Saved all commission & pricing settings");
  };

  const handleDiscard = () => {
    if(window.confirm('Discard all unsaved changes?')) {
      // Normally reset to original state, we'll just toggle flag for demo
      setHasChanges(false);
    }
  };

  const InputField = ({ label, desc, value, onChange, unit }) => (
    <div className="flex-between" style={{ padding: '16px 0', borderBottom: '1px solid var(--border-color)' }}>
      <div style={{ maxWidth: '60%' }}>
        <div style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '4px' }}>{label}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{desc}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <input 
          type="number" 
          value={value} 
          onChange={(e) => { onChange(e.target.value); markChanged(); }}
          style={{ width: '80px', padding: '8px 12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none', textAlign: 'right' }}
        />
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', minWidth: '30px' }}>{unit}</span>
      </div>
    </div>
  );

  return (
    <div style={{ paddingBottom: '64px' }}>
      
      {/* Page Header */}
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px' }}>Commission & pricing</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Control platform commission rates and teacher pay rates</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="btn btn-outline" 
            onClick={handleDiscard}
            disabled={!hasChanges}
            style={{ opacity: hasChanges ? 1 : 0.5 }}
          >
            Discard changes
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSaveClick}
            disabled={!hasChanges}
            style={{ opacity: hasChanges ? 1 : 0.5 }}
          >
            <Check size={16} /> Save all changes
          </button>
        </div>
      </div>

      {/* KPIs Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500' }}>Platform commission (avg)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px' }}>15%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Across all teachers</div>
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500' }}>Commission earned (May)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px' }}>฿126,375</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>From ฿842,500 revenue</div>
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500' }}>Teacher overrides active</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px' }}>6</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Custom rates applied</div>
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500' }}>Avg teacher pay rate</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px' }}>฿850/hr</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Across 184 teachers</div>
        </div>
      </div>

      {/* Warning Banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: 'rgba(251, 146, 60, 0.1)', border: '1px solid rgba(251, 146, 60, 0.3)', borderRadius: 'var(--radius-md)', color: '#FDBA74', marginBottom: '24px', fontSize: '0.875rem' }}>
        <AlertTriangle size={18} />
        Changes to global commission or pricing rules affect all teachers without individual overrides. A confirmation dialog must appear before saving.
      </div>

      {/* Global Commission Settings */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--text-muted)' }}>%</span> Global commission settings
        </h3>
        <InputField 
          label="Default platform commission rate" 
          desc="Applied to all teachers unless overridden" 
          value={globalComm} onChange={setGlobalComm} unit="%" 
        />
        <InputField 
          label="New teacher trial rate" 
          desc="Applied for first 3 months after approval" 
          value={trialComm} onChange={setTrialComm} unit="%" 
        />
        <InputField 
          label="Trial period duration" 
          desc="Months before switching to standard rate" 
          value={trialDuration} onChange={setTrialDuration} unit="months" 
        />
        <InputField 
          label="Consultation session commission" 
          desc="Rate applied to consultation bookings only" 
          value={consultComm} onChange={setConsultComm} unit="%" 
        />
      </div>

      {/* Commission Tiers */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <div className="flex-between" style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--text-muted)' }}>◆</span> Commission tiers (volume-based)
          </h3>
          <button className="btn btn-outline" style={{ display: 'flex', gap: '8px' }}>
            <Plus size={16} /> Add tier
          </button>
        </div>

        <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
              <th style={{ paddingBottom: '12px', fontWeight: '500', width: '30%' }}>Tier name</th>
              <th style={{ paddingBottom: '12px', fontWeight: '500', textAlign: 'center' }}>Sessions/mo (min)</th>
              <th style={{ paddingBottom: '12px', fontWeight: '500', textAlign: 'center' }}>Sessions/mo (max)</th>
              <th style={{ paddingBottom: '12px', fontWeight: '500', textAlign: 'center' }}>Commission rate</th>
              <th style={{ paddingBottom: '12px', fontWeight: '500', textAlign: 'right' }}></th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier, idx) => {
              const colors = ['#A1A1AA', '#3B82F6', '#10B981', '#F59E0B'];
              return (
                <tr key={tier.id} style={{ borderBottom: idx !== tiers.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                  <td style={{ padding: '16px 0', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colors[idx] }} />
                    {tier.name}
                  </td>
                  <td style={{ padding: '16px 0', textAlign: 'center' }}>
                    <input type="number" defaultValue={tier.min} onChange={markChanged} style={{ width: '60px', padding: '6px', textAlign: 'center', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none' }} />
                  </td>
                  <td style={{ padding: '16px 0', textAlign: 'center' }}>
                    <input type="text" defaultValue={tier.max} onChange={markChanged} style={{ width: '60px', padding: '6px', textAlign: 'center', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none' }} />
                  </td>
                  <td style={{ padding: '16px 0', textAlign: 'center' }}>
                    <input type="number" defaultValue={tier.rate} onChange={markChanged} style={{ width: '60px', padding: '6px', textAlign: 'center', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none' }} />
                  </td>
                  <td style={{ padding: '16px 0', textAlign: 'right' }}>
                    <button className="btn-icon btn-ghost" style={{ color: 'var(--text-secondary)' }}><Trash2 size={16}/></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Per-teacher overrides */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <div className="flex-between" style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--text-muted)' }}>👤</span> Per-teacher rate overrides
          </h3>
          <button className="btn btn-outline" style={{ display: 'flex', gap: '8px' }}>
            <Plus size={16} /> Add override
          </button>
        </div>

        <div className="table-container">
          <table className="premium-table" style={{ width: '100%', fontSize: '0.875rem' }}>
            <thead>
              <tr>
                <th>Teacher</th>
                <th>Reason</th>
                <th>Commission rate</th>
                <th>Pay rate</th>
                <th>Expires</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {overrides.map((override) => {
                const isLower = override.customRate < override.globalRate;
                const isHigher = override.customRate > override.globalRate;
                let bg = 'var(--bg-tertiary)', color = 'var(--text-secondary)';
                if(isLower) { bg = 'rgba(74, 222, 128, 0.1)'; color = '#4ADE80'; }
                if(isHigher) { bg = 'rgba(239, 68, 68, 0.1)'; color = '#F87171'; }
                
                return (
                  <tr key={override.id}>
                    <td style={{ fontWeight: '500' }}>{override.teacher}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{override.reason}</td>
                    <td>
                      <span style={{ padding: '4px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '600', backgroundColor: bg, color: color }}>
                        {override.customRate}% <span style={{ fontWeight: '400', opacity: 0.7 }}>vs {override.globalRate}%</span>
                      </span>
                    </td>
                    <td style={{ fontWeight: '500' }}>฿{override.payRate}/hr</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{override.expires}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button className="btn-icon btn-ghost"><HelpCircle size={16} /></button>
                        <button className="btn-icon btn-ghost" style={{ color: 'var(--danger-text)' }}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Change Log */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          Change log
        </h3>
        
        <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ paddingBottom: '12px', fontWeight: '500' }}>Date</th>
              <th style={{ paddingBottom: '12px', fontWeight: '500' }}>Changed by</th>
              <th style={{ paddingBottom: '12px', fontWeight: '500' }}>Change</th>
              <th style={{ paddingBottom: '12px', fontWeight: '500' }}>Previous</th>
              <th style={{ paddingBottom: '12px', fontWeight: '500' }}>New value</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '16px 0', color: 'var(--text-secondary)' }}>14 May 2025</td>
              <td style={{ padding: '16px 0' }}>Admin (Somsak)</td>
              <td style={{ padding: '16px 0' }}>Global commission rate</td>
              <td style={{ padding: '16px 0', color: 'var(--text-secondary)' }}>18%</td>
              <td style={{ padding: '16px 0' }}>
                <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '500', backgroundColor: 'rgba(74, 222, 128, 0.1)', color: '#4ADE80' }}>15%</span>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '16px 0', color: 'var(--text-secondary)' }}>2 Apr 2025</td>
              <td style={{ padding: '16px 0' }}>Admin (Somsak)</td>
              <td style={{ padding: '16px 0' }}>Override added — T. Malee</td>
              <td style={{ padding: '16px 0', color: 'var(--text-secondary)' }}>15% (default)</td>
              <td style={{ padding: '16px 0' }}>
                <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '500', backgroundColor: 'rgba(251, 146, 60, 0.1)', color: '#FB923C' }}>20%</span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '16px 0', color: 'var(--text-secondary)' }}>1 Jan 2025</td>
              <td style={{ padding: '16px 0' }}>Admin (Priya)</td>
              <td style={{ padding: '16px 0' }}>Min course price</td>
              <td style={{ padding: '16px 0', color: 'var(--text-secondary)' }}>฿150/hr</td>
              <td style={{ padding: '16px 0' }}>
                <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '500', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>฿200/hr</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={isSaveModalOpen}
        title="Confirm global changes"
        message="This will affect 184 teachers currently using the default global rates. Are you sure you want to apply these changes?"
        confirmText="Save changes"
        onConfirm={handleConfirmSave}
        onCancel={() => setIsSaveModalOpen(false)}
        isDestructive={false}
      />

    </div>
  );
}
