import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ModelCard from '../components/ModelCard'
import { fetchAllModels } from '../services/supabase'

const Home = () => {
  const [models, setModels] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadModels()
  }, [])

  const loadModels = async () => {
    try {
      const data = await fetchAllModels()
      setModels(data.slice(0, 6))
    } catch (error) {
      console.error('Error loading models:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const steps = [
    {
      number: '01',
      title: 'Pick a Model',
      description:
        'Browse deployed ML models with clear descriptions, categories, and example prompts.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      number: '02',
      title: 'Test with a Prompt',
      description:
        'Copy an example or write your own prompt directly inside the model test UI.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      )
    },
    {
      number: '03',
      title: 'GenAI Validation Layer',
      description:
        'A Gemini-based prompt layer checks if the input is sufficient and structures the request.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      number: '04',
      title: 'Model Execution + Output',
      description:
        'If valid, the request hits the model backend endpoint and returns the final result instantly.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
  ]

  const features = [
    'Prompt engineering validation (Gemini layer)',
    'Auto input completion when possible',
    'Clean model catalog with categories + examples',
    'Supabase-powered dynamic data loading',
    'No complex UI, only what developers need',
    'Fast, stable, deploy-ready workflow',
  ]

  return (
    <div className="space-y-16">
      {/* HERO - Full Screen */}
      <section className="min-h-[calc(100vh-80px)] flex items-center">
        <div className="w-full border border-[color:var(--border)] bg-[color:var(--panel)] p-8 md:p-12 lg:p-14">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-sm font-medium text-[color:var(--muted-text)] tracking-wide">
              PromptVista ML • Prompt-to-API Model Testing Platform
            </p>

            <h1 className="text-4xl md:text-6xl font-bold text-[var(--text)] mt-6 leading-tight">
              ML Models with{' '}
              <span className="gradient-flow-text relative">
                Prompt Engineering
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-brand-purple to-brand-blue opacity-50"></span>
              </span>{' '}
              and Prompt-to-API Automation
            </h1>

            <p className="text-lg md:text-xl text-[color:var(--muted-text)] max-w-3xl mx-auto mt-6 leading-relaxed">
              PromptVista ML converts natural language prompts into structured
              API calls using a GenAI validation layer. If your data is
              insufficient, it detects it and responds accordingly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link
                to="/models"
                className="btn-primary hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center justify-center gap-2">
                  Explore Models
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>

              <Link
                to="/architecture"
                className="btn-secondary hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                View Architecture
              </Link>

              <Link
                to="/api-docs"
                className="btn-secondary hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Read API Docs
              </Link>
            </div>

            {/* Floating indicator */}
            <div className="mt-16 animate-bounce">
              <div className="inline-flex items-center gap-2 text-sm text-[color:var(--muted-text)]">
                <span>Scroll to explore</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--text)]">How It Works</h2>
          <p className="text-[color:var(--muted-text)] mt-3 max-w-2xl mx-auto">
            The platform is intentionally simple: prompt in, validation layer,
            model execution, output out.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="border border-[color:var(--border)] bg-[color:var(--panel)] p-6 hover:translate-y-[-4px] hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl font-bold text-[color:var(--muted-2)] group-hover:text-brand-purple transition-colors">
                  {step.number}
                </div>
                <div className="text-brand-purple opacity-80">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-[var(--text)] mb-3 group-hover:text-brand-purple transition-colors">
                {step.title}
              </h3>
              <p className="text-[color:var(--muted-text)] leading-relaxed">
                {step.description}
              </p>
              <div className="mt-4 pt-4 border-t border-[color:var(--border)]">
                <div className="text-xs font-medium text-[color:var(--muted-text)] uppercase tracking-wider">
                  Step {step.number.slice(1)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Features */}
      <section className="border border-[color:var(--border)] bg-[color:var(--panel)] p-8 md:p-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[var(--text)]">Key Features</h2>
          <p className="text-[color:var(--muted-text)] mt-3 max-w-2xl mx-auto">
            Everything is built around prompt engineering + model testing. No
            extra noise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <div
              key={index}
              className="border border-[color:var(--border)] bg-[color:var(--bg)] p-5 hover:translate-y-[-2px] hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-start gap-3">
                <div className="feature-icon mt-0.5 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-4 h-4 feature-icon-check"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-[color:var(--text)] font-semibold group-hover:text-brand-purple transition-colors">
                    {feature}
                  </p>
                  <p className="text-sm text-[color:var(--muted-text)] mt-1">
                    Designed for real workflows and fast testing.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Models Preview */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[var(--text)]">
              Available Models
            </h2>
            <p className="text-[color:var(--muted-text)] mt-2">
              Live deployed models loaded from Supabase.
            </p>
          </div>

          <Link to="/models" className="link-brand flex items-center gap-1 group">
            <span>View all models</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].slice(0, 3).map((i) => (
              <div
                key={i}
                className="border border-[color:var(--border)] bg-[color:var(--panel)] p-6"
              >
                <div className="animate-pulse space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-[color:var(--skeleton)] rounded-full"></div>
                    <div className="h-4 bg-[color:var(--skeleton)] w-1/3 rounded"></div>
                  </div>
                  <div className="h-6 bg-[color:var(--skeleton)] w-2/3 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-[color:var(--skeleton)] rounded"></div>
                    <div className="h-3 bg-[color:var(--skeleton)] w-5/6 rounded"></div>
                    <div className="h-3 bg-[color:var(--skeleton)] w-4/6 rounded"></div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <div className="h-6 bg-[color:var(--skeleton)] w-16 rounded-full"></div>
                    <div className="h-6 bg-[color:var(--skeleton)] w-20 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {models.map((model) => (
              <div
                key={model.id}
                className="hover:scale-[1.02] transition-transform duration-300"
              >
                <ModelCard model={model} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Architecture CTA */}
      <section className="border border-[color:var(--border)] bg-[color:var(--panel)] p-10 text-center">
        <h2 className="text-3xl font-bold text-[var(--text)] mb-4">
          Architecture & Full Request Flow
        </h2>

        <p className="text-[color:var(--muted-text)] max-w-3xl mx-auto mb-8">
          Learn exactly how PromptVista ML works end-to-end: Supabase loading,
          prompt validation using a GenAI API layer, data sufficiency checks, and
          final model execution.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/architecture"
            className="btn-primary hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <span className="flex items-center justify-center gap-2">
              View Architecture Page
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </span>
          </Link>

          <Link
            to="/api-docs"
            className="btn-secondary hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
          >
            API Documentation
          </Link>
        </div>

        {/* Mini Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {[
            { value: '50+', label: 'Models', icon: '' },
            { value: 'Gemini', label: 'Prompt Layer', icon: '' },
            { value: 'Supabase', label: 'Backend', icon: '' },
            { value: '<100ms', label: 'Avg Response', icon: '' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border border-[color:var(--border)] bg-[color:var(--bg)] p-5 hover:translate-y-[-2px] transition-transform duration-300"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-brand-purple">
                {stat.value}
              </div>
              <p className="text-sm text-[color:var(--muted-text)] mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home