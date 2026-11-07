import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2, XCircle, Award, RotateCcw } from 'lucide-react';

const sectionStyle = {
  padding: '80px 24px',
  maxWidth: '900px',
  margin: '0 auto',
};

const headingStyle = {
  fontSize: '12px',
  fontWeight: 700,
  color: '#D92D20',
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
  marginBottom: '20px',
  boxShadow: 'var(--shadow-card)',
};

const questions = [
  {
    id: 1,
    question: 'In the Cache-Aside pattern, what happens when a Cache MISS occurs?',
    options: [
      'The application returns an HTTP 404 error immediately',
      'The cache automatically fetches data from the database without application involvement',
      'The application queries the database, populates the cache with the record, and returns it',
      'The write transaction is rolled back'
    ],
    answer: 2,
    explanation: 'Cache-Aside is lazy-loading: the application orchestrates fetching from the database and setting the value in Redis.'
  },
  {
    id: 2,
    question: 'What is the primary drawback of a synchronous Write-Through strategy?',
    options: [
      'Read operations are significantly slower',
      'High write latency, because the client blocks until both Cache and DB finish writing',
      'Data will always be out-of-sync with the database',
      'Redis memory cannot be freed using TTL'
    ],
    answer: 1,
    explanation: 'Write-Through guarantees immediate data consistency at the expense of higher write latency since both stores must acknowledge the write.'
  },
  {
    id: 3,
    question: 'How do you prevent a "Cache Stampede" (dogpiling) when an ultra-popular cached key expires?',
    options: [
      'Disable Redis caching entirely',
      'Use a distributed lock (Redlock) or add randomized jitter to TTL expirations',
      'Increase the PostgreSQL database pool to 100,000 connections',
      'Store everything in browser localStorage'
    ],
    answer: 1,
    explanation: 'Mutual exclusion locks (preventing multiple workers from rebuilding the cache at once) and TTL jitter prevent thousands of simultaneous database queries.'
  },
  {
    id: 4,
    question: 'Which Redis command sets a key with a Time-To-Live of 60 seconds in an atomic operation?',
    options: [
      'SETEX key 60 value',
      'EXPIRE key 60 value',
      'TTL key 60 value',
      'SAVE key value 60'
    ],
    answer: 0,
    explanation: '`SETEX key 60 value` (or `SET key value EX 60`) atomically sets both the payload and the TTL.'
  },
  {
    id: 5,
    question: 'When is Write-Behind (Write-Back) preferred over Write-Through?',
    options: [
      'When banking transactions require strict zero-loss consistency',
      'When write throughput is exceptionally high (e.g., streaming telemetry, pageview counters)',
      'When database connections are completely free and unlimited',
      'When memory costs are higher than storage costs'
    ],
    answer: 1,
    explanation: 'Write-Behind absorbs heavy bursts of writes in lightning-fast RAM and flushes to disk asynchronously in batches.'
  }
];

export default function QuizSection({ onComplete }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isInView) onComplete?.();
  }, [isInView]);

  const handleSelect = (qId, optionIdx) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.answer) score++;
    });
    return score;
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const score = calculateScore();

  return (
    <div ref={ref} style={sectionStyle}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <p style={headingStyle}>Chapter 7 • Knowledge Check</p>
        <h2 style={titleStyle}>
          Validate Your <span style={{ color: '#D92D20' }}>Understanding</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15.5px', maxWidth: '850px', marginBottom: '28px', lineHeight: 1.7 }}>
          Assess your retention of Redis caching architecture, command mechanics, and performance trade-offs.
        </p>

        {questions.map((q, qIndex) => {
          const isAnswered = selectedAnswers[q.id] !== undefined;
          return (
            <div key={q.id} style={cardStyle}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  color: '#475569',
                  fontSize: '12px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                }}>
                  0{qIndex + 1}
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 700, lineHeight: 1.5, color: '#0F172A' }}>{q.question}</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {q.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[q.id] === optIdx;
                  let optStyle = {
                    padding: '13px 16px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC',
                    color: '#334155',
                    fontSize: '14px',
                    cursor: submitted ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                  };

                  if (isSelected) {
                    optStyle.borderColor = '#444CE7';
                    optStyle.background = '#EEF4FF';
                    optStyle.color = '#3538CD';
                    optStyle.fontWeight = 500;
                  }

                  if (submitted) {
                    if (optIdx === q.answer) {
                      optStyle.borderColor = '#A6F4C5';
                      optStyle.background = '#ECFDF3';
                      optStyle.color = '#027A48';
                      optStyle.fontWeight = 600;
                    } else if (isSelected && optIdx !== q.answer) {
                      optStyle.borderColor = '#FECDCA';
                      optStyle.background = '#FEF3F2';
                      optStyle.color = '#B42318';
                    }
                  }

                  return (
                    <div
                      key={optIdx}
                      style={optStyle}
                      onClick={() => handleSelect(q.id, optIdx)}
                    >
                      <span>{opt}</span>
                      {submitted && optIdx === q.answer && <CheckCircle2 size={18} color="#079455" />}
                      {submitted && isSelected && optIdx !== q.answer && <XCircle size={18} color="#D92D20" />}
                    </div>
                  );
                })}
              </div>

              {submitted && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  fontSize: '13px',
                  color: '#475569',
                }}>
                  💡 <strong>Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          );
        })}

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
          {!submitted ? (
            <button
              onClick={() => setSubmitted(true)}
              disabled={Object.keys(selectedAnswers).length < questions.length}
              style={{
                padding: '14px 32px',
                borderRadius: '10px',
                background: Object.keys(selectedAnswers).length === questions.length ? 'linear-gradient(180deg, #D92D20 0%, #B42318 100%)' : '#E2E8F0',
                color: Object.keys(selectedAnswers).length === questions.length ? 'white' : '#94A3B8',
                border: 'none',
                fontSize: '15px',
                fontWeight: 700,
                cursor: Object.keys(selectedAnswers).length === questions.length ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                boxShadow: Object.keys(selectedAnswers).length === questions.length ? '0 4px 12px rgba(217, 45, 32, 0.25)' : 'none',
              }}
            >
              Submit Quiz ({Object.keys(selectedAnswers).length}/{questions.length} Answered)
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', flexWrap: 'wrap' }}>
              <div style={{
                flex: 1,
                padding: '16px 20px',
                borderRadius: '12px',
                background: score >= 4 ? '#ECFDF3' : '#FFFAEB',
                border: `1px solid ${score >= 4 ? '#A6F4C5' : '#FEDF89'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <Award size={28} color={score >= 4 ? '#079455' : '#B54708'} />
                <div>
                  <h4 style={{ fontSize: '15.5px', fontWeight: 700, color: score >= 4 ? '#027A48' : '#B54708' }}>
                    Score: {score} of {questions.length} ({Math.round((score / questions.length) * 100)}%)
                  </h4>
                  <p style={{ fontSize: '13px', color: '#475569' }}>
                    {score >= 4 ? 'Outstanding grasp of Redis caching strategies!' : 'Good effort! Review the chapters above to solidify edge cases.'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleReset}
                style={{
                  padding: '14px 22px',
                  borderRadius: '10px',
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  color: '#0F172A',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: 'var(--shadow-subtle)',
                }}
              >
                <RotateCcw size={15} /> Retry
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
