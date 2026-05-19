import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

/* ─── Intersection observer hook ─── */
function useReveal(threshold = 0.08) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─── SVG Icons ─── */
const Icon = {
  arrowLeft: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  search: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  brain: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  shield: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  check: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  ),
  code: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  chart: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  arrowR: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
  down: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  ),
  plus: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
};

const PromptHallucinationML = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const [heroRef, heroVis] = useReveal(0.04);
  const [featuresRef, featuresVis] = useReveal(0.05);
  const [matrixRef, matrixVis] = useReveal(0.05);
  const [statsRef, statsVis] = useReveal(0.05);
  const [faqRef, faqVis] = useReveal(0.05);

  const features = [
    {
      icon: Icon.search,
      title: 'Fact-Check Engine',
      desc: 'Cross-reference LLM outputs against trusted knowledge bases and verified data sources in real-time.',
    },
    {
      icon: Icon.brain,
      title: 'Logic Validation',
      desc: 'Detect reasoning gaps, circular logic, and structural flaws in chain-of-thought before delivery.',
    },
    {
      icon: Icon.chart,
      title: 'Semantic Drift Detection',
      desc: 'Monitor embedding shifts and quality decay across model versions with automated regression alerts.',
    },
    {
      icon: Icon.shield,
      title: 'Hallucination Scoring',
      desc: 'Proprietary confidence scoring engine flags low-certainty outputs for human review.',
    },
    {
      icon: Icon.code,
      title: 'API-First Architecture',
      desc: 'REST and gRPC endpoints with sub-50ms latency — integrates directly into your inference pipeline.',
    },
    {
      icon: Icon.check,
      title: 'Audit Trail',
      desc: 'Every verification logged immutably for compliance, debugging, and model improvement workflows.',
    },
  ];

  const stats = [
    { value: '99.7', suffix: '%', label: 'Detection Rate' },
    { value: '50', suffix: 'ms', label: 'Avg Latency' },
    { value: '10', suffix: 'M+', label: 'Verifications' },
    { value: '200', suffix: '+', label: 'Data Sources' },
  ];

  const faqs = [
    {
      q: 'How does hallucination detection work?',
      a: 'PromptHallucination ML uses a multi-stage pipeline combining semantic similarity scoring, factual consistency checks against trusted sources, and logical coherence analysis to identify potential hallucinations before they reach end users.',
    },
    {
      q: 'What types of hallucinations can it detect?',
      a: 'The system detects factual inaccuracies, logical contradictions, entity mismatches, temporal inconsistencies, and fabricated citations. It also identifies subtle semantic drift where outputs sound plausible but deviate from ground truth.',
    },
    {
      q: 'Does it support all LLM providers?',
      a: 'Yes. PromptHallucination ML is provider-agnostic and works with outputs from OpenAI, Anthropic, Google, Meta, Mistral, and any custom or fine-tuned model via our universal API adapter.',
    },
    {
      q: 'What is the performance impact on inference?',
      a: 'Average verification latency is under 50ms, with batching support for high-throughput production environments. The async mode can verify outputs post-inference without adding latency to the user experience.',
    },
    {
      q: 'Can I customise the verification rules?',
      a: 'Absolutely. You can configure sensitivity thresholds, whitelist specific sources, define domain-specific fact-checking rules, and set custom scoring weights aligned to your use case and risk tolerance.',
    },
  ];

  return (
    <div className="product-detail-page">
      <div className="space-y-16 sm:space-y-20">

        {/* ══════ HERO ══════ */}
        <section className="relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden pt-24">
          <div className="absolute inset-0 pv-grid pointer-events-none" />

          {/* Ambient orbs */}
          <div className="pv-glow pointer-events-none absolute top-1/3 -left-40 w-[420px] h-[420px] rounded-full hidden sm:block"
            style={{ background: 'radial-gradient(circle,rgba(59,130,246,.14) 0%,transparent 70%)' }} />
          <div className="pv-glow pointer-events-none absolute bottom-1/4 -right-40 w-[420px] h-[420px] rounded-full hidden sm:block"
            style={{ background: 'radial-gradient(circle,rgba(96,165,250,.11) 0%,transparent 70%)', animationDelay: '1.8s' }} />

          <div ref={heroRef} className="relative w-full max-w-6xl mx-auto px-4"
            style={{ opacity: 0, animation: heroVis ? 'pv-up .85s ease forwards' : 'none' }}>

            {/* Back link */}
            <Link to="/products" className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-8 group">
              <span className="transform group-hover:-translate-x-1 transition-transform">{Icon.arrowLeft}</span>
              Back to Products
            </Link>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-widest uppercase border border-blue-200 dark:border-blue-800 mb-6">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse flex-shrink-0" />
              LLM Reliability · Enterprise-Grade Verification
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-[1.06]">
              Prompt<span className="pv-grad-text">Hallucination</span> ML
            </h1>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl text-lg leading-relaxed font-normal mb-9">
              The industry standard for LLM output verification. Detect and prevent factual inaccuracies,
              logic gaps, and hallucinations in real-time before they reach your users.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <a href="#api" className="btn-primary hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl">
                <span className="flex items-center justify-center gap-2">Start Verifying {Icon.arrowR}</span>
              </a>
              <a href="#docs" className="btn-secondary hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-center">
                View Documentation
              </a>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 border border-[color:var(--border)] overflow-hidden">
              {stats.map((s, i) => (
                <div key={s.label}
                  className={`bg-[color:var(--bg)] px-4 py-5 text-center hover:bg-[color:var(--panel)] transition-colors border-r border-b border-[color:var(--border)] 
                    ${i % 2 === 0 ? '' : 'border-r-0 sm:border-r'}
                    ${i >= 2 ? 'border-b-0' : ''}
                  `}>
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 font-mono leading-none">
                    {s.value}<span className="text-lg">{s.suffix}</span>
                  </div>
                  <p className="text-xs text-[color:var(--muted-text)] mt-2 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Scroll hint */}
            <div className="mt-10 flex justify-center animate-bounce">
              <div className="inline-flex flex-col items-center gap-1 text-xs text-[color:var(--muted-text)]">
                scroll to explore {Icon.down}
              </div>
            </div>
          </div>
        </section>

        {/* ══════ FEATURES ══════ */}
        <section ref={featuresRef} className="border border-[color:var(--border)] bg-[color:var(--panel)] p-5 sm:p-8 md:p-12 max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-xs font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-3">Verification Suite</p>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[var(--text)]">How It Protects Your Outputs</h2>
            <p className="text-[color:var(--muted-text)] mt-4 max-w-lg mx-auto text-sm sm:text-base">
              Multi-layered hallucination detection engineered for production reliability at scale.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {features.map((f, i) => (
              <div key={i}
                className="pv-card border border-[color:var(--border)] bg-[color:var(--bg)] p-5 sm:p-6 hover:border-blue-500/20 transition-all"
                style={{ opacity: featuresVis ? 1 : 0, animation: featuresVis ? `pv-up .6s cubic-bezier(.22,1,.36,1) ${i * .08}s both` : 'none' }}>
                <div className="w-9 h-9 border border-[color:var(--border)] flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 flex-shrink-0">
                  {f.icon}
                </div>
                <h3 className="font-bold text-[color:var(--text)] text-sm sm:text-base mb-2">{f.title}</h3>
                <p className="text-sm text-[color:var(--muted-text)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════ VERIFICATION MATRIX ══════ */}
        <section ref={matrixRef} className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-xs font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-3">Analysis Matrix</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text)]">Real-Time Verification Dashboard</h2>
            <p className="text-[color:var(--muted-text)] mt-4 max-w-lg mx-auto text-sm sm:text-base">
              Monitor hallucination scores, drift metrics, and verification coverage across all your LLM deployments.
            </p>
          </div>

          <div className="boxy-card aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden relative border border-[color:var(--border)]"
            style={{ opacity: matrixVis ? 1 : 0, animation: matrixVis ? 'pv-up .7s cubic-bezier(.22,1,.36,1) .1s both' : 'none' }}>
            {/* Terminal-style overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[color:var(--border)] bg-[color:var(--bg)]">
              <span className="w-3 h-3 rounded-full bg-red-500 opacity-75 flex-shrink-0" />
              <span className="w-3 h-3 rounded-full bg-yellow-500 opacity-75 flex-shrink-0" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 opacity-75 flex-shrink-0" />
              <span className="ml-3 text-xs font-mono text-[color:var(--muted-text)]">hallucination-matrix — live</span>
            </div>
            <div className="overflow-x-auto p-5 sm:p-8 font-mono text-xs sm:text-sm space-y-2 text-[color:var(--muted-text)]">
              <div><span style={{ color: '#60a5fa' }}>$</span> <span className="text-[color:var(--text)]">verify</span> --model gpt-4 --threshold 0.95</div>
              <div className="pl-4"><span style={{ color: '#60a5fa' }}>›</span> Loading verification pipeline...</div>
              <div className="pl-4"><span style={{ color: '#34d399' }}>✓</span> Fact-Check Engine: <span className="text-[color:var(--text)]">PASSED (0.97)</span></div>
              <div className="pl-4"><span style={{ color: '#34d399' }}>✓</span> Logic Validation: <span className="text-[color:var(--text)]">PASSED (0.94)</span></div>
              <div className="pl-4"><span style={{ color: '#f59e0b' }}>⚠</span> Semantic Drift: <span className="text-[color:var(--text)]">MINOR (0.12)</span></div>
              <div className="pl-4"><span style={{ color: '#34d399' }}>✓</span> Hallucination Score: <span className="text-[color:var(--text)]">0.03 — CLEAN OUTPUT</span></div>
              <div className="flex items-center gap-1"><span style={{ color: '#60a5fa' }}>$</span><span className="pv-cursor" /></div>
            </div>
          </div>
        </section>

        {/* ══════ API INTEGRATION ══════ */}
        <section id="api" className="max-w-6xl mx-auto px-4">
          <div className="pv-card bg-black text-white p-8 border border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <h4 className="text-sm font-mono uppercase tracking-widest text-gray-400">API Integration</h4>
            </div>
            <div className="bg-gray-900 p-4 border border-gray-700 font-mono text-sm overflow-x-auto">
              <span className="text-blue-400">curl</span> -X POST https://api.vista.ml/verify \<br />
              <span className="text-blue-400">-H</span> <span className="text-emerald-400">"Authorization: Bearer $VISTA_API_KEY"</span> \<br />
              <span className="text-blue-400">-H</span> <span className="text-emerald-400">"Content-Type: application/json"</span> \<br />
              <span className="text-blue-400">-d</span> <span className="text-emerald-400"> "text": "Your LLM output here", "model": "gpt-4", "threshold": 0.95</span>
            </div>
            <div className="flex gap-3 mt-4">
              <a href="#docs" className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                API Reference {Icon.arrowR}
              </a>
              <a href="#sdks" className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                SDK Docs {Icon.arrowR}
              </a>
            </div>
          </div>
        </section>

        {/* ══════ FAQ ══════ */}
        <section ref={faqRef} className="border border-[color:var(--border)] bg-[color:var(--panel)] p-5 sm:p-8 md:p-12 max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-xs font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-3">Questions</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text)]">Frequently Asked</h2>
          </div>
          <div className="max-w-3xl mx-auto divide-y divide-[color:var(--border)]">
            {faqs.map((faq, i) => (
              <div key={i}
                style={{ opacity: faqVis ? 1 : 0, animation: faqVis ? `pv-up .5s cubic-bezier(.22,1,.36,1) ${i * .07}s both` : 'none' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                >
                  <span className="text-sm sm:text-base font-semibold text-[color:var(--text)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors pr-2">
                    {faq.q}
                  </span>
                  <span className="flex-shrink-0 text-blue-600 dark:text-blue-400 transition-transform duration-300"
                    style={{ display: 'inline-block', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                    {Icon.plus}
                  </span>
                </button>
                <div className={`pv-faq-grid ${openFaq === i ? 'open' : ''}`}>
                  <div className="pv-faq-inner">
                    <p className="pb-5 text-sm text-[color:var(--muted-text)] leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default PromptHallucinationML;