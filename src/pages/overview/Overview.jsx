import React from 'react';
import { Users, BookOpen, DollarSign, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const revenueData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
  { name: 'Jul', value: 7000 },
];

const sessionsData = [
  { name: 'Mon', completed: 120, cancelled: 12 },
  { name: 'Tue', completed: 132, cancelled: 8 },
  { name: 'Wed', completed: 101, cancelled: 15 },
  { name: 'Thu', completed: 143, cancelled: 5 },
  { name: 'Fri', completed: 160, cancelled: 10 },
  { name: 'Sat', completed: 210, cancelled: 22 },
  { name: 'Sun', completed: 190, cancelled: 18 },
];

export default function Overview() {
  return (
    <div style={{ paddingBottom: '64px' }}>
      
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back. Here is what's happening on your platform today.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select style={{ padding: '8px 12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none' }}>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Revenue', value: '฿124,500', trend: '+12.5%', isUp: true, icon: <DollarSign size={20} color="#10B981" />, bg: 'rgba(16, 185, 129, 0.1)' },
          { label: 'Active Students', value: '3,402', trend: '+4.2%', isUp: true, icon: <Users size={20} color="#3B82F6" />, bg: 'rgba(59, 130, 246, 0.1)' },
          { label: 'Active Teachers', value: '184', trend: '-1.1%', isUp: false, icon: <BookOpen size={20} color="#F59E0B" />, bg: 'rgba(245, 158, 11, 0.1)' },
          { label: 'Pending Approvals', value: '12', trend: 'Needs review', isUp: null, icon: <Clock size={20} color="#8B5CF6" />, bg: 'rgba(139, 92, 246, 0.1)' }
        ].map((kpi, i) => (
          <div key={i} className="glass-panel" style={{ padding: '24px' }}>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <div style={{ padding: '10px', borderRadius: '50%', backgroundColor: kpi.bg }}>
                {kpi.icon}
              </div>
              {kpi.isUp !== null && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem', fontWeight: '500', color: kpi.isUp ? '#10B981' : '#F87171' }}>
                  {kpi.isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {kpi.trend}
                </div>
              )}
              {kpi.isUp === null && (
                <div style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  {kpi.trend}
                </div>
              )}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{kpi.label}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Revenue Chart */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '24px' }}>Platform Revenue Overview</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `฿${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sessions Activity */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '24px' }}>Sessions (This Week)</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessionsData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                  cursor={{ fill: 'var(--bg-secondary)' }}
                />
                <Bar dataKey="completed" stackId="a" fill="#3B82F6" radius={[0, 0, 4, 4]} />
                <Bar dataKey="cancelled" stackId="a" fill="#4B5563" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
