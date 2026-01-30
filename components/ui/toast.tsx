"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { X } from "@/lib/icons"

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info" | "warning"
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, type: Toast["type"], duration?: number) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: Toast["type"], duration = 5000) => {
    const id = Math.random().toString(36).substring(7)
    setToasts((prev) => [...prev, { id, message, type, duration }])

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              min-w-[300px] rounded-lg p-4 shadow-lg backdrop-blur-sm
              animate-in slide-in-from-right duration-300
              ${toast.type === "success" ? "bg-green-500/90 text-white" : ""}
              ${toast.type === "error" ? "bg-red-500/90 text-white" : ""}
              ${toast.type === "info" ? "bg-blue-500/90 text-white" : ""}
              ${toast.type === "warning" ? "bg-orange-500/90 text-white" : ""}
            `}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 rounded-full p-1 hover:bg-white/20 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}
