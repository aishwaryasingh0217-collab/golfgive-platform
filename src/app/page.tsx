'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  Trophy, Heart, TrendingUp, ArrowRight, Star,
  CheckCircle, Zap, Users, Target, Gift, Shield,
  ChevronRight, Sparkles
} from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-hero" style={{ paddingTop: '120px', paddingBottom: '100px', position: 'relative', overflow: 'hidden' }}>
          {/* Floating decorations */}
          <div className="animate-float" style={{
            position: 'absolute', top: '15%', right: '10%', width: '200px', height: '200px',
            borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
          }} />
          <div className="animate-float" style={{
            position: 'absolute', bottom: '20%', left: '5%', width: '150px', height: '150px',
            borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%)',
            animationDelay: '2s',
          }} />

          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative' }}>
            <div className="animate-fade-in-up" style={{ marginBottom: '24px' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(52, 211, 153, 0.2)',
                borderRadius: '50px', padding: '8px 20px', fontSize: '0.85rem',
                color: '#34d399', fontWeight: '500',
              }}>
                <Sparkles size={14} /> Now accepting subscribers
              </span>
            </div>

            <h1 className="animate-fade-in-up" style={{
              fontFamily: 'var(--font-heading)', fontWeight: '800',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: '1.1',
              marginBottom: '24px', maxWidth: '800px', margin: '0 auto 24px',
            }}>
              <span className="gradient-text-white">Play Golf.</span>{' '}
              <span className="gradient-text">Win Prizes.</span>{' '}
              <span className="gradient-text-white">Give Back.</span>
            </h1>

            <p className="animate-fade-in-up" style={{
              color: '#94a3b8', fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.7',
            }}>
              Track your golf scores, enter monthly prize draws, and support
              charities that matter — all in one beautiful platform.
            </p>

            <div className="animate-fade-in-up" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href={user ? '/dashboard' : '/auth?mode=signup'} className="btn-gold">
                {user ? 'Go to Dashboard' : 'Start Your Journey'} <ArrowRight size={18} />
              </Link>
              <Link href="#how-it-works" className="btn-secondary">
                See How It Works
              </Link>
            </div>

            {/* Stats bar */}
            <div className="animate-fade-in-up" style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '1px', marginTop: '80px',
              background: 'rgba(52, 211, 153, 0.05)', borderRadius: '16px',
              border: '1px solid rgba(52, 211, 153, 0.08)', overflow: 'hidden',
            }}>
              {[
                { value: '₹8L+', label: 'Prize Pool', icon: <Trophy size={18} /> },
                { value: '500+', label: 'Subscribers', icon: <Users size={18} /> },
                { value: '₹20L', label: 'For Charity', icon: <Heart size={18} /> },
                { value: '95%', label: 'Happy Players', icon: <Star size={18} /> },
              ].map((stat, i) => (
                <div key={i} style={{
                  padding: '24px', textAlign: 'center',
                  background: 'rgba(15, 23, 42, 0.5)',
                }}>
                  <div style={{ color: '#34d399', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: '700', color: '#f1f5f9' }}>{stat.value}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="bg-gradient-section" style={{ padding: '100px 24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                color: '#34d399', fontSize: '0.85rem', fontWeight: '600',
                textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px',
              }}>
                <Zap size={14} /> Simple Process
              </span>
              <h2 style={{
                fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: '700', color: '#f1f5f9', marginTop: '8px',
              }}>
                How It Works
              </h2>
              <p style={{ color: '#64748b', maxWidth: '500px', margin: '16px auto 0', lineHeight: '1.6' }}>
                Three simple steps to play, win, and make a difference
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {[
                {
                  step: '01',
                  icon: <Target size={28} />,
                  title: 'Subscribe & Play',
                  desc: 'Choose a monthly or yearly plan. Enter your latest Stableford golf scores and track your performance over time.',
                  color: '#10b981',
                },
                {
                  step: '02',
                  icon: <Gift size={28} />,
                  title: 'Enter Monthly Draws',
                  desc: 'Automatically enter prize draws each month. Match numbers to win from a pool funded by subscriber contributions.',
                  color: '#fbbf24',
                },
                {
                  step: '03',
                  icon: <Heart size={28} />,
                  title: 'Support Charity',
                  desc: 'A portion of your subscription goes directly to your chosen charity. Track your impact and see real results.',
                  color: '#ec4899',
                },
              ].map((item, i) => (
                <div key={i} className="glass-card stat-glow" style={{
                  padding: '36px', transition: 'all 0.3s ease',
                  cursor: 'default',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <div style={{
                      width: '52px', height: '52px', borderRadius: '14px',
                      background: `${item.color}15`, color: item.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {item.icon}
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-heading)', fontSize: '2.5rem',
                      fontWeight: '800', color: 'rgba(52, 211, 153, 0.08)',
                    }}>{item.step}</span>
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)', fontSize: '1.25rem',
                    fontWeight: '700', color: '#f1f5f9', marginBottom: '12px',
                  }}>{item.title}</h3>
                  <p style={{ color: '#94a3b8', lineHeight: '1.7', fontSize: '0.9rem' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Prize Pool Section */}
        <section style={{ padding: '100px 24px', background: 'var(--color-dark-950)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                color: '#fbbf24', fontSize: '0.85rem', fontWeight: '600',
                textTransform: 'uppercase', letterSpacing: '0.1em',
              }}>
                <Trophy size={14} /> Win Big
              </span>
              <h2 style={{
                fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: '700', color: '#f1f5f9', marginTop: '12px',
              }}>
                Monthly Prize Draws
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {[
                { match: '5-Number Match', prize: '40%', jackpot: true, gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)' },
                { match: '4-Number Match', prize: '35%', jackpot: false, gradient: 'linear-gradient(135deg, #34d399, #10b981)' },
                { match: '3-Number Match', prize: '25%', jackpot: false, gradient: 'linear-gradient(135deg, #60a5fa, #3b82f6)' },
              ].map((tier, i) => (
                <div key={i} className="glass-card" style={{
                  padding: '36px', textAlign: 'center',
                  position: 'relative', overflow: 'hidden',
                }}>
                  {tier.jackpot && (
                    <div style={{
                      position: 'absolute', top: '16px', right: '-28px',
                      background: tier.gradient, color: '#020617',
                      padding: '4px 40px', fontSize: '0.7rem', fontWeight: '700',
                      transform: 'rotate(45deg)', textTransform: 'uppercase',
                    }}>Jackpot</div>
                  )}
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '16px',
                    background: tier.gradient, margin: '0 auto 20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', fontWeight: '800', color: '#020617',
                  }}>
                    {5 - i}★
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)', fontSize: '1.2rem',
                    fontWeight: '700', color: '#f1f5f9', marginBottom: '8px',
                  }}>{tier.match}</h3>
                  <div style={{
                    fontFamily: 'var(--font-heading)', fontSize: '2.5rem',
                    fontWeight: '800', background: tier.gradient,
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    marginBottom: '8px',
                  }}>{tier.prize}</div>
                  <p style={{ color: '#64748b', fontSize: '0.85rem' }}>of the total prize pool</p>
                  {tier.jackpot && (
                    <p style={{ color: '#fbbf24', fontSize: '0.8rem', marginTop: '12px', fontWeight: '500' }}>
                      Rolls over if unclaimed!
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="bg-gradient-section" style={{ padding: '100px 24px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                color: '#34d399', fontSize: '0.85rem', fontWeight: '600',
                textTransform: 'uppercase', letterSpacing: '0.1em',
              }}>
                <Shield size={14} /> Simple Pricing
              </span>
              <h2 style={{
                fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: '700', color: '#f1f5f9', marginTop: '12px',
              }}>
                Choose Your Plan
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {/* Monthly */}
              <div className="glass-card" style={{ padding: '40px', position: 'relative' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' }}>Monthly</h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '24px' }}>Full access, cancel anytime</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '32px' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', fontWeight: '800', color: '#f1f5f9' }}>₹799</span>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>/month</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px' }}>
                  {['Enter & track golf scores', 'Monthly prize draw entry', 'Support your chosen charity', 'Full dashboard access', 'Winner verification'].map((f, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', color: '#cbd5e1', fontSize: '0.9rem' }}>
                      <CheckCircle size={16} style={{ color: '#34d399', flexShrink: 0 }} /> {f}
                    </li>
                  ))}
                </ul>
                <Link href={user ? '/dashboard/subscription' : '/auth?mode=signup'} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Get Started <ArrowRight size={16} />
                </Link>
              </div>

              {/* Yearly */}
              <div className="glass-card animate-pulse-glow" style={{
                padding: '40px', position: 'relative',
                border: '1px solid rgba(245, 158, 11, 0.3)',
              }}>
                <div style={{
                  position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  color: '#020617', padding: '4px 20px', borderRadius: '20px',
                  fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase',
                }}>Save 17%</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' }}>Yearly</h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '24px' }}>Best value — 2 months free</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', fontWeight: '800', color: '#f1f5f9' }}>₹7,999</span>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>/year</span>
                </div>
                <p style={{ color: '#fbbf24', fontSize: '0.8rem', marginBottom: '24px' }}>That&apos;s just ₹666/month</p>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px' }}>
                  {['Everything in Monthly', '2 months free', 'Priority support', 'Early draw notifications', 'Annual charity impact report'].map((f, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', color: '#cbd5e1', fontSize: '0.9rem' }}>
                      <CheckCircle size={16} style={{ color: '#fbbf24', flexShrink: 0 }} /> {f}
                    </li>
                  ))}
                </ul>
                <Link href={user ? '/dashboard/subscription' : '/auth?mode=signup'} className="btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
                  Get Started <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{
          padding: '100px 24px', textAlign: 'center',
          background: 'linear-gradient(180deg, var(--color-dark-950), rgba(16, 185, 129, 0.03))',
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              fontWeight: '800', marginBottom: '20px',
            }}>
              <span className="gradient-text">Ready to Tee Off?</span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '36px' }}>
              Join hundreds of golfers who play, win, and give back every month.
              Your game. Your charity. Your impact.
            </p>
            <Link href={user ? '/dashboard' : '/auth?mode=signup'} className="btn-gold" style={{ fontSize: '1.1rem', padding: '16px 40px' }}>
              {user ? 'Go to Dashboard' : 'Join GolfGive Today'} <ChevronRight size={20} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
