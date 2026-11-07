import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Video, Sparkles, Clock } from 'lucide-react';

const videoPlaylists = [
  {
    id: 'intro',
    title: 'Why Redis & In-Memory Caching Matters',
    duration: '3:45',
    tag: 'Fundamentals',
    youtubeId: 'jgpVdJB2sKQ',
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
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '1050px',
            maxHeight: '90vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.25)',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '18px 24px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#F8FAFC',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                padding: '8px',
                borderRadius: '8px',
                background: '#FEF3F2',
                color: '#D92D20',
              }}>
                <Video size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A' }}>Video Concept Classroom</h3>
                <p style={{ fontSize: '12px', color: '#64748B' }}>
                  Curated video breakdowns explaining caching architecture step-by-step
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                color: '#475569',
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
            <div style={{ padding: '24px', background: '#F8FAFC' }}>
              <div style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#000',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
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
                    padding: '3px 9px',
                    borderRadius: '50px',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: '#FEF3F2',
                    color: '#D92D20',
                    border: '1px solid #FECDCA',
                  }}>
                    {activeVideo.tag}
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} /> {activeVideo.duration}
                  </span>
                </div>

                <h4 style={{ fontSize: '19px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                  {activeVideo.title}
                </h4>
                <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6, marginBottom: '16px' }}>
                  {activeVideo.description}
                </p>

                {/* Key Takeaways */}
                <div style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                }}>
                  <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#079455', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} /> Key Takeaways Covered:
                  </h5>
                  <ul style={{ paddingLeft: '20px', fontSize: '13px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {activeVideo.keyTakeaways.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right: Playlist Sidebar */}
            <div style={{
              background: '#FFFFFF',
              borderLeft: '1px solid #E2E8F0',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Course Video Lessons
              </span>

              {videoPlaylists.map((video) => {
                const isSelected = video.id === activeVideoId;
                return (
                  <div
                    key={video.id}
                    onClick={() => setActiveVideoId(video.id)}
                    style={{
                      padding: '13px',
                      borderRadius: '10px',
                      background: isSelected ? '#FEF3F2' : '#F8FAFC',
                      border: isSelected ? '1px solid #FECDCA' : '1px solid #E2E8F0',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: isSelected ? '#D92D20' : '#64748B' }}>
                        {video.tag}
                      </span>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                        {video.duration}
                      </span>
                    </div>

                    <h5 style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: isSelected ? '#B42318' : '#0F172A',
                      lineHeight: 1.4,
                      marginBottom: '6px',
                    }}>
                      {video.title}
                    </h5>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: isSelected ? '#D92D20' : '#64748B' }}>
                      <Play size={11} fill={isSelected ? '#D92D20' : 'currentColor'} />
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
