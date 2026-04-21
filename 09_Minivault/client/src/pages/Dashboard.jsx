import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import StorageBar from "../components/StorageBar.jsx";
import FileCard from "../components/FileCard.jsx";

const API = "https://one00-react-projects.onrender.com/api";
const MAX_SIZE = 1024 * 1024;

function getSession() {
  try { return JSON.parse(sessionStorage.getItem("mv_session")); }
  catch { return null; }
}

export default function Dashboard() {
  const navigate = useNavigate();
  const session = getSession();

  const [files, setFiles] = useState([]);
  const [totalSize, setTotalSize] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [showDeleteVault, setShowDeleteVault] = useState(false);
  const [deleteVaultPass, setDeleteVaultPass] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Redirect if no session
  useEffect(() => {
    if (!session) navigate("/login");
  }, []);

  const fetchFiles = useCallback(async () => {
    if (!session) return;
    try {
      const res = await fetch(
        `${API}/files/${session.vault_id}?password=${session.password}`
      );
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) { sessionStorage.removeItem("mv_session"); navigate("/login"); }
        setError(data.error);
        return;
      }
      setFiles(data.files);
      setTotalSize(data.total_size);
    } catch {
      setError("Failed to load files. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  const clearMessages = () => { setError(""); setSuccess(""); };

  const handleUpload = async (file) => {
    if (!file) return;
    clearMessages();

    if (file.size > MAX_SIZE - totalSize) {
      setError(`Not enough space. You have ${((MAX_SIZE - totalSize) / 1024).toFixed(1)} KB free.`);
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        `${API}/files/${session.vault_id}/upload?password=${session.password}`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setSuccess(`"${file.name}" uploaded successfully.`);
      fetchFiles();
    } catch {
      setError("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) handleUpload(file);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const handleDelete = async (file) => {
    clearMessages();
    if (!confirm(`Delete "${file.file_name}"?`)) return;

    try {
      const res = await fetch(
        `${API}/files/${session.vault_id}/${file.file_id}?password=${session.password}`,
        { method: "DELETE", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: session.password }) }
      );
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setSuccess(`"${file.file_name}" deleted.`);
      fetchFiles();
    } catch {
      setError("Delete failed.");
    }
  };

  const handleDownload = (file) => {
    const url = `${API}/files/${session.vault_id}/download/${file.file_id}?password=${session.password}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = file.file_name;
    a.click();
  };

  const handleDeleteVault = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`${API}/vault/${session.vault_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deleteVaultPass }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setDeleteLoading(false); return; }
      sessionStorage.removeItem("mv_session");
      navigate("/");
    } catch {
      setError("Failed to delete vault.");
      setDeleteLoading(false);
    }
  };

  if (!session) return null;

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header fade-up">
        <div>
          <div className="vault-id-display">
            VAULT <strong>{session.vault_id}</strong>
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            {files.length} file{files.length !== 1 ? "s" : ""} stored
          </div>
        </div>
        <div className="dashboard-actions">
          <button style={{ color: "var(--text)" }} onClick={fetchFiles}>
            ↻ Refresh
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => setShowDeleteVault(true)}
          >
            🗑 Delete Vault
          </button>
        </div>
      </div>

      {/* Storage bar */}
      <div className="fade-up fade-up-delay-1">
        <StorageBar used={totalSize} max={MAX_SIZE} />
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-error fade-up">
          ⚠ {error}
          <button onClick={clearMessages} style={{ marginLeft: "auto", background: "none", border: "none", color: "inherit", cursor: "pointer" }}>✕</button>
        </div>
      )}
      {success && (
        <div className="alert alert-success fade-up">
          ✓ {success}
          <button onClick={clearMessages} style={{ marginLeft: "auto", background: "none", border: "none", color: "inherit", cursor: "pointer" }}>✕</button>
        </div>
      )}

      {/* Upload area */}
      <div
        className={`upload-area fade-up fade-up-delay-2 ${dragOver ? "drag-over" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input type="file" onChange={handleFileInput} disabled={uploading} />
        <div className="upload-icon">{uploading ? "⏳" : "☁"}</div>
        {uploading ? (
          <p>Uploading<span className="spinner" style={{ marginLeft: "0.5rem", width: 14, height: 14 }} />…</p>
        ) : (
          <>
            <p><span>Click to upload</span> or drag &amp; drop a file</p>
            <small>Max file size: {((MAX_SIZE - totalSize) / 1024).toFixed(1)} KB remaining in vault</small>
          </>
        )}
      </div>

      {/* File list */}
      <div className="fade-up fade-up-delay-3">
        <div className="file-list-header">
          <h2>Files</h2>
          <span className="file-count">{files.length}</span>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="icon">⏳</div>
            <h3>Loading files…</h3>
          </div>
        ) : files.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📭</div>
            <h3>Vault is empty</h3>
            <p>Upload a file above to get started.</p>
          </div>
        ) : (
          <div className="file-list">
            {files.map((f) => (
              <FileCard
                key={f.file_id}
                file={f}
                onDelete={handleDelete}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete vault modal */}
      {showDeleteVault && (
        <div className="modal-overlay" onClick={() => setShowDeleteVault(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>⚠ Delete Vault?</h3>
            <p>
              This will permanently delete vault <strong>{session.vault_id}</strong> and all {files.length} file{files.length !== 1 ? "s" : ""} inside it. This cannot be undone.
            </p>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                className="form-input"
                maxLength={4}
                placeholder="Your 4-char password"
                value={deleteVaultPass}
                onChange={(e) => setDeleteVaultPass(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
              />
            </div>
            {error && <div className="alert alert-error" style={{ marginBottom: "1rem" }}>⚠ {error}</div>}
            <div className="modal-actions">
              <button
                className="btn btn-danger"
                onClick={handleDeleteVault}
                disabled={deleteLoading || !deleteVaultPass}
              >
                {deleteLoading ? <span className="spinner" /> : null}
                {deleteLoading ? "Deleting…" : "Delete Forever"}
              </button>
              <button className="btn btn-secondary" onClick={() => { setShowDeleteVault(false); setError(""); }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
