import { Link } from 'react-router-dom'

const ModelCard = ({ model }) => {
  return (
    <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
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
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3">
        {model.model_description}
      </p>

      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {model.example_prompts?.length || 0} example prompts
        </div>

        <Link
          to={`/models/${model.model_number}`}
          className="btn-primary text-sm py-1.5 px-3"
        >
          Open
        </Link>
      </div>
    </div>
  )
}

export default ModelCard
