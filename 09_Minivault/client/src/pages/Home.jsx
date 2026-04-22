import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const FEATURES = [
  {
    icon: "📦",
    title: "1 MB Storage",
    desc: "Perfectly sized for quick file handoffs — text, images, audio, and more.",
  },
  {
    icon: "🔑",
    title: "4-Char Access",
    desc: "Secure your vault with a memorable 4-character ID and password. No email needed.",
  },
  {
    icon: "🌐",
    title: "Any Device",
    desc: "Access your vault from any browser — desktop, tablet, or smartphone.",
  },
  {
    icon: "🗑️",
    title: "Self-Destruct",
    desc: "Delete your entire vault permanently when you're done. Zero traces left.",
  },
];

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      {/* HERO */}
      <section className={`hero ${loaded ? "hero-visible" : ""}`}>
        <div className="hero-badge animate-fade">
          1MB · Minimal · Free
        </div>

        <>
  <style>
    {`
      @keyframes slideIn {
        0% {
          opacity: 0;
          transform: translateY(40px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes gradientMove {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `}
  </style>

  <h1
    style={{
      marginBottom: "1rem",
      fontSize: "5rem",
      lineHeight: "1.1",
      animation: "slideIn 0.8s ease-out forwards",
    }}
  >
    Your tiny{" "}
    <em
      style={{
        background: "linear-gradient(270deg, #e5d546, #d48806, #fca800)",
        backgroundSize: "300% 300%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: "gradientMove 4s ease infinite",
        fontStyle: "normal",
      }}
    >
      secure vault
    </em>{" "}
    on the web
  </h1>
</>

        <p
          className="animate-fade"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          No signup. No apps. Just a 4-character ID and password —
          your private 1MB storage accessible from anywhere.
        </p>

        <div
          className="hero-actions animate-fade"
          style={{ marginTop: "2rem" }}
        >
          <Link to="/create" className="btn btn-primary btn-animate">
            + Create a Vault
          </Link>

          <Link to="/login" className="btn btn-secondary btn-animate">
            Open Existing Vault
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2
          className="animate-fade"
          style={{ textAlign: "center", marginBottom: "2rem" }}
        >
          Why MiniVault?
        </h2>

        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="feature-card feature-animate"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}