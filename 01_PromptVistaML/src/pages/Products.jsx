import { Link } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { fetchAllProducts } from '../services/supabase'



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

/* ─── Iframe Preview Component ─── */
function IframePreview({ url, name }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!url) return
    const timer = setTimeout(() => {
      if (!loaded) setFailed(true)
    }, 2500)
    return () => clearTimeout(timer)
  }, [url, loaded])

  if (!url || failed) {
    return <div className="product-image-placeholder">No Preview</div>
  }

  return (
    <div className="iframe-container">
      <iframe
        src={url}
        title={name || 'product-preview'}
        className="product-iframe-preview"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups"
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: 'inherit',
          pointerEvents: 'none' // 👈 prevents iframe blocking clicks
        }}
      />
    </div>
  )
}

/* ─── MAIN COMPONENT ─── */
const Products = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [headerRef, headerVisible] = useReveal(0.05)
  const [gridRef, gridVisible] = useReveal(0.05)

  useEffect(() => {
    fetchAllProducts()
      .then(data => {
        const sorted = [...data].sort(
          (a, b) => (a.priority || 999) - (b.priority || 999)
        )
        setProducts(sorted)
        setFilteredProducts(sorted)
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="products-page relative min-h-screen">
      <style>{`
        @keyframes pv-up   { from { opacity:0; transform:translateY(32px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pv-grad { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes pv-glow { 0%,100%{opacity:.3;transform:scale(1)} 50%{opacity:.65;transform:scale(1.07)} }
        @keyframes pv-tick { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }

        .pv-up { animation: pv-up .85s cubic-bezier(.22,1,.36,1) both }
        .pv-grad-text {
          background: linear-gradient(135deg, #d041d3, #bc36d1, #dcd500, #7d51e4);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: pv-grad 5s ease infinite;
        }
        .pv-glow { animation: pv-glow 3.5s ease-in-out infinite }
      `}</style>


      
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
        <div className="absolute inset-0 pv-grid opacity-60 pointer-events-none" />

        {isLoading ? (
          <div className="products-grid">
            {[1, 2, 3].map(i => (
              <div key={i} className="product-card-skeleton" />
            ))}
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product, idx) => {
              const hasLink = !!product.website_link

              return (
                <a
                  key={product.id || idx}
                  href={hasLink ? product.website_link : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`product-card boxy-card ${!hasLink ? 'disabled' : ''} bg-white dark:bg-gray-900/40`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    pointerEvents: hasLink ? 'auto' : 'none',
                    opacity: gridVisible ? 1 : 0,
                    animation: gridVisible
                      ? `pv-up .6s cubic-bezier(.22,1,.36,1) ${Math.min(idx * 0.05, 0.4)}s both`
                      : 'none'
                  }}
                >
                  <div className="product-card-image">
                    <IframePreview
                      url={product.website_link}
                      name={product.Name}
                    />
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
                        {hasLink ? "Visit Website" : "No link available"} {Icon.external}
                      </span>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        )}
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