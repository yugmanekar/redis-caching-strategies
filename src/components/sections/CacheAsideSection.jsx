import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Layers, CheckCircle2, XCircle, ArrowRight, Code } from 'lucide-react';
import CacheAsideSimulation from '../simulations/CacheAsideSimulation';
import CodeBlock from '../ui/CodeBlock';
import VideoButton from '../ui/VideoButton';

const sectionStyle = {
  padding: '80px 24px',
  maxWidth: '1100px',
  margin: '0 auto',
};

const headingStyle = {
  fontSize: '14px',
  fontWeight: 700,
  color: '#38B2AC',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  marginBottom: '12px',
};

const titleStyle = {
  fontSize: 'clamp(28px, 4vw, 40px)',
  fontWeight: 800,
  lineHeight: 1.2,
  marginBottom: '16px',
};

const cardStyle = {
  background: 'var(--bg-card)',
  borderRadius: '16px',
  border: '1px solid var(--border-color)',
  padding: '28px',
  marginBottom: '24px',
};

export default function CacheAsideSection({ onComplete, onOpenVideo }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) onComplete?.();
  }, [isInView]);

  return (
    <div ref={ref} style={sectionStyle}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '8px' }}>
          <p style={headingStyle}>Chapter 2 • Reading Pattern</p>
          <VideoButton onOpen={onOpenVideo} videoId="cache-aside" label="Watch Cache-Aside Video (4m)" />
        </div>

        <h2 style={titleStyle}>
          Cache-Aside Pattern{' '}
          <span style={{ color: '#38B2AC' }}>(Lazy Loading)</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '850px', marginBottom: '28px', lineHeight: 1.7 }}>
          Cache-Aside is the most ubiquitous caching strategy in modern web architectures. The application is completely responsible for coordinating between the cache and the primary datastore. Data is only loaded into the cache when explicitly requested.
        </p>

        {/* 3 Step Workflow */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {[
            {
              step: 'Step 1',
              title: 'Check Cache',
              desc: 'App requests key from Redis. If data exists (Cache HIT), it immediately returns to client.',
              accent: '#38B2AC',
            },
            {
              step: 'Step 2',
              title: 'Query Database on Miss',
              desc: 'If key does not exist (Cache MISS), application falls back to querying SQL/NoSQL database.',
              accent: '#ECC94B',
            },
            {
              step: 'Step 3',
              title: 'Populate & Return',
              desc: 'Application writes queried record into Redis with an optional TTL, then returns data to client.',
              accent: '#48BB78',
            },
          ].map((item, idx) => (
            <div key={idx} style={{
              ...cardStyle,
              marginBottom: 0,
              borderTop: `4px solid ${item.accent}`,
              background: 'var(--bg-secondary)',
            }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: item.accent, textTransform: 'uppercase' }}>{item.step}</span>
              <h4 style={{ fontSize: '18px', fontWeight: 700, margin: '8px 0 6px' }}>{item.title}</h4>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Live Simulation Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(56, 178, 172, 0.15)', color: '#38B2AC' }}>
              <Layers size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '19px', fontWeight: 700 }}>Interactive Cache-Aside Laboratory</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Test keys like <code>user:1</code>, observe cache hit vs miss latency, and inspect real-time state changes.
              </p>
            </div>
          </div>
          
          <CacheAsideSimulation />
        </div>

        {/* Production Node.js Code Example */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Code size={18} style={{ color: '#38B2AC' }} /> Production Implementation (Node.js & ioredis)
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px' }}>
            Notice how errors in Redis gracefully fall through to querying the database rather than breaking user requests:
          </p>
          <CodeBlock
            title="services/userService.js"
            language="javascript"
            code={`import Redis from 'ioredis';
import db from '../db/connection.js';

const redis = new Redis(process.env.REDIS_URL);
const DEFAULT_TTL_SECONDS = 3600; // 1 hour

export async function getUserProfile(userId) {
  const cacheKey = \`user:\${userId}\`;

  try {
    // 1. Check Redis Cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log(\`[Cache HIT] Retrieved \${cacheKey} in < 1ms\`);
      return JSON.parse(cachedData);
    }
  } catch (err) {
    // Graceful degradation: If Redis fails, log and continue to DB
    console.error('Redis cache lookup failed:', err.message);
  }

  // 2. Cache MISS: Query Primary Database
  console.log(\`[Cache MISS] Fetching \${cacheKey} from PostgreSQL...\`);
  const user = await db.query('SELECT id, name, email, role FROM users WHERE id = $1', [userId]);

  if (!user || user.rows.length === 0) {
    return null;
  }

  const userData = user.rows[0];

  try {
    // 3. Populate Redis Cache asynchronously with TTL
    await redis.setex(cacheKey, DEFAULT_TTL_SECONDS, JSON.stringify(userData));
  } catch (err) {
    console.error('Failed to set cache entry:', err.message);
  }

  return userData;
}`}
          />
        </div>

        {/* Pros & Cons Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <div style={{ ...cardStyle, borderLeft: '4px solid #48BB78' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#48BB78', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <CheckCircle2 size={18} /> Advantages
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: 'var(--text-secondary)' }}>
              <li><strong>• Resilient:</strong> If Redis crashes, the application continues functioning by querying the database directly.</li>
              <li><strong>• Memory Efficient:</strong> Only frequently requested ("hot") data is stored in RAM. Unused records never occupy memory.</li>
              <li><strong>• Flexible Data Shapes:</strong> Data can be transformed or aggregated before storing in cache.</li>
            </ul>
          </div>

          <div style={{ ...cardStyle, borderLeft: '4px solid #FF6B6B' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#FF6B6B', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <XCircle size={18} /> Trade-offs & Risks
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: 'var(--text-secondary)' }}>
              <li><strong>• Cache Stampede / Dogpiling:</strong> When a popular key expires, thousands of concurrent requests can simultaneously flood the database.</li>
              <li><strong>• Stale Data:</strong> If records are updated directly in DB without invalidating Redis, users see outdated data until TTL expires.</li>
              <li><strong>• First-request Latency Penalty:</strong> The initial query suffers triple latency: Cache check + DB query + Cache populate.</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
