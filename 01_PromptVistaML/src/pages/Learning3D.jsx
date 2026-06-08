import React, { useState } from 'react'
import SupervisedModule from '../components/learning3d/SupervisedModule'
import { Layers, HelpCircle, GraduationCap, ChevronRight, Activity, Terminal, Lock } from 'lucide-react'

const Learning3D = () => {
  const [activeTab, setActiveTab] = useState('supervised')

  // Tabs definitions
  const tabs = [
    { id: 'supervised', label: 'Supervised Learning', desc: 'Linear Support Vector Machine (SVM) Decision Boundary', color: 'border-purple-500' },
    { id: 'unsupervised', label: 'Unsupervised K-Means', desc: 'Lloyd\'s Clustering Optimization & Centroid Drift', color: 'border-amber-500' },
    { id: 'reinforcement', label: 'Reinforcement Q-Learning', desc: 'MDP Gridworld Agent Exploration & Bellman Policy', color: 'border-emerald-500' },
    { id: 'deep_learning', label: 'Deep Neural Networks', desc: 'Multilayer Perceptron Signal Backpropagation Calculus', color: 'border-blue-500' }
  ]

  return (
    <div className="min-h-screen py-6 px-4 space-y-10 select-text">
      
      {/* Header Banner - High contrast Boxy style */}
      <div className="relative border border-purple-500/20 bg-gradient-to-r from-purple-500/5 to-transparent p-8 md:p-12 mb-8 pv-grid-dots overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/30 rounded-none">
            <GraduationCap className="w-4 h-4" />
            <span>Interactive Academy</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold font-mono tracking-tight text-gray-900 dark:text-white uppercase">
            3D Machine Learning <span className="text-purple-600 dark:text-purple-400">Sandbox</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-mono max-w-2xl leading-relaxed">
            Run real mathematical models directly inside your browser viewport. Manipulate spatial decision boundaries, cluster centroids, and neural weight structures in real-time.
          </p>
        </div>
      </div>

      {/* Navigation Tabs - Boxy Tech Style */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const isLocked = tab.id !== 'supervised'
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-left p-5 border transition-all duration-200 cursor-pointer ${
                isActive
                  ? `bg-white dark:bg-[#0c0c10] border-purple-500 shadow-[4px_4px_0px_0px_rgba(147,51,234,0.15)] dark:shadow-[4px_4px_0px_0px_rgba(168,85,247,0.3)]`
                  : 'bg-white/50 dark:bg-[#0c0c10]/20 border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-mono font-bold uppercase flex items-center gap-1.5 ${isActive ? 'text-purple-500' : 'text-gray-400'}`}>
                  {tab.id.replace('_', ' ')}
                  {isLocked && <Lock className="w-3 h-3 text-gray-400 dark:text-gray-600" />}
                </span>
                <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'transform translate-x-1 text-purple-500' : 'text-gray-400'}`} />
              </div>
              <h3 className="font-mono font-bold text-gray-900 dark:text-white text-sm mb-1">
                {tab.label}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                {tab.desc}
              </p>
            </button>
          )
        })}
      </div>

      {/* Main Simulation Viewport */}
      <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0c0c10]/40 p-6">
        {activeTab === 'supervised' ? (
          <SupervisedModule />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Lock className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4 animate-pulse" />
            <h3 className="font-mono font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-wider">
              Simulation Offline
            </h3>
            <p className="font-mono text-xs text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
              This module is locked. Select the "Supervised Learning" tab above to explore the live separating SVM decision boundary demo.
            </p>
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <div className="border-t border-gray-200 dark:border-gray-800 pt-12">
        <div className="max-w-4xl space-y-6">
          <h3 className="text-lg font-bold font-mono text-gray-900 dark:text-white flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-purple-500" />
            <span>Sandbox Frequently Asked Questions</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="boxy-card p-5 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0c0c10]/40">
              <div className="font-mono font-bold text-purple-600 dark:text-purple-400 mb-2">Q: How does the 3D projection work?</div>
              <p className="text-gray-500 leading-relaxed text-xs">
                A: The viewport renders coordinates dynamically onto a standard 2D HTML5 canvas. It uses trigonometric yaw/pitch matrices to rotate spatial 3D points $(X, Y, Z)$ before projecting them using focal depth equations. This ensures fast, zero-dependency rendering on any modern browser.
              </p>
            </div>

            <div className="boxy-card p-5 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0c0c10]/40">
              <div className="font-mono font-bold text-purple-600 dark:text-purple-400 mb-2">Q: Are these simulations real or mock animations?</div>
              <p className="text-gray-500 leading-relaxed text-xs">
                A: They are 100% real math engines! The SVM plane updates its weights iteratively using Stochastic Gradient Descent on the synthetic points. The K-Means centroids migrate to cluster centers using Lloyd's algorithm. The Gridworld robot learns optimal paths through Tabular Q-Learning updates.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Learning3D
