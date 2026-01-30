"use client"

import { Shield, Lock, CreditCard, Headphones, Award, CheckCircle } from "lucide-react"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export function TrustBadges() {
  const { t } = useLanguage()

  const badges = [
    {
      icon: Shield,
      title: t.marketing.badges.secure,
      description: t.marketing.badges.secureDesc,
    },
    {
      icon: Lock,
      title: t.marketing.badges.privacy,
      description: t.marketing.badges.privacyDesc,
    },
    {
      icon: CreditCard,
      title: t.marketing.badges.payment,
      description: t.marketing.badges.paymentDesc,
    },
    {
      icon: Headphones,
      title: t.marketing.badges.support,
      description: t.marketing.badges.supportDesc,
    },
    {
      icon: Award,
      title: t.marketing.badges.quality,
      description: t.marketing.badges.qualityDesc,
    },
    {
      icon: CheckCircle,
      title: t.marketing.badges.guarantee,
      description: t.marketing.badges.guaranteeDesc,
    },
  ]

  return (
    <section className="py-12 sm:py-16 bg-gray-900/50">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8 sm:mb-12">
          {t.marketing.badges.title}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-cyan-500 transition-all duration-300"
            >
              <badge.icon className="w-12 h-12 text-cyan-400 mb-3" />
              <h3 className="text-white font-semibold mb-2">{badge.title}</h3>
              <p className="text-gray-400 text-sm">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
