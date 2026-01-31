"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface FAQItem {
  id: string
  question: string
  answer: string
  category?: string
}

interface DynamicFAQProps {
  showSearch?: boolean
  showCategories?: boolean
  initialCategory?: string
}

export function DynamicFAQ({ 
  showSearch = false, 
  showCategories = false,
  initialCategory 
}: DynamicFAQProps) {
  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState(initialCategory || "all")
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  // FAQ par défaut si pas de données
  const defaultFaqs: FAQItem[] = [
    {
      id: "1",
      question: "Qu'est-ce que VistraTV ?",
      answer: "VistraTV est un service IPTV premium offrant plus de 20,000 chaînes TV, 50,000 films et séries en qualité HD, 4K et 8K.",
      category: "general",
    },
    {
      id: "2", 
      question: "Quels appareils sont compatibles ?",
      answer: "VistraTV fonctionne sur Smart TV, Android Box, Fire Stick, Apple TV, iPhone, Android, PC, Mac et plus encore.",
      category: "technique",
    },
    {
      id: "3",
      question: "Comment fonctionne l'essai gratuit ?",
      answer: "Nous offrons un essai gratuit de 24-48h. Contactez notre support via WhatsApp pour recevoir vos identifiants de test.",
      category: "general",
    },
    {
      id: "4",
      question: "Quels sont les moyens de paiement acceptés ?",
      answer: "Nous acceptons les cryptomonnaies (Bitcoin, Ethereum, USDT) et les cartes bancaires via des plateformes sécurisées.",
      category: "paiement",
    },
    {
      id: "5",
      question: "Comment installer VistraTV ?",
      answer: "L'installation est simple et prend moins de 5 minutes. Consultez nos tutoriels détaillés pour chaque appareil dans la section Tutoriels.",
      category: "technique",
    },
    {
      id: "6",
      question: "Le support est-il disponible 24/7 ?",
      answer: "Oui ! Notre équipe de support multilingue est disponible 24h/24, 7j/7 via WhatsApp, email et chat en direct.",
      category: "support",
    },
  ]

  useEffect(() => {
    async function fetchFAQs() {
      try {
        const response = await fetch("/api/faq")
        if (response.ok) {
          const data = await response.json()
          setFaqs(data.length > 0 ? data : defaultFaqs)
        } else {
          setFaqs(defaultFaqs)
        }
      } catch (error) {
        setFaqs(defaultFaqs)
      } finally {
        setLoading(false)
      }
    }
    fetchFAQs()
  }, [])

  const categories = [
    { id: "all", label: "Toutes" },
    { id: "general", label: "Général" },
    { id: "technique", label: "Technique" },
    { id: "paiement", label: "Paiement" },
    { id: "support", label: "Support" },
  ]

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id)
    } else {
      newOpenItems.add(id)
    }
    setOpenItems(newOpenItems)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/5 rounded-xl p-4 animate-pulse">
            <div className="h-6 bg-white/10 rounded w-3/4 mb-2" />
            <div className="h-4 bg-white/10 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      {showSearch && (
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher une question..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
          />
        </div>
      )}

      {/* Categories */}
      {showCategories && (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                activeCategory === cat.id
                  ? "bg-gradient-to-r from-[#00d4ff] to-[#e94b87] text-white"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* FAQ Items */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <p className="text-center text-gray-400 py-8">
            Aucune question trouvée pour votre recherche.
          </p>
        ) : (
          filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="font-medium text-white pr-4">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-[#00d4ff] transition-transform flex-shrink-0",
                    openItems.has(faq.id) && "rotate-180"
                  )}
                />
              </button>
              {openItems.has(faq.id) && (
                <div className="px-4 pb-4">
                  <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default DynamicFAQ
