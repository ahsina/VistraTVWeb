"use client"

import { Shield, CheckCircle } from "lucide-react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { Button } from "@/components/ui/button"

export function MoneyBackGuarantee() {
  const { t } = useLanguage()

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-green-900/20 to-emerald-900/20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-6">
            <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">{t.marketing.guarantee.title}</h2>

          <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8">{t.marketing.guarantee.subtitle}</p>

          <div className="bg-gray-800/50 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 border border-green-500/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="flex flex-col items-center">
                <CheckCircle className="w-8 h-8 text-green-400 mb-3" />
                <h3 className="text-white font-semibold mb-2">{t.marketing.guarantee.point1Title}</h3>
                <p className="text-gray-400 text-sm">{t.marketing.guarantee.point1Desc}</p>
              </div>
              <div className="flex flex-col items-center">
                <CheckCircle className="w-8 h-8 text-green-400 mb-3" />
                <h3 className="text-white font-semibold mb-2">{t.marketing.guarantee.point2Title}</h3>
                <p className="text-gray-400 text-sm">{t.marketing.guarantee.point2Desc}</p>
              </div>
              <div className="flex flex-col items-center">
                <CheckCircle className="w-8 h-8 text-green-400 mb-3" />
                <h3 className="text-white font-semibold mb-2">{t.marketing.guarantee.point3Title}</h3>
                <p className="text-gray-400 text-sm">{t.marketing.guarantee.point3Desc}</p>
              </div>
            </div>

            <p className="text-gray-300 text-lg mb-6 sm:mb-8">{t.marketing.guarantee.description}</p>

            <Button
              size="lg"
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-8 py-6 text-lg"
            >
              {t.marketing.guarantee.cta}
            </Button>
          </div>

          <p className="text-sm text-gray-400">{t.marketing.guarantee.terms}</p>
        </div>
      </div>
    </section>
  )
}
