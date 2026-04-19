// FileAnalyzer.jsx
import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Upload, 
  FileSpreadsheet, 
  FileCode, 
  FileText, 
  FileJson,
  Database,
  AlertCircle,
  CheckCircle,
  XCircle,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Hash,
  Type,
  Calendar
} from 'lucide-react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

const FileAnalyzer = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  // Product configuration
  const productConfig = {
    'csv-analyzer': {
      name: 'CSV Analyzer',
      icon: FileSpreadsheet,
      acceptedTypes: ['.csv', 'text/csv'],
      analyzer: analyzeCSV
    },
    'excel-analyzer': {
      name: 'Excel Analyzer',
      icon: Database,
      acceptedTypes: ['.xlsx', '.xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
      analyzer: analyzeExcel
    },
    'html-analyzer': {
      name: 'HTML Analyzer',
      icon: FileCode,
      acceptedTypes: ['.html', '.htm', 'text/html'],
      analyzer: analyzeHTML
    },
    'json-analyzer': {
      name: 'JSON Analyzer',
      icon: FileJson,
      acceptedTypes: ['.json', 'application/json'],
      analyzer: analyzeJSON
    },
    'text-analyzer': {
      name: 'Text File Analyzer',
      icon: FileText,
      acceptedTypes: ['.txt', '.log', '.md', 'text/plain'],
      analyzer: analyzeText
    }
  };

  const config = productConfig[type];

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Product Not Found</h2>
          <button
            onClick={() => navigate('/products')}
            className="text-purple-600 hover:text-purple-700"
          >
            Return to Products
          </button>
        </div>
      </div>
    );
  }

  // CSV Analysis (Pandas-style)
  function analyzeCSV(content, fileName) {
    return new Promise((resolve, reject) => {
      Papa.parse(content, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data;
          const columns = results.meta.fields || [];
          
          if (columns.length === 0) {
            reject(new Error('No columns found in CSV'));
            return;
          }

          const analysis = {
            fileName,
            fileType: 'CSV',
            rowCount: data.length,
            columnCount: columns.length,
            columns: {},
            summary: {
              totalCells: data.length * columns.length,
              missingValues: 0,
              duplicateRows: 0
            }
          };

          // Analyze each column
          columns.forEach(col => {
            const values = data.map(row => row[col]).filter(v => v !== null && v !== undefined && v !== '');
            const allValues = data.map(row => row[col]);
            const missingCount = allValues.length - values.length;
            
            analysis.summary.missingValues += missingCount;

            const columnAnalysis = {
              name: col,
              type: inferColumnType(values),
              count: values.length,
              missing: missingCount,
              unique: new Set(values).size,
              ...getColumnStats(values)
            };

            analysis.columns[col] = columnAnalysis;
          });

          // Check for duplicates
          const rowStrings = data.map(row => JSON.stringify(row));
          analysis.summary.duplicateRows = rowStrings.length - new Set(rowStrings).size;

          resolve(analysis);
        },
        error: (error) => reject(error)
      });
    });
  }

  // Excel Analysis
  async function analyzeExcel(content, fileName) {
    return new Promise((resolve, reject) => {
      try {
        const workbook = XLSX.read(content, { type: 'binary' });
        const analysis = {
          fileName,
          fileType: 'Excel',
          sheetCount: workbook.SheetNames.length,
          sheets: {}
        };

        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (data.length === 0) {
            analysis.sheets[sheetName] = { rowCount: 0, columnCount: 0, columns: {} };
            return;
          }

          const headers = data[0] || [];
          const rows = data.slice(1);
          
          const sheetAnalysis = {
            rowCount: rows.length,
            columnCount: headers.length,
            columns: {}
          };

          // Analyze each column
          headers.forEach((header, idx) => {
            if (!header) return;
            
            const values = rows.map(row => row[idx]).filter(v => v !== null && v !== undefined && v !== '');
            const allValues = rows.map(row => row[idx]);
            
            sheetAnalysis.columns[header] = {
              name: header,
              index: idx,
              type: inferColumnType(values),
              count: values.length,
              missing: allValues.length - values.length,
              unique: new Set(values).size,
              ...getColumnStats(values)
            };
          });

          analysis.sheets[sheetName] = sheetAnalysis;
        });

        resolve(analysis);
      } catch (error) {
        reject(error);
      }
    });
  }

  // HTML Analysis
  function analyzeHTML(content, fileName) {
    return new Promise((resolve) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      
      const analysis = {
        fileName,
        fileType: 'HTML',
        structure: {
          title: doc.title || 'No title',
          scripts: doc.scripts.length,
          styles: doc.styleSheets.length,
          links: doc.links.length,
          images: doc.images.length,
          forms: doc.forms.length
        },
        tags: {},
        classes: new Set(),
        ids: new Set(),
        attributes: {}
      };

      // Analyze all elements
      const allElements = doc.getElementsByTagName('*');
      
      Array.from(allElements).forEach(element => {
        const tagName = element.tagName.toLowerCase();
        
        // Count tags
        analysis.tags[tagName] = (analysis.tags[tagName] || 0) + 1;
        
        // Collect classes
        if (element.className) {
          element.className.split(/\s+/).forEach(cls => {
            if (cls) analysis.classes.add(cls);
          });
        }
        
        // Collect IDs
        if (element.id) {
          analysis.ids.add(element.id);
        }
        
        // Collect attributes
        Array.from(element.attributes).forEach(attr => {
          if (!analysis.attributes[attr.name]) {
            analysis.attributes[attr.name] = new Set();
          }
          if (attr.value) {
            analysis.attributes[attr.name].add(attr.value);
          }
        });
      });

      // Convert Sets to Arrays/Counts
      analysis.classes = {
        count: analysis.classes.size,
        values: Array.from(analysis.classes).slice(0, 50) // Limit to 50 for display
      };
      
      analysis.ids = {
        count: analysis.ids.size,
        values: Array.from(analysis.ids).slice(0, 50)
      };
      
      // Convert attribute Sets to counts
      Object.keys(analysis.attributes).forEach(attr => {
        analysis.attributes[attr] = {
          count: analysis.attributes[attr].size,
          uniqueValues: analysis.attributes[attr].size
        };
      });

      resolve(analysis);
    });
  }

  // JSON Analysis
  function analyzeJSON(content, fileName) {
    return new Promise((resolve, reject) => {
      try {
        const data = JSON.parse(content);
        const analysis = {
          fileName,
          fileType: 'JSON',
          rootType: Array.isArray(data) ? 'array' : 'object',
          size: {
            keys: 0,
            arrays: 0,
            objects: 0,
            primitives: 0
          },
          structure: {},
          schema: {}
        };

        function analyzeValue(value, path = 'root', depth = 0) {
          if (depth > 10) return { type: 'max_depth' }; // Prevent infinite recursion

          if (Array.isArray(value)) {
            analysis.size.arrays++;
            const itemTypes = value.map(item => analyzeValue(item, `${path}[]`, depth + 1));
            return {
              type: 'array',
              length: value.length,
              itemTypes: [...new Set(itemTypes.map(t => t.type))],
              nested: itemTypes[0]
            };
          } else if (value && typeof value === 'object') {
            analysis.size.objects++;
            const objAnalysis = {
              type: 'object',
              properties: {}
            };
            
            Object.keys(value).forEach(key => {
              analysis.size.keys++;
              objAnalysis.properties[key] = analyzeValue(value[key], `${path}.${key}`, depth + 1);
            });
            
            return objAnalysis;
          } else {
            analysis.size.primitives++;
            return {
              type: typeof value,
              example: value
            };
          }
        }

        analysis.structure = analyzeValue(data);
        
        // Generate simple schema
        analysis.schema = generateSchema(analysis.structure);
        
        resolve(analysis);
      } catch (error) {
        reject(new Error('Invalid JSON format: ' + error.message));
      }
    });
  }

  // Text Analysis
  function analyzeText(content, fileName) {
    return new Promise((resolve) => {
      const lines = content.split('\n');
      const words = content.split(/\s+/).filter(w => w.length > 0);
      const characters = content.length;
      
      // Word frequency
      const wordFreq = {};
      words.forEach(word => {
        const cleaned = word.toLowerCase().replace(/[^\w]/g, '');
        if (cleaned) {
          wordFreq[cleaned] = (wordFreq[cleaned] || 0) + 1;
        }
      });
      
      const sortedWords = Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20);
      
      // Line length analysis
      const lineLengths = lines.map(line => line.length);
      
      const analysis = {
        fileName,
        fileType: 'Text',
        statistics: {
          lines: lines.length,
          words: words.length,
          characters,
          emptyLines: lines.filter(l => l.trim() === '').length,
          avgLineLength: lineLengths.reduce((a, b) => a + b, 0) / lines.length,
          maxLineLength: Math.max(...lineLengths),
          avgWordLength: words.reduce((sum, w) => sum + w.length, 0) / words.length
        },
        wordFrequency: sortedWords,
        encoding: detectEncoding(content),
        patterns: detectPatterns(content)
      };
      
      resolve(analysis);
    });
  }

  // Helper functions
  function inferColumnType(values) {
    if (values.length === 0) return 'empty';
    
    const sample = values.slice(0, 100);
    const types = sample.map(v => {
      if (!isNaN(v) && v.toString().trim() !== '') return 'number';
      if (v.toString().match(/^\d{4}-\d{2}-\d{2}/)) return 'date';
      if (v.toString().match(/^(true|false)$/i)) return 'boolean';
      return 'string';
    });
    
    const uniqueTypes = [...new Set(types)];
    return uniqueTypes.length === 1 ? uniqueTypes[0] : 'mixed';
  }

  function getColumnStats(values) {
    const stats = {};
    
    const numbers = values
      .map(v => parseFloat(v))
      .filter(n => !isNaN(n));
    
    if (numbers.length > 0) {
      stats.numeric = {
        min: Math.min(...numbers),
        max: Math.max(...numbers),
        mean: numbers.reduce((a, b) => a + b, 0) / numbers.length,
        median: numbers.sort((a, b) => a - b)[Math.floor(numbers.length / 2)],
        sum: numbers.reduce((a, b) => a + b, 0)
      };
      
      // Mode
      const freq = {};
      numbers.forEach(n => freq[n] = (freq[n] || 0) + 1);
      const maxFreq = Math.max(...Object.values(freq));
      stats.numeric.mode = Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number);
    }
    
    // String stats
    const strings = values.filter(v => typeof v === 'string' && v.trim() !== '');
    if (strings.length > 0) {
      stats.string = {
        minLength: Math.min(...strings.map(s => s.length)),
        maxLength: Math.max(...strings.map(s => s.length)),
        avgLength: strings.reduce((a, b) => a + b.length, 0) / strings.length,
        empty: values.length - strings.length
      };
    }
    
    return stats;
  }

  function generateSchema(structure, depth = 0) {
    if (depth > 5) return '...';
    
    if (structure.type === 'object') {
      const schema = {};
      Object.keys(structure.properties).slice(0, 10).forEach(key => {
        schema[key] = generateSchema(structure.properties[key], depth + 1);
      });
      if (Object.keys(structure.properties).length > 10) {
        schema['...'] = `+${Object.keys(structure.properties).length - 10} more`;
      }
      return schema;
    } else if (structure.type === 'array') {
      return [`Array[${structure.length}]`, generateSchema(structure.nested || {}, depth + 1)];
    } else {
      return structure.type;
    }
  }

  function detectEncoding(content) {
    // Simple encoding detection
    const sample = content.slice(0, 1000);
    const hasBOM = content.charCodeAt(0) === 0xFEFF;
    
    return {
      hasBOM,
      likely: hasBOM ? 'UTF-8 with BOM' : 'UTF-8',
      ascii: /^[\x00-\x7F]*$/.test(sample)
    };
  }

  function detectPatterns(content) {
    const patterns = [];
    
    // Email pattern
    const emailMatches = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
    if (emailMatches) {
      patterns.push({ type: 'emails', count: emailMatches.length });
    }
    
    // URL pattern
    const urlMatches = content.match(/https?:\/\/[^\s]+/g);
    if (urlMatches) {
      patterns.push({ type: 'urls', count: urlMatches.length });
    }
    
    // Phone pattern
    const phoneMatches = content.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/g);
    if (phoneMatches) {
      patterns.push({ type: 'phoneNumbers', count: phoneMatches.length });
    }
    
    // Dates
    const dateMatches = content.match(/\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}/g);
    if (dateMatches) {
      patterns.push({ type: 'dates', count: dateMatches.length });
    }
    
    return patterns;
  }

  // File handling
  const handleFile = useCallback(async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5 MB limit');
      return;
    }

    setFile(file);
    setLoading(true);
    setError(null);

    try {
      const content = await readFile(file);
      setFileContent(content);
      
      const analysisResult = await config.analyzer(content, file.name);
      setAnalysis(analysisResult);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [config]);

  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        reader.readAsBinaryString(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const Icon = config.icon;

  // Render analysis results
  const renderAnalysis = () => {
    if (!analysis) return null;

    return (
      <div className="mt-8 space-y-6">
        {/* File Info */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              File Information
            </h3>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">File Name</p>
              <p className="font-medium text-gray-900 dark:text-white">{analysis.fileName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
              <p className="font-medium text-gray-900 dark:text-white">{analysis.fileType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Size</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
            {analysis.rowCount !== undefined && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Rows</p>
                <p className="font-medium text-gray-900 dark:text-white">{analysis.rowCount}</p>
              </div>
            )}
          </div>
        </div>

        {/* Type-specific Analysis */}
        {type === 'csv-analyzer' && renderCSVAnalysis()}
        {type === 'excel-analyzer' && renderExcelAnalysis()}
        {type === 'html-analyzer' && renderHTMLAnalysis()}
        {type === 'json-analyzer' && renderJSONAnalysis()}
        {type === 'text-analyzer' && renderTextAnalysis()}
      </div>
    );
  };

  const renderCSVAnalysis = () => (
    <>
      {/* Summary Stats */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Summary Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-sm text-blue-600 dark:text-blue-400">Total Columns</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">{analysis.columnCount}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <p className="text-sm text-green-600 dark:text-green-400">Total Rows</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-200">{analysis.rowCount}</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <p className="text-sm text-yellow-600 dark:text-yellow-400">Missing Values</p>
            <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-200">
              {analysis.summary.missingValues}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <p className="text-sm text-purple-600 dark:text-purple-400">Duplicate Rows</p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">
              {analysis.summary.duplicateRows}
            </p>
          </div>
        </div>
      </div>

      {/* Column Analysis */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Column Analysis
        </h3>
        <div className="space-y-4">
          {Object.values(analysis.columns).map((column, idx) => (
            <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg">
              <button
                onClick={() => toggleSection(`col-${column.name}`)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  {column.type === 'number' ? (
                    <Hash className="w-5 h-5 text-blue-500" />
                  ) : column.type === 'date' ? (
                    <Calendar className="w-5 h-5 text-green-500" />
                  ) : (
                    <Type className="w-5 h-5 text-purple-500" />
                  )}
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">{column.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Type: {column.type} • Unique: {column.unique} • Missing: {column.missing}
                    </p>
                  </div>
                </div>
                {expandedSections[`col-${column.name}`] ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {expandedSections[`col-${column.name}`] && (
                <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {column.numeric && (
                      <>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Min</p>
                          <p className="font-mono">{column.numeric.min.toFixed(4)}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Max</p>
                          <p className="font-mono">{column.numeric.max.toFixed(4)}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Mean</p>
                          <p className="font-mono">{column.numeric.mean.toFixed(4)}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Median</p>
                          <p className="font-mono">{column.numeric.median.toFixed(4)}</p>
                        </div>
                        {column.numeric.mode && (
                          <div className="bg-gray-50 dark:bg-gray-700 rounded p-3 col-span-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Mode</p>
                            <p className="font-mono">
                              {column.numeric.mode.slice(0, 5).map(m => m.toFixed(2)).join(', ')}
                              {column.numeric.mode.length > 5 && ' ...'}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                    {column.string && (
                      <>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Min Length</p>
                          <p className="font-mono">{column.string.minLength}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Max Length</p>
                          <p className="font-mono">{column.string.maxLength}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded p-3 col-span-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Average Length</p>
                          <p className="font-mono">{column.string.avgLength.toFixed(2)}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderExcelAnalysis = () => (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Sheets Analysis ({analysis.sheetCount} sheets)
      </h3>
      <div className="space-y-4">
        {Object.entries(analysis.sheets).map(([sheetName, sheet]) => (
          <div key={sheetName} className="border border-gray-200 dark:border-gray-700 rounded-lg">
            <button
              onClick={() => toggleSection(`sheet-${sheetName}`)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{sheetName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {sheet.rowCount} rows • {sheet.columnCount} columns
                </p>
              </div>
              {expandedSections[`sheet-${sheetName}`] ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            {expandedSections[`sheet-${sheetName}`] && sheet.columns && (
              <div className="px-4 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                  {Object.values(sheet.columns).map((column, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                      <p className="font-medium text-sm text-gray-900 dark:text-white mb-1">
                        {column.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 rounded">
                          {column.type}
                        </span>
                        <span>•</span>
                        <span>{column.count} non-null</span>
                        <span>•</span>
                        <span>{column.unique} unique</span>
                      </div>
                      {column.numeric && (
                        <p className="text-xs font-mono text-gray-600 dark:text-gray-300 mt-2">
                          Range: [{column.numeric.min.toFixed(2)} - {column.numeric.max.toFixed(2)}]
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderHTMLAnalysis = () => (
    <>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Document Structure
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-sm text-blue-600 dark:text-blue-400">Title</p>
            <p className="font-medium text-blue-900 dark:text-blue-200 truncate">
              {analysis.structure.title}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <p className="text-sm text-green-600 dark:text-green-400">Scripts</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-200">
              {analysis.structure.scripts}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <p className="text-sm text-purple-600 dark:text-purple-400">Styles</p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">
              {analysis.structure.styles}
            </p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <p className="text-sm text-yellow-600 dark:text-yellow-400">Images</p>
            <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-200">
              {analysis.structure.images}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tag Frequency
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(analysis.tags)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 15)
            .map(([tag, count]) => (
              <div key={tag} className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                <code className="text-purple-600 dark:text-purple-400">&lt;{tag}&gt;</code>
                <span className="float-right font-bold text-gray-900 dark:text-white">{count}</span>
              </div>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Classes ({analysis.classes.count})
          </h3>
          <div className="max-h-64 overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {analysis.classes.values.map((cls, idx) => (
                <span key={idx} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded text-sm">
                  .{cls}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            IDs ({analysis.ids.count})
          </h3>
          <div className="max-h-64 overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {analysis.ids.values.map((id, idx) => (
                <span key={idx} className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded text-sm">
                  #{id}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderJSONAnalysis = () => (
    <>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Structure Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-purple-900/20 rounded-lg p-4">
            <p className="text-sm text-purple-600 dark:text-purple-400">Root Type</p>
            <p className="text-xl font-bold text-purple-900 dark:text-purple-200">
              {analysis.rootType}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <p className="text-sm text-purple-600 dark:text-purple-400">Total Keys</p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">
              {analysis.size.keys}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <p className="text-sm text-purple-600 dark:text-purple-400">Arrays</p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">
              {analysis.size.arrays}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <p className="text-sm text-purple-600 dark:text-purple-400">Objects</p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">
              {analysis.size.objects}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Inferred Schema
        </h3>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
          {JSON.stringify(analysis.schema, null, 2)}
        </pre>
      </div>
    </>
  );

  const renderTextAnalysis = () => (
    <>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Text Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(analysis.statistics).map(([key, value]) => (
            <div key={key} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {typeof value === 'number' ? value.toFixed(2) : value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top 20 Words
        </h3>
        <div className="space-y-2">
          {analysis.wordFrequency.map(([word, count], idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400 w-8">{idx + 1}.</span>
              <span className="flex-1 font-mono text-sm text-gray-900 dark:text-white">{word}</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">{count}</span>
              <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded"
                  style={{ width: `${(count / analysis.wordFrequency[0][1]) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {analysis.patterns.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Detected Patterns
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {analysis.patterns.map((pattern, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{pattern.type}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pattern.count}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/products')}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ← Back to Products
            </button>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${config.color} p-2`}>
                <Icon className="w-full h-full text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {config.name}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Upload files up to 5 MB • Client-side processing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
            dragActive
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
              : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept={config.acceptedTypes.join(',')}
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <Upload className={`w-16 h-16 mx-auto mb-4 ${
            dragActive ? 'text-purple-500' : 'text-gray-400'
          }`} />
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {dragActive ? 'Drop your file here' : 'Choose a file or drag it here'}
          </h3>
          
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Supported formats: {config.acceptedTypes.filter(t => t.startsWith('.')).join(', ')}
          </p>
          
          {file && (
            <div className="inline-flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">{file.name}</span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-8 text-center py-12">
            <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Analyzing file...</p>
          </div>
        )}

        {/* Analysis Results */}
        {!loading && analysis && renderAnalysis()}

        {/* Actions */}
        {analysis && (
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => {
                setFile(null);
                setFileContent(null);
                setAnalysis(null);
              }}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Analyze Another File
            </button>
            <button
              onClick={() => {
                const dataStr = JSON.stringify(analysis, null, 2);
                const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                const exportFileDefaultName = `${file.name}-analysis.json`;
                
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', exportFileDefaultName);
                linkElement.click();
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileAnalyzer;