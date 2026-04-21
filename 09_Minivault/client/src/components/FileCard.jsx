function getFileIcon(mime) {
  if (!mime) return { icon: "📄", cls: "other" };
  if (mime.startsWith("image/")) return { icon: "🖼️", cls: "img" };
  if (mime.startsWith("audio/")) return { icon: "🎵", cls: "audio" };
  if (mime.startsWith("video/")) return { icon: "🎬", cls: "other" };
  if (mime === "application/pdf") return { icon: "📕", cls: "pdf" };
  if (mime.startsWith("text/")) return { icon: "📝", cls: "text" };
  if (mime.includes("zip")) return { icon: "🗜️", cls: "other" };
  return { icon: "📄", cls: "other" };
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function FileCard({ file, onDelete, onDownload }) {
  const { icon, cls } = getFileIcon(file.mime_type);

  return (
    <div className="file-card">
      <div className={`file-type-icon ${cls}`}>{icon}</div>
      <div className="file-info">
        <div className="file-name" title={file.file_name}>{file.file_name}</div>
        <div className="file-meta">
          {formatBytes(file.file_size)} · {formatDate(file.uploaded_at)}
        </div>
      </div>
      <div className="file-actions">
        <button
          className="btn-icon"
          title="Download"
          onClick={() => onDownload(file)}
        >
          ⬇
        </button>
        <button
          className="btn-icon danger"
          title="Delete file"
          onClick={() => onDelete(file)}
        >
          🗑
        </button>
      </div>
    </div>
  );
}
