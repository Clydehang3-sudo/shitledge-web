const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

async function parseError(response) {
  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    try {
      const data = await response.json()
      return data.message || `Request failed with ${response.status}`
    } catch {
      return `Request failed with ${response.status}`
    }
  }

  try {
    const text = await response.text()
    return text || `Request failed with ${response.status}`
  } catch {
    return `Request failed with ${response.status}`
  }
}

async function readJson(response) {
  if (!response.ok) {
    throw new Error(await parseError(response))
  }
  return response.json()
}

export async function fetchHealth() {
  const response = await fetch(`${API_BASE}/api/health`)
  if (!response.ok) {
    throw new Error('Backend unavailable')
  }
  return response.text()
}

export async function fetchArticles({ query = '', page = 0, size = 6, sort = 'latest' } = {}) {
  const params = new URLSearchParams({
    query,
    page: String(page),
    size: String(size),
    sort
  })

  const response = await fetch(`${API_BASE}/api/articles?${params.toString()}`)
  return readJson(response)
}

export async function fetchArticleDetail(id) {
  const response = await fetch(`${API_BASE}/api/articles/${id}`)
  if (response.status === 404) {
    return null
  }
  return readJson(response)
}

export async function submitArticle(payload) {
  const response = await fetch(`${API_BASE}/api/articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  return readJson(response)
}
