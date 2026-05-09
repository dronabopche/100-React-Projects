import { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Link } from 'react-router-dom';
import { fetchAllModels } from '../services/supabase';
import { useRef } from 'react';

/* ─── Intersection observer hook ─── */
function useReveal(threshold = 0.08) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}


// ─── Notebook Output ────────────────────────────────────────────────────────

const NotebookOutput = ({ output }) => {
  if (output.output_type === 'stream') {
    const text = Array.isArray(output.text) ? output.text.join('') : output.text || '';
    return (
      <pre className={`text-xs font-mono p-2 rounded border overflow-x-auto ${output.name === 'stderr'
        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
        : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
        }`}>
        {text}
      </pre>
    );
  }

  if (output.output_type === 'display_data' || output.output_type === 'execute_result') {
    const data = output.data || {};
    if (data['image/png']) {
      return (
        <img
          src={`data:image/png;base64,${data['image/png']}`}
          alt="notebook output"
          className="max-w-full rounded border border-gray-200 dark:border-gray-700"
        />
      );
    }
    if (data['text/html']) {
      const html = Array.isArray(data['text/html']) ? data['text/html'].join('') : data['text/html'];
      return (
        <div
          className="text-xs overflow-x-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-2"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }
    if (data['text/plain']) {
      const text = Array.isArray(data['text/plain']) ? data['text/plain'].join('') : data['text/plain'];
      return (
        <pre className="text-xs font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-2 overflow-x-auto">
          {text}
        </pre>
      );
    }
  }

  if (output.output_type === 'error') {
    return (
      <pre className="text-xs font-mono p-2 rounded border bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 overflow-x-auto">
        {output.ename}: {output.evalue}
      </pre>
    );
  }

  return null;
};

// ─── Notebook Cell ───────────────────────────────────────────────────────────

const NotebookCell = ({ cell, index }) => {
  const [collapsed, setCollapsed] = useState(false);

  const isCode = cell.cell_type === 'code';
  const isMarkdown = cell.cell_type === 'markdown';
  const source = Array.isArray(cell.source) ? cell.source.join('') : cell.source || '';
  const outputs = cell.outputs || [];
  const execCount = cell.execution_count;

  return (
    <div className={`group flex gap-0 ${isCode ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/40'}`}>
      {/* Gutter */}
      <div className="flex-shrink-0 w-12 pt-3 pb-2 flex flex-col items-center gap-1">
        <span className="text-xs text-gray-400 dark:text-gray-600 font-mono select-none">
          {isCode ? `[${execCount ?? ' '}]` : 'md'}
        </span>
        <button
          onClick={() => setCollapsed(c => !c)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400"
          title={collapsed ? 'Expand cell' : 'Collapse cell'}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={collapsed ? 'M19 9l-7 7-7-7' : 'M5 15l7-7 7 7'} />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 py-2 pr-4">
        {!collapsed ? (
          <>
            {source && (
              isMarkdown ? (
                <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed font-sans">
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {source}
                  </ReactMarkdown>
                </div>
              ) : (
                <pre className="text-xs font-mono text-gray-800 dark:text-gray-200 overflow-x-auto bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 leading-relaxed">
                  {source}
                </pre>
              )
            )}
            {outputs.length > 0 && (
              <div className="mt-2 space-y-1">
                {outputs.map((output, oi) => (
                  <NotebookOutput key={oi} output={output} />
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="text-xs text-gray-500 dark:text-gray-600 italic py-1">
            Cell {index + 1} collapsed · {source.split('\n').length} lines
          </p>
        )}
      </div>
    </div>
  );
};

// ─── Notebook Preview ────────────────────────────────────────────────────────

const NotebookPreview = ({ url, modelName }) => {
  const [notebook, setNotebook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [lastLoaded, setLastLoaded] = useState(null);

  const fetchNotebook = useCallback(async (notebookUrl) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(notebookUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();
      setNotebook(data);
      setLastLoaded(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (url) fetchNotebook(url);
  }, [url, fetchNotebook]);

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
          {modelName} — notebook
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchNotebook(url)}
            disabled={loading}
            className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 transition-colors disabled:opacity-40"
          >
            <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reload
          </button>
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 border border-purple-200 dark:border-purple-700 rounded px-2 py-1 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            {expanded ? 'Collapse' : 'Expand'}
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Source
          </a>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
          <span className="font-medium">⚠ Error loading notebook: </span>{error}
        </div>
      )}

      {/* Cells */}
      <div className={`overflow-y-auto transition-all duration-300 ${expanded ? '' : 'max-h-[480px]'} relative`}>
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 dark:text-gray-500 text-sm gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Loading notebook...
          </div>
        ) : notebook ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {notebook.cells?.map((cell, idx) => (
              <NotebookCell key={idx} cell={cell} index={idx} />
            ))}
          </div>
        ) : !error ? (
          <div className="flex items-center justify-center py-16 text-gray-500 dark:text-gray-500 text-sm">
            No notebook loaded.
          </div>
        ) : null}

        {/* Fade hint when collapsed */}
        {!expanded && notebook && (
          <div className="sticky bottom-0 inset-x-0 h-16 bg-gradient-to-t from-gray-50 dark:from-gray-800 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Footer */}
      {notebook && !loading && (
        <div className="flex justify-between items-center px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-400 dark:text-gray-500">
          <span>
            {notebook.cells?.length || 0} cells · kernel: {notebook.metadata?.kernelspec?.display_name || 'unknown'}
          </span>
          {lastLoaded && (
            <span>Loaded at {lastLoaded.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Markdown Renderer Component ────────────────────────────────────────────

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={`${className} bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm`} {...props}>
                {children}
              </code>
            );
          },
          a({ href, children, ...props }) {
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline" {...props}>
                {children}
              </a>
            );
          },
          h1({ children, ...props }) {
            return <h1 className="text-3xl font-bold mt-8 mb-4" {...props}>{children}</h1>;
          },
          h2({ children, ...props }) {
            return <h2 className="text-2xl font-bold mt-6 mb-3" {...props}>{children}</h2>;
          },
          h3({ children, ...props }) {
            return <h3 className="text-xl font-semibold mt-4 mb-2" {...props}>{children}</h3>;
          },
          p({ children, ...props }) {
            return <p className="mb-4 leading-relaxed" {...props}>{children}</p>;
          },
          ul({ children, ...props }) {
            return <ul className="list-disc pl-6 mb-4 space-y-1" {...props}>{children}</ul>;
          },
          ol({ children, ...props }) {
            return <ol className="list-decimal pl-6 mb-4 space-y-1" {...props}>{children}</ol>;
          },
          li({ children, ...props }) {
            return <li className="mb-1" {...props}>{children}</li>;
          },
          blockquote({ children, ...props }) {
            return (
              <blockquote className="border-l-4 border-purple-500 pl-4 italic my-4 text-gray-600 dark:text-gray-400" {...props}>
                {children}
              </blockquote>
            );
          },
          table({ children, ...props }) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-gray-200 dark:border-gray-700" {...props}>
                  {children}
                </table>
              </div>
            );
          },
          th({ children, ...props }) {
            return (
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-gray-800 font-semibold" {...props}>
                {children}
              </th>
            );
          },
          td({ children, ...props }) {
            return (
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" {...props}>
                {children}
              </td>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

// ─── Helper Functions for Safe JSON Parsing ─────────────────────────────────

const safeJsonParse = (data, defaultValue = null) => {
  if (!data) return defaultValue;
  try {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    return parsed;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return defaultValue;
  }
};

const renderFeaturesTable = (features) => {
  if (!features || !Array.isArray(features) || features.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Input Features</h3>
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Field</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Options</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {features.map((feature, idx) => (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <td className="px-4 py-3 text-sm font-mono text-gray-900 dark:text-gray-100">
                  {feature.name}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${feature.type === 'enum'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    }`}>
                    {feature.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                  {feature.options ? (
                    <div className="flex flex-wrap gap-1">
                      {feature.options.map((option, optIdx) => (
                        <code key={optIdx} className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                          {option}
                        </code>
                      ))}
                    </div>
                  ) : '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                  {feature.description || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Main ApiDocs Component ──────────────────────────────────────────────────

const ApiDocs = () => {
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModel, setActiveModel] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [architectureZoomed, setArchitectureZoomed] = useState(false);

  const [ovRef, ovVis] = useReveal(0.05);
  const [contentRef, contentVis] = useReveal(0.05);


  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const modelsData = await fetchAllModels();
      setModels(modelsData);
      if (modelsData.length > 0) setActiveModel(modelsData[0].model_number);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredModels = models.filter(model => {
    if (searchQuery === '') return true;

    try {
      const query = searchQuery.toLowerCase();
      return (
        (model.model_name || '').toLowerCase().includes(query) ||
        (model.model_number || '').toLowerCase().includes(query) ||
        (model.category || '').toLowerCase().includes(query) ||
        (model.model_description || '').toLowerCase().includes(query)
      );
    } catch (error) {
      console.error('Failed to filter model:', model);
      console.error('Error details:', error);
      return false;
    }
  });

  const parseExtraLinks = (extra) => {
    if (!extra) return [];
    try {
      const parsed = typeof extra === 'string' ? JSON.parse(extra) : extra;
      if (Array.isArray(parsed)) return parsed.filter(item => item && item.url);
      if (typeof parsed === 'object') {
        return Object.entries(parsed)
          .filter(([, url]) => url)
          .map(([name, url]) => ({ name, url }));
      }
    } catch { /* ignore */ }
    return [];
  };

  const renderActiveModel = () => {
    if (!activeModel) return null;
    const model = models.find(m => m.model_number === activeModel);
    if (!model) return null;

    const extraLinks = parseExtraLinks(model.extra);

    // Safe parsing of all JSON fields
    const features = safeJsonParse(model.features, []);
    const inputFormat = safeJsonParse(model.input_format, {
      prompt: "string",
      model_id: "string",
      timestamp: "string"
    });
    const outputFormat = safeJsonParse(model.output_format, {
      output: "string",
      success: "boolean",
      processing_time: "number"
    });

    // Check if features is an array of objects (like the input format table) or array of strings
    const isFeaturesTable = Array.isArray(features) && features.length > 0 && features[0]?.name && features[0]?.type;

    return (
      <div className="space-y-8">

        {/* ── Model Header ── */}
        <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{model.model_name}</h2>
              <p className="text-gray-700 dark:text-gray-400 mt-1">{model.model_description}</p>
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
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-md text-sm font-mono border border-gray-300 dark:border-gray-700">
              {model.model_number}
            </span>
            <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-md text-sm border border-purple-300 dark:border-purple-700">
              {model.category || 'General'}
            </span>
            <span className={`px-3 py-1 rounded-md text-sm border ${model.deployment_status === 'live'
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700'
              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700'
              }`}>
              {model.deployment_status || 'live'}
            </span>
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-md text-sm border border-blue-300 dark:border-blue-700">
              v{model.model_version || '1.0.0'}
            </span>
            <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-3 py-1 rounded-md text-sm border border-indigo-300 dark:border-indigo-700">
              {model.input_category || 'text'} input
            </span>
          </div>
        </div>

        {/* ── API Endpoint ── */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">API Endpoint</h3>
          <div className="bg-purple-600 dark:bg-purple-900 text-gray-100 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-gray-100 font-mono">POST</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(model.backend_url);
                  // You could add a toast notification here
                }}
                className="text-purple-200 hover:text-white text-sm"
                title="Copy URL"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
            </div>
            <code className="text-sm break-all font-mono">{model.backend_url}</code>
          </div>
        </div>

        {/* ── Request Example ── */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Request Example</h3>
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="bg-purple-600 dark:bg-purple-900 text-gray-100 text-xs px-4 py-2 border-b border-gray-900 dark:border-purple-500">
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

        {/* ── Example Prompts ── */}
        {model.example_prompts && model.example_prompts.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Example Prompts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {model.example_prompts.slice(0, 4).map((prompt, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">Example {index + 1}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-400 line-clamp-3">{prompt}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Architecture Diagram ── */}
        {model.architecture_url && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              Architecture Diagram
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                  {model.model_name} — system architecture
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setArchitectureZoomed(z => !z)}
                    className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 border border-purple-200 dark:border-purple-700 rounded px-2 py-1 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    {architectureZoomed ? 'Collapse' : 'Expand'}
                  </button>
                  <a
                    href={model.architecture_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open
                  </a>
                </div>
              </div>
              <div className={`relative overflow-hidden transition-all duration-300 ${architectureZoomed ? '' : 'max-h-80'} bg-white dark:bg-gray-900 flex items-center justify-center`}>
                <img
                  src={model.architecture_url}
                  alt={`${model.model_name} architecture diagram`}
                  className={`w-full object-contain ${architectureZoomed ? '' : 'cursor-zoom-in'}`}
                  onClick={() => setArchitectureZoomed(true)}
                  onError={(e) => {
                    e.currentTarget.parentElement.innerHTML = `
                      <div class="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-600 gap-2">
                        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span class="text-sm">Architecture diagram could not be loaded</span>
                      </div>`;
                  }}
                />
                {!architectureZoomed && (
                  <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none" />
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Technical Specifications ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Rate Limits</h3>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Requests per hour</span>
                  <span className="font-medium text-gray-900 dark:text-white">{model.rate_limit_per_hour?.toLocaleString() || '100'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Burst limit</span>
                  <span className="font-medium text-gray-900 dark:text-white">{model.rate_limit_burst || '20'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Requires authentication</span>
                  <span className="font-medium text-gray-900 dark:text-white">{model.requires_auth ? 'Yes' : 'No'}</span>
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
                  <span className="font-medium text-gray-900 dark:text-white">{model.deployment_platform || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Region</span>
                  <span className="font-medium text-gray-900 dark:text-white">{model.deployment_region || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Last updated</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {model.last_updated ? new Date(model.last_updated).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Features / Input Specifications Table ── */}
        {isFeaturesTable ? (
          renderFeaturesTable(features)
        ) : features.length > 0 ? (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Features</h3>
            <div className="flex flex-wrap gap-2">
              {features.map((feature, idx) => (
                <span key={idx} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-md text-sm border border-gray-200 dark:border-gray-700">
                  {typeof feature === 'string' ? feature : feature.name || JSON.stringify(feature)}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {/* ── Input/Output Format ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Input Format</h3>
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs font-mono text-gray-700 dark:text-gray-300">
                {JSON.stringify(inputFormat, null, 2)}
              </pre>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Output Format</h3>
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs font-mono text-gray-700 dark:text-gray-300">
                {JSON.stringify(outputFormat, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* ── Resources ── */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Resources</h3>
          <div className="flex flex-wrap gap-3">
            {model.github_repo && (
              <a href={model.github_repo} target="_blank" rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 px-4 py-2 rounded-lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                <span className="text-sm">GitHub Repository</span>
              </a>
            )}
            {extraLinks.map((link, idx) => (
              <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 px-4 py-2 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="text-sm">{link.name || `Extra Link ${idx + 1}`}</span>
              </a>
            ))}
          </div>
        </div>

      </div>
    );
  };

  // ── Derive the active model object for notebook rendering ──
  const activeModelObj = activeModel ? models.find(m => m.model_number === activeModel) : null;

  const LoadingSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>)}
      </div>
      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">


      {/* ── Fixed Top Header ── */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>API Reference</span>
              <span className="text-[10px] font-mono font-normal text-gray-400 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-1.5 py-0.5 rounded">
                v1.0.0
              </span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Complete documentation for {models.length} AI models
            </p>
          </div>
          <div className="relative flex-shrink-0 group">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="boxy-input pl-10 pr-10 py-2 w-64 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>


      </div>

      {/* ── Scrollable body: sidebar + main ── */}
      <div className="flex-1 flex flex-col">
        <div className="flex flex-1 max-w-7xl w-full mx-auto px-4 py-4 gap-6">


          {/* ── Sidebar (sticky) ── */}
          <div className="hidden lg:flex flex-col w-64 flex-shrink-0 space-y-4 pb-4 sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">


            {/* Available Models */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center text-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Models ({models.length})
              </h3>
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>)}
                </div>
              ) : (
                <nav className="space-y-1">
                  {filteredModels.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => { setActiveModel(model.model_number); setArchitectureZoomed(false); }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between border-b last:border-b-0 ${activeModel === model.model_number
                        ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-l-4 border-l-purple-500 font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                    >
                      <span className="truncate">{model.model_name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 font-mono border ${model.deployment_status === 'live'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700'
                        }`}>
                        {model.deployment_status || 'live'}
                      </span>
                    </button>
                  ))}

                  {filteredModels.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">No models found</p>
                  )}
                </nav>
              )}
            </div>

            {/* Documentation Overview Section */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center text-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Documentation
              </h3>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveModel(null)}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors border-l-4 ${!activeModel
                    ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-l-purple-500 font-bold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border-l-transparent'
                    }`}
                >
                  Overview
                </button>

              </nav>
            </div>

            {/* Resources Section */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center text-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Quick Links
              </h3>
              <div className="space-y-1">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                  <span>GitHub</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Status</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Support</span>
                </a>
              </div>
            </div>

          </div>


          {/* ── Main content (natural scroll) ── */}
          <div className="flex-1 min-w-0 pb-4">


            {/* Breadcrumb */}
            <div className="mb-4">
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

            {/* Content Card */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 pv-grid pointer-events-none" />
              <div className="relative z-10">

                {isLoading ? (
                  <div className="p-8"><LoadingSkeleton /></div>
                ) : activeModel ? (
                  <div className="p-8">{renderActiveModel()}</div>
                ) : (
                  <div className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3">
                        <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">API Documentation</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          Welcome to the PromptVista ML API documentation
                        </p>
                      </div>
                    </div>

                    <div
                      ref={ovRef}
                      className="prose dark:prose-invert max-w-none"
                      style={{ opacity: 0, animation: ovVis ? 'pv-up .6s ease forwards' : 'none' }}
                    >
                      <h2>Overview</h2>
                      <p>
                        PromptVista ML provides a robust API to interact with state-of-the-art machine learning models.
                        Our platform ensures high availability, sub-100ms response times, and built-in GenAI validation
                        via the Gemini layer.
                      </p>

                      <div className="grid sm:grid-cols-2 gap-6 my-8 not-prose">
                        <div className="p-5 bg-gray-50 dark:bg-gray-800/40 border-l-4 border-l-purple-500 border border-gray-200 dark:border-gray-700">
                          <h4 className="font-bold text-gray-900 dark:text-white mb-2">Base URL</h4>
                          <code className="text-xs break-all bg-white dark:bg-gray-900 px-2 py-1 border border-gray-200 dark:border-gray-700">
                            https://api.promptvistaml.com/v1
                          </code>
                        </div>
                        <div className="p-5 bg-gray-50 dark:bg-gray-800/40 border-l-4 border-l-yellow-500 border border-gray-200 dark:border-gray-700">
                          <h4 className="font-bold text-gray-900 dark:text-white mb-2">Format</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            All requests and responses use JSON. Character encoding is UTF-8.
                          </p>
                        </div>
                      </div>

                      <h3>Authentication</h3>
                      <p>
                        All API requests require authentication using an API key provided in the Authorization header.
                        Keep your API keys secret and never share them in client-side code.
                      </p>
                      <div className="overflow-x-auto my-6 not-prose">
                        <table className="min-w-full border border-gray-200 dark:border-gray-800">
                          <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200 dark:border-gray-800">Header</th>
                              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200 dark:border-gray-800">Value</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            <tr>
                              <td className="px-4 py-3 text-sm font-mono text-gray-900 dark:text-gray-100">Authorization</td>
                              <td className="px-4 py-3 text-sm font-mono text-purple-600 dark:text-purple-400 font-bold">Bearer YOUR_API_KEY</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm font-mono text-gray-900 dark:text-gray-100">Content-Type</td>
                              <td className="px-4 py-3 text-sm font-mono text-gray-600 dark:text-gray-400">application/json</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <h3>Common Error Codes</h3>
                      <p>
                        Our API uses standard HTTP response codes to indicate the success or failure of an API request.
                      </p>
                      <div className="overflow-x-auto my-6 not-prose">
                        <table className="min-w-full border border-gray-200 dark:border-gray-800">
                          <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200 dark:border-gray-800">Code</th>
                              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200 dark:border-gray-800">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
                            <tr>
                              <td className="px-4 py-3 text-sm font-mono font-bold text-green-600">200</td>
                              <td className="px-4 py-3 text-sm">OK — Everything worked as expected.</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm font-mono font-bold text-red-600">400</td>
                              <td className="px-4 py-3 text-sm">Bad Request — Often missing required parameters.</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm font-mono font-bold text-red-600">401</td>
                              <td className="px-4 py-3 text-sm">Unauthorized — No valid API key provided.</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm font-mono font-bold text-red-600">429</td>
                              <td className="px-4 py-3 text-sm">Too Many Requests — Rate limit exceeded.</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm font-mono font-bold text-red-600">500</td>
                              <td className="px-4 py-3 text-sm">Server Errors — Something went wrong on our end.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <h3>Response Format</h3>
                      <p>All successful responses return a JSON object with the following top-level fields:</p>
                      <div className="bg-gray-900 text-gray-100 p-5 rounded font-mono text-xs not-prose border-2 border-purple-500 shadow-lg">
                        {`{
  "success": true,
  "data": { ... },
  "metadata": {
    "latency": "43ms",
    "model_id": "sentiment-analysis-01",
    "validation_score": 0.98
  }
}`}
                      </div>
                    </div>

                  </div>
                )}
              </div>

              {/* ── Notebook Preview — separate block below the content card ── */}
              {!isLoading && activeModelObj?.notebook && (
                <div className="mt-6">
                  {/* Section header */}
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notebook Preview</h3>
                    <span className="text-xs font-mono font-normal text-gray-400 border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                      .ipynb
                    </span>
                  </div>
                  <NotebookPreview url={activeModelObj.notebook} modelName={activeModelObj.model_name} />

                  {/* Footer */}
                  <div className="mt-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                    <span>
                      {activeModelObj.model_name} · v{activeModelObj.model_version || '1.0.0'} · {activeModelObj.category || 'General'}
                    </span>
                    <span>Last updated: {activeModelObj.last_updated ? new Date(activeModelObj.last_updated).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;