import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

const getBackendUrl = (): string => {
  const raw =
    typeof window !== 'undefined'
      ? (import.meta as any).env?.VITE_BACKEND_URL || ''
      : process.env.BACKEND_URL || ''
  // Drop any trailing slash so requests never become "https://host//api/...".
  return raw.replace(/\/+$/, '')
}

const createApiClient = (): AxiosInstance => {
  const backendUrl = getBackendUrl()

  const client = axios.create({
    baseURL: backendUrl || (import.meta.env.DEV ? 'http://localhost:8000' : ''),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
          window.location.href = '/app/login'
        }
      }
      return Promise.reject(error)
    }
  )

  return client
}

const apiClient = createApiClient()

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/api/v1/auth/login', { email, password }),
  register: (data: { email: string; password: string; full_name: string }) =>
    apiClient.post('/api/v1/auth/register', data),
  me: () => apiClient.get('/api/v1/auth/me'),
}

export const organizationApi = {
  get: () => apiClient.get('/api/v1/organizations/me'),
  update: (data: any) => apiClient.put('/api/v1/organizations/me', data),
  getStats: () => apiClient.get('/api/v1/organizations/me/stats'),
}

export const controlsApi = {
  list: (params?: any) => apiClient.get('/api/v1/controls', { params }),
  get: (id: number) => apiClient.get(`/api/v1/controls/${id}`),
  create: (data: any) => apiClient.post('/api/v1/controls', data),
  update: (id: number, data: any) => apiClient.put(`/api/v1/controls/${id}`, data),
  delete: (id: number) => apiClient.delete(`/api/v1/controls/${id}`),
  seed: () => apiClient.post('/api/v1/controls/seed'),
  getFrameworks: () => apiClient.get('/api/v1/controls/frameworks'),
}

export const policiesApi = {
  list: (params?: any) => apiClient.get('/api/v1/policies', { params }),
  get: (id: number) => apiClient.get(`/api/v1/policies/${id}`),
  create: (data: any) => apiClient.post('/api/v1/policies', data),
  update: (id: number, data: any) => apiClient.put(`/api/v1/policies/${id}`, data),
  delete: (id: number) => apiClient.delete(`/api/v1/policies/${id}`),
  generate: (data: { policy_type: string; company_name?: string; framework_id?: number }) =>
    apiClient.post('/api/v1/policies/generate', data),
  approve: (id: number) => apiClient.post(`/api/v1/policies/${id}/approve`),
}

export const evidenceApi = {
  list: (params?: any) => apiClient.get('/api/v1/evidence', { params }),
  get: (id: number) => apiClient.get(`/api/v1/evidence/${id}`),
  getForControl: (controlId: number) => apiClient.get(`/api/v1/evidence/control/${controlId}`),
  upload: (data: FormData) => apiClient.post('/api/v1/evidence/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: number, data: any) => apiClient.put(`/api/v1/evidence/${id}`, data),
  updateStatus: (id: number, status: string) =>
    apiClient.put(`/api/v1/evidence/${id}/status`, null, { params: { status } }),
  delete: (id: number) => apiClient.delete(`/api/v1/evidence/${id}`),
  linkControl: (evidenceId: number, controlId: number) =>
    apiClient.post(`/api/v1/evidence/${evidenceId}/link-control/${controlId}`),
  unlinkControl: (evidenceId: number, controlId: number) =>
    apiClient.delete(`/api/v1/evidence/${evidenceId}/link-control/${controlId}`),
}

export const tasksApi = {
  list: (params?: any) => apiClient.get('/api/v1/tasks', { params }),
  get: (id: number) => apiClient.get(`/api/v1/tasks/${id}`),
  create: (data: any) => apiClient.post('/api/v1/tasks', data),
  update: (id: number, data: any) => apiClient.put(`/api/v1/tasks/${id}`, data),
  delete: (id: number) => apiClient.delete(`/api/v1/tasks/${id}`),
  complete: (id: number) => apiClient.post(`/api/v1/tasks/${id}/complete`),
}

export const auditsApi = {
  list: () => apiClient.get('/api/v1/audits'),
  get: (id: number) => apiClient.get(`/api/v1/audits/${id}`),
  export: (data: { framework_id: number; export_type?: string }) =>
    apiClient.post('/api/v1/audits/export', data),
  download: (id: number) => apiClient.get(`/api/v1/audits/${id}/download`, { responseType: 'blob' }),
  delete: (id: number) => apiClient.delete(`/api/v1/audits/${id}`),
}