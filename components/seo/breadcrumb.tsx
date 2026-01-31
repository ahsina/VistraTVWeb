// components/seo/breadcrumb.tsx
"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { BreadcrumbSchema } from "./schema-org"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://vistratv.com"

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  // Build full items with home
  const fullItems = [{ label: "Accueil", href: "/" }, ...items]

  // Build schema items
  const schemaItems = fullItems.map((item) => ({
    name: item.label,
    url: item.href ? `${BASE_URL}${item.href}` : BASE_URL,
  }))

  return (
    <>
      {/* Schema.org Breadcrumb */}
      <BreadcrumbSchema items={schemaItems} />

      {/* Visual Breadcrumb */}
      <nav
        aria-label="Fil d'Ariane"
        className={`flex items-center space-x-1 text-sm text-gray-400 ${className}`}
      >
        <ol className="flex items-center space-x-1" itemScope itemType="https://schema.org/BreadcrumbList">
          {fullItems.map((item, index) => {
            const isLast = index === fullItems.length - 1

            return (
              <li
                key={index}
                className="flex items-center"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 mx-1 text-gray-500" aria-hidden="true" />
                )}

                {isLast || !item.href ? (
                  // Current page (no link)
                  <span
                    className={`${isLast ? "text-white font-medium" : "text-gray-400"}`}
                    itemProp="name"
                    aria-current={isLast ? "page" : undefined}
                  >
                    {index === 0 ? (
                      <span className="flex items-center">
                        <Home className="w-4 h-4 mr-1" />
                        <span className="sr-only">{item.label}</span>
                      </span>
                    ) : (
                      item.label
                    )}
                  </span>
                ) : (
                  // Link to parent page
                  <Link
                    href={item.href}
                    className="hover:text-[#00d4ff] transition-colors flex items-center"
                    itemProp="item"
                  >
                    {index === 0 ? (
                      <>
                        <Home className="w-4 h-4" />
                        <span className="sr-only" itemProp="name">{item.label}</span>
                      </>
                    ) : (
                      <span itemProp="name">{item.label}</span>
                    )}
                  </Link>
                )}

                <meta itemProp="position" content={String(index + 1)} />
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}

// Predefined breadcrumbs for common pages
export const breadcrumbPresets = {
  subscriptions: [{ label: "Abonnements" }],
  about: [{ label: "À Propos" }],
  support: [{ label: "Support" }],
  tutorials: [{ label: "Tutoriels" }],
  tutorialDevice: (device: string) => [
    { label: "Tutoriels", href: "/tutorials" },
    { label: device },
  ],
  blog: [{ label: "Blog" }],
  blogPost: (title: string) => [
    { label: "Blog", href: "/blog" },
    { label: title },
  ],
  channels: [{ label: "Chaînes" }],
  content: [{ label: "Films & Séries" }],
  checkout: [
    { label: "Abonnements", href: "/subscriptions" },
    { label: "Paiement" },
  ],
  dashboard: [{ label: "Tableau de bord" }],
  settings: [
    { label: "Tableau de bord", href: "/dashboard" },
    { label: "Paramètres" },
  ],
  terms: [{ label: "Conditions Générales" }],
  privacy: [{ label: "Politique de Confidentialité" }],
}

// Hook for generating breadcrumbs from pathname
export function useBreadcrumbFromPath(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean)
  
  const labelMap: Record<string, string> = {
    subscriptions: "Abonnements",
    about: "À Propos",
    support: "Support",
    tutorials: "Tutoriels",
    blog: "Blog",
    browse: "Explorer",
    channels: "Chaînes",
    content: "Films & Séries",
    dashboard: "Tableau de bord",
    settings: "Paramètres",
    checkout: "Paiement",
    terms: "CGV",
    privacy: "Confidentialité",
    "how-it-works": "Comment ça marche",
  }

  return segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/")
    const isLast = index === segments.length - 1
    
    return {
      label: labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
      href: isLast ? undefined : href,
    }
  })
}
