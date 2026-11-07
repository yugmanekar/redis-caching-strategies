import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShoppingCart, HeartPulse, MessageSquare, TrendingUp } from 'lucide-react';

const sectionStyle = {
  padding: '80px 24px',
  maxWidth: '1100px',
  margin: '0 auto',
};

const headingStyle = {
  fontSize: '12px',
  fontWeight: 700,
  color: '#079455',
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
  padding: '24px',
  marginBottom: '20px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  boxShadow: 'var(--shadow-subtle)',
};

export default function RealWorldSection({ onComplete }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [activeCase, setActiveCase] = useState(0);

  useEffect(() => {
    if (isInView) onComplete?.();
  }, [isInView]);

  const cases = [
    {
      title: 'E-Commerce Product Detail Pages',
      icon: ShoppingCart,
      company: 'Amazon / Shopify style',
      strategy: 'Cache-Aside with Event-Driven Invalidation',
      why: 'Product descriptions and specs are read 100,000x more often than they are edited. Cache-aside holds hot products in RAM. When a merchant updates inventory or price in admin, a background message evicts product:{id} across all servers immediately.',
      ttl: '12 hours (with explicit eviction)',
      keyStructure: 'catalog:product:{id}',
    },
    {
      title: 'Flash Sale & Limited Inventory Counter',
      icon: TrendingUp,
      company: 'Ticketmaster / Sneakers Drop',
      strategy: 'Atomic Redis INCRBY/DECRBY with Write-Behind',
      why: 'Relational databases will deadlock under 50,000 simultaneous ticket checkout requests. Redis handles atomic DECR stock:sneaker:42 at 80,000 ops/sec in memory, and writes completed orders to MySQL asynchronously via a background worker queue.',
      ttl: 'No expiration (cleared upon sellout)',
      keyStructure: 'inventory:stock:{sku}',
    },
    {
      title: 'Real-Time User Sessions & Auth Tokens',
      icon: HeartPulse,
      company: 'Netflix / Spotify style',
      strategy: 'Write-Through with Rolling TTL',
      why: 'Every HTTP API request must validate the bearer token. Storing JWT session states in Redis avoids authenticating against DB 30 times per second. TTL is renewed on every incoming user request (Sliding Window Session expiration).',
      ttl: '30 minutes (Sliding window on hit)',
      keyStructure: 'session:token:{hash}',
    },
    {
      title: 'Live Chat Leaderboards & Metrics',
      icon: MessageSquare,
      company: 'Discord / Twitch style',
      strategy: 'Redis Sorted Sets (ZSET) Direct Cache',
      why: 'Real-time viewer ranking or top donators cannot be computed via SQL `ORDER BY score DESC` on live streams with 200,000 active users. Redis ZADD & ZREVRANGE execute in O(log(N)) time directly in memory.',
      ttl: 'None (evicted on stream conclusion)',
      keyStructure: 'leaderboard:channel:{id}',
    },
  ];

  const current = cases[activeCase];
  const Icon = current.icon;

  return (
    <div ref={ref} style={sectionStyle}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <p style={headingStyle}>Chapter 6 • System Design in Practice</p>
        <h2 style={titleStyle}>
          Production <span style={{ color: '#079455' }}>Engineering Scenarios</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15.5px', maxWidth: '850px', marginBottom: '28px', lineHeight: 1.7 }}>
          How high-scale production systems combine Redis data structures and caching patterns to solve extreme traffic constraints.
        </p>

        {/* Case Selector Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {cases.map((c, idx) => {
            const CaseIcon = c.icon;
            const isActive = activeCase === idx;
            return (
              <motion.div
                key={idx}
                onClick={() => setActiveCase(idx)}
                whileHover={{ y: -3 }}
                style={{
                  ...cardStyle,
                  marginBottom: 0,
                  border: isActive ? '2px solid #079455' : '1px solid #E2E8F0',
                  background: isActive ? '#ECFDF3' : '#FFFFFF',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <CaseIcon size={18} style={{ color: isActive ? '#079455' : '#64748B' }} />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>{c.company}</span>
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: isActive ? '#079455' : '#0F172A' }}>
                  {c.title}
                </h4>
              </motion.div>
            );
          })}
        </div>

        {/* Deep Dive Card */}
        <div style={{ ...cardStyle, cursor: 'default', background: '#FFFFFF', padding: '32px', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '10px', borderRadius: '10px', background: '#ECFDF3', color: '#079455' }}>
              <Icon size={24} />
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#079455', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Selected Scenario</span>
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A' }}>{current.title}</h3>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>Recommended Pattern</span>
              <span style={{ fontSize: '14.5px', fontWeight: 700, color: '#D92D20' }}>{current.strategy}</span>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>Redis Key Pattern</span>
              <code style={{ fontSize: '13.5px', fontFamily: 'var(--font-mono)', color: '#079455', fontWeight: 600 }}>{current.keyStructure}</code>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>TTL Expiration Policy</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#B54708' }}>{current.ttl}</span>
            </div>
          </div>

          <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px', color: '#0F172A' }}>Architectural Rationale:</h4>
          <p style={{ fontSize: '14.5px', color: '#334155', lineHeight: 1.7 }}>
            {current.why}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
