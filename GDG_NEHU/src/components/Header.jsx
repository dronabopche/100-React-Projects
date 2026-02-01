import React, { useState, useEffect } from 'react';
import { Menu, X, Home, Calendar, Code, Users, BookOpen, LogIn, ChevronDown } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home', icon: Home },
    { 
      name: 'Events', 
      href: '#events', 
      icon: Calendar,
      dropdown: [
        { name: 'Upcoming Events', href: '#events' },
        { name: 'Past Events', href: '#past-events' },
        { name: 'Workshops', href: '#workshops' },
        { name: 'Hackathons', href: '#hackathons' },
      ]
    },
    { 
      name: 'Projects', 
      href: '#projects', 
      icon: Code,
      dropdown: [
        { name: 'Ongoing Projects', href: '#ongoing' },
        { name: 'Completed Projects', href: '#completed' },
        { name: 'Project Ideas', href: '#ideas' },
        { name: 'Submit Project', href: '#submit' },
      ]
    },
    { 
      name: 'Community', 
      href: '#community', 
      icon: Users,
      dropdown: [
        { name: 'Members', href: '#members' },
        { name: 'Team Leads', href: '#leads' },
        { name: 'Partners', href: '#partners' },
        { name: 'Alumni', href: '#alumni' },
      ]
    },
    { 
      name: 'Resources', 
      href: '#resources', 
      icon: BookOpen,
      dropdown: [
        { name: 'Learning Materials', href: '#learning' },
        { name: 'Google Technologies', href: '#tech' },
        { name: 'Certifications', href: '#certs' },
        { name: 'Scholarships', href: '#scholarships' },
      ]
    },
    { name: 'Login', href: '#login', icon: LogIn, variant: 'outline' },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-lg py-2' 
        : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center shadow-lg">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">GDG NEHU</h1>
              <p className="text-xs text-gray-600">North Eastern Hill University</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <div
                    className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 font-medium cursor-pointer transition-colors group"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                    <ChevronDown className="h-4 w-4 ml-1 transition-transform group-hover:rotate-180" />
                    
                    {/* Dropdown */}
                    {activeDropdown === item.name && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 animate-fadeIn">
                        {item.dropdown.map((subItem) => (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            <span className="text-sm">{subItem.name}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href={item.href}
                    className={`flex items-center px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                      item.variant === 'outline'
                        ? 'border border-blue-500 text-blue-600 hover:bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </a>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-3 rounded-lg bg-gradient-to-r from-blue-50 to-green-50 hover:shadow-md transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4 animate-slideDown">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg font-medium ${
                    item.variant === 'outline'
                      ? 'border border-blue-500 text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;