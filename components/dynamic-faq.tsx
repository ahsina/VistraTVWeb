// components/faq/dynamic-faq.tsx
"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, ThumbsUp, ThumbsDown } from "lucide-react"

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string | null
  language: string
  view_count: number
  helpful_count: number
}

interface DynamicFAQProps {
  category?: string
  limit?: number
  showSearch?: boolean
  showCategories?: boolean
}

const categoryLabels: Record<string, Record<string, string>> = {
  fr: {
    installation: "Installation",
    payment: "Paiement",
    subscription: "Abonnement",
    technical: "Technique",
    support: "Support",
    general: "Général",
  },
  en: {
    installation: "Installation",
    payment: "Payment",
    subscription: "Subscription",
    technical: "Technical",
    support: "Support",
    general: "General",
  },
  ar: {
    installation: "التثبيت",
    payment: "الدفع",
    subscription: "الاشتراك",
    technical: "تقني",
    support: "الدعم",
    general: "عام",
  },
}

export function DynamicFAQ({
  category,
  limit,
  showSearch = true,
  showCategories = true,
}: DynamicFAQProps) {
  const { locale, t } = useLanguage()
  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(category || null)
  const [categories, setCategories] = useState<string[]>([])
  const [votedItems, setVotedItems] = useState<Set<string>>(new Set())

  const supabase = createClient()

  useEffect(() => {
    fetchFAQs()
  }, [locale, selectedCategory])

  async function fetchFAQs() {
    try {
      setLoading(true)
      let query = supabase
        .from("faq_items")
        .select("*")
        .eq("language", locale)
        .eq("is_active", true)
        .order("display_order", { ascending: true })

      if (selectedCategory) {
        query = query.eq("category", selectedCategory)
      }

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) throw error
      setFaqs(data || [])

      // Extraire les catégories uniques
      const uniqueCategories = [...new Set((data || []).map((f) => f.category).filter(Boolean))]
      setCategories(uniqueCategories as string[])
    } catch (error) {
      console.error("[v0] Error fetching FAQs:", error)
    } finally {
      setLoading(false)
    }
  }

  async function trackView(faqId: string) {
    try {
      await supabase.rpc("increment_faq_view", { faq_id: faqId })
    } catch (error) {
      // Silently fail - non-critical
    }
  }

  async function voteHelpful(faqId: string, helpful: boolean) {
    if (votedItems.has(faqId)) return

    try {
      if (helpful) {
        await supabase.rpc("increment_faq_helpful", { faq_id: faqId })
      }
      setVotedItems(new Set([...votedItems, faqId]))
    } catch (error) {
      console.error("[v0] Error voting:", error)
    }
  }

  const filteredFaqs = faqs.filter((faq) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query)
    )
  })

  const labels = categoryLabels[locale] || categoryLabels.fr

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      {(showSearch || showCategories) && (
        <div className="space-y-4">
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder={locale === "ar" ? "ابحث في الأسئلة الشائعة..." : "Rechercher dans la FAQ..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
              />
            </div>
          )}

          {showCategories && categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className={
                  selectedCategory === null
                    ? "bg-gradient-to-r from-cyan-500 to-rose-500"
                    : "border-white/20"
                }
              >
                {locale === "ar" ? "الكل" : "Tout"}
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className={
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-cyan-500 to-rose-500"
                      : "border-white/20"
                  }
                >
                  {labels[cat] || cat}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FAQ List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-14 bg-white/5 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">
            {locale === "ar" ? "لم يتم العثور على أسئلة" : "Aucune question trouvée"}
          </p>
        </div>
      ) : (
        <Accordion type="single" collapsible className="space-y-2">
          {filteredFaqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="bg-white/5 border border-white/10 rounded-lg px-4 data-[state=open]:bg-white/10"
            >
              <AccordionTrigger
                onClick={() => trackView(faq.id)}
                className="text-white hover:text-cyan-400 text-left"
              >
                <div className="flex items-center gap-2">
                  {faq.category && (
                    <Badge variant="outline" className="text-xs shrink-0">
                      {labels[faq.category] || faq.category}
                    </Badge>
                  )}
                  <span>{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 pt-2 pb-4">
                <div className="prose prose-invert max-w-none">
                  <p className="whitespace-pre-wrap">{faq.answer}</p>
                </div>

                {/* Vote buttons */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
                  <span className="text-sm text-gray-400">
                    {locale === "ar" ? "هل كان هذا مفيدًا؟" : "Cette réponse vous a-t-elle aidé ?"}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => voteHelpful(faq.id, true)}
                      disabled={votedItems.has(faq.id)}
                      className={`gap-1 ${
                        votedItems.has(faq.id)
                          ? "text-green-400"
                          : "text-gray-400 hover:text-green-400"
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      {locale === "ar" ? "نعم" : "Oui"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => voteHelpful(faq.id, false)}
                      disabled={votedItems.has(faq.id)}
                      className={`gap-1 ${
                        votedItems.has(faq.id)
                          ? "text-gray-500"
                          : "text-gray-400 hover:text-red-400"
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      {locale === "ar" ? "لا" : "Non"}
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  )
}

// Fonctions SQL à créer
/*
CREATE OR REPLACE FUNCTION increment_faq_view(faq_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE faq_items 
  SET view_count = view_count + 1
  WHERE id = faq_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_faq_helpful(faq_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE faq_items 
  SET helpful_count = helpful_count + 1
  WHERE id = faq_id;
END;
$$ LANGUAGE plpgsql;
*/

export default DynamicFAQ
