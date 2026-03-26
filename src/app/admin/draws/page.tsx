'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Draw } from '@/lib/types';
import { Trophy, Plus, Play, Eye, Trash2, RefreshCw } from 'lucide-react';

export default function AdminDrawsPage() {
  const [draws, setDraws] = useState<Draw[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newMonth, setNewMonth] = useState('');
  const [newYear, setNewYear] = useState(new Date().getFullYear());
  const [newPrizePool, setNewPrizePool] = useState('1000');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchDraws();
  }, []);

  const fetchDraws = async () => {
    const { data } = await supabase.from('draws').select('*').order('created_at', { ascending: false });
    if (data) setDraws(data as Draw[]);
    setLoading(false);
  };

  const createDraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    const pool = parseFloat(newPrizePool);
    await supabase.from('draws').insert({
      month: newMonth,
      year: newYear,
      status: 'active',
      prize_pool: pool,
      five_match_prize: pool * 0.4,
      four_match_prize: pool * 0.35,
      three_match_prize: pool * 0.25,
    });
    setShowCreate(false);
    setNewMonth('');
    setNewPrizePool('1000');
    fetchDraws();
    setCreating(false);
  };

  const runDraw = async (drawId: string) => {
    // Generate 5 random winning numbers
    const numbers: number[] = [];
    while (numbers.length < 5) {
      const n = Math.floor(Math.random() * 45) + 1;
      if (!numbers.includes(n)) numbers.push(n);
    }
    numbers.sort((a, b) => a - b);

    // Update draw with winning numbers
    await supabase.from('draws').update({
      draw_numbers: numbers,
      status: 'completed',
      drawn_at: new Date().toISOString(),
    }).eq('id', drawId);

    // Check all entries for matches
    const { data: entries } = await supabase.from('draw_entries').select('*').eq('draw_id', drawId);
    const draw = draws.find(d => d.id === drawId);

    if (entries && draw) {
      for (const entry of entries) {
        const matched = entry.entry_numbers.filter((n: number) => numbers.includes(n));
        let matchType: string | null = null;
        let prize = 0;

        if (matched.length >= 5) {
          matchType = '5-match';
          prize = Number(draw.five_match_prize);
        } else if (matched.length >= 4) {
          matchType = '4-match';
          prize = Number(draw.four_match_prize);
        } else if (matched.length >= 3) {
          matchType = '3-match';
          prize = Number(draw.three_match_prize);
        }

        if (matchType) {
          await supabase.from('draw_results').insert({
            draw_id: drawId,
            user_id: entry.user_id,
            match_type: matchType,
            matched_numbers: matched,
            prize_amount: prize,
          });
        }
      }
    }

    fetchDraws();
  };

  const publishDraw = async (drawId: string) => {
    await supabase.from('draws').update({ status: 'published' }).eq('id', drawId);
    fetchDraws();
  };

  const deleteDraw = async (drawId: string) => {
    await supabase.from('draws').delete().eq('id', drawId);
    fetchDraws();
  };

  const statusColors: Record<string, string> = {
    upcoming: '#60a5fa',
    active: '#34d399',
    completed: '#fbbf24',
    published: '#ec4899',
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '700', color: '#f1f5f9' }}>Draw Management</h1>
          <p style={{ color: '#64748b', marginTop: '4px' }}>Create, run, and publish monthly prize draws</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-gold"><Plus size={16} /> New Draw</button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="glass-card animate-fade-in" style={{ padding: '28px', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: '600', color: '#f1f5f9', marginBottom: '20px' }}>Create New Draw</h3>
          <form onSubmit={createDraw} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', fontWeight: '500', marginBottom: '6px' }}>Month</label>
              <select className="select-field" value={newMonth} onChange={e => setNewMonth(e.target.value)} required>
                <option value="">Select...</option>
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', fontWeight: '500', marginBottom: '6px' }}>Year</label>
              <input type="number" className="input-field" value={newYear} onChange={e => setNewYear(parseInt(e.target.value))} required />
            </div>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', fontWeight: '500', marginBottom: '6px' }}>Prize Pool (₹)</label>
              <input type="number" className="input-field" value={newPrizePool} onChange={e => setNewPrizePool(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary" disabled={creating} style={{ height: '46px' }}>
              {creating ? 'Creating...' : 'Create'}
            </button>
          </form>
        </div>
      )}

      {/* Draws List */}
      {loading ? (
        <div style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>Loading...</div>
      ) : draws.length === 0 ? (
        <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
          <Trophy size={32} style={{ color: '#fbbf24', margin: '0 auto 12px' }} />
          <h3 style={{ fontFamily: 'var(--font-heading)', color: '#f1f5f9', marginBottom: '8px' }}>No Draws Yet</h3>
          <p style={{ color: '#64748b' }}>Create your first monthly draw above</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {draws.map(draw => (
            <div key={draw.id} className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: '700', color: '#f1f5f9' }}>
                      {draw.month} {draw.year}
                    </h3>
                    <span className="badge" style={{ background: `${statusColors[draw.status]}20`, color: statusColors[draw.status] }}>
                      {draw.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', color: '#94a3b8', fontSize: '0.85rem' }}>
                    <span>Pool: <strong style={{ color: '#fbbf24' }}>₹{Number(draw.prize_pool).toLocaleString('en-IN')}</strong></span>
                    <span>5-match: ₹{Number(draw.five_match_prize).toLocaleString('en-IN')}</span>
                    <span>4-match: ₹{Number(draw.four_match_prize).toLocaleString('en-IN')}</span>
                    <span>3-match: ₹{Number(draw.three_match_prize).toLocaleString('en-IN')}</span>
                  </div>
                  {draw.draw_numbers.length > 0 && (
                    <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                      {draw.draw_numbers.map((n, i) => (
                        <span key={i} style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#020617',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: '700', fontSize: '0.85rem',
                        }}>{n}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {draw.status === 'active' && (
                    <button onClick={() => runDraw(draw.id)} className="btn-primary btn-small" style={{ gap: '4px' }}>
                      <Play size={12} /> Run Draw
                    </button>
                  )}
                  {draw.status === 'completed' && (
                    <button onClick={() => publishDraw(draw.id)} className="btn-gold btn-small" style={{ gap: '4px' }}>
                      <Eye size={12} /> Publish
                    </button>
                  )}
                  <button onClick={() => deleteDraw(draw.id)} className="btn-danger btn-small" style={{ gap: '4px' }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
