// Products.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileSpreadsheet, 
  FileCode, 
  FileText, 
  FileJson,
  Database,
  ArrowRight,
  Upload
} from 'lucide-react';

const Products = () => {
  const navigate = useNavigate();
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const products = [
    {
      id: 'csv-analyzer',
      name: 'CSV Analyzer',
      description: 'Upload CSV files and get pandas-style analysis with data types, statistics, and patterns',
      icon: FileSpreadsheet,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      supportedFormats: ['.csv'],
      maxSize: '5 MB',
      features: [
        'Column data type detection',
        'Statistical analysis (mean, median, mode)',
        'Missing value detection',
        'Unique value counts',
        'Pattern recognition'
      ],
      path: '/products/csv-analyzer'
    },
    {
      id: 'html-analyzer',
      name: 'HTML Analyzer',
      description: 'Parse HTML files and extract structure, tags, classes, and DOM hierarchy',
      icon: FileCode,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      supportedFormats: ['.html', '.htm'],
      maxSize: '5 MB',
      features: [
        'Tag frequency analysis',
        'Class and ID extraction',
        'DOM structure visualization',
        'Attribute analysis',
        'Script and style detection'
      ],
      path: '/products/html-analyzer'
    },
    {
      id: 'excel-analyzer',
      name: 'Excel Analyzer',
      description: 'Analyze Excel files (.xlsx, .xls) with multi-sheet support and data profiling',
      icon: Database,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      supportedFormats: ['.xlsx', '.xls'],
      maxSize: '5 MB',
      features: [
        'Multi-sheet analysis',
        'Cell type detection',
        'Formula detection',
        'Statistical summaries',
        'Data validation rules'
      ],
      path: '/products/excel-analyzer'
    },
    {
      id: 'json-analyzer',
      name: 'JSON Analyzer',
      description: 'Parse JSON files and analyze structure, nested objects, arrays, and data types',
      icon: FileJson,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      supportedFormats: ['.json'],
      maxSize: '5 MB',
      features: [
        'Nested structure analysis',
        'Data type inference',
        'Array and object counts',
        'Schema generation',
        'Value distribution analysis'
      ],
      path: '/products/json-analyzer'
    },
    {
      id: 'text-analyzer',
      name: 'Text File Analyzer',
      description: 'Analyze text files for patterns, word frequency, encoding, and structure',
      icon: FileText,
      color: 'from-yellow-500 to-amber-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      supportedFormats: ['.txt', '.log', '.md'],
      maxSize: '5 MB',
      features: [
        'Encoding detection',
        'Word frequency analysis',
        'Line and character counts',
        'Pattern matching',
        'Language detection'
      ],
      path: '/products/text-analyzer'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Data Analysis Products
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Upload your files and get instant pandas-style analysis - all processed locally in your browser
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                <Upload className="w-3 h-3 mr-1" />
                Max file size: 5 MB
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                🔒 Client-side processing
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const Icon = product.icon;
            return (
              <div
                key={product.id}
                className={`relative bg-white dark:bg-gray-800 border-2 rounded-xl transition-all duration-300 cursor-pointer overflow-hidden group
                  ${hoveredProduct === product.id ? 'shadow-2xl scale-105 border-transparent' : 'border-gray-200 dark:border-gray-700'}
                `}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                onClick={() => navigate(product.path)}
              >
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${product.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} 
                     style={{ padding: '2px' }}>
                  <div className="w-full h-full bg-white dark:bg-gray-800 rounded-xl" />
                </div>
                
                <div className="relative p-6">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-r ${product.color} p-3 mb-4`}>
                    <Icon className="w-full h-full text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {product.description}
                  </p>

                  {/* Supported Formats */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Supported Formats
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.supportedFormats.map((format) => (
                        <span
                          key={format}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-mono"
                        >
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Features
                    </p>
                    <ul className="space-y-1">
                      {product.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                          <span className={`inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-r ${product.color} mt-1.5 mr-2 flex-shrink-0`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Max size: {product.maxSize}
                    </span>
                    <div className={`flex items-center gap-1 text-sm font-medium bg-gradient-to-r ${product.color} bg-clip-text text-transparent`}>
                      Analyze Now
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Products;