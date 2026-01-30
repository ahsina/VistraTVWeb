"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { SectionTitle } from "@/components/ui/section-title"
import { useLanguage } from "@/lib/i18n/LanguageContext"

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

interface AboutSectionProps {
  features: Feature[]
  onCtaClick: () => void
}

export function AboutSection({ features, onCtaClick }: AboutSectionProps) {
  const { t } = useLanguage()

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <SectionTitle align="center" subtitle={t.about.subtitle} className="mb-8 sm:mb-12 md:mb-16">
          {t.about.title}
        </SectionTitle>

        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16 px-4">
          <p className="text-base sm:text-lg text-white/80 leading-relaxed">{t.about.description}</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mb-3 sm:mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-white/70 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center px-4">
          <Button
            onClick={onCtaClick}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 rounded-full shadow-lg hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
          >
            {t.about.cta}
          </Button>
        </div>
      </div>
    </section>
  )
}
