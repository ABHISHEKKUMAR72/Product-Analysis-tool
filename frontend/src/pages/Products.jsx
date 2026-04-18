import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PriceHistoryChart from '../components/PriceHistoryChart';

const Products = () => {
  const [data, setData] = useState({ products: [], cheapest: [], expensive: [], top_recs: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterText, setFilterText] = useState('');
  const [currencyMultiplier, setCurrencyMultiplier] = useState(1);
  const [currencySymbol, setCurrencySymbol] = useState('₹');
  const [openCharts, setOpenCharts] = useState({});
  const [sortOption, setSortOption] = useState('default'); // default, price_asc, price_desc, rating_asc, rating_desc

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/products')
      .then(res => { setData(res.data); setLoading(false); })
      .catch(() => { setError("Error fetching products."); setLoading(false); });
  }, []);

  const handleCurrencyChange = (e) => {
    const option = e.target.options[e.target.selectedIndex];
    setCurrencyMultiplier(parseFloat(e.target.value));
    setCurrencySymbol(option.getAttribute('data-symbol'));
  };

  const formatPrice = (basePrice) => {
    if (!basePrice || isNaN(basePrice)) return basePrice;
    let newPrice = (basePrice * currencyMultiplier).toFixed(2);
    if (newPrice.endsWith('.00')) newPrice = parseInt(newPrice);
    return `${currencySymbol}${newPrice}`;
  };

  const getSourceColor = (source) => {
    const colors = {
      'Amazon': '#f97316', 'Myntra': '#ec4899', 'Flipkart': '#3b82f6',
      'Ajio': '#14b8a6', 'Nykaa': '#d946ef', 'TataCLiQ': '#94a3b8', 'Meesho': '#a855f7'
    };
    return colors[source] || '#94a3b8';
  };

  const toggleChart = (index) => setOpenCharts(prev => ({ ...prev, [index]: !prev[index] }));

  const handleAlertSubmit = async (e, link, title, price) => {
    e.preventDefault();
    const email = e.target.email.value;
    const target_price = price * 0.9;
    try {
      await axios.post('http://127.0.0.1:5000/api/alert', { email, link, title, target_price });
      alert(`Price alert set for ${email}!`);
      e.target.reset();
    } catch { alert("Failed to set alert."); }
  };

  // Filter products based on search text
  let filteredProducts = data.products.filter(row =>
    row.Title?.toUpperCase().includes(filterText.toUpperCase())
  );

  // Sort products based on selected option
  const getSortedProducts = () => {
    const products = [...filteredProducts];
    
    switch(sortOption) {
      case 'price_asc':
        return products.sort((a, b) => (a.Price || 0) - (b.Price || 0));
      case 'price_desc':
        return products.sort((a, b) => (b.Price || 0) - (a.Price || 0));
      case 'rating_asc':
        return products.sort((a, b) => (a.Rating || 0) - (b.Rating || 0));
      case 'rating_desc':
        return products.sort((a, b) => (b.Rating || 0) - (a.Rating || 0));
      default:
        return products;
    }
  };

  const sortedProducts = getSortedProducts();

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
    },
    container: { maxWidth: '1200px', margin: '0 auto', padding: '1.75rem 1rem 0' },
    infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem', marginBottom: '1.5rem' },
    infoCard: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.2rem', textAlign: 'center', backdropFilter: 'blur(12px)', transition: 'all 0.2s' },
    infoIcon: { fontSize: '1.4rem', marginBottom: '0.4rem' },
    infoTitle: { fontSize: '0.88rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.25rem' },
    infoDesc: { fontSize: '0.72rem', color: '#64748b', lineHeight: 1.5 },
    sectionHeading: { fontSize: '1.2rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '0.2rem' },
    highlightsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1rem', marginBottom: '1.5rem' },
    highlightCard: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.25rem', backdropFilter: 'blur(12px)' },
    hlTitle: { fontSize: '0.88rem', fontWeight: 700, color: '#c4b5fd', marginBottom: '0.75rem' },
    hlItem: { fontSize: '0.78rem', color: '#94a3b8', padding: '0.3rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' },
    recsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1rem', marginBottom: '1.75rem' },
    recCard: { position: 'relative', background: 'linear-gradient(135deg,rgba(124,58,237,0.12),rgba(236,72,153,0.06),rgba(255,255,255,0.03))', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', backdropFilter: 'blur(14px)', boxShadow: '0 8px 32px #7c3aed22' },
    recBadge: { position: 'absolute', top: '0.7rem', right: '0.7rem', fontSize: '0.65rem', fontWeight: 700, background: 'linear-gradient(90deg,#f59e0b,#ef4444)', color: '#fff', padding: '0.2rem 0.55rem', borderRadius: '100px' },
    recTitle: { fontSize: '0.88rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '5rem' },
    recPrice: { fontSize: '1.1rem', fontWeight: 900, color: '#34d399' },
    recMeta: { fontSize: '0.72rem', color: '#64748b', marginBottom: '0.75rem' },
    recBtn: { display: 'block', width: '100%', padding: '0.6rem', borderRadius: '10px', background: 'linear-gradient(135deg,#7c3aed,#ec4899)', color: '#fff', fontWeight: 700, fontSize: '0.8rem', textAlign: 'center', textDecoration: 'none', marginTop: 'auto', boxShadow: '0 4px 16px #7c3aed44' },
    toolbar: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '0.9rem 1.1rem', marginBottom: '1rem', backdropFilter: 'blur(12px)' },
    filterInput: { padding: '0.5rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: '#f1f5f9', fontSize: '0.82rem', outline: 'none', minWidth: '220px' },
    sortSelect: {
      padding: '0.5rem 0.9rem',
      borderRadius: '10px',
      border: '1px solid rgba(124,58,237,0.3)',
      background: 'rgba(124,58,237,0.12)',
      color: '#c4b5fd',
      fontSize: '0.82rem',
      fontWeight: 600,
      outline: 'none',
      cursor: 'pointer',
    },
    currencySelect: { padding: '0.5rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.12)', color: '#c4b5fd', fontSize: '0.82rem', fontWeight: 600, outline: 'none', cursor: 'pointer' },
    tableWrap: { overflowX: 'auto', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', backdropFilter: 'blur(12px)' },
    thead: { background: 'linear-gradient(90deg,rgba(124,58,237,0.4),rgba(236,72,153,0.25))' },
    th: { padding: '0.85rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap' },
    tr: { borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.15s' },
    td: { padding: '0.85rem 1rem', fontSize: '0.82rem', color: '#cbd5e1', verticalAlign: 'top' },
    valueBar: (score) => ({ height: '4px', borderRadius: '100px', width: `${Math.min(score || 0, 100)}%`, background: score >= 75 ? '#34d399' : score >= 40 ? '#fbbf24' : '#f87171', transition: 'width 0.4s' }),
    sentimentBadge: (s) => ({ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.2rem 0.55rem', borderRadius: '100px', background: s?.includes('Green') || s?.includes('Positive') ? 'rgba(52,211,153,0.15)' : s?.includes('Red') || s?.includes('Negative') ? 'rgba(248,113,113,0.15)' : 'rgba(255,255,255,0.08)', color: s?.includes('Green') || s?.includes('Positive') ? '#34d399' : s?.includes('Red') || s?.includes('Negative') ? '#f87171' : '#94a3b8', border: `1px solid ${s?.includes('Green') || s?.includes('Positive') ? 'rgba(52,211,153,0.3)' : s?.includes('Red') || s?.includes('Negative') ? 'rgba(248,113,113,0.3)' : 'rgba(255,255,255,0.1)'}` }),
    couponBadge: { fontSize: '0.62rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '6px', background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)', color: '#a78bfa', marginTop: '0.4rem', display: 'inline-block' },
    altBox: (color) => ({ marginTop: '0.5rem', padding: '0.5rem 0.65rem', borderRadius: '8px', fontSize: '0.7rem', background: `rgba(${color},0.08)`, border: `1px solid rgba(${color},0.2)`, maxWidth: '200px' }),
    actionLink: (c) => ({ display: 'flex', alignItems: 'center', gap: '4px', color: c, fontWeight: 600, fontSize: '0.78rem', marginBottom: '0.4rem', textDecoration: 'none', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }),
    shareBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', borderRadius: '8px', padding: '0.3rem 0.6rem', fontSize: '0.72rem', fontWeight: 600, textDecoration: 'none', marginBottom: '0.4rem', cursor: 'pointer' },
    alertForm: { marginTop: '0.5rem', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '8px', padding: '0.5rem' },
    alertLabel: { fontSize: '0.62rem', fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.3rem' },
    alertInput: { padding: '0.3rem 0.5rem', borderRadius: '6px 0 0 6px', border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(255,255,255,0.05)', color: '#f1f5f9', fontSize: '0.68rem', outline: 'none', flex: 1, minWidth: 0 },
    alertBtn: { padding: '0.3rem 0.6rem', borderRadius: '0 6px 6px 0', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.72rem' },
    emptyMsg: { padding: '2.5rem', textAlign: 'center', color: '#475569', fontSize: '0.88rem' },
    chartRow: { background: 'rgba(124,58,237,0.04)', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    chartInner: { maxWidth: '900px', margin: '0 auto', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem', position: 'relative' },
    stateBox: { textAlign: 'center', padding: '5rem 1rem', fontSize: '1rem', color: '#94a3b8' },
  };

  if (loading) return (
    <div style={s.outer}>
      <div style={s.stateBox}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📦</div>
        <div style={{ fontWeight: 700, color: '#c4b5fd' }}>Loading Products...</div>
      </div>
    </div>
  );

  if (error) return (
    <div style={s.outer}>
      <div style={s.stateBox}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
        <div style={{ fontWeight: 700, color: '#f87171' }}>{error}</div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');
        @keyframes floatOrb { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .gc-info-card:hover { border-color: rgba(124,58,237,0.35) !important; background: rgba(124,58,237,0.06) !important; transform: translateY(-2px); }
        .gc-tr:hover { background: rgba(255,255,255,0.03) !important; }
        .gc-rec-btn:hover { filter: brightness(1.15); transform: translateY(-1px); }
        .gc-filter-input:focus { border-color: #7c3aed !important; box-shadow: 0 0 0 3px rgba(124,58,237,0.15); }
        .gc-action-link:hover { opacity: 0.8; }
        .gc-sort-select:hover { border-color: rgba(124,58,237,0.6) !important; }
      `}</style>

      <div style={s.outer}>
        <div style={s.pageHeader}>
          <h1 style={s.pageTitle}>📦 Scraped Products</h1>
          <p style={s.pageSubtitle}>All products fetched from various marketplaces</p>
        </div>

        <div style={s.container}>
          <div style={s.infoGrid}>
            {[
              { icon: '📦', title: `Total Products (${data.products.length})`, desc: 'All scraped products from various platforms.' },
              { icon: '💡', title: 'Quick Insights', desc: 'Check cheapest & expensive items for smarter picks.' },
              { icon: '⬇️', title: 'Export Data', desc: 'Download all product details as CSV.' },
            ].map((c, i) => (
              <div key={i} className="gc-info-card" style={s.infoCard}>
                <div style={s.infoIcon}>{c.icon}</div>
                <div style={s.infoTitle}>{c.title}</div>
                <div style={s.infoDesc}>{c.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ ...s.sectionHeading, marginBottom: '0.75rem' }}>💰 Price Highlights</div>
          <div style={s.highlightsGrid}>
            <div style={s.highlightCard}>
              <div style={s.hlTitle}>💰 Top 5 Cheapest</div>
              {data.cheapest?.map((row, i) => (
                <div key={i} style={s.hlItem}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{row.Title}</span>
                  <span style={{ color: '#34d399', fontWeight: 700, flexShrink: 0 }}>{formatPrice(row.Price)}</span>
                  <span style={{ color: '#475569', fontSize: '0.7rem', flexShrink: 0 }}>{row.Source}</span>
                </div>
              ))}
            </div>
            <div style={s.highlightCard}>
              <div style={s.hlTitle}>💎 Top 5 Most Expensive</div>
              {data.expensive?.map((row, i) => (
                <div key={i} style={s.hlItem}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{row.Title}</span>
                  <span style={{ color: '#f87171', fontWeight: 700, flexShrink: 0 }}>{formatPrice(row.Price)}</span>
                  <span style={{ color: '#475569', fontSize: '0.7rem', flexShrink: 0 }}>{row.Source}</span>
                </div>
              ))}
            </div>
          </div>

          {data.top_recs?.length > 0 && (
            <>
              <div style={{ ...s.sectionHeading, marginBottom: '0.75rem' }}>🏆 Smart Recommendations</div>
              <div style={s.recsGrid}>
                {data.top_recs.map((rec, i) => (
                  <div key={i} style={s.recCard}>
                    <span style={s.recBadge}>⭐ Best Value</span>
                    <div style={s.recTitle} title={rec.Title}>{rec.Title}</div>
                    <div style={s.recPrice}>{formatPrice(rec.Price)}</div>
                    <div style={s.recMeta}>Rating: {rec.Rating ?? 'N/A'} · {rec.Source}</div>
                    <a href={rec.Link} target="_blank" rel="noreferrer" className="gc-rec-btn" style={s.recBtn}>View Deal →</a>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* TOOLBAR with Sort Options */}
          <div style={s.toolbar}>
            <input
              className="gc-filter-input"
              style={s.filterInput}
              type="text"
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
              placeholder="🔍 Filter by title..."
            />
            
            {/* Sort Dropdown */}
            <select 
              className="gc-sort-select" 
              style={s.sortSelect} 
              value={sortOption} 
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="default">📋 Default Sort</option>
              <option value="price_asc">💰 Price: Low to High</option>
              <option value="price_desc">💰 Price: High to Low</option>
              <option value="rating_asc">⭐ Rating: Low to High</option>
              <option value="rating_desc">⭐ Rating: High to Low</option>
            </select>

            {/* Currency Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Currency</span>
              <select style={s.currencySelect} value={currencyMultiplier} onChange={handleCurrencyChange}>
                <option value={1} data-symbol="₹">INR ₹</option>
                <option value={0.012} data-symbol="$">USD $</option>
                <option value={0.011} data-symbol="€">EUR €</option>
                <option value={0.0095} data-symbol="£">GBP £</option>
              </select>
            </div>
          </div>

          {/* Show active sort indicator */}
          {sortOption !== 'default' && (
            <div style={{ 
              textAlign: 'right', 
              marginBottom: '0.5rem', 
              fontSize: '0.7rem', 
              color: '#a78bfa' 
            }}>
              Sorted by: {
                sortOption === 'price_asc' ? 'Price (Low to High)' :
                sortOption === 'price_desc' ? 'Price (High to Low)' :
                sortOption === 'rating_asc' ? 'Rating (Low to High)' :
                sortOption === 'rating_desc' ? 'Rating (High to Low)' : 'Default'
              }
            </div>
          )}

          {/* TABLE */}
          <div style={s.tableWrap}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={s.thead}>
                <tr>
                  {['Source', 'Title', 'Value & Sentiment', 'Price', 'Rating', 'Actions'].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map((row, index) => (
                  <React.Fragment key={index}>
                    <tr className="gc-tr" style={s.tr}>
                      <td style={s.td}>
                        <span style={{ fontWeight: 700, color: getSourceColor(row.Source), fontSize: '0.82rem' }}>{row.Source}</span>
                      </td>
                      <td style={{ ...s.td, maxWidth: '220px' }}>
                        <div style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }} title={row.Title}>{row.Title}</div>
                      </td>
                      <td style={{ ...s.td, minWidth: '180px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0' }}>{row.ValueScore?.toFixed(0) || 0}</span>
                          <div style={{ flex: 1, height: '4px', borderRadius: '100px', background: 'rgba(255,255,255,0.08)' }}>
                            <div style={s.valueBar(row.ValueScore)} />
                          </div>
                        </div>
                        {row.Sentiment && <span style={s.sentimentBadge(row.Sentiment)}>{row.Sentiment}</span>}
                        {row.ValueScore >= 75 && (
                          <div style={s.couponBadge}>✂️ SAVE20 Applied</div>
                        )}
                      </td>
                      <td style={s.td}>
                        <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#34d399' }}>{formatPrice(row.Price)}</div>
                        {row.BetterAlternative && (
                          <div style={s.altBox('52,211,153')}>
                            <div style={{ fontWeight: 700, color: '#34d399', marginBottom: '0.2rem', fontSize: '0.68rem' }}>👉 Better Deal</div>
                            <a href={row.BetterAlternative.link} target="_blank" rel="noreferrer" style={{ color: '#6ee7b7', fontSize: '0.68rem', textDecoration: 'none' }}>
                              Save <strong>{formatPrice(row.BetterAlternative.savings)}</strong> on similar spec!
                            </a>
                          </div>
                        )}
                        {row.SimilarProducts?.length > 0 && (
                          <div style={s.altBox('59,130,246')}>
                            <div style={{ fontWeight: 700, color: '#60a5fa', marginBottom: '0.2rem', fontSize: '0.68rem' }}>🔗 Similar</div>
                            {row.SimilarProducts.map((sim, i) => (
                              <div key={i} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                <a href={sim.Link} target="_blank" rel="noreferrer" style={{ color: '#93c5fd', fontSize: '0.68rem', textDecoration: 'none' }}>
                                  {formatPrice(sim.Price)} ({sim.Source})
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td style={{ ...s.td, fontWeight: 700, color: '#fbbf24' }}>⭐ {row.Rating ?? 'N/A'}</td>
                      <td style={{ ...s.td, minWidth: '150px' }}>
                        <a href={row.Link} target="_blank" rel="noreferrer" className="gc-action-link" style={s.actionLink('#60a5fa')}>🛒 View Deal</a>
                        <Link to={`/compare?link=${encodeURIComponent(row.Link)}`} className="gc-action-link" style={s.actionLink('#a78bfa')}>⚖️ Compare</Link>
                        <button onClick={() => toggleChart(index)} className="gc-action-link" style={s.actionLink('#c084fc')}>📈 Price Graph</button>
                        <a
                          href={`https://api.whatsapp.com/send?text=Look%20at%20this%20deal!%20${encodeURIComponent(row.Title)}%20-%20${encodeURIComponent(row.Link)}`}
                          target="_blank" rel="noreferrer" style={s.shareBtn}
                        >📱 Share</a>
                        <form onSubmit={(e) => handleAlertSubmit(e, row.Link, row.Title, row.Price)} style={s.alertForm}>
                          <span style={s.alertLabel}>🔔 Drop Alert</span>
                          <div style={{ display: 'flex' }}>
                            <input type="email" name="email" placeholder="Email..." style={s.alertInput} required />
                            <button type="submit" style={s.alertBtn}>🔔</button>
                          </div>
                        </form>
                      </td>
                    </tr>
                    {openCharts[index] && (
                      <tr style={s.chartRow}>
                        <td colSpan="6" style={{ padding: '1.25rem' }}>
                          <div style={s.chartInner}>
                            <button onClick={() => toggleChart(index)} style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8', borderRadius: '8px', padding: '0.2rem 0.6rem', cursor: 'pointer', fontSize: '0.75rem' }}>✕ Close</button>
                            <div style={{ textAlign: 'center', fontWeight: 700, color: '#c4b5fd', marginBottom: '0.75rem', fontSize: '0.88rem' }}>📈 Price History Tracking</div>
                            <PriceHistoryChart title={row.Title} onClose={() => toggleChart(index)} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            {sortedProducts.length === 0 && (
              <div style={s.emptyMsg}>No products match your filter.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;