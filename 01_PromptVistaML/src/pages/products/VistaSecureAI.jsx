import React from 'react';
import { Link } from 'react-router-dom';

const VistaSecureAI = () => {
  return (
    <div className="product-detail-page pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-12 group">
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="reveal-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-6">
              Security & Compliance
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter leading-tight mb-8">
              VistaSecure <span className="text-purple-600">AI</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-10">
              Advanced threat detection and security orchestration powered by next-generation machine learning. Protect your infrastructure with automated risk assessment and real-time response.
            </p>

            <div className="space-y-6">
              {[
                { title: 'Threat Intelligence', desc: 'Real-time analysis of global threat vectors.' },
                { title: 'Automated Response', desc: 'Instantly mitigate risks with AI-driven protocols.' },
                { title: 'Zero-Trust Architecture', desc: 'Secure by design, verified at every step.' }
              ].map((feature, i) => (
                <div key={i} className="boxy-card p-6 bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800">
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="sticky top-32">
              <div className="boxy-card aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-mono text-sm uppercase tracking-widest">
                  Preview Placeholder
                </div>
                {/* Add dynamic visuals here if needed */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none" />
              </div>
              
              <div className="mt-8 p-8 boxy-card bg-black text-white">
                <h4 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4">Implementation</h4>
                <code className="text-sm text-purple-400">
                  npm install @vista/secure-ai
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VistaSecureAI;
