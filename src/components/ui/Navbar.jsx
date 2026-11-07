import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Menu, X, Video, Sparkles } from 'lucide-react';

const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: 'rgba(9, 10, 15, 0.8)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border-color)',
    transition: 'all 0.3s ease',
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    color: 'var(--text-primary)',
    fontWeight: 800,
    fontSize: '17px',
    letterSpacing: '-0.02em',
  },
  logoBadge: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #E11D48, #BE123C)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFF',
    boxShadow: '0 4px 12px rgba(225, 29, 72, 0.35)',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    listStyle: 'none',
  },
  navLink: {
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
    border: 'none',
    background: 'none',
  },
  navLinkActive: {
    color: 'var(--text-primary)',
    background: 'rgba(255, 255, 255, 0.06)',
    fontWeight: 600,
  },
  videoBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    padding: '7px 16px',
    borderRadius: '8px',
    background: 'rgba(225, 29, 72, 0.12)',
    border: '1px solid rgba(225, 29, 72, 0.35)',
    color: '#FB7185',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginLeft: '8px',
  },
  mobileMenuBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    padding: '8px',
  },
  mobileMenu: {
    position: 'fixed',
    top: '64px',
    left: 0,
    right: 0,
    background: 'rgba(9, 10, 15, 0.98)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border-color)',
    padding: '16px',
    zIndex: 999,
  },
  mobileLink: {
    display: 'block',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    width: '100%',
    textAlign: 'left',
    transition: 'all 0.2s',
  },
};

export default function Navbar({ sections, activeSection, onOpenVideos }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <>
      <nav style={{
        ...styles.nav,
        boxShadow: scrolled ? '0 10px 30px rgba(0, 0, 0, 0.5)' : 'none',
        borderBottomColor: scrolled ? 'var(--border-color-hover)' : 'var(--border-color)',
      }}>
        <div style={styles.container}>
          <a href="#hero" style={styles.logo} onClick={(e) => { e.preventDefault(); scrollTo('hero'); }}>
            <div style={styles.logoBadge}>
              <Database size={17} />
            </div>
            <span>
              Redis<span style={{ color: '#FB7185' }}>Flow</span>
            </span>
            <span style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '2px 7px',
              borderRadius: '4px',
              background: 'rgba(255, 255, 255, 0.06)',
              color: 'var(--text-muted)',
              fontWeight: 600,
            }}>
              Interactive
            </span>
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ul style={styles.navLinks}>
              {sections.slice(1).map(({ id, label }) => (
                <li key={id}>
                  <button
                    style={{
                      ...styles.navLink,
                      ...(activeSection === id ? styles.navLinkActive : {}),
                    }}
                    onClick={() => scrollTo(id)}
                    onMouseEnter={(e) => {
                      if (activeSection !== id) e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={(e) => {
                      if (activeSection !== id) e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>

            <button
              style={styles.videoBtn}
              onClick={onOpenVideos}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(225, 29, 72, 0.22)';
                e.currentTarget.style.borderColor = 'rgba(225, 29, 72, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(225, 29, 72, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(225, 29, 72, 0.35)';
              }}
            >
              <Video size={14} />
              <span>Video Hub</span>
            </button>
          </div>

          <button
            style={styles.mobileMenuBtn}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={styles.mobileMenu}
        >
          <button
            style={{ ...styles.videoBtn, width: '100%', marginBottom: '12px', justifyContent: 'center', padding: '12px' }}
            onClick={() => {
              setMobileOpen(false);
              onOpenVideos();
            }}
          >
            <Video size={16} />
            <span>Open Video Hub</span>
          </button>

          {sections.map(({ id, label, time }) => (
            <button
              key={id}
              style={{
                ...styles.mobileLink,
                ...(activeSection === id ? { color: '#FB7185', background: 'rgba(225,29,72,0.1)' } : {}),
              }}
              onClick={() => scrollTo(id)}
            >
              {label} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>({time})</span>
            </button>
          ))}
        </motion.div>
      )}
    </>
  );
}
