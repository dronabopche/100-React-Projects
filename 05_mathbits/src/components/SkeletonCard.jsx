export default function SkeletonCard() {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: '#0d1117', border: '1px solid #1e2530' }}
    >
      {/* Header skeleton */}
      <div
        className="px-5 py-3.5 flex items-center gap-3"
        style={{ borderBottom: '1px solid #1e2530' }}
      >
        <div className="skeleton h-4 w-32 rounded-md" />
        <div className="skeleton h-4 w-16 rounded-full" />
        <div className="skeleton h-4 w-14 rounded-full" />
      </div>

      {/* Preview skeleton */}
      <div className="skeleton" style={{ height: 340 }} />

      {/* Description skeleton */}
      <div className="px-5 py-3" style={{ borderTop: '1px solid #1e2530' }}>
        <div className="skeleton h-3 w-3/4 rounded" />
      </div>
    </div>
  )
}
