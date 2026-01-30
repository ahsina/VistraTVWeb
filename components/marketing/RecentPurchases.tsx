"use client"

import { useEffect, useState } from "react"
import { CheckCircle, MapPin } from "lucide-react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { createClient } from "@/lib/supabase/client"

export function RecentPurchases() {
  const { language } = useLanguage()
  const [purchases, setPurchases] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [hasCookieConsent, setHasCookieConsent] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchPurchases()
    const consent = localStorage.getItem("cookie-consent")
    setHasCookieConsent(!consent)
  }, [language])

  useEffect(() => {
    if (purchases.length === 0) return

    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % purchases.length)
        setIsVisible(true)
      }, 500)
    }, 8000)

    return () => clearInterval(interval)
  }, [purchases])

  const fetchPurchases = async () => {
    const currentLanguage = language || "fr"
    const { data } = await supabase
      .from("recent_purchases")
      .select("*")
      .eq("language", currentLanguage)
      .eq("is_active", true)
      .order("display_order")

    if (data && data.length > 0) setPurchases(data)
  }

  if (purchases.length === 0) return null

  const purchase = purchases[currentIndex]

  return (
    <div
      className={`fixed ${hasCookieConsent ? "bottom-24 sm:bottom-24" : "bottom-6 sm:bottom-6"} right-3 sm:right-6 z-50 bg-gray-900/95 backdrop-blur-sm border border-green-500/30 rounded-lg p-3 sm:p-4 shadow-xl max-w-[280px] sm:max-w-sm transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold mb-1 text-sm sm:text-base truncate">{purchase.name}</p>
          <p className="text-cyan-400 text-xs sm:text-sm mb-2">{purchase.plan_name} Plan</p>
          <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-400">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{purchase.location}</span>
            <span>•</span>
            <span className="whitespace-nowrap">{purchase.time_ago}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
