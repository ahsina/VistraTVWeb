"use client"
import { useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info } from "@/lib/icons"

interface ToastNotificationProps {
  id: string
  type: "success" | "error" | "info"
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

export function ToastNotification({ id, type, title, message, duration = 5000, onClose }: ToastNotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  }

  const colors = {
    success: "border-green-500/50 bg-green-500/10",
    error: "border-red-500/50 bg-red-500/10",
    info: "border-blue-500/50 bg-blue-500/10",
  }

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border ${colors[type]} backdrop-blur-sm shadow-lg animate-slide-in-right`}
    >
      {icons[type]}
      <div className="flex-1">
        <h4 className="text-white font-semibold">{title}</h4>
        {message && <p className="text-gray-300 text-sm mt-1">{message}</p>}
      </div>
      <button onClick={() => onClose(id)} className="text-gray-400 hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
