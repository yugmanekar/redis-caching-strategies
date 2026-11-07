import { motion } from 'framer-motion';
import { Database, Zap, BookOpen, Clock, ChevronDown, Video, ArrowRight } from 'lucide-react';

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
    width: '700px',
    height: '700px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(217, 45, 32, 0.05) 0%, transparent 70%)',
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
    background: 'radial-gradient(circle, rgba(68, 76, 231, 0.04) 0%, transparent 70%)',
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
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    color: '#334155',
    fontSize: '13px',
    fontWeight: 600,
    marginBottom: '28px',
    boxShadow: 'var(--shadow-subtle)',
  },
  pillDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#D92D20',
  },
  title: {
    fontSize: 'clamp(40px, 6.5vw, 74px)',
    fontWeight: 800,
    lineHeight: 1.1,
    textAlign: 'center',
    marginBottom: '24px',
    letterSpacing: '-0.03em',
    color: 'var(--text-primary)',
  },
  subtitle: {
    fontSize: 'clamp(16px, 1.8vw, 19px)',
    color: 'var(--text-secondary)',
    textAlign: 'center',
    maxWidth: '680px',
    lineHeight: 1.65,
    marginBottom: '40px',
    fontWeight: 400,
  },
  statsRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: '44px',
  },
  statBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '10px',
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    boxShadow: 'var(--shadow-subtle)',
    fontSize: '13px',
    fontWeight: 600,
    color: '#334155',
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
    background: 'linear-gradient(180deg, #D92D20 0%, #B42318 100%)',
    color: '#FFF',
    fontSize: '15px',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 14px rgba(217, 45, 32, 0.3)',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  secondaryBtn: {
    padding: '14px 26px',
    borderRadius: '10px',
    background: '#FFFFFF',
    border: '1px solid #CBD5E1',
    color: '#0F172A',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: 'var(--shadow-subtle)',
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
    fontWeight: 600,
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        <div style={styles.pill}>
          <span style={styles.pillDot} />
          <span>Kalvium Skilling Course • 45 Min Interactive Artifact</span>
        </div>

        <h1 style={styles.title}>
          Mastering{' '}
          <span style={{
            background: 'linear-gradient(135deg, #D92D20 20%, #E11D48 80%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Redis Caching
          </span>
          <br />
          <span>Strategies</span>
        </h1>

        <p style={styles.subtitle}>
          A soothing, hands-on architectural journey through <strong>Cache-Aside</strong>, <strong>Write-Through</strong>,
          and <strong>Cache Invalidation</strong>. Explore interactive state machines, inspect live packet latencies, and master production distributed systems.
        </p>

        <div style={styles.statsRow}>
          <div style={styles.statBadge}>
            <BookOpen size={16} color="#D92D20" />
            <span>8 Modular Chapters</span>
          </div>
          <div style={styles.statBadge}>
            <Clock size={16} color="#B54708" />
            <span>45 Minutes Pace</span>
          </div>
          <div style={styles.statBadge}>
            <Zap size={16} color="#079455" />
            <span>3 Live Simulators + Lab</span>
          </div>
          <div style={styles.statBadge}>
            <Video size={16} color="#444CE7" />
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
            whileHover={{ scale: 1.02, y: -1, background: '#F8FAFC' }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenVideo}
          >
            <Video size={16} color="#D92D20" />
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
