export default function StorageBar({ used, max }) {
  const pct = Math.min((used / max) * 100, 100);
  const fillClass = pct > 90 ? "danger" : pct > 70 ? "warn" : "";

  const fmt = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="storage-bar-container">
      <div className="storage-bar-header">
        <span className="storage-label">Storage Used</span>
        <span className="storage-numbers">{fmt(used)} / {fmt(max)}</span>
      </div>
      <div className="storage-track">
        <div className={`storage-fill ${fillClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
