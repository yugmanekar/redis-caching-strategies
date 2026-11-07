import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Terminal, Play, RotateCcw, Check, Sparkles, AlertCircle } from 'lucide-react';
import CodeBlock from '../ui/CodeBlock';

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

export default function ChallengeSection({ onComplete }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Interactive sandbox state
  const [cacheMemory, setCacheMemory] = useState({});
  const [databaseMemory, setDatabaseMemory] = useState({
    'course:101': { id: '101', title: 'Distributed Systems & Redis', instructor: 'Kalvium Staff', price: 99 },
    'course:102': { id: '102', title: 'Database Indexing & Query Tuning', instructor: 'DB Expert', price: 129 },
  });
  const [selectedPattern, setSelectedPattern] = useState('cache-aside');
  const [requestedKey, setRequestedKey] = useState('course:101');
  const [writePayload, setWritePayload] = useState({ price: 149 });
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (isInView) onComplete?.();
  }, [isInView]);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [{ time: timestamp, message, type }, ...prev].slice(0, 10));
  };

  const handleRead = () => {
    const key = requestedKey.trim();
    if (!key) return;

    addLog(`➡️ Client requests READ for key "${key}"`, 'info');

    if (cacheMemory[key]) {
      addLog(`⚡ [CACHE HIT] Found "${key}" in Redis: ${JSON.stringify(cacheMemory[key])}`, 'success');
      return;
    }

    addLog(`❌ [CACHE MISS] "${key}" not in Redis. Falling back to DB...`, 'warn');

    if (databaseMemory[key]) {
      const data = databaseMemory[key];
      addLog(`🗄️ [DB HIT] Retrieved from PostgreSQL: ${JSON.stringify(data)}`, 'info');

      if (selectedPattern === 'cache-aside') {
        setCacheMemory(prev => ({ ...prev, [key]: data }));
        addLog(`💾 [POPULATE] Stored "${key}" into Redis (Lazy Loaded)`, 'success');
      }
    } else {
      addLog(`⚠️ [NOT FOUND] Key "${key}" does not exist in Database either!`, 'error');
    }
  };

  const handleWrite = () => {
    const key = requestedKey.trim();
    if (!key) return;

    const currentRecord = databaseMemory[key] || { id: key.split(':')[1] || '999', title: 'New Course' };
    const updatedRecord = { ...currentRecord, ...writePayload, updated_at: new Date().toLocaleTimeString() };

    addLog(`✏️ Client triggers WRITE for key "${key}"`, 'info');

    if (selectedPattern === 'cache-aside') {
      // Update DB and invalidate Cache
      setDatabaseMemory(prev => ({ ...prev, [key]: updatedRecord }));
      setCacheMemory(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      addLog(`🗄️ [DB UPDATE] Saved new state to PostgreSQL`, 'info');
      addLog(`🗑️ [CACHE EVICT] Purged "${key}" from Redis to eliminate stale data (DEL)`, 'warn');
    } else if (selectedPattern === 'write-through') {
      // Synchronously write to BOTH
      setDatabaseMemory(prev => ({ ...prev, [key]: updatedRecord }));
      setCacheMemory(prev => ({ ...prev, [key]: updatedRecord }));
      addLog(`🔄 [DUAL WRITE] Synchronously committed to BOTH Postgres & Redis`, 'success');
    }
  };

  const handleFlushCache = () => {
    setCacheMemory({});
    addLog(`🧹 [FLUSHDB] Redis cache completely wiped`, 'warn');
  };

  return (
    <div ref={ref} style={sectionStyle}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <p style={headingStyle}>Chapter 8 • Hands-on Engineering Lab</p>
        <h2 style={titleStyle}>
          Build Your Own <span style={{ color: '#38B2AC' }}>Caching Policy</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '850px', marginBottom: '28px', lineHeight: 1.7 }}>
          Experiment with custom reads and writes in this multi-tier architectural lab. Toggle between Cache-Aside and Write-Through to observe how data synchronization alters cache residency.
        </p>

        {/* Configuration Bar */}
        <div style={{ ...cardStyle, background: 'var(--bg-secondary)', padding: '20px' }}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>STRATEGY:</span>
              <button
                onClick={() => setSelectedPattern('cache-aside')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: selectedPattern === 'cache-aside' ? '#38B2AC' : 'var(--border-color)',
                  background: selectedPattern === 'cache-aside' ? 'rgba(56, 178, 172, 0.15)' : 'transparent',
                  color: selectedPattern === 'cache-aside' ? '#38B2AC' : 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                Cache-Aside (Lazy + DEL)
              </button>
              <button
                onClick={() => setSelectedPattern('write-through')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: selectedPattern === 'write-through' ? '#DC382D' : 'var(--border-color)',
                  background: selectedPattern === 'write-through' ? 'rgba(220, 56, 45, 0.15)' : 'transparent',
                  color: selectedPattern === 'write-through' ? '#DC382D' : 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                Write-Through (Sync Dual)
              </button>
            </div>

            <button
              onClick={handleFlushCache}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-muted)',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <RotateCcw size={14} /> Flush Redis (FLUSHDB)
            </button>
          </div>
        </div>

        {/* Live Lab Workspace */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          {/* Controls Box */}
          <div style={cardStyle}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={18} style={{ color: '#38B2AC' }} /> Operations Controller
            </h4>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>TARGET KEY</label>
              <input
                type="text"
                value={requestedKey}
                onChange={e => setRequestedKey(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button
                onClick={handleRead}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #38B2AC, #319795)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Execute READ
              </button>

              <button
                onClick={handleWrite}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #DC382D, #c0392b)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Execute WRITE (Update Price)
              </button>
            </div>

            {/* Quick keys */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Quick Select:</span>
              {['course:101', 'course:102', 'course:999'].map(k => (
                <button
                  key={k}
                  onClick={() => setRequestedKey(k)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer',
                  }}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          {/* System State Viewers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Redis State */}
            <div style={{ ...cardStyle, marginBottom: 0, padding: '18px', borderLeft: '4px solid #DC382D' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#FF6B6B' }}>🔴 REDIS IN-MEMORY STATE</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{Object.keys(cacheMemory).length} keys cached</span>
              </div>
              <pre style={{
                background: '#12121e',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                color: Object.keys(cacheMemory).length > 0 ? '#48BB78' : 'var(--text-muted)',
                maxHeight: '120px',
                overflowY: 'auto',
                margin: 0,
              }}>
                {Object.keys(cacheMemory).length > 0
                  ? JSON.stringify(cacheMemory, null, 2)
                  : '(Cache is empty)'}
              </pre>
            </div>

            {/* DB State */}
            <div style={{ ...cardStyle, marginBottom: 0, padding: '18px', borderLeft: '4px solid #5B9BD5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#5B9BD5' }}>🗄️ POSTGRESQL PRIMARY DATABASE</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Permanent Disk Store</span>
              </div>
              <pre style={{
                background: '#12121e',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
                maxHeight: '120px',
                overflowY: 'auto',
                margin: 0,
              }}>
                {JSON.stringify(databaseMemory, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Live Terminal Output */}
        <div style={{ ...cardStyle, padding: '18px', background: '#0e0e18' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              &gt;_ ARCHITECTURAL EVENT LOGS
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Recent 10 events</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
            {logs.length === 0 ? (
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                Run a READ or WRITE operation above to see system telemetry.
              </span>
            ) : (
              logs.map((l, idx) => (
                <div key={idx} style={{
                  fontSize: '12.5px',
                  fontFamily: 'var(--font-mono)',
                  display: 'flex',
                  gap: '12px',
                  color: l.type === 'success' ? '#48BB78' : l.type === 'warn' ? '#ECC94B' : l.type === 'error' ? '#FF6B6B' : 'var(--text-secondary)'
                }}>
                  <span style={{ color: 'var(--text-muted)', minWidth: '70px' }}>[{l.time}]</span>
                  <span>{l.message}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Challenge Completion Certificate Banner */}
        <div style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(56, 178, 172, 0.15), rgba(220, 56, 45, 0.15))',
          border: '1px solid rgba(56, 178, 172, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#38B2AC', marginBottom: '4px' }}>
              🎉 Course Completed!
            </h4>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              You've mastered Cache-Aside, Write-Through, and Invalidation mechanics in 45 minutes.
            </p>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              background: '#38B2AC',
              color: 'white',
              fontWeight: 700,
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Back to Top
          </button>
        </div>
      </motion.div>
    </div>
  );
}

