import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeBlock({ code, language = 'javascript', title }) {
  return (
    <div style={{
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid var(--border-color)',
      margin: '16px 0',
      background: '#090A0F',
      boxShadow: 'var(--shadow-subtle)',
    }}>
      {title && (
        <div style={{
          padding: '10px 16px',
          background: '#0F1117',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.15)' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.15)' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.15)' }} />
            </div>
            <span style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 500,
            }}>
              {title}
            </span>
          </div>

          <span style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            color: 'var(--text-dim)',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
          }}>
            {language}
          </span>
        </div>
      )}
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '18px 20px',
          fontSize: '13px',
          lineHeight: '1.65',
          background: '#090A0F',
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
