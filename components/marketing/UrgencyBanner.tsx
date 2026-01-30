"use client"

import { useEffect, useState } from "react"
import { AlertCircle, Clock, TrendingUp } from "lucide-react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { CountdownTimer } from "./CountdownTimer"
import { createClient } from "@/lib/supabase/client"

export function UrgencyBanner() {
  const { language } = useLanguage()
  const [banner, setBanner] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchBanner()
  }, [language])

  const fetchBanner = async () => {
    const currentLanguage = language || "fr"
    const { data } = await supabase
      .from("urgency_banners")
      .select("*")
      .eq("language", currentLanguage)
      .eq("is_active", true)
      .gte("end_date", new Date().toISOString())
      .order("display_order")
      .limit(1)
      .maybeSingle()

    if (data) setBanner(data)
  }

  if (!banner) return null

  return (
    <div className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 py-4 sm:py-6 md:py-8">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white animate-pulse" />
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white text-center">{banner.title}</h3>
          </div>

          <p className="text-white text-center text-sm sm:text-base md:text-lg max-w-2xl px-4">{banner.message}</p>

          <CountdownTimer endDate={new Date(banner.end_date)} />

          {banner.spots_remaining && (
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-white text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{banner.spots_remaining} spots remaining</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Offer ends soon</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
