import { useState } from 'react';
import { Play, Sparkles } from 'lucide-react';

export default function VideoButton({ onOpen, label = 'Watch Video Lesson', videoId = 'intro' }) {
  return (
    <button
      onClick={() => onOpen(videoId)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 18px',
        borderRadius: '10px',
        background: 'rgba(220, 56, 45, 0.12)',
        border: '1px solid rgba(220, 56, 45, 0.35)',
        color: '#FF6B6B',
        fontSize: '13.5px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(220, 56, 45, 0.22)';
        e.currentTarget.style.borderColor = '#DC382D';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(220, 56, 45, 0.12)';
        e.currentTarget.style.borderColor = 'rgba(220, 56, 45, 0.35)';
      }}
    >
      <div style={{
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        background: '#DC382D',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
      }}>
        <Play size={10} fill="white" style={{ marginLeft: '1px' }} />
      </div>
      <span>{label}</span>
    </button>
  );
}
