export const APP_CONFIG = {
  name: "VistraTV",
  description: "Plateforme IPTV Premium avec 20,000+ chaînes et contenus",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://vistratv.com",
  api: {
    baseUrl: process.env.API_URL || "https://api.vistratv.com",
    timeout: 30000,
  },
  support: {
    email: "support@vistratv.com",
    phone: "+33 1 23 45 67 89",
    whatsapp: "+33612345678",
  },
  social: {
    facebook: "https://facebook.com/vistratv",
    twitter: "https://twitter.com/vistratv",
    instagram: "https://instagram.com/vistratv",
    youtube: "https://youtube.com/@vistratv",
  },
  features: {
    trialDays: 7,
    maxDevices: 5,
    channelCount: 20000,
    movieCount: 50000,
    seriesCount: 30000,
  },
  pricing: {
    monthly: 14.99,
    quarterly: 39.99,
    yearly: 129.99,
    currency: "EUR",
  },
} as const

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  dashboard: "/dashboard",
  settings: "/dashboard/settings",
  checkout: "/checkout",
  subscriptions: "/subscriptions",
  browse: {
    channels: "/browse/channels",
    content: "/browse/content",
  },
  about: "/about",
  howItWorks: "/how-it-works",
  support: "/support",
  terms: "/terms",
  privacy: "/privacy",
  admin: {
    dashboard: "/admin/dashboard",
    hero: "/admin/dashboard/hero",
    features: "/admin/dashboard/features",
    channels: "/admin/dashboard/channels",
    subscriptions: "/admin/dashboard/subscriptions",
    tutorials: "/admin/dashboard/tutorials",
    users: "/admin/dashboard/users",
    settings: "/admin/dashboard/settings",
  },
} as const

export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    logout: "/api/auth/logout",
    forgotPassword: "/api/auth/forgot-password",
    resetPassword: "/api/auth/reset-password",
  },
  user: {
    profile: "/api/user/profile",
    subscription: "/api/user/subscription",
    payments: "/api/user/payments",
    cancelSubscription: "/api/user/subscription/cancel",
  },
  channels: "/api/channels",
  content: "/api/content",
  pricing: "/api/pricing",
  subscriptions: "/api/subscriptions",
  checkout: "/api/checkout",
  support: "/api/support",
  admin: {
    users: "/api/admin/users",
    channels: "/api/admin/channels",
    content: "/api/admin/content",
    marketing: "/api/admin/marketing",
  },
} as const

export const STORAGE_KEYS = {
  language: "vistratv_language",
  theme: "vistratv_theme",
  cookieConsent: "vistratv_cookie_consent",
  authToken: "vistratv_auth_token",
  user: "vistratv_user",
} as const

export const CHANNEL_CATEGORIES = [
  "sports",
  "movies",
  "series",
  "news",
  "kids",
  "entertainment",
  "documentary",
  "music",
] as const

export const CONTENT_GENRES = [
  "action",
  "comedy",
  "drama",
  "horror",
  "sci-fi",
  "romance",
  "thriller",
  "documentary",
  "animation",
  "adventure",
] as const

export type ChannelCategory = (typeof CHANNEL_CATEGORIES)[number]
export type ContentGenre = (typeof CONTENT_GENRES)[number]
