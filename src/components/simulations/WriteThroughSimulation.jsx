import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Server, HardDrive, Edit, Search, ArrowRight, Clock, Trash2, BarChart3, RefreshCw } from 'lucide-react';

/* ─────────────────────── colour palette ─────────────────────── */
const COLORS = {
  bg: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceLight: '#F1F5F9',
  border: '#E2E8F0',
  text: '#0F172A',
  textDim: '#64748B',
  redis: '#D92D20',
  db: '#2E5B82',
  app: '#079455',
  hit: '#079455',
  miss: '#D92D20',
  accent: '#B54708',
  white: '#0F172A',
};

/* ─────────────────── reusable inline styles ─────────────────── */
const styles = {
  wrapper: {
    background: COLORS.bg,
    color: COLORS.text,
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    padding: '28px 24px',
    borderRadius: 16,
    minHeight: 520,
    position: 'relative',
    overflow: 'hidden',
  },
  heading: {
    fontSize: 26,
    fontWeight: 700,
    marginBottom: 4,
    color: COLORS.white,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textDim,
    marginBottom: 24,
    lineHeight: 1.5,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
    marginBottom: 24,
  },
  card: {
    background: COLORS.surface,
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
    padding: '18px 20px',
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: COLORS.textDim,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: `1px solid ${COLORS.border}`,
    background: COLORS.bg,
    color: COLORS.text,
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Fira Code', 'Consolas', monospace",
  },
  btn: (color) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 18px',
    borderRadius: 8,
    border: 'none',
    background: color,
    color: '#fff',
    fontWeight: 600,
    fontSize: 13,
    cursor: 'pointer',
    marginTop: 10,
    transition: 'opacity .15s',
  }),
  /* diagram boxes */
  diagramRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    padding: '18px 0',
    position: 'relative',
    minHeight: 140,
  },
  box: (color) => ({
    width: 140,
    height: 110,
    borderRadius: 14,
    border: `2px solid ${color}`,
    background: `${color}18`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    position: 'relative',
    zIndex: 2,
  }),
  boxLabel: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.04em',
  },
  /* arrow connectors */
  connector: {
    width: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
  },
  connectorLine: {
    width: '100%',
    height: 2,
    background: COLORS.border,
    position: 'relative',
  },
  /* stats row */
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 12,
    marginBottom: 20,
  },
  stat: {
    background: COLORS.surface,
    borderRadius: 10,
    border: `1px solid ${COLORS.border}`,
    padding: '14px 16px',
    textAlign: 'center',
  },
  statValue: {
    fontSize: 26,
    fontWeight: 700,
    color: COLORS.white,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textDim,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  /* logs */
  logBox: {
    background: COLORS.bg,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 10,
    padding: '12px 14px',
    maxHeight: 200,
    overflowY: 'auto',
    fontSize: 12,
    fontFamily: "'Fira Code', 'Consolas', monospace",
    lineHeight: 1.7,
  },
  logEntry: (color) => ({
    color,
    display: 'block',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  }),
  /* comparison table */
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 13,
  },
  th: {
    textAlign: 'left',
    padding: '10px 12px',
    borderBottom: `1px solid ${COLORS.border}`,
    color: COLORS.textDim,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  td: {
    padding: '10px 12px',
    borderBottom: `1px solid ${COLORS.border}22`,
    color: COLORS.text,
  },
  badge: (bg) => ({
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 6,
    background: `${bg}30`,
    color: bg,
    fontSize: 11,
    fontWeight: 600,
  }),
};

/* ───────────── animated data packet travelling between boxes ───────────── */
const Packet = ({ from, to, color, label, onDone }) => (
  <motion.div
    initial={{ x: from, opacity: 0, scale: 0.6 }}
    animate={{ x: to, opacity: [0, 1, 1, 0], scale: [0.6, 1, 1, 0.6] }}
    transition={{ duration: 0.8, ease: 'easeInOut' }}
    onAnimationComplete={onDone}
    style={{
      position: 'absolute',
      top: '50%',
      left: 0,
      transform: 'translateY(-50%)',
      background: color,
      color: '#fff',
      fontSize: 10,
      fontWeight: 700,
      padding: '4px 10px',
      borderRadius: 20,
      whiteSpace: 'nowrap',
      zIndex: 10,
      pointerEvents: 'none',
      boxShadow: `0 0 14px ${color}88`,
    }}
  >
    {label}
  </motion.div>
);

/* ────────────────── pulsing glow on a box ────────────────── */
const PulseRing = ({ color }) => (
  <motion.div
    initial={{ opacity: 0.7, scale: 1 }}
    animate={{ opacity: 0, scale: 1.45 }}
    transition={{ duration: 0.7 }}
    style={{
      position: 'absolute',
      inset: -6,
      borderRadius: 18,
      border: `2px solid ${color}`,
      zIndex: 0,
      pointerEvents: 'none',
    }}
  />
);

/* ────────────── latency timer display ────────────── */
const LatencyTimer = ({ running, elapsed }) => (
  <motion.div
    initial={{ opacity: 0, y: -6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -6 }}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: `${COLORS.accent}22`,
      border: `1px solid ${COLORS.accent}44`,
      borderRadius: 8,
      padding: '6px 12px',
      fontSize: 13,
      fontWeight: 600,
      color: COLORS.accent,
      fontFamily: "'Fira Code', monospace",
      marginLeft: 12,
    }}
  >
    <Clock size={14} />
    {running ? `${elapsed} ms …` : `${elapsed} ms`}
  </motion.div>
);

/* ══════════════════════ main component ══════════════════════ */
const WriteThroughSimulation = () => {
  /* ── form state ── */
  const [writeKey, setWriteKey] = useState('product:1');
  const [writeValue, setWriteValue] = useState('{"name":"Laptop","price":999}');
  const [readKey, setReadKey] = useState('product:1');

  /* ── simulation data stores ── */
  const [cache, setCache] = useState({});
  const [database, setDatabase] = useState({});

  /* ── stats ── */
  const [writeCount, setWriteCount] = useState(0);
  const [readCount, setReadCount] = useState(0);
  const [cacheHits, setCacheHits] = useState(0);
  const [cacheMisses, setCacheMisses] = useState(0);

  /* ── animation state ── */
  const [animating, setAnimating] = useState(false);
  const [packets, setPackets] = useState([]);
  const [pulseApp, setPulseApp] = useState(false);
  const [pulseCache, setPulseCache] = useState(false);
  const [pulseDb, setPulseDb] = useState(false);

  /* ── latency timer ── */
  const [latencyRunning, setLatencyRunning] = useState(false);
  const [latencyMs, setLatencyMs] = useState(0);
  const latencyInterval = useRef(null);

  /* ── logs ── */
  const [logs, setLogs] = useState([]);
  const logBoxRef = useRef(null);
  const pktId = useRef(0);

  const addLog = useCallback((msg, color = COLORS.text) => {
    const ts = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev.slice(-80), { id: Date.now() + Math.random(), ts, msg, color }]);
  }, []);

  useEffect(() => {
    if (logBoxRef.current) logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
  }, [logs]);

  /* ── start / stop latency counter ── */
  const startLatency = useCallback(() => {
    setLatencyMs(0);
    setLatencyRunning(true);
    const start = performance.now();
    latencyInterval.current = setInterval(() => {
      setLatencyMs(Math.round(performance.now() - start));
    }, 30);
  }, []);

  const stopLatency = useCallback((finalMs) => {
    clearInterval(latencyInterval.current);
    setLatencyMs(finalMs);
    setLatencyRunning(false);
  }, []);

  /* ──────────── WRITE-THROUGH flow ──────────── */
  const handleWrite = useCallback(() => {
    if (animating || !writeKey.trim()) return;
    setAnimating(true);
    startLatency();
    const id1 = ++pktId.current;
    const id2 = ++pktId.current;

    addLog(`WRITE  key="${writeKey}"`, COLORS.app);

    /* step 1 – packet from App ➜ Cache AND App ➜ DB simultaneously */
    setPulseApp(true);
    setTimeout(() => setPulseApp(false), 700);

    setPackets([
      { id: id1, from: 70, to: 210, color: COLORS.redis, label: 'SET cache', type: 'toCache' },
      { id: id2, from: 70, to: 440, color: COLORS.db, label: 'SET db', type: 'toDb' },
    ]);

    /* step 2 – after animation, update stores */
    setTimeout(() => {
      setCache((c) => ({ ...c, [writeKey]: writeValue }));
      setPulseCache(true);
      setTimeout(() => setPulseCache(false), 700);
      addLog(`  ✓ Cache updated  key="${writeKey}"`, COLORS.redis);
    }, 800);

    setTimeout(() => {
      setDatabase((d) => ({ ...d, [writeKey]: writeValue }));
      setPulseDb(true);
      setTimeout(() => setPulseDb(false), 700);
      addLog(`  ✓ DB updated     key="${writeKey}"`, COLORS.db);
    }, 1000);

    /* step 3 – done */
    setTimeout(() => {
      stopLatency(120);
      setWriteCount((c) => c + 1);
      addLog(`  ⏱  Write latency ~120 ms (cache + DB sync)`, COLORS.accent);
      setPackets([]);
      setAnimating(false);
    }, 1300);
  }, [animating, writeKey, writeValue, addLog, startLatency, stopLatency]);

  /* ──────────── READ flow ──────────── */
  const handleRead = useCallback(() => {
    if (animating || !readKey.trim()) return;
    setAnimating(true);
    startLatency();
    const id1 = ++pktId.current;

    addLog(`READ   key="${readKey}"`, COLORS.app);
    setPulseApp(true);
    setTimeout(() => setPulseApp(false), 700);

    const hit = cache.hasOwnProperty(readKey);

    if (hit) {
      /* Cache HIT — read directly from cache */
      setPackets([{ id: id1, from: 70, to: 210, color: COLORS.hit, label: 'GET cache', type: 'toCache' }]);

      setTimeout(() => {
        setPulseCache(true);
        setTimeout(() => setPulseCache(false), 700);
        addLog(`  ✓ Cache HIT   val=${cache[readKey]}`, COLORS.hit);
      }, 800);

      /* return packet */
      setTimeout(() => {
        const id3 = ++pktId.current;
        setPackets([{ id: id3, from: 210, to: 70, color: COLORS.hit, label: 'HIT ✓', type: 'toApp' }]);
      }, 1000);

      setTimeout(() => {
        stopLatency(5);
        setReadCount((c) => c + 1);
        setCacheHits((c) => c + 1);
        addLog(`  ⏱  Read latency ~5 ms (cache hit)`, COLORS.accent);
        setPackets([]);
        setAnimating(false);
      }, 1500);
    } else {
      /* Cache MISS — key was never written through this strategy */
      setPackets([{ id: id1, from: 70, to: 210, color: COLORS.miss, label: 'GET cache', type: 'toCache' }]);

      setTimeout(() => {
        setPulseCache(true);
        setTimeout(() => setPulseCache(false), 700);
        addLog(`  ✗ Cache MISS  (key not written via write-through)`, COLORS.miss);
      }, 800);

      /* fallback – read from DB */
      setTimeout(() => {
        const id3 = ++pktId.current;
        setPackets([{ id: id3, from: 210, to: 440, color: COLORS.db, label: 'GET db', type: 'toDb' }]);
        addLog(`  → Falling back to DB…`, COLORS.db);
      }, 1100);

      setTimeout(() => {
        setPulseDb(true);
        setTimeout(() => setPulseDb(false), 700);
        const dbVal = database[readKey];
        if (dbVal !== undefined) {
          addLog(`  ✓ DB found val=${dbVal}`, COLORS.db);
          setCache((c) => ({ ...c, [readKey]: dbVal }));
          addLog(`  ✓ Cache populated for next read`, COLORS.redis);
        } else {
          addLog(`  ✗ Key not found in DB either`, COLORS.miss);
        }
      }, 1600);

      setTimeout(() => {
        stopLatency(45);
        setReadCount((c) => c + 1);
        setCacheMisses((c) => c + 1);
        addLog(`  ⏱  Read latency ~45 ms (cache miss + DB)`, COLORS.accent);
        setPackets([]);
        setAnimating(false);
      }, 2000);
    }
  }, [animating, readKey, cache, database, addLog, startLatency, stopLatency]);

  /* ── reset ── */
  const handleReset = () => {
    setCache({});
    setDatabase({});
    setWriteCount(0);
    setReadCount(0);
    setCacheHits(0);
    setCacheMisses(0);
    setLogs([]);
    setPackets([]);
    setAnimating(false);
    clearInterval(latencyInterval.current);
    setLatencyRunning(false);
    setLatencyMs(0);
  };

  const hitRate = readCount > 0 ? Math.round((cacheHits / readCount) * 100) : 0;

  /* ════════════════════════ RENDER ════════════════════════ */
  return (
    <div style={styles.wrapper}>
      {/* header */}
      <div style={styles.heading}>
        <RefreshCw size={22} color={COLORS.app} />
        Write-Through Cache Simulation
        <AnimatePresence>
          {(latencyRunning || latencyMs > 0) && (
            <LatencyTimer running={latencyRunning} elapsed={latencyMs} />
          )}
        </AnimatePresence>
      </div>
      <p style={styles.subtitle}>
        Every write goes to <strong style={{ color: COLORS.redis }}>Cache</strong> and{' '}
        <strong style={{ color: COLORS.db }}>Database</strong> simultaneously — reads are always
        consistent, but writes are slower.
      </p>

      {/* ─── visual diagram ─── */}
      <div style={{ ...styles.card, marginBottom: 20 }}>
        <div style={styles.label}>Data Flow Diagram</div>
        <div style={styles.diagramRow}>
          {/* APP box */}
          <motion.div style={styles.box(COLORS.app)} layout>
            {pulseApp && <PulseRing color={COLORS.app} />}
            <Server size={28} color={COLORS.app} />
            <span style={{ ...styles.boxLabel, color: COLORS.app }}>Client / App</span>
          </motion.div>

          {/* connector 1 */}
          <div style={styles.connector}>
            <div style={styles.connectorLine} />
            <AnimatePresence>
              {packets
                .filter((p) => p.type === 'toCache' || p.type === 'toApp')
                .map((p) => (
                  <Packet key={p.id} from={p.from - 160} to={p.to - 160} color={p.color} label={p.label} onDone={() => {}} />
                ))}
            </AnimatePresence>
          </div>

          {/* CACHE box */}
          <motion.div style={styles.box(COLORS.redis)} layout>
            {pulseCache && <PulseRing color={COLORS.redis} />}
            <Database size={28} color={COLORS.redis} />
            <span style={{ ...styles.boxLabel, color: COLORS.redis }}>Redis Cache</span>
            <span style={{ fontSize: 10, color: COLORS.textDim }}>{Object.keys(cache).length} keys</span>
          </motion.div>

          {/* connector 2 */}
          <div style={styles.connector}>
            <div style={styles.connectorLine} />
            <AnimatePresence>
              {packets
                .filter((p) => p.type === 'toDb')
                .map((p) => (
                  <Packet key={p.id} from={p.from - 380} to={p.to - 380} color={p.color} label={p.label} onDone={() => {}} />
                ))}
            </AnimatePresence>
          </div>

          {/* DB box */}
          <motion.div style={styles.box(COLORS.db)} layout>
            {pulseDb && <PulseRing color={COLORS.db} />}
            <HardDrive size={28} color={COLORS.db} />
            <span style={{ ...styles.boxLabel, color: COLORS.db }}>Database</span>
            <span style={{ fontSize: 10, color: COLORS.textDim }}>{Object.keys(database).length} rows</span>
          </motion.div>
        </div>
      </div>

      {/* ─── inputs ─── */}
      <div style={styles.grid}>
        {/* write panel */}
        <div style={styles.card}>
          <div style={{ ...styles.label, color: COLORS.redis }}>
            <Edit size={13} style={{ marginRight: 4, verticalAlign: -2 }} />
            Write Data (Write-Through)
          </div>
          <input
            style={styles.input}
            placeholder="Key, e.g. product:1"
            value={writeKey}
            onChange={(e) => setWriteKey(e.target.value)}
          />
          <div style={{ height: 8 }} />
          <input
            style={styles.input}
            placeholder='Value JSON, e.g. {"name":"Laptop"}'
            value={writeValue}
            onChange={(e) => setWriteValue(e.target.value)}
          />
          <button style={styles.btn(COLORS.redis)} onClick={handleWrite} disabled={animating}>
            <ArrowRight size={14} /> Write Through
          </button>
        </div>

        {/* read panel */}
        <div style={styles.card}>
          <div style={{ ...styles.label, color: COLORS.app }}>
            <Search size={13} style={{ marginRight: 4, verticalAlign: -2 }} />
            Read Data
          </div>
          <input
            style={styles.input}
            placeholder="Key to read, e.g. product:1"
            value={readKey}
            onChange={(e) => setReadKey(e.target.value)}
          />
          <button style={styles.btn(COLORS.app)} onClick={handleRead} disabled={animating}>
            <Search size={14} /> Read Key
          </button>
          <p style={{ fontSize: 11, color: COLORS.textDim, marginTop: 8, lineHeight: 1.45 }}>
            Keys written through this strategy always produce a <strong style={{ color: COLORS.hit }}>cache HIT</strong>.
          </p>
        </div>
      </div>

      {/* ─── stats ─── */}
      <div style={styles.statsRow}>
        <div style={styles.stat}>
          <div style={{ ...styles.statValue, color: COLORS.redis }}>{writeCount}</div>
          <div style={styles.statLabel}>Writes</div>
        </div>
        <div style={styles.stat}>
          <div style={{ ...styles.statValue, color: COLORS.app }}>{readCount}</div>
          <div style={styles.statLabel}>Reads</div>
        </div>
        <div style={styles.stat}>
          <div style={{ ...styles.statValue, color: COLORS.hit }}>{cacheHits}</div>
          <div style={styles.statLabel}>Cache Hits</div>
        </div>
        <div style={styles.stat}>
          <div style={{ ...styles.statValue, color: hitRate === 100 ? COLORS.hit : COLORS.accent }}>{hitRate}%</div>
          <div style={styles.statLabel}>Hit Rate</div>
        </div>
      </div>

      {/* ─── comparison + logs ─── */}
      <div style={styles.grid}>
        {/* comparison */}
        <div style={styles.card}>
          <div style={styles.label}>
            <BarChart3 size={13} style={{ marginRight: 4, verticalAlign: -2 }} />
            Write-Through vs Cache-Aside
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Metric</th>
                <th style={styles.th}>Write-Through</th>
                <th style={styles.th}>Cache-Aside</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.td}>Write Latency</td>
                <td style={styles.td}>
                  <span style={styles.badge(COLORS.miss)}>~120 ms</span>
                </td>
                <td style={styles.td}>
                  <span style={styles.badge(COLORS.hit)}>~50 ms</span>
                </td>
              </tr>
              <tr>
                <td style={styles.td}>Read Latency (hit)</td>
                <td style={styles.td}>
                  <span style={styles.badge(COLORS.hit)}>~5 ms</span>
                </td>
                <td style={styles.td}>
                  <span style={styles.badge(COLORS.hit)}>~5 ms</span>
                </td>
              </tr>
              <tr>
                <td style={styles.td}>Data Consistency</td>
                <td style={styles.td}>
                  <span style={styles.badge(COLORS.hit)}>Strong</span>
                </td>
                <td style={styles.td}>
                  <span style={styles.badge(COLORS.accent)}>Eventual</span>
                </td>
              </tr>
              <tr>
                <td style={styles.td}>Cache Hit Rate</td>
                <td style={styles.td}>
                  <span style={styles.badge(COLORS.hit)}>100%</span>
                </td>
                <td style={styles.td}>
                  <span style={styles.badge(COLORS.accent)}>Variable</span>
                </td>
              </tr>
              <tr>
                <td style={styles.td}>Stale Data Risk</td>
                <td style={styles.td}>
                  <span style={styles.badge(COLORS.hit)}>None</span>
                </td>
                <td style={styles.td}>
                  <span style={styles.badge(COLORS.miss)}>Possible</span>
                </td>
              </tr>
              <tr>
                <td style={styles.td}>Write Complexity</td>
                <td style={styles.td}>
                  <span style={styles.badge(COLORS.accent)}>Higher</span>
                </td>
                <td style={styles.td}>
                  <span style={styles.badge(COLORS.hit)}>Lower</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* logs */}
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={styles.label}>Operation Logs</div>
            <button
              onClick={handleReset}
              style={{
                background: 'transparent',
                border: `1px solid ${COLORS.border}`,
                color: COLORS.textDim,
                borderRadius: 6,
                padding: '4px 10px',
                fontSize: 11,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Trash2 size={11} /> Reset
            </button>
          </div>
          <div style={styles.logBox} ref={logBoxRef}>
            {logs.length === 0 && (
              <span style={{ color: COLORS.textDim, fontStyle: 'italic' }}>
                No operations yet — try writing a key…
              </span>
            )}
            {logs.map((l) => (
              <span key={l.id} style={styles.logEntry(l.color)}>
                <span style={{ color: COLORS.textDim }}>[{l.ts}]</span> {l.msg}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteThroughSimulation;
