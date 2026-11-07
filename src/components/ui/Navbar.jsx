import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Menu, X, Video } from 'lucide-react';

const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: 'rgba(255, 255, 255, 0.88)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid var(--border-color)',
    transition: 'all 0.25s ease',
  },
  container: {
    maxWidth: '1440px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '66px',
    gap: '12px',
  },
  brandWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
    cursor: 'pointer',
    flexShrink: 0,
  },
  logoBadge: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #D92D20, #B42318)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFF',
    boxShadow: '0 4px 10px rgba(217, 45, 32, 0.25)',
    flexShrink: 0,
  },
  brandTextGroup: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.15,
  },
  brandName: {
    fontSize: '17px',
    fontWeight: 800,
    color: 'var(--text-primary)',
    letterSpacing: '-0.025em',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  brandSub: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#D92D20',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    listStyle: 'none',
    margin: '0 auto',
    padding: '0 8px',
    overflowX: 'auto',
    maxWidth: '850px',
  },
  navLink: {
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
    border: 'none',
    background: 'none',
  },
  navLinkActive: {
    color: '#D92D20',
    background: '#FEF3F2',
    fontWeight: 600,
  },
  actionsGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexShrink: 0,
  },
  videoBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    padding: '7px 15px',
    borderRadius: '8px',
    background: '#FEF3F2',
    border: '1px solid #FECDCA',
    color: '#D92D20',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
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
    top: '66px',
    left: 0,
    right: 0,
    background: '#FFFFFF',
    borderBottom: '1px solid var(--border-color)',
    padding: '16px 20px',
    zIndex: 999,
    maxHeight: 'calc(100vh - 66px)',
    overflowY: 'auto',
    boxShadow: 'var(--shadow-card)',
  },
  mobileLink: {
    display: 'block',
    padding: '12px 14px',
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
        boxShadow: scrolled ? '0 4px 20px -2px rgba(15, 23, 42, 0.08)' : 'none',
        background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.88)',
      }}>
        <div style={styles.container}>
          {/* Brand Name + Logo with "by Kalvium" */}
          <div
            style={styles.brandWrapper}
            onClick={() => scrollTo('hero')}
          >
            <div style={styles.logoBadge}>
              <Database size={19} />
            </div>
            <div style={styles.brandTextGroup}>
              <span style={styles.brandName}>
                Cache<span style={{ color: '#D92D20' }}>Craft</span>
              </span>
              <span style={styles.brandSub}>
                by Kalvium
              </span>
            </div>
          </div>

          {/* Desktop Links */}
          <div className="nav-desktop-container" style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            <ul style={styles.navLinks} className="hide-on-compact">
              {sections.slice(1).map(({ id, label }) => (
                <li key={id}>
                  <button
                    style={{
                      ...styles.navLink,
                      ...(activeSection === id ? styles.navLinkActive : {}),
                    }}
                    onClick={() => scrollTo(id)}
                    onMouseEnter={(e) => {
                      if (activeSection !== id) e.currentTarget.style.background = '#F1F5F9';
                    }}
                    onMouseLeave={(e) => {
                      if (activeSection !== id) e.currentTarget.style.background = 'none';
                    }}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Group */}
          <div style={styles.actionsGroup}>
            <button
              style={styles.videoBtn}
              onClick={onOpenVideos}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FEE4E2';
                e.currentTarget.style.borderColor = '#FDA29B';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FEF3F2';
                e.currentTarget.style.borderColor = '#FECDCA';
              }}
            >
              <Video size={14} />
              <span>Video Hub</span>
            </button>

            <button
              className="mobile-toggle-btn"
              style={styles.mobileMenuBtn}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={styles.mobileMenu}
          >
            <div style={{ marginBottom: '12px', padding: '0 8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                Course Modules
              </span>
            </div>

            {sections.map(({ id, label, time }) => (
              <button
                key={id}
                style={{
                  ...styles.mobileLink,
                  ...(activeSection === id ? { color: '#D92D20', background: '#FEF3F2', fontWeight: 600 } : {}),
                }}
                onClick={() => scrollTo(id)}
              >
                {label} <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>({time})</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
