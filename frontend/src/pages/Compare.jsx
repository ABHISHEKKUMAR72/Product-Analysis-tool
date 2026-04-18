import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

const Compare = () => {
  const [searchParams] = useSearchParams();
  const link = searchParams.get("link");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!link) { setLoading(false); return; }
    axios.get(`http://127.0.0.1:5000/api/compare?link=${encodeURIComponent(link)}`)
      .then(res => { setItems(res.data.items || []); setLoading(false); })
      .catch(err => { setError(err.response?.data?.error || "Error fetching compare data"); setLoading(false); });
  }, [link]);

  const styles = {
    outer: {
      background: 'linear-gradient(180deg, #0f0c29 0%, #0a0a18 100%)',
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      paddingBottom: '3rem',
    },
    pageHeader: {
      textAlign: 'center',
      padding: '2rem 1.5rem 0.5rem 1.5rem',
    },
    pageTitle: {
      fontSize: '2rem',
      fontWeight: 900,
      background: 'linear-gradient(90deg, #a78bfa, #f472b6, #38bdf8)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '0.5rem',
    },
    pageSubtitle: {
      color: '#64748b',
      fontSize: '0.85rem',
      marginBottom: '2rem',
    },
    container: { maxWidth: '1100px', margin: '0 auto', padding: '0 1rem' },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '1.25rem',
      alignItems: 'start',
    },
    card: (isTarget) => ({
      borderRadius: '20px',
      border: isTarget
        ? '2px solid rgba(124,58,237,0.7)'
        : '1px solid rgba(255,255,255,0.08)',
      background: isTarget
        ? 'linear-gradient(160deg, rgba(124,58,237,0.12), rgba(236,72,153,0.06), rgba(255,255,255,0.03))'
        : 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: isTarget
        ? '0 0 40px rgba(124,58,237,0.25), 0 20px 60px #0005'
        : '0 8px 32px #0004',
      transform: isTarget ? 'translateY(-6px)' : 'none',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }),
    cardBadge: (isTarget) => ({
      padding: '0.5rem 1rem',
      textAlign: 'center',
      fontSize: '0.72rem',
      fontWeight: 700,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      background: isTarget
        ? 'linear-gradient(90deg, #7c3aed, #ec4899)'
        : 'rgba(255,255,255,0.05)',
      color: isTarget ? '#fff' : '#64748b',
      borderBottom: isTarget
        ? '1px solid rgba(124,58,237,0.3)'
        : '1px solid rgba(255,255,255,0.06)',
    }),
    cardBody: { padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' },
    cardTitle: {
      fontSize: '0.95rem', fontWeight: 700, color: '#e2e8f0',
      marginBottom: '1.2rem', lineHeight: 1.5,
      display: '-webkit-box', WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical', overflow: 'hidden',
    },
    statRow: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0.65rem 0',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    },
    statLabel: { fontSize: '0.75rem', color: '#64748b', fontWeight: 500 },
    statPrice: { fontSize: '1.5rem', fontWeight: 900, color: '#34d399' },
    statStore: { fontSize: '0.85rem', fontWeight: 600, color: '#c4b5fd' },
    statRating: { fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24' },
    buyBtn: (isTarget) => ({
      display: 'block', width: '100%', padding: '0.8rem',
      marginTop: '1.25rem',
      borderRadius: '12px', border: 'none', cursor: 'pointer',
      background: isTarget
        ? 'linear-gradient(135deg, #7c3aed, #ec4899)'
        : 'rgba(255,255,255,0.08)',
      color: '#fff', fontWeight: 700, fontSize: '0.88rem',
      textAlign: 'center', textDecoration: 'none',
      boxShadow: isTarget ? '0 6px 24px rgba(124,58,237,0.4)' : 'none',
      transition: 'all 0.2s',
    }),
    stateBox: {
      textAlign: 'center', padding: '4rem 1rem',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '20px', maxWidth: '480px', margin: '2rem auto',
    },
    stateIcon: { fontSize: '2.5rem', marginBottom: '0.75rem' },
    stateText: { fontSize: '0.95rem', color: '#94a3b8' },
    backLink: {
      display: 'inline-block',
      marginTop: '2rem',
      fontSize: '0.82rem', fontWeight: 500,
      color: '#a78bfa', textDecoration: 'none',
      padding: '0.35rem 0.85rem',
      border: '1px solid rgba(124,58,237,0.35)',
      borderRadius: '8px',
      background: 'rgba(124,58,237,0.1)',
      transition: 'all 0.2s',
      textAlign: 'center',
    },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');
        @keyframes floatOrb {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        .gc-back-link:hover {
          background: rgba(124,58,237,0.2) !important;
          border-color: rgba(124,58,237,0.6) !important;
          color: #c4b5fd !important;
        }
        .gc-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 0 40px rgba(124,58,237,0.2), 0 24px 64px #0006 !important;
        }
        .gc-card-target:hover {
          transform: translateY(-10px) !important;
        }
        .gc-buy-btn:hover {
          filter: brightness(1.15);
          transform: translateY(-1px);
        }
      `}</style>

      <div style={styles.outer}>
        {/* Page Header - Only title, no logo */}
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>⚖️ Head-to-Head Compare</h1>
          <p style={styles.pageSubtitle}>
            Target product highlighted — see how it stacks up against competitors
          </p>
        </div>

        <div style={styles.container}>
          {loading ? (
            <div style={styles.stateBox}>
              <div style={styles.stateIcon}>⏳</div>
              <div style={styles.stateText}>Loading comparisons...</div>
            </div>
          ) : error || !items.length ? (
            <div style={styles.stateBox}>
              <div style={styles.stateIcon}>⚠️</div>
              <div style={{...styles.stateText, color:'#f87171'}}>{error || "No products to compare"}</div>
            </div>
          ) : (
            <>
              <div style={styles.grid}>
                {items.map((item, index) => {
                  const isTarget = index === 0;
                  return (
                    <div
                      key={index}
                      className={isTarget ? 'gc-card gc-card-target' : 'gc-card'}
                      style={styles.card(isTarget)}
                    >
                      <div style={styles.cardBadge(isTarget)}>
                        {isTarget ? '🎯 Target Product' : '🔍 Competitor'}
                      </div>

                      <div style={styles.cardBody}>
                        <div style={styles.cardTitle}>{item.Title}</div>

                        <div>
                          <div style={styles.statRow}>
                            <span style={styles.statLabel}>Price</span>
                            <span style={styles.statPrice}>₹{item.Price}</span>
                          </div>
                          <div style={styles.statRow}>
                            <span style={styles.statLabel}>Store</span>
                            <span style={styles.statStore}>{item.Source}</span>
                          </div>
                          <div style={{...styles.statRow, borderBottom:'none'}}>
                            <span style={styles.statLabel}>Rating</span>
                            <span style={styles.statRating}>⭐ {item.Rating ?? 'N/A'}</span>
                          </div>
                        </div>

                        <a
                          href={item.Link}
                          target="_blank"
                          rel="noreferrer"
                          className="gc-buy-btn"
                          style={styles.buyBtn(isTarget)}
                        >
                          {isTarget ? '🛒 Buy Now' : 'View Product →'}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ textAlign: 'center' }}>
                <Link to="/products" className="gc-back-link" style={styles.backLink}>← Back to Products</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Compare;