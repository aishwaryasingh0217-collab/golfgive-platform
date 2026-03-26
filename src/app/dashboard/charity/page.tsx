'use client';

import { useAuth } from '@/lib/auth-context';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Charity } from '@/lib/types';
import { Heart, Check, Search, Star, ExternalLink } from 'lucide-react';

export default function CharityPage() {
  const { user, refreshProfile } = useAuth();
  const [charities, setCharities] = useState<Charity[]>([]);
  const [selectedCharity, setSelectedCharity] = useState<Charity | null>(null);
  const [contribution, setContribution] = useState(user?.contribution_percentage || 10);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCharities();
  }, []);

  useEffect(() => {
    if (user?.selected_charity_id && charities.length > 0) {
      const c = charities.find(c => c.id === user.selected_charity_id);
      if (c) setSelectedCharity(c);
    }
    if (user?.contribution_percentage) {
      setContribution(user.contribution_percentage);
    }
  }, [user, charities]);

  const fetchCharities = async () => {
    const { data } = await supabase.from('charities').select('*').order('is_featured', { ascending: false });
    if (data) setCharities(data as Charity[]);
    setLoading(false);
  };

  const selectCharity = async (charity: Charity) => {
    setSaving(true);
    await supabase.from('profiles').update({
      selected_charity_id: charity.id,
    }).eq('id', user!.id);
    setSelectedCharity(charity);
    await refreshProfile();
    setSaving(false);
  };

  const updateContribution = async () => {
    setSaving(true);
    await supabase.from('profiles').update({
      contribution_percentage: contribution,
    }).eq('id', user!.id);
    await refreshProfile();
    setSaving(false);
  };

  const filtered = charities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '700', color: '#f1f5f9' }}>
          My Charity
        </h1>
        <p style={{ color: '#64748b', marginTop: '4px' }}>Choose your charity and set your contribution</p>
      </div>

      {/* Current Selection */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Heart size={20} style={{ color: '#ec4899' }} />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: '600', color: '#f1f5f9' }}>
            Your Selected Charity
          </h2>
        </div>

        {selectedCharity ? (
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '12px',
              background: `url(${selectedCharity.image_url}) center/cover`,
              flexShrink: 0,
            }} />
            <div style={{ flex: 1, minWidth: '200px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: '#f1f5f9', fontSize: '1.1rem', fontWeight: '600' }}>
                {selectedCharity.name}
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>{selectedCharity.description}</p>
            </div>
          </div>
        ) : (
          <p style={{ color: '#94a3b8' }}>No charity selected yet. Choose one below!</p>
        )}

        {/* Contribution slider */}
        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(30, 41, 59, 0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Contribution Percentage</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: '700', color: '#34d399' }}>
              {contribution}%
            </span>
          </div>
          <input
            id="contribution-slider"
            type="range"
            min="10"
            max="100"
            step="5"
            value={contribution}
            onChange={e => setContribution(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            <span style={{ color: '#475569', fontSize: '0.75rem' }}>Min: 10%</span>
            <span style={{ color: '#475569', fontSize: '0.75rem' }}>Max: 100%</span>
          </div>
          <button
            onClick={updateContribution}
            disabled={saving || contribution === user?.contribution_percentage}
            className="btn-primary btn-small"
            style={{ marginTop: '16px' }}
          >
            {saving ? 'Saving...' : 'Update Contribution'}
          </button>
        </div>
      </div>

      {/* Charity Selection */}
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '16px' }}>
        {selectedCharity ? 'Change Your Charity' : 'Select a Charity'}
      </h2>

      <div style={{ marginBottom: '20px', position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
        <input
          className="input-field"
          style={{ paddingLeft: '42px' }}
          placeholder="Search charities..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>Loading...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {filtered.map(charity => (
            <div
              key={charity.id}
              className="glass-card-light"
              style={{
                padding: '20px', cursor: 'pointer',
                border: selectedCharity?.id === charity.id ? '2px solid #34d399' : '1px solid rgba(52, 211, 153, 0.08)',
                transition: 'all 0.2s ease',
              }}
              onClick={() => selectCharity(charity)}
            >
              <div style={{ display: 'flex', gap: '14px', alignItems: 'start' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '10px',
                  background: `url(${charity.image_url}) center/cover`,
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: '600', color: '#f1f5f9' }}>
                      {charity.name}
                    </h3>
                    {charity.is_featured && <Star size={12} style={{ color: '#fbbf24' }} />}
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: '1.5' }}>
                    {charity.description.substring(0, 80)}...
                  </p>
                </div>
                {selectedCharity?.id === charity.id && (
                  <Check size={20} style={{ color: '#34d399', flexShrink: 0 }} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
