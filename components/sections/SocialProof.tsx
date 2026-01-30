"use client"

import { StatCard } from "@/components/shared/StatCard"
import { ChannelLogo } from "@/components/shared/ChannelLogo"
import { SectionTitle } from "@/components/ui/section-title"
import type { SocialProofProps } from "@/lib/types"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export function SocialProof({ stats, premiumLogos }: SocialProofProps) {
  const { t } = useLanguage()

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 md:py-24 lg:py-32">
      <div className="bg-gradient-social rounded-xl sm:rounded-2xl md:rounded-[32px] p-6 sm:p-8 md:p-12 lg:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
        <SectionTitle align="center" className="mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          {t.socialProof.title}
        </SectionTitle>

        {/* Stats Grid - Grille plus équilibrée: 1 col mobile, 2 col small, 3 col md, 5 col lg */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6 lg:gap-8 mb-10 sm:mb-12 md:mb-14 lg:mb-16">
          {stats.map((stat) => (
            <StatCard key={stat.id} value={stat.value} label={stat.label} icon={stat.icon} />
          ))}
        </div>

        {/* Premium Logos - Tailles et espacements plus adaptatifs */}
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {premiumLogos.map((logo) => (
            <div
              key={logo.id}
              className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 w-[80px] xs:w-[90px] sm:w-[110px] md:w-[130px] lg:w-[140px] h-12 xs:h-14 sm:h-16 md:h-20 lg:h-24 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
            >
              <ChannelLogo name={logo.name} imageUrl={logo.imageUrl} size="large" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
