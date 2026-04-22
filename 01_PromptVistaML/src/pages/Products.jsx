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
    <div className="products-page">

      {/* HEADER */}
      <section className="products-header">
        <div className="products-header-bg" />
        <div
          ref={headerRef}
          className="products-header-card"
          style={{
            opacity: 0,
            animation: headerVisible
              ? 'pv-up .85s cubic-bezier(.22,1,.36,1) forwards'
              : 'none'
          }}
        >
          <h1 className="products-title">
            Our <span className="products-title-gradient">Product Catalog</span>
          </h1>
        </div>
      </section>

      {/* GRID */}
      <section ref={gridRef} className="products-grid-section">
        {isLoading ? (
          <div className="products-grid">
            {[1,2,3].map(i => (
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
                  className={`product-card ${!hasLink ? 'disabled' : ''}`}
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
      <div className="products-cta">
        <h3>Don't see your product listed?</h3>
        <Link to="/contact" className="products-cta-link">
          Suggest a product →
        </Link>
      </div>

    </div>
  )
}

export default Products