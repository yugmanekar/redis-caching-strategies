import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Video, ExternalLink, Sparkles, BookOpen, Clock } from 'lucide-react';

const videoPlaylists = [
  {
    id: 'intro',
    title: 'Why Redis & In-Memory Caching Matters',
    duration: '3:45',
    tag: 'Fundamentals',
    youtubeId: 'jgpVdJB2sKQ', // High quality visual Redis explanation
    description: 'A visual walkthrough showing how in-memory key-value databases solve latency bottlenecks in modern web infrastructure.',
    keyTakeaways: [
      'Disk I/O vs RAM latency breakdown',
      'How caching reduces database connection strain',
      'The anatomy of a Redis key-value operation'
    ]
  },
  {
    id: 'cache-aside',
    title: 'Cache-Aside (Lazy Loading) Pattern in 4 Minutes',
    duration: '4:15',
    tag: 'Read Strategy',
    youtubeId: 'G1rOAtC2cI0',
    description: 'Step-by-step architectural breakdown of Cache-Aside: how requests query the cache first and populate on miss.',
    keyTakeaways: [
      'The 3 steps: Check, Query DB on miss, Populate cache',
      'Why hot data stays resident and cold data never fills RAM',
      'Handling database update staleness'
    ]
  },
  {
    id: 'write-through',
    title: 'Write-Through vs Write-Behind (Write-Back)',
    duration: '5:20',
    tag: 'Write Strategy',
    youtubeId: 'pDkS7gq7_3Q',
    description: 'Visualizing synchronous dual-writes vs asynchronous batch queues to balance throughput and strict data consistency.',
    keyTakeaways: [
      'Transactional dual-writes with rollback guarantees',
      'When Write-Behind asynchronous queues prevent DB bottlenecks',
      'Data consistency trade-offs'
    ]
  },
  {
    id: 'invalidation',
    title: 'Cache Invalidation: TTL, Pub/Sub & Stampedes',
    duration: '6:10',
    tag: 'Advanced Architecture',
    youtubeId: '0U_aG_Z3w2I',
    description: 'Tackling the hardest problem in computer science: keeping cached records synchronized with database mutations.',
    keyTakeaways: [
      'Automatic TTL expiration with jitter offsets',
      'Event-driven cache eviction via Redis Pub/Sub',
      'Preventing Cache Stampede, Avalanche, and Penetration'
    ]
  }
];

export default function VideoHubModal({ isOpen, onClose, initialVideoId = 'intro' }) {
  const [activeVideoId, setActiveVideoId] = useState(initialVideoId);
  const activeVideo = videoPlaylists.find(v => v.id === activeVideoId) || videoPlaylists[0];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(12px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '1050px',
            maxHeight: '90vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '20px 28px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15, 15, 26, 0.8)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                padding: '8px',
                borderRadius: '8px',
                background: 'rgba(220, 56, 45, 0.15)',
                color: '#DC382D',
              }}>
                <Video size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Video Concept Classroom</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Curated video breakdowns explaining caching architecture step-by-step
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ✕ Close
            </button>
          </div>

          {/* Body */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            overflowY: 'auto',
            flex: 1,
          }}>
            {/* Left: Video Player */}
            <div style={{ padding: '24px', background: '#0e0e18' }}>
              <div style={{
                position: 'relative',
                paddingBottom: '56.25%', // 16:9 aspect ratio
                height: 0,
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#000',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                marginBottom: '20px',
              }}>
                <iframe
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '50px',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: 'rgba(220, 56, 45, 0.15)',
                    color: '#FF6B6B',
                  }}>
                    {activeVideo.tag}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} /> {activeVideo.duration}
                  </span>
                </div>

                <h4 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>
                  {activeVideo.title}
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
                  {activeVideo.description}
                </p>

                {/* Key Takeaways */}
                <div style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                }}>
                  <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#38B2AC', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} /> Key Takeaways Covered in this Lesson:
                  </h5>
                  <ul style={{ paddingLeft: '20px', fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {activeVideo.keyTakeaways.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right: Playlist Sidebar */}
            <div style={{
              background: 'var(--bg-card)',
              borderLeft: '1px solid var(--border-color)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Course Video Lessons
              </span>

              {videoPlaylists.map((video) => {
                const isSelected = video.id === activeVideoId;
                return (
                  <div
                    key={video.id}
                    onClick={() => setActiveVideoId(video.id)}
                    style={{
                      padding: '14px',
                      borderRadius: '10px',
                      background: isSelected ? 'rgba(220, 56, 45, 0.15)' : 'var(--bg-secondary)',
                      border: isSelected ? '1px solid #DC382D' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: isSelected ? '#FF6B6B' : 'var(--text-muted)' }}>
                        {video.tag}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {video.duration}
                      </span>
                    </div>

                    <h5 style={{
                      fontSize: '13.5px',
                      fontWeight: 700,
                      color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                      lineHeight: 1.4,
                      marginBottom: '6px',
                    }}>
                      {video.title}
                    </h5>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: isSelected ? '#DC382D' : 'var(--text-muted)' }}>
                      <Play size={12} fill={isSelected ? '#DC382D' : 'currentColor'} />
                      <span>{isSelected ? 'Now Playing' : 'Watch Lesson'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
