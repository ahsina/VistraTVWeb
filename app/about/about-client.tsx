"use client"

import { useLanguage } from "@/lib/i18n/LanguageContext"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Zap, Users, Award, Globe, Heart, Play, CheckCircle, TrendingUp, Target } from "lucide-react"
import Link from "next/link"
import { FadeIn } from "@/components/animations/FadeIn"
import { StaggerContainer } from "@/components/animations/StaggerContainer"
import { CountUp } from "@/components/animations/CountUp"
import Image from "next/image"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export default function AboutClientPage() {
  const { t } = useLanguage()

  const values = [
    {
      icon: Shield,
      title: t.aboutPage.values.security.title,
      description: t.aboutPage.values.security.desc,
    },
    {
      icon: Zap,
      title: t.aboutPage.values.performance.title,
      description: t.aboutPage.values.performance.desc,
    },
    {
      icon: Users,
      title: t.aboutPage.values.support.title,
      description: t.aboutPage.values.support.desc,
    },
    {
      icon: Award,
      title: t.aboutPage.values.quality.title,
      description: t.aboutPage.values.quality.desc,
    },
    {
      icon: Globe,
      title: t.aboutPage.values.global.title,
      description: t.aboutPage.values.global.desc,
    },
    {
      icon: Heart,
      title: t.aboutPage.values.passion.title,
      description: t.aboutPage.values.passion.desc,
    },
  ]

  const stats = [
    { value: 2018, label: t.aboutPage.stats.founded, suffix: "" },
    { value: 50000, label: t.aboutPage.stats.customers, suffix: "+" },
    { value: 10000, label: t.aboutPage.stats.channels, suffix: "+" },
    { value: 99.9, label: t.aboutPage.stats.uptime, suffix: "%" },
  ]

  const timeline = [
    {
      year: "2018",
      title: "Fondation",
      description: "Lancement de VistraTV avec une vision claire : démocratiser l'accès au streaming de qualité",
      icon: Target,
    },
    {
      year: "2020",
      title: "Expansion Internationale",
      description: "Ouverture de nos services à plus de 50 pays avec support multilingue",
      icon: Globe,
    },
    {
      year: "2022",
      title: "Innovation Technologique",
      description: "Introduction du streaming 4K et 8K avec une infrastructure cloud de pointe",
      icon: Zap,
    },
    {
      year: "2024",
      title: "Leadership du Marché",
      description: "Plus de 50,000 clients satisfaits et reconnaissance comme leader IPTV",
      icon: TrendingUp,
    },
  ]

  const achievements = [
    "Plus de 10,000 chaînes disponibles",
    "Support client 24/7 en 5 langues",
    "Qualité HD, 4K et 8K garantie",
    "99.9% de temps de disponibilité",
    "Compatibilité multi-appareils",
    "Mises à jour régulières du contenu",
  ]

  return (
    <>
      <Header />
      <div className="relative min-h-screen overflow-hidden">
        {/* Background blur circles */}
        <div className="blur-circle blur-circle-purple w-[600px] h-[600px] top-0 right-0" />
        <div className="blur-circle blur-circle-pink w-[500px] h-[500px] bottom-0 left-0" />
        <div className="blur-circle blur-circle-blue w-[400px] h-[400px] top-1/2 right-1/4" />

        {/* Main gradient background */}
        <div className="fixed inset-0 bg-gradient-main -z-10" />

        {/* Hero Section */}
        <FadeIn direction="up">
          <section className="py-16 sm:py-24 md:py-32 px-4 relative">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                <div>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 text-balance bg-gradient-to-r from-[#00d4ff] via-white to-[#e94b87] bg-clip-text text-transparent">
                    {t.aboutPage.hero.title}
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-4 sm:mb-6 text-pretty font-medium">
                    {t.aboutPage.hero.subtitle}
                  </p>
                  <p className="text-base sm:text-lg text-white/70 leading-relaxed mb-6 sm:mb-8">
                    {t.aboutPage.hero.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/subscriptions">
                      <Button className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87] hover:opacity-90 text-white font-bold px-8 py-6 text-lg">
                        Commencer Maintenant
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="border-white/30 hover:bg-white/10 text-white px-8 py-6 text-lg bg-transparent backdrop-blur-sm"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Voir la Démo
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <div className="relative rounded-2xl overflow-hidden border border-white/20 backdrop-blur-sm bg-white/5 p-8">
                    <Image
                      src="/tv-channels-grid-interface.jpg"
                      alt="VistraTV Interface"
                      width={600}
                      height={400}
                      className="rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d2c]/80 to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* Stats Section */}
        <FadeIn direction="up" delay={0.2}>
          <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <Card
                    key={index}
                    className="p-8 bg-white/5 backdrop-blur-sm border-white/10 text-center hover:border-[#00d4ff]/50 transition-all hover:scale-105 hover:bg-white/10"
                  >
                    <div className="text-5xl font-black bg-gradient-to-r from-[#00d4ff] to-[#e94b87] bg-clip-text text-transparent mb-2">
                      <CountUp end={stat.value} duration={2} />
                      {stat.suffix}
                    </div>
                    <div className="text-white/70 font-medium">{stat.label}</div>
                  </Card>
                ))}
              </StaggerContainer>
            </div>
          </section>
        </FadeIn>

        {/* Mission Section with Image */}
        <FadeIn direction="up" delay={0.4}>
          <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="relative order-2 lg:order-1">
                  <div className="relative rounded-2xl overflow-hidden border border-white/20 backdrop-blur-sm bg-white/5 p-4">
                    <Image
                      src="/movie-streaming-interface.jpg"
                      alt="Notre Mission"
                      width={600}
                      height={400}
                      className="rounded-lg"
                    />
                  </div>
                </div>
                <div className="order-1 lg:order-2">
                  <h2 className="text-5xl font-black text-white mb-6">{t.aboutPage.mission.title}</h2>
                  <p className="text-xl text-white/80 leading-relaxed mb-6">{t.aboutPage.mission.description}</p>
                  <div className="space-y-3">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-[#00d4ff] flex-shrink-0" />
                        <span className="text-white/90">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* Timeline Section */}
        <FadeIn direction="up" delay={0.6}>
          <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-5xl font-black text-white mb-4 text-center">Notre Histoire</h2>
              <p className="text-xl text-white/70 mb-16 text-center">Un parcours d'innovation et de croissance</p>

              <div className="relative">
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00d4ff] to-[#e94b87]" />
                <StaggerContainer className="space-y-12">
                  {timeline.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <div
                        key={index}
                        className={`flex items-center gap-8 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                      >
                        <div className={`flex-1 ${index % 2 === 0 ? "text-right" : "text-left"}`}>
                          <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10 hover:border-[#00d4ff]/50 transition-all hover:scale-105">
                            <div className="text-3xl font-black text-[#00d4ff] mb-2">{item.year}</div>
                            <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                            <p className="text-white/70">{item.description}</p>
                          </Card>
                        </div>
                        <div className="relative z-10">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#e94b87] flex items-center justify-center">
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <div className="flex-1" />
                      </div>
                    )
                  })}
                </StaggerContainer>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* Values Section */}
        <FadeIn direction="up" delay={0.8}>
          <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-5xl font-black text-white mb-4 text-center">{t.aboutPage.valuesTitle}</h2>
              <p className="text-xl text-white/70 mb-12 text-center">{t.aboutPage.valuesSubtitle}</p>

              <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {values.map((value, index) => {
                  const Icon = value.icon
                  return (
                    <Card
                      key={index}
                      className="p-8 bg-white/5 backdrop-blur-sm border-white/10 hover:border-[#00d4ff]/50 transition-all hover:scale-105 hover:bg-white/10"
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#e94b87] flex items-center justify-center mb-6">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                      <p className="text-white/70 leading-relaxed">{value.description}</p>
                    </Card>
                  )
                })}
              </StaggerContainer>
            </div>
          </section>
        </FadeIn>

        {/* CTA Section */}
        <FadeIn direction="up" delay={1}>
          <section className="py-32 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="relative rounded-3xl overflow-hidden border border-white/20 backdrop-blur-sm bg-gradient-to-br from-white/10 to-white/5 p-16">
                <h2 className="text-5xl font-black text-white mb-6">{t.aboutPage.cta.title}</h2>
                <p className="text-2xl text-white/80 mb-10">{t.aboutPage.cta.subtitle}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/subscriptions">
                    <Button className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87] hover:opacity-90 text-white font-bold px-10 py-7 text-xl">
                      {t.aboutPage.cta.subscribe}
                    </Button>
                  </Link>
                  <Link href="/support">
                    <Button
                      variant="outline"
                      className="border-white/30 hover:bg-white/10 text-white px-10 py-7 text-xl bg-transparent backdrop-blur-sm"
                    >
                      {t.aboutPage.cta.contact}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>
      </div>
      <Footer />
    </>
  )
}
