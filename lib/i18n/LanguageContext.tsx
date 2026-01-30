"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { defaultLocale, isRTL, type Locale } from "./config"
import { getTranslation, type TranslationKeys } from "./translations"

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: TranslationKeys
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [t, setT] = useState<TranslationKeys>(getTranslation(defaultLocale))

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem("locale") as Locale
    if (savedLocale && savedLocale !== locale) {
      setLocaleState(savedLocale)
      setT(getTranslation(savedLocale))
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    setT(getTranslation(newLocale))
    localStorage.setItem("locale", newLocale)

    // Update HTML dir attribute for RTL support
    document.documentElement.dir = isRTL(newLocale) ? "rtl" : "ltr"
    document.documentElement.lang = newLocale
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, isRTL: isRTL(locale) }}>
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
