// lib/i18n/LanguageContext.tsx
// Contexte de langue amélioré avec détection automatique

"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { defaultLocale, isRTL, locales, type Locale } from "./config"
import { getTranslation, type TranslationKeys } from "./translations"

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: TranslationKeys
  isRTL: boolean
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Détecter la langue préférée du navigateur
function detectBrowserLanguage(): Locale {
  if (typeof window === "undefined") return defaultLocale

  // 1. Vérifier localStorage d'abord
  const savedLocale = localStorage.getItem("locale") as Locale
  if (savedLocale && locales.includes(savedLocale)) {
    return savedLocale
  }

  // 2. Vérifier les paramètres URL (?lang=xx)
  const urlParams = new URLSearchParams(window.location.search)
  const urlLang = urlParams.get("lang") as Locale
  if (urlLang && locales.includes(urlLang)) {
    return urlLang
  }

  // 3. Vérifier navigator.languages
  const browserLanguages = navigator.languages || [navigator.language]
  
  for (const browserLang of browserLanguages) {
    // Extraire le code de langue (ex: "fr-FR" -> "fr")
    const langCode = browserLang.split("-")[0].toLowerCase() as Locale
    
    if (locales.includes(langCode)) {
      return langCode
    }
  }

  // 4. Fallback vers la langue par défaut
  return defaultLocale
}

// Appliquer la direction RTL au document
function applyDocumentDirection(locale: Locale) {
  if (typeof document === "undefined") return

  const rtl = isRTL(locale)
  document.documentElement.dir = rtl ? "rtl" : "ltr"
  document.documentElement.lang = locale

  // Ajouter/retirer la classe RTL pour le styling
  if (rtl) {
    document.documentElement.classList.add("rtl")
  } else {
    document.documentElement.classList.remove("rtl")
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [t, setT] = useState<TranslationKeys>(getTranslation(defaultLocale))
  const [isLoading, setIsLoading] = useState(true)

  // Initialisation au montage
  useEffect(() => {
    const detectedLocale = detectBrowserLanguage()
    setLocaleState(detectedLocale)
    setT(getTranslation(detectedLocale))
    applyDocumentDirection(detectedLocale)
    setIsLoading(false)

    // Sauvegarder si c'était une détection auto
    if (!localStorage.getItem("locale")) {
      localStorage.setItem("locale", detectedLocale)
    }
  }, [])

  // Écouter les changements de paramètre URL
  useEffect(() => {
    if (typeof window === "undefined") return

    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const urlLang = urlParams.get("lang") as Locale
      
      if (urlLang && locales.includes(urlLang) && urlLang !== locale) {
        setLocale(urlLang)
      }
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [locale])

  const setLocale = (newLocale: Locale) => {
    if (!locales.includes(newLocale)) {
      console.warn(`[v0] Invalid locale: ${newLocale}`)
      return
    }

    setLocaleState(newLocale)
    setT(getTranslation(newLocale))
    localStorage.setItem("locale", newLocale)
    applyDocumentDirection(newLocale)

    // Mettre à jour l'URL si nécessaire (optionnel)
    // const url = new URL(window.location.href)
    // url.searchParams.set("lang", newLocale)
    // window.history.replaceState({}, "", url.toString())
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, isRTL: isRTL(locale), isLoading }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

// Hook pour formater les dates selon la locale
export function useLocalizedDate() {
  const { locale } = useLanguage()

  return {
    formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
      const d = typeof date === "string" ? new Date(date) : date
      return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        ...options,
      }).format(d)
    },
    formatTime: (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
      const d = typeof date === "string" ? new Date(date) : date
      return new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
        ...options,
      }).format(d)
    },
    formatDateTime: (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
      const d = typeof date === "string" ? new Date(date) : date
      return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        ...options,
      }).format(d)
    },
    formatRelative: (date: Date | string) => {
      const d = typeof date === "string" ? new Date(date) : date
      const now = new Date()
      const diffMs = now.getTime() - d.getTime()
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffMinutes = Math.floor(diffMs / (1000 * 60))

      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })

      if (diffMinutes < 1) return rtf.format(0, "minute")
      if (diffMinutes < 60) return rtf.format(-diffMinutes, "minute")
      if (diffHours < 24) return rtf.format(-diffHours, "hour")
      if (diffDays < 30) return rtf.format(-diffDays, "day")
      
      return new Intl.DateTimeFormat(locale).format(d)
    },
  }
}

// Hook pour formater les nombres et prix
export function useLocalizedNumber() {
  const { locale } = useLanguage()

  return {
    formatNumber: (num: number, options?: Intl.NumberFormatOptions) => {
      return new Intl.NumberFormat(locale, options).format(num)
    },
    formatCurrency: (amount: number, currency: string = "EUR") => {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }).format(amount)
    },
    formatPercent: (value: number) => {
      return new Intl.NumberFormat(locale, {
        style: "percent",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(value)
    },
  }
}
