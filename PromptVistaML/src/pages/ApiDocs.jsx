import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  fetchAllModels, 
  fetchDocumentationSections, 
  fetchRateLimits, 
  fetchApiResources 
} from '../services/supabase'

const ApiDocs = () => {
  const [models, setModels] = useState([])
  const [sections, setSections] = useState([])
  const [rateLimits, setRateLimits] = useState([])
  const [resources, setResources] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('overview')
  const [activeModel, setActiveModel] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [modelsData, sectionsData, limitsData, resourcesData] = await Promise.all([
        fetchAllModels(),
        fetchDocumentationSections(),
        fetchRateLimits(),
        fetchApiResources()
      ])
      
      setModels(modelsData)
      setSections(sectionsData)
      setRateLimits(limitsData)
      setResources(resourcesData)
      
      if (modelsData.length > 0) {
        setActiveModel(modelsData[0].model_number)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredModels = models.filter(model => 
    searchQuery === '' || 
    model.model_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.model_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.model_description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getResourceIcon = (iconType) => {
    const icons = {
      github: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      ),
      status: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      docs: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      discord: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515a.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0a12.64 12.64 0 00-.617-1.25a.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057a19.9 19.9 0 005.993 3.03a.078.078 0 00.084-.028a14.09 14.09 0 001.226-1.994a.076.076 0 00-.041-.106a13.107 13.107 0 01-1.872-.892a.077.077 0 01-.008-.128a10.2 10.2 0 00.372-.292a.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127a12.299 12.299 0 01-1.873.892a.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028a19.839 19.839 0 006.002-3.03a.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      ),
      email: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
    
    return icons[iconType] || icons.docs
  }

  const renderSectionContent = () => {
    const section = sections.find(s => s.section_id === activeSection)
    
    switch(activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300">{section?.section_content}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-md mr-3">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">Total Models</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">{models.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="bg-green-100 dark:bg-green-800 p-2 rounded-md mr-3">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-green-800 dark:text-green-300 font-medium">Live Endpoints</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-200">
                      {models.filter(m => m.deployment_status === 'live').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="bg-purple-100 dark:bg-purple-800 p-2 rounded-md mr-3">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-purple-800 dark:text-purple-300 font-medium">Uptime</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">99.9%</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Getting Started</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">Get Your API Key</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sign up for an account to receive your unique API key</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">Choose a Model</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Select from our available models based on your requirements</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">Make Your First Request</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Use the provided endpoint with your API key to start making requests</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'rate-limiting':
        return (
          <div className="space-y-6">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300">{section?.section_content}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rateLimits.map((plan, index) => (
                <div 
                  key={plan.id} 
                  className={`border rounded-lg p-6 ${
                    index === 1 
                      ? 'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20 shadow-lg transform scale-105' 
                      : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white">{plan.plan_name}</h3>
                    {index === 1 && (
                      <span className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-xs font-bold px-2 py-1 rounded">
                        POPULAR
                      </span>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">${plan.price_per_month}</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-1">/month</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Billed monthly</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{plan.requests_per_hour.toLocaleString()} requests/hour</span>
                    </li>
                    <li className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{plan.concurrent_requests} concurrent requests</span>
                    </li>
                    <li className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{plan.burst_limit} burst limit</span>
                    </li>
                    <li className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Priority support</span>
                    </li>
                  </ul>
                  
                  <button className={`w-full py-2 px-4 rounded font-medium ${
                    index === 1 
                      ? 'bg-purple-600 text-white hover:bg-purple-700' 
                      : 'bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600'
                  }`}>
                    Get Started
                  </button>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Understanding Rate Limits</h4>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <p>• <strong>Requests per hour</strong>: Maximum requests allowed in a rolling 60-minute window</p>
                <p>• <strong>Concurrent requests</strong>: Maximum simultaneous active connections</p>
                <p>• <strong>Burst limit</strong>: Maximum requests allowed in a short burst period (typically 1 minute)</p>
                <p>• Rate limit headers are included in all API responses</p>
              </div>
            </div>
          </div>
        )

      case 'authentication':
        return (
          <div className="space-y-6">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300">{section?.section_content}</p>
            </div>
            
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
              <div className="flex items-center text-gray-400 text-xs mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>HTTP Request</span>
              </div>
              <pre className="whitespace-pre-wrap">
{`curl https://api.yourservice.com/v1/models \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
              </pre>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">Error Responses</h4>
                <div className="space-y-2 text-sm">
                  <p><code className="bg-red-100 dark:bg-red-800 px-1 py-0.5 rounded">401 Unauthorized</code> - Invalid or missing API key</p>
                  <p><code className="bg-red-100 dark:bg-red-800 px-1 py-0.5 rounded">429 Too Many Requests</code> - Rate limit exceeded</p>
                  <p><code className="bg-red-100 dark:bg-red-800 px-1 py-0.5 rounded">403 Forbidden</code> - Insufficient permissions</p>
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Best Practices</h4>
                <div className="space-y-2 text-sm">
                  <p>• Store API keys in environment variables</p>
                  <p>• Rotate keys periodically</p>
                  <p>• Never commit API keys to version control</p>
                  <p>• Use different keys for different environments</p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300">{section?.section_content}</p>
          </div>
        )
    }
  }

  const renderActiveModel = () => {
    if (!activeModel) return null
    
    const model = models.find(m => m.model_number === activeModel)
    if (!model) return null

    return (
      <div className="space-y-8">
        {/* Model Header */}
        <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{model.model_name}</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{model.model_description}</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Link
                to={`/models/${model.model_number}`}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm font-medium rounded-lg flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                Test
              </Link>
              <button className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 text-sm font-medium rounded-lg flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-md text-sm font-mono border border-gray-300 dark:border-gray-700">
              {model.model_number}
            </span>
            <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-md text-sm border border-purple-300 dark:border-purple-700">
              {model.category}
            </span>
            <span className={`px-3 py-1 rounded-md text-sm border ${
              model.deployment_status === 'live' 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700' 
                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700'
            }`}>
              {model.deployment_status}
            </span>
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-md text-sm border border-blue-300 dark:border-blue-700">
              v{model.model_version}
            </span>
          </div>
        </div>

        {/* API Endpoint */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">API Endpoint</h3>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-gray-400 font-mono">POST</span>
              <button className="text-gray-400 hover:text-white text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
            </div>
            <code className="text-sm break-all font-mono">{model.backend_url}</code>
          </div>
        </div>

        {/* Request Example */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Request Example</h3>
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="bg-gray-800 dark:bg-gray-900 text-gray-400 text-xs px-4 py-2 border-b border-gray-700 dark:border-gray-600">
              <span className="font-mono">curl</span>
            </div>
            <pre className="p-4 text-sm font-mono text-gray-800 dark:text-gray-200 overflow-x-auto">
{`curl -X POST ${model.backend_url} \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Explain quantum computing in simple terms",
    "max_tokens": 100,
    "temperature": 0.7
  }'`}
            </pre>
          </div>
        </div>

        {/* Example Prompts */}
        {model.example_prompts && model.example_prompts.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Example Prompts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {model.example_prompts.slice(0, 4).map((prompt, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">Example {index + 1}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{prompt}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical Specifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Rate Limits</h3>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Requests per hour</span>
                  <span className="font-medium text-gray-900 dark:text-white">{model.rate_limit_per_hour.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Burst limit</span>
                  <span className="font-medium text-gray-900 dark:text-white">{model.rate_limit_burst}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Tokens per minute</span>
                  <span className="font-medium text-gray-900 dark:text-white">50,000</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Deployment</h3>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Platform</span>
                  <span className="font-medium text-gray-900 dark:text-white">{model.deployment_platform}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Region</span>
                  <span className="font-medium text-gray-900 dark:text-white">{model.deployment_region}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Uptime (30 days)</span>
                  <span className="font-medium text-green-600 dark:text-green-400">99.95%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Resources</h3>
          <div className="flex flex-wrap gap-3">
            {model.github_repo && (
              <a
                href={model.github_repo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 px-4 py-2 rounded-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                <span className="text-sm">GitHub Repository</span>
              </a>
            )}
            
            {model.documentation_url && (
              <a
                href={model.documentation_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 px-4 py-2 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-sm">Documentation</span>
              </a>
            )}
            
            {model.support_email && (
              <a
                href={`mailto:${model.support_email}`}
                className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 px-4 py-2 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Support</span>
              </a>
            )}
          </div>
        </div>
      </div>
    )
  }

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        ))}
      </div>
      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">API Documentation</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Complete reference for {models.length} AI models with live examples and test endpoints
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full md:w-64"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>All data is fetched live from our database</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Available Models */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Available Models ({models.length})
                </h3>
                {isLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    ))}
                  </div>
                ) : (
                  <nav className="space-y-1">
                    {filteredModels.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          setActiveModel(model.model_number)
                          setActiveSection(null)
                        }}
                        className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between ${
                          activeModel === model.model_number
                            ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="truncate">{model.model_name}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          model.deployment_status === 'live' 
                            ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-300' 
                            : 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-300'
                        }`}>
                          {model.deployment_status}
                        </span>
                      </button>
                    ))}
                    {filteredModels.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                        No models found
                      </p>
                    )}
                  </nav>
                )}
              </div>

              {/* Documentation Sections */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Documentation
                </h3>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => {
                        setActiveSection(section.section_id)
                        setActiveModel(null)
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                        activeSection === section.section_id && !activeModel
                          ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {section.section_title}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Resources */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Resources
                </h3>
                <div className="space-y-2">
                  {resources.map((resource) => (
                    <a
                      key={resource.id}
                      href={resource.resource_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md transition-colors"
                    >
                      <div className="text-gray-400 dark:text-gray-500">
                        {getResourceIcon(resource.icon)}
                      </div>
                      <span>{resource.resource_name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Breadcrumb */}
            <div className="mb-6">
              <nav className="flex text-sm text-gray-600 dark:text-gray-400">
                <Link to="/" className="hover:text-purple-600 dark:hover:text-purple-400">Home</Link>
                <span className="mx-2">/</span>
                <Link to="/api-docs" className="hover:text-purple-600 dark:hover:text-purple-400">API Docs</Link>
                {activeModel && (
                  <>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 dark:text-white truncate max-w-xs">
                      {models.find(m => m.model_number === activeModel)?.model_name}
                    </span>
                  </>
                )}
              </nav>
            </div>

            {/* Content Area */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              {isLoading ? (
                <div className="p-8">
                  <LoadingSkeleton />
                </div>
              ) : activeModel ? (
                <div className="p-8">
                  {renderActiveModel()}
                </div>
              ) : (
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3">
                      <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {sections.find(s => s.section_id === activeSection)?.section_title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Last updated: {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {renderSectionContent()}
                </div>
              )}
            </div>

            {/* All Models Table */}
            <div className="mt-8">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    All Models ({filteredModels.length})
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Click on any model to view detailed documentation
                  </p>
                </div>
                
                {isLoading ? (
                  <div className="p-6">
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left p-4 font-medium text-gray-700 dark:text-gray-300">Model</th>
                          <th className="text-left p-4 font-medium text-gray-700 dark:text-gray-300">ID</th>
                          <th className="text-left p-4 font-medium text-gray-700 dark:text-gray-300">Category</th>
                          <th className="text-left p-4 font-medium text-gray-700 dark:text-gray-300">Status</th>
                          <th className="text-left p-4 font-medium text-gray-700 dark:text-gray-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredModels.map((model) => (
                          <tr 
                            key={model.id} 
                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <td className="p-4">
                              <div>
                                <div className="flex items-center">
                                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                  </svg>
                                  <p className="font-medium text-gray-900 dark:text-white">{model.model_name}</p>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                                  {model.model_description}
                                </p>
                              </div>
                            </td>
                            <td className="p-4">
                              <code className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded border border-gray-300 dark:border-gray-600">
                                {model.model_number}
                              </code>
                            </td>
                            <td className="p-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                                {model.category}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center">
                                <div className={`w-2 h-2 rounded-full mr-2 ${
                                  model.deployment_status === 'live' 
                                    ? 'bg-green-500' 
                                    : 'bg-yellow-500'
                                }`}></div>
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                  {model.deployment_status}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    setActiveModel(model.model_number)
                                    setActiveSection(null)
                                  }}
                                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium flex items-center"
                                >
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  View Docs
                                </button>
                                <span className="text-gray-400">|</span>
                                <Link
                                  to={`/models/${model.model_number}`}
                                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 text-sm font-medium flex items-center"
                                >
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                  </svg>
                                  Test
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredModels.length === 0 && (
                      <div className="text-center py-12">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-600 dark:text-gray-400">No models found matching your search</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApiDocs