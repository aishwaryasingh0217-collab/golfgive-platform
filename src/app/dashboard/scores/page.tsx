'use client';

import { useAuth } from '@/lib/auth-context';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Score } from '@/lib/types';
import { Target, Plus, Trash2, Calendar, TrendingUp, Info } from 'lucide-react';

export default function ScoresPage() {
  const { user } = useAuth();
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newScore, setNewScore] = useState('');
  const [playedDate, setPlayedDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) fetchScores();
  }, [user]);

  const fetchScores = async () => {
    const { data } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', user!.id)
      .order('played_date', { ascending: false });
    if (data) setScores(data as Score[]);
    setLoading(false);
  };

  const addScore = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const scoreVal = parseInt(newScore);

    if (scoreVal < 1 || scoreVal > 45) {
      setError('Score must be between 1 and 45 (Stableford format)');
      return;
    }

    setSubmitting(true);

    // If already 5 scores, delete the oldest
    if (scores.length >= 5) {
      const oldest = scores[scores.length - 1];
      await supabase.from('scores').delete().eq('id', oldest.id);
    }

    const { error: insertError } = await supabase.from('scores').insert({
      user_id: user!.id,
      score: scoreVal,
      played_date: playedDate,
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      setNewScore('');
      setPlayedDate(new Date().toISOString().split('T')[0]);
      setShowForm(false);
      fetchScores();
    }
    setSubmitting(false);
  };

  const deleteScore = async (id: string) => {
    await supabase.from('scores').delete().eq('id', id);
    fetchScores();
  };

  const avgScore = scores.length > 0
    ? (scores.reduce((a, b) => a + b.score, 0) / scores.length).toFixed(1)
    : '—';

  const highestScore = scores.length > 0 ? Math.max(...scores.map(s => s.score)) : 0;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '700', color: '#f1f5f9' }}>
            My Scores
          </h1>
          <p style={{ color: '#64748b', marginTop: '4px' }}>Track your latest 5 golf scores (Stableford format)</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          <Plus size={16} /> Add Score
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '4px' }}>Average Score</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: '700', color: '#34d399' }}>{avgScore}</div>
        </div>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '4px' }}>Highest Score</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: '700', color: '#fbbf24' }}>{highestScore || '—'}</div>
        </div>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '4px' }}>Scores Recorded</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: '700', color: '#60a5fa' }}>{scores.length}/5</div>
        </div>
      </div>

      {/* Info box */}
      <div className="glass-card-light" style={{ padding: '16px', marginBottom: '24px', display: 'flex', gap: '10px' }}>
        <Info size={18} style={{ color: '#34d399', flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.6' }}>
          Only the <strong style={{ color: '#f1f5f9' }}>latest 5 scores</strong> are retained. New scores automatically replace the oldest.
          Scores must be in <strong style={{ color: '#f1f5f9' }}>Stableford format (1-45)</strong> and include a date.
        </div>
      </div>

      {/* Add Score Form */}
      {showForm && (
        <div className="glass-card animate-fade-in" style={{ padding: '28px', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: '600', color: '#f1f5f9', marginBottom: '20px' }}>
            Add New Score
          </h3>
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '10px', padding: '12px', marginBottom: '16px',
              color: '#f87171', fontSize: '0.85rem',
            }}>{error}</div>
          )}
          <form onSubmit={addScore} className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <div className="flex-1">
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', fontWeight: '500', marginBottom: '6px' }}>
                Score (1-45)
              </label>
              <input
                id="score-input"
                type="number"
                className="input-field"
                min="1"
                max="45"
                value={newScore}
                onChange={e => setNewScore(e.target.value)}
                placeholder="e.g. 32"
                required
              />
            </div>
            <div className="flex-1">
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', fontWeight: '500', marginBottom: '6px' }}>
                Date Played
              </label>
              <input
                id="date-input"
                type="date"
                className="input-field"
                value={playedDate}
                onChange={e => setPlayedDate(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full sm:w-auto" disabled={submitting} style={{ height: '46px', display: 'flex', justifyContent: 'center' }}>
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </form>
          {scores.length >= 5 && (
            <p style={{ color: '#fbbf24', fontSize: '0.8rem', marginTop: '12px' }}>
              ⚠ You have 5 scores. Adding a new one will replace the oldest score.
            </p>
          )}
        </div>
      )}

      {/* Scores List */}
      {loading ? (
        <div style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>Loading scores...</div>
      ) : scores.length === 0 ? (
        <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
          <Target size={32} style={{ color: '#34d399', margin: '0 auto 12px' }} />
          <h3 style={{ fontFamily: 'var(--font-heading)', color: '#f1f5f9', marginBottom: '8px' }}>No Scores Yet</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Add your first golf score to start tracking your performance</p>
        </div>
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Score</th>
                <th>Date Played</th>
                <th>Added</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, i) => (
                <tr key={score.id}>
                  <td style={{ color: '#475569' }}>{i + 1}</td>
                  <td>
                    <span style={{
                      fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '1.15rem',
                      color: score.score >= 36 ? '#34d399' : score.score >= 28 ? '#fbbf24' : '#f87171',
                    }}>
                      {score.score}
                    </span>
                  </td>
                  <td style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} style={{ color: '#475569' }} />
                    {new Date(score.played_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ color: '#64748b', fontSize: '0.85rem' }}>
                    {new Date(score.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => deleteScore(score.id)} className="btn-danger btn-small" style={{ gap: '4px' }}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
