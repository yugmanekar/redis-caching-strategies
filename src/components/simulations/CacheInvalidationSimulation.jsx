import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Zap, Trash2, RefreshCw, Bell, Timer, Database, Server, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// ─── Color Palette ────────────────────────────────────────────────────────────
const COLORS = {
  redis: '#DC382D',
  redisLight: '#ff6b5e',
  database: '#336791',
  databaseLight: '#4a8bb5',
  app: '#38B2AC',
  appLight: '#4fd1c5',
  bg: '#1a1a2e',
  bgCard: '#16213e',
  bgCardLight: '#1c2a4a',
  bgInput: '#0f3460',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
  success: '#48bb78',
  warning: '#ecc94b',
  danger: '#fc8181',
  border: '#2d3a5e',
};

// ─── Shared Styles ────────────────────────────────────────────────────────────
const styles = {
  container: {
    background: COLORS.bg,
    borderRadius: '16px',
    padding: '32px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    color: COLORS.text,
    maxWidth: '1100px',
    margin: '0 auto',
    border: `1px solid ${COLORS.border}`,
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 700,
    margin: 0,
    background: `linear-gradient(135deg, ${COLORS.redis}, ${COLORS.app})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '14px',
    color: COLORS.textMuted,
    marginTop: '8px',
  },
  tabBar: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    background: COLORS.bgCard,
    borderRadius: '12px',
    padding: '6px',
    border: `1px solid ${COLORS.border}`,
  },
  tab: (active) => ({
    flex: 1,
    padding: '12px 16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    background: active ? COLORS.redis : 'transparent',
    color: active ? '#fff' : COLORS.textMuted,
  }),
  panel: {
    background: COLORS.bgCard,
    borderRadius: '12px',
    padding: '24px',
    border: `1px solid ${COLORS.border}`,
    minHeight: '480px',
  },
  button: (color = COLORS.redis, small = false) => ({
    padding: small ? '6px 14px' : '10px 20px',
    borderRadius: '8px',
    border: 'none',
    background: color,
    color: '#fff',
    fontSize: small ? '12px' : '14px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.15s ease',
  }),
  cacheItem: (highlight) => ({
    background: highlight ? `${COLORS.redis}22` : COLORS.bgCardLight,
    borderRadius: '10px',
    padding: '14px 18px',
    marginBottom: '10px',
    border: `1px solid ${highlight ? COLORS.redis : COLORS.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  }),
  badge: (color) => ({
    fontSize: '11px',
    fontWeight: 700,
    padding: '3px 10px',
    borderRadius: '20px',
    background: `${color}22`,
    color: color,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  }),
  codeBlock: {
    borderRadius: '10px',
    marginTop: '16px',
    fontSize: '13px',
    border: `1px solid ${COLORS.border}`,
    overflow: 'hidden',
  },
  progressBar: {
    height: '6px',
    borderRadius: '3px',
    background: `${COLORS.border}`,
    overflow: 'hidden',
    flex: 1,
  },
  progressFill: (pct, color) => ({
    height: '100%',
    borderRadius: '3px',
    background: pct > 30 ? color : COLORS.danger,
    width: `${pct}%`,
    transition: 'width 0.3s linear',
  }),
  tooltip: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'help',
  },
  tooltipContent: {
    position: 'absolute',
    bottom: '130%',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#1e293b',
    color: COLORS.text,
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '12px',
    lineHeight: '1.5',
    width: '240px',
    zIndex: 100,
    border: `1px solid ${COLORS.border}`,
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    pointerEvents: 'none',
  },
  consistencyMeter: {
    marginTop: '20px',
    padding: '14px 18px',
    background: COLORS.bgCardLight,
    borderRadius: '10px',
    border: `1px solid ${COLORS.border}`,
  },
  gridRow: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  label: {
    fontSize: '12px',
    color: COLORS.textMuted,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '6px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 700,
    marginBottom: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  select: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: `1px solid ${COLORS.border}`,
    background: COLORS.bgInput,
    color: COLORS.text,
    fontSize: '13px',
    cursor: 'pointer',
    outline: 'none',
  },
  logArea: {
    maxHeight: '140px',
    overflowY: 'auto',
    background: '#0d1117',
    borderRadius: '8px',
    padding: '10px 14px',
    marginTop: '12px',
    fontSize: '12px',
    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
    border: `1px solid ${COLORS.border}`,
  },
  logEntry: (type) => ({
    padding: '2px 0',
    color: type === 'expire' ? COLORS.danger : type === 'set' ? COLORS.success : type === 'event' ? COLORS.warning : COLORS.textMuted,
  }),
};

// ─── Helper: Tooltip Component ────────────────────────────────────────────────
function Tooltip({ text, children }) {
  const [show, setShow] = useState(false);
  return (
    <span
      style={styles.tooltip}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children || <Info size={14} style={{ color: COLORS.textMuted }} />}
      <AnimatePresence>
        {show && (
          <motion.span
            style={styles.tooltipContent}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

// ─── Helper: Consistency Meter ────────────────────────────────────────────────
function ConsistencyMeter({ value }) {
  const color = value > 80 ? COLORS.success : value > 50 ? COLORS.warning : COLORS.danger;
  const label = value > 80 ? 'Highly Consistent' : value > 50 ? 'Moderately Consistent' : 'Low Consistency';
  return (
    <div style={styles.consistencyMeter}>
      <div style={{ ...styles.flex, justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ ...styles.flex, fontSize: '13px', fontWeight: 600 }}>
          <Database size={14} />
          Cache ↔ DB Consistency
          <Tooltip text="Measures how closely the cache reflects the current state of the database. 100% means perfectly in sync." />
        </span>
        <span style={{ fontSize: '14px', fontWeight: 700, color }}>{value}%</span>
      </div>
      <div style={styles.progressBar}>
        <motion.div
          style={{ ...styles.progressFill(value, color) }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div style={{ fontSize: '11px', color: COLORS.textMuted, marginTop: '6px' }}>{label}</div>
    </div>
  );
}

// ─── Helper: Code Snippet ─────────────────────────────────────────────────────
function CodeSnippet({ code, title }) {
  return (
    <div style={styles.codeBlock}>
      {title && (
        <div style={{
          padding: '8px 14px',
          background: '#282c34',
          fontSize: '12px',
          fontWeight: 600,
          color: COLORS.textMuted,
          borderBottom: `1px solid ${COLORS.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <Server size={12} /> {title}
        </div>
      )}
      <SyntaxHighlighter
        language="bash"
        style={atomDark}
        customStyle={{ margin: 0, padding: '14px', background: '#1a1d23', fontSize: '13px' }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

// ─── Helper: Event Log ────────────────────────────────────────────────────────
function EventLog({ logs }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [logs]);
  return (
    <div style={styles.logArea} ref={ref}>
      {logs.length === 0 && <span style={{ color: COLORS.textMuted }}>No events yet…</span>}
      {logs.map((log, i) => (
        <div key={i} style={styles.logEntry(log.type)}>
          <span style={{ opacity: 0.5 }}>[{log.time}]</span> {log.msg}
        </div>
      ))}
    </div>
  );
}

// ─── Unique ID generator ──────────────────────────────────────────────────────
let _uid = 0;
const uid = () => ++_uid;

const timestamp = () => new Date().toLocaleTimeString('en-US', { hour12: false });

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 1: TTL (Time-To-Live) Simulation
// ═══════════════════════════════════════════════════════════════════════════════
function TTLSimulation() {
  const [ttl, setTtl] = useState(10);
  const [items, setItems] = useState([]);
  const [logs, setLogs] = useState([]);
  const [consistency, setConsistency] = useState(100);
  const [staleRead, setStaleRead] = useState(null);
  const intervalRef = useRef(null);

  const addLog = useCallback((msg, type = 'info') => {
    setLogs((prev) => [...prev.slice(-50), { msg, type, time: timestamp() }]);
  }, []);

  // Add a cached item
  const addItem = useCallback(() => {
    const keys = ['user:1001', 'session:abc', 'product:42', 'cart:xyz', 'config:app', 'token:auth', 'rate:limit'];
    const key = keys[Math.floor(Math.random() * keys.length)] + ':' + uid();
    const item = { id: uid(), key, value: `"data_${Math.random().toString(36).slice(2, 6)}"`, ttl, remaining: ttl, createdAt: Date.now() };
    setItems((prev) => [...prev, item]);
    addLog(`SETEX ${key} ${ttl} ${item.value}`, 'set');
  }, [ttl, addLog]);

  // Tick: countdown all items
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setItems((prev) => {
        const now = prev.map((item) => ({ ...item, remaining: Math.max(0, item.remaining - 0.1) }));
        const expired = now.filter((item) => item.remaining <= 0);
        const alive = now.filter((item) => item.remaining > 0);
        expired.forEach((item) => {
          setLogs((p) => [...p.slice(-50), { msg: `Key expired: ${item.key} (TTL=${item.ttl}s)`, type: 'expire', time: timestamp() }]);
        });
        return alive;
      });
    }, 100);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Recalculate consistency based on expired items ratio
  useEffect(() => {
    if (items.length === 0) {
      setConsistency(100);
    } else {
      const avgFreshness = items.reduce((s, i) => s + (i.remaining / i.ttl), 0) / items.length;
      setConsistency(Math.round(avgFreshness * 100));
    }
  }, [items]);

  // Simulate stale read
  const simulateStaleRead = useCallback(() => {
    if (items.length === 0) return;
    const item = items[Math.floor(Math.random() * items.length)];
    setStaleRead(item);
    addLog(`⚠ Stale read on ${item.key} — TTL remaining: ${item.remaining.toFixed(1)}s, but DB value has changed!`, 'expire');
    setConsistency((c) => Math.max(0, c - 25));
    setTimeout(() => setStaleRead(null), 3000);
  }, [items, addLog]);

  const code = `# Set key with TTL (Time-To-Live)
SETEX user:1001 ${ttl} "cached_data"

# Check remaining TTL
TTL user:1001

# Key auto-expires after ${ttl} seconds
# No manual cleanup needed!`;

  return (
    <div>
      <div style={{ ...styles.gridRow, marginBottom: '20px' }}>
        <div style={{ flex: 2 }}>
          <div style={styles.sectionTitle}>
            <Timer size={18} style={{ color: COLORS.redis }} />
            TTL-Based Expiration
            <Tooltip text="TTL (Time-To-Live) automatically removes cache entries after a set duration. Simple but can serve stale data before expiry." />
          </div>

          {/* Controls */}
          <div style={{ ...styles.flex, gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div>
              <div style={styles.label}>TTL Duration</div>
              <select style={styles.select} value={ttl} onChange={(e) => setTtl(Number(e.target.value))}>
                <option value={5}>5 seconds</option>
                <option value={10}>10 seconds</option>
                <option value={20}>20 seconds</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-end' }}>
              <motion.button
                style={styles.button(COLORS.redis)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={addItem}
              >
                <Clock size={14} /> Cache Item
              </motion.button>
              <motion.button
                style={styles.button(COLORS.warning, true)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={simulateStaleRead}
                disabled={items.length === 0}
              >
                <AlertTriangle size={14} /> Stale Read
              </motion.button>
            </div>
          </div>

          {/* Cache Items */}
          <div style={{ minHeight: '180px' }}>
            <AnimatePresence>
              {items.map((item) => {
                const pct = (item.remaining / item.ttl) * 100;
                const isStale = staleRead?.id === item.id;
                return (
                  <motion.div
                    key={item.id}
                    style={styles.cacheItem(isStale)}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 60, scale: 0.8, background: `${COLORS.danger}33` }}
                    transition={{ duration: 0.35 }}
                    layout
                  >
                    <div style={{ minWidth: '140px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>{item.key}</div>
                      <div style={{ fontSize: '11px', color: COLORS.textMuted }}>{item.value}</div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={styles.progressBar}>
                        <div style={styles.progressFill(pct, COLORS.redis)} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700, minWidth: '40px', color: pct > 30 ? COLORS.text : COLORS.danger }}>
                        {item.remaining.toFixed(1)}s
                      </span>
                    </div>
                    {isStale && (
                      <motion.span
                        style={styles.badge(COLORS.warning)}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        STALE
                      </motion.span>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {items.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: COLORS.textMuted, fontSize: '14px' }}>
                Click "Cache Item" to add entries with TTL countdowns
              </div>
            )}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={styles.label}>Redis Commands</div>
          <CodeSnippet code={code} title="TTL Commands" />
          <EventLog logs={logs} />
        </div>
      </div>

      <ConsistencyMeter value={consistency} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 2: Event-Based Invalidation Simulation
// ═══════════════════════════════════════════════════════════════════════════════
function EventBasedSimulation() {
  const [dbValue, setDbValue] = useState('Alice');
  const [cacheValue, setCacheValue] = useState('Alice');
  const [consistency, setConsistency] = useState(100);
  const [logs, setLogs] = useState([]);
  const [animPhase, setAnimPhase] = useState('idle'); // idle | db-update | publish | propagate | invalidate | refresh
  const [pendingValue, setPendingValue] = useState('');
  const [channelMessages, setChannelMessages] = useState([]);

  const addLog = useCallback((msg, type = 'info') => {
    setLogs((prev) => [...prev.slice(-50), { msg, type, time: timestamp() }]);
  }, []);

  const triggerUpdate = useCallback(() => {
    const names = ['Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Hank'];
    const newVal = names[Math.floor(Math.random() * names.length)];
    setPendingValue(newVal);
    setAnimPhase('db-update');
    addLog(`UPDATE users SET name='${newVal}' WHERE id=1001`, 'set');

    // Phase 1: DB Update (500ms)
    setTimeout(() => {
      setDbValue(newVal);
      setConsistency(40);
      setAnimPhase('publish');
      addLog(`PUBLISH cache:invalidate "user:1001"`, 'event');
      setChannelMessages((prev) => [...prev, { id: uid(), msg: `user:1001 → "${newVal}"` }]);

      // Phase 2: Propagate (800ms)
      setTimeout(() => {
        setAnimPhase('propagate');
        addLog(`Subscriber received invalidation event`, 'event');

        // Phase 3: Invalidate cache (600ms)
        setTimeout(() => {
          setAnimPhase('invalidate');
          addLog(`DEL user:1001 (cache invalidated)`, 'expire');

          // Phase 4: Refresh cache (500ms)
          setTimeout(() => {
            setCacheValue(newVal);
            setConsistency(100);
            setAnimPhase('refresh');
            addLog(`SET user:1001 "${newVal}" (cache refreshed)`, 'set');

            setTimeout(() => setAnimPhase('idle'), 800);
          }, 500);
        }, 600);
      }, 800);
    }, 500);
  }, [addLog]);

  const nodeStyle = (color, active) => ({
    width: '130px',
    padding: '18px 14px',
    borderRadius: '14px',
    background: active ? `${color}33` : COLORS.bgCardLight,
    border: `2px solid ${active ? color : COLORS.border}`,
    textAlign: 'center',
    transition: 'all 0.3s ease',
    position: 'relative',
  });

  const arrowLineStyle = (active, color) => ({
    flex: 1,
    height: '3px',
    background: active ? color : COLORS.border,
    position: 'relative',
    transition: 'background 0.3s ease',
    borderRadius: '2px',
  });

  const code = `# Event-Based Cache Invalidation

# On data change, publish event:
PUBLISH cache:invalidate "user:1001"

# Subscriber listens for events:
SUBSCRIBE cache:invalidate

# On event received:
DEL user:1001
# Then re-fetch from DB and cache:
SET user:1001 "new_value"`;

  return (
    <div>
      <div style={{ ...styles.gridRow }}>
        <div style={{ flex: 2 }}>
          <div style={styles.sectionTitle}>
            <Bell size={18} style={{ color: COLORS.warning }} />
            Event-Based (Pub/Sub) Invalidation
            <Tooltip text="When data changes in the database, an event is published to a Redis Pub/Sub channel. Subscribers invalidate or update the cache immediately, ensuring near-real-time consistency." />
          </div>

          {/* Architecture Visualization */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', padding: '24px 0', marginBottom: '8px' }}>
            {/* App / DB Node */}
            <motion.div
              style={nodeStyle(COLORS.database, animPhase === 'db-update')}
              animate={animPhase === 'db-update' ? { scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 0.4 }}
            >
              <Database size={28} style={{ color: COLORS.database, marginBottom: '6px' }} />
              <div style={{ fontSize: '13px', fontWeight: 700 }}>Database</div>
              <div style={{ fontSize: '11px', color: COLORS.textMuted, marginTop: '4px' }}>user:1001</div>
              <motion.div
                style={{ fontSize: '14px', fontWeight: 700, color: COLORS.database, marginTop: '4px' }}
                key={dbValue}
                initial={{ scale: 1.3, color: COLORS.success }}
                animate={{ scale: 1, color: COLORS.database }}
              >
                "{dbValue}"
              </motion.div>
            </motion.div>

            {/* Arrow: DB → Channel */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{ fontSize: '10px', color: animPhase === 'publish' ? COLORS.warning : COLORS.textMuted, fontWeight: 600, marginBottom: '4px' }}>
                PUBLISH
              </div>
              <div style={arrowLineStyle(animPhase === 'publish', COLORS.warning)}>
                {animPhase === 'publish' && (
                  <motion.div
                    style={{ position: 'absolute', top: '-6px', width: '14px', height: '14px', borderRadius: '50%', background: COLORS.warning }}
                    initial={{ left: '0%' }}
                    animate={{ left: '100%' }}
                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                  />
                )}
              </div>
            </div>

            {/* Pub/Sub Channel */}
            <motion.div
              style={{ ...nodeStyle(COLORS.warning, animPhase === 'publish' || animPhase === 'propagate'), width: '140px' }}
              animate={animPhase === 'propagate' ? { scale: [1, 1.06, 1] } : {}}
            >
              <Zap size={28} style={{ color: COLORS.warning, marginBottom: '6px' }} />
              <div style={{ fontSize: '13px', fontWeight: 700 }}>Pub/Sub Channel</div>
              <div style={{ fontSize: '10px', color: COLORS.textMuted, marginTop: '2px' }}>cache:invalidate</div>
              {channelMessages.length > 0 && (
                <motion.div
                  style={{ fontSize: '10px', color: COLORS.warning, marginTop: '4px' }}
                  key={channelMessages.length}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  📨 {channelMessages.length} msg{channelMessages.length > 1 ? 's' : ''}
                </motion.div>
              )}
            </motion.div>

            {/* Arrow: Channel → Cache */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{ fontSize: '10px', color: animPhase === 'propagate' ? COLORS.app : COLORS.textMuted, fontWeight: 600, marginBottom: '4px' }}>
                SUBSCRIBE
              </div>
              <div style={arrowLineStyle(animPhase === 'propagate', COLORS.app)}>
                {animPhase === 'propagate' && (
                  <motion.div
                    style={{ position: 'absolute', top: '-6px', width: '14px', height: '14px', borderRadius: '50%', background: COLORS.app }}
                    initial={{ left: '0%' }}
                    animate={{ left: '100%' }}
                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                  />
                )}
              </div>
            </div>

            {/* Redis Cache Node */}
            <motion.div
              style={nodeStyle(COLORS.redis, animPhase === 'invalidate' || animPhase === 'refresh')}
              animate={animPhase === 'invalidate' ? { scale: [1, 1.08, 1] } : animPhase === 'refresh' ? { scale: [1, 1.05, 1] } : {}}
            >
              <Server size={28} style={{ color: COLORS.redis, marginBottom: '6px' }} />
              <div style={{ fontSize: '13px', fontWeight: 700 }}>Redis Cache</div>
              <div style={{ fontSize: '11px', color: COLORS.textMuted, marginTop: '4px' }}>user:1001</div>
              <motion.div
                style={{ fontSize: '14px', fontWeight: 700, color: COLORS.redis, marginTop: '4px' }}
                key={cacheValue}
                initial={{ scale: 1.3, color: COLORS.success }}
                animate={{ scale: 1, color: COLORS.redis }}
              >
                "{cacheValue}"
              </motion.div>
              {animPhase === 'invalidate' && (
                <motion.div
                  style={{ ...styles.badge(COLORS.danger), position: 'absolute', top: '-10px', right: '-10px' }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  DEL
                </motion.div>
              )}
              {animPhase === 'refresh' && (
                <motion.div
                  style={{ ...styles.badge(COLORS.success), position: 'absolute', top: '-10px', right: '-10px' }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  SET
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Trigger Button */}
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <motion.button
              style={{ ...styles.button(COLORS.database), opacity: animPhase !== 'idle' ? 0.5 : 1 }}
              whileHover={animPhase === 'idle' ? { scale: 1.04 } : {}}
              whileTap={animPhase === 'idle' ? { scale: 0.96 } : {}}
              onClick={triggerUpdate}
              disabled={animPhase !== 'idle'}
            >
              <Database size={16} />
              {animPhase !== 'idle' ? 'Processing…' : 'Simulate Database Update'}
            </motion.button>
          </div>

          {/* Status */}
          <AnimatePresence>
            {animPhase !== 'idle' && (
              <motion.div
                style={{ textAlign: 'center', padding: '8px', fontSize: '13px', borderRadius: '8px', background: `${COLORS.warning}15`, color: COLORS.warning, fontWeight: 600 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {animPhase === 'db-update' && '📝 Updating database…'}
                {animPhase === 'publish' && '📡 Publishing invalidation event…'}
                {animPhase === 'propagate' && '📨 Event propagating to subscriber…'}
                {animPhase === 'invalidate' && '🗑️ Invalidating stale cache entry…'}
                {animPhase === 'refresh' && '✅ Cache refreshed with new data!'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={styles.label}>Redis Commands</div>
          <CodeSnippet code={code} title="Pub/Sub Commands" />
          <EventLog logs={logs} />
        </div>
      </div>

      <ConsistencyMeter value={consistency} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 3: Manual Invalidation Simulation
// ═══════════════════════════════════════════════════════════════════════════════
function ManualSimulation() {
  const [items, setItems] = useState([
    { id: uid(), key: 'user:1001', value: '"Alice"', status: 'cached' },
    { id: uid(), key: 'session:abc', value: '"{token: xyz}"', status: 'cached' },
    { id: uid(), key: 'product:42', value: '"Redis T-shirt"', status: 'cached' },
    { id: uid(), key: 'cart:user1', value: '"[item1, item2]"', status: 'cached' },
    { id: uid(), key: 'config:app', value: '"{debug: false}"', status: 'cached' },
  ]);
  const [logs, setLogs] = useState([]);
  const [consistency, setConsistency] = useState(100);
  const [newKey, setNewKey] = useState('');
  const [newVal, setNewVal] = useState('');

  const addLog = useCallback((msg, type = 'info') => {
    setLogs((prev) => [...prev.slice(-50), { msg, type, time: timestamp() }]);
  }, []);

  const deleteKey = useCallback((item) => {
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: 'deleting' } : i)));
    addLog(`DEL ${item.key}`, 'expire');
    setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    }, 500);
    setConsistency((c) => Math.min(100, c + 5));
  }, [addLog]);

  const updateKey = useCallback((item) => {
    const newValue = `"updated_${Math.random().toString(36).slice(2, 6)}"`;
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, value: newValue, status: 'updating' } : i)));
    addLog(`SET ${item.key} ${newValue}`, 'set');
    setTimeout(() => {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: 'cached' } : i)));
    }, 600);
    setConsistency(100);
  }, [addLog]);

  const flushAll = useCallback(() => {
    addLog('FLUSHALL — All keys removed!', 'expire');
    setItems((prev) => prev.map((i) => ({ ...i, status: 'deleting' })));
    setTimeout(() => {
      setItems([]);
      setConsistency(100);
    }, 600);
  }, [addLog]);

  const addItem = useCallback(() => {
    const key = newKey.trim() || `key:${uid()}`;
    const val = newVal.trim() || `"value_${Math.random().toString(36).slice(2, 6)}"`;
    setItems((prev) => [...prev, { id: uid(), key, value: val, status: 'new' }]);
    addLog(`SET ${key} ${val}`, 'set');
    setNewKey('');
    setNewVal('');
    setTimeout(() => {
      setItems((prev) => prev.map((i) => (i.status === 'new' ? { ...i, status: 'cached' } : i)));
    }, 600);
  }, [newKey, newVal, addLog]);

  // Slowly degrade consistency to simulate drift
  useEffect(() => {
    const t = setInterval(() => {
      if (items.length > 0) {
        setConsistency((c) => Math.max(20, c - 1));
      }
    }, 2000);
    return () => clearInterval(t);
  }, [items.length]);

  const code = `# Manual Cache Invalidation

# Delete a specific key
DEL user:1001

# Update a key with new value
SET user:1001 "new_value"

# Flush entire cache (use with caution!)
FLUSHALL

# Delete multiple keys by pattern
# (requires SCAN + DEL in a loop)
SCAN 0 MATCH "session:*" COUNT 100`;

  const statusColor = { cached: COLORS.success, deleting: COLORS.danger, updating: COLORS.warning, new: COLORS.app };

  return (
    <div>
      <div style={{ ...styles.gridRow }}>
        <div style={{ flex: 2 }}>
          <div style={styles.sectionTitle}>
            <Trash2 size={18} style={{ color: COLORS.danger }} />
            Manual Cache Invalidation
            <Tooltip text="Explicitly remove or update cache entries when you know the data has changed. Gives full control but requires careful management." />
          </div>

          {/* Add new key */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <input
              style={{ ...styles.select, flex: 1, minWidth: '120px' }}
              placeholder="Key (e.g. user:123)"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
            />
            <input
              style={{ ...styles.select, flex: 1, minWidth: '120px' }}
              placeholder='Value (e.g. "data")'
              value={newVal}
              onChange={(e) => setNewVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
            />
            <motion.button
              style={styles.button(COLORS.app, true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={addItem}
            >
              + Add
            </motion.button>
            <motion.button
              style={{ ...styles.button(COLORS.danger, true), opacity: items.length === 0 ? 0.4 : 1 }}
              whileHover={items.length > 0 ? { scale: 1.04 } : {}}
              whileTap={items.length > 0 ? { scale: 0.96 } : {}}
              onClick={flushAll}
              disabled={items.length === 0}
            >
              <Trash2 size={12} /> Flush All
            </motion.button>
          </div>

          {/* Item List */}
          <div style={{ minHeight: '220px' }}>
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  style={styles.cacheItem(item.status === 'updating')}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{
                    opacity: item.status === 'deleting' ? 0.3 : 1,
                    y: 0,
                    x: item.status === 'deleting' ? 60 : 0,
                    scale: item.status === 'deleting' ? 0.9 : 1,
                  }}
                  exit={{ opacity: 0, x: 80, scale: 0.7 }}
                  transition={{ duration: 0.35 }}
                  layout
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {item.key}
                      <span style={styles.badge(statusColor[item.status] || COLORS.textMuted)}>
                        {item.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: COLORS.textMuted, marginTop: '2px', fontFamily: 'monospace' }}>{item.value}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <motion.button
                      style={styles.button(COLORS.warning, true)}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => updateKey(item)}
                      title="Update this key"
                    >
                      <RefreshCw size={12} /> Update
                    </motion.button>
                    <motion.button
                      style={styles.button(COLORS.danger, true)}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => deleteKey(item)}
                      title="Delete this key"
                    >
                      <XCircle size={12} /> Delete
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {items.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: COLORS.textMuted, fontSize: '14px' }}>
                Cache is empty. Add items above or they were flushed.
              </div>
            )}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={styles.label}>Redis Commands</div>
          <CodeSnippet code={code} title="Manual Invalidation" />
          <EventLog logs={logs} />
        </div>
      </div>

      <ConsistencyMeter value={consistency} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════════════════
const TABS = [
  { id: 'ttl', label: 'TTL Expiration', icon: Timer, color: COLORS.redis },
  { id: 'event', label: 'Event-Based', icon: Zap, color: COLORS.warning },
  { id: 'manual', label: 'Manual', icon: Trash2, color: COLORS.danger },
];

export default function CacheInvalidationSimulation() {
  const [activeTab, setActiveTab] = useState('ttl');

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Cache Invalidation Strategies</h2>
        <p style={styles.subtitle}>
          Explore how Redis handles cache invalidation — one of the hardest problems in computer science
        </p>
      </div>

      {/* Tab Bar */}
      <div style={styles.tabBar}>
        {TABS.map((tab) => (
          <motion.button
            key={tab.id}
            style={styles.tab(activeTab === tab.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={16} />
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={styles.panel}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === 'ttl' && <TTLSimulation />}
            {activeTab === 'event' && <EventBasedSimulation />}
            {activeTab === 'manual' && <ManualSimulation />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
