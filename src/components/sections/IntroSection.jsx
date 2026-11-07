import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Zap, Server, Database, ArrowRight, AlertTriangle, CheckCircle, Video } from 'lucide-react';
import CodeBlock from '../ui/CodeBlock';
import VideoButton from '../ui/VideoButton';

const sectionStyle = {
  padding: '100px 24px',
  maxWidth: '1000px',
  margin: '0 auto',
};

const headingStyle = {
  fontSize: '14px',
  fontWeight: 700,
  color: '#DC382D',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  marginBottom: '12px',
};

const titleStyle = {
  fontSize: 'clamp(28px, 4vw, 42px)',
  fontWeight: 800,
  lineHeight: 1.2,
  marginBottom: '20px',
};

const cardStyle = {
  background: 'var(--bg-card)',
  borderRadius: '16px',
  border: '1px solid var(--border-color)',
  padding: '32px',
  marginBottom: '24px',
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

    // Simulate cache hit (fast)
    setTimeout(() => setCacheTime(Math.floor(Math.random() * 5 + 1)), 50);
    // Simulate DB query (slow)
    setTimeout(() => setDbTime(Math.floor(Math.random() * 200 + 100)), 800);
  };

  return (
    <div ref={ref} style={sectionStyle}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '8px' }}>
          <p style={headingStyle}>Chapter 1 • Fundamentals</p>
          <VideoButton onOpen={onOpenVideo} videoId="intro" label="Watch Intro Video (3m)" />
        </div>

        <h2 style={titleStyle}>
          What is Caching & Why{' '}
          <span style={{ color: '#DC382D' }}>Redis</span>?
        </h2>

        <div style={cardStyle}>
          <h3 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: 700 }}>
            🧠 The Problem: Slow Database Queries
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.8 }}>
            Every time a user visits a product page, your app queries the database. If 10,000 users
            view the same product, that's <strong style={{ color: '#FF6B6B' }}>10,000 identical queries</strong> hitting
            your database. This is slow, expensive, and unnecessary.
          </p>

          {/* Interactive latency comparison */}
          <div style={{
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
            marginBottom: '20px',
          }}>
            <div style={{
              flex: 1,
              minWidth: '200px',
              padding: '24px',
              borderRadius: '12px',
              background: 'rgba(51, 103, 145, 0.15)',
              border: '1px solid rgba(51, 103, 145, 0.3)',
              textAlign: 'center',
            }}>
              <Database size={32} style={{ color: '#5B9BD5', marginBottom: '12px' }} />
              <h4 style={{ color: '#5B9BD5', marginBottom: '8px' }}>Database Query</h4>
              <div style={{
                fontSize: '36px',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                color: dbTime !== null ? '#FF6B6B' : 'var(--text-muted)',
              }}>
                {dbTime !== null ? `${dbTime}ms` : '???'}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                Disk I/O + Network round trip
              </p>
            </div>

            <div style={{
              flex: 1,
              minWidth: '200px',
              padding: '24px',
              borderRadius: '12px',
              background: 'rgba(220, 56, 45, 0.15)',
              border: '1px solid rgba(220, 56, 45, 0.3)',
              textAlign: 'center',
            }}>
              <Zap size={32} style={{ color: '#FF6B6B', marginBottom: '12px' }} />
              <h4 style={{ color: '#FF6B6B', marginBottom: '8px' }}>Redis Cache Hit</h4>
              <div style={{
                fontSize: '36px',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                color: cacheTime !== null ? '#48BB78' : 'var(--text-muted)',
              }}>
                {cacheTime !== null ? `${cacheTime}ms` : '???'}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                In-memory lookup
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={simulateLatency}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #DC382D, #c0392b)',
              color: 'white',
              fontSize: '16px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ⚡ Simulate Latency Comparison
          </motion.button>

          {showLatency && dbTime !== null && cacheTime !== null && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                marginTop: '16px',
                padding: '12px 16px',
                borderRadius: '8px',
                background: 'rgba(72, 187, 120, 0.1)',
                border: '1px solid rgba(72, 187, 120, 0.3)',
                color: '#48BB78',
                fontSize: '14px',
                textAlign: 'center',
              }}
            >
              🚀 Redis is <strong>{Math.round(dbTime / cacheTime)}x faster</strong> than a database query!
            </motion.p>
          )}
        </div>

        {/* Why Redis */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: 700 }}>
            🔴 Why Redis?
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.8 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Redis</strong> (Remote Dictionary Server) is an
            open-source, in-memory data store. It stores data in RAM rather than on disk, making it
            incredibly fast for caching.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {[
              { icon: '⚡', title: 'Sub-millisecond', desc: 'Read/write operations in under 1ms' },
              { icon: '📦', title: 'Rich Data Types', desc: 'Strings, Hashes, Lists, Sets, Sorted Sets' },
              { icon: '🔄', title: 'Built-in TTL', desc: 'Automatic key expiration for cache invalidation' },
              { icon: '📡', title: 'Pub/Sub', desc: 'Built-in messaging for event-driven invalidation' },
              { icon: '🏗️', title: 'Clustering', desc: 'Horizontal scaling across multiple nodes' },
              { icon: '💾', title: 'Persistence', desc: 'Optional disk persistence (RDB/AOF)' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 * i }}
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <span style={{ fontSize: '24px' }}>{feature.icon}</span>
                <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '8px 0 4px' }}>{feature.title}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Basic Redis Commands */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: 700 }}>
            📝 Essential Redis Commands
          </h3>
          <CodeBlock
            title="redis-cli"
            language="bash"
            code={`# Store a value with a key
SET user:1 '{"name":"Alice","email":"alice@example.com"}'

# Retrieve a value
GET user:1
# → '{"name":"Alice","email":"alice@example.com"}'

# Store with auto-expiration (TTL = 300 seconds)
SETEX user:1 300 '{"name":"Alice","email":"alice@example.com"}'

# Check remaining TTL
TTL user:1
# → 295

# Delete a key
DEL user:1

# Check if key exists
EXISTS user:1
# → 0 (deleted)`}
          />
        </div>
      </motion.div>
    </div>
  );
}
