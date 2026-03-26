'use client';

import { useAuth } from '@/lib/auth-context';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Trophy, Target, Heart, CreditCard, TrendingUp, Calendar, Star } from 'lucide-react';
import Link from 'next/link';

export default function DashboardHome() {
  const { user } = useAuth();
  const [scores, setScores] = useState<number[]>([]);
  const [subscription, setSubscription] = useState<{ status: string; plan_type: string; current_period_end: string } | null>(null);
  const [drawCount, setDrawCount] = useState(0);
  const [winnings, setWinnings] = useState(0);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    // Fetch scores
    const { data: scoreData } = await supabase
      .from('scores')
      .select('score')
      .eq('user_id', user!.id)
      .order('played_date', { ascending: false })
      .limit(5);
    if (scoreData) setScores(scoreData.map(s => s.score));

    // Fetch subscription
    const { data: subData } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user!.id)
      .eq('status', 'active')
      .single();
    if (subData) setSubscription(subData);

    // Fetch draw entries count
    const { count } = await supabase
      .from('draw_entries')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user!.id);
    setDrawCount(count || 0);

    // Fetch winnings
    const { data: winData } = await supabase
      .from('draw_results')
      .select('prize_amount')
      .eq('user_id', user!.id);
    if (winData) setWinnings(winData.reduce((sum, w) => sum + Number(w.prize_amount), 0));
  };

  const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : '—';

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '700', color: '#f1f5f9' }}>
          Welcome back, {user?.full_name || 'Player'} 👋
        </h1>
        <p style={{ color: '#64748b', marginTop: '4px' }}>Here&apos;s your overview for today</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          {
            label: 'Subscription',
            value: subscription ? subscription.plan_type.charAt(0).toUpperCase() + subscription.plan_type.slice(1) : 'Inactive',
            icon: <CreditCard size={20} />,
            color: subscription ? '#34d399' : '#f87171',
            sub: subscription ? `Active until ${new Date(subscription.current_period_end).toLocaleDateString()}` : 'No active plan',
          },
          {
            label: 'Avg Score',
            value: avgScore,
            icon: <Target size={20} />,
            color: '#fbbf24',
            sub: `${scores.length} scores recorded`,
          },
          {
            label: 'Draws Entered',
            value: drawCount.toString(),
            icon: <Trophy size={20} />,
            color: '#60a5fa',
            sub: 'Monthly draws',
          },
          {
            label: 'Total Winnings',
            value: `₹${winnings.toLocaleString('en-IN')}`,
            icon: <Star size={20} />,
            color: '#ec4899',
            sub: 'All time',
          },
        ].map((stat, i) => (
          <div key={i} className="glass-card stat-glow" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
              <div style={{ color: stat.color, opacity: 0.6 }}>{stat.icon}</div>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '700', color: '#f1f5f9' }}>{stat.value}</div>
            <div style={{ color: '#475569', fontSize: '0.8rem', marginTop: '4px' }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '16px' }}>
        Quick Actions
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        {[
          { href: '/dashboard/scores', label: 'Enter Score', icon: <Target size={20} />, desc: 'Log your latest round' },
          { href: '/dashboard/draws', label: 'View Draws', icon: <Trophy size={20} />, desc: 'Check results & entries' },
          { href: '/dashboard/charity', label: 'My Charity', icon: <Heart size={20} />, desc: 'View your impact' },
          { href: '/dashboard/subscription', label: 'Manage Plan', icon: <CreditCard size={20} />, desc: 'Subscription settings' },
        ].map((action, i) => (
          <Link key={i} href={action.href} className="glass-card-light" style={{
            padding: '20px', textDecoration: 'none',
            transition: 'all 0.2s ease', cursor: 'pointer',
            display: 'block',
          }}>
            <div style={{ color: '#34d399', marginBottom: '8px' }}>{action.icon}</div>
            <div style={{ fontWeight: '600', color: '#f1f5f9', fontSize: '0.95rem' }}>{action.label}</div>
            <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '2px' }}>{action.desc}</div>
          </Link>
        ))}
      </div>

      {/* Charity info */}
      {user?.selected_charity_id && (
        <div className="glass-card" style={{ marginTop: '32px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Heart size={16} style={{ color: '#ec4899' }} />
            <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500' }}>Your Charity Contribution</span>
          </div>
          <p style={{ color: '#f1f5f9', fontSize: '0.95rem' }}>
            {user.contribution_percentage}% of your subscription goes to your selected charity
          </p>
        </div>
      )}
    </div>
  );
}
