import React from 'react';
import { Link } from 'react-router-dom';

const SvgIcon = ({ path, className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d={path} />
  </svg>
);

const SectionHeading = ({ children, id }) => (
  <h2 id={id} className="text-3xl font-bold tracking-tight mb-8 pb-4 border-b border-gray-200 dark:border-gray-800 text-black dark:text-white uppercase font-mono">
    {children}
  </h2>
);

const FeatureCard = ({ title, children, iconPath }) => (
  <div className="boxy-card p-8 bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 hover:border-purple-500/50 transition-colors h-full flex flex-col">
    {iconPath && (
      <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-6 text-purple-600 dark:text-purple-400">
        <SvgIcon path={iconPath} />
      </div>
    )}
    <h3 className="font-bold text-xl mb-4 text-black dark:text-white">{title}</h3>
    <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed space-y-2 flex-grow">
      {children}
    </div>
  </div>
);

const CodeBlock = ({ code, language }) => (
  <div className="boxy-card bg-[#0b0b0f] border border-gray-800 my-6 overflow-hidden">
    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-black/50">
      <span className="text-xs font-mono text-gray-500 uppercase">{language}</span>
    </div>
    <div className="p-4 overflow-x-auto">
      <pre className="text-sm font-mono text-gray-300 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  </div>
);

const List = ({ items, checkmark = false }) => (
  <ul className="space-y-2 mt-4">
    {items.map((item, idx) => (
      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
        {checkmark ? (
          <span className="text-purple-500 mt-0.5">
            <SvgIcon path="M5 13l4 4L19 7" className="w-4 h-4" />
          </span>
        ) : (
          <span className="w-1.5 h-1.5 mt-1.5 bg-gray-400 dark:bg-gray-600 inline-block flex-shrink-0" />
        )}
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const VistaSecureAI = () => {
  return (
    <div className="pv-docs-page pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-12 group">
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </Link>

        {/* Hero Section */}
        <div className="mb-24 relative pv-grid-dots p-8 md:p-16 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/20 boxy-card">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-8">
            AI Security Middleware
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none mb-6">
            Vista Secure <span className="text-purple-600">AI</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-light mb-8 max-w-3xl">
            Enterprise-Grade AI Security Middleware.
          </p>
          <div className="text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-4xl space-y-6">
            <p>
              Vista Secure AI is a next-generation AI security middleware designed to protect Large Language Model (LLM) applications from prompt injection attacks, sensitive data leaks, jailbreak attempts, malicious instructions, and hidden vulnerabilities inside prompt-driven systems.
            </p>
            <p>
              As organizations increasingly rely on LLMs for automation, copilots, customer support, and autonomous agents, the attack surface expands dramatically. Vista Secure AI acts as an intelligent security gateway between users and AI systems — inspecting, sanitizing, validating, and enforcing security policies before prompts ever reach the model.
            </p>
          </div>
          <div className="mt-12 flex flex-wrap gap-4">
            <div className="boxy-badge px-4 py-2 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-sm font-mono uppercase">CLI Tooling</div>
            <div className="boxy-badge px-4 py-2 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-sm font-mono uppercase">API Middleware</div>
            <div className="boxy-badge px-4 py-2 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-sm font-mono uppercase">Rust SDK</div>
            <div className="boxy-badge px-4 py-2 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-sm font-mono uppercase">Python SDK</div>
          </div>
        </div>

        {/* Core Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="boxy-card p-8 border border-red-500/20 bg-red-50/50 dark:bg-red-900/10">
            <h3 className="text-xl font-bold mb-4 font-mono uppercase text-red-600 dark:text-red-400">Protect AI applications from</h3>
            <List items={[
              "Prompt injection",
              "Jailbreak attempts",
              "Data exfiltration",
              "Hidden system prompt extraction",
              "Credential leakage",
              "Tool abuse",
              "Malicious agent instructions",
              "Context poisoning",
              "Sensitive information exposure",
              "Unsafe function execution",
              "Agent memory manipulation"
            ]} />
          </div>
          <div className="boxy-card p-8 border border-green-500/20 bg-green-50/50 dark:bg-green-900/10">
            <h3 className="text-xl font-bold mb-4 font-mono uppercase text-green-600 dark:text-green-400">While maintaining</h3>
            <List items={[
              "Low latency",
              "Developer simplicity",
              "Production scalability",
              "Cross-model compatibility"
            ]} checkmark />
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-24">
          <SectionHeading id="key-features">Key Features</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <FeatureCard title="Prompt Injection Detection" iconPath="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z">
              <p>Advanced semantic analysis identifies malicious intent even when attacks are obfuscated.</p>
              <List items={[
                "Direct injections",
                "Indirect injections",
                "Multi-step manipulative prompts",
                "Hidden instruction chaining",
                "Embedded malicious context",
                "Role override attempts",
                "Tool manipulation attacks"
              ]} />
            </FeatureCard>

            <FeatureCard title="Sensitive Data Leak Prevention" iconPath="M12 11V7a4 4 0 00-8 0v4 M5 11h14v10H5z">
              <p>Supports customizable redaction policies and enterprise compliance rules to prevent leakage of:</p>
              <List items={[
                "API keys",
                "Internal system prompts",
                "Database credentials",
                "Tokens",
                "PII",
                "Customer data",
                "Business secrets",
                "Internal documents"
              ]} />
            </FeatureCard>

            <FeatureCard title="Real-Time Middleware Protection" iconPath="M4 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V5z M4 11a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z">
              <p>Prompts are scanned and validated before execution. Works as a middleware layer between:</p>
              <List items={[
                "User to LLM",
                "Agent to Tool",
                "API to AI Model",
                "Multi-agent systems",
                "RAG pipelines"
              ]} />
            </FeatureCard>

            <FeatureCard title="AI Threat Intelligence Engine" iconPath="M12 22a10 10 0 100-20 10 10 0 000 20z M12 16a4 4 0 100-8 4 4 0 000 8z M12 12v.01">
              <p>Uses AI-powered semantic threat detection to identify adversarial prompts, context hijacking, social engineering patterns, model manipulation techniques, and emerging jailbreak strategies.</p>
              <p className="mt-4">Continuously updated threat signatures improve detection over time.</p>
            </FeatureCard>
          </div>

          <div className="boxy-card p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40">
            <h3 className="font-bold text-xl mb-4 text-black dark:text-white">Prompt Risk Scoring</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Every prompt receives a threat score, risk category, severity level, attack classification, confidence score, and recommended mitigation.</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <CodeBlock language="json" code={`{
  "risk_score": 92,
  "threat": "Prompt Injection",
  "severity": "Critical",
  "action": "Blocked"
}`} />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                  <span className="font-mono text-sm uppercase">Threat Score</span>
                  <span className="font-bold text-red-500">92/100</span>
                </div>
                <div className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                  <span className="font-mono text-sm uppercase">Severity</span>
                  <span className="font-bold text-orange-500">Critical</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SDK Support & CLI */}
        <div className="mb-24">
          <SectionHeading id="integration">Integration & Tooling</SectionHeading>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="boxy-card p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 flex items-center justify-center bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                  <span className="font-bold font-mono">RS</span>
                </div>
                <h3 className="font-bold text-xl">Rust SDK</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Built for high-performance systems, AI gateways, enterprise backends, edge AI deployments, and low-latency inference pipelines.</p>
              <List items={[
                "Async support",
                "Middleware hooks",
                "Streaming validation",
                "Memory-safe architecture",
                "Ultra-fast scanning engine"
              ]} />
              <CodeBlock language="rust" code={`use vista_secure_ai::Scanner;

let scanner = Scanner::new("API_KEY");

let result = scanner.scan(prompt).await?;

if result.blocked {
    println!("Threat detected!");
}`} />
            </div>

            <div className="boxy-card p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <span className="font-bold font-mono">PY</span>
                </div>
                <h3 className="font-bold text-xl">Python SDK</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Perfect for LangChain, FastAPI, Flask, AI agents, RAG systems, and LLM orchestration pipelines.</p>
              <div className="h-6"></div>
              <List items={[
                "Native Pythonic API",
                "Seamless framework integration",
                "Sync and Async support",
                "Pydantic schema validation"
              ]} />
              <CodeBlock language="python" code={`from vista_secure_ai import Scanner

scanner = Scanner(api_key="YOUR_API_KEY")

result = scanner.scan(prompt)

if result.blocked:
    print("Blocked malicious prompt")`} />
            </div>
          </div>

          <div className="boxy-card p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-500/20">
                <SvgIcon path="M4 17l6-6-6-6m12 12h-6" className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-xl">CLI Tooling</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Powerful developer-first CLI for local security testing.</p>
                <List items={[
                  "Prompt scanning",
                  "Batch analysis",
                  "CI/CD integration",
                  "Pipeline enforcement",
                  "JSON export",
                  "Threat reports",
                  "Compliance checks"
                ]} />
              </div>
              <div>
                <CodeBlock language="bash" code={`$ vista scan prompt.txt

Threat Detected: Prompt Injection
Risk Score: 94
Action: Blocked`} />
              </div>
            </div>
          </div>
        </div>

        {/* Enterprise Security Features */}
        <div className="mb-24">
          <SectionHeading id="enterprise">Enterprise Security Features</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard title="Policy Engine" iconPath="M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z">
              <p>Create custom AI security policies.</p>
              <CodeBlock language="yaml" code={`block:
  - jailbreak
  - system_prompt_extraction
  - pii_leak

allow:
  - safe_queries`} />
            </FeatureCard>
            
            <div className="space-y-8">
              <div className="boxy-card p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40">
                <h4 className="font-bold mb-2">Audit Logging</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Track prompt history, threat attempts, attack patterns, user activity, and security decisions. Useful for compliance and enterprise governance.</p>
              </div>
              
              <div className="boxy-card p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40">
                <h4 className="font-bold mb-2">Role-Based Access Control (RBAC)</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Manage access across teams, organizations, API consumers, and AI environments.</p>
              </div>
              
              <div className="boxy-card p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40">
                <h4 className="font-bold mb-2">Multi-Model Compatibility</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Compatible with OpenAI, Anthropic, Gemini, Mistral, Ollama, Local LLMs, and Custom AI stacks.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases & Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <div>
            <SectionHeading id="use-cases">Use Cases</SectionHeading>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-1">AI Chatbots</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Protect customer-facing AI assistants from jailbreaks and prompt attacks.</p>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-1">AI Agents</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Prevent autonomous agents from executing manipulated instructions.</p>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-1">RAG Systems</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Detect malicious retrieved context and poisoned documents.</p>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-1">Enterprise AI Platforms</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Secure internal copilots and confidential workflows.</p>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-1">AI APIs</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Deploy secure AI endpoints with real-time prompt filtering.</p>
              </div>
            </div>
          </div>

          <div>
            <SectionHeading id="architecture">Architecture</SectionHeading>
            <div className="boxy-card bg-[#0b0b0f] border border-gray-800 p-8 h-[calc(100%-5rem)] flex items-center justify-center">
              <pre className="text-sm font-mono text-purple-400 leading-loose text-center">
{`User Request
     ↓
Vista Secure AI Middleware
     ↓
Threat Detection Engine
     ↓
Policy Enforcement
     ↓
Sanitized Prompt
     ↓
LLM / Agent System`}
              </pre>
            </div>
          </div>
        </div>

        {/* Product Stack Table */}
        <div className="mb-24">
          <SectionHeading id="tech-stack">Suggested Product Stack</SectionHeading>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-gray-200 dark:border-gray-800 pv-docs-table">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                  <th className="p-4 font-mono uppercase text-sm font-bold text-gray-900 dark:text-gray-100">Component</th>
                  <th className="p-4 font-mono uppercase text-sm font-bold text-gray-900 dark:text-gray-100">Technology</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300 text-sm">
                <tr className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="p-4 font-medium">Core Engine</td>
                  <td className="p-4 font-mono text-purple-600 dark:text-purple-400">Rust</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="p-4 font-medium">API Layer</td>
                  <td className="p-4 font-mono text-purple-600 dark:text-purple-400">FastAPI / Axum</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="p-4 font-medium">SDKs</td>
                  <td className="p-4 font-mono text-purple-600 dark:text-purple-400">Rust + Python</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="p-4 font-medium">Detection Engine</td>
                  <td className="p-4 font-mono text-purple-600 dark:text-purple-400">Hybrid ML + Rules</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="p-4 font-medium">Deployment</td>
                  <td className="p-4 font-mono text-purple-600 dark:text-purple-400">Docker + Kubernetes</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="p-4 font-medium">Observability</td>
                  <td className="p-4 font-mono text-purple-600 dark:text-purple-400">OpenTelemetry</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="p-4 font-medium">Auth</td>
                  <td className="p-4 font-mono text-purple-600 dark:text-purple-400">JWT / API Keys</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="p-4 font-medium">Streaming</td>
                  <td className="p-4 font-mono text-purple-600 dark:text-purple-400">WebSockets / SSE</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info (Why, Positioning, Roadmap) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="boxy-card p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 col-span-1 lg:col-span-2">
            <h3 className="font-bold text-2xl mb-6 font-mono uppercase border-b border-gray-200 dark:border-gray-800 pb-4">Why Vista Secure AI?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-2">Built for Production</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Designed for scale, reliability, speed, and enterprise deployment.</p>
              </div>
              <div>
                <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-2">Developer Friendly</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Easy integration via REST APIs, SDKs, CLI tools, and middleware adapters.</p>
              </div>
              <div>
                <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-2">Security First</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Purpose-built specifically for securing AI systems and prompt-based architectures.</p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
              <p className="text-lg md:text-xl font-light italic text-gray-700 dark:text-gray-300">
                <span className="font-bold font-mono not-italic text-purple-600 dark:text-purple-400 uppercase text-sm block mb-2">Positioning Statement</span>
                "Vista Secure AI is the security infrastructure layer for the AI era — helping organizations deploy LLM-powered applications safely, securely, and confidently."
              </p>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-mono uppercase border border-gray-200 dark:border-gray-700">Secure Every Prompt</span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-mono uppercase border border-gray-200 dark:border-gray-700">AI Security Starts Here</span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-mono uppercase border border-gray-200 dark:border-gray-700">The Firewall for AI Systems</span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-mono uppercase border border-gray-200 dark:border-gray-700">Your AI's First Line of Defense</span>
            </div>
          </div>

          <div className="boxy-card p-8 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 col-span-1">
            <h3 className="font-bold text-xl mb-6 font-mono uppercase border-b border-gray-200 dark:border-gray-700 pb-4">Future Roadmap</h3>
            <List items={[
              "Browser extension protection",
              "Agent sandboxing",
              "AI runtime firewall",
              "MCP security gateway",
              "Multi-agent policy orchestration",
              "AI compliance automation",
              "SOC integration",
              "Threat intelligence dashboard",
              "Real-time attack visualization",
              "Secure AI gateway proxy"
            ]} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default VistaSecureAI;
