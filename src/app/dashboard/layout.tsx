'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard, Target, Trophy, CreditCard,
  Heart, LogOut, Shield, Home, Menu, X
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617' }}>
        <div style={{ color: '#64748b' }}>Loading...</div>
      </div>
    );
  }

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { href: '/dashboard/scores', label: 'My Scores', icon: <Target size={18} /> },
    { href: '/dashboard/draws', label: 'Prize Draws', icon: <Trophy size={18} /> },
    { href: '/dashboard/subscription', label: 'Subscription', icon: <CreditCard size={18} /> },
    { href: '/dashboard/charity', label: 'My Charity', icon: <Heart size={18} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#020617' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '260px' : '0',
        background: 'rgba(15, 23, 42, 0.6)',
        borderRight: sidebarOpen ? '1px solid rgba(52, 211, 153, 0.08)' : 'none',
        padding: sidebarOpen ? '24px 16px' : '0',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 40,
        transition: 'all 0.3s ease',
        overflow: 'hidden',
      }} className="hidden md:flex">
        {sidebarOpen && (
          <>
            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '8px', padding: '0 8px' }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981, #fbbf24)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', fontWeight: '800', color: '#020617',
              }}>G</div>
              <span style={{
                fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '1.1rem',
                background: 'linear-gradient(135deg, #34d399, #fbbf24)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>GolfGive</span>
            </Link>

            {/* User card */}
            <div style={{
              background: 'rgba(52, 211, 153, 0.05)',
              borderRadius: '12px', padding: '14px', margin: '16px 0 24px',
              border: '1px solid rgba(52, 211, 153, 0.08)',
            }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#f1f5f9' }}>{user.full_name || 'User'}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{user.email}</div>
              <div style={{ marginTop: '6px' }}>
                <span className={`badge ${user.role === 'admin' ? 'badge-warning' : user.role === 'subscriber' ? 'badge-success' : 'badge-info'}`}>
                  {user.role}
                </span>
              </div>
            </div>

            {/* Nav links */}
            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
                >
                  {item.icon} {item.label}
                </Link>
              ))}

              {user.role === 'admin' && (
                <>
                  <div style={{ height: '1px', background: 'rgba(30, 41, 59, 0.5)', margin: '12px 0' }} />
                  <Link href="/admin" className="sidebar-link" style={{ color: '#fbbf24' }}>
                    <Shield size={18} /> Admin Panel
                  </Link>
                </>
              )}
            </nav>

            {/* Bottom actions */}
            <div style={{ borderTop: '1px solid rgba(30, 41, 59, 0.5)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Link href="/" className="sidebar-link"><Home size={18} /> Back to Home</Link>
              <button onClick={signOut} className="sidebar-link" style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </>
        )}
      </aside>

      {/* Toggle Button for Desktop */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="hidden md:flex"
        style={{
          position: 'fixed',
          top: '20px',
          left: sidebarOpen ? '270px' : '10px',
          zIndex: 50,
          background: 'rgba(52, 211, 153, 0.1)',
          border: '1px solid rgba(52, 211, 153, 0.2)',
          borderRadius: '8px',
          padding: '8px',
          cursor: 'pointer',
          color: '#34d399',
          transition: 'all 0.3s ease',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile header */}
      <div className="md:hidden" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
        background: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(52, 211, 153, 0.08)',
        padding: '12px 16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #10b981, #fbbf24)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: '800', color: '#020617',
            }}>G</div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '1rem', color: '#e2e8f0' }}>GolfGive</span>
          </Link>
          <button onClick={signOut} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            <LogOut size={18} />
          </button>
        </div>
        <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '4px' }}>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} style={{
              padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '500',
              whiteSpace: 'nowrap', textDecoration: 'none',
              background: pathname === item.href ? 'rgba(52, 211, 153, 0.12)' : 'transparent',
              color: pathname === item.href ? '#34d399' : '#64748b',
              border: pathname === item.href ? '1px solid rgba(52, 211, 153, 0.2)' : '1px solid transparent',
            }}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main style={{
        flex: 1,
        marginLeft: sidebarOpen ? '260px' : '0',
        padding: '100px 24px 40px',
        transition: 'margin-left 0.3s ease',
      }} className="md:pt-[32px]">
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
