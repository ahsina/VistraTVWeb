"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle } from "@/lib/icons"
import { SectionTitle } from "@/components/ui/section-title"
import type { FAQSectionProps } from "@/lib/types"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export function FAQSection({ items, defaultOpenIndex }: FAQSectionProps) {
  const { t } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex ?? null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 md:py-20">
      <SectionTitle align="center" className="mb-8 sm:mb-12">
        {t.home.faq.title}
      </SectionTitle>

      <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="bg-[rgba(26,31,77,0.6)] backdrop-blur-[10px] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-6 text-left hover:bg-white/5 transition-colors"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              </div>

              <span className="flex-1 text-base sm:text-lg font-medium text-white">{item.question}</span>

              <ChevronDown
                className={`w-5 h-5 sm:w-6 sm:h-6 text-white/50 transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-400 ${
                openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-4 sm:px-6 pb-4 sm:pb-6 pl-12 sm:pl-[72px] text-sm sm:text-[15px] text-white/70 leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
