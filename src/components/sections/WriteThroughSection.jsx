import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { RefreshCw, CheckCircle2, XCircle, Code, ShieldAlert, Cpu } from 'lucide-react';
import WriteThroughSimulation from '../simulations/WriteThroughSimulation';
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
  color: '#DC382D',
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

export default function WriteThroughSection({ onComplete, onOpenVideo }) {
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
          <p style={headingStyle}>Chapter 3 • Writing Pattern</p>
          <VideoButton onOpen={onOpenVideo} videoId="write-through" label="Watch Write-Through Video (5m)" />
        </div>

        <h2 style={titleStyle}>
          Write-Through Pattern{' '}
          <span style={{ color: '#DC382D' }}>(Immediate Consistency)</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '850px', marginBottom: '28px', lineHeight: 1.7 }}>
          In the Write-Through strategy, the cache acts as the primary data interface for writes. Whenever an update occurs, data is synchronously written to the cache and the permanent database together. The write transaction completes only when both systems acknowledge success.
        </p>

        {/* Conceptual Dual Path */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
          <div style={{ ...cardStyle, marginBottom: 0, background: 'var(--bg-secondary)', borderTop: '4px solid #DC382D' }}>
            <h4 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '8px', color: '#FF6B6B' }}>Write Path (Dual Persistence)</h4>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Client requests write ➔ Cache is updated immediately ➔ DB is updated within the same transaction ➔ Response returned only after both succeed.
            </p>
          </div>
          <div style={{ ...cardStyle, marginBottom: 0, background: 'var(--bg-secondary)', borderTop: '4px solid #48BB78' }}>
            <h4 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '8px', color: '#48BB78' }}>Read Path (Guaranteed Hit)</h4>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Because data was cached during the write stage, subsequent read operations enjoy virtually 100% cache hit rates with ultra-low sub-millisecond latencies.
            </p>
          </div>
        </div>

        {/* Live Simulation Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(220, 56, 45, 0.15)', color: '#DC382D' }}>
              <RefreshCw size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '19px', fontWeight: 700 }}>Interactive Write-Through Sandbox</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Commit writes, inspect synchronous dual-writes to Redis & DB, observe latency metrics, and test instant reads.
              </p>
            </div>
          </div>

          <WriteThroughSimulation />
        </div>

        {/* Code Block for Write-Through */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Code size={18} style={{ color: '#DC382D' }} /> Transactional Write-Through Implementation
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px' }}>
            A typical implementation wraps the database write and cache write together so neither becomes desynchronized:
          </p>
          <CodeBlock
            title="services/productService.js"
            language="javascript"
            code={`import Redis from 'ioredis';
import db from '../db/connection.js';

const redis = new Redis(process.env.REDIS_URL);

export async function updateProductWriteThrough(productId, payload) {
  const cacheKey = \`product:\${productId}\`;
  const client = await db.getClient();

  try {
    // 1. Begin Database Transaction
    await client.query('BEGIN');

    const updateQuery = \`
      UPDATE products 
      SET name = $1, price = $2, stock = $3, updated_at = NOW() 
      WHERE id = $4 
      RETURNING *
    \`;
    const res = await client.query(updateQuery, [
      payload.name,
      payload.price,
      payload.stock,
      productId,
    ]);

    const updatedProduct = res.rows[0];

    // 2. Synchronously write to Redis Cache
    await redis.set(cacheKey, JSON.stringify(updatedProduct));

    // 3. Commit Database Transaction
    await client.query('COMMIT');
    console.log(\`[Write-Through] Successfully synced \${cacheKey} to both DB and Redis\`);

    return updatedProduct;
  } catch (error) {
    // If either fails, rollback DB and purge potentially tainted cache
    await client.query('ROLLBACK');
    await redis.del(cacheKey); // Evict to prevent inconsistency
    console.error('[Write-Through Error] Rolled back write:', error.message);
    throw new Error('Write-through update failed');
  } finally {
    client.release();
  }
}`}
          />
        </div>

        {/* Write-Behind Note */}
        <div style={{ ...cardStyle, background: 'rgba(237, 137, 54, 0.1)', borderColor: 'rgba(237, 137, 54, 0.3)' }}>
          <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#ED8936', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Cpu size={18} /> Deep Dive: Write-Through vs Write-Behind (Write-Back)
          </h4>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            In <strong>Write-Through</strong>, the database write happens synchronously before returning an acknowledgement. In <strong>Write-Behind (Write-Back)</strong>, the app only writes to Redis immediately and queues an asynchronous message (via Redis Streams, Kafka, or RabbitMQ) to persist to the database later. Write-behind yields phenomenal write speeds, but carries a small risk of data loss if the cache crashes before the queue flushes.
          </p>
        </div>

        {/* Pros & Cons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <div style={{ ...cardStyle, borderLeft: '4px solid #48BB78' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#48BB78', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <CheckCircle2 size={18} /> Advantages
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: 'var(--text-secondary)' }}>
              <li><strong>• Zero Stale Reads:</strong> Cache always has the freshest copy of data the moment a write completes.</li>
              <li><strong>• High Read Throughput:</strong> Reads rarely suffer cache misses, safeguarding backend databases from query spikes.</li>
              <li><strong>• Data Integrity:</strong> Cache and database remain strictly aligned.</li>
            </ul>
          </div>

          <div style={{ ...cardStyle, borderLeft: '4px solid #FF6B6B' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#FF6B6B', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <XCircle size={18} /> Trade-offs & Risks
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: 'var(--text-secondary)' }}>
              <li><strong>• High Write Latency:</strong> Client has to wait for 2 round trips (Cache write + DB disk transaction write).</li>
              <li><strong>• Cache Churn / Pollution:</strong> Writing keys that might never be read wastes valuable RAM capacity.</li>
              <li><strong>• Higher Complexity:</strong> Error handling and rollback mechanisms are required to keep both stores synchronized.</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
