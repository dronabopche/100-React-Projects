import React from 'react';
import { motion } from 'framer-motion';

const MovingVisuals = () => {
  return (
    <>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Floating shapes */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-200 to-green-200 rounded-full opacity-10 blur-3xl"
        />
        
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            rotate: [0, -360, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-green-200 to-blue-200 rounded-full opacity-10 blur-3xl"
        />

        {/* Animated dots pattern */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-green-400 opacity-30"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i * 8) % 60}%`,
            }}
          />
        ))}

        {/* Gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/3 right-1/3 w-48 h-48 bg-gradient-to-r from-blue-400 to-green-400 rounded-full opacity-20 blur-xl"
        />

        {/* Floating icons */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 opacity-5"
        >
          <div className="text-6xl">⚡</div>
        </motion.div>

        {/* Moving lines */}
        <motion.div
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-10"
        />
      </div>

      {/* Animated cursor followers */}
      <div className="fixed inset-0 pointer-events-none -z-5">
        <motion.div
          className="absolute w-72 h-72 bg-gradient-to-r from-blue-100 to-green-100 rounded-full blur-3xl opacity-10"
          animate={{
            x: ["0%", "100%", "0%"],
            y: ["0%", "50%", "0%"],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </>
  );
};

export default MovingVisuals;