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
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

/* ─── SVG Icons ─── */
const Icon = {
  layers: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  folder: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>,
  external: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>,
  search: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  x: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>,
  arrowR: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>,
  imagePlaceholder: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  filter: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
  sort: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>,
}

/* ─── Priority label ─── */
const getPriorityLabel = (priority) => {
  const priorityMap = {
    1: { label: 'Highest', className: 'priority-high' },
    2: { label: 'High', className: 'priority-high' },
    3: { label: 'Medium', className: 'priority-medium' },
    4: { label: 'Low', className: 'priority-low' },
    5: { label: 'Lowest', className: 'priority-low' },
  }
  return priorityMap[priority] || { label: `P${priority}`, className: 'priority-medium' }
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
    return (
      <div className="product-image-placeholder">
        {Icon.imagePlaceholder}
      </div>
    )
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
        borderRadius: 'inherit'
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
        const sorted = [...data].sort((a, b) => (a.priority || 999) - (b.priority || 999))
        setProducts(sorted)
        setFilteredProducts(sorted)
      })
      .catch(err => console.error('Failed to load products:', err))
      .finally(() => setIsLoading(false))
  }, [])

  const highPriorityCount = products.filter(p => p.priority && p.priority <= 2).length

  return (
    <div className="products-page">

      <section className="products-header">
        <div className="products-header-bg" />
        <div
          ref={headerRef}
          className="products-header-card"
          style={{
            opacity: 0,
            animation: headerVisible ? 'pv-up .85s cubic-bezier(.22,1,.36,1) forwards' : 'none'
          }}
        >
          <h1 className="products-title">
            Our <span className="products-title-gradient">Product Catalog</span>
          </h1>
          <p className="products-subtitle">
            Browse our curated collection of tools, platforms, and solutions.
          </p>

          <div className="products-stats">
            <div className="products-stat">
              <div className="products-stat-icon">{Icon.layers}</div>
              <div>
                <span className="products-stat-number">{products.length}</span>
                <span className="products-stat-label">total products</span>
              </div>
            </div>
            <div className="products-stat-divider" />
            <div className="products-stat">
              <div className="products-stat-icon">{Icon.folder}</div>
              <div>
                <span className="products-stat-number">{highPriorityCount}</span>
                <span className="products-stat-label">high priority</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={gridRef} className="products-grid-section">
        {isLoading ? (
          <div className="products-grid products-grid-loading">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="product-card-skeleton">
                <div className="skeleton-image" />
                <div className="skeleton-content">
                  <div className="skeleton-title" />
                  <div className="skeleton-line" />
                  <div className="skeleton-line" />
                  <div className="skeleton-button" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="products-grid">
              {filteredProducts.map((product, idx) => {
                const priorityInfo = getPriorityLabel(product.priority)
                return (
                  <div
                    key={product.id || idx}
                    className="product-card"
                    style={{
                      opacity: gridVisible ? 1 : 0,
                      animation: gridVisible ? `pv-up .6s cubic-bezier(.22,1,.36,1) ${Math.min(idx * 0.05, 0.4)}s both` : 'none'
                    }}
                  >
                    <div className="product-card-image">
                      <IframePreview url={product.website_link} name={product.Name} />
                      {product.priority && (
                        <div className={`product-priority-badge ${priorityInfo.className}`}>
                          {priorityInfo.label}
                        </div>
                      )}
                    </div>

                    <div className="product-card-content">
                      <h3 className="product-card-title">{product.Name}</h3>
                      <p className="product-card-description">{product.description}</p>

                      <div className="product-card-footer">
                        {product.website_link ? (
                          <a href={product.website_link} target="_blank" rel="noopener noreferrer" className="product-card-button">
                            <span>Visit Website</span>
                            <span>{Icon.external}</span>
                          </a>
                        ) : (
                          <button className="product-card-button disabled" disabled>
                            No link available
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </section>

      <div className="products-cta">
        <h3 className="products-cta-title">Don't see your product listed?</h3>
        <Link to="/contact" className="products-cta-link">
          Suggest a product {Icon.arrowR}
        </Link>
      </div>

    </div>
  )
}

export default Products