/**
 * Axios instance pre-configured for the NoonDalton API.
 *
 * Features:
 *  - Base URL from VITE_API_URL env var
 *  - Automatically attaches Keycloak Bearer token on every request
 *  - Auto-refreshes the token if it's within 30 seconds of expiry
 *  - Shows toast on 500+ errors
 */
import axios from 'axios'
import toast from 'react-hot-toast'
import keycloak from '@/keycloak'
import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
})

// ── Request interceptor — attach token ────────────────────────────────────────
api.interceptors.request.use(async (config) => {
  if (keycloak.authenticated) {
    try {
      // Refresh token if it expires within 30 seconds
      await keycloak.updateToken(30)
    } catch {
      keycloak.login()
      return Promise.reject(new Error('Session expired — redirecting to login.'))
    }
    config.headers.Authorization = `Bearer ${keycloak.token}`
  timeout: 30000,
})

const ACCESS_TOKEN_KEY = 'marketgen_access_token'
const REFRESH_TOKEN_KEY = 'marketgen_refresh_token'

export const authTokenStore = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens: ({ accessToken, refreshToken }) => {
    if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}

api.interceptors.request.use((config) => {
  const token = authTokenStore.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response interceptor — handle errors globally ─────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status  = error.response?.status
    const detail  = error.response?.data?.detail

    if (status === 401) {
      keycloak.login()
      return Promise.reject(error)
    }

    if (status === 403) {
      toast.error('No tienes permisos para realizar esta acción.')
      return Promise.reject(error)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status
    const originalRequest = error.config

    if (status === 401 && originalRequest && !originalRequest._retry) {
      const refreshToken = authTokenStore.getRefreshToken()
      if (refreshToken) {
        originalRequest._retry = true
        try {
          const { data } = await axios.post(
            `${api.defaults.baseURL}/auth/refresh`,
            { refresh_token: refreshToken },
          )
          authTokenStore.setTokens(data)
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
          return api(originalRequest)
        } catch {
          authTokenStore.clear()
        }
      }
    }

    if (status === 403) {
      toast.error('No tienes permisos para realizar esta accion.')
    }

    if (status >= 500) {
      toast.error('Error del servidor. Por favor intenta nuevamente.')
    }

    return Promise.reject(error)
  }
  },
)

export default api

// ── Typed API helpers ─────────────────────────────────────────────────────────

// Books
export const booksApi = {
  list:    (params)      => api.get('/books', { params }),
  create:  (data)        => api.post('/books', data),
  get:     (id)          => api.get(`/books/${id}`),
  getBook: (id)          => api.get(`/books/${id}`),          // alias used in BookWorkflow
  update:  (id, data)    => api.put(`/books/${id}`, data),
  updateBook: (id, data) => api.put(`/books/${id}`, data),    // alias
  createBook: (data)     => api.post('/books', data),         // alias
  delete:  (id)          => api.delete(`/books/${id}`),
  getChapters: (id)      => api.get(`/books/${id}/chapters`),

  generateChapters: (id, data) => api.post(`/books/${id}/chapters/generate`, data),
  addChapter:       (id, data) => api.post(`/books/${id}/chapters`, data),
  updateChapter:    (id, cid, data) => api.put(`/books/${id}/chapters/${cid}`, data),
  reorderChapters:  (id, data) => api.put(`/books/${id}/chapters/reorder`, data),
  deleteChapter:    (id, cid) => api.delete(`/books/${id}/chapters/${cid}`),

  generateAllContent:    (id, data) => api.post(`/books/${id}/content/generate`, data),
  generateChapterContent:(id, cid, data) => api.post(`/books/${id}/chapters/${cid}/content/generate`, data),
  refineContent:         (id, cid, data) => api.post(`/books/${id}/chapters/${cid}/content/refine`, data),
  saveContent:           (id, cid, data) => api.put(`/books/${id}/chapters/${cid}/content`, data),
}

// Jobs
export const authApi = {
  register: async (data) => {
    const response = await api.post('/auth/register', data)
    authTokenStore.setTokens(response.data)
    return response
  },
  login: async (data) => {
    const response = await api.post('/auth/login', data)
    authTokenStore.setTokens(response.data)
    return response
  },
  logout: async () => {
    const refreshToken = authTokenStore.getRefreshToken()
    try {
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken })
      }
    } finally {
      authTokenStore.clear()
    }
  },
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
}

export const booksApi = {
  list: (params) => api.get('/books', { params }),
  create: (data) => api.post('/books', data),
  get: (id) => api.get(`/books/${id}`),
  getBook: (id) => api.get(`/books/${id}`),
  update: (id, data) => api.put(`/books/${id}`, data),
  updateBook: (id, data) => api.put(`/books/${id}`, data),
  createBook: (data) => api.post('/books', data),
  delete: (id) => api.delete(`/books/${id}`),
  getChapters: (id) => api.get(`/books/${id}/chapters`),
  generateChapters: (id, data) => api.post(`/books/${id}/chapters/generate`, data),
  addChapter: (id, data) => api.post(`/books/${id}/chapters`, data),
  updateChapter: (id, cid, data) => api.put(`/books/${id}/chapters/${cid}`, data),
  reorderChapters: (id, data) => api.put(`/books/${id}/chapters/reorder`, data),
  deleteChapter: (id, cid) => api.delete(`/books/${id}/chapters/${cid}`),
  generateAllContent: (id, data) => api.post(`/books/${id}/content/generate`, data),
  generateChapterContent: (id, cid, data) => api.post(`/books/${id}/chapters/${cid}/content/generate`, data),
  refineContent: (id, cid, data) => api.post(`/books/${id}/chapters/${cid}/content/refine`, data),
  saveContent: (id, cid, data) => api.put(`/books/${id}/chapters/${cid}/content`, data),
}

export const jobsApi = {
  get: (id) => api.get(`/jobs/${id}`),
}

// Proposals
export const proposalsApi = {
  list:     (params)       => api.get('/proposals', { params }),
  create:   (data)         => api.post('/proposals', data),
  get:      (id)           => api.get(`/proposals/${id}`),
  update:   (id, data)     => api.put(`/proposals/${id}`, data),
  delete:   (id)           => api.delete(`/proposals/${id}`),
  generate: (id, data)     => api.post(`/proposals/${id}/generate`, data),
  export:   (id, fmt)      => api.post(`/proposals/${id}/export`, { format: fmt }, { responseType: 'blob' }),
}

// Customers
export const customersApi = {
  list:   (params)     => api.get('/customers', { params }),
  create: (data)       => api.post('/customers', data),
  get:    (id)         => api.get(`/customers/${id}`),
  update: (id, data)   => api.put(`/customers/${id}`, data),
  delete: (id)         => api.delete(`/customers/${id}`),
  import: (file)       => {
export const proposalsApi = {
  list: (params) => api.get('/proposals', { params }),
  create: (data) => api.post('/proposals', data),
  get: (id) => api.get(`/proposals/${id}`),
  update: (id, data) => api.put(`/proposals/${id}`, data),
  delete: (id) => api.delete(`/proposals/${id}`),
  generate: (id, data) => api.post(`/proposals/${id}/generate`, data),
  export: (id, fmt) => api.post(`/proposals/${id}/export`, { format: fmt }, { responseType: 'blob' }),
}

export const customersApi = {
  list: (params) => api.get('/customers', { params }),
  create: (data) => api.post('/customers', data),
  get: (id) => api.get(`/customers/${id}`),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
  import: (file) => {
    const fd = new FormData()
    fd.append('file', file)
    return api.post('/customers/import', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
}

// Templates
export const templatesApi = {
  list:   (params)   => api.get('/templates', { params }),
  create: (data)     => api.post('/templates', data),
  get:    (id)       => api.get(`/templates/${id}`),
  update: (id, data) => api.put(`/templates/${id}`, data),
  delete: (id)       => api.delete(`/templates/${id}`),
}

// Assets
export const assetsApi = {
  list:                (params)         => api.get('/assets', { params }),
  get:                 (id)             => api.get(`/assets/${id}`),
  delete:              (id)             => api.delete(`/assets/${id}`),
  generateOnePager:    (bookId, data)   => api.post(`/books/${bookId}/assets/one-pager`, data),
  generateWhitepaper:  (bookId, data)   => api.post(`/books/${bookId}/assets/whitepaper`, data),
  generateSocialPosts: (bookId, data)   => api.post(`/books/${bookId}/assets/social-posts`, data),
  generateInfographic: (bookId, data)   => api.post(`/books/${bookId}/assets/infographic`, data),
  download:            (id)             => api.get(`/assets/${id}/download`, { responseType: 'blob' }),
}

// Settings
export const settingsApi = {
  get:    ()     => api.get('/settings'),
  update: (data) => api.put('/settings', data),
}

// Reports
export const reportsApi = {
  overview: (params) => api.get('/reports/overview', { params }),
  books:    (params) => api.get('/reports/books', { params }),
  export:   (params) => api.get('/reports/export', { params, responseType: 'blob' }),
}

// AI Chat
export const chatApi = {
  send:    (data)       => api.post('/chat', data),
  history: (sessionId)  => api.get(`/chat/${sessionId}`),
}

// Content analysis
export const analysisApi = {
  seo:         (data) => api.post('/analysis/seo', data),
  plagiarism:  (data) => api.post('/analysis/plagiarism', data),
  aiDetection: (data) => api.post('/analysis/ai-detection', data),
}

// Publishing
export const publishingApi = {
  publish:   (bookId, data) => api.post(`/books/${bookId}/publish`, data),
export const templatesApi = {
  list: (params) => api.get('/templates', { params }),
  create: (data) => api.post('/templates', data),
  get: (id) => api.get(`/templates/${id}`),
  update: (id, data) => api.put(`/templates/${id}`, data),
  delete: (id) => api.delete(`/templates/${id}`),
}

export const assetsApi = {
  list: (params) => api.get('/assets', { params }),
  get: (id) => api.get(`/assets/${id}`),
  delete: (id) => api.delete(`/assets/${id}`),
  generateOnePager: (bookId, data) => api.post(`/books/${bookId}/assets/one-pager`, data),
  generateWhitepaper: (bookId, data) => api.post(`/books/${bookId}/assets/whitepaper`, data),
  generateSocialPosts: (bookId, data) => api.post(`/books/${bookId}/assets/social-posts`, data),
  generateInfographic: (bookId, data) => api.post(`/books/${bookId}/assets/infographic`, data),
  download: (id) => api.get(`/assets/${id}/download`, { responseType: 'blob' }),
}

export const settingsApi = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
}

export const reportsApi = {
  overview: (params) => api.get('/reports/overview', { params }),
  books: (params) => api.get('/reports/books', { params }),
  export: (params) => api.get('/reports/export', { params, responseType: 'blob' }),
}

export const chatApi = {
  send: (data) => api.post('/chat', data),
  history: (sessionId) => api.get(`/chat/${sessionId}`),
}

export const analysisApi = {
  seo: (data) => api.post('/analysis/seo', data),
  plagiarism: (data) => api.post('/analysis/plagiarism', data),
  aiDetection: (data) => api.post('/analysis/ai-detection', data),
}

export const publishingApi = {
  publish: (bookId, data) => api.post(`/books/${bookId}/publish`, data),
  translate: (bookId, data) => api.post(`/books/${bookId}/translate`, data),
}
