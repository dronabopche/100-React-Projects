import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import CreateVault from "./pages/CreateVault.jsx";
import LoginVault from "./pages/LoginVault.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function Nav() {
  const navigate = useNavigate();
  const location = useLocation();

  const session = (() => {
    try { return JSON.parse(sessionStorage.getItem("mv_session")); }
    catch { return null; }
  })();

  const handleLogout = () => {
    sessionStorage.removeItem("mv_session");
    navigate("/");
  };

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <img src="/logo.png" alt="MiniVault Logo"/>
          Mini<span className="accent">Vault</span>
        </Link>
        <div className="nav-links">
          {session ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <button onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login">Open Vault</Link>
              <Link to="/create" className="btn-amber">+ New Vault</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <div className="app">
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateVault />} />
        <Route path="/login" element={<LoginVault />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <footer className="footer">
        MiniVault — 1MB secure file storage · No account required · Open from any browser
      </footer>
    </div>
  );
}