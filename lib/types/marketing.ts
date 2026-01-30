export interface MarketingConfig {
  countdownTimer: {
    enabled: boolean
    endDate: string // ISO date string
    title: string
  }
  urgencyBanner: {
    enabled: boolean
    message: string
    spotsRemaining: number
  }
  trustBadges: {
    enabled: boolean
    badges: string[] // Array of badge keys to display
  }
  moneyBackGuarantee: {
    enabled: boolean
    days: number
  }
  liveViewers: {
    enabled: boolean
    minViewers: number
    maxViewers: number
  }
  recentPurchases: {
    enabled: boolean
    frequency: number // milliseconds between notifications
  }
}

export const defaultMarketingConfig: MarketingConfig = {
  countdownTimer: {
    enabled: true,
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    title: "Limited Time Offer",
  },
  urgencyBanner: {
    enabled: true,
    message: "Get 50% OFF on all subscriptions!",
    spotsRemaining: 23,
  },
  trustBadges: {
    enabled: true,
    badges: ["secure", "privacy", "payment", "support", "quality", "guarantee"],
  },
  moneyBackGuarantee: {
    enabled: true,
    days: 30,
  },
  liveViewers: {
    enabled: true,
    minViewers: 1500,
    maxViewers: 3000,
  },
  recentPurchases: {
    enabled: true,
    frequency: 8000,
  },
}
