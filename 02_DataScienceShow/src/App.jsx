import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { 
  vscDarkPlus, 
  vs 
} from "react-syntax-highlighter/dist/esm/styles/prism";

function App() {
  const [theme, setTheme] = useState("light");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [notebookContent, setNotebookContent] = useState(null);
  const [notebookLoading, setNotebookLoading] = useState(false);
  const [notebookError, setNotebookError] = useState(null);

  // Theme styles
  const themes = {
    light: {
      bg: "#FAFAF4",
      text: "#161B12",
      border: "#D8DCCB",
      boxBg: "#ced8c8",
      sidebarBg: "#F0F2E4",
      hoverBg: "rgba(0,0,0,0.05)",
      codeBg: "#F4F5EA",
      outputBg: "#FFFFFF",
      outputBorder: "#D8DCCB",
    },
    dark: {
      bg: "#0F120D",
      text: "#F4EAD7",
      border: "#3E4436",
      boxBg: "#1B2018",
      sidebarBg: "#232B20",
      hoverBg: "rgba(255,255,255,0.05)",
      codeBg: "#0B0D08",
      outputBg: "#1B2018",
      outputBorder: "#3E4436",
    },
  };

  const currentTheme = themes[theme];
  const codeStyle = theme === "light" ? vs : vscDarkPlus;

  //Hardcoded test model link
  const TEST_MODEL_LINK = "https://promptvistaml.vercel.app/";
  
  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("portfolio-theme") || "light";
    setTheme(savedTheme);
  }, []);

  // Fetch projects
  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch notebook when selected project changes
  useEffect(() => {
    if (selectedProject?.ipynb_url) {
      fetchNotebook(selectedProject.ipynb_url);
    } else {
      setNotebookContent(null);
      setNotebookError(null);
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("portfolio_projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProjects(data || []);
      if (data && data.length > 0) {
        setSelectedProject(data[0]);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Database connection failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const convertToRawGitHubUrl = (url) => {
    if (!url) return "";

    // Convert GitHub blob URL to raw URL
    if (url.includes("github.com") && url.includes("/blob/")) {
      return url
        .replace("github.com", "raw.githubusercontent.com")
        .replace("/blob/", "/");
    }

    return url;
  };

  const fetchNotebook = async (notebookUrl) => {
    if (!notebookUrl) {
      setNotebookContent(null);
      return;
    }

    try {
      setNotebookLoading(true);
      setNotebookError(null);

      const rawUrl = convertToRawGitHubUrl(notebookUrl);

      const response = await fetch(rawUrl);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch notebook: ${response.status} ${response.statusText}`
        );
      }

      const content = await response.json();

      // Basic validation
      if (!content?.cells || !Array.isArray(content.cells)) {
        throw new Error("Invalid notebook format (cells missing).");
      }

      setNotebookContent(content);
    } catch (err) {
      console.error("Error fetching notebook:", err);
      setNotebookError(`Unable to load notebook: ${err.message}`);
      setNotebookContent(null);
    } finally {
      setNotebookLoading(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("portfolio-theme", newTheme);
  };

  const formatUrl = (url, defaultPrefix = "") => {
    if (!url) return "#";
    if (url.startsWith("http")) return url;
    return defaultPrefix + url;
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const formatExtraLinks = (extraLinks) => {
    if (!extraLinks) return [];
    try {
      if (typeof extraLinks === "string") return JSON.parse(extraLinks);
      return extraLinks;
    } catch {
      return [];
    }
  };
  
  // Add this function to convert Tableau URLs to embed format
  const convertTableauUrl = (url) => {
    if (!url) return "";
    
    // If it's already an embed URL, return as-is
    if (url.includes("embed=y")) {
      return url;
    }
    
    // If it's a Tableau public URL, convert to embed format
    if (url.includes("tableau.com")) {
      // Extract the base URL without query parameters
      const urlObj = new URL(url);
      const basePath = urlObj.pathname;
      
      // Build embed URL
      const embedUrl = `https://public.tableau.com${basePath}?:embed=y&:showVizHome=no&:host_url=https%3A%2F%2Fpublic.tableau.com%2F&:embed_code_version=3&:tabs=no&:toolbar=yes&:animate_transition=yes&:display_static_image=no&:display_spinner=no&:display_overlay=yes&:display_count=yes&:language=en-US&publish=yes&:loadOrderID=0`;
      
      return embedUrl;
    }
    
    return url;
  };

  // ===== NOTEBOOK RENDER HELPERS =====

  const getTextFromCellSource = (source) => {
    if (!source) return "";
    if (Array.isArray(source)) return source.join("");
    return String(source);
  };

  const renderNotebookOutput = (output, index) => {
    // Stream output (print)
    if (output.output_type === "stream") {
      const text = Array.isArray(output.text)
        ? output.text.join("")
        : output.text || "";

      return (
        <pre
          key={index}
          style={{
            marginTop: "10px",
            padding: "10px",
            backgroundColor: currentTheme.outputBg,
            border: `1px solid ${currentTheme.outputBorder}`,
            borderRadius: "6px",
            overflowX: "auto",
            fontSize: "13px",
            whiteSpace: "pre-wrap",
            color: currentTheme.text,
          }}
        >
          {text}
        </pre>
      );
    }

    // Execute result or display data (text/plain)
    if (output.data?.["text/plain"]) {
      const text = Array.isArray(output.data["text/plain"])
        ? output.data["text/plain"].join("")
        : output.data["text/plain"];

      return (
        <pre
          key={index}
          style={{
            marginTop: "10px",
            padding: "10px",
            backgroundColor: currentTheme.outputBg,
            border: `1px solid ${currentTheme.outputBorder}`,
            borderRadius: "6px",
            overflowX: "auto",
            fontSize: "13px",
            whiteSpace: "pre-wrap",
            color: currentTheme.text,
          }}
        >
          {text}
        </pre>
      );
    }

    // If there is an error output
    if (output.output_type === "error") {
      const traceback = Array.isArray(output.traceback)
        ? output.traceback.join("\n")
        : "";

      return (
        <pre
          key={index}
          style={{
            marginTop: "10px",
            padding: "10px",
            backgroundColor: theme === "light" ? "#fff5f5" : "#2a0000",
            border: `1px solid ${theme === "light" ? "#ffcccc" : "#ff4444"}`,
            borderRadius: "6px",
            overflowX: "auto",
            fontSize: "13px",
            whiteSpace: "pre-wrap",
            color: theme === "light" ? "#cc0000" : "#ff8888",
          }}
        >
          {traceback || output.ename || "Error"}
        </pre>
      );
    }

    return null;
  };

  const NotebookViewer = ({ notebook }) => {
    if (!notebook?.cells) return null;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {notebook.cells.map((cell, idx) => {
          const cellType = cell.cell_type;
          const cellSource = getTextFromCellSource(cell.source);

          return (
            <div
              key={idx}
              style={{
                border: `1px solid ${currentTheme.border}`,
                borderRadius: "8px",
                padding: "12px",
                backgroundColor: currentTheme.boxBg,
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  opacity: 0.65,
                  marginBottom: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>
                  Cell {idx + 1} ({cellType})
                </span>
                {cell.execution_count !== null &&
                  cell.execution_count !== undefined && (
                    <span>Execution: {cell.execution_count}</span>
                  )}
              </div>

              {/* Markdown */}
              {cellType === "markdown" && (
                <div style={{ lineHeight: "1.7", fontSize: "14px" }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {cellSource}
                  </ReactMarkdown>
                </div>
              )}

              {/* Code */}
              {cellType === "code" && (
                <>
                  <div style={{ borderRadius: "6px", overflow: "hidden" }}>
                    <SyntaxHighlighter
                      language="python"
                      style={codeStyle}
                      customStyle={{
                        margin: 0,
                        padding: "12px",
                        fontSize: "13px",
                        border: `1px solid ${currentTheme.border}`,
                      }}
                      showLineNumbers={true}
                      lineNumberStyle={{
                        minWidth: "40px",
                        textAlign: "right",
                        paddingRight: "12px",
                        color: theme === "light" ? "#6a737d" : "#8b949e",
                        borderRight: `1px solid ${currentTheme.border}`,
                      }}
                    >
                      {cellSource}
                    </SyntaxHighlighter>
                  </div>

                  {/* Outputs */}
                  {cell.outputs?.length > 0 && (
                    <div style={{ marginTop: "12px" }}>
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          opacity: 0.8,
                          marginBottom: "6px",
                        }}
                      >
                        Output
                      </div>

                      {cell.outputs.map((out, outIdx) =>
                        renderNotebookOutput(out, outIdx)
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // ===== STYLES =====

  const baseStyles = {
    app: {
      minHeight: "100vh",
      backgroundColor: currentTheme.bg,
      color: currentTheme.text,
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      lineHeight: "1.4",
    },
    button: {
      padding: "8px 16px",
      border: `1px solid ${currentTheme.border}`,
      backgroundColor: "transparent",
      color: currentTheme.text,
      fontFamily: "inherit",
      fontSize: "14px",
      cursor: "pointer",
    },
    container: {
      display: "flex",
      flex: 1,
      padding: "10px",
      gap: "10px",
      minHeight: "calc(100vh - 100px)",
    },
    mainContent: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    box: {
      border: `1px solid ${currentTheme.border}`,
      padding: "15px",
      backgroundColor: currentTheme.boxBg,
      marginBottom: "10px",
    },
    sidebar: {
      width: "300px",
      border: `1px solid ${currentTheme.border}`,
      padding: "0",
      backgroundColor: currentTheme.sidebarBg,
      display: "flex",
      flexDirection: "column",
    },
    footer: {
      borderTop: `1px solid ${currentTheme.border}`,
      padding: "10px 20px",
      backgroundColor: currentTheme.bg, // Changed to match background
      textAlign: "center",
    },
  };

  return (
    <div style={baseStyles.app}>
      <div style={baseStyles.container}>
        {/* MAIN */}
        <div style={baseStyles.mainContent}>
          {error && (
            <div style={baseStyles.box}>
              <h3 style={{ color: "#ff0000", marginBottom: "10px" }}>Error</h3>
              <p>{error}</p>
              <button
                onClick={fetchProjects}
                style={{ ...baseStyles.button, marginTop: "15px" }}
              >
                Retry Connection
              </button>
            </div>
          )}

          {loading ? (
            <div style={baseStyles.box}>
              <h3>Loading Portfolio...</h3>
              <p>Fetching data from database...</p>
            </div>
          ) : selectedProject ? (
            <>
              {/* TITLE with Test Model Button */}
              <div style={{ ...baseStyles.box, padding: "10px 15px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h1 style={{ margin: "0", fontSize: "24px" }}>
                    {selectedProject.title}
                  </h1>
                  <a
                    href={TEST_MODEL_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      ...baseStyles.button,
                      padding: "6px 16px",
                      textDecoration: "none",
                      display: "inline-block",
                      backgroundColor: theme === "light" ? "#f0f0f0" : "#2d2d2d",
                    }}
                  >
                    Test Model
                  </a>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    opacity: 0.7,
                    marginTop: "8px",
                  }}
                >
                  <span>ID: {selectedProject.id?.substring(0, 8)}...</span>
                  <span>
                    Created:{" "}
                    {new Date(selectedProject.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* VISUALIZATION */}
              <div style={baseStyles.box}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                    paddingBottom: "8px",
                    borderBottom: `1px solid ${currentTheme.border}`,
                  }}
                >
                  <h2 style={{ margin: 0, fontSize: "18px" }}>Visualization</h2>
                </div>

                <div
                  style={{
                    border: `1px solid ${currentTheme.border}`,
                    margin: "8px 0",
                  }}
                >
                  <iframe
                    src={convertTableauUrl(selectedProject.tabula_url)}
                    title={`Visualization: ${selectedProject.title}`}
                    style={{
                      width: "100%",
                      height: "400px",
                      display: "block",
                      border: "none",
                    }}
                    onError={(e) => {
                      console.error("Failed to load Tableau visualization");
                      e.target.style.display = "none";
                    }}
                  />
                </div>

                <div
                  style={{
                    textAlign: "right",
                    fontSize: "11px",
                    opacity: 0.7,
                    marginTop: "5px",
                  }}
                >
                  <small>Embedded from Tabula</small>
                </div>
              </div>

              {/* ARCHITECTURE SECTION - NEW */}
              {selectedProject.flowchat_url && (
                <div style={baseStyles.box}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                      paddingBottom: "8px",
                      borderBottom: `1px solid ${currentTheme.border}`,
                    }}
                  >
                    <h2 style={{ margin: 0, fontSize: "18px" }}>Architecture</h2>
                  </div>

                  <div
                    style={{
                      border: `1px solid ${currentTheme.border}`,
                      padding: "10px",
                      backgroundColor: currentTheme.bg,
                      textAlign: "center",
                    }}
                  >
                    <img
                      src={selectedProject.flowchat_url}
                      alt={`Architecture for ${selectedProject.title}`}
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        display: "block",
                        margin: "0 auto",
                      }}
                      onError={(e) => {
                        console.error("Failed to load architecture image");
                        e.target.style.display = "none";
                        e.target.parentNode.innerHTML += '<p style="color: #ff0000; padding: 20px;">Failed to load architecture image</p>';
                      }}
                    />
                  </div>

                  <div
                    style={{
                      textAlign: "right",
                      fontSize: "11px",
                      opacity: 0.7,
                      marginTop: "5px",
                    }}
                  >
                    <small>System Architecture Diagram</small>
                  </div>
                </div>
              )}

              {/* LINKS & RESOURCES */}
              <div style={baseStyles.box}>
                <div
                  style={{
                    marginBottom: "12px",
                    paddingBottom: "8px",
                    borderBottom: `1px solid ${currentTheme.border}`,
                  }}
                >
                  <h2 style={{ margin: 0, fontSize: "18px" }}>
                    Links & Resources
                  </h2>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                    gap: "10px",
                  }}
                >
                  {selectedProject.github_url && (
                    <a
                      href={formatUrl(selectedProject.github_url, "https://github.com/")}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        padding: "10px",
                        textDecoration: "none",
                        border: `1px solid ${currentTheme.border}`,
                        textAlign: "center",
                        backgroundColor: theme === "light" ? "#f8f8f8" : "#222222",
                        color: currentTheme.text,
                        fontFamily: "inherit",
                      }}
                    >
                      <strong style={{ fontSize: "14px" }}>GitHub Repo</strong>
                      <span style={{ fontSize: "11px", opacity: 0.8 }}>
                        View Repository
                      </span>
                    </a>
                  )}

                  {selectedProject.ipynb_url && (
                    <a
                      href={selectedProject.ipynb_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        padding: "10px",
                        textDecoration: "none",
                        border: `1px solid ${currentTheme.border}`,
                        textAlign: "center",
                        backgroundColor: theme === "light" ? "#f8f8f8" : "#222222",
                        color: currentTheme.text,
                        fontFamily: "inherit",
                      }}
                    >
                      <strong style={{ fontSize: "14px" }}>Notebook</strong>
                      <span style={{ fontSize: "11px", opacity: 0.8 }}>
                        {selectedProject.ipynb_url.split("/").pop()}
                      </span>
                    </a>
                  )}

                  {formatExtraLinks(selectedProject.extra_links).map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        padding: "10px",
                        textDecoration: "none",
                        border: `1px solid ${currentTheme.border}`,
                        textAlign: "center",
                        backgroundColor: theme === "light" ? "#f8f8f8" : "#222222",
                        color: currentTheme.text,
                        fontFamily: "inherit",
                      }}
                    >
                      <strong style={{ fontSize: "14px" }}>{link.name}</strong>
                      <span style={{ fontSize: "11px", opacity: 0.8 }}>
                        External Link
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* API ENDPOINTS SECTION - ONLY SHOW WHEN DATA EXISTS */}
{selectedProject?.api_endpoint && 
  (() => {
    // Parse and validate API endpoints
    let apiEndpoints = [];
    try {
      if (typeof selectedProject.api_endpoint === 'string') {
        apiEndpoints = JSON.parse(selectedProject.api_endpoint);
      } else if (Array.isArray(selectedProject.api_endpoint)) {
        apiEndpoints = selectedProject.api_endpoint;
      }
    } catch (e) {
      console.error("Failed to parse API endpoints:", e);
      return null;
    }

    // Only render if we have valid endpoints
    if (!Array.isArray(apiEndpoints) || apiEndpoints.length === 0) {
      return null;
    }

    return (
      <div style={baseStyles.box}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
            paddingBottom: "8px",
            borderBottom: `1px solid ${currentTheme.border}`,
          }}
        >
          <h2 style={{ margin: 0, fontSize: "18px" }}>API Endpoints</h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {apiEndpoints.map((endpoint, index) => (
            <div
              key={index}
              style={{
                padding: "12px",
                border: `1px dashed ${currentTheme.border}`,
                backgroundColor: theme === "light" ? "#fafafa" : "#1a1a1a",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <code style={{ fontSize: "13px", fontWeight: "bold" }}>
                  {endpoint.method || 'GET'} {endpoint.path || '/api/endpoint'}
                </code>
                {endpoint.status && (
                  <span style={{ 
                    fontSize: "11px", 
                    padding: "2px 6px", 
                    backgroundColor: endpoint.status === 'active' ? '#28a745' : '#6c757d',
                    color: "#ffffff", 
                    borderRadius: "3px" 
                  }}>
                    {endpoint.status}
                  </span>
                )}
              </div>
              
              {endpoint.description && (
                <p style={{ fontSize: "13px", margin: "0 0 8px 0", opacity: 0.8 }}>
                  {endpoint.description}
                </p>
              )}
              
              {endpoint.example && (
                <pre style={{ fontSize: "12px", margin: 0, padding: "8px", backgroundColor: currentTheme.codeBg, border: `1px solid ${currentTheme.border}` }}>
                  {JSON.stringify(endpoint.example, null, 2)}
                </pre>
              )}
              
              {endpoint.url && (
                <div style={{ marginTop: "8px", textAlign: "right" }}>
                  <a
                    href={endpoint.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      ...baseStyles.button,
                      padding: "4px 8px",
                      fontSize: "11px",
                      textDecoration: "none",
                      display: "inline-block"
                    }}
                  >
                    Test Endpoint ↗
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {apiEndpoints.length > 0 && (
          <div
            style={{
              textAlign: "right",
              fontSize: "11px",
              opacity: 0.7,
              marginTop: "12px",
            }}
          >
            <small>API documentation available</small>
          </div>
        )}
      </div>
    );
  })()}

              {/* ANALYSIS REPORT */}
              <div style={baseStyles.box}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                    paddingBottom: "8px",
                    borderBottom: `1px solid ${currentTheme.border}`,
                  }}
                >
                  <h2 style={{ margin: 0, fontSize: "18px" }}>Analysis Report</h2>
                </div>

                {selectedProject.problem_statement && (
                  <div style={{ marginBottom: "15px" }}>
                    <h3 style={{ margin: "0 0 5px 0", fontSize: "16px" }}>
                      Problem Statement
                    </h3>
                    <div
                      style={{
                        padding: "8px",
                        border: `1px dashed ${currentTheme.border}`,
                        backgroundColor: theme === "light" ? "#fafafa" : "#1a1a1a",
                        fontSize: "14px",
                        lineHeight: "1.5",
                      }}
                    >
                      {selectedProject.problem_statement}
                    </div>
                  </div>
                )}

                {selectedProject.analysis_summary && (
                  <div style={{ marginBottom: "15px" }}>
                    <h3 style={{ margin: "0 0 5px 0", fontSize: "16px" }}>
                      Analysis Summary
                    </h3>
                    <div
                      style={{
                        padding: "8px",
                        border: `1px dashed ${currentTheme.border}`,
                        backgroundColor: theme === "light" ? "#fafafa" : "#1a1a1a",
                        fontSize: "14px",
                        lineHeight: "1.5",
                      }}
                    >
                      {selectedProject.analysis_summary}
                    </div>
                  </div>
                )}

                {selectedProject.accuracy_notes && (
                  <div style={{ marginBottom: "15px" }}>
                    <h3 style={{ margin: "0 0 5px 0", fontSize: "16px" }}>
                      Accuracy Assessment
                    </h3>
                    <div
                      style={{
                        padding: "8px",
                        border: `1px dashed ${currentTheme.border}`,
                        backgroundColor: theme === "light" ? "#fafafa" : "#1a1a1a",
                        fontSize: "14px",
                        lineHeight: "1.5",
                      }}
                    >
                      {selectedProject.accuracy_notes}
                    </div>
                  </div>
                )}

                {selectedProject.business_decisions && (
                  <div style={{ marginBottom: "15px" }}>
                    <h3 style={{ margin: "0 0 5px 0", fontSize: "16px" }}>
                      Business Decisions
                    </h3>
                    <div
                      style={{
                        padding: "8px",
                        border: `1px dashed ${currentTheme.border}`,
                        backgroundColor: theme === "light" ? "#fafafa" : "#1a1a1a",
                        fontSize: "14px",
                        lineHeight: "1.5",
                      }}
                    >
                      {selectedProject.business_decisions}
                    </div>
                  </div>
                )}
              </div>

              {/* NOTEBOOK PREVIEW */}
              {selectedProject.ipynb_url && (
                <div style={baseStyles.box}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                      paddingBottom: "8px",
                      borderBottom: `1px solid ${currentTheme.border}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <h2 style={{ margin: 0, fontSize: "18px" }}>
                        Notebook Preview
                      </h2>
                      <span
                        style={{
                          fontSize: "11px",
                          padding: "2px 6px",
                          border: `1px solid ${currentTheme.border}`,
                          backgroundColor:
                            theme === "light" ? "#f0f0f0" : "#333333",
                          fontFamily: "'Courier New', monospace",
                        }}
                      >
                        .ipynb
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => fetchNotebook(selectedProject.ipynb_url)}
                        style={{
                          padding: "6px 12px",
                          border: `1px solid ${currentTheme.border}`,
                          backgroundColor: "transparent",
                          color: currentTheme.text,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          fontSize: "12px",
                        }}
                      >
                        ↻ Reload
                      </button>

                      <a
                        href={selectedProject.ipynb_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: "6px 12px",
                          border: `1px solid ${currentTheme.border}`,
                          backgroundColor:
                            theme === "light" ? "#f0f0f0" : "#333333",
                          color: currentTheme.text,
                          textDecoration: "none",
                          fontFamily: "inherit",
                          fontSize: "12px",
                        }}
                      >
                        ↗ View Source
                      </a>
                    </div>
                  </div>

                  {notebookError && (
                    <div
                      style={{
                        padding: "15px",
                        marginBottom: "15px",
                        border: `1px solid ${
                          theme === "light" ? "#ffcccc" : "#ff4444"
                        }`,
                        backgroundColor: theme === "light" ? "#fff5f5" : "#2a0000",
                        color: theme === "light" ? "#cc0000" : "#ff8888",
                        fontSize: "14px",
                      }}
                    >
                      <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                        ⚠️ Error loading notebook
                      </div>
                      <div>{notebookError}</div>
                    </div>
                  )}

                  <div
                    style={{
                      border: `1px solid ${currentTheme.border}`,
                      backgroundColor: theme === "light" ? "#f9f9f9" : "#0a0a0a",
                      height: "600px",
                      overflowY: "auto",
                      padding: "12px",
                    }}
                  >
                    {notebookLoading ? (
                      <div style={{ opacity: 0.7 }}>Loading notebook...</div>
                    ) : notebookContent ? (
                      <NotebookViewer notebook={notebookContent} />
                    ) : (
                      <div style={{ opacity: 0.7 }}>No notebook loaded.</div>
                    )}
                  </div>

                  {notebookContent && !notebookLoading && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "8px",
                        fontSize: "12px",
                        opacity: 0.7,
                      }}
                    >
                      <span>Cells: {notebookContent.cells?.length || 0}</span>
                      <span>
                        Last loaded:{" "}
                        {new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : projects.length === 0 ? (
            <div style={baseStyles.box}>
              <h3 style={{ margin: 0, fontSize: "18px" }}>No Projects Found</h3>
              <p style={{ margin: "5px 0 0 0", fontSize: "14px" }}>
                The database is empty. Add some projects to get started.
              </p>
            </div>
          ) : null}
        </div>

        {/* SIDEBAR with Logo */}
        <div style={baseStyles.sidebar}>
          {/* Logo Section - NEW */}
          <div
            style={{
              padding: "20px 15px",
              borderBottom: `1px solid ${currentTheme.border}`,
              textAlign: "center",
              backgroundColor: currentTheme.boxBg,
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                margin: "0 auto 10px auto",
                borderRadius: "50%",
                border: `2px solid ${currentTheme.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: currentTheme.bg,
                overflow: "hidden",
              }}
            >
              {/* You can replace this with an actual image */}
              <img
                  src="/logo.png"
                  alt="Logo"
                  style={{ width: "80%", height: "80%", objectFit: "cover" }}
                />
            </div>
            <p style={{ margin: "5px 0 0 0", fontSize: "12px", opacity: 0.7 }}>
              Data Science Portfolio
            </p>
          </div>
          <div
            style={{
              padding: "10px 15px",
              borderBottom: `1px solid ${currentTheme.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "18px" }}>
              Projects ({projects.length})
            </h2>
            <button
              onClick={fetchProjects}
              style={{
                padding: "4px 8px",
                border: `1px solid ${currentTheme.border}`,
                backgroundColor: "transparent",
                color: currentTheme.text,
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "12px",
              }}
              title="Refresh"
            >
              ↻
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
            {loading ? (
              <div style={{ padding: "8px" }}>Loading...</div>
            ) : projects.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {projects.map((project, index) => (
                  <div
                    key={project.id}
                    onClick={() => handleProjectClick(project)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "8px",
                      border:
                        selectedProject?.id === project.id
                          ? `2px solid ${currentTheme.border}`
                          : `1px solid ${currentTheme.border}`,
                      backgroundColor:
                        selectedProject?.id === project.id
                          ? currentTheme.hoverBg
                          : "transparent",
                      cursor: "pointer",
                      gap: "8px",
                      fontWeight: selectedProject?.id === project.id ? "600" : "normal",
                      fontSize: "14px",
                    }}
                  >
                    <div style={{ fontWeight: "600", minWidth: "25px", fontSize: "13px" }}>
                      #{index + 1}
                    </div>

                    <div style={{ flex: 1 }}>
                      {project.title}
                      {project.ipynb_url && (
                        <div
                          style={{
                            fontSize: "10px",
                            opacity: 0.6,
                            marginTop: "2px",
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                          }}
                        >
                          <span>📓</span>
                          <span>Notebook Preview</span>
                        </div>
                      )}
                    </div>

                    <div style={{ fontSize: "11px", opacity: 0.7 }}>
                      {new Date(project.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: "15px", textAlign: "center", fontSize: "14px" }}>
                <p style={{ margin: 0 }}>No projects available</p>
              </div>
            )}
          </div>

          <div style={{ padding: "8px", borderTop: `1px solid ${currentTheme.border}` }}>
            <div style={{ fontSize: "11px" }}>
              {loading ? (
                <span style={{ color: theme === "light" ? "#ffa500" : "#ffaa00" }}>
                  Loading...
                </span>
              ) : error ? (
                <span style={{ color: theme === "light" ? "#ff0000" : "#ff4444" }}>
                  Error
                </span>
              ) : (
                <span style={{ color: "#0065c3" }}>
                  Loaded {projects.length} projects
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={baseStyles.footer}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            fontSize: "12px",
          }}
        >
          <div>
            <p style={{ margin: "0 0 3px 0" }}>Data Science Portfolio v1.0</p>
            <p style={{ margin: 0 }}>By Drona Bopche</p>
          </div>
          <div>
          <img
                  src="/logo.png"
                  alt="Logo"
                  style={{ width: "10%", height: "10%", objectFit: "cover" }}
                />
            </div>
          <div>
            <p style={{ margin: "0 0 3px 0" }}>
              © {new Date().getFullYear()} - All Rights Reserved
            </p>
            <p style={{ margin: 0 }}>Tech Used React + Supabase + GitHub Raw </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <p style={{ margin: 0 }}>Projects: {projects.length}</p>
            <button
              style={{ ...baseStyles.button, padding: "6px 12px", fontSize: "12px" }}
              onClick={toggleTheme}
              title="Toggle theme"
            >
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;