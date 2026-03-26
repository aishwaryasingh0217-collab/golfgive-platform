'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Charity } from '@/lib/types';
import { Heart, Plus, Edit3, Trash2, Save, X, Star } from 'lucide-react';

export default function AdminCharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '', image_url: '', website_url: '', is_featured: false });

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    const { data } = await supabase.from('charities').select('*').order('created_at', { ascending: false });
    if (data) setCharities(data as Charity[]);
    setLoading(false);
  };

  const createCharity = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('charities').insert(form);
    setForm({ name: '', description: '', image_url: '', website_url: '', is_featured: false });
    setShowCreate(false);
    fetchCharities();
  };

  const startEdit = (c: Charity) => {
    setEditingId(c.id);
    setForm({
      name: c.name, description: c.description,
      image_url: c.image_url, website_url: c.website_url || '',
      is_featured: c.is_featured,
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await supabase.from('charities').update(form).eq('id', editingId);
    setEditingId(null);
    setForm({ name: '', description: '', image_url: '', website_url: '', is_featured: false });
    fetchCharities();
  };

  const deleteCharity = async (id: string) => {
    await supabase.from('charities').delete().eq('id', id);
    fetchCharities();
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '700', color: '#f1f5f9' }}>Charity Management</h1>
          <p style={{ color: '#64748b', marginTop: '4px' }}>{charities.length} charities listed</p>
        </div>
        <button onClick={() => { setShowCreate(!showCreate); setEditingId(null); }} className="btn-primary"><Plus size={16} /> Add Charity</button>
      </div>

      {/* Create / Edit Form */}
      {(showCreate || editingId) && (
        <div className="glass-card animate-fade-in" style={{ padding: '28px', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: '600', color: '#f1f5f9', marginBottom: '20px' }}>
            {editingId ? 'Edit Charity' : 'Add New Charity'}
          </h3>
          <form onSubmit={editingId ? (e) => { e.preventDefault(); saveEdit(); } : createCharity}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '6px' }}>Name</label>
                <input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '6px' }}>Image URL</label>
                <input className="input-field" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
              </div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '6px' }}>Description</label>
              <textarea className="input-field" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', marginBottom: '16px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '6px' }}>Website URL</label>
                <input className="input-field" value={form.website_url} onChange={e => setForm({ ...form, website_url: e.target.value })} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px 0' }}>
                <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} style={{ accentColor: '#fbbf24' }} />
                <span style={{ color: '#fbbf24', fontSize: '0.85rem', fontWeight: '500' }}>Featured</span>
              </label>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn-primary"><Save size={14} /> {editingId ? 'Save Changes' : 'Create'}</button>
              <button type="button" onClick={() => { setShowCreate(false); setEditingId(null); }} className="btn-secondary"><X size={14} /> Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Charities List */}
      {loading ? (
        <div style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>Loading...</div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {charities.map(c => (
            <div key={c.id} className="glass-card" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '10px',
                background: `url(${c.image_url}) center/cover`, flexShrink: 0,
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', color: '#f1f5f9', fontSize: '1rem', fontWeight: '600' }}>{c.name}</h3>
                  {c.is_featured && <Star size={12} style={{ color: '#fbbf24' }} />}
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '4px' }}>{c.description.substring(0, 100)}...</p>
                <span style={{ color: '#34d399', fontSize: '0.8rem', fontWeight: '500' }}>Total Received: ₹{c.total_received.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => startEdit(c)} className="btn-secondary btn-small"><Edit3 size={12} /></button>
                <button onClick={() => deleteCharity(c.id)} className="btn-danger btn-small"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
