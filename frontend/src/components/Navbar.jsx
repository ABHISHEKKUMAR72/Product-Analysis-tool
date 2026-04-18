import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  const handleLogoClick = () => {
    navigate('/');
    window.location.reload();
  };

  const s = {
    nav: {
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(10,10,24,0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(124,58,237,0.2)',
      padding: '0 1.5rem',
      display: 'flex', alignItems: 'center',
      height: '64px', gap: '1rem',
      fontFamily: "'Inter',sans-serif",
    },
    orbLeft: {
      position: 'absolute', width: '200px', height: '60px',
      background: '#7c3aed', filter: 'blur(50px)', opacity: 0.15,
      top: 0, left: 0, pointerEvents: 'none', borderRadius: '50%',
    },
    orbRight: {
      position: 'absolute', width: '160px', height: '60px',
      background: '#ec4899', filter: 'blur(50px)', opacity: 0.12,
      top: 0, right: 0, pointerEvents: 'none', borderRadius: '50%',
    },
    logoBadge: {
      width: '38px', height: '38px', borderRadius: '11px',
      background: 'linear-gradient(135deg,#7c3aed,#ec4899)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '18px', flexShrink: 0,
      boxShadow: '0 0 18px #7c3aedaa',
      position: 'relative', zIndex: 1,
      transition: 'transform 0.2s',
    },
    brandName: {
      fontSize: '1.25rem', fontWeight: 900,
      background: 'linear-gradient(90deg,#a78bfa,#f472b6,#38bdf8)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      position: 'relative', zIndex: 1,
    },
    links: {
      display: 'flex', alignItems: 'center', gap: '0.25rem',
      marginLeft: 'auto', position: 'relative', zIndex: 1,
    },
    link: (active) => ({
      padding: '0.4rem 1rem', borderRadius: '9px',
      fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none',
      transition: 'all 0.2s',
      background: active ? 'rgba(124,58,237,0.2)' : 'transparent',
      color: active ? '#c4b5fd' : '#64748b',
      border: active ? '1px solid rgba(124,58,237,0.35)' : '1px solid transparent',
    }),
    extBtn: {
      display: 'flex', alignItems: 'center', gap: '0.4rem',
      padding: '0.4rem 1rem', borderRadius: '9px',
      background: 'linear-gradient(135deg,#7c3aed,#ec4899)',
      color: '#fff', fontSize: '0.78rem', fontWeight: 700,
      border: 'none', cursor: 'pointer',
      boxShadow: '0 4px 14px #7c3aed44',
      transition: 'all 0.2s',
      position: 'relative', zIndex: 1,
    },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');
        .gc-link:hover { background: rgba(255,255,255,0.06) !important; color: #e2e8f0 !important; border-color: rgba(255,255,255,0.1) !important; }
        .gc-logo-badge:hover { transform: scale(1.1); }
        .gc-ext-btn:hover { filter: brightness(1.15); transform: translateY(-1px); box-shadow: 0 6px 20px #7c3aed66 !important; }
      `}</style>

      <nav style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={s.nav}>
          <div style={s.orbLeft} />
          <div style={s.orbRight} />

          <div 
            onClick={handleLogoClick}
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', position: 'relative', zIndex: 1, cursor: 'pointer' }}
          >
            <div className="gc-logo-badge" style={s.logoBadge}>🛒</div>
            <span style={s.brandName}>GeniusCart</span>
          </div>

          <div style={s.links}>
            {[['/', 'Home'], ['/products', 'Products'], ['/visuals', 'Analytics']].map(([path, label]) => (
              <Link key={path} to={path} className="gc-link" style={s.link(isActive(path))}>{label}</Link>
            ))}
            <button className="gc-ext-btn" style={s.extBtn}>
              🔍 Extension
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;