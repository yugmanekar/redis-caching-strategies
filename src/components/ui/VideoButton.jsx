import { useState } from 'react';
import { Play } from 'lucide-react';

export default function VideoButton({ onOpen, label = 'Watch Video Lesson', videoId = 'intro' }) {
  return (
    <button
      onClick={() => onOpen(videoId)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        borderRadius: '8px',
        background: '#FEF3F2',
        border: '1px solid #FECDCA',
        color: '#D92D20',
        fontSize: '13px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#FEE4E2';
        e.currentTarget.style.borderColor = '#FDA29B';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#FEF3F2';
        e.currentTarget.style.borderColor = '#FECDCA';
      }}
    >
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: '#D92D20',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
      }}>
        <Play size={9} fill="white" style={{ marginLeft: '1px' }} />
      </div>
      <span>{label}</span>
    </button>
  );
}
