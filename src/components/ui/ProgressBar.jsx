import { motion } from 'framer-motion';

export default function ProgressBar({ progress }) {
  return (
    <div style={{
      position: 'fixed',
      top: '66px',
      left: 0,
      right: 0,
      height: '3px',
      background: '#E2E8F0',
      zIndex: 999,
    }}>
      <motion.div
        style={{
          height: '100%',
          background: 'linear-gradient(90deg, #D92D20, #F04438)',
          boxShadow: '0 0 6px rgba(217, 45, 32, 0.4)',
        }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      />
    </div>
  );
}
