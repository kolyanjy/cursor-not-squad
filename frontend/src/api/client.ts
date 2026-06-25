const API_BASE = '/api'

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`)

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}

export interface HealthResponse {
  status: string
  message: string
}

export function fetchHealth(): Promise<HealthResponse> {
  return request<HealthResponse>('/health')
}
