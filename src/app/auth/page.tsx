'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Navbar from '@/components/Navbar';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

function AuthForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { signIn, signUp, user, loading } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>(
    searchParams.get('mode') === 'signup' ? 'signup' : 'login'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      if (mode === 'signup') {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          setError(error);
        } else {
          setSuccess('Account created! Check your email to confirm, then sign in.');
          setMode('login');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error);
        } else {
          router.push('/dashboard');
        }
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#64748b' }}>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-gradient-hero" style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '100px 24px 40px',
      }}>
        <div className="glass-card animate-fade-in-up" style={{
          width: '100%', maxWidth: '440px', padding: '40px',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #10b981, #fbbf24)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', fontWeight: '800', color: '#020617',
              margin: '0 auto 16px',
            }}>G</div>
            <h1 style={{
              fontFamily: 'var(--font-heading)', fontSize: '1.8rem',
              fontWeight: '700', color: '#f1f5f9', marginBottom: '8px',
            }}>
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              {mode === 'login'
                ? 'Sign in to access your dashboard'
                : 'Join GolfGive and start your journey'}
            </p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
              color: '#f87171', fontSize: '0.85rem',
            }}>{error}</div>
          )}

          {success && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(52, 211, 153, 0.2)',
              borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
              color: '#34d399', fontSize: '0.85rem',
            }}>{success}</div>
          )}

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <input
                    id="fullname-input"
                    type="text"
                    className="input-field"
                    style={{ paddingLeft: '42px' }}
                    placeholder="John Doe"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input
                  id="email-input"
                  type="email"
                  className="input-field"
                  style={{ paddingLeft: '42px' }}
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  style={{ paddingLeft: '42px', paddingRight: '42px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: '#475569', cursor: 'pointer',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              id="submit-btn"
              type="submit"
              className="btn-primary"
              disabled={submitting}
              style={{
                width: '100%', justifyContent: 'center',
                opacity: submitting ? 0.7 : 1,
                padding: '14px',
              }}
            >
              {submitting ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{
            textAlign: 'center', marginTop: '24px', paddingTop: '24px',
            borderTop: '1px solid rgba(30, 41, 59, 0.5)',
          }}>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess(''); }}
                style={{
                  background: 'none', border: 'none', color: '#34d399',
                  cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem',
                }}
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617' }}>
        <div style={{ color: '#64748b' }}>Loading...</div>
      </div>
    }>
      <AuthForm />
    </Suspense>
  );
}
