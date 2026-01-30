"use client"
import { Card } from "@/components/ui/card"
import { FadeIn } from "@/components/animations/FadeIn"
import { LightParticles } from "@/components/effects/light-particles"
import { SparkleButton } from "@/components/effects/sparkle-button"
import { SectionTitle } from "@/components/ui/section-title"
import { useSubscriptionPlans } from "@/lib/hooks/use-content"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import Link from "next/link"

export default function SubscriptionsClient() {
  const { language, t } = useLanguage()
  const { subscriptionPlans, loading } = useSubscriptionPlans(language)

  const displayPlans =
    subscriptionPlans.length > 0
      ? subscriptionPlans.map((plan) => ({
          id: plan.id,
          name: plan.name,
          price: plan.price.toString(),
          period:
            plan.duration_months === 1
              ? t.subscriptions.perMonth.replace("/", "")
              : plan.duration_months === 12
                ? t.subscriptions.perYear.replace("/", "")
                : `${plan.duration_months} ${t.paymentSuccess.months}`,
          description: plan.description || "",
          features: Array.isArray(plan.features) ? plan.features : [],
          cta: t.subscriptions.subscribe,
          popular: plan.display_order === 1,
        }))
      : []

  return (
    <>
      <Header />
      <div className="relative flex flex-col overflow-hidden">
        <LightParticles />

        {/* Background blur circles */}
        <div className="blur-circle blur-circle-purple w-[600px] h-[600px] top-0 right-0 float-animation" />
        <div
          className="blur-circle blur-circle-pink w-[500px] h-[500px] bottom-0 left-0 float-animation"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="blur-circle blur-circle-blue w-[400px] h-[400px] top-1/2 right-1/4 float-animation"
          style={{ animationDelay: "3s" }}
        />

        {/* Main gradient background */}
        <div className="fixed inset-0 bg-gradient-main -z-10" />

        {/* Subscription Plans */}
        <FadeIn direction="up" delay={0.2}>
          <section className="container px-4 py-12 sm:py-16 md:py-20 relative z-10">
            <SectionTitle align="center" subtitle={t.subscriptions.subtitle} className="mb-10 sm:mb-12 md:mb-16">
              {t.subscriptions.title}
            </SectionTitle>

            {loading ? (
              <div className="text-center text-white/70 text-sm sm:text-base">{t.subscriptions.loading}</div>
            ) : displayPlans.length === 0 ? (
              <div className="text-center text-white/70 text-sm sm:text-base">{t.subscriptions.noPlans}</div>
            ) : (
              <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {displayPlans.map((plan, index) => (
                  <Card
                    key={plan.id}
                    className={`relative p-6 sm:p-8 flex flex-col transition-all hover:scale-105 bg-white/5 backdrop-blur-sm shine-hover ${
                      plan.popular
                        ? "border-2 glow-border-animation shadow-2xl sm:scale-105 neon-glow-blue"
                        : "border border-white/10 hover:border-[#00d4ff]/50 hover:neon-glow-purple"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#00d4ff] to-[#e94b87] text-white px-3 sm:px-4 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold shimmer-effect">
                        {t.subscriptions.popular}
                      </div>
                    )}
                    <div className="text-center mb-4 sm:mb-6">
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 neon-text">{plan.name}</h3>
                      <div className="flex items-baseline justify-center gap-1 mb-2">
                        <span className="text-3xl sm:text-4xl font-bold text-white">{plan.price}€</span>
                        <span className="text-sm sm:text-base text-white/60">/{plan.period}</span>
                      </div>
                      <p className="text-white/70 text-xs sm:text-sm">{plan.description}</p>
                    </div>
                    <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 flex-grow">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-white/80">
                          <svg
                            className="w-5 h-5 text-[#00d4ff] shrink-0 mt-0.5 sparkle-animation"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{ animationDelay: `${idx * 0.2}s` }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-xs sm:text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href={`/checkout?plan=${plan.id}`}>
                      <SparkleButton
                        className={`w-full py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition-all ${
                          plan.popular
                            ? "bg-gradient-to-r from-[#00d4ff] to-[#e94b87] text-white hover:shadow-lg hover:shadow-[#00d4ff]/50"
                            : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                        }`}
                      >
                        {plan.cta}
                      </SparkleButton>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </FadeIn>
      </div>
      <Footer />
    </>
  )
}
