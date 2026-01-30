"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { Menu, X } from "@/lib/icons"
import { cn } from "@/lib/utils"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t } = useLanguage()

  const navigation = [
    { name: t.nav.offers, href: "/subscriptions" },
    { name: t.nav.presentation, href: "/about" },
    { name: t.nav.tutorials, href: "/tutorials" },
    { name: t.nav.contact, href: "/support" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a0d2c]/95 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0a0d2c]/90">
      <nav className="container flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center group">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative text-sm font-bold text-white/80 transition-all hover:text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-[#00d4ff] after:to-[#e94b87] after:transition-all hover:after:w-full"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Button
            size="sm"
            onClick={() => (window.location.href = "/subscriptions")}
            className="bg-gradient-to-r from-[#00d4ff] via-[#e94b87] to-[#ff6b35] hover:opacity-90 transition-opacity font-bold shadow-lg shadow-[#00d4ff]/25"
          >
            {t.nav.subscribe}
          </Button>

          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className={cn("md:hidden", mobileMenuOpen ? "block" : "hidden")}>
        <div className="space-y-1 border-t border-white/10 bg-gradient-to-b from-[#0a0d2c] to-[#0a0d2c]/95 px-4 pb-3 pt-2 backdrop-blur-xl">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block rounded-lg px-4 py-3 text-base font-bold text-white/80 hover:bg-[#00d4ff]/10 hover:text-white transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="flex flex-col gap-3 pt-4">
            <Button
              onClick={() => (window.location.href = "/subscriptions")}
              className="w-full bg-gradient-to-r from-[#00d4ff] via-[#e94b87] to-[#ff6b35] hover:opacity-90 transition-opacity font-bold shadow-lg shadow-[#00d4ff]/25"
            >
              {t.nav.subscribe}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
