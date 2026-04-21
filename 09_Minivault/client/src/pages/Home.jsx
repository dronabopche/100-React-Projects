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
      <section className="hero">
        <div className="hero-badge">1MB · Minimal · Free</div>
        <h1>
          Your tiny<br />
          <em>secure vault</em><br />
          on the web
        </h1>
        <p>
          No signup. No apps. Just a 4-character ID and password — and you have
          a private 1MB storage slot accessible from anywhere.
        </p>
        <div className="hero-actions fade-up">
          <Link to="/create" className="btn btn-primary">
            + Create a Vault
          </Link>
          <Link to="/login" className="btn btn-secondary">
            Open Existing Vault
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div key={f.title} className={`feature-card fade-up fade-up-delay-${i + 1}`}>
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
