import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './GitSandbox.module.css';
import { initRepo, addCommit, createBranch, checkout, merge, rebase } from './gitEngine';

export default function GitSandbox({ theme, onClose, isStandalone = false }) {
  const navigate = useNavigate();
  const [repo, setRepo] = useState(() => initRepo());
  const [commitMsg, setCommitMsg] = useState('');
  const [branchName, setBranchName] = useState('');
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState([
    'Initialized empty Git repository.',
    'Created commits: c0, c1.',
    'On branch main.'
  ]);
  const terminalLogsRef = useRef(null);

  // Auto-scroll terminal logs to bottom
  useEffect(() => {
    if (terminalLogsRef.current) {
      terminalLogsRef.current.scrollTop = terminalLogsRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  const addLog = (cmd, output = '') => {
    setTerminalLogs(prev => [
      ...prev,
      `$ ${cmd}`,
      ...(output ? [output] : [])
    ]);
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const cmd = terminalInput.trim();
    if (!cmd) return;

    setTerminalInput('');

    // Parse command
    const parts = cmd.split(/\s+/);
    if (parts[0] !== 'git' && parts[0] !== 'clear') {
      addLog(cmd, `bash: command not found: ${parts[0]}. Try: git commit, git branch, git checkout, git merge, git rebase`);
      return;
    }

    if (parts[0] === 'clear') {
      setTerminalLogs([]);
      return;
    }

    const action = parts[1];
    if (!action) {
      addLog(cmd, 'usage: git <command> [<args>]');
      return;
    }

    if (action === 'commit') {
      const mIdx = parts.indexOf('-m');
      let msg = '';
      if (mIdx !== -1 && parts[mIdx + 1]) {
        msg = parts.slice(mIdx + 1).join(' ').replace(/['"]/g, '');
      }
      const actualMsg = msg || `Commit c${repo.commitCounter}`;
      setRepo(prev => addCommit(prev, actualMsg));
      addLog(cmd, `[${repo.currentBranch || 'detached HEAD'} c${repo.commitCounter}] ${actualMsg}`);
    } else if (action === 'branch') {
      const bName = parts[2];
      if (!bName) {
        addLog(cmd, `Active branches:\n${Object.keys(repo.branches).map(b => (b === repo.currentBranch ? `* ${b}` : `  ${b}`)).join('\n')}`);
        return;
      }
      if (repo.branches[bName]) {
        addLog(cmd, `fatal: A branch named '${bName}' already exists.`);
        return;
      }
      setRepo(prev => createBranch(prev, bName));
      addLog(cmd, `Created branch '${bName}'.`);
    } else if (action === 'checkout') {
      const target = parts[2];
      if (!target) {
        addLog(cmd, 'fatal: checkout requires a branch name or commit hash.');
        return;
      }
      if (!repo.branches[target] && !repo.commits[target]) {
        addLog(cmd, `error: pathspec '${target}' did not match any file(s) known to git.`);
        return;
      }
      setRepo(prev => checkout(prev, target));
      addLog(cmd, `Switched to ${repo.branches[target] ? `branch '${target}'` : `commit '${target}'`}`);
    } else if (action === 'merge') {
      const target = parts[2];
      if (!target) {
        addLog(cmd, 'fatal: merge requires a branch name.');
        return;
      }
      if (!repo.branches[target]) {
        addLog(cmd, `merge: ${target} - not something we can merge`);
        return;
      }
      if (target === repo.currentBranch) {
        addLog(cmd, 'Already up to date.');
        return;
      }
      setRepo(prev => merge(prev, target));
      addLog(cmd, `Merge made by the 'recursive' strategy.`);
    } else if (action === 'rebase') {
      const target = parts[2];
      if (!target) {
        addLog(cmd, 'fatal: rebase requires a branch name.');
        return;
      }
      if (!repo.branches[target]) {
        addLog(cmd, `fatal: invalid upstream '${target}'`);
        return;
      }
      if (target === repo.currentBranch) {
        addLog(cmd, `Current branch ${repo.currentBranch} is up to date.`);
        return;
      }
      setRepo(prev => rebase(prev, target));
      addLog(cmd, `Successfully rebased and updated refs/heads/${repo.currentBranch}.`);
    } else if (action === 'status') {
      const statusText = repo.currentBranch
        ? `On branch ${repo.currentBranch}\nYour branch is up to date.\n\nnothing to commit, working tree clean`
        : `HEAD detached at ${repo.head}\nnothing to commit, working tree clean`;
      addLog(cmd, statusText);
    } else if (action === 'reset' && parts[2] === '--hard') {
      resetAll();
    } else {
      addLog(cmd, `git: '${action}' is not a git command. Supported: commit, branch, checkout, merge, rebase, status, reset --hard`);
    }
  };

  const handleCommit = (e) => {
    e.preventDefault();
    const msg = commitMsg.trim() || `Commit c${repo.commitCounter}`;
    setRepo(prev => addCommit(prev, msg));
    addLog(`git commit -m "${msg}"`, `[${repo.currentBranch || 'detached HEAD'} c${repo.commitCounter}] ${msg}`);
    setCommitMsg('');
  };

  const handleBranch = (e) => {
    e.preventDefault();
    const name = branchName.trim();
    if (!name) return;
    if (repo.branches[name]) {
      addLog(`git branch ${name}`, `fatal: A branch named '${name}' already exists.`);
      return;
    }
    setRepo(prev => createBranch(prev, name));
    addLog(`git branch ${name}`, `Created branch '${name}' pointing to ${repo.branches[repo.currentBranch] || repo.head}.`);
    setBranchName('');
  };

  const handleCheckout = (target) => {
    setRepo(prev => checkout(prev, target));
    addLog(`git checkout ${target}`, `Switched to ${repo.branches[target] ? `branch '${target}'` : `commit '${target}'`}`);
  };

  const handleMerge = (target) => {
    if (target === repo.currentBranch) return;
    setRepo(prev => merge(prev, target));
    addLog(`git merge ${target}`, `Merge made by the 'recursive' strategy.`);
  };

  const handleRebase = (target) => {
    if (target === repo.currentBranch) return;
    setRepo(prev => rebase(prev, target));
    addLog(`git rebase ${target}`, `Successfully rebased and updated refs/heads/${repo.currentBranch}.`);
  };

  const resetAll = () => {
    setRepo(initRepo());
    setTerminalLogs([
      'Reset repository.',
      'Initialized empty Git repository.',
      'Created commits: c0, c1.',
      'On branch main.'
    ]);
  };

  const textColor = theme === 'light' ? 'var(--text)' : 'var(--cream)';

  // Calculate arrow definitions or connection lines between commits
  const renderLinks = () => {
    const links = [];
    Object.values(repo.commits).forEach(commit => {
      commit.parents.forEach(parentId => {
        const parent = repo.commits[parentId];
        if (parent) {
          links.push(
            <line
              key={`${parentId}->${commit.id}`}
              x1={parent.x}
              y1={parent.y}
              x2={commit.x}
              y2={commit.y}
              className={`${styles.linkLine} ${commit.isMerge ? styles.linkLineMerge : ''}`}
            />
          );
        }
      });
    });
    return links;
  };

  // Find tags associated with each commit
  const getTagsForCommit = (hash) => {
    const tags = [];
    Object.entries(repo.branches).forEach(([branch, commitHash]) => {
      if (commitHash === hash) {
        tags.push(branch);
      }
    });
    if (repo.head === hash || repo.branches[repo.head] === hash) {
      tags.push('HEAD');
    }
    return tags;
  };

  return (
    <div className={isStandalone ? styles.standaloneContainer : styles.overlay}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Git Branching Sandbox</h1>
          <p>Visualize commit graphs, branch pointers, merge nodes, and rebases interactively</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.clearBtn} onClick={resetAll}>
            Reset Playground
          </button>
          {isStandalone && (
            <button
              onClick={() => navigate('/')}
              style={{
                background: theme === 'light' ? 'rgba(253, 252, 247, 0.6)' : 'rgba(12, 8, 6, 0.6)',
                border: '1px solid var(--border2)',
                color: 'var(--muted)',
                padding: '10px 24px',
                borderRadius: '2px',
                fontFamily: "'Cinzel', serif",
                fontSize: '0.75rem',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                backdropFilter: 'blur(4px)',
                transition: 'all 0.3s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'var(--gold-dim)'
                e.target.style.color = textColor
                e.target.style.boxShadow = '0 0 15px rgba(192, 133, 14, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'var(--border2)'
                e.target.style.color = 'var(--muted)'
                e.target.style.boxShadow = 'none'
              }}
            >
              ◀ Back to Home
            </button>
          )}
          {!isStandalone && (
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className={styles.contentBody}>
        <div className={styles.sidebar}>
          <div className={styles.sectionTitle}>Git Commands</div>
          
          <div className={styles.commandList}>
            {/* Commit Form */}
            <form onSubmit={handleCommit} className={styles.cmdGroup}>
              <label>Make a new commit</label>
              <div className={styles.inputRow}>
                <input
                  type="text"
                  placeholder="Commit message..."
                  value={commitMsg}
                  onChange={(e) => setCommitMsg(e.target.value)}
                  className={styles.textInput}
                />
                <button type="submit" className={styles.btnPrimary}>Commit</button>
              </div>
            </form>

            {/* Branch Form */}
            <form onSubmit={handleBranch} className={styles.cmdGroup}>
              <label>Create new branch</label>
              <div className={styles.inputRow}>
                <input
                  type="text"
                  placeholder="Branch name..."
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  className={styles.textInput}
                />
                <button type="submit" className={styles.btnPrimary}>Branch</button>
              </div>
            </form>

            {/* Checkout Selector */}
            <div className={styles.cmdGroup}>
              <label>Checkout / Switch refs</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {Object.keys(repo.branches).map(b => (
                  <button
                    key={b}
                    onClick={() => handleCheckout(b)}
                    className={styles.actionBtn}
                    style={{
                      borderColor: repo.currentBranch === b ? 'var(--gold-dim)' : 'var(--border2)',
                      background: repo.currentBranch === b ? 'rgba(192, 133, 14, 0.1)' : ''
                    }}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Actions */}
            <div className={styles.cmdGroup} style={{ marginTop: '0.5rem' }}>
              <label>Advanced Operations</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {Object.keys(repo.branches).map(b => (
                  b !== repo.currentBranch && (
                    <div key={b} style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleMerge(b)}
                        className={styles.actionBtn}
                        style={{ flex: 1, fontSize: '0.75rem' }}
                      >
                        Merge {b}
                      </button>
                      <button
                        onClick={() => handleRebase(b)}
                        className={styles.actionBtn}
                        style={{ flex: 1, fontSize: '0.75rem', borderColor: 'rgba(168, 85, 247, 0.3)' }}
                      >
                        Rebase {b}
                      </button>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.workspace}>
          {/* Interactive DAG Commit Graph */}
          <div className={styles.graphContainer}>
            <svg className={styles.graphSvg}>
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255, 255, 255, 0.3)" />
                </marker>
              </defs>
              
              {renderLinks()}

              {/* Commit Nodes */}
              {Object.values(repo.commits).map(commit => {
                const tags = getTagsForCommit(commit.id);
                const isSelected = repo.head === commit.id || repo.branches[repo.head] === commit.id;

                return (
                  <g
                    key={commit.id}
                    className={styles.commitNode}
                    onClick={() => handleCheckout(commit.id)}
                  >
                    <circle
                      cx={commit.x}
                      cy={commit.y}
                      r="16"
                      className={`${styles.commitCircle} ${isSelected ? styles.commitCircleActive : ''}`}
                    />
                    <text x={commit.x} y={commit.y + 4} textAnchor="middle" className={styles.nodeText}>
                      {commit.id}
                    </text>
                    <text x={commit.x} y={commit.y + 30} textAnchor="middle" className={styles.msgText}>
                      {commit.message}
                    </text>

                    {/* Branch Labels */}
                    {tags.map((tag, idx) => (
                      <g key={tag} transform={`translate(${commit.x - 30}, ${commit.y - 36 - idx * 18})`}>
                        <rect
                          width="60"
                          height="14"
                          rx="3"
                          fill={tag === 'HEAD' ? '#de9b87' : tag === 'main' ? 'var(--gold-dim)' : 'rgba(192, 133, 14, 0.45)'}
                        />
                        <text x="30" y="10" textAnchor="middle" className={styles.branchTag}>
                          {tag}
                        </text>
                      </g>
                    ))}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Interactive Shell Terminal output */}
          <div className={styles.terminalContainer}>
            <div className={styles.terminalHeader}>
              <div className={styles.terminalDot} style={{ background: '#ef4444' }} />
              <div className={styles.terminalDot} style={{ background: '#f59e0b' }} />
              <div className={styles.terminalDot} style={{ background: '#10b981' }} />
              <span style={{ marginLeft: '1rem' }}>git-terminal-visualizer</span>
            </div>
             <div className={styles.terminalLogs} ref={terminalLogsRef}>
              {terminalLogs.map((log, index) => {
                const getLogStyle = (text) => {
                  if (text.startsWith('fatal:') || text.startsWith('error:') || text.startsWith('bash:') || text.startsWith('git:')) {
                    return { color: '#f87171', whiteSpace: 'pre-wrap' };
                  }
                  if (text.startsWith('Switched to') || text.startsWith('Created branch') || text.startsWith('Initialized') || text.startsWith('Successfully') || text.startsWith('Merge made')) {
                    return { color: '#34d399', whiteSpace: 'pre-wrap' };
                  }
                  return { color: '#e3e4e8', whiteSpace: 'pre-wrap' };
                };

                return (
                  <div key={index} className={styles.terminalLine}>
                    {log.startsWith('$') ? (
                      <>
                        <span className={styles.prompt}>drona@portfolio %</span>
                        <span className={styles.infoLine}>{log.slice(2)}</span>
                      </>
                    ) : (
                      <span style={getLogStyle(log)}>{log}</span>
                    )}
                  </div>
                );
              })}
              
              <form onSubmit={handleTerminalSubmit} className={styles.terminalLine} style={{ marginTop: '0.25rem' }}>
                <span className={styles.prompt}>drona@portfolio %</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--cream)',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    outline: 'none',
                    flexGrow: 1,
                    caretColor: 'var(--gold)'
                  }}
                  placeholder="Type git command... (e.g. git commit -m 'feat', git checkout main)"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
