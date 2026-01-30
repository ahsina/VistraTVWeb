"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "@/lib/icons"

export function StickyCtaBar() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 500px
      setIsVisible(window.scrollY > 500 && !isDismissed)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isDismissed])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-[#0a0d2c] via-[#1a1d3c] to-[#0a0d2c] border-t border-white/10 backdrop-blur-xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-slideInUp">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <p className="text-white font-bold text-base sm:text-lg">
              🎉 Offre limitée: <span className="text-[#00d4ff]">Essai gratuit 48h</span> sans CB
            </p>
            <p className="text-white/60 text-xs sm:text-sm">Plus de 74,000 clients satisfaits</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => (window.location.href = "/subscriptions")}
              className="bg-gradient-to-r from-[#00d4ff] via-[#e94b87] to-[#ff6b35] hover:opacity-90 transition-all text-white font-bold px-6 sm:px-8 py-3 rounded-lg shadow-lg shadow-[#00d4ff]/30"
            >
              Profiter maintenant
            </Button>

            <button
              onClick={() => setIsDismissed(true)}
              className="p-2 text-white/40 hover:text-white transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
