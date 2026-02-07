const OutputPanel = ({ output, isLoading, error }) => {
  // Copy output
  const handleCopy = async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <div className="flex items-center space-x-3">
          <svg
            className="animate-spin h-5 w-5 text-purple-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>

          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              Processing your request...
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              The AI model is generating a response
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="border border-red-200 dark:border-red-900 bg-white dark:bg-gray-900 p-6">
        <div className="flex items-start space-x-3">
          <svg
            className="h-5 w-5 text-red-500 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <div>
            <p className="font-semibold text-red-600 dark:text-red-400">
              Error
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {error}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!output) {
    return (
      <div className="border border-yellow-500 dark:border-yellow-100 bg-white dark:bg-gray-900 p-6">
        <div className="text-center py-10">
          <svg
            className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>

          <p className="text-black-600 dark:text-white-400 text-sm">
            Output will appear here after generation
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Output</h3>

        {/* Small Copy Icon */}
        <button
          onClick={handleCopy}
          className="w-9 h-9 flex items-center justify-center border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          type="button"
          title="Copy output"
        >
          <svg
            className="w-4 h-4 text-gray-600 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>

      {/* Output Box */}
      <div className="border border-yellow-100 dark:border-yellow-800 bg-gray-50 dark:bg-gray-950 p-4">
        <pre className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-sans text-sm leading-relaxed">
          {output}
        </pre>
      </div>
    </div>
  )
}

export default OutputPanel
