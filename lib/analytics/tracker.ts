// Analytics tracking utility for VistraTV

interface AnalyticsEvent {
  event: string
  category: string
  action: string
  label?: string
  value?: number
  metadata?: Record<string, any>
}

class AnalyticsTracker {
  private enabled = true
  private userId?: string
  private sessionId: string

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initSession()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
  }

  private initSession() {
    if (typeof window === "undefined") return

    // Store session in sessionStorage
    const existingSession = sessionStorage.getItem("vistra_session_id")
    if (existingSession) {
      this.sessionId = existingSession
    } else {
      sessionStorage.setItem("vistra_session_id", this.sessionId)
    }

    // Track session start
    this.trackEvent({
      event: "session_start",
      category: "engagement",
      action: "session",
      label: "start",
    })
  }

  setUserId(userId: string) {
    this.userId = userId
    this.trackEvent({
      event: "user_identified",
      category: "user",
      action: "identify",
      label: userId,
    })
  }

  trackPageView(page: string, title?: string) {
    this.trackEvent({
      event: "page_view",
      category: "navigation",
      action: "view",
      label: page,
      metadata: { title, timestamp: new Date().toISOString() },
    })
  }

  trackEvent(event: AnalyticsEvent) {
    if (!this.enabled) return

    const enrichedEvent = {
      ...event,
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: new Date().toISOString(),
      url: typeof window !== "undefined" ? window.location.href : undefined,
      referrer: typeof document !== "undefined" ? document.referrer : undefined,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics]", enrichedEvent)
    }

    // Send to backend
    this.sendToBackend(enrichedEvent)
  }

  private async sendToBackend(event: any) {
    try {
      const response = await fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      })

      if (!response.ok) {
        console.warn("[v0] Analytics API returned error status:", response.status)
        return
      }

      const contentType = response.headers.get("content-type")
      if (contentType?.includes("application/json")) {
        const data = await response.json()
        if (data.warning) {
          console.warn("[v0] Analytics warning:", data.warning)
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[v0] Analytics tracking failed:", error)
      }
    }
  }

  // Conversion tracking
  trackConversion(type: string, value?: number, metadata?: Record<string, any>) {
    this.trackEvent({
      event: "conversion",
      category: "conversion",
      action: type,
      value,
      metadata,
    })
  }

  // E-commerce tracking
  trackProductView(productId: string, productName: string, price: number) {
    this.trackEvent({
      event: "product_view",
      category: "ecommerce",
      action: "view_product",
      label: productName,
      value: price,
      metadata: { productId },
    })
  }

  trackAddToCart(productId: string, productName: string, price: number) {
    this.trackEvent({
      event: "add_to_cart",
      category: "ecommerce",
      action: "add_to_cart",
      label: productName,
      value: price,
      metadata: { productId },
    })
  }

  trackPurchase(transactionId: string, revenue: number, products: any[]) {
    this.trackEvent({
      event: "purchase",
      category: "ecommerce",
      action: "purchase",
      label: transactionId,
      value: revenue,
      metadata: { transactionId, products },
    })
  }

  // User engagement
  trackButtonClick(buttonName: string, location: string) {
    this.trackEvent({
      event: "button_click",
      category: "engagement",
      action: "click",
      label: buttonName,
      metadata: { location },
    })
  }

  trackFormSubmit(formName: string, success: boolean) {
    this.trackEvent({
      event: "form_submit",
      category: "engagement",
      action: success ? "submit_success" : "submit_error",
      label: formName,
    })
  }

  trackVideoPlay(videoId: string, videoTitle: string) {
    this.trackEvent({
      event: "video_play",
      category: "engagement",
      action: "play",
      label: videoTitle,
      metadata: { videoId },
    })
  }

  // Search tracking
  trackSearch(query: string, resultsCount: number) {
    this.trackEvent({
      event: "search",
      category: "engagement",
      action: "search",
      label: query,
      value: resultsCount,
    })
  }

  // Error tracking
  trackError(errorType: string, errorMessage: string, location: string) {
    this.trackEvent({
      event: "error",
      category: "error",
      action: errorType,
      label: location,
      metadata: { errorMessage },
    })
  }

  // Scroll tracking
  trackScroll(depth: number) {
    this.trackEvent({
      event: "scroll",
      category: "engagement",
      action: "scroll",
      value: depth,
    })
  }

  disable() {
    this.enabled = false
  }

  enable() {
    this.enabled = true
  }
}

// Singleton instance
export const analytics = new AnalyticsTracker()
