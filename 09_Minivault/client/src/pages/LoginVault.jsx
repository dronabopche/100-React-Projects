import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = "https://one00-react-projects.onrender.com/api";

export default function LoginVault() {
  const [vaultId, setVaultId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    if (!vaultId || !password) {
      setError("Enter both Vault ID and Password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/vault/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vault_id: vaultId, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }

      sessionStorage.setItem("mv_session", JSON.stringify({
        vault_id: data.vault_id,
        password: password.toUpperCase(),
      }));
      navigate("/dashboard");
    } catch {
      setError("Connection failed. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div className="card fade-up">
        <h1 className="card-title">Open Vault</h1>
        <p className="card-subtitle">
          Enter your 4-character Vault ID and Password to access your files.
        </p>

        {error && <div className="alert alert-error">⚠ {error}</div>}

        <div className="form-group">
          <label className="form-label">Vault ID</label>
          <input
            className="form-input"
            maxLength={4}
            placeholder="e.g. AB12"
            value={vaultId}
            onChange={(e) => setVaultId(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            maxLength={4}
            placeholder="e.g. X7K9"
            value={password}
            onChange={(e) => setPassword(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        <div className="form-actions">
          <button
            className="btn btn-primary"
            onClick={handleLogin}
            disabled={loading || !vaultId || !password}
          >
            {loading ? <span className="spinner" /> : null}
            {loading ? "Opening…" : "Open Vault"}
          </button>
          <Link to="/create" className="btn btn-secondary">+ New Vault</Link>
        </div>
      </div>
    </div>
  );
}
