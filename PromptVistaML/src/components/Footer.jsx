import { Link } from "react-router-dom"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    { path: "/", label: "Home" },
    { path: "/models", label: "Models" },
    { path: "/api-docs", label: "API Docs" },
    { path: "/architecture", label: "Architecture" },
  ]

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Outer box */}
        <div className="border border-gray-200 dark:border-gray-100 bg-white dark:bg-gray-950 p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Brand */}
            <div className="border border-purple-900 dark:border-gray-100 p-5 bg-gray-50 dark:bg-gray-900">
              <Link to="/" className="flex items-center space-x-2">
                <img
                  src="/vista.png"
                  alt="ModelHub Logo"
                  className="w-60 h-30 object-contain"
                />
              </Link>

              <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Deploy and use AI models through prompts and automated APIs.
              </p>
            </div>

            {/* Navigation */}
            <div className="border border-gray-200 dark:border-gray-800 p-5 bg-gray-50 dark:bg-gray-900">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Navigation
              </h3>
              <ul className="space-y-2">
                {footerLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="border border-gray-200 dark:border-gray-800 p-5 bg-gray-50 dark:bg-gray-900">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Resources
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/api-docs"
                    className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors duration-200"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/api-docs"
                    className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors duration-200"
                  >
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link
                    to="/models"
                    className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors duration-200"
                  >
                    Explore Models
                  </Link>
                </li>
              </ul>
            </div>

            {/* Community */}
            <div className="border border-gray-200 dark:border-gray-800 p-5 bg-gray-50 dark:bg-gray-900">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Connect
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://github.com/YOUR_GITHUB_USERNAME"
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors duration-200"
                  >
                    GitHub
                  </a>
                </li>

                <li>
                  <a
                    href="https://www.linkedin.com/in/YOUR_LINKEDIN_USERNAME"
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors duration-200"
                  >
                    LinkedIn
                  </a>
                </li>

                <li>
                  <a
                    href="mailto:YOUR_EMAIL@gmail.com"
                    className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors duration-200"
                  >
                    Email Me
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} ModelHub. All rights reserved.
            </p>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Built for ShowCaseing Models Drona Bopche Built.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
