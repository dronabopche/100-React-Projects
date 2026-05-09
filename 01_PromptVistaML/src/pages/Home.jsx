import { Link } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import ModelCard from '../components/ModelCard'
import { fetchAllModels } from '../services/supabase'

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

/* ─── Animated number counter ─── */
function Counter({ target, suffix = '', duration = 1600 }) {
  const [val, setVal] = useState(0)
  const [ref, visible] = useReveal(0.3)
  useEffect(() => {
    if (!visible) return
    const n = parseInt(target)
    if (isNaN(n)) { setVal(target); return }
    let cur = 0
    const step = Math.max(1, Math.ceil(n / (duration / 16)))
    const t = setInterval(() => {
      cur = Math.min(cur + step, n)
      setVal(cur)
      if (cur >= n) clearInterval(t)
    }, 16)
    return () => clearInterval(t)
  }, [visible, target, duration])
  return <span ref={ref}>{typeof val === 'number' ? val + suffix : val}</span>
}

/* ─── All SVG icons — zero emojis ─── */
const Icon = {
  layers: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  chat:   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
  shield: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  bolt:   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  check:  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>,
  arrow:  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>,
  arrowR: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>,
  code:   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
  sparkle:<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  db:     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" /></svg>,
  term:   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  chart:  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  cpu:    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3H7a2 2 0 00-2 2v2M9 3h6M9 3v2m6-2h2a2 2 0 012 2v2m0 0V7m0 0h2m-2 0v10m0 0v2a2 2 0 01-2 2h-2m0 0H9m6 0v-2M9 21H7a2 2 0 01-2-2v-2m0 0V7m0 10H3m4 0v2M3 7h4M3 7V5a2 2 0 012-2h2M9 21v-2M9 9h6v6H9z" /></svg>,
  down:   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>,
  plus:   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  user:   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
}

const Home = () => {
  const [models, setModels]   = useState([])
  const [isLoading, setLoad]  = useState(true)
  const [openFaq, setOpenFaq] = useState(null)

  const [heroRef,     heroVis]     = useReveal(0.04)
  const [stepsRef,    stepsVis]    = useReveal(0.05)
  const [featRef,     featVis]     = useReveal(0.05)
  const [whyRef,      whyVis]      = useReveal(0.05)
  const [socialRef,   socialVis]   = useReveal(0.05)
  const [faqRef,      faqVis]      = useReveal(0.05)

  useEffect(() => {
    fetchAllModels()
      .then(d => setModels(d.slice(0, 6)))
      .catch(e => console.error(e))
      .finally(() => setLoad(false))
  }, [])

  /* ── data ── */
  const steps = [
    { n: '01', title: 'Pick a Model',    desc: 'Browse deployed ML models with clear descriptions, categories, and ready-to-use example prompts.', icon: Icon.layers },
    { n: '02', title: 'Write a Prompt',  desc: 'Copy an example or craft your own prompt directly in the test UI — no JSON or schema knowledge needed.', icon: Icon.chat },
    { n: '03', title: 'GenAI Validation',desc: 'Gemini analyses the prompt for sufficiency, structures the payload, and stops weak inputs before they reach the model.', icon: Icon.shield },
    { n: '04', title: 'Instant Output',  desc: 'A validated request dispatches to the model backend and the result is returned in under 100 ms.', icon: Icon.bolt },
  ]

  const features = [
    { title: 'Prompt Validation Layer',  desc: 'Gemini-powered pre-flight check ensures every prompt meets model requirements — no wasted compute.',            icon: Icon.shield  },
    { title: 'Smart Auto-Completion',    desc: 'Automatically infers and fills missing input fields when context provides enough signal.',                       icon: Icon.sparkle },
    { title: 'Live Model Catalog',       desc: 'Searchable catalog with categories, tags, and curated examples loaded in real-time from Supabase.',             icon: Icon.layers  },
    { title: 'Supabase-Powered Backend', desc: 'All model metadata syncs dynamically — add a model to the database and it appears on the platform instantly.',  icon: Icon.db      },
    { title: 'Developer-First UI',       desc: 'No marketing noise. Fast iteration, clean output, and clear errors — exactly what engineers need.',             icon: Icon.term    },
    { title: 'Sub-100ms Execution',      desc: 'Optimised request pipeline from prompt to API response. Stable and fast enough for production workflows.',      icon: Icon.bolt    },
  ]

  const stats = [
    { value: '100',  suffix: '+',  label: 'Live Models'   },
    { value: '80',  suffix: '%',  label: 'Uptime SLA'    },
    { value: '100', suffix: 'ms', label: 'Avg Response'  },
    { value: '12',  suffix: '+',  label: 'Categories'    },
  ]

  const tech = ['Matplotlib', 'Numpy', 'React', 'Vite', 'Sklearn', 'Supabase', 'API', 'Pandas', 'Seaborn']

  const flow = [
    { label: 'User Prompt',       sub: 'Natural language input',            color: '#8b5cf6', pct: 100 },
    { label: 'Gemini Validation', sub: 'Sufficiency check & structuring',   color: '#60a5fa', pct: 92  },
    { label: 'Model Endpoint',    sub: 'Backend REST API execution',         color: '#34d399', pct: 84  },
    { label: 'Structured Output', sub: 'Result returned to the UI',          color: '#f59e0b', pct: 78  },
  ]

  const faqs = [
    { q: 'What is PromptVista ML?',
      a: 'PromptVista ML is a prompt-to-API testing platform for deployed machine learning models. A GenAI validation layer powered by Gemini checks every prompt before it reaches the model endpoint.' },
    { q: 'What does the Gemini validation layer do?',
      a: 'Before your prompt hits the model, Gemini analyses it for data sufficiency. If the prompt is too vague or missing required context, it returns structured feedback instead of consuming a model call.' },
    { q: 'How are models added to the platform?',
      a: 'Models are stored in Supabase. Adding a new model is as simple as inserting a database row — the platform loads it in real-time, no frontend redeploy needed.' },
    { q: 'Can I use it for production API calls?',
      a: 'PromptVista connects to real model endpoints so responses are production-grade, but the UI is optimised for development and validation workflows.' },
    { q: 'Is the API documented?',
      a: 'Yes. Full endpoint documentation, request/response schemas, and example curl commands are in the API Docs section.' },
  ]

  const testimonials = [
    { quote: 'Finally a way to test models without wrestling with raw JSON. The validation layer alone saves hours of debugging.', author: 'Amit Rajput', co: 'Backend Engineer' },
    { quote: 'The Supabase integration means our catalog stays up to date automatically. We add models, they just appear.', author: 'Kunal Kamat', co: 'ML Platform Lead' },
    { quote: 'Sub-100ms responses and a clean UI. PromptVista replaced three separate internal tools for our team.', author: 'Omkar Muki', co: 'Full-Stack Developer' },
  ]

  const tickerItems = [
    'Pick a Model', '›', 'Write a Prompt', '›', 'GenAI Validation', '›',
    'Model Execution', '›', 'Instant Output', '·',
    'Supabase-Powered', '·', 'Gemini Layer', '·', '<100ms Responses', '·', '50+ Live Models', '·',
  ]

  /* ── render ── */
  return (
    <>


      <div className="space-y-16 sm:space-y-20">

        {/* ══════ HERO ══════ */}
        <section className="relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden">
          <div className="absolute inset-0 pv-grid pointer-events-none" />

          {/* Ambient orbs */}
          <div className="pv-glow pointer-events-none absolute top-1/3 -left-40 w-[420px] h-[420px] rounded-full hidden sm:block"
            style={{ background:'radial-gradient(circle,rgba(139,92,246,.14) 0%,transparent 70%)' }} />
          <div className="pv-glow pointer-events-none absolute bottom-1/4 -right-40 w-[420px] h-[420px] rounded-full hidden sm:block"
            style={{ background:'radial-gradient(circle,rgba(96,165,250,.11) 0%,transparent 70%)', animationDelay:'1.8s' }} />

          {/* Floating code chips — desktop only */}
          <div className="pv-f1 pointer-events-none absolute top-10 right-6 hidden xl:block" style={{ opacity:.55 }}>
            <div className="border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 font-mono text-xs text-[color:var(--muted-text)] shadow-lg">
              <span style={{ color:'#8b5cf6' }}>POST</span> /api/models/predict<br />
              <span style={{ color:'#60a5fa' }}>Authorization</span>: Bearer •••<br />
              <span style={{ color:'#34d399' }}>✓</span> Validation passed · 12ms
            </div>
          </div>
          <div className="pv-f2 pointer-events-none absolute bottom-20 left-6 hidden xl:block" style={{ opacity:.45 }}>
            <div className="border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 font-mono text-xs text-[color:var(--muted-text)] shadow-lg">
              <span style={{ color:'#34d399' }}>200 OK</span> · 43ms<br />
              <span style={{ color:'#8b5cf6' }}>confidence</span>: 0.97<br />
              <span style={{ color:'#60a5fa' }}>tokens_used</span>: 312
            </div>
          </div>

          {/* Header style to match Models.jsx */}
          <header className="relative w-full pt-20 pb-12 overflow-hidden z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
            
            <div 
              ref={heroRef}
              className="max-w-7xl mx-auto px-4 text-center relative"
              style={{ opacity:0, animation: heroVis ? 'pv-up .85s ease forwards' : 'none' }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-bold tracking-widest uppercase border border-purple-200 dark:border-purple-800 mb-6">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse flex-shrink-0" />
                PromptVista ML · Showcasing Model Platform
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-[1.06]">
                ML Models, <span className="pv-grad-text">Prompt Engineering</span>
                <br className="hidden sm:block" />
                &amp; Prompt-to-API Automation
              </h1>
              
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed font-normal">
                Stop Filling Forms. Start Prompting ML.
              </p>

            {/* CTAs — stacked on mobile, row on sm+ */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-9">
              <Link to="/models" className="btn-primary hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl">
                <span className="flex items-center justify-center gap-2">Explore Models {Icon.arrow}</span>
              </Link>
              <Link to="https://github.com/dronabopche/100-ML-AI-Project" className="btn-secondary hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-center">
                * Star on GitHub
              </Link>
              <Link to="/api-docs" className="btn-secondary hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-center">
                API Docs
              </Link>
            </div>

            {/* Tech badges */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {tech.map(b => (
                <span key={b}
                  className="border border-[color:var(--border)] bg-[color:var(--bg)] px-3 py-1 text-xs font-mono text-[color:var(--muted-text)] hover:border-brand-purple hover:text-brand-purple transition-colors duration-200 cursor-default">
                  {b}
                </span>
              ))}
            </div>

            {/* Stats grid — 2 cols on mobile, 4 on sm+ */}
            <div className="grid grid-cols-2 sm:grid-cols-4 border border-[color:var(--border)] overflow-hidden mt-12">
              {stats.map(s => (
                <div key={s.label} className="bg-[color:var(--bg)] px-4 py-5 text-center hover:bg-[color:var(--panel)] transition-colors border-r border-b border-[color:var(--border)] last:border-r-0 [&:nth-child(2)]:border-r-0 sm:[&:nth-child(2)]:border-r [&:nth-child(3)]:border-b-0 [&:nth-child(4)]:border-b-0 [&:nth-child(1)]:border-b-0 sm:[&:nth-child(1)]:border-b sm:[&:nth-child(3)]:border-b-0">
                  <div className="text-2xl sm:text-3xl font-bold text-brand-purple font-mono leading-none">
                    {s.suffix === 'ms' ? '<' : ''}<Counter target={s.value} suffix={s.suffix} />
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
          </header>
        </section>
 {/* ══════ MODELS PREVIEW ══════ */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <p className="text-xs font-semibold tracking-widest text-brand-purple uppercase mb-2">Live from Database</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text)]">Available Models</h2>
              <p className="text-[color:var(--muted-text)] mt-2 text-sm sm:text-base">Production-deployed models ready to test right now.</p>
            </div>
            <Link to="/models" className="link-brand flex items-center gap-1 group font-semibold text-sm sm:text-base self-start sm:self-auto">
              <span>View all models</span>
              <span className="group-hover:translate-x-1 transition-transform">{Icon.arrowR}</span>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map(i => (
                <div key={i} className="border border-[color:var(--border)] bg-[color:var(--panel)] p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 bg-[color:var(--skeleton)] rounded-full" />
                      <div className="h-4 bg-[color:var(--skeleton)] w-1/3 rounded" />
                    </div>
                    <div className="h-6 bg-[color:var(--skeleton)] w-2/3 rounded" />
                    <div className="space-y-2">
                      <div className="h-3 bg-[color:var(--skeleton)] rounded" />
                      <div className="h-3 bg-[color:var(--skeleton)] w-5/6 rounded" />
                      <div className="h-3 bg-[color:var(--skeleton)] w-4/6 rounded" />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <div className="h-6 bg-[color:var(--skeleton)] w-16 rounded-full" />
                      <div className="h-6 bg-[color:var(--skeleton)] w-20 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {models.map(model => (
                <div key={model.id} className="pv-card">
                  <ModelCard model={model} />
                </div>
              ))}
            </div>
          )}
        </section>
        {/* ══════ TICKER ══════ */}
        <div className="border-y border-[color:var(--border)] bg-[color:var(--panel)] py-3 overflow-hidden select-none">
          <div className="pv-ticker-wrap">
            <div className="pv-ticker">
              {[...Array(2)].map((_, i) => (
                <span key={i} className="flex items-center gap-6 px-6 text-xs font-mono text-[color:var(--muted-text)] uppercase tracking-widest">
                  {tickerItems.map((t, j) => (
                    <span key={j} style={{ color: t === '›' || t === '·' ? '#8b5cf6' : undefined }}>{t}</span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>

       
        {/* ══════ TERMINAL ══════ */}
        <section className="border border-[color:var(--border)] bg-[color:var(--panel)] overflow-hidden">
          <div className="flex items-center gap-2 px-4 sm:px-5 py-3 border-b border-[color:var(--border)] bg-[color:var(--bg)]">
            <span className="w-3 h-3 rounded-full bg-red-500 opacity-75 flex-shrink-0" />
            <span className="w-3 h-3 rounded-full bg-yellow-500 opacity-75 flex-shrink-0" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 opacity-75 flex-shrink-0" />
            <span className="ml-3 text-xs font-mono text-[color:var(--muted-text)] truncate">promptvista — live request trace</span>
          </div>
          {/* overflow-x-auto so it scrolls on narrow phones instead of breaking layout */}
          <div className="overflow-x-auto">
            <div className="p-5 sm:p-8 font-mono text-xs sm:text-sm space-y-2 text-[color:var(--muted-text)] min-w-[300px]">
              <div><span style={{ color:'#8b5cf6' }}>$</span> <span className="text-[color:var(--text)]">promptvista run</span> --model sentiment-analysis</div>
              <div className="pl-4"><span style={{ color:'#60a5fa' }}>›</span> Fetching model metadata from Supabase...</div>
              <div className="pl-4"><span style={{ color:'#60a5fa' }}>›</span> Prompt: <span className="text-[color:var(--text)] italic">"Analyse: This product exceeded expectations!"</span></div>
              <div className="pl-4"><span style={{ color:'#34d399' }}>✓</span> Gemini validation passed — score: <span className="text-[color:var(--text)]">0.97</span></div>
              <div className="pl-4"><span style={{ color:'#34d399' }}>✓</span> Dispatching to model endpoint... <span style={{ color:'#f59e0b' }}>43ms</span></div>
              <div className="pl-4"><span style={{ color:'#8b5cf6' }}>←</span>{' '}
                <span className="text-[color:var(--text)]">{'{ "sentiment": "POSITIVE", "confidence": 0.98, "score": 4.9 }'}</span>
              </div>
              <div className="flex items-center gap-1"><span style={{ color:'#8b5cf6' }}>$</span><span className="pv-cursor" /></div>
            </div>
          </div>
        </section>

        {/* ══════ FEATURES ══════ */}
        <section ref={featRef} className="border border-[color:var(--border)] bg-[color:var(--panel)] p-5 sm:p-8 md:p-12">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-xs font-semibold tracking-widest text-brand-purple uppercase mb-3">Built Different</p>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[var(--text)]">Key Features</h2>
            <p className="text-[color:var(--muted-text)] mt-4 max-w-lg mx-auto text-sm sm:text-base">
              Every decision is intentional — optimised around prompt engineering and fast model testing.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {features.map((f, i) => (
              <div key={i}
                className="pv-card border border-[color:var(--border)] bg-[color:var(--bg)] p-5 sm:p-6"
                style={{ opacity: featVis ? 1 : 0, animation: featVis ? `pv-up .6s cubic-bezier(.22,1,.36,1) ${i * .08}s both` : 'none' }}>
                <div className="w-9 h-9 border border-[color:var(--border)] flex items-center justify-center text-brand-purple mb-4 flex-shrink-0">
                  {f.icon}
                </div>
                <h3 className="font-bold text-[color:var(--text)] text-sm sm:text-base mb-2">{f.title}</h3>
                <p className="text-sm text-[color:var(--muted-text)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════ TESTIMONIALS ══════ */}
        <section ref={socialRef}>
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-xs font-semibold tracking-widest text-brand-purple uppercase mb-3">From the Field</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text)]">What Developers Say</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div key={i}
                className="pv-card border border-[color:var(--border)] bg-[color:var(--panel)] p-5 sm:p-6 flex flex-col gap-4"
                style={{ opacity: socialVis ? 1 : 0, animation: socialVis ? `pv-up .6s cubic-bezier(.22,1,.36,1) ${i * .1}s both` : 'none' }}>
                <div className="text-4xl font-bold leading-none text-brand-purple opacity-25 select-none">&ldquo;</div>
                <p className="text-sm text-[color:var(--muted-text)] leading-relaxed flex-1 italic">{t.quote}</p>
                <div className="pt-4 border-t border-[color:var(--border)]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full border border-[color:var(--border)] flex items-center justify-center text-brand-purple flex-shrink-0">
                      {Icon.user}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[color:var(--text)]">{t.author}</p>
                      <p className="text-xs text-[color:var(--muted-text)]">{t.co}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════ HOW IT WORKS ══════ */}
        <section ref={stepsRef} className="relative py-24 overflow-hidden border-y border-[color:var(--border)]">
          <div className="absolute inset-0 pv-grid pointer-events-none" />
          <div className="text-center mb-10 sm:mb-14 px-4">
            <p className="text-xs font-semibold tracking-widest text-brand-purple uppercase mb-3">The Workflow</p>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[var(--text)]">How It Works</h2>
            <p className="text-[color:var(--muted-text)] mt-4 max-w-lg mx-auto text-sm sm:text-base">
              Four deliberate steps — from raw language to a model response — with zero guesswork.
            </p>
          </div>

          <div className="relative">
            <div className="pv-step-line hidden lg:block" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {steps.map((s, i) => (
                <div key={s.n}
                  className="pv-card border border-[color:var(--border)] bg-[color:var(--panel)] p-5 sm:p-6"
                  style={{ opacity: stepsVis ? 1 : 0, animation: stepsVis ? `pv-up .6s cubic-bezier(.22,1,.36,1) ${i * .1}s both` : 'none' }}>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                      style={{ background:'linear-gradient(135deg,#8b5cf6,#60a5fa)' }}>{s.n}</div>
                    <div className="text-brand-purple opacity-70">{s.icon}</div>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[var(--text)] mb-2">{s.title}</h3>
                  <p className="text-sm text-[color:var(--muted-text)] leading-relaxed">{s.desc}</p>
                  <div className="flex gap-1 mt-5 pt-4 border-t border-[color:var(--border)]">
                    {steps.map((_, j) => (
                      <div key={j} className="h-1 flex-1 rounded-full"
                        style={{ background: j <= i ? '#8b5cf6' : 'var(--border)' }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ FAQ ══════ */}
        <section ref={faqRef} className="border border-[color:var(--border)] bg-[color:var(--panel)] p-5 sm:p-8 md:p-12">
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-xs font-semibold tracking-widest text-brand-purple uppercase mb-3">Questions</p>
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
                  <span className="text-sm sm:text-base font-semibold text-[color:var(--text)] group-hover:text-brand-purple transition-colors pr-2">
                    {faq.q}
                  </span>
                  <span className="flex-shrink-0 text-brand-purple transition-transform duration-300"
                    style={{ display:'inline-block', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)' }}>
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
    </>
  )
}

export default Home
