import { useState } from 'react'
import { Link } from 'react-router-dom'

/* ─── SVG icons ─── */
const Icon = {
  briefcase: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  users: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  code: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
  send: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
  arrow: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>,
  bolt: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  globe: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  heart: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
}

const Careers = () => {
  const [selectedJob, setSelectedJob] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    resume: '',
    linkedin: '',
    github: '',
    whyJoin: ''
  })

  const perks = [
    {
      title: "Remote First",
      desc: "Work from anywhere. We provide a $2k home office stipend and cover coworking space memberships.",
      icon: Icon.globe
    },
    {
      title: "Health & Wellness",
      desc: "Comprehensive medical, dental, and vision insurance. Free mental health days and therapy coverage.",
      icon: Icon.heart
    },
    {
      title: "Continuous Growth",
      desc: "Annual $3k learning budget for courses, conferences, or books. We invest heavily in your technical growth.",
      icon: Icon.bolt
    },
    {
      title: "Stellar Team",
      desc: "Collaborate with industry-leading engineers and researchers pushing the boundaries of AI validation.",
      icon: Icon.users
    }
  ]

  const jobs = [
    {
      id: 1,
      title: 'ML Engineer',
      type: 'Full-time',
      location: 'Remote / Shillong',
      desc: 'Work on deploying and optimizing large language models and building the core GenAI validation layer using Python and PyTorch.'
    },
    {
      id: 2,
      title: 'Full-Stack Developer',
      type: 'Full-time',
      location: 'Remote',
      desc: 'Help us build the next generation of model testing interfaces using React, Tailwind CSS, and Supabase.'
    },
    {
      id: 3,
      title: 'Prompt Engineer',
      type: 'Contract',
      location: 'Remote',
      desc: 'Design, rigorously test, and optimize complex prompts for various domain-specific models in our catalog.'
    },
    {
      id: 4,
      title: 'AI Product Manager',
      type: 'Full-time',
      location: 'Hybrid / Shillong',
      desc: 'Lead the roadmap for PromptVista ML. Bridge the gap between user needs and cutting-edge machine learning capabilities.'
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      type: 'Full-time',
      location: 'Remote',
      desc: 'Manage our high-availability deployment infrastructure, handle CI/CD pipelines, and ensure sub-100ms model latency.'
    }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const subject = encodeURIComponent(`Applying for ${selectedJob.title} - ${formData.name}`)
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Job Title: ${selectedJob.title}\n` +
      `Resume: ${formData.resume}\n` +
      `LinkedIn: ${formData.linkedin}\n` +
      `GitHub: ${formData.github}\n\n` +
      `Why do you want to join?\n${formData.whyJoin}`
    )
    
    window.location.href = `mailto:promptvistaml@gmail.com?subject=${subject}&body=${body}`
  }

  return (
    <div className="relative min-h-screen border-x border-gray-200 dark:border-gray-800 max-w-7xl mx-auto overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Background Grid */}
      <div className="absolute inset-0 pv-grid pointer-events-none" />

      <div className="relative z-10 space-y-20 py-16 px-4 sm:px-6 lg:px-8 pb-32">


        {/* Hero */}
        <header className="relative pt-20 pb-12 overflow-hidden pv-up">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-bold tracking-widest uppercase border border-purple-200 dark:border-purple-800 mb-6">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
              Careers at PromptVista
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-[1.1]">
              Shape the Future of <br className="hidden md:block"/> <span className="pv-grad-text">Model Validation</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl leading-relaxed font-normal max-w-2xl mx-auto">
              We are a team of engineers and researchers building the definitive platform for AI model testing, deployment, and real-time prompt validation.
            </p>
          </div>
        </header>

        {/* Perks & Benefits */}
        <section className="pv-up" style={{ animationDelay: '0.1s' }}>
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-2">Life at PromptVista</h2>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">A True Career Boost</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((perk, idx) => (
              <div key={idx} className="boxy-card p-6 flex flex-col items-center text-center group">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 mb-5 group-hover:scale-110 transition-transform">
                  {perk.icon}
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{perk.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {perk.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-200 dark:border-gray-800" />

        {/* Jobs List */}
        <section className="pv-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-2">Open Roles</h2>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Join the Mission</h3>
            </div>
            <p className="text-sm text-gray-500 max-w-sm text-right hidden md:block">
              Don't see a perfect fit? Send us an open application. We're always looking for brilliant minds.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobs.map(job => (
              <div 
                key={job.id} 
                className={`boxy-card p-6 sm:p-8 flex flex-col justify-between cursor-pointer transition-all ${selectedJob?.id === job.id ? 'ring-2 ring-purple-500 shadow-[8px_8px_0px_var(--brand-purple)] -translate-y-1' : ''}`}
                onClick={() => {
                  setSelectedJob(job);
                  // Scroll to form smoothly
                  setTimeout(() => {
                    document.getElementById('application-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
                      {Icon.briefcase}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                        {job.type}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        {job.location}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{job.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-md">{job.desc}</p>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-gray-500 dark:text-gray-400">Engineering Team</span>
                  <span className={`flex items-center gap-2 ${selectedJob?.id === job.id ? 'text-purple-500' : 'text-gray-900 dark:text-white group-hover:text-purple-500'}`}>
                    {selectedJob?.id === job.id ? 'Currently Selected' : 'Apply Now'}
                    <span>{Icon.arrow}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Form Section */}
        <div id="application-form" className="scroll-mt-32">
          {selectedJob ? (
            <section className="max-w-4xl mx-auto pv-up">
              <div className="boxy-card p-8 sm:p-14 space-y-10 bg-white dark:bg-gray-950 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none scale-150">
                  <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                
                <div className="space-y-3 relative z-10">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Submit Application</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Applying for <span className="text-purple-500 font-bold border-b-2 border-purple-500">{selectedJob.title}</span>
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Full Name <span className="text-red-500">*</span></label>
                      <input required name="name" value={formData.name} onChange={handleInputChange} className="boxy-input text-lg" placeholder="e.g. Alan Turing" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Resume Link <span className="text-red-500">*</span></label>
                      <input required name="resume" value={formData.resume} onChange={handleInputChange} className="boxy-input text-lg" placeholder="Google Drive, Dropbox, Notion..." />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">LinkedIn Profile</label>
                      <input name="linkedin" value={formData.linkedin} onChange={handleInputChange} className="boxy-input text-lg" placeholder="linkedin.com/in/..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">GitHub Profile / Portfolio</label>
                      <input name="github" value={formData.github} onChange={handleInputChange} className="boxy-input text-lg" placeholder="github.com/..." />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Why PromptVista? <span className="text-red-500">*</span></label>
                    <textarea required name="whyJoin" value={formData.whyJoin} onChange={handleInputChange} rows={5} className="boxy-input text-lg resize-y min-h-[150px]" placeholder="Tell us about your passion for ML, validation, or what caught your eye..." />
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm">
                      By submitting this application, your default email client will open with the pre-filled data.
                    </p>
                    <button type="submit" className="btn-primary w-full sm:w-auto py-4 px-10 flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-[0.15em] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                      {Icon.send}
                      Send Application
                    </button>
                  </div>
                </form>
              </div>
            </section>
          ) : (
            <div className="text-center py-20 px-4 border-2 border-dashed border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/30 pv-up" style={{ animationDelay: '0.3s' }}>
              <div className="w-16 h-16 mx-auto mb-6 bg-purple-50 dark:bg-purple-900/20 text-purple-300 dark:text-purple-700 flex items-center justify-center rounded-full">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ready to apply?</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium max-w-sm mx-auto">
                Select one of the open positions above to reveal the application form and start your journey.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Careers
