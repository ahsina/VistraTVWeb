import { STORAGE_KEYS } from "./constants"

export interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
  subscription?: {
    plan: string
    status: string
    expiresAt: string
  }
}

export const auth = {
  setToken: (token: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.authToken, token)
    }
  },

  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEYS.authToken)
    }
    return null
  },

  removeToken: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.authToken)
    }
  },

  setUser: (user: User): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user))
    }
  },

  getUser: (): User | null => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem(STORAGE_KEYS.user)
      if (userStr) {
        try {
          return JSON.parse(userStr)
        } catch {
          return null
        }
      }
    }
    return null
  },

  removeUser: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.user)
    }
  },

  isAuthenticated: (): boolean => {
    return !!auth.getToken()
  },

  isAdmin: (): boolean => {
    const user = auth.getUser()
    return user?.role === "admin"
  },

  logout: (): void => {
    auth.removeToken()
    auth.removeUser()
  },

  getAuthHeaders: (): Record<string, string> => {
    const token = auth.getToken()
    if (token) {
      return {
        Authorization: `Bearer ${token}`,
      }
    }
    return {}
  },
}
