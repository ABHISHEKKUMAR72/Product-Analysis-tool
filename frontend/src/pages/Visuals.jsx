import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Visuals = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/visuals')
      .then(res => { setData(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const s = {
    outer: { background: 'linear-gradient(180deg,#0f0c29 0%,#0a0a18 100%)', minHeight: '100vh', fontFamily: "'Inter',sans-serif", paddingBottom: '3rem' },
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
      marginBottom: '1.5rem',
    },
    container: { maxWidth: '1100px', margin: '0 auto', padding: '0 1rem' },
    infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem', marginBottom: '1.75rem' },
    infoCard: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.2rem', textAlign: 'center', backdropFilter: 'blur(12px)', transition: 'all 0.2s' },
    infoIcon: { fontSize: '1.5rem', marginBottom: '0.4rem' },
    infoTitle: { fontSize: '0.88rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.25rem' },
    infoDesc: { fontSize: '0.72rem', color: '#64748b', lineHeight: 1.5 },
    plotsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(420px,1fr))', gap: '1.25rem' },
    plotCard: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.25rem', backdropFilter: 'blur(12px)', transition: 'all 0.2s' },
    plotTitle: { fontSize: '0.82rem', fontWeight: 700, color: '#c4b5fd', textTransform: 'capitalize', marginBottom: '0.75rem' },
    plotImg: { width: '100%', borderRadius: '10px', display: 'block', border: '1px solid rgba(255,255,255,0.06)' },
    stateBox: { textAlign: 'center', padding: '5rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', maxWidth: '480px', margin: '2rem auto' },
    stateIcon: { fontSize: '2.5rem', marginBottom: '0.75rem' },
    stateText: { fontSize: '0.9rem', color: '#94a3b8' },
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
        @keyframes floatOrb { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .gc-info-card:hover { border-color: rgba(124,58,237,0.35) !important; background: rgba(124,58,237,0.06) !important; transform: translateY(-2px); }
        .gc-plot-card:hover { border-color: rgba(124,58,237,0.3) !important; transform: translateY(-3px); box-shadow: 0 12px 40px rgba(124,58,237,0.12); }
      `}</style>

      <div style={s.outer}>
        {/* Page Header - Only title, no logo */}
        <div style={s.pageHeader}>
          <h1 style={s.pageTitle}>📊 Visuals Analysis</h1>
          <p style={s.pageSubtitle}>AI-generated charts from live scraped data across all marketplaces</p>
        </div>

        <div style={s.container}>
          <div style={s.infoGrid}>
            {[
              { icon: '📊', title: 'Price Trends', desc: 'Visualize price distributions across platforms.' },
              { icon: '⭐', title: 'Ratings Insight', desc: 'See how customers rated products on each store.' },
              { icon: '📈', title: 'Compare Platforms', desc: 'Spot differences between Amazon, Flipkart & more.' },
            ].map((c, i) => (
              <div key={i} className="gc-info-card" style={s.infoCard}>
                <div style={s.infoIcon}>{c.icon}</div>
                <div style={s.infoTitle}>{c.title}</div>
                <div style={s.infoDesc}>{c.desc}</div>
              </div>
            ))}
          </div>

          {loading ? (
            <div style={s.stateBox}>
              <div style={s.stateIcon}>⏳</div>
              <div style={s.stateText}>Generating plots...</div>
            </div>
          ) : data?.message ? (
            <div style={s.stateBox}>
              <div style={s.stateIcon}>⚠️</div>
              <div style={{ ...s.stateText, color: '#f87171' }}>{data.message}</div>
            </div>
          ) : (
            <>
              <div style={s.plotsGrid}>
                {data?.plots && Object.entries(data.plots).map(([key, plot]) => (
                  <div key={key} className="gc-plot-card" style={s.plotCard}>
                    <div style={s.plotTitle}>{key.replace(/_/g, ' ')}</div>
                    <img
                      src={`data:image/png;base64,${plot}`}
                      alt={key}
                      style={s.plotImg}
                    />
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'center' }}>
                <Link to="/products" className="gc-back-link" style={s.backLink}>← Back to Products</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Visuals;