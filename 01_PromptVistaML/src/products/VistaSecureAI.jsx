import { useEffect, useState, useRef } from 'react'

/* ─── Intersection observer hook ─── */
function useReveal(threshold = 0.08) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

/* ─── Icons ─── */
const Icon = {
  shield: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  terminal: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  api: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
}

const VistaSecureAI = () => {
  const [ref, visible] = useReveal(0.1)

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 px-4 border border-[color:var(--border)] bg-[color:var(--card-bg)] shadow-xl mb-20">
      {/* Background patterns */}
      <div className="absolute inset-0 pv-grid pointer-events-none opacity-40" />
      
      {/* Ambient orbs */}
      <div 
        className="pv-glow absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20 pointer-events-none hidden sm:block"
        style={{ background: 'radial-gradient(circle, var(--brand-purple) 0%, transparent 70%)' }}
      />
      <div 
        className="pv-glow absolute -bottom-24 -left-24 w-96 h-96 rounded-full opacity-10 pointer-events-none hidden sm:block"
        style={{ background: 'radial-gradient(circle, var(--brand-yellow) 0%, transparent 70%)', animationDelay: '1.5s' }}
      />

      <div 
        ref={ref}
        className="max-w-6xl mx-auto relative z-10"
        style={{ 
          opacity: 0, 
          animation: visible ? 'pv-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards' : 'none' 
        }}
      >
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-[color:var(--muted-text)] uppercase">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Security Layer by PromptVistaML
          </span>
        </div>

        {/* Hero-like Title & Intro */}
        <div className="text-center mb-16">
          <h2 className="text-[clamp(2rem,7vw,4.5rem)] font-black leading-[1.1] mb-8 text-[color:var(--text)]">
            Vista <span className="pv-grad-text">Secure AI</span>
          </h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            <p className="text-base sm:text-lg md:text-xl text-[color:var(--muted-text)] leading-relaxed">
              As AI adoption grows, so do risks like prompt injection and hidden vulnerabilities within prompt-driven systems. 
              Vista Secure AI is built to protect AI applications by detecting and mitigating prompt-based attacks and security loopholes in real time.
            </p>
            <p className="text-base sm:text-lg md:text-xl text-[color:var(--muted-text)] leading-relaxed">
              Designed for developers and organizations deploying LLM-powered systems, it integrates seamlessly via CLI and API endpoints to analyze prompts, identify threats, and enforce security layers before execution. This ensures safer, more reliable AI interactions across applications.
            </p>
          </div>
        </div>

        {/* Functional Highlights */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div className="pv-card border border-[color:var(--border)] bg-[color:var(--panel)] p-6 group hover:border-brand-purple transition-all">
            <div className="w-10 h-10 flex items-center justify-center text-brand-purple border border-[color:var(--border)] mb-4 bg-[color:var(--bg)] shadow-sm">
              {Icon.terminal}
            </div>
            <h3 className="text-lg font-bold mb-3 text-[color:var(--text)]">CLI First</h3>
            <p className="text-sm text-[color:var(--muted-text)] leading-relaxed">
              Analyze prompts directly from your terminal or CI/CD pipeline. Rapid threat detection for local development.
            </p>
          </div>

          <div className="pv-card border border-[color:var(--border)] bg-[color:var(--panel)] p-6 group hover:border-brand-purple transition-all">
            <div className="w-10 h-10 flex items-center justify-center text-brand-purple border border-[color:var(--border)] mb-4 bg-[color:var(--bg)] shadow-sm">
              {Icon.api}
            </div>
            <h3 className="text-lg font-bold mb-3 text-[color:var(--text)]">Production API</h3>
            <p className="text-sm text-[color:var(--muted-text)] leading-relaxed">
              Integrate the security layer into your application backend with sub-50ms latency for real-time protection.
            </p>
          </div>

          <div className="pv-card border border-[color:var(--border)] bg-[color:var(--panel)] p-6 group hover:border-brand-purple transition-all sm:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 flex items-center justify-center text-brand-purple border border-[color:var(--border)] mb-4 bg-[color:var(--bg)] shadow-sm">
              {Icon.shield}
            </div>
            <h3 className="text-lg font-bold mb-3 text-[color:var(--text)]">Attack Mitigation</h3>
            <p className="text-sm text-[color:var(--muted-text)] leading-relaxed">
              Automatically block or sanitize prompts containing injection attacks, PII leaks, or malicious instructions.
            </p>
          </div>
        </div>

        {/* Tech Badges */}
        <div className="flex flex-wrap justify-center gap-2">
          {['Prompt Injection', 'PII Masking', 'Threat Detection', 'LLM Guardrails', 'Real-time Analysis', 'CLI Tools', 'Secure API'].map((tag) => (
            <span key={tag} className="border border-[color:var(--border)] bg-[color:var(--bg)] px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[color:var(--muted-text)] hover:border-brand-purple hover:text-brand-purple transition-colors cursor-default">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default VistaSecureAI
