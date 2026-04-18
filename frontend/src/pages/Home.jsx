// Home.jsx - KEEP THIS AS IS (has the big logo in hero)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [error, setError] = useState(null);
  const [marketplaces, setMarketplaces] = useState({
    amazon: true, myntra: true, flipkart: true,
    ajio: true, nykaa: true, tatacliq: true, meesho: true,
  });

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/recents')
      .then(res => setRecentSearches(res.data.searches || []))
      .catch(console.error);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    setError(null);
    try {
      await axios.post('http://127.0.0.1:5000/api/search', { query, ...marketplaces });
      navigate('/products');
    } catch (err) {
      setError("Failed to fetch products. Is the backend running?");
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    await axios.post('http://127.0.0.1:5000/api/clear_history');
    setRecentSearches([]);
  };

  const toggleMarketplace = (key) => {
    setMarketplaces(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const styles = {
    outer: {
      background: 'linear-gradient(180deg, #0f0c29 0%, #0a0a18 100%)',
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
    },
    hero: {
      position: 'relative',
      minHeight: '300px',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1rem 2rem',
      textAlign: 'center',
    },
    orb: (color, w, h, top, left, right, bottom) => ({
      position: 'absolute',
      width: w, height: h,
      borderRadius: '50%',
      background: color,
      filter: 'blur(60px)',
      opacity: 0.5,
      top, left, right, bottom,
      pointerEvents: 'none',
    }),
    logoBadge: {
      width: '56px', height: '56px',
      borderRadius: '14px',
      background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '28px',
      boxShadow: '0 0 28px #7c3aedaa, 0 4px 16px #0005',
      animation: 'pulseBadge 3s ease-in-out infinite',
      flexShrink: 0,
    },
    brandName: {
      fontSize: '2.8rem',
      fontWeight: 900,
      letterSpacing: '-1px',
      background: 'linear-gradient(90deg, #a78bfa, #f472b6, #38bdf8)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      lineHeight: 1,
    },
    tagline: {
      fontSize: '1rem',
      color: '#cbd5e1',
      fontWeight: 400,
      letterSpacing: '0.5px',
      marginTop: '0.5rem',
    },
    subText: {
      fontSize: '0.85rem',
      color: '#64748b',
      maxWidth: '480px',
      margin: '0.4rem auto 0',
      lineHeight: 1.6,
    },
    searchCard: {
      background: 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: '20px',
      padding: '1.75rem',
      maxWidth: '640px',
      margin: '1.5rem auto 0',
      boxShadow: '0 32px 80px #0006, 0 0 0 1px #7c3aed22, inset 0 1px 0 rgba(255,255,255,0.1)',
    },
    inputWrap: { position: 'relative', marginBottom: '1rem' },
    searchInputIcon: {
      position: 'absolute', left: '0.9rem', top: '50%',
      transform: 'translateY(-50%)', fontSize: '1rem', opacity: 0.6,
    },
    searchInput: {
      width: '100%',
      padding: '0.85rem 1rem 0.85rem 2.8rem',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.15)',
      background: 'rgba(255,255,255,0.07)',
      color: '#f1f5f9',
      fontSize: '0.95rem',
      outline: 'none',
    },
    sectionLabel: {
      fontSize: '0.75rem',
      fontWeight: 500,
      color: '#94a3b8',
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      marginBottom: '0.6rem',
      marginTop: '0.2rem',
    },
    pillsRow: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' },
    pill: {
      padding: '0.35rem 0.9rem',
      borderRadius: '100px',
      fontSize: '0.8rem',
      cursor: 'pointer',
      fontWeight: 500,
      background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(236,72,153,0.2))',
      border: '1px solid rgba(124,58,237,0.3)',
      color: '#a78bfa',
      transition: 'all 0.2s',
    },
    mpRow: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.2rem' },
    mpChip: (active) => ({
      display: 'flex', alignItems: 'center', gap: '0.35rem',
      padding: '0.3rem 0.75rem',
      borderRadius: '8px',
      border: `1px solid ${active ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.1)'}`,
      background: active ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.04)',
      cursor: 'pointer',
      fontSize: '0.78rem',
      color: active ? '#c4b5fd' : '#cbd5e1',
      userSelect: 'none',
      transition: 'all 0.2s',
    }),
    mpDot: (active) => ({
      width: '8px', height: '8px',
      borderRadius: '50%',
      background: active ? '#a78bfa' : '#475569',
      flexShrink: 0,
      transition: 'background 0.2s',
    }),
    btnSearch: {
      width: '100%',
      padding: '0.9rem',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
      color: '#fff',
      fontSize: '1rem',
      fontWeight: 700,
      letterSpacing: '0.3px',
      boxShadow: '0 8px 32px rgba(124,58,237,0.4)',
      transition: 'all 0.15s',
    },
    loadingNote: {
      textAlign: 'center',
      marginTop: '0.75rem',
      fontSize: '0.82rem',
      color: '#f59e0b',
    },
    errorMsg: {
      color: '#f87171',
      fontSize: '0.82rem',
      textAlign: 'center',
      padding: '0.5rem',
      background: 'rgba(239,68,68,0.1)',
      borderRadius: '8px',
      border: '1px solid rgba(239,68,68,0.2)',
      marginBottom: '0.75rem',
    },
    recents: {
      maxWidth: '640px',
      margin: '1rem auto',
      padding: '0 0.5rem',
    },
    recentsHeader: {
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '0.5rem',
    },
    recentsTitle: {
      fontSize: '0.72rem', fontWeight: 500,
      color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em',
    },
    clearBtn: {
      fontSize: '0.72rem', color: '#f87171',
      background: 'rgba(239,68,68,0.1)',
      border: '1px solid rgba(239,68,68,0.2)',
      borderRadius: '6px', padding: '0.2rem 0.6rem', cursor: 'pointer',
    },
    recentTags: { display: 'flex', flexWrap: 'wrap', gap: '0.4rem' },
    recentTag: {
      padding: '0.3rem 0.7rem',
      borderRadius: '100px',
      fontSize: '0.75rem',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      color: '#94a3b8',
      cursor: 'pointer',
    },
    features: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '1rem',
      maxWidth: '640px',
      margin: '1.5rem auto 2rem',
      padding: '0 0.5rem',
    },
    featCard: {
      padding: '1.2rem',
      borderRadius: '16px',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
      border: '1px solid rgba(255,255,255,0.08)',
      cursor: 'default',
      transition: 'all 0.25s',
    },
    featIcon: { fontSize: '1.5rem', marginBottom: '0.6rem', display: 'block' },
    featTitle: { fontSize: '0.9rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.3rem' },
    featDesc: { fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5 },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');
        @keyframes pulseBadge {
          0%,100% { box-shadow: 0 0 24px #7c3aedaa, 0 4px 16px #0005; }
          50% { box-shadow: 0 0 42px #ec4899cc, 0 4px 16px #0005; }
        }
        @keyframes floatOrb {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
        }
        @keyframes floatParticle {
          0%,100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-22px) scale(1.4); }
        }
        .gc-search-input:focus {
          border-color: #7c3aed !important;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.2) !important;
        }
        .gc-pill:hover {
          background: linear-gradient(135deg, rgba(124,58,237,0.4), rgba(236,72,153,0.4)) !important;
          transform: translateY(-1px);
        }
        .gc-feat-card:hover {
          border-color: rgba(124,58,237,0.4) !important;
          background: linear-gradient(135deg, rgba(124,58,237,0.08), rgba(236,72,153,0.05)) !important;
          transform: perspective(600px) rotateX(-4deg) translateY(-4px);
        }
        .gc-btn:hover { transform: translateY(-2px) scale(1.01); box-shadow: 0 12px 40px rgba(124,58,237,0.5) !important; }
        .gc-btn:active { transform: scale(0.98); }
        .gc-recent-tag:hover { border-color: rgba(124,58,237,0.4) !important; color: #a78bfa !important; }
      `}</style>

      <div style={styles.outer}>
        {/* HERO */}
        <header style={styles.hero}>
          {/* Orbs */}
          <div style={{...styles.orb('#7c3aed','280px','280px','-80px','-60px',undefined,undefined), animation:'floatOrb 6s ease-in-out infinite'}} />
          <div style={{...styles.orb('#ec4899','220px','220px',undefined,undefined,'-40px','-60px'), animation:'floatOrb 6s ease-in-out 2s infinite'}} />
          <div style={{...styles.orb('#06b6d4','160px','160px','40px',undefined,'20%',undefined), animation:'floatOrb 6s ease-in-out 4s infinite'}} />

          {/* Particles */}
          {[
            {c:'#7c3aed',t:'20%',l:'15%',d:'0s'},{c:'#ec4899',t:'60%',l:'80%',d:'1s'},
            {c:'#06b6d4',t:'75%',l:'30%',d:'2s'},{c:'#f59e0b',t:'15%',l:'70%',d:'0.5s'},
            {c:'#a78bfa',t:'45%',l:'5%',d:'3s'},
          ].map((p,i)=>(
            <div key={i} style={{
              position:'absolute',width:'6px',height:'6px',borderRadius:'50%',
              background:p.c,top:p.t,left:p.l,opacity:0.7,
              animation:`floatParticle 4s ease-in-out ${p.d} infinite`,
              pointerEvents:'none',
            }}/>
          ))}

          {/* Logo row - KEEP THIS (big GeniusCart logo for home page) */}
          <div style={{position:'relative',zIndex:2,display:'flex',alignItems:'center',gap:'12px',marginBottom:'0.4rem'}}>
            <div style={styles.logoBadge}>🛒</div>
            <span style={styles.brandName}>GeniusCart</span>
          </div>
          <p style={{...styles.tagline,position:'relative',zIndex:2}}>Shop Smarter. Compare Faster.</p>
          <p style={{...styles.subText,position:'relative',zIndex:2}}>
            Compare prices, sentiments, and AI value ratings across India's biggest marketplaces — instantly.
          </p>
        </header>

        <div style={{padding:'0 1rem'}}>
          {/* SEARCH CARD */}
          <div style={styles.searchCard}>
            {error && <div style={styles.errorMsg}>{error}</div>}

            <div style={styles.inputWrap}>
              <span style={styles.searchInputIcon}>🔍</span>
              <input
                className="gc-search-input"
                style={styles.searchInput}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => { if(e.key==='Enter') handleSearch(e); }}
                placeholder="Search any product..."
              />
            </div>

            <div style={styles.sectionLabel}>Quick picks</div>
            <div style={styles.pillsRow}>
              {['Clothes','Shoes','Beauty Products','Smartphones','Laptops'].map(w => (
                <button key={w} type="button" className="gc-pill" style={styles.pill} onClick={() => setQuery(w)}>
                  {w}
                </button>
              ))}
            </div>

            <div style={styles.sectionLabel}>Marketplaces</div>
            <div style={styles.mpRow}>
              {Object.keys(marketplaces).map(key => (
                <div key={key} style={styles.mpChip(marketplaces[key])} onClick={() => toggleMarketplace(key)}>
                  <div style={styles.mpDot(marketplaces[key])} />
                  <span style={{textTransform:'capitalize'}}>{key}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="gc-btn"
              style={{...styles.btnSearch, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer'}}
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? '⏳ Fetching...' : '🚀 Search & Analyze'}
            </button>

            {loading && (
              <p style={styles.loadingNote}>
                ⏳ Please wait 10–30 seconds while we fetch live product data...
              </p>
            )}
          </div>

          {/* RECENTS */}
          {recentSearches.length > 0 && (
            <div style={styles.recents}>
              <div style={styles.recentsHeader}>
                <span style={styles.recentsTitle}>Recent searches</span>
                <button style={styles.clearBtn} onClick={handleClearHistory}>Clear 🗑️</button>
              </div>
              <div style={styles.recentTags}>
                {recentSearches.map((term, i) => (
                  <span key={i} className="gc-recent-tag" style={styles.recentTag} onClick={() => setQuery(term)}>
                    🕒 {term}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* FEATURE CARDS */}
          <div style={styles.features}>
            {[
              {icon:'🔍', title:'Unified search', desc:'Fetch results from 7 platforms in one shot.'},
              {icon:'📊', title:'Smart comparisons', desc:'Side-by-side prices, ratings & reviews.'},
              {icon:'⚡', title:'AI insights', desc:'Auto-generated highlights and value scores.'},
            ].map((f,i) => (
              <div key={i} className="gc-feat-card" style={styles.featCard}>
                <span style={styles.featIcon}>{f.icon}</span>
                <div style={styles.featTitle}>{f.title}</div>
                <div style={styles.featDesc}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;