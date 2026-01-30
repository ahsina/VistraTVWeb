export const locales = ["fr", "en", "ar", "es", "it", "he"] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "fr"

export const localeNames: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  ar: "العربية",
  es: "Español",
  it: "Italiano",
  he: "עברית",
}

export const rtlLocales: Locale[] = ["ar", "he"]

export function isRTL(locale: Locale): boolean {
  return rtlLocales.includes(locale)
}
