import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

const Navbar = () => {
  const location = useLocation()
  
  const isActive = (path) => {
    return location.pathname === path
  }

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/models', label: 'Models' },
    { path: '/api-docs', label: 'API Docs' },
    { path: '/architecture', label: 'Architecture' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-purple-400 dark:border-purple-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            {/* Logo */}
              <img
                src="/v2.png"
                alt="ModelHub Logo"
                className="w-10 h-10 object-contain"
              />
            <span className="text-xl font-bold text-gray-900 dark:text-white">PromptVistaML</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-purple-900 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link
              to="/models"
              className="btn-primary text-sm"
            >
              Explore Models
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar