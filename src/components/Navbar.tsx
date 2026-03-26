'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';
import { Menu, X, Trophy, Heart, UserCircle, LogOut, LayoutDashboard, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: 'rgba(2, 6, 23, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(52, 211, 153, 0.08)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981, #fbbf24)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', fontWeight: '800', color: '#020617',
            }}>G</div>
            <span style={{
              fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '1.25rem',
              background: 'linear-gradient(135deg, #34d399, #fbbf24)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>GolfGive</span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="hidden md:flex">
            <NavLink href="/#how-it-works">How It Works</NavLink>
            <NavLink href="/charities">Charities</NavLink>
            <NavLink href="/#pricing">Pricing</NavLink>
            {user ? (
              <>
                <Link href="/dashboard" className="btn-primary btn-small" style={{ marginLeft: '8px' }}>
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin" className="btn-secondary btn-small">
                    <Shield size={16} /> Admin
                  </Link>
                )}
                <button onClick={signOut} className="btn-secondary btn-small">
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link href="/auth" className="btn-secondary btn-small" style={{ marginLeft: '8px' }}>Sign In</Link>
                <Link href="/auth?mode=signup" className="btn-primary btn-small">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden"
            style={{ background: 'none', border: 'none', color: '#e2e8f0', cursor: 'pointer' }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          background: 'rgba(2, 6, 23, 0.98)',
          borderTop: '1px solid rgba(52, 211, 153, 0.08)',
          padding: '20px 24px',
        }} className="md:hidden animate-fade-in">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link href="/#how-it-works" onClick={() => setMobileOpen(false)} style={mobileLink}>How It Works</Link>
            <Link href="/charities" onClick={() => setMobileOpen(false)} style={mobileLink}>Charities</Link>
            <Link href="/#pricing" onClick={() => setMobileOpen(false)} style={mobileLink}>Pricing</Link>
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="btn-primary" style={{ textAlign: 'center', justifyContent: 'center' }}>Dashboard</Link>
                {user.role === 'admin' && (
                  <Link href="/admin" onClick={() => setMobileOpen(false)} className="btn-secondary" style={{ textAlign: 'center', justifyContent: 'center' }}>Admin Panel</Link>
                )}
                <button onClick={() => { signOut(); setMobileOpen(false); }} className="btn-secondary" style={{ justifyContent: 'center' }}>Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/auth" onClick={() => setMobileOpen(false)} className="btn-secondary" style={{ textAlign: 'center', justifyContent: 'center' }}>Sign In</Link>
                <Link href="/auth?mode=signup" onClick={() => setMobileOpen(false)} className="btn-primary" style={{ textAlign: 'center', justifyContent: 'center' }}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

const mobileLink: React.CSSProperties = {
  color: '#cbd5e1',
  textDecoration: 'none',
  padding: '12px 0',
  fontSize: '1rem',
  fontWeight: '500',
  borderBottom: '1px solid rgba(30, 41, 59, 0.5)',
};

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} style={{
      color: '#94a3b8',
      textDecoration: 'none',
      padding: '8px 14px',
      borderRadius: '8px',
      fontSize: '0.9rem',
      fontWeight: '500',
      transition: 'all 0.2s ease',
    }}
    onMouseEnter={e => { e.currentTarget.style.color = '#34d399'; e.currentTarget.style.background = 'rgba(52, 211, 153, 0.08)'; }}
    onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }}
    >
      {children}
    </Link>
  );
}
