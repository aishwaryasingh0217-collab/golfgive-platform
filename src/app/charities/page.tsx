'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import type { Charity } from '@/lib/types';
import { Search, Heart, ExternalLink, Star } from 'lucide-react';

export default function CharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    const { data } = await supabase
      .from('charities')
      .select('*')
      .order('is_featured', { ascending: false });
    if (data) setCharities(data as Charity[]);
    setLoading(false);
  };

  const filtered = charities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <main className="bg-gradient-hero" style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              color: '#ec4899', fontSize: '0.85rem', fontWeight: '600',
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>
              <Heart size={14} /> Our Charities
            </span>
            <h1 style={{
              fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: '700', color: '#f1f5f9', marginTop: '12px', marginBottom: '16px',
            }}>
              Charities We Support
            </h1>
            <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0 auto', lineHeight: '1.6' }}>
              A portion of every subscription goes directly to these incredible organizations.
              Choose the cause closest to your heart.
            </p>
          </div>

          {/* Search */}
          <div style={{ maxWidth: '500px', margin: '0 auto 48px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
            <input
              id="charity-search"
              className="input-field"
              style={{ paddingLeft: '44px' }}
              placeholder="Search charities..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '60px 0' }}>Loading charities...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
              {filtered.map(charity => (
                <div key={charity.id} className="glass-card stat-glow" style={{
                  overflow: 'hidden', transition: 'transform 0.3s ease',
                }}>
                  <div style={{
                    height: '180px', background: `url(${charity.image_url}) center/cover`,
                    position: 'relative',
                  }}>
                    {charity.is_featured && (
                      <div style={{
                        position: 'absolute', top: '12px', left: '12px',
                        display: 'flex', alignItems: 'center', gap: '4px',
                        background: 'rgba(245, 158, 11, 0.9)',
                        color: '#020617', padding: '4px 12px', borderRadius: '20px',
                        fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase',
                      }}>
                        <Star size={10} /> Featured
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '24px' }}>
                    <h3 style={{
                      fontFamily: 'var(--font-heading)', fontSize: '1.15rem',
                      fontWeight: '700', color: '#f1f5f9', marginBottom: '8px',
                    }}>{charity.name}</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '16px', minHeight: '48px' }}>
                      {charity.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Total Received</span>
                        <div style={{ color: '#34d399', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
                          ₹{charity.total_received.toLocaleString('en-IN')}
                        </div>
                      </div>
                      {charity.website_url && (
                        <a href={charity.website_url} target="_blank" rel="noopener noreferrer"
                          className="btn-secondary btn-small" style={{ gap: '6px' }}>
                          Visit <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '60px 0' }}>
              No charities found matching &quot;{search}&quot;
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
