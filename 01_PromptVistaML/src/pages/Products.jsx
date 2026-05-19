import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import VistaSecureAI from './products/VistaSecureAI'
import PromptHallucinationML from './products/PromptHallucinationML'
import VistaMeHR from './products/VistaMeHR'



/* ─── Intersection observer hook ─── */
function useReveal(threshold = 0.08) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return [ref, visible]
}

/* ─── SVG Icons ─── */
const Icon = {
  external: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  ),
}



/* ─── MAIN COMPONENT ─── */
const Products = () => {
  const [headerRef, headerVisible] = useReveal(0.05)
  const [gridRef, gridVisible] = useReveal(0.05)

  const products = [
    {
      id: 'vista-secure-ai',
      Name: 'VistaSecure AI',
      description: 'Advanced threat detection and security orchestration powered by next-generation machine learning. Protect your infrastructure with automated risk assessment and real-time response.',
      component: <VistaSecureAI />,
      path: '/products/vista-secure-ai'
    },
    {
      id: 'prompt-hallucination-ml',
      Name: 'PromptHallucination ML',
      description: 'The industry standard for LLM output verification. Detect and prevent factual inaccuracies, logic gaps, and hallucinations in real-time before they reach your users.',
      component: <PromptHallucinationML />,
      path: '/products/prompt-hallucination-ml'
    },
    {
      id: 'vistame-hr',
      Name: 'VistaMe HR',
      description: 'The intelligent workforce management platform. Streamline recruitment, performance tracking, and employee engagement with data-driven insights.',
      component: <VistaMeHR />,
      path: '/products/vistame-hr'
    }
  ]


  return (
    <div className="products-page relative min-h-screen">



      
      {/* Ambient orbs */}
      <div className="pv-glow pointer-events-none fixed top-1/4 -left-40 w-[420px] h-[420px] rounded-full hidden sm:block z-0"
        style={{ background:'radial-gradient(circle,rgba(139,92,246,.12) 0%,transparent 70%)' }} />
      <div className="pv-glow pointer-events-none fixed bottom-1/3 -right-40 w-[420px] h-[420px] rounded-full hidden sm:block z-0"
        style={{ background:'radial-gradient(circle,rgba(96,165,250,.1) 0%,transparent 70%)', animationDelay:'1.8s' }} />

      {/* HEADER */}
      <section className="relative pt-24 pb-16 overflow-hidden z-10 border-b border-[color:var(--border)]">
        <div className="absolute inset-0 pv-grid pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative"
          style={{ opacity: 0, animation: headerVisible ? 'pv-up .85s cubic-bezier(.22,1,.36,1) forwards' : 'none' }}
          ref={headerRef}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.4em] bg-white/50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-500/20 backdrop-blur-sm mb-8">
            Product Portfolio
          </div>
          <h1 className="text-[clamp(2.5rem,6vw,5.5rem)] font-bold text-[var(--text)] leading-[1.06] tracking-tighter">
            Our <span className="pv-grad-text">Catalog</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-6 text-lg sm:text-xl leading-relaxed font-normal">
            Explore our curated collection of tools, platforms, and AI-driven solutions 
            designed to simplify workflows and boost technical productivity.
          </p>
        </div>
      </section>

      {/* TICKER */}
      <div className="border-y border-[color:var(--border)] bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm py-3 overflow-hidden select-none mb-16 relative z-10">
        <div className="whitespace-nowrap flex animate-[pv-tick_40s_linear_infinite]">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="flex items-center gap-12 px-12 text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em]">
              <span>Curated Tools</span>
              <span className="text-purple-500">›</span>
              <span>AI Platforms</span>
              <span className="text-purple-500">›</span>
              <span>Dev Resources</span>
              <span className="text-purple-500">›</span>
              <span>Scalable Solutions</span>
              <span className="text-purple-500">›</span>
            </span>
          ))}
        </div>
      </div>



      {/* GRID */}
      <section ref={gridRef} className="products-grid-section relative py-20 overflow-hidden">
        <div className="absolute inset-0 pv-grid pointer-events-none" />

        <div className="products-grid">
          {products.map((product, idx) => (
            <Link
              key={product.id}
              to={product.path}
              className={`product-card boxy-card bg-white dark:bg-gray-900/40`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                opacity: gridVisible ? 1 : 0,
                animation: gridVisible
                  ? `pv-up .6s cubic-bezier(.22,1,.36,1) ${Math.min(idx * 0.05, 0.4)}s both`
                  : 'none'
              }}
            >
              <div className="product-card-image relative overflow-hidden bg-white dark:bg-gray-900 pointer-events-none">
                <div style={{
                  width: '300%',
                  height: '300%',
                  transform: 'scale(0.333)',
                  transformOrigin: 'top left',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  overflow: 'hidden'
                }}>
                  {product.component}
                </div>
              </div>

              <div className="product-card-content">
                <h3 className="product-card-title">
                  {product.Name}
                </h3>

                <p className="product-card-description">
                  {product.description}
                </p>

                <div className="product-card-footer">
                  <span className="product-card-button">
                    View Product {Icon.external}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="products-cta max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="boxy-card p-12 bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm relative overflow-hidden">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 relative z-10">

            Don't see your product listed?
          </h3>
          <p className="text-gray-700 dark:text-gray-400 mb-8 max-w-lg mx-auto relative z-10">
            We are always looking for innovative AI solutions and technical platforms to showcase to our community.
          </p>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2 px-8 py-3 relative z-10">
            Suggest a product
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>


    </div>
  )
}

export default Products