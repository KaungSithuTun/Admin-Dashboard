import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Users, GraduationCap, LayoutDashboard, BadgeCheck, MessageSquare, CalendarCheck, AlertTriangle, UserMinus, BarChart3, Bell, Settings, LayoutList, Percent } from 'lucide-react';

export default function AdminLayout() {
  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/' },
    { icon: <Users size={20} />, label: 'Students', path: '/students' },
    { icon: <GraduationCap size={20} />, label: 'Teachers', path: '/teachers' },
    { icon: <BadgeCheck size={20} />, label: 'Verification', path: '/verification' },
    { icon: <LayoutList size={20} />, label: 'Categories & Subjects', path: '/categories' },
    { icon: <Percent size={20} />, label: 'Commission & Pricing', path: '/commission' },
    { icon: <MessageSquare size={20} />, label: 'Chat Monitoring', path: '/chat' },
    { icon: <CalendarCheck size={20} />, label: 'Bookings', path: '/bookings' },
    { icon: <AlertTriangle size={20} />, label: 'Complaints', path: '/complaints' },
    { icon: <UserMinus size={20} />, label: 'Suspension', path: '/suspension' },
    { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/analytics' },
    { icon: <Bell size={20} />, label: 'Notifications', path: '/notifications' },
    { icon: <Settings size={20} />, label: 'System Controls', path: '/settings' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
      }}>
        <div style={{ padding: '0 24px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold' }}>
            A
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.02em' }}>AdminDash</span>
        </div>

        <nav style={{ flex: 1, overflowY: 'auto', padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                textDecoration: 'none',
                transition: 'var(--transition)',
                fontWeight: isActive ? '500' : '400',
              })}
            >
              <span style={{ color: item.isActive ? 'var(--accent-primary)' : 'inherit' }}>
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        backgroundColor: 'var(--bg-primary)',
        padding: '32px 48px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>

      <style>{`
        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.03) !important;
          color: var(--text-primary) !important;
        }
      `}</style>
    </div>
  );
}
