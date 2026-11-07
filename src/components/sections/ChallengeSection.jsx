import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Terminal, RotateCcw } from 'lucide-react';

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
  padding: '28px',
  marginBottom: '24px',
  boxShadow: 'var(--shadow-card)',
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
      setDatabaseMemory(prev => ({ ...prev, [key]: updatedRecord }));
      setCacheMemory(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      addLog(`🗄️ [DB UPDATE] Saved new state to PostgreSQL`, 'info');
      addLog(`🗑️ [CACHE EVICT] Purged "${key}" from Redis to eliminate stale data (DEL)`, 'warn');
    } else if (selectedPattern === 'write-through') {
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
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <p style={headingStyle}>Chapter 8 • Hands-on Engineering Lab</p>
        <h2 style={titleStyle}>
          Build Your Own <span style={{ color: '#079455' }}>Caching Policy</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15.5px', maxWidth: '850px', marginBottom: '28px', lineHeight: 1.7 }}>
          Experiment with custom reads and writes in this multi-tier architectural lab. Toggle between Cache-Aside and Write-Through to observe how data synchronization alters cache residency.
        </p>

        {/* Configuration Bar */}
        <div style={{ ...cardStyle, background: '#F8FAFC', padding: '18px 22px' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>STRATEGY:</span>
              <button
                onClick={() => setSelectedPattern('cache-aside')}
                style={{
                  padding: '7px 15px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: selectedPattern === 'cache-aside' ? '#079455' : '#E2E8F0',
                  background: selectedPattern === 'cache-aside' ? '#ECFDF3' : '#FFFFFF',
                  color: selectedPattern === 'cache-aside' ? '#027A48' : '#475569',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-subtle)',
                }}
              >
                Cache-Aside (Lazy + DEL)
              </button>
              <button
                onClick={() => setSelectedPattern('write-through')}
                style={{
                  padding: '7px 15px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: selectedPattern === 'write-through' ? '#D92D20' : '#E2E8F0',
                  background: selectedPattern === 'write-through' ? '#FEF3F2' : '#FFFFFF',
                  color: selectedPattern === 'write-through' ? '#B42318' : '#475569',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-subtle)',
                }}
              >
                Write-Through (Sync Dual)
              </button>
            </div>

            <button
              onClick={handleFlushCache}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                color: '#64748B',
                fontSize: '12.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 600,
              }}
            >
              <RotateCcw size={13} /> Flush Redis (FLUSHDB)
            </button>
          </div>
        </div>

        {/* Live Lab Workspace */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          {/* Controls Box */}
          <div style={cardStyle}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0F172A' }}>
              <Terminal size={18} style={{ color: '#079455' }} /> Operations Controller
            </h4>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>TARGET KEY</label>
              <input
                type="text"
                value={requestedKey}
                onChange={e => setRequestedKey(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: '#F8FAFC',
                  border: '1px solid #CBD5E1',
                  color: '#0F172A',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  outline: 'none',
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
                  background: 'linear-gradient(180deg, #079455 0%, #067647 100%)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '13.5px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(7, 148, 85, 0.25)',
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
                  background: 'linear-gradient(180deg, #D92D20 0%, #B42318 100%)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '13.5px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(217, 45, 32, 0.25)',
                }}
              >
                Execute WRITE
              </button>
            </div>

            {/* Quick keys */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Quick Select:</span>
              {['course:101', 'course:102', 'course:999'].map(k => (
                <button
                  key={k}
                  onClick={() => setRequestedKey(k)}
                  style={{
                    padding: '4px 9px',
                    borderRadius: '6px',
                    background: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    color: '#334155',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer',
                    fontWeight: 500,
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
            <div style={{ ...cardStyle, marginBottom: 0, padding: '18px', borderLeft: '4px solid #D92D20' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#D92D20' }}>🔴 REDIS IN-MEMORY STATE</span>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>{Object.keys(cacheMemory).length} keys cached</span>
              </div>
              <pre style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                color: Object.keys(cacheMemory).length > 0 ? '#027A48' : '#94A3B8',
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
            <div style={{ ...cardStyle, marginBottom: 0, padding: '18px', borderLeft: '4px solid #444CE7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#444CE7' }}>🗄️ POSTGRESQL PRIMARY DATABASE</span>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Permanent Disk Store</span>
              </div>
              <pre style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                color: '#334155',
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
        <div style={{ ...cardStyle, padding: '18px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', fontFamily: 'var(--font-mono)' }}>
              &gt;_ ARCHITECTURAL EVENT LOGS
            </span>
            <span style={{ fontSize: '11px', color: '#64748B' }}>Recent 10 events</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
            {logs.length === 0 ? (
              <span style={{ fontSize: '13px', color: '#94A3B8', fontStyle: 'italic' }}>
                Run a READ or WRITE operation above to see system telemetry.
              </span>
            ) : (
              logs.map((l, idx) => (
                <div key={idx} style={{
                  fontSize: '12.5px',
                  fontFamily: 'var(--font-mono)',
                  display: 'flex',
                  gap: '10px',
                  color: l.type === 'success' ? '#079455' : l.type === 'warn' ? '#B54708' : l.type === 'error' ? '#D92D20' : '#334155'
                }}>
                  <span style={{ color: '#94A3B8', minWidth: '70px' }}>[{l.time}]</span>
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
          background: '#ECFDF3',
          border: '1px solid #A6F4C5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#027A48', marginBottom: '4px' }}>
              🎉 Course Completed!
            </h4>
            <p style={{ fontSize: '14px', color: '#334155' }}>
              You've mastered Cache-Aside, Write-Through, and Invalidation mechanics in 45 minutes.
            </p>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              padding: '11px 22px',
              borderRadius: '8px',
              background: '#079455',
              color: 'white',
              fontWeight: 600,
              fontSize: '13.5px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(7, 148, 85, 0.25)',
            }}
          >
            Back to Top
          </button>
        </div>
      </motion.div>
    </div>
  );
}
