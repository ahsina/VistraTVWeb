"use client"

import { useEffect, useState } from "react"
import { Eye, TrendingUp } from "lucide-react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { createClient } from "@/lib/supabase/client"

export function LiveViewers() {
  const { language } = useLanguage()
  const [config, setConfig] = useState<any>(null)
  const [viewers, setViewers] = useState(1247)
  const [hasCookieConsent, setHasCookieConsent] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchConfig()
    const consent = localStorage.getItem("cookie-consent")
    setHasCookieConsent(!consent)
  }, [language])

  useEffect(() => {
    if (!config) return

    const interval = setInterval(() => {
      setViewers((prev) => {
        const change = Math.floor(Math.random() * 10) - 4
        return Math.max(config.min_viewers, Math.min(config.max_viewers, prev + change))
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [config])

  const fetchConfig = async () => {
    const currentLanguage = language || "fr"
    const { data } = await supabase
      .from("live_viewers_config")
      .select("*")
      .eq("language", currentLanguage)
      .eq("is_active", true)
      .maybeSingle()

    if (data) {
      setConfig(data)
      setViewers(Math.floor((data.min_viewers + data.max_viewers) / 2))
    }
  }

  if (!config) return null

  return (
    <div
      className={`fixed ${hasCookieConsent ? "bottom-20 sm:bottom-24" : "bottom-4 sm:bottom-6"} left-3 sm:left-6 z-50 bg-gray-900/95 backdrop-blur-sm border border-cyan-500/30 rounded-lg px-3 py-2 sm:px-4 sm:py-3 shadow-xl transition-all duration-300`}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative">
          <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
          <span className="absolute -top-1 -right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-white font-semibold text-sm sm:text-base">{viewers.toLocaleString()}</span>
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
          </div>
          <p className="text-[10px] sm:text-xs text-gray-400">{config.label}</p>
        </div>
      </div>
    </div>
  )
}
