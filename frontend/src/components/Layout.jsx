import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const s = {
    outer: {
      background: 'linear-gradient(180deg,#0f0c29 0%,#0a0a18 100%)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Inter',sans-serif",
    },
    nav: {
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(10,10,24,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(124,58,237,0.2)',
      padding: '0 1.5rem',
      display: 'flex', alignItems: 'center',
      height: '64px', gap: '1rem',
    },
    logoBadge: {
      width: '36px', height: '36px', borderRadius: '10px',
      background: 'linear-gradient(135deg,#7c3aed,#ec4899)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '17px', flexShrink: 0,
      boxShadow: '0 0 14px #7c3aedaa',
    },
    brandName: {
      fontSize: '1.2rem', fontWeight: 900,
      background: 'linear-gradient(90deg,#a78bfa,#f472b6,#38bdf8)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
    },
    navLinks: { display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: 'auto' },
    navLink: (active) => ({
      padding: '0.4rem 0.9rem', borderRadius: '8px',
      fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none',
      transition: 'all 0.2s',
      background: active ? 'rgba(124,58,237,0.18)' : 'transparent',
      color: active ? '#c4b5fd' : '#64748b',
      border: active ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
    }),
    content: { flex: 1 },
    footer: {
      background: 'rgba(255,255,255,0.02)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '1.25rem',
      textAlign: 'center',
      fontSize: '0.75rem',
      color: '#334155',
    },
    footerHeart: { color: '#ec4899' },
    footerBrand: {
      background: 'linear-gradient(90deg,#a78bfa,#f472b6)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      fontWeight: 700,
    },
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');
        .gc-nav-link:hover { background: rgba(255,255,255,0.06) !important; color: #e2e8f0 !important; border-color: rgba(255,255,255,0.1) !important; }
      `}</style>
      <div style={s.outer}>
        <nav style={s.nav}>
          <div style={s.logoBadge}>🛒</div>
          <span style={s.brandName}>GeniusCart</span>
          <div style={s.navLinks}>
            {[['/', 'Home'], ['/products', 'Products'], ['/visuals', 'Visuals']].map(([path, label]) => (
              <Link key={path} to={path} className="gc-nav-link" style={s.navLink(isActive(path))}>{label}</Link>
            ))}
          </div>
        </nav>
        <div style={s.content}>{children}</div>
        <footer style={s.footer}>
          © 2026 <span style={s.footerBrand}>GeniusCart</span>. Built with <span style={s.footerHeart}>♥</span> for smarter shopping.
        </footer>
      </div>
    </>
  );
};

export default Layout;