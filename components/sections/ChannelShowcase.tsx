"use client"

import { useState, useMemo, useEffect } from "react"
import { ChannelLogo } from "@/components/shared/ChannelLogo"
import { Carousel } from "@/components/ui/carousel"
import { SectionTitle } from "@/components/ui/section-title"
import type { ChannelShowcaseProps } from "@/lib/types"
import Image from "next/image"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { Button } from "@/components/ui/button"
import { CheckCircle, Shield, Zap } from "@/lib/icons"

export function ChannelShowcase({
  categories,
  activeCategory: initialCategory,
  onCategoryChange,
  smallLogos,
  totalChannels,
  featuredLogos,
}: ChannelShowcaseProps) {
  const { t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [displayCount, setDisplayCount] = useState(0)

  const filteredLogos = useMemo(() => {
    if (activeCategory === "All") return smallLogos
    return smallLogos.filter((logo) => logo.category === activeCategory)
  }, [activeCategory, smallLogos])

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    onCategoryChange(category)
  }

  useEffect(() => {
    let startTime: number
    const duration = 2000 // 2 secondes

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      // Easing function pour un effet plus naturel
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setDisplayCount(Math.floor(totalChannels * easeOutQuart))

      if (progress < 1) {
        requestAnimationFrame(animateCount)
      }
    }

    requestAnimationFrame(animateCount)
  }, [totalChannels])

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 lg:py-20 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-[#00d4ff]/10 to-[#ff1e9f]/10 blur-md animate-[float_${15 + i * 2}s_ease-in-out_infinite]"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="glass rounded-2xl sm:rounded-[32px] p-6 sm:p-8 lg:p-12 shadow-[0_25px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="animate-[fadeInUp_0.8s_ease-out]">
            <SectionTitle align="left" className="mb-6 sm:mb-8 animate-[shimmer_3s_ease-in-out_infinite]">
              {t.channelShowcase.title}
            </SectionTitle>

            <div className="mb-6 sm:mb-8 space-y-3">
              <p className="text-white/90 text-base sm:text-lg font-medium">
                Le service IPTV le plus complet avec +10,000 chaînes en HD, 4K et 8K
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white/90 text-xs sm:text-sm font-medium">Essai gratuit 48h</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span className="text-white/90 text-xs sm:text-sm font-medium">Sans engagement</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/90 text-xs sm:text-sm font-medium">Satisfait ou remboursé</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 sm:gap-6 lg:gap-10 mb-6 sm:mb-8 border-b border-white/10 pb-4 overflow-x-auto scrollbar-hide">
              {categories.map((category, index) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  className={`text-sm sm:text-base font-medium transition-all pb-2 cursor-pointer whitespace-nowrap animate-[fadeIn_0.5s_ease-out_forwards] opacity-0 ${
                    activeCategory === category
                      ? "text-white border-b-2 border-[#00d4ff] scale-105 animate-[glow_2s_ease-in-out_infinite]"
                      : "text-white/60 hover:text-white hover:scale-105"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="mb-6 sm:mb-8">
              <div className="block sm:hidden">
                <Carousel
                  autoPlay
                  autoPlayInterval={3000}
                  showControls={false}
                  showIndicators={false}
                  itemsPerView={2}
                  gap={8}
                  key={activeCategory}
                >
                  {filteredLogos.map((logo) => (
                    <ChannelLogo
                      key={logo.id}
                      name={logo.name}
                      imageUrl={logo.imageUrl}
                      brandColor={logo.brandColor}
                      size="small"
                    />
                  ))}
                </Carousel>
              </div>
              <div className="hidden sm:block md:hidden">
                <Carousel
                  autoPlay
                  autoPlayInterval={3000}
                  showControls={false}
                  showIndicators={false}
                  itemsPerView={3}
                  gap={10}
                  key={activeCategory}
                >
                  {filteredLogos.map((logo) => (
                    <ChannelLogo
                      key={logo.id}
                      name={logo.name}
                      imageUrl={logo.imageUrl}
                      brandColor={logo.brandColor}
                      size="small"
                    />
                  ))}
                </Carousel>
              </div>
              <div className="hidden md:block">
                <Carousel
                  autoPlay
                  autoPlayInterval={3000}
                  showControls={false}
                  showIndicators={false}
                  itemsPerView={4}
                  gap={12}
                  key={activeCategory}
                >
                  {filteredLogos.map((logo) => (
                    <ChannelLogo
                      key={logo.id}
                      name={logo.name}
                      imageUrl={logo.imageUrl}
                      brandColor={logo.brandColor}
                      size="small"
                    />
                  ))}
                </Carousel>
              </div>
            </div>

            <div className="flex flex-col items-center mb-6 sm:mb-8 animate-[fadeIn_1s_ease-out_0.5s_forwards] opacity-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[slideShine_3s_ease-in-out_infinite]" />
                <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-[#00d4ff] via-[#00f5ff] to-[#00d4ff] bg-clip-text text-transparent animate-[gradientShift_3s_ease-in-out_infinite] mb-2">
                  + {displayCount.toLocaleString()}
                </div>
              </div>
              <div className="text-sm sm:text-base lg:text-lg text-white font-medium animate-[pulse_2s_ease-in-out_infinite]">
                {t.channelShowcase.channelsCount}
              </div>
            </div>

            <div className="mb-8">
              <Button
                onClick={() => (window.location.href = "/subscriptions")}
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-[#00d4ff] via-[#e94b87] to-[#ff6b35] hover:opacity-90 transition-all text-white font-bold px-8 py-6 text-lg rounded-xl shadow-2xl shadow-[#00d4ff]/40 hover:shadow-[#00d4ff]/60 hover:scale-105"
              >
                Commencer l'essai gratuit 🎉
              </Button>
              <p className="text-white/60 text-xs sm:text-sm mt-3 text-center sm:text-left">
                ⚡ Activation immédiate • 🔒 Aucune carte bancaire requise
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 items-center justify-items-center">
              {featuredLogos.map((logo, index) => (
                <div
                  key={logo.id}
                  style={{ animationDelay: `${0.8 + index * 0.15}s` }}
                  className="flex items-center justify-center animate-[scaleIn_0.5s_ease-out_forwards] opacity-0 hover:scale-125 transition-all duration-300 hover:rotate-6 hover:drop-shadow-[0_0_20px_rgba(0,212,255,0.6)]"
                >
                  <ChannelLogo name={logo.name} imageUrl={logo.imageUrl} size="large" />
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center animate-[slideInRight_1s_ease-out] relative mt-8 md:mt-0">
            <div className="relative animate-[float_6s_ease-in-out_infinite]">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-[-40px] rounded-full border-2 border-[#00d4ff]/30 animate-[spin_20s_linear_infinite]" />
                <div className="absolute inset-[-60px] rounded-full border-2 border-[#ff1e9f]/30 animate-[spin_15s_linear_infinite_reverse]" />
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-[#00d4ff]/20 via-[#ff1e9f]/20 to-[#00d4ff]/20 blur-xl animate-[pulse_3s_ease-in-out_infinite]" />

              <Image
                src="/images/hero.png"
                alt="Smart TV avec chaînes payantes"
                width={600}
                height={500}
                className="relative rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-500 hover:shadow-[0_0_80px_rgba(0,212,255,0.5)] w-full max-w-[400px] md:max-w-[500px] lg:max-w-[600px] h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
