"use client"

import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { Facebook, Twitter, Instagram, Youtube } from "@/lib/icons"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export function Footer() {
  const { t } = useLanguage()

  const footerLinks = {
    product: [
      { name: t.nav.offers, href: "/subscriptions" },
      { name: t.channelShowcase.title, href: "/browse/channels" },
      { name: t.content.allMovies, href: "/browse/content" },
      { name: t.devices.title, href: "/tutorials" },
    ],
    company: [
      { name: t.nav.about, href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: t.nav.contact, href: "/support" },
    ],
    support: [
      { name: t.nav.tutorials, href: "/tutorials" },
      { name: t.faq.title, href: "/support" },
    ],
    legal: [
      { name: t.nav.privacy, href: "/privacy" },
      { name: t.nav.terms, href: "/terms" },
    ],
  }

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "YouTube", icon: Youtube, href: "#" },
  ]

  return (
    <footer className="border-t border-white/10 bg-gradient-to-b from-[#0a0d2c] to-[#0a0d2c]/50">
      <div className="container px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="sm:col-span-2 lg:col-span-2">
            <Logo className="mb-4" />
            <p className="text-sm text-white/70 text-pretty leading-relaxed max-w-md">{t.footer.description}</p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/70 transition-all hover:bg-gradient-to-br hover:from-[#00d4ff] hover:to-[#e94b87] hover:text-white hover:scale-110"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold bg-gradient-to-r from-[#00d4ff] to-[#e94b87] bg-clip-text text-transparent">
              {t.footer.links}
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold bg-gradient-to-r from-[#00d4ff] to-[#e94b87] bg-clip-text text-transparent">
              {t.footer.contact}
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold bg-gradient-to-r from-[#00d4ff] to-[#e94b87] bg-clip-text text-transparent">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:pt-8 text-xs sm:text-sm text-white/60 md:flex-row">
          <p>{t.footer.allRightsReserved}</p>
          <div className="flex gap-4 sm:gap-6">
            {footerLinks.legal.map((link) => (
              <Link key={link.name} href={link.href} className="transition-colors hover:text-white">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
