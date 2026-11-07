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
    background: 'rgba(9, 10, 15, 0.9)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border-color)',
    transition: 'all 0.3s ease',
  },
  container: {
    maxWidth: '1440px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '68px',
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
    background: 'linear-gradient(135deg, #E11D48, #9F1239)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFF',
    boxShadow: '0 4px 14px rgba(225, 29, 72, 0.4)',
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
    fontSize: '10.5px',
    fontWeight: 600,
    color: '#FB7185',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    listStyle: 'none',
    margin: '0 auto',
    padding: '0 8px',
    overflowX: 'auto',
    maxWidth: '850px',
  },
  navLink: {
    padding: '6px 10px',
    borderRadius: '6px',
    fontSize: '12.5px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
    border: 'none',
    background: 'none',
  },
  navLinkActive: {
    color: '#FFF',
    background: 'rgba(255, 255, 255, 0.08)',
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
    padding: '7px 14px',
    borderRadius: '8px',
    background: 'rgba(225, 29, 72, 0.14)',
    border: '1px solid rgba(225, 29, 72, 0.4)',
    color: '#FB7185',
    fontSize: '12.5px',
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
    top: '68px',
    left: 0,
    right: 0,
    background: 'rgba(9, 10, 15, 0.98)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border-color)',
    padding: '16px 20px',
    zIndex: 999,
    maxHeight: 'calc(100vh - 68px)',
    overflowY: 'auto',
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
        boxShadow: scrolled ? '0 10px 30px rgba(0, 0, 0, 0.6)' : 'none',
      }}>
        <div style={styles.container}>
          {/* Brand Name + Logo with "by Kalvium" sub-label */}
          <div
            style={styles.brandWrapper}
            onClick={() => scrollTo('hero')}
          >
            <div style={styles.logoBadge}>
              <Database size={19} />
            </div>
            <div style={styles.brandTextGroup}>
              <span style={styles.brandName}>
                Cache<span style={{ color: '#FB7185' }}>Craft</span>
              </span>
              <span style={styles.brandSub}>
                by Kalvium
              </span>
            </div>
          </div>

          {/* Desktop Links (Responsive hide under 1150px) */}
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
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Group: Video Hub & Mobile Toggle */}
          <div style={styles.actionsGroup}>
            <button
              style={styles.videoBtn}
              onClick={onOpenVideos}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(225, 29, 72, 0.25)';
                e.currentTarget.style.borderColor = '#FB7185';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(225, 29, 72, 0.14)';
                e.currentTarget.style.borderColor = 'rgba(225, 29, 72, 0.4)';
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
            <div style={{ marginBottom: '16px', padding: '0 8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Course Modules
              </span>
            </div>

            {sections.map(({ id, label, time }) => (
              <button
                key={id}
                style={{
                  ...styles.mobileLink,
                  ...(activeSection === id ? { color: '#FB7185', background: 'rgba(225,29,72,0.1)' } : {}),
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
