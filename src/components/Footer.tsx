import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: 'rgba(2, 6, 23, 0.95)',
      borderTop: '1px solid rgba(52, 211, 153, 0.08)',
      padding: '48px 24px 24px',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #10b981, #fbbf24)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', fontWeight: '800', color: '#020617',
              }}>G</div>
              <span style={{
                fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '1.1rem',
                color: '#e2e8f0',
              }}>GolfGive</span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.6' }}>
              Play golf. Win prizes. Give back to charities that matter.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', color: '#e2e8f0', marginBottom: '16px', fontSize: '0.95rem' }}>Platform</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <FooterLink href="/#how-it-works">How It Works</FooterLink>
              <FooterLink href="/#pricing">Pricing</FooterLink>
              <FooterLink href="/charities">Charities</FooterLink>
            </div>
          </div>

          {/* Account */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', color: '#e2e8f0', marginBottom: '16px', fontSize: '0.95rem' }}>Account</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <FooterLink href="/auth">Sign In</FooterLink>
              <FooterLink href="/auth?mode=signup">Create Account</FooterLink>
              <FooterLink href="/dashboard">Dashboard</FooterLink>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', color: '#e2e8f0', marginBottom: '16px', fontSize: '0.95rem' }}>Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
              <FooterLink href="#">Cookie Policy</FooterLink>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(30, 41, 59, 0.5)',
          paddingTop: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
        }}>
          <p style={{ color: '#475569', fontSize: '0.8rem' }}>
            © 2026 GolfGive. All rights reserved.
          </p>
          <p style={{ color: '#475569', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Made with <Heart size={12} style={{ color: '#ef4444' }} /> for charity
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} style={{
      color: '#64748b', textDecoration: 'none', fontSize: '0.85rem',
      transition: 'color 0.2s ease',
    }}>
      {children}
    </Link>
  );
}
