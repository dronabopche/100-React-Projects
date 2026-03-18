// ─── services/github.js ──────────────────────────────────────────────────────
// 🔧 Replace with your actual GitHub username
const USERNAME = 'dronabopche'

const getHeaders = () => {
  const headers = { 'Accept': 'application/vnd.github.v3+json' }
  const token = import.meta.env.VITE_GITHUB_TOKEN
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

export async function fetchRepos() {
  const res = await fetch(
    `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=30&type=public`,
    { headers: getHeaders() }
  )
  if (!res.ok) throw new Error(`GitHub API error ${res.status}: Check your username in services/github.js`)
  const repos = await res.json()
  return repos
    .filter(r => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
}

export async function fetchProfile() {
  const res = await fetch(
    `https://api.github.com/users/${USERNAME}`,
    { headers: getHeaders() }
  )
  if (!res.ok) throw new Error(`GitHub API error ${res.status}`)
  return res.json()
}
