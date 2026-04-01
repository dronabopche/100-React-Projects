import { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Link } from 'react-router-dom';
import {
  fetchAllModels,
  fetchDocumentationSections,
  fetchRateLimits,
  fetchApiResources
} from '../services/supabase';

// ─── Notebook Output ────────────────────────────────────────────────────────

const NotebookOutput = ({ output }) => {
  if (output.output_type === 'stream') {
    const text = Array.isArray(output.text) ? output.text.join('') : output.text || '';
    return (
      <pre className={`text-xs font-mono p-2 rounded border overflow-x-auto ${
        output.name === 'stderr'
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

  const isCode     = cell.cell_type === 'code';
  const isMarkdown = cell.cell_type === 'markdown';
  const source     = Array.isArray(cell.source) ? cell.source.join('') : cell.source || '';
  const outputs    = cell.outputs || [];
  const execCount  = cell.execution_count;

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
          <p className="text-xs text-gray-400 dark:text-gray-600 italic py-1">
            Cell {index + 1} collapsed · {source.split('\n').length} lines
          </p>
        )}
      </div>
    </div>
  );
};

// ─── Notebook Preview ────────────────────────────────────────────────────────

const NotebookPreview = ({ url, modelName }) => {
  const [notebook,    setNotebook]    = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const [expanded,    setExpanded]    = useState(false);
  const [lastLoaded,  setLastLoaded]  = useState(null);

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
          <div className="flex items-center justify-center py-16 text-gray-400 dark:text-gray-500 text-sm">
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

// ─── Main ApiDocs Component ──────────────────────────────────────────────────

const ApiDocs = () => {
  const [models,             setModels]             = useState([]);
  const [sections,           setSections]           = useState([]);
  const [rateLimits,         setRateLimits]         = useState([]);
  const [resources,          setResources]          = useState([]);
  const [isLoading,          setIsLoading]          = useState(true);
  const [activeSection,      setActiveSection]      = useState('overview');
  const [activeModel,        setActiveModel]        = useState(null);
  const [searchQuery,        setSearchQuery]        = useState('');
  const [architectureZoomed, setArchitectureZoomed] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [modelsData, sectionsData, limitsData, resourcesData] = await Promise.all([
        fetchAllModels(),
        fetchDocumentationSections(),
        fetchRateLimits(),
        fetchApiResources()
      ]);
      setModels(modelsData);
      setSections(sectionsData);
      setRateLimits(limitsData);
      setResources(resourcesData);
      if (modelsData.length > 0) setActiveModel(modelsData[0].model_number);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredModels = models.filter(model =>
    searchQuery === '' ||
    model.model_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.model_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.model_description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      ),
      link: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      )
    };
    return icons[iconType] || icons.link;
  };

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

  const renderSectionContent = () => {
    const section = sections.find(s => s.section_id === activeSection);

    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <MarkdownRenderer content={section?.section_content || 'Welcome to our API documentation. This guide will help you integrate our AI models into your applications.'} />

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
                    <p className="text-sm text-purple-800 dark:text-purple-300 font-medium">Uptime (30d)</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">99.9%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Getting Started</h3>
              <div className="space-y-3">
                {[
                  { title: 'Get Your API Key',       desc: 'Sign up for an account to receive your unique API key' },
                  { title: 'Choose a Model',          desc: 'Select from our available models based on your requirements' },
                  { title: 'Make Your First Request', desc: 'Use the provided endpoint with your API key to start making requests' },
                ].map((step, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">{step.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'rate-limiting':
        return (
          <div className="space-y-6">
            <MarkdownRenderer content={section?.section_content || 'Understand our rate limiting policies to optimize your API usage.'} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rateLimits.length > 0 ? rateLimits.map((plan, index) => (
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
                    {[
                      `${plan.requests_per_hour?.toLocaleString() || '100'} requests/hour`,
                      `${plan.concurrent_requests || '5'} concurrent requests`,
                      `${plan.burst_limit || '10'} burst limit`,
                      'Priority support',
                    ].map((item, ii) => (
                      <li key={ii} className="flex items-center text-sm">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-2 px-4 rounded font-medium ${
                    index === 1
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600'
                  }`}>
                    Get Started
                  </button>
                </div>
              )) : (
                [
                  { name: 'Free',       price: '$0',   rpm: '100',     concurrent: '5',   burst: '10',   popular: false },
                  { name: 'Pro',        price: '$49',  rpm: '10,000',  concurrent: '50',  burst: '100',  popular: true  },
                  { name: 'Enterprise', price: '$499', rpm: '100,000', concurrent: '500', burst: '1000', popular: false },
                ].map((plan, index) => (
                  <div
                    key={plan.name}
                    className={`border rounded-lg p-6 ${
                      plan.popular
                        ? 'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20 shadow-lg transform scale-105'
                        : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-xl text-gray-900 dark:text-white">{plan.name}</h3>
                      {plan.popular && (
                        <span className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-xs font-bold px-2 py-1 rounded">
                          POPULAR
                        </span>
                      )}
                    </div>
                    <div className="mb-6">
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                        <span className="text-gray-600 dark:text-gray-400 ml-1">/month</span>
                      </div>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {[
                        `${plan.rpm} requests/hour`,
                        `${plan.concurrent} concurrent requests`,
                        `${plan.burst} burst limit`,
                      ].map((item, ii) => (
                        <li key={ii} className="flex items-center text-sm">
                          <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <button className={`w-full py-2 px-4 rounded font-medium ${
                      plan.popular
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600'
                    }`}>
                      Get Started
                    </button>
                  </div>
                ))
              )}
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
        );

      case 'authentication':
        return (
          <div className="space-y-6">
            <MarkdownRenderer content={section?.section_content || 'Learn how to authenticate your API requests securely.'} />

            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
              <div className="flex items-center text-gray-400 text-xs mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>HTTP Request</span>
              </div>
              <pre className="whitespace-pre-wrap">
{`curl https://api.modelhub.com/v1/models \\
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
        );

      default:
        return (
          <MarkdownRenderer content={section?.section_content || 'Documentation content goes here.'} />
        );
    }
  };

  const renderActiveModel = () => {
    if (!activeModel) return null;
    const model = models.find(m => m.model_number === activeModel);
    if (!model) return null;

    const extraLinks = parseExtraLinks(model.extra);

    return (
      <div className="space-y-8">

        {/* ── Model Header ── */}
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

        {/* ── API Endpoint ── */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">API Endpoint</h3>
          <div className="bg-purple-600 dark:bg-purple-900 text-gray-100 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-gray-100 font-mono">POST</span>
              <button className="text-purple-200 hover:text-white text-sm">
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
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{prompt}</p>
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
                  <span className="font-medium text-gray-900 dark:text-white">{model.rate_limit_per_hour?.toLocaleString() || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Burst limit</span>
                  <span className="font-medium text-gray-900 dark:text-white">{model.rate_limit_burst || 'N/A'}</span>
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
                  <span className="font-medium text-gray-900 dark:text-white">{model.deployment_platform || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Region</span>
                  <span className="font-medium text-gray-900 dark:text-white">{model.deployment_region || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Uptime (30 days)</span>
                  <span className="font-medium text-green-600 dark:text-green-400">99.95%</span>
                </div>
              </div>
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
            {model.documentation_url && (
              <a href={model.documentation_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 px-4 py-2 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-sm">Documentation</span>
              </a>
            )}
            {model.support_email && (
              <a href={`mailto:${model.support_email}`}
                className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 px-4 py-2 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Support</span>
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

        {/* ── Notebook section intentionally removed from here ── */}
        {/* It now renders separately below the content card */}

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
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">

      {/* ── Fixed Top Header ── */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">API Documentation</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Complete reference for {models.length} AI models · live data
            </p>
          </div>
          <div className="relative flex-shrink-0">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64 text-sm"
            />
          </div>
        </div>
      </div>

      {/* ── Scrollable body: sidebar + main ── */}
      <div className="flex-1 overflow-hidden flex">
        <div className="flex flex-1 max-w-7xl w-full mx-auto px-4 py-4 gap-6 overflow-hidden">

          {/* ── Sidebar (own scroll) ── */}
          <div className="hidden lg:flex flex-col w-64 flex-shrink-0 overflow-y-auto space-y-4 pb-4">

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
                      onClick={() => { setActiveModel(model.model_number); setActiveSection(null); setArchitectureZoomed(false); }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between ${
                        activeModel === model.model_number
                          ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="truncate">{model.model_name}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ml-1 flex-shrink-0 ${
                        model.deployment_status === 'live'
                          ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-300'
                          : 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-300'
                      }`}>
                        {model.deployment_status}
                      </span>
                    </button>
                  ))}
                  {filteredModels.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">No models found</p>
                  )}
                </nav>
              )}
            </div>

            {/* Documentation Sections */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center text-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Documentation
              </h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => { setActiveSection(section.section_id); setActiveModel(null); }}
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
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center text-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Resources
              </h3>
              <div className="space-y-1">
                {resources.length > 0 ? (
                  <>
                    {resources.map((resource) => (
                      <a
                        key={resource.id}
                        href={resource.resource_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md transition-colors"
                      >
                        <div className="text-gray-400 dark:text-gray-500">{getResourceIcon(resource.icon)}</div>
                        <span>{resource.resource_name}</span>
                      </a>
                    ))}
                    {activeModel && (() => {
                      const m = models.find(m => m.model_number === activeModel);
                      const el = parseExtraLinks(m?.extra);
                      if (!el.length) return null;
                      return (
                        <>
                          <div className="border-t border-gray-100 dark:border-gray-700 my-2" />
                          <p className="text-xs text-gray-400 dark:text-gray-500 px-3 pb-1 font-medium uppercase tracking-wide">Model Links</p>
                          {el.map((link, idx) => (
                            <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer"
                              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md transition-colors">
                              <div className="text-gray-400 dark:text-gray-500">{getResourceIcon('link')}</div>
                              <span className="truncate">{link.name || `Extra Link ${idx + 1}`}</span>
                            </a>
                          ))}
                        </>
                      );
                    })()}
                  </>
                ) : (
                  [{ icon: 'github', label: 'GitHub' }, { icon: 'status', label: 'Status Page' }, { icon: 'docs', label: 'Documentation' }]
                    .map(r => (
                      <a key={r.label} href="#"
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-md">
                        <div className="text-gray-400">{getResourceIcon(r.icon)}</div>
                        <span>{r.label}</span>
                      </a>
                    ))
                )}
              </div>
            </div>

          </div>

          {/* ── Main content (own scroll) ── */}
          <div className="flex-1 overflow-y-auto min-w-0 pb-4">

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
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
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
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {sections.find(s => s.section_id === activeSection)?.section_title || 'Documentation'}
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
                    {activeModelObj.model_name} · v{activeModelObj.model_version} · {activeModelObj.category}
                  </span>
                  <span>Last updated: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
              
            )}
          </div>
          
        
        </div>
        
      </div>
       
    </div>
    
  );
};

export default ApiDocs;