import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Server, HardDrive, Search, Trash2, RefreshCw } from 'lucide-react';

// ─── Sample "database" ───────────────────────────────────────────────
const SAMPLE_DB = {
  'user:1': { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  'user:2': { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Developer' },
  'user:3': { id: 3, name: 'Carol Lee', email: 'carol@example.com', role: 'Designer' },
  'user:4': { id: 4, name: 'Dave Patel', email: 'dave@example.com', role: 'DevOps' },
  'user:5': { id: 5, name: 'Eve Martinez', email: 'eve@example.com', role: 'PM' },
};

// ─── Simulation states (state machine) ──────────────────────────────
const STEPS = {
  IDLE: 'IDLE',
  CHECK_CACHE: 'CHECK_CACHE',
  CACHE_HIT: 'CACHE_HIT',
  CACHE_MISS: 'CACHE_MISS',
  FETCH_DB: 'FETCH_DB',
  STORE_CACHE: 'STORE_CACHE',
  DONE: 'DONE',
  NOT_FOUND: 'NOT_FOUND',
};

const STEP_DESCRIPTIONS = {
  [STEPS.IDLE]: 'Ready — enter a key (e.g. user:1) and press Search.',
  [STEPS.CHECK_CACHE]: '① App sends GET to Redis to check the cache…',
  [STEPS.CACHE_HIT]: '✔ Cache HIT — data returned directly from Redis!',
  [STEPS.CACHE_MISS]: '✘ Cache MISS — key not found in Redis.',
  [STEPS.FETCH_DB]: '② App queries the database for the data…',
  [STEPS.STORE_CACHE]: '③ App writes data back into Redis cache (SET)…',
  [STEPS.DONE]: '✔ Data returned to the client.',
  [STEPS.NOT_FOUND]: '⚠ Key does not exist in the database either.',
};

// ─── Colors ─────────────────────────────────────────────────────────
const COLORS = {
  redis: '#D92D20',
  db: '#2E5B82',
  app: '#079455',
  bg: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceLight: '#F1F5F9',
  border: '#E2E8F0',
  text: '#0F172A',
  textDim: '#64748B',
  accent: '#B54708',
  success: '#079455',
  error: '#D92D20',
};

// ─── Helpers ────────────────────────────────────────────────────────
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Reusable box positions (used by arrows & packet animation) ────
const BOX_POSITIONS = { app: 0, cache: 1, db: 2 };

// ─── Component ──────────────────────────────────────────────────────
export default function CacheAsideSimulation() {
  const [query, setQuery] = useState('');
  const [cache, setCache] = useState({});
  const [step, setStep] = useState(STEPS.IDLE);
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState({ hits: 0, misses: 0 });
  const [logs, setLogs] = useState([]);
  const [activeArrow, setActiveArrow] = useState(null); // 'app-cache' | 'cache-app' | 'app-db' | 'db-app' | 'app-cache-store'
  const [packetAnim, setPacketAnim] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const logEndRef = useRef(null);

  const hitRatio =
    stats.hits + stats.misses === 0
      ? '0%'
      : `${Math.round((stats.hits / (stats.hits + stats.misses)) * 100)}%`;

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = useCallback((msg, type = 'info') => {
    setLogs((prev) => [...prev, { msg, type, ts: Date.now() }]);
  }, []);

  // ── Run the full cache-aside flow ──────────────────────────────────
  const runLookup = useCallback(
    async (key) => {
      if (isRunning || !key.trim()) return;
      setIsRunning(true);
      setResult(null);
      const k = key.trim();

      // Step 1 — check cache
      setStep(STEPS.CHECK_CACHE);
      addLog(`GET "${k}" → checking Redis cache…`, 'info');
      setActiveArrow('app-cache');
      setPacketAnim({ from: 'app', to: 'cache' });
      await delay(900);

      if (cache[k]) {
        // ── HIT ──
        setStep(STEPS.CACHE_HIT);
        addLog(`Cache HIT for "${k}"`, 'success');
        setStats((s) => ({ ...s, hits: s.hits + 1 }));
        setActiveArrow('cache-app');
        setPacketAnim({ from: 'cache', to: 'app' });
        await delay(700);
        setResult(cache[k]);
        setStep(STEPS.DONE);
        addLog(`Returned cached data for "${k}"`, 'success');
      } else {
        // ── MISS ──
        setStep(STEPS.CACHE_MISS);
        addLog(`Cache MISS for "${k}"`, 'warn');
        setStats((s) => ({ ...s, misses: s.misses + 1 }));
        setActiveArrow(null);
        setPacketAnim(null);
        await delay(600);

        // Step 2 — fetch from DB
        setStep(STEPS.FETCH_DB);
        addLog(`SELECT * FROM users WHERE key = "${k}"`, 'info');
        setActiveArrow('app-db');
        setPacketAnim({ from: 'app', to: 'db' });
        await delay(1000);

        const dbData = SAMPLE_DB[k] || null;

        if (!dbData) {
          setStep(STEPS.NOT_FOUND);
          addLog(`Key "${k}" not found in database.`, 'error');
          setActiveArrow(null);
          setPacketAnim(null);
          setIsRunning(false);
          return;
        }

        // data coming back from DB
        setActiveArrow('db-app');
        setPacketAnim({ from: 'db', to: 'app' });
        addLog(`Database returned data for "${k}"`, 'success');
        await delay(800);

        // Step 3 — store in cache
        setStep(STEPS.STORE_CACHE);
        addLog(`SET "${k}" → storing in Redis cache…`, 'info');
        setActiveArrow('app-cache-store');
        setPacketAnim({ from: 'app', to: 'cache' });
        setCache((c) => ({ ...c, [k]: dbData }));
        await delay(800);

        setResult(dbData);
        setStep(STEPS.DONE);
        addLog(`Data cached & returned for "${k}"`, 'success');
      }

      setActiveArrow(null);
      setPacketAnim(null);
      setIsRunning(false);
    },
    [cache, isRunning, addLog],
  );

  const handleClearCache = useCallback(() => {
    setCache({});
    setResult(null);
    setStep(STEPS.IDLE);
    setActiveArrow(null);
    setPacketAnim(null);
    addLog('Cache cleared (FLUSHDB)', 'warn');
  }, [addLog]);

  const handleReset = useCallback(() => {
    setCache({});
    setResult(null);
    setStep(STEPS.IDLE);
    setStats({ hits: 0, misses: 0 });
    setLogs([]);
    setActiveArrow(null);
    setPacketAnim(null);
    setQuery('');
    setIsRunning(false);
  }, []);

  // ── Styles ────────────────────────────────────────────────────────
  const styles = {
    wrapper: {
      background: COLORS.bg,
      color: COLORS.text,
      borderRadius: 16,
      padding: 32,
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      maxWidth: 960,
      margin: '0 auto',
    },
    heading: {
      fontSize: 26,
      fontWeight: 700,
      marginBottom: 4,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    },
    subtitle: {
      fontSize: 14,
      color: COLORS.textDim,
      marginBottom: 24,
    },
    /* Search bar */
    searchRow: {
      display: 'flex',
      gap: 8,
      marginBottom: 20,
      flexWrap: 'wrap',
    },
    input: {
      flex: 1,
      minWidth: 180,
      padding: '10px 14px',
      borderRadius: 8,
      border: `1px solid ${COLORS.surfaceLight}`,
      background: COLORS.surface,
      color: COLORS.text,
      fontSize: 15,
      outline: 'none',
    },
    btnPrimary: {
      padding: '10px 20px',
      borderRadius: 8,
      border: 'none',
      background: COLORS.app,
      color: '#fff',
      fontWeight: 600,
      fontSize: 14,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      opacity: isRunning ? 0.5 : 1,
    },
    btnDanger: {
      padding: '10px 16px',
      borderRadius: 8,
      border: 'none',
      background: COLORS.error,
      color: '#fff',
      fontWeight: 600,
      fontSize: 14,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
    },
    btnGhost: {
      padding: '10px 16px',
      borderRadius: 8,
      border: `1px solid ${COLORS.surfaceLight}`,
      background: 'transparent',
      color: COLORS.textDim,
      fontWeight: 600,
      fontSize: 14,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
    },
    /* Quick keys */
    quickRow: {
      display: 'flex',
      gap: 6,
      marginBottom: 24,
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    quickLabel: {
      fontSize: 13,
      color: COLORS.textDim,
      marginRight: 4,
    },
    quickBtn: {
      padding: '5px 12px',
      borderRadius: 6,
      border: `1px solid ${COLORS.surfaceLight}`,
      background: COLORS.surface,
      color: COLORS.text,
      fontSize: 13,
      cursor: 'pointer',
    },
    /* Diagram area */
    diagramArea: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 16,
      marginBottom: 12,
      padding: '32px 0',
    },
    box: (color, isActive) => ({
      flex: '0 0 200px',
      border: `2px solid ${isActive ? color : COLORS.surfaceLight}`,
      borderRadius: 12,
      padding: 20,
      textAlign: 'center',
      background: isActive ? `${color}18` : COLORS.surface,
      transition: 'all 0.3s ease',
      boxShadow: isActive ? `0 0 24px ${color}44` : 'none',
      position: 'relative',
      zIndex: 2,
    }),
    boxIcon: (color) => ({
      color,
      marginBottom: 8,
    }),
    boxTitle: {
      fontWeight: 700,
      fontSize: 15,
      marginBottom: 4,
    },
    boxSub: {
      fontSize: 12,
      color: COLORS.textDim,
    },
    /* Arrows SVG overlay */
    arrowSvg: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 1,
    },
    /* Step banner */
    stepBanner: {
      padding: '10px 16px',
      borderRadius: 8,
      fontSize: 14,
      fontWeight: 600,
      marginBottom: 20,
      background: COLORS.surface,
      borderLeft: `4px solid ${COLORS.accent}`,
    },
    /* Stats row */
    statsRow: {
      display: 'flex',
      gap: 16,
      marginBottom: 20,
      flexWrap: 'wrap',
    },
    statCard: (color) => ({
      flex: 1,
      minWidth: 120,
      padding: '14px 18px',
      borderRadius: 10,
      background: COLORS.surface,
      borderTop: `3px solid ${color}`,
    }),
    statValue: {
      fontSize: 28,
      fontWeight: 800,
    },
    statLabel: {
      fontSize: 12,
      color: COLORS.textDim,
      marginTop: 2,
    },
    /* Result card */
    resultCard: {
      padding: 16,
      borderRadius: 10,
      background: COLORS.surface,
      marginBottom: 20,
      border: `1px solid ${COLORS.surfaceLight}`,
    },
    resultTitle: {
      fontSize: 13,
      fontWeight: 700,
      color: COLORS.textDim,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 8,
    },
    resultPre: {
      fontSize: 13,
      lineHeight: 1.6,
      color: COLORS.success,
      margin: 0,
      whiteSpace: 'pre-wrap',
      fontFamily: "'Fira Code', 'Cascadia Code', monospace",
    },
    /* Log panel */
    logPanel: {
      maxHeight: 200,
      overflowY: 'auto',
      borderRadius: 10,
      background: COLORS.surface,
      padding: 14,
      border: `1px solid ${COLORS.surfaceLight}`,
    },
    logEntry: (type) => ({
      fontSize: 13,
      padding: '3px 0',
      fontFamily: "'Fira Code', 'Cascadia Code', monospace",
      color:
        type === 'success'
          ? COLORS.success
          : type === 'warn'
          ? COLORS.accent
          : type === 'error'
          ? COLORS.error
          : COLORS.textDim,
    }),
    /* Cache contents */
    cacheChip: {
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: 6,
      background: `${COLORS.redis}22`,
      border: `1px solid ${COLORS.redis}55`,
      color: COLORS.redis,
      fontSize: 12,
      fontWeight: 600,
      marginRight: 6,
      marginBottom: 6,
    },
    sectionLabel: {
      fontSize: 13,
      fontWeight: 700,
      color: COLORS.textDim,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 8,
      marginTop: 16,
    },
    tooltip: {
      fontSize: 12,
      color: COLORS.textDim,
      marginTop: 6,
      lineHeight: 1.5,
      fontStyle: 'italic',
    },
  };

  // ── Which boxes are "active" ──────────────────────────────────────
  const appActive = [
    STEPS.CHECK_CACHE,
    STEPS.FETCH_DB,
    STEPS.STORE_CACHE,
    STEPS.DONE,
  ].includes(step);
  const cacheActive = [
    STEPS.CHECK_CACHE,
    STEPS.CACHE_HIT,
    STEPS.CACHE_MISS,
    STEPS.STORE_CACHE,
  ].includes(step);
  const dbActive = [STEPS.FETCH_DB, STEPS.NOT_FOUND].includes(step);

  // ── Packet animation (simple motion.div overlay) ──────────────────
  const renderPacket = () => {
    if (!packetAnim) return null;
    // We'll animate a small coloured circle between two box positions.
    // Positions mapped to approximate % of container width
    const xMap = { app: '14%', cache: '50%', db: '86%' };
    const fromX = xMap[packetAnim.from];
    const toX = xMap[packetAnim.to];
    const color =
      packetAnim.from === 'db' || packetAnim.to === 'db'
        ? COLORS.db
        : COLORS.redis;

    return (
      <motion.div
        key={`${packetAnim.from}-${packetAnim.to}-${Date.now()}`}
        initial={{ left: fromX, top: '50%', opacity: 1, scale: 1 }}
        animate={{ left: toX, opacity: [1, 1, 0.6], scale: [1, 1.3, 1] }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 16px ${color}`,
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />
    );
  };

  // ── Arrow connector (SVG lines between boxes) ─────────────────────
  const renderArrows = () => {
    // Arrow definitions: from‑to => path d values (approximate for a 3-column layout)
    // We draw on a viewBox that stretches across the diagramArea
    const arrowColor = (id) => {
      if (!activeArrow) return COLORS.surfaceLight;
      if (activeArrow === id) return COLORS.accent;
      return COLORS.surfaceLight;
    };
    const arrowWidth = (id) => (activeArrow === id ? 3 : 1.5);

    return (
      <svg style={styles.arrowSvg} viewBox="0 0 900 140" preserveAspectRatio="none">
        {/* App → Cache */}
        <line
          x1="210"
          y1="70"
          x2="340"
          y2="70"
          stroke={arrowColor('app-cache')}
          strokeWidth={arrowWidth('app-cache')}
          strokeDasharray={activeArrow === 'app-cache' ? '8 4' : 'none'}
          markerEnd={activeArrow === 'app-cache' ? 'url(#arrowHead)' : ''}
        />
        {/* Cache → App  (return) */}
        <line
          x1="340"
          y1="85"
          x2="210"
          y2="85"
          stroke={arrowColor('cache-app')}
          strokeWidth={arrowWidth('cache-app')}
          strokeDasharray={activeArrow === 'cache-app' ? '8 4' : 'none'}
          markerEnd={activeArrow === 'cache-app' ? 'url(#arrowHead)' : ''}
        />
        {/* App → Cache (store) */}
        <line
          x1="210"
          y1="55"
          x2="340"
          y2="55"
          stroke={arrowColor('app-cache-store')}
          strokeWidth={arrowWidth('app-cache-store')}
          strokeDasharray={activeArrow === 'app-cache-store' ? '8 4' : 'none'}
          markerEnd={activeArrow === 'app-cache-store' ? 'url(#arrowHead)' : ''}
        />
        {/* Cache → DB */}
        <line
          x1="570"
          y1="70"
          x2="690"
          y2="70"
          stroke={arrowColor('app-db')}
          strokeWidth={arrowWidth('app-db')}
          strokeDasharray={activeArrow === 'app-db' ? '8 4' : 'none'}
          markerEnd={activeArrow === 'app-db' ? 'url(#arrowHead)' : ''}
        />
        {/* DB → Cache (return) */}
        <line
          x1="690"
          y1="85"
          x2="570"
          y2="85"
          stroke={arrowColor('db-app')}
          strokeWidth={arrowWidth('db-app')}
          strokeDasharray={activeArrow === 'db-app' ? '8 4' : 'none'}
          markerEnd={activeArrow === 'db-app' ? 'url(#arrowHead)' : ''}
        />
        {/* Arrowhead marker */}
        <defs>
          <marker id="arrowHead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={COLORS.accent} />
          </marker>
        </defs>
      </svg>
    );
  };

  return (
    <div style={styles.wrapper}>
      {/* ── Header ──────────────────────────────────────────────── */}
      <h2 style={styles.heading}>
        <RefreshCw size={22} color={COLORS.app} />
        Cache-Aside (Lazy Loading) Simulation
      </h2>
      <p style={styles.subtitle}>
        Interact with the simulation below to understand how the Cache-Aside pattern works. The app checks Redis first; on a miss it loads from the DB and populates the cache.
      </p>

      {/* ── Search ──────────────────────────────────────────────── */}
      <div style={styles.searchRow}>
        <input
          style={styles.input}
          placeholder='Enter a key, e.g. "user:1"'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && runLookup(query)}
          disabled={isRunning}
        />
        <button style={styles.btnPrimary} onClick={() => runLookup(query)} disabled={isRunning}>
          <Search size={16} /> Search
        </button>
        <button style={styles.btnDanger} onClick={handleClearCache} disabled={isRunning}>
          <Trash2 size={16} /> Clear Cache
        </button>
        <button style={styles.btnGhost} onClick={handleReset}>
          <RefreshCw size={16} /> Reset All
        </button>
      </div>

      {/* Quick key buttons */}
      <div style={styles.quickRow}>
        <span style={styles.quickLabel}>Quick keys:</span>
        {Object.keys(SAMPLE_DB).map((k) => (
          <button
            key={k}
            style={styles.quickBtn}
            onClick={() => {
              setQuery(k);
              runLookup(k);
            }}
            disabled={isRunning}
          >
            {k}
          </button>
        ))}
      </div>

      {/* ── Step banner ─────────────────────────────────────────── */}
      <motion.div
        key={step}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.stepBanner}
      >
        {STEP_DESCRIPTIONS[step]}
      </motion.div>

      {/* ── Diagram ─────────────────────────────────────────────── */}
      <div style={styles.diagramArea}>
        {renderArrows()}
        {renderPacket()}

        {/* App box */}
        <motion.div
          style={styles.box(COLORS.app, appActive)}
          animate={appActive ? { scale: [1, 1.03, 1] } : { scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Server size={36} style={styles.boxIcon(COLORS.app)} />
          <div style={styles.boxTitle}>Client / App</div>
          <div style={styles.boxSub}>Application layer</div>
          <p style={styles.tooltip}>
            The app orchestrates reads — checking cache first, then falling back to the database.
          </p>
        </motion.div>

        {/* Cache box */}
        <motion.div
          style={styles.box(COLORS.redis, cacheActive)}
          animate={cacheActive ? { scale: [1, 1.03, 1] } : { scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <HardDrive size={36} style={styles.boxIcon(COLORS.redis)} />
          <div style={styles.boxTitle}>Redis Cache</div>
          <div style={styles.boxSub}>In-memory store</div>
          <div style={{ marginTop: 10 }}>
            {Object.keys(cache).length === 0 ? (
              <span style={{ fontSize: 12, color: COLORS.textDim }}>empty</span>
            ) : (
              Object.keys(cache).map((k) => (
                <span key={k} style={styles.cacheChip}>
                  {k}
                </span>
              ))
            )}
          </div>
          <p style={styles.tooltip}>
            Data is cached here only after a miss — "lazy" loading.
          </p>
        </motion.div>

        {/* DB box */}
        <motion.div
          style={styles.box(COLORS.db, dbActive)}
          animate={dbActive ? { scale: [1, 1.03, 1] } : { scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Database size={36} style={styles.boxIcon(COLORS.db)} />
          <div style={styles.boxTitle}>Database</div>
          <div style={styles.boxSub}>PostgreSQL (source of truth)</div>
          <div style={{ marginTop: 10 }}>
            <span style={{ fontSize: 12, color: COLORS.textDim }}>
              {Object.keys(SAMPLE_DB).length} records
            </span>
          </div>
          <p style={styles.tooltip}>
            The authoritative data store, queried only on cache misses.
          </p>
        </motion.div>
      </div>

      {/* ── Stats ───────────────────────────────────────────────── */}
      <div style={styles.statsRow}>
        <div style={styles.statCard(COLORS.success)}>
          <div style={{ ...styles.statValue, color: COLORS.success }}>{stats.hits}</div>
          <div style={styles.statLabel}>Cache Hits</div>
        </div>
        <div style={styles.statCard(COLORS.error)}>
          <div style={{ ...styles.statValue, color: COLORS.error }}>{stats.misses}</div>
          <div style={styles.statLabel}>Cache Misses</div>
        </div>
        <div style={styles.statCard(COLORS.accent)}>
          <div style={{ ...styles.statValue, color: COLORS.accent }}>{hitRatio}</div>
          <div style={styles.statLabel}>Hit Ratio</div>
        </div>
        <div style={styles.statCard(COLORS.app)}>
          <div style={{ ...styles.statValue, color: COLORS.app }}>{Object.keys(cache).length}</div>
          <div style={styles.statLabel}>Cached Keys</div>
        </div>
      </div>

      {/* ── Result card ─────────────────────────────────────────── */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={styles.resultCard}
          >
            <div style={styles.resultTitle}>Returned Data</div>
            <pre style={styles.resultPre}>{JSON.stringify(result, null, 2)}</pre>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Logs ────────────────────────────────────────────────── */}
      <div style={styles.sectionLabel}>Event Log</div>
      <div style={styles.logPanel}>
        {logs.length === 0 && (
          <span style={{ fontSize: 13, color: COLORS.textDim }}>No events yet — try a lookup!</span>
        )}
        {logs.map((l, i) => (
          <div key={i} style={styles.logEntry(l.type)}>
            <span style={{ opacity: 0.5, marginRight: 8 }}>
              {new Date(l.ts).toLocaleTimeString()}
            </span>
            {l.msg}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>

      {/* ── Educational footer ──────────────────────────────────── */}
      <div
        style={{
          marginTop: 24,
          padding: 16,
          borderRadius: 10,
          background: COLORS.surface,
          border: `1px solid ${COLORS.surfaceLight}`,
          fontSize: 13,
          lineHeight: 1.7,
          color: COLORS.textDim,
        }}
      >
        <strong style={{ color: COLORS.text }}>💡 How Cache-Aside Works</strong>
        <br />
        1. <strong style={{ color: COLORS.app }}>Read request</strong> arrives at the application.
        <br />
        2. App checks <strong style={{ color: COLORS.redis }}>Redis</strong> — if the key exists (<em>HIT</em>), return it immediately.
        <br />
        3. On a <em>MISS</em>, app queries the <strong style={{ color: COLORS.db }}>Database</strong>, stores the result in Redis, then returns it.
        <br />
        4. Subsequent reads for the same key are served from cache, reducing DB load.
        <br />
        <em>Trade-offs:</em> stale data is possible (use TTL), first request for each key is slower (cold start).
      </div>
    </div>
  );
}
