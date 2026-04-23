// AI Resume Scoring Engine
// Uses OpenAI API for intelligent candidate scoring

const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY

export async function scoreCandidate(jobDescription, candidateData) {
  // Build candidate summary from form data
  const candidateSummary = buildCandidateSummary(candidateData)

  const prompt = `You are an expert HR professional and technical recruiter. Analyze this candidate against the job description and provide a detailed evaluation.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE INFORMATION:
${candidateSummary}

Respond ONLY with a JSON object (no markdown, no backticks):
{
  "score": <integer 0-100>,
  "category": "<Highly Relevant | Medium | Not Relevant>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "gaps": ["<gap 1>", "<gap 2>"],
  "summary": "<2-3 sentence professional assessment>",
  "recommendation": "<Shortlist | Review | Reject>"
}`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_OPENAI_API_KEY || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    if (!response.ok) throw new Error('AI API error')

    const data = await response.json()
    const text = data.content?.[0]?.text || ''
    const clean = text.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch (err) {
    // Fallback: keyword-based scoring
    console.warn('AI scoring failed, falling back to keyword scoring:', err)
    return keywordScore(jobDescription, candidateData)
  }
}

function buildCandidateSummary(data) {
  const lines = []
  if (data.name) lines.push(`Name: ${data.name}`)
  if (data.email) lines.push(`Email: ${data.email}`)
  if (data.phone) lines.push(`Phone: ${data.phone}`)
  if (data.github) lines.push(`GitHub: ${data.github}`)
  if (data.linkedin) lines.push(`LinkedIn: ${data.linkedin}`)
  if (data.portfolio) lines.push(`Portfolio/Kaggle: ${data.portfolio}`)
  if (data.resume_text) lines.push(`Resume Content:\n${data.resume_text.slice(0, 2000)}`)
  // Add any custom fields
  const knownFields = ['name','email','phone','github','linkedin','portfolio','resume_url','resume_text','job_id','submitted_at','id']
  Object.entries(data).forEach(([k, v]) => {
    if (!knownFields.includes(k) && v) lines.push(`${k}: ${v}`)
  })
  return lines.join('\n')
}

// Fallback keyword scoring when AI is unavailable
function keywordScore(jobDescription, candidateData) {
  const jdWords = extractKeywords(jobDescription.toLowerCase())
  const candidateText = buildCandidateSummary(candidateData).toLowerCase()
  const candidateWords = extractKeywords(candidateText)

  const matchCount = jdWords.filter(w => candidateWords.includes(w)).length
  const score = Math.min(100, Math.round((matchCount / Math.max(jdWords.length, 1)) * 150))

  let category = 'Not Relevant'
  let recommendation = 'Reject'
  if (score >= 65) { category = 'Highly Relevant'; recommendation = 'Shortlist' }
  else if (score >= 35) { category = 'Medium'; recommendation = 'Review' }

  return {
    score,
    category,
    strengths: ['Keyword analysis completed'],
    gaps: ['Full AI analysis unavailable'],
    summary: `Keyword matching score: ${score}/100. ${category} match based on job description alignment.`,
    recommendation
  }
}

function extractKeywords(text) {
  const stopWords = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','this','that','these','those','i','we','you','he','she','they','it'])
  return text
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopWords.has(w))
}

export async function batchScoreCandidates(jobDescription, candidates, onProgress) {
  const results = []
  for (let i = 0; i < candidates.length; i++) {
    const result = await scoreCandidate(jobDescription, candidates[i])
    results.push({ ...candidates[i], ai_result: result })
    onProgress?.(i + 1, candidates.length)
    // Rate limit: wait 500ms between calls
    if (i < candidates.length - 1) await new Promise(r => setTimeout(r, 500))
  }
  return results.sort((a, b) => (b.ai_result?.score || 0) - (a.ai_result?.score || 0))
}
