import React, { useState } from 'react';
import { 
  DollarSign, Users, Calendar, GraduationCap, Percent, Star, Clock, AlertTriangle, 
  UserCheck, UserMinus, MessageCircle, ShieldOff
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';
import KPICard from '../../components/ui/KPICard';

// Mock Data
const revenueData = [
  { name: 'Jan', revenue: 550000, bookings: 1300 },
  { name: 'Feb', revenue: 620000, bookings: 1400 },
  { name: 'Mar', revenue: 680000, bookings: 1450 },
  { name: 'Apr', revenue: 750000, bookings: 1500 },
  { name: 'May', revenue: 800000, bookings: 1550 },
  { name: 'Jun', revenue: 842500, bookings: 1600 },
];

const userGrowthData = [
  { name: 'Jan', students: 250, teachers: 20 },
  { name: 'Feb', students: 280, teachers: 25 },
  { name: 'Mar', students: 310, teachers: 22 },
  { name: 'Apr', students: 360, teachers: 30 },
  { name: 'May', students: 390, teachers: 35 },
  { name: 'Jun', students: 420, teachers: 40 },
];

const categoryData = [
  { name: 'Languages', value: 38, color: '#3B82F6' },
  { name: 'Math', value: 22, color: '#F59E0B' },
  { name: 'Music', value: 18, color: '#10B981' },
  { name: 'Other', value: 22, color: '#8B5CF6' },
];

const bookingStatusData = [
  { name: 'Completed', value: 68, color: '#10B981' },
  { name: 'Upcoming', value: 21, color: '#3B82F6' },
  { name: 'Cancelled', value: 7, color: '#6B7280' },
  { name: 'Disputed', value: 4, color: '#F59E0B' },
];

const topCourses = [
  { course: 'IELTS Prep', teacher: 'K. Somchai', bookings: 214, max: 250 },
  { course: 'Business English', teacher: 'A. Wichit', bookings: 176, max: 250 },
  { course: 'Math Grade 9', teacher: 'P. Niran', bookings: 145, max: 250 },
  { course: 'Guitar Basics', teacher: 'T. Malee', bookings: 118, max: 250 },
  { course: 'SAT Math', teacher: 'S. Priya', bookings: 94, max: 250 },
];

const teacherPerformanceData = [
  { name: 'K. Somchai', rating: 4.8, sessions: 280, revenue: 85000 },
  { name: 'A. Wichit', rating: 4.5, sessions: 150, revenue: 45000 },
  { name: 'P. Niran', rating: 4.9, sessions: 200, revenue: 60000 },
  { name: 'T. Malee', rating: 4.2, sessions: 120, revenue: 30000 },
  { name: 'S. Priya', rating: 4.7, sessions: 180, revenue: 54000 },
  { name: 'J. Doe', rating: 3.8, sessions: 80, revenue: 15000 },
  { name: 'M. Lee', rating: 4.6, sessions: 220, revenue: 66000 },
  { name: 'R. Chen', rating: 4.1, sessions: 100, revenue: 25000 },
];

export default function Analytics() {
  const [dateRange, setDateRange] = useState('30d');

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel" style={{ padding: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: '4px 0', color: entry.color, fontSize: '0.875rem' }}>
              {entry.name}: {entry.name.toLowerCase().includes('revenue') ? `฿${entry.value.toLocaleString()}` : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const BubbleTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel" style={{ padding: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>{data.name}</p>
          <p style={{ margin: '4px 0', fontSize: '0.875rem' }}>Rating: <span style={{ fontWeight: '500' }}>{data.rating}</span></p>
          <p style={{ margin: '4px 0', fontSize: '0.875rem' }}>Sessions: <span style={{ fontWeight: '500' }}>{data.sessions}</span></p>
          <p style={{ margin: '4px 0', fontSize: '0.875rem' }}>Revenue: <span style={{ fontWeight: '500', color: '#3B82F6' }}>฿{data.revenue.toLocaleString()}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ paddingBottom: '64px' }}>
      
      {/* Header & Date Filter */}
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px' }}>Platform Analytics</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Performance metrics and health indicators</p>
        </div>
        
        <div style={{ display: 'flex', backgroundColor: 'var(--bg-secondary)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          {['7d', '30d', '90d', 'custom'].map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              style={{
                padding: '6px 16px',
                border: 'none',
                background: dateRange === range ? 'var(--bg-tertiary)' : 'transparent',
                color: dateRange === range ? 'var(--text-primary)' : 'var(--text-secondary)',
                borderRadius: '4px',
                fontSize: '0.875rem',
                fontWeight: dateRange === range ? '500' : '400',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              {range === 'custom' ? 'Custom' : range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '16px' }}>KEY PERFORMANCE INDICATORS</div>
      
      {/* Top KPIs Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '24px' }}>
        <KPICard title="Total revenue" value="฿842,500" delta="+12.4%" isPositive={true} icon={<DollarSign size={16}/>} />
        <KPICard title="Active users" value="3,218" delta="+8.1%" isPositive={true} icon={<Users size={16}/>} />
        <KPICard title="Bookings this month" value="1,540" delta="-3.2%" isPositive={false} icon={<Calendar size={16}/>} />
        <KPICard title="Active teachers" value="184" delta="+5" isPositive={true} icon={<GraduationCap size={16}/>} />
      </div>

      {/* Top KPIs Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <KPICard title="Platform commission" value="฿126,375" delta="15% avg rate" isPositive={true} icon={<Percent size={16}/>} />
        <KPICard title="Avg teacher rating" value="4.7 / 5" delta="from 920 reviews" isPositive={true} icon={<Star size={16}/>} />
        <KPICard title="Avg session length" value="58 min" delta="+4 min" isPositive={true} icon={<Clock size={16}/>} />
        <KPICard title="Open disputes" value="12" delta="3 escalated" isPositive={false} icon={<AlertTriangle size={16}/>} linkTo="/complaints" valueColor="#F87171" />
      </div>

      <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '16px' }}>REVENUE & BOOKINGS OVER TIME</div>

      {/* Hero Chart: Line Chart */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={revenueData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis yAxisId="left" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `฿${value/1000}k`} />
            <YAxis yAxisId="right" orientation="right" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
            <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue (฿)" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            <Line yAxisId="right" type="monotone" dataKey="bookings" name="Bookings" stroke="#10B981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 2-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* User Growth */}
        <div className="glass-panel" style={{ padding: '24px', height: '350px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '4px' }}>User growth</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>New students vs new teachers per month</p>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowthData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'var(--bg-tertiary)' }} contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="students" name="Students" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar dataKey="teachers" name="Teachers" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by category */}
        <div className="glass-panel" style={{ padding: '24px', height: '350px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '4px' }}>Revenue by category</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>Breakdown of revenue across subject categories</p>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value" style={{ cursor: 'pointer' }}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }} formatter={(value) => `${value}%`} />
                <Legend layout="horizontal" verticalAlign="top" iconType="square" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 2-Column Grid Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        
        {/* Top 5 courses by bookings */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '4px' }}>Top 5 courses by bookings</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>This month — click to drill into course detail</p>
          
          <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ paddingBottom: '12px', fontWeight: '500' }}>Course</th>
                <th style={{ paddingBottom: '12px', fontWeight: '500' }}>Teacher</th>
                <th style={{ paddingBottom: '12px', fontWeight: '500', textAlign: 'right' }}>Bookings</th>
              </tr>
            </thead>
            <tbody>
              {topCourses.map((course, idx) => (
                <tr key={idx} style={{ borderBottom: idx !== topCourses.length -1 ? '1px solid var(--border-color)' : 'none', cursor: 'pointer' }} className="group">
                  <td style={{ padding: '16px 0', fontWeight: '500', color: 'var(--text-primary)' }} className="group-hover:text-blue-400">{course.course}</td>
                  <td style={{ padding: '16px 0', color: 'var(--text-secondary)' }}>{course.teacher}</td>
                  <td style={{ padding: '16px 0', textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                    <div style={{ width: '100px', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${(course.bookings / course.max) * 100}%`, height: '100%', background: '#3B82F6', borderRadius: '3px' }} />
                    </div>
                    <span style={{ fontWeight: '600', minWidth: '30px' }}>{course.bookings}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Booking status breakdown */}
        <div className="glass-panel" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '4px' }}>Booking status breakdown</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>All bookings this month by current status</p>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={bookingStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                  {bookingStatusData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      stroke={entry.name === 'Disputed' ? '#FCD34D' : 'none'} 
                      strokeWidth={entry.name === 'Disputed' ? 2 : 0} 
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }} formatter={(value) => `${value}%`} />
                <Legend layout="horizontal" verticalAlign="top" iconType="square" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '16px' }}>TEACHER PERFORMANCE</div>

      {/* Bubble Chart */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px', height: '400px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '4px' }}>Top teachers — rating vs sessions completed</h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>Bubble size = total revenue generated. Hover to see teacher name and stats.</p>
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis type="number" dataKey="sessions" name="Sessions completed" domain={[0, 350]} stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis type="number" dataKey="rating" name="Avg rating" domain={[3.5, 5.0]} stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <ZAxis type="number" dataKey="revenue" range={[100, 1000]} name="Revenue" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<BubbleTooltip />} />
              <Scatter name="Teachers" data={teacherPerformanceData} fill="#3B82F6" fillOpacity={0.6} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '16px' }}>PLATFORM HEALTH</div>

      {/* Bottom KPIs Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        <KPICard title="Teacher approval rate" value="71%" delta="24 pending review" isPositive={true} icon={<UserCheck size={16}/>} />
        <KPICard title="Student churn rate" value="6.2%" delta="-1.1%" isPositive={true} icon={<UserMinus size={16}/>} />
        <KPICard title="Consultation uptake" value="38%" delta="of active students" isPositive={true} icon={<MessageCircle size={16}/>} />
        <KPICard title="Suspension rate" value="0.4%" delta="+0.1%" isPositive={false} icon={<ShieldOff size={16}/>} linkTo="/suspension" valueColor="#F87171" />
      </div>

      <style>{`
        .group:hover td { background-color: rgba(255, 255, 255, 0.02); }
      `}</style>
    </div>
  );
}
