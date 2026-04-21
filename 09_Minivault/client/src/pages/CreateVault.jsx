import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = "https://one00-react-projects.onrender.com/api";

export default function CreateVault() {
  const [vaultId, setVaultId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [created, setCreated] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    setError("");
    if (vaultId.length !== 4 || password.length !== 4) {
      setError("Both Vault ID and Password must be exactly 4 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/vault`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vault_id: vaultId, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setCreated(data.vault_id);
    } catch {
      setError("Connection failed. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    sessionStorage.setItem("mv_session", JSON.stringify({ vault_id: created, password: password.toUpperCase() }));
    navigate("/dashboard");
  };

  return (
    <div className="page-center">
      <div className="card fade-up">
        <h1 className="card-title">Create a Vault</h1>
        <p className="card-subtitle">
          Choose a 4-character ID and password. Anyone with both can access your files.
        </p>

        {error && <div className="alert alert-error">⚠ {error}</div>}

        {created ? (
          <>
            <div className="vault-created-box">
              <h3>✓ Vault Created</h3>
              <div className="vault-id-big">{created}</div>
              <p>Save your ID and password — they cannot be recovered.</p>
            </div>
            <div className="alert alert-info">
              🔑 Password: <strong style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>
                {password.toUpperCase()}
              </strong>
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" onClick={handleGoToDashboard}>
                Open Dashboard →
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label">Vault ID</label>
              <input
                className="form-input"
                maxLength={4}
                placeholder="e.g. AB12"
                value={vaultId}
                onChange={(e) => setVaultId(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
              />
              <span className="form-hint">4 alphanumeric characters · will be uppercased</span>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                maxLength={4}
                placeholder="e.g. X7K9"
                value={password}
                onChange={(e) => setPassword(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
              />
              <span className="form-hint">4 alphanumeric characters · will be uppercased</span>
            </div>

            <div className="form-actions">
              <button
                className="btn btn-primary"
                onClick={handleCreate}
                disabled={loading || vaultId.length !== 4 || password.length !== 4}
              >
                {loading ? <span className="spinner" /> : null}
                {loading ? "Creating…" : "Create Vault"}
              </button>
              <Link to="/login" className="btn btn-secondary">Open Existing</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
