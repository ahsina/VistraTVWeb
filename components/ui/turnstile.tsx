"use client"

import { useEffect, useRef, useState } from "react"

interface TurnstileProps {
  siteKey: string
  onVerify: (token: string) => void
  onError?: () => void
  onExpire?: () => void
  theme?: "light" | "dark" | "auto"
  size?: "normal" | "compact"
  className?: string
}

declare global {
  interface Window {
    turnstile: {
      render: (container: HTMLElement, options: TurnstileOptions) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
    onloadTurnstileCallback?: () => void
  }
}

interface TurnstileOptions {
  sitekey: string
  callback: (token: string) => void
  "error-callback"?: () => void
  "expired-callback"?: () => void
  theme?: "light" | "dark" | "auto"
  size?: "normal" | "compact"
}

export function Turnstile({
  siteKey,
  onVerify,
  onError,
  onExpire,
  theme = "dark",
  size = "normal",
  className = "",
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load Turnstile script if not already loaded
    if (!document.getElementById("turnstile-script")) {
      const script = document.createElement("script")
      script.id = "turnstile-script"
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback"
      script.async = true
      script.defer = true
      
      window.onloadTurnstileCallback = () => {
        setIsLoaded(true)
      }
      
      document.head.appendChild(script)
    } else if (window.turnstile) {
      setIsLoaded(true)
    }

    return () => {
      // Cleanup widget on unmount
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch (e) {
          // Widget may already be removed
        }
      }
    }
  }, [])

  useEffect(() => {
    if (isLoaded && containerRef.current && window.turnstile && !widgetIdRef.current) {
      try {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: onVerify,
          "error-callback": onError,
          "expired-callback": onExpire,
          theme,
          size,
        })
      } catch (e) {
        console.error("[Turnstile] Error rendering widget:", e)
      }
    }
  }, [isLoaded, siteKey, onVerify, onError, onExpire, theme, size])

  return (
    <div 
      ref={containerRef} 
      className={`turnstile-container ${className}`}
      data-testid="turnstile"
    />
  )
}

// Hook for using Turnstile
export function useTurnstile() {
  const [token, setToken] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState(false)

  const handleVerify = (newToken: string) => {
    setToken(newToken)
    setIsVerified(true)
    setError(false)
  }

  const handleError = () => {
    setToken(null)
    setIsVerified(false)
    setError(true)
  }

  const handleExpire = () => {
    setToken(null)
    setIsVerified(false)
  }

  const reset = () => {
    setToken(null)
    setIsVerified(false)
    setError(false)
  }

  return {
    token,
    isVerified,
    error,
    handleVerify,
    handleError,
    handleExpire,
    reset,
  }
}
