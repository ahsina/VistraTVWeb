"use client"
import { useEffect } from "react"
import type React from "react"

import { usePathname, useSearchParams } from "next/navigation"
import { analytics } from "@/lib/analytics/tracker"

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Track page views
    const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
    analytics.trackPageView(url, document.title)

    // Track scroll depth
    let maxScroll = 0
    const handleScroll = () => {
      const scrollPercentage = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100,
      )
      if (scrollPercentage > maxScroll) {
        maxScroll = scrollPercentage
        if (scrollPercentage >= 25 && scrollPercentage % 25 === 0) {
          analytics.trackScroll(scrollPercentage)
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [pathname, searchParams])

  return <>{children}</>
}
