import { Link } from "react-router-dom";

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
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-badge">1MB · Minimal · Free</div>

        <h1
          className="fade-up"
          style={{
            marginBottom: "1rem",
            fontSize: "5rem",
            lineHeight: "1.1",
          }}
        >
          Your tiny <em>secure vault</em> on the web
        </h1>

        <p style={{ maxWidth: "600px", margin: "0 auto" }}>
          No signup. No apps. Just a 4-character ID and password —
          your private 1MB storage accessible from anywhere.
        </p>

        <div
          className="hero-actions fade-up"
          style={{ marginTop: "2rem" }}
        >
          <Link to="/create" className="btn btn-primary">
            + Create a Vault
          </Link>
          <Link to="/login" className="btn btn-secondary">
            Open Existing Vault
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
          Why MiniVault?
        </h2>

        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`feature-card fade-up fade-up-delay-${i + 1}`}
            >
              <div
                className="feature-icon"
                style={{ fontSize: "2rem", marginBottom: "0.5rem" }}
              >
                {f.icon}
              </div>

              <h3 style={{ marginBottom: "0.5rem" }}>{f.title}</h3>

              <p style={{ opacity: 0.8 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}