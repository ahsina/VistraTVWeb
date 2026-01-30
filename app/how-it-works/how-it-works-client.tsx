"use client"

import { useLanguage } from "@/lib/i18n/LanguageContext"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/animations/FadeIn"
import { UserPlus, CreditCard, Download, Play, CheckCircle } from "lucide-react"
import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export default function HowItWorksClient() {
  const { t } = useLanguage()

  const steps = [
    {
      number: "01",
      icon: UserPlus,
      title: t.howItWorks.steps.step1.title,
      description: t.howItWorks.steps.step1.desc,
    },
    {
      number: "02",
      icon: CreditCard,
      title: t.howItWorks.steps.step2.title,
      description: t.howItWorks.steps.step2.desc,
    },
    {
      number: "03",
      icon: Download,
      title: t.howItWorks.steps.step3.title,
      description: t.howItWorks.steps.step3.desc,
    },
    {
      number: "04",
      icon: Play,
      title: t.howItWorks.steps.step4.title,
      description: t.howItWorks.steps.step4.desc,
    },
  ]

  const features = [
    t.howItWorks.features.feature1,
    t.howItWorks.features.feature2,
    t.howItWorks.features.feature3,
    t.howItWorks.features.feature4,
    t.howItWorks.features.feature5,
    t.howItWorks.features.feature6,
  ]

  return (
    <>
      {/* Header */}
      <Header />
      <div className="relative min-h-screen overflow-hidden">
        {/* Background blur circles */}
        <div className="blur-circle blur-circle-purple w-[600px] h-[600px] top-0 right-0" />
        <div className="blur-circle blur-circle-pink w-[500px] h-[500px] bottom-0 left-0" />
        <div className="blur-circle blur-circle-blue w-[400px] h-[400px] top-1/2 right-1/4" />

        {/* Main gradient background */}
        <div className="fixed inset-0 bg-gradient-main -z-10" />

        {/* Hero Section */}
        <FadeIn direction="up" duration={0.6}>
          <section className="py-12 sm:py-16 md:py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6 text-balance">
                {t.howItWorks.hero.title}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 text-pretty">{t.howItWorks.hero.subtitle}</p>
            </div>
          </section>
        </FadeIn>

        {/* Steps Section */}
        <FadeIn direction="up" duration={0.7} delay={0.1}>
          <section className="py-12 sm:py-16 md:py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  return (
                    <Card
                      key={index}
                      className="p-8 bg-white/5 backdrop-blur-sm border-white/10 hover:border-[#00d4ff]/50 transition-all relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 text-[120px] font-black text-white/5 leading-none">
                        {step.number}
                      </div>
                      <div className="relative z-10">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#e94b87] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-4">{step.title}</h3>
                        <p className="text-gray-300 text-lg leading-relaxed">{step.description}</p>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          </section>
        </FadeIn>

        {/* Features Section */}
        <FadeIn direction="left" duration={0.7} delay={0.2}>
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-black text-white mb-4 text-center">{t.howItWorks.featuresTitle}</h2>
              <p className="text-xl text-gray-300 mb-12 text-center">{t.howItWorks.featuresSubtitle}</p>

              <Card className="p-12 bg-white/5 backdrop-blur-sm border-white/10">
                <div className="grid md:grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#e94b87] flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-gray-300 text-lg">{feature}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </section>
        </FadeIn>

        {/* Video Tutorial Section */}
        <FadeIn direction="right" duration={0.7} delay={0.2}>
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-black text-white mb-4 text-center">{t.howItWorks.videoTitle}</h2>
              <p className="text-xl text-gray-300 mb-12 text-center">{t.howItWorks.videoSubtitle}</p>

              <Card className="aspect-video bg-gradient-to-br from-[#00d4ff]/20 to-[#e94b87]/20 backdrop-blur-sm border-[#00d4ff]/30 flex items-center justify-center overflow-hidden">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#e94b87] flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform">
                    <Play className="w-10 h-10 text-white ml-1" />
                  </div>
                  <p className="text-white text-lg">{t.howItWorks.watchTutorial}</p>
                </div>
              </Card>
            </div>
          </section>
        </FadeIn>

        {/* FAQ Preview */}
        <FadeIn direction="up" duration={0.6} delay={0.1}>
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-black text-white mb-6">{t.howItWorks.faq.title}</h2>
              <p className="text-xl text-gray-300 mb-8">{t.howItWorks.faq.subtitle}</p>
              <Link href="/#faq">
                <Button className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87] hover:opacity-90 text-white font-bold px-8 py-6 text-lg">
                  {t.howItWorks.faq.cta}
                </Button>
              </Link>
            </div>
          </section>
        </FadeIn>

        {/* CTA Section */}
        <FadeIn direction="up" duration={0.7} delay={0.2}>
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="p-12 bg-gradient-to-br from-[#00d4ff]/10 to-[#e94b87]/10 backdrop-blur-sm border-[#00d4ff]/30 text-center">
                <h2 className="text-4xl font-black text-white mb-6">{t.howItWorks.cta.title}</h2>
                <p className="text-xl text-gray-300 mb-8">{t.howItWorks.cta.subtitle}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/register">
                    <Button className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87] hover:opacity-90 text-white font-bold px-8 py-6 text-lg">
                      {t.howItWorks.cta.start}
                    </Button>
                  </Link>
                  <Link href="/subscriptions">
                    <Button
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg bg-transparent"
                    >
                      {t.howItWorks.cta.viewPlans}
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </section>
        </FadeIn>
      </div>
      {/* Footer */}
      <Footer />
    </>
  )
}
