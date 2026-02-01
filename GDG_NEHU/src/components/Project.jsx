import React from 'react';
import { motion } from 'framer-motion';
import { Code, Github, ExternalLink, Users, Star, GitBranch } from 'lucide-react';

const Projects = () => {
  const projects = [
    {
      name: 'NEHU Campus Navigator',
      description: 'An interactive map and navigation system for NEHU campus with AR features',
      tech: ['Flutter', 'Firebase', 'ARCore'],
      stars: 45,
      forks: 12,
      contributors: 8,
      status: 'Active',
      color: 'blue'
    },
    {
      name: 'Mizo Language AI Assistant',
      description: 'AI-powered voice assistant for Mizo language using Google ML Kit',
      tech: ['Python', 'TensorFlow', 'Google Cloud'],
      stars: 89,
      forks: 23,
      contributors: 15,
      status: 'Active',
      color: 'green'
    },
    {
      name: 'Sustainable Farming IoT',
      description: 'IoT system for monitoring soil and weather conditions in NE farmlands',
      tech: ['IoT', 'Node.js', 'Google Cloud IoT'],
      stars: 67,
      forks: 18,
      contributors: 12,
      status: 'Active',
      color: 'yellow'
    },
    {
      name: 'Tourism Portal - Meghalaya',
      description: 'Tourism platform showcasing NE heritage with VR experiences',
      tech: ['Next.js', 'Three.js', 'Firebase'],
      stars: 102,
      forks: 34,
      contributors: 21,
      status: 'Completed',
      color: 'purple'
    },
  ];

  return (
    <section id="projects" className="py-20 px-4 bg-gradient-to-b from-blue-50/30 to-white">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            Featured{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600">
              Projects
            </span>
          </h2>
          <p className="section-subtitle">
            Explore innovative projects built by our community using Google technologies. 
            Contribute to open-source or start your own!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full bg-${project.color}-500 animate-pulse`}></div>
                    <h3 className="text-2xl font-bold text-gray-900">{project.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold bg-${project.color}-100 text-${project.color}-700`}>
                  {project.status}
                </span>
              </div>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* GitHub stats */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center text-gray-600">
                    <Star className="h-4 w-4 mr-2 text-yellow-500" />
                    <span className="font-medium">{project.stars}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <GitBranch className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="font-medium">{project.forks}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2 text-green-500" />
                    <span className="font-medium">{project.contributors}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">Open Source</div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  className="flex-1 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  <Github className="h-5 w-5 mr-2" />
                  View Code
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Live Demo
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA for projects */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="glass-effect rounded-3xl p-12 max-w-4xl mx-auto">
            <Code className="h-16 w-16 text-blue-500 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Have a Project Idea?
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Get mentorship, resources, and funding from GDG NEHU to turn your ideas into reality. 
              Join our project incubator program!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-8 py-4"
            >
              Submit Project Proposal
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;