import { useNavigate } from 'react-router-dom'

const NAV = [
  {
    category: 'backgrounds',
    label: 'Backgrounds',
    icon: '◈',
    desc: 'Canvas & SVG math art',
  },
  {
    category: 'color_checker',
    label: 'Color Checker',
    icon: '◉',
    desc: 'Pixel tools & WCAG',
  },
  {
    category: 'text_animations',
    label: 'Text Animations',
    icon: '◇',
    desc: 'Glitch, wave, cipher',
  },
  {
    category: 'animations',
    label: 'Animations',
    icon: '◎',
    desc: 'Physics & fractals',
  },
]

export default function Sidebar({ active, onSelect }) {
  const navigate = useNavigate()

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 shrink-0"
      style={{
        width: 240,
        background: '#0a0e14',
        borderRight: '1px solid #1e2530',
      }}
    >
      {/* Logo */}
      <div
        className="px-5 py-5 cursor-pointer"
        onClick={() => navigate('/')}
        style={{ borderBottom: '1px solid #1e2530' }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="text-2xl leading-none"
            style={{ color: '#5eead4', fontFamily: 'JetBrains Mono, monospace' }}
          >
            ∑
          </span>
          <span
            className="text-base font-bold tracking-tight"
            style={{ fontFamily: 'Syne, sans-serif', color: '#e2e8f0' }}
          >
            MathBits
          </span>
        </div>
        <p className="text-xs mt-1" style={{ color: '#4b5563', fontFamily: 'JetBrains Mono, monospace' }}>
          v0.1.0
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p
          className="text-xs px-2 mb-3 uppercase tracking-widest"
          style={{ color: '#4b5563', fontFamily: 'JetBrains Mono, monospace' }}
        >
          Components
        </p>
        {NAV.map(item => {
          const isActive = active === item.category
          return (
            <button
              key={item.category}
              onClick={() => onSelect(item.category)}
              className="w-full text-left px-3 py-3 rounded-lg mb-1 transition-all duration-150 group"
              style={{
                background: isActive ? 'rgba(94,234,212,0.08)' : 'transparent',
                border: isActive ? '1px solid rgba(94,234,212,0.2)' : '1px solid transparent',
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.background = 'transparent'
              }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  style={{
                    color: isActive ? '#5eead4' : '#4b5563',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.9rem',
                    transition: 'color 0.15s',
                  }}
                >
                  {item.icon}
                </span>
                <span
                  className="text-sm font-medium"
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    color: isActive ? '#e2e8f0' : '#94a3b8',
                    transition: 'color 0.15s',
                  }}
                >
                  {item.label}
                </span>
              </div>
              <p
                className="text-xs ml-7 mt-0.5"
                style={{
                  color: '#4b5563',
                  fontFamily: 'JetBrains Mono, monospace',
                  display: isActive ? 'block' : 'none',
                }}
              >
                {item.desc}
              </p>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4" style={{ borderTop: '1px solid #1e2530' }}>
        <p className="text-xs" style={{ color: '#4b5563', fontFamily: 'JetBrains Mono, monospace' }}>
          Built with math ✦
        </p>
      </div>
    </aside>
  )
}
