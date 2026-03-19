import { useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import ComponentCard from '../components/ComponentCard.jsx'
import SkeletonCard from '../components/SkeletonCard.jsx'
import { useComponents } from '../lib/useComponents.js'

const CATEGORY_META = {
  backgrounds: {
    title: 'Backgrounds',
    subtitle: 'Mathematically generated canvas & SVG animations for ambient backgrounds.',
    icon: '◈',
  },
  color_checker: {
    title: 'Color Checker',
    subtitle: 'Pixel pickers, WCAG contrast tools, and color space utilities.',
    icon: '◉',
  },
  text_animations: {
    title: 'Text Animations',
    subtitle: 'Glitch, cipher, wave, and particle-based text animations.',
    icon: '◇',
  },
  animations: {
    title: 'Animations',
    subtitle: 'Physics simulations, fractals, and interactive math visualizations.',
    icon: '◎',
  },
}

function ComponentGrid({ category }) {
  const { data, loading, error } = useComponents(category)
  const meta = CATEGORY_META[category]

  return (
    <div>
      {/* Section header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              color: '#5eead4',
              fontSize: '1.4rem',
            }}
          >
            {meta.icon}
          </span>
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: 'Syne, sans-serif', color: '#e2e8f0' }}
          >
            {meta.title}
          </h2>
        </div>
        <p className="text-sm" style={{ color: '#4b5563', fontFamily: 'DM Sans, sans-serif' }}>
          {meta.subtitle}
        </p>
        {error && (
          <p
            className="text-xs mt-2 px-3 py-1.5 rounded-md inline-block"
            style={{
              color: '#fb923c',
              background: 'rgba(251,146,60,0.08)',
              border: '1px solid rgba(251,146,60,0.2)',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            ⚠ Supabase unavailable — showing mock data
          </p>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : data.map((comp, i) => (
              <ComponentCard key={comp.id} component={comp} index={i} />
            ))}
        {!loading && data.length === 0 && (
          <div
            className="col-span-2 text-center py-20"
            style={{ color: '#4b5563', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem' }}
          >
            No components found in "{category}"
          </div>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('backgrounds')

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar active={activeCategory} onSelect={setActiveCategory} />

      {/* Main area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <div
          className="flex items-center justify-end px-8 py-4 shrink-0"
          style={{ borderBottom: '1px solid #1e2530' }}
        >
          <a
            href="https://github.com/yourusername/mathbits"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs px-4 py-2 rounded-lg transition-all duration-150"
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid #1e2530',
              color: '#94a3b8',
              textDecoration: 'none',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.color = '#e2e8f0'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              e.currentTarget.style.color = '#94a3b8'
            }}
          >
            <span>⭐</span>
            <span>Star on GitHub</span>
          </a>
        </div>

        {/* Content */}
        <main className="flex-1 px-8 py-8 overflow-y-auto">
          <ComponentGrid key={activeCategory} category={activeCategory} />
        </main>
      </div>
    </div>
  )
}
