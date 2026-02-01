import React from 'react';
import { motion } from 'framer-motion';
import { Users, Code, Calendar, Award, ChevronRight, PlayCircle } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-white to-green-50/30 animate-gradient-x" />
      
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2"
          >
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-green-100 text-blue-700 text-sm font-semibold mb-6 animate-pulse-slow"
            >
              <Users className="h-4 w-4 mr-2" />
              Google Developer Groups
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              On campus{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-green-500 to-blue-600 animate-gradient-x">
                North Eastern Hill University
              </span>
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8">
              What Is GDG? Unlock the Power of Google Developers!
            </h2>
            
            <p className="text-gray-600 text-lg mb-10 leading-relaxed">
              Join our vibrant community of developers at NEHU, learn cutting-edge Google technologies, 
              build innovative solutions, and grow together in the beautiful hills of Northeast India.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center justify-center text-lg"
              >
                <Users className="h-5 w-5 mr-3" />
                JOIN COMMUNITY TODAY
                <ChevronRight className="h-5 w-5 ml-2" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-outline flex items-center justify-center text-lg"
              >
                <PlayCircle className="h-5 w-5 mr-2" />
                Watch Intro Video
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {[
                { value: '500+', label: 'Members', icon: Users, color: 'blue' },
                { value: '50+', label: 'Events', icon: Calendar, color: 'green' },
                { value: '30+', label: 'Projects', icon: Code, color: 'purple' },
                { value: '20+', label: 'Awards', icon: Award, color: 'yellow' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center"
                >
                  <div className={`w-12 h-12 rounded-full bg-${stat.color}-100 flex items-center justify-center mx-auto mb-4`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Live Session Indicator */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-white to-blue-50 rounded-2xl p-6 shadow-lg border border-gray-200 max-w-md"
            >
              <div className="flex items-center mb-4">
                <div className="relative">
                  <div className="w-4 h-4 rounded-full bg-red-500 mr-3 animate-pulse"></div>
                  <div className="absolute inset-0 rounded-full bg-red-500 animate-ping"></div>
                </div>
                <span className="font-semibold text-gray-800">Live Session Active</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                <span className="font-medium">meet.google.com/nehu-gdg</span> is sharing screen with 45 participants
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg text-sm hover:bg-red-100 transition-colors flex-1"
                >
                  Stop sharing
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg text-sm hover:bg-gray-200 transition-colors flex-1"
                >
                  Hide
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* Right illustration */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-1/2"
          >
            <div className="relative">
              {/* Animated gradient orb */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  scale: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  rotate: {
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }
                }}
                className="absolute -top-10 -right-10 w-80 h-80 bg-gradient-to-r from-blue-400/20 via-green-400/20 to-blue-400/20 rounded-full blur-3xl"
              />
              
              <div className="glass-effect rounded-3xl p-8 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { title: 'Hands-on Workshops', desc: 'Learn by building with Google tech', icon: Code, color: 'blue' },
                    { title: 'Mountain Hackathons', desc: 'Code in the beautiful NE hills', icon: Users, color: 'green' },
                    { title: 'Industry Connect', desc: 'Meet Google experts & recruiters', icon: Calendar, color: 'yellow' },
                    { title: 'Research Projects', desc: 'Solve local problems with tech', icon: Award, color: 'purple' },
                  ].map((card, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer animate-float`}
                      style={{ animationDelay: `${index * 0.5}s` }}
                    >
                      <div className={`w-12 h-12 rounded-full bg-${card.color}-100 flex items-center justify-center mb-4`}>
                        <card.icon className={`h-6 w-6 text-${card.color}-600`} />
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2">{card.title}</h3>
                      <p className="text-sm text-gray-600">{card.desc}</p>
                      <div className="mt-4 text-blue-600 text-sm font-medium flex items-center">
                        Explore <ChevronRight className="h-4 w-4 ml-1" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;