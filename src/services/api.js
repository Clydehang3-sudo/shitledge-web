const API_BASE = (() => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL
  }

  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:8081'
    }
  }

  return 'https://shitledge-server.onrender.com'
})()

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

export async function fetchQuestions({ query = '', page = 0, size = 12, sort = 'latest' } = {}) {
  const params = new URLSearchParams({
    query,
    page: String(page),
    size: String(size),
    sort
  })

  const response = await fetch(`${API_BASE}/api/questions?${params.toString()}`)
  return readJson(response)
}

export async function fetchQuestionDetail(id) {
  const response = await fetch(`${API_BASE}/api/questions/${id}`)
  if (response.status === 404) {
    return null
  }
  return readJson(response)
}

export async function createQuestion(payload) {
  const response = await fetch(`${API_BASE}/api/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  return readJson(response)
}

export async function fetchAnswers(questionId) {
  const response = await fetch(`${API_BASE}/api/questions/${questionId}/answers`)
  if (response.status === 404) {
    return []
  }
  return readJson(response)
}

export async function createAnswer(questionId, payload) {
  const response = await fetch(`${API_BASE}/api/questions/${questionId}/answers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  return readJson(response)
}

export async function fetchExplore() {
  const response = await fetch(`${API_BASE}/api/explore`)
  return readJson(response)
}

export async function fetchTags() {
  const response = await fetch(`${API_BASE}/api/tags`)
  return readJson(response)
}
