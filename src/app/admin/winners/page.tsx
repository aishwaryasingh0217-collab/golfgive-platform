'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Award, CheckCircle, XCircle, DollarSign, Clock, Upload } from 'lucide-react';

interface WinnerRow {
  id: string;
  draw_result_id: string;
  user_id: string;
  proof_url: string;
  status: string;
  admin_notes: string | null;
  payment_status: string;
  created_at: string;
  reviewed_at: string | null;
  profile?: { full_name: string; email: string };
  result?: { match_type: string; prize_amount: number; draw?: { month: string; year: number } };
}

export default function AdminWinnersPage() {
  const [verifications, setVerifications] = useState<WinnerRow[]>([]);
  const [results, setResults] = useState<{ id: string; user_id: string; match_type: string; prize_amount: number; draw_id: string; draw?: { month: string; year: number }; profile?: { full_name: string; email: string } }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Get all draw results with profile info
    const { data: resultData } = await supabase
      .from('draw_results')
      .select('*, draw:draws(month, year)')
      .order('created_at', { ascending: false });

    if (resultData) {
      // Fetch profiles for each result
      const userIds = [...new Set(resultData.map(r => r.user_id))];
      const { data: profiles } = await supabase.from('profiles').select('id, full_name, email').in('id', userIds);

      const enriched = resultData.map(r => ({
        ...r,
        profile: profiles?.find(p => p.id === r.user_id),
      }));
      setResults(enriched);
    }

    // Get verifications
    const { data: verData } = await supabase.from('winner_verifications').select('*').order('created_at', { ascending: false });
    if (verData) setVerifications(verData as WinnerRow[]);

    setLoading(false);
  };

  const approveVerification = async (id: string) => {
    await supabase.from('winner_verifications').update({
      status: 'approved',
      reviewed_at: new Date().toISOString(),
    }).eq('id', id);
    fetchData();
  };

  const rejectVerification = async (id: string) => {
    await supabase.from('winner_verifications').update({
      status: 'rejected',
      reviewed_at: new Date().toISOString(),
    }).eq('id', id);
    fetchData();
  };

  const markPaid = async (id: string) => {
    await supabase.from('winner_verifications').update({
      payment_status: 'paid',
    }).eq('id', id);
    fetchData();
  };

  const statusIcon = (status: string) => {
    if (status === 'approved') return <CheckCircle size={14} style={{ color: '#34d399' }} />;
    if (status === 'rejected') return <XCircle size={14} style={{ color: '#f87171' }} />;
    return <Clock size={14} style={{ color: '#fbbf24' }} />;
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '700', color: '#f1f5f9' }}>Winners & Verification</h1>
        <p style={{ color: '#64748b', marginTop: '4px' }}>Verify winner proofs and manage payouts</p>
      </div>

      {/* All Winners */}
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '16px' }}>
        All Winners
      </h2>

      {loading ? (
        <div style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>Loading...</div>
      ) : results.length === 0 ? (
        <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
          <Award size={32} style={{ color: '#fbbf24', margin: '0 auto 12px' }} />
          <h3 style={{ fontFamily: 'var(--font-heading)', color: '#f1f5f9', marginBottom: '8px' }}>No Winners Yet</h3>
          <p style={{ color: '#64748b' }}>Run a draw to see winners here</p>
        </div>
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden', marginBottom: '32px' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Draw</th>
                <th>Player</th>
                <th>Match</th>
                <th>Prize</th>
              </tr>
            </thead>
            <tbody>
              {results.map(r => (
                <tr key={r.id}>
                  <td style={{ color: '#cbd5e1' }}>{r.draw?.month} {r.draw?.year}</td>
                  <td>
                    <div style={{ color: '#f1f5f9', fontWeight: '500' }}>{r.profile?.full_name || '—'}</div>
                    <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{r.profile?.email}</div>
                  </td>
                  <td>
                    <span className={`badge ${r.match_type === '5-match' ? 'badge-warning' : r.match_type === '4-match' ? 'badge-success' : 'badge-info'}`}>
                      {r.match_type}
                    </span>
                  </td>
                  <td style={{ color: '#fbbf24', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
                    ₹{Number(r.prize_amount).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Verifications */}
      {verifications.length > 0 && (
        <>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '16px' }}>
            Verification Requests
          </h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {verifications.map(v => (
              <div key={v.id} className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      {statusIcon(v.status)}
                      <span style={{ color: '#f1f5f9', fontWeight: '500' }}>Verification #{v.id.substring(0, 8)}</span>
                      <span className={`badge ${v.status === 'approved' ? 'badge-success' : v.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>
                        {v.status}
                      </span>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                      Payment: <span className={`badge ${v.payment_status === 'paid' ? 'badge-success' : 'badge-warning'}`}>{v.payment_status}</span>
                    </p>
                    {v.proof_url && (
                      <a href={v.proof_url} target="_blank" rel="noopener noreferrer" style={{ color: '#34d399', fontSize: '0.85rem' }}>
                        View Proof →
                      </a>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {v.status === 'pending' && (
                      <>
                        <button onClick={() => approveVerification(v.id)} className="btn-primary btn-small" style={{ gap: '4px' }}>
                          <CheckCircle size={12} /> Approve
                        </button>
                        <button onClick={() => rejectVerification(v.id)} className="btn-danger btn-small" style={{ gap: '4px' }}>
                          <XCircle size={12} /> Reject
                        </button>
                      </>
                    )}
                    {v.status === 'approved' && v.payment_status === 'pending' && (
                      <button onClick={() => markPaid(v.id)} className="btn-gold btn-small" style={{ gap: '4px' }}>
                        <DollarSign size={12} /> Mark Paid
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
