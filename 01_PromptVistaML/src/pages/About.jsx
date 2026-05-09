import { Link } from 'react-router-dom'

/* ─── SVG icons ─── */
const Icon = {
  history: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-12 0 9 9 0 0112 0z" /></svg>,
  mission: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  vision: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c3.85 0 7.299 2.136 9.542 5.574a9.99 9.99 0 010 1.152C19.3 15.136 15.85 18 12 18c-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  globe: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.6 9h16.8M3.6 15h16.8" /></svg>,
}

const About = () => {
  return (
    <div className="relative min-h-screen border-x border-[color:var(--border)] max-w-7xl mx-auto overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 pv-grid pointer-events-none" />

      <div className="relative z-10 space-y-20 pt-4 pb-24 px-4 sm:px-6 lg:px-8">


        {/* Hero Section */}
        <header className="relative pt-8 pb-12 overflow-hidden pv-up">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-bold tracking-widest uppercase border border-purple-200 dark:border-purple-800 mb-6">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
              About Us
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight uppercase leading-[1.05]">
              Engineering <span className="pv-grad-text">Future</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed font-normal">
              PromptVista ML is a specialized platform for deploying and validating machine learning models with a developer-first approach.
            </p>
          </div>
        </header>

        {/* Our Story */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pv-up" style={{ animationDelay: '0.1s' }}>
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-purple-500">The Genesis</h2>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight uppercase leading-[1.1]">
                Founded by <span className="pv-grad-text">Drona Bopche</span>
              </h3>
              <p className="text-sm font-mono text-gray-500">EST. 2022 — SHILLONG</p>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              PromptVista ML was born out of a specific need in the technical recruitment landscape. Technical stakeholders often want to see the predictive power of ML models without navigating through complex codebases or environment setups.
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              Our founder, Drona Bopche, envisioned a platform that serves as a living portfolio—a place where image, audio, and text models are ready to be tested instantly through an intuitive NLP prompt layer. By removing technical friction, we allow recruiters to focus on the results, while providing developers a stage to showcase their engineering prowess.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="boxy-card overflow-hidden h-64">
                <img src="/aboutus1.png" alt="Office Culture" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              </div>
              <div className="boxy-card overflow-hidden h-40">
                <img src="/aboutus2.png" alt="Engineering" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              </div>
            </div>
            <div className="pt-8 space-y-4">
              <div className="boxy-card overflow-hidden h-40">
                <img src="/aboutus3.png" alt="Team Work" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              </div>
              <div className="boxy-card overflow-hidden h-64 bg-purple-600 flex items-center justify-center p-8 text-white text-center">
                <span className="text-xl font-bold uppercase tracking-tighter italic">Transforming How ML is Showcased</span>
              </div>
            </div>
          </div>
        </section>

        {/* The Tech Stack */}
        <section className="space-y-12 pv-up" style={{ animationDelay: '0.2s' }}>
          <div className="text-center">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-2">Our Foundation</h2>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Built with Precision</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Frontend", value: "React & Tailwind" },
              { label: "Backend", value: "Supabase & Edge Functions" },
              { label: "Inference", value: "Python & PyTorch" },
              { label: "Security", value: "Enterprise Validation" }
            ].map((t, i) => (
              <div key={i} className="boxy-card p-6 text-center group">
                <div className="text-xs font-bold uppercase tracking-widest text-purple-500 mb-2">{t.label}</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">{t.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Key Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pv-up" style={{ animationDelay: '0.3s' }}>
          {[
            { title: "NLP Prompt Layer", desc: "Write natural language prompts to test any model in our catalog instantly." },
            { title: "Multi-Modal Support", desc: "Native support for Image generation, Audio processing, and Text analysis." },
            { title: "Zero Setup", desc: "No local environment required. Every model is ready for live inference from the browser." }
          ].map((f, i) => (
            <div key={i} className="boxy-card p-8 space-y-4">
              <div className="text-purple-500 font-mono text-xs font-bold underline decoration-2 underline-offset-4">FEATURE 0{i+1}</div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">{f.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Core Values */}
        <section className="space-y-12 pv-up" style={{ animationDelay: '0.4s' }}>
          <div className="text-center">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-2">Our Principles</h2>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">The Values that Drive Us</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Transparency", desc: "We believe in open validation. You should know exactly why a model produced a result." },
              { title: "Developer-First", desc: "Our tools are built by engineers, for engineers. We prioritize DX in everything we create." },
              { title: "Safety First", desc: "Safety isn't an afterthought—it's the core. We build the guardrails that prevent bias." },
              { title: "Innovation", desc: "We don't just follow trends; we set them. Our research team pushes multi-modal inference." }
            ].map((v, i) => (
              <div key={i} className="boxy-card p-6 space-y-3 group hover:border-purple-500 transition-colors">
                <div className="text-purple-500 font-mono text-xs font-bold">VAL 0{i+1}.</div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">{v.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pv-up" style={{ animationDelay: '0.5s' }}>
          <div className="boxy-card p-8 space-y-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              {Icon.mission}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Our Mission</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              To provide a living showcase for ML innovation, reducing the technical barrier for recruiters while empowering developers to prove their model's predictive value in real-time.
            </p>
          </div>

          <div className="boxy-card p-8 space-y-4">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
              {Icon.vision}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Our Vision</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Becoming the definitive platform for model evaluation, where image, audio, and text intelligence are instantly accessible through simple, conversational prompts.
            </p>
          </div>
        </section>

        {/* Global Reach */}
        <section className="boxy-card p-12 text-center space-y-8 pv-up" style={{ animationDelay: '0.6s' }}>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 text-purple-500 mb-4">
            {Icon.globe}
          </div>
          <h2 className="text-4xl font-bold tracking-tighter text-gray-900 dark:text-white uppercase">Distributed Intelligence</h2>
          <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
            While our roots are in Shillong, our impact is global. We operate as a distributed team of engineers and researchers, pushing the boundaries of what's possible with large language models and multi-modal orchestration.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-gray-100 dark:border-gray-800">
            {[
              { label: "Countries", value: "10+" },
              { label: "Remote", value: "100%" },
              { label: "Inference", value: "24/7" },
              { label: "Innovation", value: "∞" }
            ].map((s, i) => (
              <div key={i}>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{s.value}</div>
                <div className="text-xs uppercase tracking-widest text-gray-500 font-bold">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Team / Contact CTA */}
        <section className="text-center space-y-8 py-16 pv-up" style={{ animationDelay: '0.7s' }}>
          <h3 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white uppercase">Want to build the future with us?</h3>
          <div className="flex justify-center gap-4">
            <Link to="/careers" className="btn-primary py-3 px-10 text-xs font-bold uppercase tracking-widest">
              View Openings
            </Link>
            <a href="mailto:promptvistaml@gmail.com" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 py-3 px-10 text-xs font-bold uppercase tracking-widest hover:border-purple-500 transition-colors">
              Contact Us
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}

export default About
