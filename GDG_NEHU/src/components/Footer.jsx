import React from 'react';
import { motion } from 'framer-motion';
import { Code, Mail, MapPin, Phone, Facebook, Twitter, Instagram, Github, Youtube, Linkedin } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'About GDG', href: '#about' },
    { name: 'Events Calendar', href: '#calendar' },
    { name: 'Projects Gallery', href: '#gallery' },
    { name: 'Join Community', href: '#join' },
    { name: 'Code of Conduct', href: '#conduct' },
    { name: 'Privacy Policy', href: '#privacy' },
  ];

  const resources = [
    { name: 'Google Developers', href: 'https://developers.google.com' },
    { name: 'Flutter Docs', href: 'https://flutter.dev' },
    { name: 'Firebase', href: 'https://firebase.google.com' },
    { name: 'TensorFlow', href: 'https://tensorflow.org' },
    { name: 'Google Cloud', href: 'https://cloud.google.com' },
    { name: 'Android Developers', href: 'https://developer.android.com' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-950 text-white pt-16 pb-8 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo and description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-blue-500/30"
                ></motion.div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
                  <Code className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">GDG NEHU</h2>
                <p className="text-blue-300 text-sm">Google Developer Groups</p>
              </div>
            </div>
            <p className="text-gray-400 mb-8">
              A vibrant community of developers at North Eastern Hill University, 
              exploring Google technologies and building solutions for Northeast India.
            </p>
            
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xl font-bold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors flex items-center"
                  >
                    <div className="w-1 h-1 rounded-full bg-blue-500 mr-3"></div>
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-6 text-white">Resources</h3>
            <ul className="space-y-3">
              {resources.map((resource, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a
                    href={resource.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-green-400 transition-colors flex items-center"
                  >
                    <div className="w-1 h-1 rounded-full bg-green-500 mr-3"></div>
                    {resource.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-6 text-white">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-400 mr-3 mt-1" />
                <div>
                  <p className="text-gray-400">North Eastern Hill University</p>
                  <p className="text-gray-400">Shillong, Meghalaya - 793022</p>
                  <p className="text-gray-400">Northeast India</p>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-blue-400 mr-3" />
                <a href="mailto:gdg@nehu.ac.in" className="text-gray-400 hover:text-blue-400 transition-colors">
                  gdg@nehu.ac.in
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-blue-400 mr-3" />
                <a href="tel:+913642720101" className="text-gray-400 hover:text-blue-400 transition-colors">
                  +91 3642 720101
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-8">
              <h4 className="font-semibold mb-4">Stay Updated</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-blue-500"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-r-lg font-medium"
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm text-center md:text-left mb-4 md:mb-0">
              © {new Date().getFullYear()} GDG North Eastern Hill University. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm text-center">
              This GDG chapter is independent and not directly affiliated with Google LLC.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;