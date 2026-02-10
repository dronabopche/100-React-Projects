import { Link } from 'react-router-dom'

const ModelCard = ({ model }) => {
  return (
    <Link to={`/models/${model.model_number}`} className="block">
      <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 hover:shadow-lg transition-all duration-200 hover:border-purple-300 dark:hover:border-purple-700 cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {model.model_name}
            </h3>

            <div className="flex items-center space-x-2 mt-2">
              <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 border border-gray-200 dark:border-gray-700">
                {model.model_number}
              </span>

              {model.category && (
                <span className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-purple-700 dark:text-purple-300 px-2 py-1 border border-yellow-200 dark:border-yellow-800">
                  {model.category}
                </span>
              )}
            </div>
          </div>
          
          {/* Add a subtle arrow indicator */}
          <svg 
            className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors opacity-0 group-hover:opacity-100"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
          {model.model_description}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {model.example_prompts?.length || 0} example prompts
          </div>

          <span className="text-sm text-purple-600 dark:text-purple-400 font-medium group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
            Open →
          </span>
        </div>
      </div>
    </Link>
  )
}

export default ModelCard