// components/admin/global-search.tsx
"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  User,
  CreditCard,
  Ticket,
  FileText,
  Package,
  Users,
  Tag,
  X,
  ArrowRight,
  Loader2,
} from "lucide-react"

interface SearchResult {
  id: string
  type: "user" | "payment" | "ticket" | "subscription" | "affiliate" | "promo"
  title: string
  subtitle: string
  url: string
  icon: React.ReactNode
  badge?: { text: string; color: string }
}

const typeConfig = {
  user: {
    icon: <User className="w-4 h-4" />,
    color: "bg-blue-500/20 text-blue-300",
    label: "Utilisateur",
  },
  payment: {
    icon: <CreditCard className="w-4 h-4" />,
    color: "bg-green-500/20 text-green-300",
    label: "Paiement",
  },
  ticket: {
    icon: <Ticket className="w-4 h-4" />,
    color: "bg-purple-500/20 text-purple-300",
    label: "Ticket",
  },
  subscription: {
    icon: <Package className="w-4 h-4" />,
    color: "bg-cyan-500/20 text-cyan-300",
    label: "Abonnement",
  },
  affiliate: {
    icon: <Users className="w-4 h-4" />,
    color: "bg-orange-500/20 text-orange-300",
    label: "Affilié",
  },
  promo: {
    icon: <Tag className="w-4 h-4" />,
    color: "bg-pink-500/20 text-pink-300",
    label: "Code Promo",
  },
}

interface GlobalSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery("")
      setResults([])
      setSelectedIndex(0)
    }
  }, [open])

  // Recherche avec debounce
  const search = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    const searchResults: SearchResult[] = []

    try {
      const searchLower = searchQuery.toLowerCase()

      // Recherche utilisateurs
      const { data: users } = await supabase
        .from("user_profiles")
        .select("id, email, full_name, subscription_status")
        .or(`email.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`)
        .limit(5)

      users?.forEach((user) => {
        searchResults.push({
          id: user.id,
          type: "user",
          title: user.full_name || user.email || "Utilisateur",
          subtitle: user.email || "",
          url: `/admin/dashboard/users?id=${user.id}`,
          icon: typeConfig.user.icon,
          badge: user.subscription_status
            ? {
                text: user.subscription_status,
                color:
                  user.subscription_status === "active"
                    ? "bg-green-500/20 text-green-300"
                    : "bg-gray-500/20 text-gray-300",
              }
            : undefined,
        })
      })

      // Recherche paiements
      const { data: payments } = await supabase
        .from("payment_transactions")
        .select("id, email, final_amount, currency, status, created_at")
        .or(`email.ilike.%${searchQuery}%,gateway_transaction_id.ilike.%${searchQuery}%`)
        .limit(5)

      payments?.forEach((payment) => {
        searchResults.push({
          id: payment.id,
          type: "payment",
          title: `${payment.final_amount} ${payment.currency}`,
          subtitle: `${payment.email} - ${new Date(payment.created_at).toLocaleDateString("fr-FR")}`,
          url: `/admin/dashboard/payments?id=${payment.id}`,
          icon: typeConfig.payment.icon,
          badge: {
            text: payment.status,
            color:
              payment.status === "completed"
                ? "bg-green-500/20 text-green-300"
                : payment.status === "pending"
                ? "bg-yellow-500/20 text-yellow-300"
                : "bg-red-500/20 text-red-300",
          },
        })
      })

      // Recherche tickets
      const { data: tickets } = await supabase
        .from("support_tickets")
        .select("id, email, subject, status, priority")
        .or(`email.ilike.%${searchQuery}%,subject.ilike.%${searchQuery}%`)
        .limit(5)

      tickets?.forEach((ticket) => {
        searchResults.push({
          id: ticket.id,
          type: "ticket",
          title: ticket.subject,
          subtitle: ticket.email,
          url: `/admin/dashboard/support?ticket=${ticket.id}`,
          icon: typeConfig.ticket.icon,
          badge: {
            text: ticket.status,
            color:
              ticket.status === "open"
                ? "bg-yellow-500/20 text-yellow-300"
                : ticket.status === "resolved"
                ? "bg-green-500/20 text-green-300"
                : "bg-gray-500/20 text-gray-300",
          },
        })
      })

      // Recherche affiliés
      const { data: affiliates } = await supabase
        .from("affiliates")
        .select("id, name, email, affiliate_code, status")
        .or(`email.ilike.%${searchQuery}%,name.ilike.%${searchQuery}%,affiliate_code.ilike.%${searchQuery}%`)
        .limit(5)

      affiliates?.forEach((affiliate) => {
        searchResults.push({
          id: affiliate.id,
          type: "affiliate",
          title: affiliate.name || affiliate.email,
          subtitle: `Code: ${affiliate.affiliate_code}`,
          url: `/admin/dashboard/affiliates?id=${affiliate.id}`,
          icon: typeConfig.affiliate.icon,
          badge: {
            text: affiliate.status,
            color:
              affiliate.status === "active"
                ? "bg-green-500/20 text-green-300"
                : "bg-gray-500/20 text-gray-300",
          },
        })
      })

      // Recherche codes promo
      const { data: promos } = await supabase
        .from("promo_codes")
        .select("id, code, discount_type, discount_value, is_active")
        .ilike("code", `%${searchQuery}%`)
        .limit(5)

      promos?.forEach((promo) => {
        searchResults.push({
          id: promo.id,
          type: "promo",
          title: promo.code,
          subtitle: `${promo.discount_value}${promo.discount_type === "percentage" ? "%" : "€"} de réduction`,
          url: `/admin/dashboard/promo-codes?id=${promo.id}`,
          icon: typeConfig.promo.icon,
          badge: {
            text: promo.is_active ? "Actif" : "Inactif",
            color: promo.is_active ? "bg-green-500/20 text-green-300" : "bg-gray-500/20 text-gray-300",
          },
        })
      })

      setResults(searchResults)
      setSelectedIndex(0)
    } catch (error) {
      console.error("[v0] Search error:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      search(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, search])

  // Navigation au clavier
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
        break
      case "Enter":
        e.preventDefault()
        if (results[selectedIndex]) {
          router.push(results[selectedIndex].url)
          onOpenChange(false)
        }
        break
      case "Escape":
        onOpenChange(false)
        break
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-white/10 max-w-2xl p-0 gap-0">
        {/* Input de recherche */}
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <Search className="w-5 h-5 text-gray-400" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Rechercher utilisateurs, paiements, tickets..."
            className="border-0 bg-transparent focus-visible:ring-0 text-white placeholder:text-gray-500 text-lg"
          />
          {loading && <Loader2 className="w-5 h-5 animate-spin text-gray-400" />}
          <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-white/20 bg-white/5 px-2 font-mono text-xs text-gray-400">
            ESC
          </kbd>
        </div>

        {/* Résultats */}
        <div className="max-h-[400px] overflow-y-auto">
          {query.length < 2 ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Tapez au moins 2 caractères pour rechercher</p>
              <p className="text-sm mt-2">
                Raccourcis: ↑↓ pour naviguer, Enter pour sélectionner
              </p>
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="p-8 text-center text-gray-500">
              <p>Aucun résultat pour "{query}"</p>
            </div>
          ) : (
            <div className="py-2">
              {results.map((result, index) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => {
                    router.push(result.url)
                    onOpenChange(false)
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3 text-left transition-colors ${
                    index === selectedIndex
                      ? "bg-white/10"
                      : "hover:bg-white/5"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      typeConfig[result.type].color
                    }`}
                  >
                    {result.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium truncate">
                        {result.title}
                      </span>
                      {result.badge && (
                        <Badge className={`${result.badge.color} text-xs`}>
                          {result.badge.text}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      {result.subtitle}
                    </p>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-xs">
                    {typeConfig[result.type].label}
                  </Badge>
                  <ArrowRight className="w-4 h-4 text-gray-500" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer avec raccourcis */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-white/10 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10">↓</kbd>
              naviguer
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10">↵</kbd>
              sélectionner
            </span>
          </div>
          <span>{results.length} résultat(s)</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Hook pour ouvrir la recherche avec Cmd+K
export function useGlobalSearchShortcut(onOpen: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        onOpen()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onOpen])
}

export default GlobalSearch
