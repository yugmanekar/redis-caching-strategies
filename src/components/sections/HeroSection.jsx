import { motion } from 'framer-motion';
import { Database, Zap, BookOpen, Clock, ChevronDown, Video } from 'lucide-react';

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '120px 24px 80px',
    position: 'relative',
    overflow: 'hidden',
  },
  bgGlow: {
    position: 'absolute',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    filter: 'blur(150px)',
    opacity: 0.15,
    pointerEvents: 'none',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 20px',
    borderRadius: '50px',
    background: 'rgba(220, 56, 45, 0.1)',
    border: '1px solid rgba(220, 56, 45, 0.3)',
    color: '#FF6B6B',
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '24px',
  },
  title: {
    fontSize: 'clamp(36px, 6vw, 72px)',
    fontWeight: 900,
    lineHeight: 1.1,
    textAlign: 'center',
    marginBottom: '24px',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: 'clamp(16px, 2vw, 20px)',
    color: 'var(--text-secondary)',
    textAlign: 'center',
    maxWidth: '700px',
    lineHeight: 1.7,
    marginBottom: '40px',
  },
  stats: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: '40px',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 20px',
    borderRadius: '12px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
  },
  statIcon: {
    color: '#DC382D',
  },
  statText: {
    fontSize: '14px',
    fontWeight: 500,
  },
  btnGroup: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  startBtn: {
    padding: '16px 36px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #DC382D, #c0392b)',
    color: 'white',
    fontSize: '17px',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.3s',
    boxShadow: '0 4px 15px rgba(220, 56, 45, 0.4)',
  },
  videoBtn: {
    padding: '16px 32px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.3s',
  },
  scrollIndicator: {
    position: 'absolute',
    bottom: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-muted)',
    fontSize: '13px',
  },
};

export default function HeroSection({ onComplete, onOpenVideo }) {
  const scrollToNext = () => {
    document.getElementById('intro')?.scrollIntoView({ behavior: 'smooth' });
    onComplete?.();
  };

  return (
    <div style={styles.container}>
      {/* Background glows */}
      <div style={{ ...styles.bgGlow, background: '#DC382D', top: '-200px', right: '-200px' }} />
      <div style={{ ...styles.bgGlow, background: '#336791', bottom: '-200px', left: '-200px' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          style={styles.badge}
        >
          <Zap size={16} />
          Interactive Learning Experience • 45 Minutes
        </motion.div>

        <h1 style={styles.title}>
          <span style={{ color: 'var(--text-primary)' }}>Redis </span>
          <span style={{
            background: 'linear-gradient(135deg, #DC382D, #FF6B6B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Caching
          </span>
          <br />
          <span style={{ color: 'var(--text-primary)' }}>Strategies</span>
        </h1>

        <p style={styles.subtitle}>
          Master <strong>Cache-Aside</strong>, <strong>Write-Through</strong>, and{' '}
          <strong>Cache Invalidation</strong> patterns through live animations, interactive
          simulators, embedded video walkthroughs, and hands-on coding labs.
        </p>

        <div style={styles.stats}>
          <div style={styles.stat}>
            <BookOpen size={18} style={styles.statIcon} />
            <span style={styles.statText}>9 Interactive Modules</span>
          </div>
          <div style={styles.stat}>
            <Clock size={18} style={styles.statIcon} />
            <span style={styles.statText}>~45 min Duration</span>
          </div>
          <div style={styles.stat}>
            <Video size={18} style={styles.statIcon} />
            <span style={styles.statText}>Embedded Video Hub</span>
          </div>
        </div>

        <div style={styles.btnGroup}>
          <motion.button
            style={styles.startBtn}
            whileHover={{ scale: 1.05, boxShadow: '0 6px 25px rgba(220, 56, 45, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToNext}
          >
            Start Course
            <ChevronDown size={20} />
          </motion.button>

          <motion.button
            style={styles.videoBtn}
            whileHover={{ scale: 1.03, background: 'rgba(255, 255, 255, 0.1)' }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenVideo}
          >
            <Video size={18} color="#FF6B6B" />
            Watch Video Walkthrough
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        style={styles.scrollIndicator}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span>Scroll to explore modules</span>
        <ChevronDown size={18} />
      </motion.div>
    </div>
  );
}
