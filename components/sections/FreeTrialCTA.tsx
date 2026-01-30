"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, Shield } from "@/lib/icons"
import { useLanguage } from "@/lib/i18n/LanguageContext"

interface FreeTrialCTAProps {
  features: string[]
  onCtaClick: () => void
}

export function FreeTrialCTA({ features, onCtaClick }: FreeTrialCTAProps) {
  const { t } = useLanguage()

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 rounded-3xl sm:rounded-[40px] p-1 shadow-2xl">
          <div className="bg-[#0a0d2c] rounded-[calc(1.5rem-4px)] sm:rounded-[38px] p-6 sm:p-10 md:p-12 lg:p-16">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8 md:mb-10">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 sm:px-6 py-2 mb-4 sm:mb-6">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                <span className="text-white font-semibold text-sm sm:text-base">{t.freeTrial.duration}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-4 sm:mb-6 leading-tight px-4">
                {t.freeTrial.title}
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed px-4">
                {t.freeTrial.description}
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 sm:gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4"
                >
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0" />
                  <span className="text-white font-medium text-sm sm:text-base">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center px-4">
              <Button
                onClick={onCtaClick}
                size="lg"
                className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold text-lg sm:text-xl px-8 sm:px-12 py-5 sm:py-6 md:py-7 rounded-full shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              >
                {t.freeTrial.cta}
              </Button>
              <p className="text-white/60 text-xs sm:text-sm mt-3 sm:mt-4 flex items-center justify-center gap-2">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                Aucune carte bancaire requise
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
