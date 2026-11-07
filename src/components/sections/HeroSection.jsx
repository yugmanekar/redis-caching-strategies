import { motion } from 'framer-motion';
import { Database, Zap, BookOpen, Clock, ChevronDown, Video, ArrowRight, ShieldCheck } from 'lucide-react';

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '130px 24px 80px',
    position: 'relative',
    overflow: 'hidden',
  },
  glowSpot1: {
    position: 'absolute',
    width: '650px',
    height: '650px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(225, 29, 72, 0.12) 0%, transparent 70%)',
    top: '-15%',
    left: '50%',
    transform: 'translateX(-50%)',
    pointerEvents: 'none',
  },
  glowSpot2: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
    bottom: '-10%',
    right: '5%',
    pointerEvents: 'none',
  },
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 16px',
    borderRadius: '100px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'var(--text-secondary)',
    fontSize: '13px',
    fontWeight: 500,
    marginBottom: '28px',
    backdropFilter: 'blur(10px)',
  },
  pillDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#E11D48',
    boxShadow: '0 0 8px #E11D48',
  },
  title: {
    fontSize: 'clamp(40px, 6.5vw, 76px)',
    fontWeight: 800,
    lineHeight: 1.08,
    textAlign: 'center',
    marginBottom: '24px',
    letterSpacing: '-0.035em',
  },
  subtitle: {
    fontSize: 'clamp(16px, 1.8vw, 19px)',
    color: 'var(--text-secondary)',
    textAlign: 'center',
    maxWidth: '680px',
    lineHeight: 1.65,
    marginBottom: '44px',
    fontWeight: 400,
  },
  statsRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: '48px',
  },
  statBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    padding: '8px 16px',
    borderRadius: '10px',
    background: 'rgba(20, 23, 33, 0.8)',
    border: '1px solid var(--border-color)',
    backdropFilter: 'blur(8px)',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
  },
  btnGroup: {
    display: 'flex',
    gap: '14px',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    padding: '14px 32px',
    borderRadius: '10px',
    background: 'linear-gradient(180deg, #E11D48 0%, #BE123C 100%)',
    color: '#FFF',
    fontSize: '15px',
    fontWeight: 600,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 20px -2px rgba(225, 29, 72, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  secondaryBtn: {
    padding: '14px 26px',
    borderRadius: '10px',
    background: 'rgba(20, 23, 33, 0.75)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    fontSize: '15px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  scrollDown: {
    position: 'absolute',
    bottom: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--text-dim)',
    fontSize: '12px',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
};

export default function HeroSection({ onComplete, onOpenVideo }) {
  const scrollToNext = () => {
    document.getElementById('intro')?.scrollIntoView({ behavior: 'smooth' });
    onComplete?.();
  };

  return (
    <div style={styles.container}>
      <div style={styles.glowSpot1} />
      <div style={styles.glowSpot2} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        <div style={styles.pill}>
          <span style={styles.pillDot} />
          <span>Kalvium Skilling Course • 45 Min Interactive Artifact</span>
        </div>

        <h1 style={styles.title}>
          Mastering{' '}
          <span style={{
            background: 'linear-gradient(135deg, #FFF 20%, #FB7185 80%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Redis Caching
          </span>
          <br />
          <span style={{ color: 'var(--text-secondary)' }}>at Scale</span>
        </h1>

        <p style={styles.subtitle}>
          A guided, hands-on architectural journey through <strong>Cache-Aside</strong>, <strong>Write-Through</strong>,
          and <strong>Cache Invalidation</strong>. Explore interactive state machines, inspect live packet latencies, and master production distributed systems.
        </p>

        <div style={styles.statsRow}>
          <div style={styles.statBadge}>
            <BookOpen size={15} color="#FB7185" />
            <span>8 Modular Chapters</span>
          </div>
          <div style={styles.statBadge}>
            <Clock size={15} color="#F59E0B" />
            <span>45 Minutes Pace</span>
          </div>
          <div style={styles.statBadge}>
            <Zap size={15} color="#10B981" />
            <span>3 Live Simulators + Lab</span>
          </div>
          <div style={styles.statBadge}>
            <Video size={15} color="#6366F1" />
            <span>Video Hub Included</span>
          </div>
        </div>

        <div style={styles.btnGroup}>
          <motion.button
            style={styles.primaryBtn}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={scrollToNext}
          >
            <span>Start Learning</span>
            <ArrowRight size={16} />
          </motion.button>

          <motion.button
            style={styles.secondaryBtn}
            whileHover={{ scale: 1.02, y: -1, borderColor: 'var(--border-color-hover)' }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenVideo}
          >
            <Video size={16} color="#FB7185" />
            <span>Watch Video Primer</span>
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        style={styles.scrollDown}
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
      >
        <span>Explore Curriculum</span>
        <ChevronDown size={14} />
      </motion.div>
    </div>
  );
}
