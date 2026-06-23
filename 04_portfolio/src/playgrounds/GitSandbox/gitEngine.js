// Git simulation engine to manage the commit graph DAG (Directed Acyclic Graph)

export function initRepo() {
  return {
    commits: {
      'c0': { id: 'c0', message: 'Initial commit', parents: [], x: 100, y: 150 },
      'c1': { id: 'c1', message: 'Add basic layout', parents: ['c0'], x: 220, y: 150 }
    },
    branches: {
      'main': 'c1'
    },
    currentBranch: 'main',
    head: 'main', // 'main' means checked out to main. A hash means detached HEAD.
    commitCounter: 2
  };
}

export function addCommit(repo, message) {
  const currentHash = repo.branches[repo.currentBranch] || repo.head;
  const newId = `c${repo.commitCounter}`;
  
  // Determine layout coordinates
  let parentCommit = repo.commits[currentHash];
  let x = 100;
  let y = 150;
  
  if (parentCommit) {
    x = parentCommit.x + 120;
    y = parentCommit.y;
    // If not main, offset y slightly to show branching visual structure
    if (repo.currentBranch !== 'main') {
      y = parentCommit.y + 100;
    }
  }

  const newCommit = {
    id: newId,
    message: message || `Commit ${newId}`,
    parents: currentHash ? [currentHash] : [],
    x,
    y
  };

  const updatedCommits = { ...repo.commits, [newId]: newCommit };
  const updatedBranches = { ...repo.branches };
  let updatedHead = repo.head;

  if (repo.branches[repo.currentBranch]) {
    updatedBranches[repo.currentBranch] = newId;
    updatedHead = repo.currentBranch;
  } else {
    // Detached head mode
    updatedHead = newId;
  }

  return {
    ...repo,
    commits: updatedCommits,
    branches: updatedBranches,
    head: updatedHead,
    commitCounter: repo.commitCounter + 1
  };
}

export function createBranch(repo, name) {
  if (!name || repo.branches[name]) return repo; // Branch already exists or invalid
  const targetHash = repo.branches[repo.currentBranch] || repo.head;
  
  return {
    ...repo,
    branches: {
      ...repo.branches,
      [name]: targetHash
    }
  };
}

export function checkout(repo, target) {
  if (repo.branches[target]) {
    return {
      ...repo,
      currentBranch: target,
      head: target
    };
  }
  
  if (repo.commits[target]) {
    return {
      ...repo,
      currentBranch: '', // Detached HEAD
      head: target
    };
  }

  return repo;
}

export function merge(repo, branchName) {
  const sourceHash = repo.branches[branchName];
  const targetHash = repo.branches[repo.currentBranch] || repo.head;

  if (!sourceHash || !targetHash || sourceHash === targetHash) return repo;

  const newId = `c${repo.commitCounter}`;
  const parent1 = repo.commits[targetHash];
  const parent2 = repo.commits[sourceHash];

  // Merge commit coordinate: midpoint or forward
  const x = Math.max(parent1.x, parent2.x) + 120;
  const y = parent1.y; // Keep current branch's baseline

  const newCommit = {
    id: newId,
    message: `Merge branch '${branchName}' into ${repo.currentBranch || 'HEAD'}`,
    parents: [targetHash, sourceHash],
    x,
    y,
    isMerge: true
  };

  const updatedCommits = { ...repo.commits, [newId]: newCommit };
  const updatedBranches = { ...repo.branches };
  let updatedHead = repo.head;

  if (repo.currentBranch) {
    updatedBranches[repo.currentBranch] = newId;
    updatedHead = repo.currentBranch;
  } else {
    updatedHead = newId;
  }

  return {
    ...repo,
    commits: updatedCommits,
    branches: updatedBranches,
    head: updatedHead,
    commitCounter: repo.commitCounter + 1
  };
}

export function rebase(repo, branchName) {
  // Simple rebase: Find common ancestor, copy current branch commits on top of target branch
  const targetHash = repo.branches[branchName];
  const currentBranchHash = repo.branches[repo.currentBranch];
  if (!targetHash || !currentBranchHash || targetHash === currentBranchHash) return repo;

  // Let's find path to root for both
  const getPathToRoot = (hash) => {
    const path = [];
    let cur = hash;
    while (cur) {
      path.push(cur);
      const commit = repo.commits[cur];
      cur = commit && commit.parents.length > 0 ? commit.parents[0] : null;
    }
    return path;
  };

  const currentPath = getPathToRoot(currentBranchHash);
  const targetPath = getPathToRoot(targetHash);

  // Find common ancestor
  let ancestor = null;
  for (const node of currentPath) {
    if (targetPath.includes(node)) {
      ancestor = node;
      break;
    }
  }

  if (!ancestor) return repo;

  // Commits to rebase (from ancestor excluded to current branch tip)
  const toRebase = [];
  let cur = currentBranchHash;
  while (cur && cur !== ancestor) {
    toRebase.unshift(cur);
    const commit = repo.commits[cur];
    cur = commit && commit.parents.length > 0 ? commit.parents[0] : null;
  }

  if (toRebase.length === 0) return repo;

  let newParentHash = targetHash;
  let nextCounter = repo.commitCounter;
  const updatedCommits = { ...repo.commits };

  for (const origHash of toRebase) {
    const origCommit = repo.commits[origHash];
    const newId = `c${nextCounter}`;
    nextCounter++;

    const parentCommit = updatedCommits[newParentHash];
    const x = parentCommit.x + 120;
    const y = parentCommit.y; // Align on the rebased target baseline

    updatedCommits[newId] = {
      id: newId,
      message: `${origCommit.message} (rebased)`,
      parents: [newParentHash],
      x,
      y
    };

    newParentHash = newId;
  }

  const updatedBranches = {
    ...repo.branches,
    [repo.currentBranch]: newParentHash
  };

  return {
    ...repo,
    commits: updatedCommits,
    branches: updatedBranches,
    head: repo.currentBranch,
    commitCounter: nextCounter
  };
}
