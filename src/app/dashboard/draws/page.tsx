'use client';

import { useAuth } from '@/lib/auth-context';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Draw, DrawEntry, DrawResult } from '@/lib/types';
import { Trophy, Calendar, Gift, Star, Clock, CheckCircle } from 'lucide-react';

export default function DrawsPage() {
  const { user } = useAuth();
  const [draws, setDraws] = useState<Draw[]>([]);
  const [entries, setEntries] = useState<DrawEntry[]>([]);
  const [results, setResults] = useState<DrawResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    const [drawsRes, entriesRes, resultsRes] = await Promise.all([
      supabase.from('draws').select('*').order('created_at', { ascending: false }),
      supabase.from('draw_entries').select('*').eq('user_id', user!.id),
      supabase.from('draw_results').select('*').eq('user_id', user!.id),
    ]);

    if (drawsRes.data) setDraws(drawsRes.data as Draw[]);
    if (entriesRes.data) setEntries(entriesRes.data as DrawEntry[]);
    if (resultsRes.data) setResults(resultsRes.data as DrawResult[]);
    setLoading(false);
  };

  const enterDraw = async (drawId: string) => {
    // Generate 5 random numbers between 1-45
    const numbers: number[] = [];
    while (numbers.length < 5) {
      const n = Math.floor(Math.random() * 45) + 1;
      if (!numbers.includes(n)) numbers.push(n);
    }
    numbers.sort((a, b) => a - b);

    const { error } = await supabase.from('draw_entries').insert({
      draw_id: drawId,
      user_id: user!.id,
      entry_numbers: numbers,
    });

    if (!error) fetchData();
  };

  const getEntryForDraw = (drawId: string) => entries.find(e => e.draw_id === drawId);
  const getResultsForDraw = (drawId: string) => results.filter(r => r.draw_id === drawId);

  const statusColors: Record<string, string> = {
    upcoming: '#60a5fa',
    active: '#34d399',
    completed: '#fbbf24',
    published: '#ec4899',
  };

  const totalWinnings = results.reduce((sum, r) => sum + Number(r.prize_amount), 0);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '700', color: '#f1f5f9' }}>
          Prize Draws
        </h1>
        <p style={{ color: '#64748b', marginTop: '4px' }}>Enter monthly draws and win prizes</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '4px' }}>Draws Entered</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: '700', color: '#60a5fa' }}>{entries.length}</div>
        </div>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '4px' }}>Times Won</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: '700', color: '#34d399' }}>{results.length}</div>
        </div>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '4px' }}>Total Winnings</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: '700', color: '#fbbf24' }}>₹{totalWinnings.toLocaleString('en-IN')}</div>
        </div>
      </div>

      {loading ? (
        <div style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>Loading draws...</div>
      ) : draws.length === 0 ? (
        <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
          <Trophy size={32} style={{ color: '#fbbf24', margin: '0 auto 12px' }} />
          <h3 style={{ fontFamily: 'var(--font-heading)', color: '#f1f5f9', marginBottom: '8px' }}>No Draws Available</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Check back soon! Monthly draws are created by our admin team.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {draws.map(draw => {
            const entry = getEntryForDraw(draw.id);
            const drawResults = getResultsForDraw(draw.id);

            return (
              <div key={draw.id} className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: '700', color: '#f1f5f9' }}>
                        {draw.month} {draw.year} Draw
                      </h3>
                      <span className="badge" style={{
                        background: `${statusColors[draw.status]}20`,
                        color: statusColors[draw.status],
                      }}>
                        {draw.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      <span style={{ color: '#64748b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Gift size={14} /> Prize Pool: <strong style={{ color: '#fbbf24' }}>₹{Number(draw.prize_pool).toLocaleString('en-IN')}</strong>
                      </span>
                      {draw.jackpot_rollover > 0 && (
                        <span style={{ color: '#64748b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Star size={14} /> Jackpot Rollover: <strong style={{ color: '#ec4899' }}>₹{Number(draw.jackpot_rollover).toLocaleString('en-IN')}</strong>
                        </span>
                      )}
                    </div>

                    {/* Draw Numbers */}
                    {draw.status === 'published' && draw.draw_numbers.length > 0 && (
                      <div style={{ marginBottom: '12px' }}>
                        <span style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '6px', display: 'block' }}>Winning Numbers:</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {draw.draw_numbers.map((n, i) => (
                            <span key={i} style={{
                              width: '40px', height: '40px', borderRadius: '50%',
                              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                              color: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontWeight: '700', fontSize: '0.9rem',
                            }}>{n}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Your entry */}
                    {entry && (
                      <div style={{ marginTop: '8px' }}>
                        <span style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '6px', display: 'block' }}>Your Numbers:</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {entry.entry_numbers.map((n, i) => {
                            const isMatch = draw.draw_numbers.includes(n);
                            return (
                              <span key={i} style={{
                                width: '40px', height: '40px', borderRadius: '50%',
                                background: isMatch ? 'rgba(52, 211, 153, 0.2)' : 'rgba(30, 41, 59, 0.6)',
                                border: isMatch ? '2px solid #34d399' : '1px solid rgba(52, 211, 153, 0.1)',
                                color: isMatch ? '#34d399' : '#94a3b8',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: '600', fontSize: '0.9rem',
                              }}>{n}</span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Results */}
                    {drawResults.length > 0 && (
                      <div style={{ marginTop: '12px' }}>
                        {drawResults.map(r => (
                          <div key={r.id} style={{
                            background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.2)',
                            borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px',
                          }}>
                            <Trophy size={16} style={{ color: '#fbbf24' }} />
                            <span style={{ color: '#34d399', fontWeight: '600' }}>
                              🎉 {r.match_type} Winner! Prize: ₹{Number(r.prize_amount).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Enter button */}
                  <div>
                    {draw.status === 'active' && !entry && (
                      <button onClick={() => enterDraw(draw.id)} className="btn-gold btn-small">
                        Enter Draw
                      </button>
                    )}
                    {entry && draw.status !== 'published' && (
                      <span className="badge badge-success"><CheckCircle size={12} /> Entered</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
