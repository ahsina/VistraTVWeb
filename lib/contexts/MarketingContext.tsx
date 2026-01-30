"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { MarketingConfig } from "@/lib/types/marketing"
import { defaultMarketingConfig } from "@/lib/types/marketing"

interface MarketingContextType {
  config: MarketingConfig
  updateConfig: (config: MarketingConfig) => Promise<void>
  loading: boolean
}

const MarketingContext = createContext<MarketingContextType | undefined>(undefined)

export function MarketingProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<MarketingConfig>(defaultMarketingConfig)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch("/api/admin/marketing")
      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      }
    } catch (error) {
      console.error("Failed to fetch marketing config:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateConfig = async (newConfig: MarketingConfig) => {
    try {
      const response = await fetch("/api/admin/marketing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newConfig),
      })

      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      }
    } catch (error) {
      console.error("Failed to update marketing config:", error)
      throw error
    }
  }

  return <MarketingContext.Provider value={{ config, updateConfig, loading }}>{children}</MarketingContext.Provider>
}

export function useMarketing() {
  const context = useContext(MarketingContext)
  if (context === undefined) {
    throw new Error("useMarketing must be used within MarketingProvider")
  }
  return context
}
