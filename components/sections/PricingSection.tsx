"use client"

import { PricingCard } from "@/components/shared/PricingCard"
import { SectionTitle } from "@/components/ui/section-title"
import type { PricingSectionProps } from "@/lib/types"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { TrustBadges } from "@/components/marketing/TrustBadges"
import { MoneyBackGuarantee } from "@/components/marketing/MoneyBackGuarantee"
import { CountdownTimer } from "@/components/marketing/CountdownTimer"
import { useRouter } from "next/navigation"

export function PricingSection({ plans }: PricingSectionProps) {
  const { t } = useLanguage()
  const router = useRouter()

  const handleSelectPlan = (planId: string) => {
    console.log("[v0] Selected plan:", planId)
    router.push(`/checkout?planId=${planId}`)
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 lg:py-20">
      <div className="mb-8 sm:mb-12">
        <CountdownTimer />
      </div>

      <SectionTitle align="center" className="mb-10 sm:mb-12 lg:mb-14">
        {t.home.pricing.title}
      </SectionTitle>

      <div className="mb-8 sm:mb-12">
        <TrustBadges />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            name={plan.name}
            price={plan.price}
            period={plan.period}
            connections={plan.connections}
            quality={plan.quality}
            channels={plan.channels}
            isPopular={plan.isPopular}
            badge={plan.badge}
            gradientClass={
              plan.name === "Basic"
                ? "bg-gradient-basic"
                : plan.name === "Premium"
                  ? "bg-gradient-premium"
                  : "bg-gradient-ultimate"
            }
            onSelect={() => handleSelectPlan(plan.id)}
          />
        ))}
      </div>

      <div className="mt-12 sm:mt-16">
        <MoneyBackGuarantee />
      </div>
    </section>
  )
}
