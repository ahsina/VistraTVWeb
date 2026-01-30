"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setShowBanner(false)
  }

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "declined")
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-[#0a0d2c]/95 backdrop-blur-lg border-t border-white/10">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-white text-sm">
              {t.cookieConsent?.message ||
                "Nous utilisons des cookies pour améliorer votre expérience. En continuant, vous acceptez notre utilisation des cookies."}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={declineCookies}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              {t.cookieConsent?.decline || "Refuser"}
            </Button>
            <Button onClick={acceptCookies} className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87] hover:opacity-90">
              {t.cookieConsent?.accept || "Accepter"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
