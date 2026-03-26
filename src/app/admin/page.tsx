'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Trophy, Heart, CreditCard, TrendingUp, DollarSign } from 'lucide-react';

export default function AdminOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscribers: 0,
    totalCharities: 0,
    totalDraws: 0,
    totalPrizePool: 0,
    totalContributions: 0,
  });
  const [recentUsers, setRecentUsers] = useState<{ id: string; email: string; full_name: string; role: string; created_at: string }[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [usersRes, subsRes, charitiesRes, drawsRes, recentRes] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('charities').select('*', { count: 'exact', head: true }),
      supabase.from('draws').select('prize_pool'),
      supabase.from('profiles').select('id, email, full_name, role, created_at').order('created_at', { ascending: false }).limit(5),
    ]);

    const totalPool = drawsRes.data?.reduce((sum, d) => sum + Number(d.prize_pool), 0) || 0;

    setStats({
      totalUsers: usersRes.count || 0,
      activeSubscribers: subsRes.count || 0,
      totalCharities: charitiesRes.count || 0,
      totalDraws: drawsRes.data?.length || 0,
      totalPrizePool: totalPool,
      totalContributions: 0,
    });

    if (recentRes.data) setRecentUsers(recentRes.data);
  };

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: <Users size={20} />, color: '#60a5fa' },
    { label: 'Active Subscribers', value: stats.activeSubscribers, icon: <CreditCard size={20} />, color: '#34d399' },
    { label: 'Total Prize Pool', value: `₹${stats.totalPrizePool.toLocaleString('en-IN')}`, icon: <Trophy size={20} />, color: '#fbbf24' },
    { label: 'Charities', value: stats.totalCharities, icon: <Heart size={20} />, color: '#ec4899' },
    { label: 'Total Draws', value: stats.totalDraws, icon: <TrendingUp size={20} />, color: '#a78bfa' },
    { label: 'Revenue', value: `₹${(stats.activeSubscribers * 799).toFixed(0)}`, icon: <DollarSign size={20} />, color: '#f97316' },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '700', color: '#f1f5f9' }}>
          Admin Overview
        </h1>
        <p style={{ color: '#64748b', marginTop: '4px' }}>Platform analytics and management</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {statCards.map((stat, i) => (
          <div key={i} className="glass-card stat-glow" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
              <div style={{ color: stat.color, opacity: 0.5 }}>{stat.icon}</div>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: '700', color: '#f1f5f9' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Users */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(30, 41, 59, 0.5)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: '600', color: '#f1f5f9' }}>
            Recent Users
          </h2>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {recentUsers.map(u => (
              <tr key={u.id}>
                <td style={{ color: '#f1f5f9', fontWeight: '500' }}>{u.full_name || '—'}</td>
                <td style={{ color: '#94a3b8' }}>{u.email}</td>
                <td>
                  <span className={`badge ${u.role === 'admin' ? 'badge-warning' : u.role === 'subscriber' ? 'badge-success' : 'badge-info'}`}>
                    {u.role}
                  </span>
                </td>
                <td style={{ color: '#64748b', fontSize: '0.85rem' }}>
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {recentUsers.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: '#64748b', padding: '24px' }}>No users yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
