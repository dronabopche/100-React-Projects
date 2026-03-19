import { useState, useRef } from 'react'

function CopyButton({ code }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={copy}
      className="text-xs px-3 py-1.5 rounded-md transition-all duration-150"
      style={{
        fontFamily: 'JetBrains Mono, monospace',
        background: copied ? 'rgba(94,234,212,0.12)' : 'rgba(255,255,255,0.06)',
        color: copied ? '#5eead4' : '#94a3b8',
        border: `1px solid ${copied ? 'rgba(94,234,212,0.3)' : 'rgba(255,255,255,0.08)'}`,
      }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

// Very minimal syntax highlighter
function highlight(code) {
  return code
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/(\/\/.*?)(\n|$)/g, '<span class="tok-comment">$1</span>$2')
    .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, '<span class="tok-string">$1</span>')
    .replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|default|new|typeof|void|true|false|null|undefined|async|await|of|in)\b/g, '<span class="tok-keyword">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="tok-number">$1</span>')
    .replace(/\b([A-Z][A-Za-z]*)\(/g, '<span class="tok-fn">$1</span>(')
}

export default function ComponentCard({ component, index }) {
  const [showCode, setShowCode] = useState(false)
  const iframeRef = useRef(null)

  const srcDoc = component.code

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: '#0d1117',
        border: '1px solid #1e2530',
        animation: `fade-up 0.5s ease ${index * 0.08}s both`,
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-3.5 flex items-center justify-between"
        style={{ borderBottom: '1px solid #1e2530' }}
      >
        <div className="flex items-center gap-3">
          <h3
            className="text-sm font-semibold"
            style={{ fontFamily: 'Syne, sans-serif', color: '#e2e8f0' }}
          >
            {component.name}
          </h3>
          {component.tags && (
            <div className="flex gap-1.5 flex-wrap">
              {component.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: 'rgba(129,140,248,0.08)',
                    color: '#818cf8',
                    border: '1px solid rgba(129,140,248,0.15)',
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCode(v => !v)}
            className="text-xs px-3 py-1.5 rounded-md transition-all duration-150"
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              background: showCode ? 'rgba(129,140,248,0.1)' : 'rgba(255,255,255,0.05)',
              color: showCode ? '#818cf8' : '#94a3b8',
              border: `1px solid ${showCode ? 'rgba(129,140,248,0.25)' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            {showCode ? '← Preview' : '</> Code'}
          </button>
          {showCode && <CopyButton code={component.code} />}
        </div>
      </div>

      {/* Body */}
      {!showCode ? (
        <div style={{ height: 340, background: '#080b10', position: 'relative' }}>
          <iframe
            ref={iframeRef}
            srcDoc={srcDoc}
            sandbox="allow-scripts"
            className="preview-frame"
            title={component.name}
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          />
        </div>
      ) : (
        <div
          className="overflow-auto"
          style={{ height: 340, background: '#060810' }}
        >
          <pre
            className="p-5 text-xs leading-relaxed"
            style={{ fontFamily: 'JetBrains Mono, monospace', minWidth: 0 }}
            dangerouslySetInnerHTML={{ __html: highlight(component.code) }}
          />
        </div>
      )}

      {/* Description */}
      {component.description && (
        <div
          className="px-5 py-3 text-xs"
          style={{
            color: '#4b5563',
            borderTop: '1px solid #1e2530',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          {component.description}
        </div>
      )}
    </div>
  )
}
