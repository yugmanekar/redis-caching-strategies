import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Scale, Check, X, Sparkles, Filter } from 'lucide-react';

const sectionStyle = {
  padding: '80px 24px',
  maxWidth: '1100px',
  margin: '0 auto',
};

const headingStyle = {
  fontSize: '14px',
  fontWeight: 700,
  color: '#ED8936',
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

export default function ComparisonSection({ onComplete }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [selectedAspect, setSelectedAspect] = useState('all');

  useEffect(() => {
    if (isInView) onComplete?.();
  }, [isInView]);

  const criteria = [
    {
      metric: 'Primary Driver',
      category: 'arch',
      cacheAside: 'Read-Heavy workloads with infrequent mutations',
      writeThrough: 'High data consistency where stale reads are unacceptable',
      writeBehind: 'Extremely high write throughput (analytics, IoT metrics)',
    },
    {
      metric: 'Read Latency',
      category: 'perf',
      cacheAside: 'Fast (< 1ms) on hits; Triple penalty on initial miss',
      writeThrough: 'Consistently ultra-low (< 1ms) because data is pre-warmed',
      writeBehind: 'Consistently ultra-low (< 1ms)',
    },
    {
      metric: 'Write Latency',
      category: 'perf',
      cacheAside: 'Normal (writes touch DB directly; cache invalidated or left to TTL)',
      writeThrough: 'High (synchronously blocks until both Cache and DB finish)',
      writeBehind: 'Minimal (< 1ms, acknowledges immediately after RAM write)',
    },
    {
      metric: 'Risk of Stale Data',
      category: 'consistency',
      cacheAside: 'Moderate to High if invalidation isn’t tied to DB updates',
      writeThrough: 'Virtually Zero (strictly synchronous updates)',
      writeBehind: 'Low for readers; higher danger of total data loss if node dies',
    },
    {
      metric: 'Cache Size & RAM Usage',
      category: 'cost',
      cacheAside: 'Optimal (only genuinely requested keys occupy memory)',
      writeThrough: 'High churn (every write is cached, even if never re-read)',
      writeBehind: 'High churn (all written payloads buffer in memory)',
    },
    {
      metric: 'Failure Resilience',
      category: 'arch',
      cacheAside: 'High (if Redis dies, requests transparently hit DB directly)',
      writeThrough: 'Medium (Redis failure blocks write operations)',
      writeBehind: 'Risky (Redis failure before queue drain causes permanent data loss)',
    },
  ];

  const filteredCriteria = selectedAspect === 'all'
    ? criteria
    : criteria.filter(c => c.category === selectedAspect);

  return (
    <div ref={ref} style={sectionStyle}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <p style={headingStyle}>Chapter 5 • Architecture Trade-offs</p>
        <h2 style={titleStyle}>
          Side-by-Side <span style={{ color: '#ED8936' }}>Pattern Matrix</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '850px', marginBottom: '28px', lineHeight: 1.7 }}>
          There is no single "best" caching design. Every pattern trades off read throughput, write latency, RAM utilization, and transactional consistency.
        </p>

        {/* Filter controls */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {[
            { id: 'all', label: 'All Criteria' },
            { id: 'perf', label: '⚡ Performance' },
            { id: 'consistency', label: '🔒 Consistency' },
            { id: 'cost', label: '💰 Cost & Memory' },
            { id: 'arch', label: '🏗️ Architecture' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedAspect(f.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                border: '1px solid',
                borderColor: selectedAspect === f.id ? '#ED8936' : 'var(--border-color)',
                background: selectedAspect === f.id ? 'rgba(237, 137, 54, 0.15)' : 'var(--bg-secondary)',
                color: selectedAspect === f.id ? '#ED8936' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Table View */}
        <div style={{ ...cardStyle, overflowX: 'auto', padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '16px 20px', fontSize: '14px', color: 'var(--text-muted)', fontWeight: 600 }}>Dimension</th>
                <th style={{ padding: '16px 20px', fontSize: '14px', color: '#38B2AC', fontWeight: 700 }}>Cache-Aside</th>
                <th style={{ padding: '16px 20px', fontSize: '14px', color: '#DC382D', fontWeight: 700 }}>Write-Through</th>
                <th style={{ padding: '16px 20px', fontSize: '14px', color: '#9F7AEA', fontWeight: 700 }}>Write-Behind (Back)</th>
              </tr>
            </thead>
            <tbody>
              {filteredCriteria.map((row, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)',
                  }}
                >
                  <td style={{ padding: '16px 20px', fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
                    {row.metric}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {row.cacheAside}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {row.writeThrough}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {row.writeBehind}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cheat sheet recommendation */}
        <div style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(237, 137, 54, 0.1), rgba(220, 56, 45, 0.1))',
          border: '1px solid rgba(237, 137, 54, 0.3)',
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-start',
        }}>
          <Sparkles size={24} style={{ color: '#ED8936', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#ED8936', marginBottom: '6px' }}>
              Architect's Rule of Thumb
            </h4>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Default to <strong>Cache-Aside with TTL + event eviction</strong> for 85% of standard web applications (user profiles, catalogs, blog posts). Switch to <strong>Write-Through</strong> only for financial balances, seat reservations, or security tokens where read-after-write inconsistency cannot be tolerated.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

