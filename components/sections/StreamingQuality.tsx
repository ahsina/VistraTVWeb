"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Shield, Wifi, CheckCircle2, Gauge } from "lucide-react"

export function StreamingQuality() {
  const [isTestingSpeed, setIsTestingSpeed] = useState(false)
  const [speedResult, setSpeedResult] = useState<number | null>(null)

  const testSpeed = async () => {
    setIsTestingSpeed(true)

    // Simulation du test de vitesse
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const randomSpeed = Math.floor(Math.random() * 200) + 100
    setSpeedResult(randomSpeed)
    setIsTestingSpeed(false)
  }

  const qualityBadges = [
    {
      id: "4k",
      label: "4K UHD",
      description: "3840 × 2160 pixels",
      icon: "🎬",
      color: "from-[#00d4ff] to-[#e94b87]",
    },
    {
      id: "hd",
      label: "Full HD",
      description: "1920 × 1080 pixels",
      icon: "📺",
      color: "from-[#00d4ff] to-[#ff1e9f]",
    },
    {
      id: "sd",
      label: "HD Ready",
      description: "1280 × 720 pixels",
      icon: "📱",
      color: "from-[#00d4ff] via-[#00f5ff] to-[#e94b87]",
    },
  ]

  const guarantees = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Zéro Buffering",
      description: "Streaming fluide garanti grâce à nos serveurs haute performance",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Stabilité 99.9%",
      description: "Uptime garanti avec redondance serveur automatique",
    },
    {
      icon: <Wifi className="w-6 h-6" />,
      title: "Optimisation Auto",
      description: "Adaptation automatique à votre vitesse de connexion",
    },
  ]

  return (
    <section className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 overflow-hidden">

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <Badge className="mb-3 sm:mb-4 text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-[#00d4ff]/20 to-[#e94b87]/20 border-[#00d4ff]/30">
            Qualité Premium
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-[#00d4ff] via-[#e94b87] to-[#ff1e9f] bg-clip-text text-transparent">
            Streaming Haute Qualité
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Profitez d'une expérience de streaming exceptionnelle avec une qualité d'image cristalline et aucune
            interruption
          </p>
        </div>

        {/* Quality Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 md:mb-16">
          {qualityBadges.map((badge, index) => (
            <Card
              key={badge.id}
              className="relative overflow-hidden group hover:scale-105 transition-all duration-300 cursor-pointer border-white/10 bg-white/5 backdrop-blur-sm"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />
              <div className="relative p-6 sm:p-8 text-center">
                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">{badge.icon}</div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white">{badge.label}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{badge.description}</p>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Disponible</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Speed Test Section */}
        <Card className="mb-8 sm:mb-12 md:mb-16 border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
          <div className="p-6 sm:p-8 md:p-10">
            <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-3 sm:mb-4">
                  <Gauge className="w-6 h-6 sm:w-8 sm:h-8 text-[#00d4ff]" />
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">Test de Vitesse</h3>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                  Vérifiez si votre connexion est optimale pour le streaming 4K
                </p>
                <Button
                  onClick={testSpeed}
                  disabled={isTestingSpeed}
                  size="lg"
                  className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87] hover:from-[#00d4ff]/90 hover:to-[#e94b87]/90 text-white font-semibold px-6 sm:px-8 w-full sm:w-auto"
                >
                  {isTestingSpeed ? (
                    <>
                      <span className="animate-spin mr-2">⚡</span>
                      Test en cours...
                    </>
                  ) : (
                    "Tester ma connexion"
                  )}
                </Button>
              </div>

              {speedResult !== null && (
                <div className="flex-1 text-center lg:text-right">
                  <div className="inline-block p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#00d4ff]/20 to-[#e94b87]/20 border border-[#00d4ff]/30">
                    <div className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#00d4ff] to-[#e94b87] bg-clip-text text-transparent mb-2">
                      {speedResult} Mbps
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                      Votre vitesse de connexion
                    </p>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {speedResult >= 50
                        ? "✓ Excellent pour 4K"
                        : speedResult >= 25
                          ? "✓ Bon pour Full HD"
                          : "⚠ Suffisant pour HD"}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Guarantees */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {guarantees.map((guarantee, index) => (
            <Card
              key={index}
              className="relative overflow-hidden group hover:scale-105 transition-all duration-300 border-white/10 bg-white/5 backdrop-blur-sm"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#00d4ff]/10 to-[#e94b87]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-[#00d4ff]/20 to-[#e94b87]/20 text-[#00d4ff]">
                    {guarantee.icon}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{guarantee.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {guarantee.description}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Technical Specs */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">
              Spécifications Techniques
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { label: "Codec Vidéo", value: "H.265 / HEVC" },
                { label: "Bitrate Max", value: "50 Mbps" },
                { label: "Latence", value: "< 2 secondes" },
                { label: "Format Audio", value: "Dolby 5.1" },
              ].map((spec, index) => (
                <div key={index} className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex justify-center mb-2">
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">{spec.label}</p>
                  <p className="text-sm sm:text-base font-bold text-white">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
