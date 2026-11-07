import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, Timer, Bell, Trash2, AlertOctagon, Code } from 'lucide-react';
import CacheInvalidationSimulation from '../simulations/CacheInvalidationSimulation';
import CodeBlock from '../ui/CodeBlock';
import VideoButton from '../ui/VideoButton';

const sectionStyle = {
  padding: '80px 24px',
  maxWidth: '1100px',
  margin: '0 auto',
};

const headingStyle = {
  fontSize: '12px',
  fontWeight: 700,
  color: '#444CE7',
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  marginBottom: '8px',
};

const titleStyle = {
  fontSize: 'clamp(28px, 4vw, 40px)',
  fontWeight: 800,
  lineHeight: 1.2,
  marginBottom: '16px',
  color: 'var(--text-primary)',
};

const cardStyle = {
  background: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid var(--border-color)',
  padding: '28px',
  marginBottom: '24px',
  boxShadow: 'var(--shadow-card)',
};

export default function CacheInvalidationSection({ onComplete, onOpenVideo }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) onComplete?.();
  }, [isInView]);

  return (
    <div ref={ref} style={sectionStyle}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '8px' }}>
          <p style={headingStyle}>Chapter 4 • The Hardest Problem</p>
          <VideoButton onOpen={onOpenVideo} videoId="invalidation" label="Watch Invalidation Video (6m)" />
        </div>

        <h2 style={titleStyle}>
          Cache Invalidation{' '}
          <span style={{ color: '#444CE7' }}>Strategies</span>
        </h2>
        
        <blockquote style={{
          borderLeft: '4px solid #444CE7',
          padding: '16px 20px',
          background: '#EEF4FF',
          borderRadius: '0 12px 12px 0',
          fontSize: '15px',
          fontStyle: 'italic',
          color: '#334155',
          marginBottom: '28px',
        }}>
          "There are only two hard things in Computer Science: cache invalidation and naming things." 
          <span style={{ fontStyle: 'normal', display: 'block', marginTop: '6px', fontSize: '13px', color: '#444CE7', fontWeight: 700 }}>— Phil Karlton</span>
        </blockquote>

        <p style={{ color: 'var(--text-secondary)', fontSize: '15.5px', maxWidth: '850px', marginBottom: '28px', lineHeight: 1.7 }}>
          When data in your database updates or deletes, any cached version instantly becomes <em>stale</em>. Without a deliberate invalidation policy, users will see outdated product pricing, old profile details, or incorrect inventory counts.
        </p>

        {/* 3 Core Approaches */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
          <div style={{ ...cardStyle, marginBottom: 0, borderTop: '4px solid #B54708' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#B54708' }}>
              <Timer size={20} />
              <h4 style={{ fontSize: '17px', fontWeight: 700 }}>1. TTL Expiration</h4>
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Set an expiration deadline (e.g., 60 seconds) using <code>EXPIRE</code> or <code>SETEX</code>. After the timer elapses, Redis automatically reclaims the memory.
            </p>
          </div>

          <div style={{ ...cardStyle, marginBottom: 0, borderTop: '4px solid #079455' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#079455' }}>
              <Bell size={20} />
              <h4 style={{ fontSize: '17px', fontWeight: 700 }}>2. Event-Driven (Pub/Sub)</h4>
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Whenever a service mutates database state, it broadcasts an event (e.g. <code>PRODUCT_UPDATED</code>). Subscribers listening on Redis Pub/Sub immediately evict or update the key.
            </p>
          </div>

          <div style={{ ...cardStyle, marginBottom: 0, borderTop: '4px solid #D92D20' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#D92D20' }}>
              <Trash2 size={20} />
              <h4 style={{ fontSize: '17px', fontWeight: 700 }}>3. Explicit Eviction (DEL)</h4>
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              The modifying endpoint synchronously executes <code>DEL key</code> right after committing the database transaction, ensuring the very next read re-fetches fresh data.
            </p>
          </div>
        </div>

        {/* Live Simulation Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: '#EEF4FF', color: '#444CE7' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>Interactive Invalidation Simulator</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Switch between TTL timers, event-driven Pub/Sub signals, and manual eviction to observe state synchronization in real time.
              </p>
            </div>
          </div>

          <CacheInvalidationSimulation />
        </div>

        {/* Code Snippets for Invalidation */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0F172A' }}>
            <Code size={18} style={{ color: '#444CE7' }} /> Cache Invalidation Code Patterns
          </h3>

          <CodeBlock
            title="patterns/cacheInvalidation.js"
            language="javascript"
            code={`// Strategy 1: TTL Expiration (Self-cleaning cache)
await redis.setex('news:breaking', 300, JSON.stringify(article)); // Dies in 5 min

// Strategy 2: Explicit Eviction on Mutation
export async function updateArticle(id, newContent) {
  await db.query('UPDATE articles SET content = $1 WHERE id = $2', [newContent, id]);
  
  // Evict immediately so next read is guaranteed fresh
  await redis.del(\`article:\${id}\`);
}

// Strategy 3: Distributed Event-Driven Invalidation (Pub/Sub)
const publisher = new Redis();
const subscriber = new Redis();

// Producer notifies the cluster
export async function publishCatalogChange(productId) {
  await publisher.publish('catalog-updates', JSON.stringify({ action: 'PURGE', productId }));
}

// Every microservice instance listens and purges its local cache
subscriber.subscribe('catalog-updates');
subscriber.on('message', (channel, message) => {
  const { action, productId } = JSON.parse(message);
  if (action === 'PURGE') {
    redis.del(\`product:\${productId}\`);
    console.log(\`[Cluster Invalidation] Evicted product:\${productId}\`);
  }
});`}
          />
        </div>

        {/* Famous Cache Invalidation Pitfalls */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#B54708' }}>
            <AlertOctagon size={20} /> Beware: Common Cache Pitfalls & Mitigations
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', borderRadius: '12px', background: '#FEF3F2', border: '1px solid #FECDCA' }}>
              <h5 style={{ color: '#D92D20', fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>Cache Stampede</h5>
              <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
                <strong>Issue:</strong> High-traffic key expires, 5,000 threads simultaneously miss cache and swamp DB.<br/>
                <strong>Fix:</strong> Use a distributed lock (Redlock) or add random jitter to TTL (e.g. <code>TTL = 300 + rand(0, 30)</code>).
              </p>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', background: '#FFFAEB', border: '1px solid #FEDF89' }}>
              <h5 style={{ color: '#B54708', fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>Cache Penetration</h5>
              <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
                <strong>Issue:</strong> Attackers request non-existent keys (e.g. <code>user:9999999</code>) that are never in cache, hitting DB every time.<br/>
                <strong>Fix:</strong> Cache the "null" result with a short 60s TTL or employ a <strong>Bloom Filter</strong> in front of Redis.
              </p>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', background: '#EEF4FF', border: '1px solid #C7D7FE' }}>
              <h5 style={{ color: '#444CE7', fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>Cache Avalanche</h5>
              <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
                <strong>Issue:</strong> Massive batch of keys configured with identical 1-hour TTL expire at the exact same second.<br/>
                <strong>Fix:</strong> Disperse expirations by applying randomized delta offsets to TTL values across keys.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
