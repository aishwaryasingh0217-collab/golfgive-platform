'use client';

import { useAuth } from '@/lib/auth-context';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CreditCard, Check, ArrowRight, Shield, Zap } from 'lucide-react';

export default function SubscriptionPage() {
  const { user, refreshProfile } = useAuth();
  const [subscription, setSubscription] = useState<{
    id: string; plan_type: string; status: string;
    current_period_start: string; current_period_end: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    if (user) fetchSubscription();
  }, [user]);

  const fetchSubscription = async () => {
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    if (data) setSubscription(data);
    setLoading(false);
  };

  const handleSubscribe = async (planType: 'monthly' | 'yearly') => {
    setSubscribing(true);

    try {
      // Call your API to create Stripe checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planType,
          userId: user!.id,
          email: user!.email,
        }),
      });

      const { url, error } = await response.json();

      if (error) {
        alert('Error creating checkout session: ' + error);
        setSubscribing(false);
        return;
      }

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to start checkout. Please try again.');
      setSubscribing(false);
    }
  };

  const handleCancel = async () => {
    if (!subscription) return;
    await supabase.from('subscriptions').update({ status: 'cancelled' }).eq('id', subscription.id);
    await supabase.from('profiles').update({ role: 'visitor' }).eq('id', user!.id);
    await refreshProfile();
    fetchSubscription();
  };

  const isActive = subscription?.status === 'active';

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '700', color: '#f1f5f9' }}>
          Subscription
        </h1>
        <p style={{ color: '#64748b', marginTop: '4px' }}>Manage your subscription plan</p>
      </div>

      {/* Current Status */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <CreditCard size={20} style={{ color: '#34d399' }} />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: '600', color: '#f1f5f9' }}>
            Current Plan
          </h2>
        </div>

        {loading ? (
          <p style={{ color: '#64748b' }}>Loading...</p>
        ) : isActive ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '6px 16px' }}>Active</span>
              <span style={{
                fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: '700', color: '#f1f5f9',
                textTransform: 'capitalize',
              }}>
                {subscription.plan_type} Plan
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Started</span>
                <div style={{ color: '#cbd5e1' }}>
                  {new Date(subscription.current_period_start).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Renews</span>
                <div style={{ color: '#cbd5e1' }}>
                  {new Date(subscription.current_period_end).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
            <button onClick={handleCancel} className="btn-danger" style={{ fontSize: '0.85rem' }}>
              Cancel Subscription
            </button>
          </div>
        ) : (
          <div>
            <span className="badge badge-danger" style={{ fontSize: '0.85rem', padding: '6px 16px' }}>No Active Plan</span>
            <p style={{ color: '#94a3b8', marginTop: '12px', fontSize: '0.9rem' }}>
              Subscribe to access score tracking, prize draws, and charity support.
            </p>
          </div>
        )}
      </div>

      {/* Plan Selection */}
      {!isActive && (
        <>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '16px' }}>
            Choose a Plan
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* Monthly */}
            <div className="glass-card" style={{ padding: '32px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' }}>
                Monthly Plan
              </h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '20px' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: '800', color: '#f1f5f9' }}>₹799</span>
                <span style={{ color: '#64748b' }}>/month</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '24px' }}>
                {['Full score tracking', 'Monthly draw entry', 'Charity support', 'Dashboard access'].map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', color: '#cbd5e1', fontSize: '0.9rem' }}>
                    <Check size={14} style={{ color: '#34d399' }} /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe('monthly')}
                disabled={subscribing}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {subscribing ? 'Processing...' : 'Subscribe Monthly'} <ArrowRight size={16} />
              </button>
            </div>

            {/* Yearly */}
            <div className="glass-card animate-pulse-glow" style={{
              padding: '32px', border: '1px solid rgba(245, 158, 11, 0.3)',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                color: '#020617', padding: '3px 16px', borderRadius: '20px',
                fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase',
              }}>Best Value</div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' }}>
                Yearly Plan
              </h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: '800', color: '#f1f5f9' }}>₹7,999</span>
                <span style={{ color: '#64748b' }}>/year</span>
              </div>
              <p style={{ color: '#fbbf24', fontSize: '0.8rem', marginBottom: '20px' }}>Save 17% — 2 months free!</p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '24px' }}>
                {['Everything in Monthly', '2 months free', 'Priority support', 'Annual impact report'].map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', color: '#cbd5e1', fontSize: '0.9rem' }}>
                    <Check size={14} style={{ color: '#fbbf24' }} /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe('yearly')}
                disabled={subscribing}
                className="btn-gold"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {subscribing ? 'Processing...' : 'Subscribe Yearly'} <Zap size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
