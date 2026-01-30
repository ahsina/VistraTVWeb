// API client utility for making requests to the backend

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE" | "PUT"
  body?: unknown
  headers?: Record<string, string>
  timeout?: number
}

export class ApiClient {
  private baseUrl: string
  private defaultTimeout: number

  constructor(baseUrl = "/api", timeout = 30000) {
    this.baseUrl = baseUrl
    this.defaultTimeout = timeout
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body, headers = {}, timeout = this.defaultTimeout } = options

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const config: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        signal: controller.signal,
      }

      if (body) {
        config.body = JSON.stringify(body)
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, config)

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ApiError(
          response.status,
          errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          errorData,
        )
      }

      return response.json()
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof ApiError) {
        throw error
      }

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new ApiError(408, "Request timeout")
        }
        throw new ApiError(0, error.message)
      }

      throw new ApiError(0, "Unknown error occurred")
    }
  }

  async get<T = any>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" })
  }

  async post<T = any>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "POST", body })
  }

  async put<T = any>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "PUT", body })
  }

  async patch<T = any>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "PATCH", body })
  }

  async delete<T = any>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" })
  }

  // Subscriptions
  async getSubscriptions(userId?: string) {
    const query = userId ? `?userId=${userId}` : ""
    return this.request(`/subscriptions${query}`)
  }

  async createSubscription(data: { userId: string; plan: string; price: number }) {
    return this.request("/subscriptions", { method: "POST", body: data })
  }

  async updateSubscription(id: string, data: Partial<{ plan: string; status: string }>) {
    return this.request(`/subscriptions/${id}`, { method: "PATCH", body: data })
  }

  async cancelSubscription(id: string) {
    return this.request(`/subscriptions/${id}`, { method: "DELETE" })
  }

  // Users
  async getUsers(filters?: { status?: string; subscription?: string }) {
    const params = new URLSearchParams(filters as Record<string, string>)
    const query = params.toString() ? `?${params.toString()}` : ""
    return this.request(`/users${query}`)
  }

  async createUser(data: { email: string; name: string; subscription?: string }) {
    return this.request("/users", { method: "POST", body: data })
  }

  // Channels
  async getChannels(filters?: { category?: string; country?: string; quality?: string }) {
    const params = new URLSearchParams(filters as Record<string, string>)
    const query = params.toString() ? `?${params.toString()}` : ""
    return this.request(`/channels${query}`)
  }

  async createChannel(data: { name: string; category: string; country: string; quality?: string }) {
    return this.request("/channels", { method: "POST", body: data })
  }

  // Analytics
  async getAnalytics(period = "30d") {
    return this.request(`/analytics?period=${period}`)
  }
}

// Export a singleton instance
export const apiClient = new ApiClient()
