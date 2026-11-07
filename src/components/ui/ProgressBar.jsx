import { motion } from 'framer-motion';

export default function ProgressBar({ progress }) {
  return (
    <div style={{
      position: 'fixed',
      top: '60px',
      left: 0,
      right: 0,
      height: '3px',
      background: 'var(--bg-secondary)',
      zIndex: 999,
    }}>
      <motion.div
        style={{
          height: '100%',
          background: 'linear-gradient(90deg, #DC382D, #FF6B6B, #DC382D)',
          backgroundSize: '200% 100%',
          borderRadius: '0 2px 2px 0',
        }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  );
}

