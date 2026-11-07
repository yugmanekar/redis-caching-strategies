import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeBlock({ code, language = 'javascript', title }) {
  return (
    <div style={{
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid #E2E8F0',
      margin: '16px 0',
      background: '#F8FAFC',
      boxShadow: 'var(--shadow-subtle)',
    }}>
      {title && (
        <div style={{
          padding: '10px 16px',
          background: '#F1F5F9',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#CBD5E1' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#CBD5E1' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#CBD5E1' }} />
            </div>
            <span style={{
              fontSize: '12px',
              color: '#475569',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
            }}>
              {title}
            </span>
          </div>

          <span style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            color: '#64748B',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
          }}>
            {language}
          </span>
        </div>
      )}
      <SyntaxHighlighter
        language={language}
        style={vs}
        customStyle={{
          margin: 0,
          padding: '18px 20px',
          fontSize: '13px',
          lineHeight: '1.65',
          background: '#FFFFFF',
          fontFamily: 'var(--font-mono)',
        }}
        showLineNumbers
        wrapLines
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
}
