'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Shield, Users, Trophy, Heart, Award,
  BarChart3, LogOut, Home, LayoutDashboard, Menu, X
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617' }}>
        <div style={{ color: '#64748b' }}>Checking admin access...</div>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Overview', icon: <BarChart3 size={18} /> },
    { href: '/admin/users', label: 'Users', icon: <Users size={18} /> },
    { href: '/admin/draws', label: 'Draws', icon: <Trophy size={18} /> },
    { href: '/admin/charities', label: 'Charities', icon: <Heart size={18} /> },
    { href: '/admin/winners', label: 'Winners', icon: <Award size={18} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#020617' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '260px' : '0',
        background: 'rgba(15, 23, 42, 0.6)',
        borderRight: sidebarOpen ? '1px solid rgba(245, 158, 11, 0.1)' : 'none',
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
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '8px', padding: '0 8px' }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', fontWeight: '800', color: '#020617',
              }}>A</div>
              <span style={{
                fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '1.1rem',
                color: '#fbbf24',
              }}>Admin Panel</span>
            </Link>

            <div style={{
              background: 'rgba(245, 158, 11, 0.05)',
              borderRadius: '12px', padding: '14px', margin: '16px 0 24px',
              border: '1px solid rgba(245, 158, 11, 0.1)',
            }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#f1f5f9' }}>{user.full_name || 'Admin'}</div>
              <span className="badge badge-warning" style={{ marginTop: '4px' }}>Administrator</span>
            </div>

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
            </nav>

            <div style={{ borderTop: '1px solid rgba(30, 41, 59, 0.5)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Link href="/dashboard" className="sidebar-link"><LayoutDashboard size={18} /> User Dashboard</Link>
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
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          borderRadius: '8px',
          padding: '8px',
          cursor: 'pointer',
          color: '#fbbf24',
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
        borderBottom: '1px solid rgba(245, 158, 11, 0.1)',
        padding: '12px 16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', color: '#fbbf24' }}>Admin Panel</span>
          <button onClick={signOut} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            <LogOut size={18} />
          </button>
        </div>
        <div style={{ display: 'flex', gap: '4px', overflowX: 'auto' }}>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} style={{
              padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '500',
              whiteSpace: 'nowrap', textDecoration: 'none',
              background: pathname === item.href ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
              color: pathname === item.href ? '#fbbf24' : '#64748b',
            }}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <main style={{
        flex: 1,
        marginLeft: sidebarOpen ? '260px' : '0',
        padding: '100px 24px 40px',
        transition: 'margin-left 0.3s ease',
      }} className="md:pt-[32px]">
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>{children}</div>
      </main>
    </div>
  );
}
