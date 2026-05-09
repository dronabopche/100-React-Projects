import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"

/* ── Architecture Page Static Data ── */
const FRONTEND = {
  subtitle: "React 18 · Vite · Tailwind CSS · React Router v6",
  overview: `PromptVista ML's frontend is a lightning-fast SPA built with React 18 and powered by Vite's ESBuild compiler. Every component follows a strict "Boxy" design philosophy — sharp corners, purposeful borders, monochromatic base with purple/yellow accents — ensuring a premium technical aesthetic that mirrors a developer-grade tool.`,
  stack: [
    { label: "Framework", value: "React 18 (Concurrent Mode)", note: "Deferred rendering for complex AI result UIs" },
    { label: "Build Tool", value: "Vite 5 + ESBuild", note: "Sub-100ms HMR, tree-shaking, code splitting" },
    { label: "Styling", value: "Tailwind CSS v3", note: "JIT mode with custom design token overrides" },
    { label: "Routing", value: "React Router v6", note: "Nested layouts for persistent sidebars" },
    { label: "State", value: "Context + Hooks", note: "Lightweight state management for doc navigation" },
    { label: "Icons", value: "Lucide + Heroicons", note: "Consistent SVG icon system" },
    { label: "Hosting", value: "Vercel Edge Network", note: "Multi-region CDN with automated CI/CD" },
    { label: "Auth", value: "Supabase Auth", note: "JWT-based session management" },
  ],
  designSystem: [
    { name: ".boxy-card", desc: "Sharp-corner card with consistent border + shadow tokens" },
    { name: ".pv-grid-lines", desc: "Fixed CSS background grid giving the blueprint-style depth" },
    { name: ".pv-grad-text", desc: "Animated gradient text cycling through brand purple/yellow" },
    { name: ".btn-primary", desc: "Utility CTA button with hover lift and focus ring" },
    { name: "useReveal()", desc: "Intersection Observer hook triggering pv-up entrance animation" },
    { name: "pv-up @keyframe", desc: "translateY fade-in used across all content sections" },
  ],
  pages: [
    { name: "Home.jsx", role: "Hero, featured models, and live stats" },
    { name: "Models.jsx", role: "Paginated model catalog with search/filter" },
    { name: "ModelDetail.jsx", role: "Full model spec sheet with interactive input zones" },
    { name: "ApiDocs.jsx", role: "Sticky sidebar docs with categorized model endpoints" },
    { name: "Architecture.jsx", role: "This page — technical stack reference" },
    { name: "Products.jsx", role: "Product catalog with live iframe previews" },
  ],
  perf: [
    { metric: "< 100ms", label: "Hot Module Reload" },
    { metric: "< 1.2s", label: "First Contentful Paint" },
    { metric: "A+", label: "Vercel Perf Score" },
    { metric: "100", label: "Lighthouse Score" },
    { metric: "< 90KB", label: "Initial JS Bundle" },
    { metric: "0ms", label: "Layout Shift (CLS)" },
  ],
};

const BACKEND = {
  subtitle: "Supabase · PostgreSQL · PostgREST · Row Level Security",
  overview: `Our backend runs entirely on Supabase, giving us a production-grade Postgres database, a RESTful API layer via PostgREST, JWT authentication, and S3-compatible object storage — all from a single managed platform. This removes traditional DevOps overhead while maintaining enterprise-grade scalability and security.`,
  tables: [
    {
      name: "models",
      access: "Public Read",
      color: "blue",
      fields: [
        { col: "id", type: "uuid", note: "Primary key" },
        { col: "model_name", type: "text", note: "Display name of the ML model" },
        { col: "model_description", type: "text", note: "Detailed capability description" },
        { col: "category", type: "text", note: "e.g. NLP, Vision, Audio" },
        { col: "model_number", type: "int4", note: "Sequential ID for URL routing" },
        { col: "created_at", type: "timestamptz", note: "Auto-managed creation timestamp" },
      ],
    },
    {
      name: "products",
      access: "Public Read",
      color: "yellow",
      fields: [
        { col: "id", type: "uuid", note: "Primary key" },
        { col: "Name", type: "text", note: "Product display name" },
        { col: "description", type: "text", note: "Short feature summary" },
        { col: "priority", type: "int4", note: "Display ordering weight" },
        { col: "website_link", type: "text", note: "URL for iframe preview" },
      ],
    },
    {
      name: "api_docs",
      access: "Public Read",
      color: "purple",
      fields: [
        { col: "id", type: "uuid", note: "Primary key" },
        { col: "model_id", type: "uuid", note: "FK → models.id" },
        { col: "content", type: "jsonb", note: "Structured endpoint documentation" },
        { col: "section_type", type: "text", note: "e.g. overview, endpoint, schema" },
      ],
    },
  ],
  services: [
    { name: "Auth Service", status: "JWT + RLS", color: "green", desc: "Role-based row access for private model data" },
    { name: "Database API", status: "PostgREST v12", color: "blue", desc: "Auto-generated REST endpoints from Postgres schema" },
    { name: "File Storage", status: "S3 Compatible", color: "yellow", desc: "CDN-served buckets for binary model assets" },
    { name: "Real-time", status: "WebSocket", color: "purple", desc: "Live subscription layer for dashboard updates" },
    { name: "Edge Functions", status: "Deno Deploy", color: "blue", desc: "Serverless logic for heavy processing" },
  ],
  stats: [
    { metric: "~18ms", label: "Avg DB Query" },
    { metric: "99.9%", label: "Uptime SLA" },
    { metric: "RLS", label: "Security Tier" },
    { metric: "Postgres", label: "Engine" },
  ],
};

const ML = {
  subtitle: "Google Gemini 1.5 Pro · Flash · Multi-Modal Orchestration",
  overview: `PromptVista ML acts as an intelligent orchestration gateway over Google's Gemini API family. Rather than exposing raw model access, we apply a layered pipeline: input filtering, modality detection, contextual enrichment via system-level prompts stored in our database, and structured JSON extraction — ensuring every output is UI-ready and schema-validated.`,
  models: [
    { id: "gemini-1.5-pro", role: "Complex reasoning, 1M+ token context, audio/video", badge: "PRIMARY", color: "blue" },
    { id: "gemini-1.5-flash", role: "High-speed inference for text/vision tasks", badge: "FAST PATH", color: "green" },
    { id: "gemini-1.0-pro", role: "Legacy text completion for compatibility", badge: "FALLBACK", color: "gray" },
  ],
  pipeline: [
    { step: "01", name: "Input Sanitization", desc: "Vista Secure AI layer detects and blocks prompt injection attacks, jailbreaks, and policy violations before any API call is made." },
    { step: "02", name: "Modality Detection", desc: "File MIME type and token count analysis routes the request to the appropriate Gemini variant — Pro for audio/video, Flash for text/images." },
    { step: "03", name: "System Enrichment", desc: "Model-specific system instructions are fetched from Supabase and prepended to the prompt, shaping persona, output format, and domain context." },
    { step: "04", name: "API Orchestration", desc: "Authenticated Gemini API call with dynamic temperature, top-p, and max-token parameters based on the model's registered schema." },
    { step: "05", name: "Structured Extraction", desc: "Response parsing enforces a JSON schema contract. If the raw output violates the schema, a retry with a correction prompt is issued automatically." },
    { step: "06", name: "UI Delivery", desc: "Validated payload is returned to the React layer where it hydrates the result card, confidence scores, and any modality-specific visualizations." },
  ],
  security: [
    { item: "Prompt Injection Detection", note: "Vista Secure AI real-time classification" },
    { item: "API Key Isolation", note: "Server-side only; never exposed to client" },
    { item: "Rate Limiting", note: "Per-user quota enforced at edge layer" },
    { item: "Schema Validation", note: "Zod-based output contract enforcement" },
    { item: "Safe Search", note: "Content filtering for offensive or unsafe outputs" },
  ],
  stats: [
    { metric: "1M+", label: "Max Context" },
    { metric: "3", label: "Active Models" },
    { metric: "< 2s", label: "Avg Latency" },
    { metric: "Zod", label: "Validation" },
    { metric: "98%", label: "Accuracy" },
    { metric: "Flash", label: "Engine" },
  ],
  capabilities: [
    { name: "Long Context", desc: "Process up to 1 million tokens for deep document analysis." },
    { name: "Vision Engine", desc: "Native image and video understanding without separate OCR." },
    { name: "Audio Native", desc: "Direct waveform analysis for sentiment and transcription." },
    { name: "JSON Mode", desc: "Guaranteed structured output for API-first applications." },
  ]
};

function useReveal() {
  const ref = useRef(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect() } }, { threshold: 0.05 })
    obs.observe(el); return () => obs.disconnect()
  }, [])
  return [ref, v]
}

/* ── small shared atoms ── */
const Stat = ({ metric, label, delay = 0 }) => (
  <div 
    className="p-4 border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40 text-center hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-300 group cursor-default transform hover:-translate-y-1"
    style={{ animation: `pv-up 0.6s ease both ${delay}s` }}
  >
    <div className="text-2xl font-bold text-gray-900 dark:text-white group-hover:scale-110 transition-transform duration-300 group-hover:text-purple-500">{metric}</div>
    <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mt-1">{label}</div>
  </div>
)

const Badge = ({ text, color = "purple", pulsing = false }) => {
  const colors = {
    blue: "border-blue-500/40 text-blue-400 bg-blue-900/20",
    green: "border-green-500/40 text-green-400 bg-green-900/20",
    yellow: "border-yellow-500/40 text-yellow-400 bg-yellow-900/20",
    gray: "border-gray-600 text-gray-400 bg-gray-800/40",
    purple: "border-purple-500/40 text-purple-400 bg-purple-900/20",
  }
  return (
    <span className={`relative inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border ${colors[color]}`}>
      {pulsing && <span className="w-1 h-1 rounded-full bg-current animate-pulse shadow-[0_0_8px_currentColor]" />}
      {text}
    </span>
  )
}

/* ── Interactive Flow Diagram Component ── */
const FlowNode = ({ title, desc, icon, delay = 0 }) => (
  <div 
    className="flex items-center gap-4 group cursor-help"
    style={{ animation: `pv-up 0.6s ease both ${delay}s` }}
  >
    <div className="w-10 h-10 flex-shrink-0 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center justify-center text-purple-500 group-hover:border-purple-500 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all">
      {icon}
    </div>
    <div>
      <div className="text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white group-hover:text-purple-500 transition-colors">{title}</div>
      <div className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{desc}</div>
    </div>
  </div>
)

/* ── FRONTEND SECTION ── */
const FrontendSection = () => {
  const [ref, v] = useReveal()
  return (
    <section ref={ref} style={{ opacity: 0, animation: v ? 'pv-up .7s ease forwards' : 'none' }} className="space-y-14">
      {/* Overview */}
      <div className="grid lg:grid-cols-[1fr_380px] gap-10">
        <div className="space-y-8">
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-loose">{FRONTEND.overview}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {FRONTEND.perf.map((s, idx) => <Stat key={s.label} {...s} delay={idx * 0.05} />)}
          </div>
        </div>

        <div className="boxy-card bg-gray-50 dark:bg-gray-950 p-6 relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="text-[9px] font-mono text-gray-500 mb-5 tracking-[0.4em] uppercase border-b border-gray-800 pb-2 flex justify-between items-center relative z-10">
            Visual Stack
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse shadow-[0_0_10px_#8b5cf6]" />
          </div>
          <div className="space-y-3 relative z-10">
            {FRONTEND.stack.map((t, idx) => (
              <div 
                key={t.label} 
                className="flex flex-col sm:flex-row sm:items-center gap-1 sm:justify-between py-2 border-b border-gray-800/60 last:border-0 hover:bg-white/5 transition-all px-2 transform hover:translate-x-1"
                style={{ animation: `pv-up 0.5s ease both ${0.3 + idx * 0.05}s` }}
              >
                <span className="text-[10px] font-mono uppercase text-gray-500">{t.label}</span>
                <span className="text-xs font-bold text-purple-400">{t.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Design System */}
      <div className="space-y-8">
        <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-6 pb-2 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          Design System Tokens
          <span className="text-[10px] font-mono lowercase text-gray-500">Atomic Utilities</span>
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FRONTEND.designSystem.map((d, idx) => (
            <div 
              key={d.name} 
              className="p-5 border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/30 hover:border-purple-400/40 hover:bg-purple-500/5 transition-all group relative overflow-hidden"
              style={{ animation: `pv-up 0.6s ease both ${0.1 + idx * 0.05}s` }}
            >
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-purple-500">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/></svg>
              </div>
              <div className="font-mono text-xs text-purple-600 dark:text-purple-400 font-bold mb-2 group-hover:text-purple-500 transition-colors">{d.name}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{d.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Page Registry */}
      <div className="space-y-8">
        <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">Page / Route Registry</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {FRONTEND.pages.map((p, idx) => (
            <div 
              key={p.name} 
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 border border-gray-200 dark:border-gray-800 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all group"
              style={{ animation: `pv-up 0.5s ease both ${0.2 + idx * 0.05}s` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-gray-300 group-hover:bg-purple-500 transition-colors" />
                <span className="font-mono text-sm text-gray-900 dark:text-white font-bold">{p.name}</span>
              </div>
              <span className="text-xs text-gray-500 italic">{p.role}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── BACKEND SECTION ── */
const BackendSection = () => {
  const [ref, v] = useReveal()
  const [activeTable, setActiveTable] = useState("models")
  const table = BACKEND.tables.find(t => t.name === activeTable)

  return (
    <section ref={ref} style={{ opacity: 0, animation: v ? 'pv-up .7s ease forwards' : 'none' }} className="space-y-14">
      {/* Overview + Stats */}
      <div className="grid lg:grid-cols-[1fr_380px] gap-10">
        <div className="space-y-8">
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-loose">{BACKEND.overview}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {BACKEND.stats.map((s, idx) => <Stat key={s.label} {...s} delay={idx * 0.1} />)}
          </div>
        </div>

        <div className="boxy-card bg-gray-50 dark:bg-gray-950 p-6 space-y-4 relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="text-[9px] font-mono text-gray-500 mb-5 tracking-[0.4em] uppercase border-b border-gray-800 pb-2 flex justify-between items-center relative z-10">
            Service Layer
            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_10px_#eab308]" />
          </div>
          <div className="space-y-3 relative z-10">
            {BACKEND.services.map((s, idx) => (
              <div 
                key={s.name} 
                className="p-3 border border-gray-800 flex items-start gap-3 hover:bg-white/5 transition-all transform hover:translate-x-1"
                style={{ animation: `pv-up 0.5s ease both ${0.2 + idx * 0.05}s` }}
              >
                <Badge text={s.status} color={s.color} pulsing={true} />
                <div>
                  <div className="text-xs font-bold text-gray-300 mb-0.5 group-hover:text-yellow-500 transition-colors">{s.name}</div>
                  <div className="text-[10px] text-gray-600">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Schema Explorer */}
      <div className="space-y-8">
        <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-6 pb-2 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          Database Schema Explorer
          <span className="text-[10px] font-mono lowercase text-gray-500 italic">Live Postgres Mapping</span>
        </h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {BACKEND.tables.map(t => (
            <button
              key={t.name}
              onClick={() => setActiveTable(t.name)}
              className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-widest border transition-all duration-300 relative group ${
                activeTable === t.name
                  ? 'border-yellow-500 bg-yellow-900/10 text-yellow-500'
                  : 'border-gray-300 dark:border-gray-700 text-gray-500 hover:border-yellow-500/50'
              }`}
            >
              {t.name}
              {activeTable === t.name && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full animate-ping" />
              )}
            </button>
          ))}
        </div>
        {table && (
          <div className="overflow-x-auto boxy-card border border-gray-200 dark:border-gray-800">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800/80">
                  <th className="text-left p-4 font-mono font-bold uppercase text-gray-500 border-b border-gray-200 dark:border-gray-700">Notes</th>
                </tr>
              </thead>
              <tbody>
                {table.fields.map((f, i) => (
                  <tr 
                    key={f.col} 
                    className={`${i % 2 === 0 ? 'bg-white dark:bg-gray-900/30' : 'bg-gray-50 dark:bg-gray-900/10'} hover:bg-yellow-500/5 transition-colors group`}
                  >
                    <td className="p-4 font-mono font-bold text-yellow-600 dark:text-yellow-500 group-hover:translate-x-1 transition-transform">{f.col}</td>
                    <td className="p-4 font-mono text-blue-600 dark:text-blue-400">{f.type}</td>
                    <td className="p-4 text-gray-500 italic">{f.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

/* ── ML SECTION ── */
const MLSection = () => {
  const [ref, v] = useReveal()
  return (
    <section ref={ref} style={{ opacity: 0, animation: v ? 'pv-up .7s ease forwards' : 'none' }} className="space-y-14">
      {/* Overview + Stats */}
      <div className="grid lg:grid-cols-[1fr_380px] gap-10">
        <div className="space-y-8">
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-loose">{ML.overview}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {ML.stats.map((s, idx) => <Stat key={s.label} {...s} delay={idx * 0.1} />)}
          </div>
        </div>

        {/* Model registry */}
        <div className="boxy-card bg-gray-50 dark:bg-gray-950 p-6 space-y-4 relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="text-[9px] font-mono text-gray-500 mb-5 tracking-[0.4em] uppercase border-b border-gray-800 pb-2 flex justify-between items-center relative z-10">
            Model Registry
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]" />
          </div>
          <div className="space-y-4 relative z-10">
            {ML.models.map((m, idx) => (
              <div 
                key={m.id} 
                className="p-4 border border-gray-800 space-y-2 hover:bg-white/5 transition-all transform hover:-translate-y-1"
                style={{ animation: `pv-up 0.5s ease both ${0.2 + idx * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-white font-bold group-hover:text-blue-400 transition-colors">{m.id}</span>
                  <Badge text={m.badge} color={m.color} pulsing={m.badge === "PRIMARY"} />
                </div>
                <div className="text-[10px] text-gray-500 italic">{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline */}
      <div className="space-y-10">
        <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-6 pb-2 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          6-Stage Processing Pipeline
          <span className="text-[10px] font-mono lowercase text-gray-500">End-to-End Orchestration</span>
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {/* Animated Connecting Line (Decorative) */}
          <div className="absolute inset-0 pointer-events-none opacity-20 hidden lg:block">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <path d="M 50,50 L 950,50" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" className="text-blue-500 animate-[dash_30s_linear_infinite]" />
            </svg>
          </div>
          {ML.pipeline.map((s, idx) => (
            <div 
              key={s.step} 
              className="p-6 border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/30 hover:border-blue-400/40 hover:bg-blue-500/5 transition-all group relative overflow-hidden transform hover:-translate-y-2"
              style={{ animation: `pv-up 0.6s ease both ${0.1 + idx * 0.1}s` }}
            >
              <div className="absolute -bottom-4 -right-4 text-4xl font-bold text-gray-500/5 group-hover:text-blue-500/10 transition-colors">{s.step}</div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">{s.name}</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed relative z-10">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="space-y-8">
        <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">Security Safeguards</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ML.security.map((s, idx) => (
            <div 
              key={s.item} 
              className="flex items-start gap-4 p-5 border border-gray-200 dark:border-gray-800 bg-white/40 dark:bg-gray-900/20 hover:border-red-500/30 transition-all group"
              style={{ animation: `pv-up 0.5s ease both ${0.3 + idx * 0.05}s` }}
            >
              <div className="w-2 h-2 mt-1.5 bg-red-500 animate-pulse flex-shrink-0 shadow-[0_0_8px_#ef4444]" />
              <div>
                <div className="text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white group-hover:text-red-500 transition-colors">{s.item}</div>
                <div className="text-[10px] text-gray-500 mt-1 italic">{s.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Capabilities */}
      <div className="space-y-8">
        <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">Model Capabilities</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ML.capabilities.map((c, idx) => (
            <div 
              key={c.name} 
              className="boxy-card p-6 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 transition-all"
              style={{ animation: `pv-up 0.5s ease both ${0.4 + idx * 0.1}s` }}
            >
              <div className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2">{c.name}</div>
              <div className="text-[10px] text-gray-500 leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── MAIN ── */
const Architecture = () => {
  const [activeTab, setActiveTab] = useState("frontend")
  const [hRef, hVis] = useReveal()

  const TABS = [
    { id: "frontend", label: "Frontend", sub: FRONTEND.subtitle, icon: "UI" },
    { id: "backend", label: "Backend", sub: BACKEND.subtitle, icon: "DB" },
    { id: "ml", label: "AI / ML", sub: ML.subtitle, icon: "AI" },
  ]

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [activeTab])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative pb-24 selection:bg-purple-500/30">
      {/* Ambient orbs */}
      <div className="pv-glow pointer-events-none fixed top-1/3 -left-40 w-[500px] h-[500px] rounded-full hidden sm:block z-0"
        style={{ background:'radial-gradient(circle,rgba(139,92,246,.1) 0%,transparent 70%)' }} />
      <div className="pv-glow pointer-events-none fixed bottom-1/4 -right-40 w-[500px] h-[500px] rounded-full hidden sm:block z-0"
        style={{ background:'radial-gradient(circle,rgba(96,165,250,.08) 0%,transparent 70%)', animationDelay:'1.8s' }} />



      {/* Hero */}
      <header className="relative pt-20 pb-12 overflow-hidden z-10 border-b border-gray-200 dark:border-gray-800">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div
          ref={hRef}
          className="max-w-7xl mx-auto px-4 text-center relative"
          style={{ opacity: 0, animation: hVis ? 'pv-up .8s ease forwards' : 'none' }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-bold tracking-widest uppercase border border-purple-200 dark:border-purple-800 mb-6">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
            Technical Infrastructure
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            System <span className="pv-grad-text">Architecture</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed font-normal">
            A comprehensive deep-dive into the multi-modal orchestration engine, 
            serverless data backbone, and the high-fidelity UI framework of PromptVista ML.
          </p>
        </div>

        {/* Floating System Health Ticker - Moved to Middle */}
        <div className="mt-16 bg-white/60 dark:bg-gray-950/60 backdrop-blur-md border-y border-gray-200 dark:border-gray-800 py-3 overflow-hidden">
          <div className="flex whitespace-nowrap animate-[scroll_40s_linear_infinite] text-[10px] font-mono text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em] font-bold">
            {[...Array(4)].map((_, i) => (
              <span key={i} className="flex items-center gap-10 px-8">
                <span>Uptime: <span className="text-green-600 dark:text-green-500">99.99%</span></span>
                <span className="text-gray-300 dark:text-gray-700">/</span>
                <span>Latency: <span className="text-purple-600 dark:text-purple-400">142ms</span></span>
                <span className="text-gray-300 dark:text-gray-700">/</span>
                <span>DB: <span className="text-blue-600 dark:text-blue-400">Connected</span></span>
                <span className="text-gray-300 dark:text-gray-700">/</span>
                <span>Edge: <span className="text-yellow-600 dark:text-yellow-500">Active</span></span>
                <span className="text-gray-300 dark:text-gray-700">/</span>
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Tab nav */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-y border-gray-200 dark:border-gray-800 shadow-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto no-scrollbar">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-shrink-0 text-left px-8 py-6 transition-all duration-500 relative border-r border-gray-100 dark:border-gray-800 last:border-0 group min-w-[200px] ${
                  activeTab === t.id ? 'bg-gray-50/50 dark:bg-purple-500/5' : 'hover:bg-gray-50/30 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`text-[10px] font-mono font-bold border px-1.5 py-0.5 transition-colors ${activeTab === t.id ? 'border-purple-500 text-purple-500 bg-purple-500/10' : 'border-gray-500 text-gray-500'}`}>
                    {t.icon}
                  </div>
                  <div className={`text-sm font-bold uppercase tracking-[0.2em] transition-colors ${activeTab === t.id ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>{t.label}</div>
                </div>
                <div className="text-[9px] text-gray-400 mt-1.5 hidden sm:block font-mono truncate max-w-[150px]">{t.sub}</div>
                {activeTab === t.id && (
                  <>
                    <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-purple-600 dark:bg-purple-500 animate-[width_0.4s_ease]" />
                    <div className="absolute top-0 left-0 w-full h-full shadow-[inset_0_0_20px_rgba(139,92,246,0.1)] pointer-events-none" />
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-20 relative z-10">
        <div className="absolute inset-0 pv-grid pointer-events-none -z-10" />
        <div className="animate-[fadeIn_0.6s_ease-out]">
          {activeTab === "frontend" && <FrontendSection />}
          {activeTab === "backend" && <BackendSection />}
          {activeTab === "ml" && <MLSection />}
        </div>
      </main>

      {/* Dynamic Activity Log (Moving Element) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-20">
        <div className="boxy-card bg-gray-50 dark:bg-gray-950 p-4 relative overflow-hidden group">
          <div className="flex items-center gap-4 text-[10px] font-mono">
            <span className="text-green-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
              LIVE SYSTEM LOGS
            </span>
            <div className="flex-1 overflow-hidden">
              <div className="whitespace-nowrap animate-[scroll_30s_linear_infinite] text-gray-500 uppercase tracking-widest">
                [SYSTEM] Querying Supabase models... [GEMINI] 1.5-Pro Latency: 1.2s... [AUTH] JWT Session Validated... [UI] Triggering pv-up animation... [STORAGE] Fetching multi-modal binary assets... [SYSTEM] Pipeline Step 04 active... [VISTA] Security scan complete: 0 threats detected...
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 mt-32 relative z-10">
        <div className="boxy-card p-12 sm:p-16 bg-white dark:bg-gray-950 relative overflow-hidden text-center group border border-purple-500/30 shadow-2xl">
          <div className="absolute inset-0 pv-grid pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
          
          <div className="relative z-10 space-y-8">
            <h3 className="text-4xl sm:text-5xl font-bold tracking-tighter text-gray-900 dark:text-white">Engineered for the Future</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed font-normal">
              PromptVista ML isn't just a project; it's a blueprint for multi-modal AI applications. 
              Explore the documentation or start building today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
              <Link to="/api-docs" className="px-10 py-4 bg-purple-600 text-white font-bold uppercase tracking-[0.3em] text-xs hover:bg-purple-700 transition-all hover:scale-105 active:scale-95">
                API Reference
              </Link>
              <Link to="/products" className="px-10 py-4 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold uppercase tracking-[0.3em] text-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-all hover:scale-105 active:scale-95">
                View Products
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Animations Style */}

    </div>
  )
}

export default Architecture