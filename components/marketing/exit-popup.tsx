"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "@/lib/icons"
import Link from "next/link"

interface ExitPopup {
  id: string
  event_name: string
  title: string
  description: string
  cta_text: string
  cta_link: string
  discount_code: string | null
  discount_percentage: number | null
  image_url: string | null
  show_countdown: boolean
  background_color: string
  text_color: string
  end_date: string
}

export function ExitPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [popup, setPopup] = useState<ExitPopup | null>(null)
  const [hasShown, setHasShown] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState("")
  const { language } = useLanguage()
  const supabase = createClient()

  useEffect(() => {
    fetchActivePopup()
  }, [language])

  useEffect(() => {
    if (!hasShown && popup) {
      const handleMouseLeave = (e: MouseEvent) => {
        // Detect if mouse is leaving from the top of the page
        if (e.clientY <= 0) {
          setIsOpen(true)
          setHasShown(true)
          // Store in session to not show again during this session
          sessionStorage.setItem("exitPopupShown", "true")
        }
      }

      // Check if already shown in this session
      const alreadyShown = sessionStorage.getItem("exitPopupShown")
      if (!alreadyShown) {
        document.addEventListener("mouseleave", handleMouseLeave)
        return () => document.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [hasShown, popup])

  useEffect(() => {
    if (popup?.show_countdown && popup.end_date) {
      const interval = setInterval(() => {
        const now = new Date().getTime()
        const end = new Date(popup.end_date).getTime()
        const distance = end - now

        if (distance < 0) {
          setTimeRemaining("Expired")
          clearInterval(interval)
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24))
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((distance % (1000 * 60)) / 1000)

          setTimeRemaining(`${days}j ${hours}h ${minutes}m ${seconds}s`)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [popup])

  const fetchActivePopup = async () => {
    const currentLanguage = language || "fr"
    const { data } = await supabase
      .from("exit_popups")
      .select("*")
      .eq("language", currentLanguage)
      .eq("is_active", true)
      .lte("start_date", new Date().toISOString())
      .gte("end_date", new Date().toISOString())
      .order("display_order", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (data) {
      setPopup(data)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleClaim = () => {
    setIsOpen(false)
    // Copy discount code if available
    if (popup?.discount_code) {
      navigator.clipboard.writeText(popup.discount_code)
    }
  }

  if (!popup) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="max-w-2xl border-0 p-0 overflow-hidden"
        style={{
          backgroundColor: popup.background_color,
          color: popup.text_color,
        }}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative">
          {popup.image_url && (
            <div className="absolute inset-0 opacity-20">
              <img src={popup.image_url || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="relative p-8 md:p-12 text-center space-y-6">
            {/* Discount Badge */}
            {popup.discount_percentage && (
              <div className="inline-block">
                <div className="bg-gradient-to-r from-rose-500 to-orange-500 text-white px-6 py-3 rounded-full text-2xl font-bold animate-pulse">
                  -{popup.discount_percentage}%
                </div>
              </div>
            )}

            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">{popup.title}</h2>

            {/* Description */}
            <p className="text-lg md:text-xl opacity-90 max-w-xl mx-auto">{popup.description}</p>

            {/* Countdown Timer */}
            {popup.show_countdown && timeRemaining && (
              <div className="bg-black/30 rounded-lg p-4 inline-block">
                <div className="text-sm opacity-75 mb-1">L'offre se termine dans</div>
                <div className="text-2xl font-mono font-bold">{timeRemaining}</div>
              </div>
            )}

            {/* Discount Code */}
            {popup.discount_code && (
              <div className="bg-white/10 backdrop-blur-sm border-2 border-dashed border-white/30 rounded-lg p-4 inline-block">
                <div className="text-sm opacity-75 mb-1">Code promo</div>
                <div className="text-2xl font-mono font-bold tracking-wider">{popup.discount_code}</div>
              </div>
            )}

            {/* CTA Button */}
            <div className="pt-4">
              <Link href={popup.cta_link} onClick={handleClaim}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-rose-500 hover:from-cyan-600 hover:to-rose-600 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300"
                >
                  {popup.cta_text}
                </Button>
              </Link>
            </div>

            {/* Fine Print */}
            <p className="text-xs opacity-50 pt-4">
              * Offre valable jusqu'au {new Date(popup.end_date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
