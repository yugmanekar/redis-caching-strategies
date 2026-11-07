import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Menu, X, Video } from 'lucide-react';

const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: 'rgba(15, 15, 26, 0.85)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border-color)',
    transition: 'transform 0.3s ease',
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '60px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    color: 'var(--text-primary)',
    fontWeight: 700,
    fontSize: '18px',
  },
  redisIcon: {
    color: '#DC382D',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    listStyle: 'none',
  },
  navLink: {
    padding: '6px 10px',
    borderRadius: '6px',
    fontSize: '12.5px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
    border: 'none',
    background: 'none',
  },
  navLinkActive: {
    color: '#DC382D',
    background: 'rgba(220, 56, 45, 0.1)',
  },
  videoBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #DC382D, #c0392b)',
    color: 'white',
    fontSize: '13px',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(220, 56, 45, 0.3)',
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
    top: '60px',
    left: 0,
    right: 0,
    background: 'rgba(15, 15, 26, 0.95)',
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
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
      }}>
        <div style={styles.container}>
          <a href="#hero" style={styles.logo} onClick={(e) => { e.preventDefault(); scrollTo('hero'); }}>
            <Database size={22} style={styles.redisIcon} />
            <span>Redis<span style={{ color: '#DC382D' }}>Cache</span></span>
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
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>

            <button style={styles.videoBtn} onClick={onOpenVideos}>
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
                ...(activeSection === id ? { color: '#DC382D', background: 'rgba(220,56,45,0.1)' } : {}),
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
