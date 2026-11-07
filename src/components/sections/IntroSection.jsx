import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Zap, Database, ArrowRight, CheckCircle2 } from 'lucide-react';
import CodeBlock from '../ui/CodeBlock';
import VideoButton from '../ui/VideoButton';

const sectionStyle = {
  padding: '90px 24px',
  maxWidth: '1040px',
  margin: '0 auto',
};

const headingStyle = {
  fontSize: '12px',
  fontWeight: 700,
  color: '#D92D20',
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  marginBottom: '8px',
};

const titleStyle = {
  fontSize: 'clamp(28px, 3.8vw, 40px)',
  fontWeight: 800,
  lineHeight: 1.15,
  marginBottom: '20px',
  letterSpacing: '-0.025em',
  color: 'var(--text-primary)',
};

const cardStyle = {
  background: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid var(--border-color)',
  padding: '30px',
  marginBottom: '24px',
  boxShadow: 'var(--shadow-card)',
};

export default function IntroSection({ onComplete, onOpenVideo }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [showLatency, setShowLatency] = useState(false);
  const [dbTime, setDbTime] = useState(null);
  const [cacheTime, setCacheTime] = useState(null);

  useEffect(() => {
    if (isInView) onComplete?.();
  }, [isInView]);

  const simulateLatency = () => {
    setShowLatency(true);
    setDbTime(null);
    setCacheTime(null);

    setTimeout(() => setCacheTime(Math.floor(Math.random() * 3 + 1)), 60);
    setTimeout(() => setDbTime(Math.floor(Math.random() * 160 + 110)), 750);
  };

  return (
    <div ref={ref} style={sectionStyle}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '8px' }}>
          <p style={headingStyle}>Chapter 1 • Problem Foundation</p>
          <VideoButton onOpen={onOpenVideo} videoId="intro" label="Watch Intro Video (3m)" />
        </div>

        <h2 style={titleStyle}>
          The Latency Bottleneck &{' '}
          <span style={{ color: '#D92D20' }}>Redis</span>
        </h2>

        {/* Latency Comparison Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{
              padding: '4px 10px',
              borderRadius: '6px',
              background: '#FFFAEB',
              border: '1px solid #FEDF89',
              color: '#B54708',
              fontSize: '12px',
              fontWeight: 700,
            }}>
              BENCHMARK
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>Disk I/O vs In-Memory RAM</h3>
          </div>

          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.7, fontSize: '15px' }}>
            When 20,000 users concurrently fetch a hot e-commerce product or profile, hitting a relational database executes disk seek cycles, connection overhead, and complex query parsing every single time.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            {/* DB Block */}
            <div style={{
              padding: '24px',
              borderRadius: '12px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              textAlign: 'center',
            }}>
              <Database size={28} color="#64748B" style={{ marginBottom: '10px' }} />
              <h4 style={{ color: '#475569', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
                PostgreSQL (SSD Disk / Network)
              </h4>
              <div style={{
                fontSize: '38px',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                color: dbTime !== null ? '#D92D20' : '#94A3B8',
                letterSpacing: '-0.02em',
              }}>
                {dbTime !== null ? `${dbTime}ms` : '—'}
              </div>
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '6px' }}>
                Query execution + Disk seek
              </p>
            </div>

            {/* Redis Block */}
            <div style={{
              padding: '24px',
              borderRadius: '12px',
              background: '#FEF3F2',
              border: '1px solid #FECDCA',
              textAlign: 'center',
            }}>
              <Zap size={28} color="#D92D20" style={{ marginBottom: '10px' }} />
              <h4 style={{ color: '#D92D20', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
                Redis In-Memory Lookup
              </h4>
              <div style={{
                fontSize: '38px',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                color: cacheTime !== null ? '#079455' : '#94A3B8',
                letterSpacing: '-0.02em',
              }}>
                {cacheTime !== null ? `${cacheTime}ms` : '—'}
              </div>
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '6px' }}>
                O(1) Hash Table Lookup in RAM
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={simulateLatency}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '10px',
              background: 'linear-gradient(180deg, #D92D20 0%, #B42318 100%)',
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(217, 45, 32, 0.25)',
            }}
          >
            ⚡ Run Live Latency Benchmark
          </motion.button>

          {showLatency && dbTime !== null && cacheTime !== null && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: '16px',
                padding: '12px 18px',
                borderRadius: '8px',
                background: '#ECFDF3',
                border: '1px solid #A6F4C5',
                color: '#079455',
                fontSize: '13.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 500,
              }}
            >
              <CheckCircle2 size={16} />
              <span>
                Redis responded in <strong>{cacheTime}ms</strong> — that is <strong>{Math.round(dbTime / cacheTime)}x faster</strong> than the PostgreSQL disk roundtrip!
              </span>
            </motion.div>
          )}
        </div>

        {/* Redis Architectural Highlights */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#0F172A' }}>
            Why Redis Dominates Web Infrastructure
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
            {[
              { title: 'Sub-millisecond Ops', desc: 'Single-threaded event loop eliminates lock contention', tag: 'Fast' },
              { title: 'Native Data Structures', desc: 'Hashes, Lists, Sets, and Sorted Sets (ZSET)', tag: 'Versatile' },
              { title: 'Granular Key TTL', desc: 'Auto-expiration with millisecond precision', tag: 'Managed' },
              { title: 'Pub/Sub Engine', desc: 'Broadcast instant cache invalidation alerts', tag: 'Realtime' },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '18px',
                  borderRadius: '10px',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                }}
              >
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#D92D20', textTransform: 'uppercase' }}>{item.tag}</span>
                <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '6px 0 4px', color: '#0F172A' }}>{item.title}</h4>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Command Cheat Sheet */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: '#0F172A' }}>
            Core Redis Primitives
          </h3>
          <CodeBlock
            title="redis-cli terminal"
            language="bash"
            code={`# 1. Store a JSON string with key
SET user:42 '{"name":"Alex","plan":"pro"}'

# 2. Retrieve data in sub-millisecond
GET user:42

# 3. Store with auto-expiration (TTL = 300 seconds)
SETEX session:token:99 300 '{"userId":42}'

# 4. Check time remaining before eviction
TTL session:token:99
# Output: 284 seconds

# 5. Explicitly invalidate/evict key
DEL user:42`}
          />
        </div>
      </motion.div>
    </div>
  );
}
