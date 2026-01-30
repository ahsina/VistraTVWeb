"use client"
import { Globe } from "@/lib/icons"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { locales, localeNames } from "@/lib/i18n/config"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass">
        {locales.map((loc) => (
          <DropdownMenuItem key={loc} onClick={() => setLocale(loc)} className={locale === loc ? "bg-primary/10" : ""}>
            {localeNames[loc]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
