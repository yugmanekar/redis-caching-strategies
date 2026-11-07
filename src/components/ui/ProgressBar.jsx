import { motion } from 'framer-motion';

export default function ProgressBar({ progress }) {
  return (
    <div style={{
      position: 'fixed',
      top: '64px',
      left: 0,
      right: 0,
      height: '2px',
      background: 'rgba(255, 255, 255, 0.04)',
      zIndex: 999,
    }}>
      <motion.div
        style={{
          height: '100%',
          background: 'linear-gradient(90deg, #E11D48, #FB7185, #6366F1)',
          boxShadow: '0 0 8px rgba(225, 29, 72, 0.6)',
        }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  );
}
