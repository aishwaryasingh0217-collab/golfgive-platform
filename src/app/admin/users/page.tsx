'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/lib/types';
import { Users, Search, Edit3, Save, X } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (data) setUsers(data as Profile[]);
    setLoading(false);
  };

  const updateRole = async (userId: string) => {
    await supabase.from('profiles').update({ role: editRole }).eq('id', userId);
    setEditingId(null);
    fetchUsers();
  };

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.full_name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '700', color: '#f1f5f9' }}>User Management</h1>
          <p style={{ color: '#64748b', marginTop: '4px' }}>{users.length} total users</p>
        </div>
      </div>

      <div style={{ marginBottom: '20px', position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
        <input className="input-field" style={{ paddingLeft: '42px' }} placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Contribution</th>
              <th>Joined</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#64748b', padding: '24px' }}>Loading...</td></tr>
            ) : filtered.map(u => (
              <tr key={u.id}>
                <td style={{ color: '#f1f5f9', fontWeight: '500' }}>{u.full_name || '—'}</td>
                <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{u.email}</td>
                <td>
                  {editingId === u.id ? (
                    <select className="select-field" style={{ width: '120px', padding: '6px 10px', fontSize: '0.8rem' }} value={editRole} onChange={e => setEditRole(e.target.value)}>
                      <option value="visitor">Visitor</option>
                      <option value="subscriber">Subscriber</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span className={`badge ${u.role === 'admin' ? 'badge-warning' : u.role === 'subscriber' ? 'badge-success' : 'badge-info'}`}>{u.role}</span>
                  )}
                </td>
                <td style={{ color: '#34d399', fontWeight: '500' }}>{u.contribution_percentage}%</td>
                <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                <td style={{ textAlign: 'right' }}>
                  {editingId === u.id ? (
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button onClick={() => updateRole(u.id)} className="btn-primary btn-small" style={{ gap: '4px' }}><Save size={12} /> Save</button>
                      <button onClick={() => setEditingId(null)} className="btn-secondary btn-small" style={{ gap: '4px' }}><X size={12} /></button>
                    </div>
                  ) : (
                    <button onClick={() => { setEditingId(u.id); setEditRole(u.role); }} className="btn-secondary btn-small" style={{ gap: '4px' }}>
                      <Edit3 size={12} /> Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#64748b', padding: '24px' }}>No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
