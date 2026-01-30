"use client"

import { Check, X } from "lucide-react"
import { SectionTitle } from "@/components/ui/section-title"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface CompetitorFeature {
  name: string
  vistraTV: boolean | string
  netflix: boolean | string
  canalPlus: boolean | string
  molotovTV: boolean | string
}

export function CompetitorComparison() {
  const features: CompetitorFeature[] = [
    {
      name: "Nombre de chaînes",
      vistraTV: "10,000+",
      netflix: "0 (VOD uniquement)",
      canalPlus: "150+",
      molotovTV: "300+",
    },
    {
      name: "Qualité maximale",
      vistraTV: "8K",
      netflix: "4K",
      canalPlus: "4K",
      molotovTV: "Full HD",
    },
    {
      name: "Connexions simultanées",
      vistraTV: "Jusqu'à 4",
      netflix: "4",
      canalPlus: "2",
      molotovTV: "1",
    },
    {
      name: "Prix mensuel",
      vistraTV: "À partir de 19€",
      netflix: "À partir de 13€",
      canalPlus: "À partir de 25€",
      molotovTV: "À partir de 10€",
    },
    {
      name: "Sport en direct",
      vistraTV: true,
      netflix: false,
      canalPlus: true,
      molotovTV: false,
    },
    {
      name: "Films & Séries",
      vistraTV: true,
      netflix: true,
      canalPlus: true,
      molotovTV: true,
    },
    {
      name: "Chaînes internationales",
      vistraTV: true,
      netflix: false,
      canalPlus: false,
      molotovTV: false,
    },
    {
      name: "EPG (Guide TV)",
      vistraTV: true,
      netflix: false,
      canalPlus: true,
      molotovTV: true,
    },
    {
      name: "Enregistrement",
      vistraTV: true,
      netflix: false,
      canalPlus: true,
      molotovTV: false,
    },
    {
      name: "Compatible tous appareils",
      vistraTV: true,
      netflix: true,
      canalPlus: true,
      molotovTV: true,
    },
    {
      name: "Essai gratuit",
      vistraTV: "24-48h",
      netflix: false,
      canalPlus: false,
      molotovTV: "30 jours",
    },
    {
      name: "Sans engagement",
      vistraTV: true,
      netflix: false,
      canalPlus: false,
      molotovTV: true,
    },
  ]

  const renderValue = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="w-6 h-6 text-green-400 mx-auto" />
      ) : (
        <X className="w-6 h-6 text-red-400 mx-auto" />
      )
    }
    return <span className="text-sm sm:text-base text-gray-300">{value}</span>
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 lg:py-20">
      <SectionTitle align="center" className="mb-4">
        Pourquoi Choisir VistraTV ?
      </SectionTitle>
      <p className="text-center text-gray-400 text-base sm:text-lg mb-10 sm:mb-12 max-w-3xl mx-auto">
        Comparez VistraTV avec les principales plateformes de streaming et découvrez pourquoi nous sommes le meilleur
        choix pour votre divertissement.
      </p>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className="grid grid-cols-5 gap-2 sm:gap-4 mb-2">
            <div className="col-span-1"></div>
            <div className="col-span-1 text-center">
              <Card className="bg-gradient-to-br from-cyan-500/20 to-pink-500/20 border-2 border-cyan-500/50 p-3 sm:p-4">
                <div className="text-lg sm:text-xl font-bold text-white mb-1">VistraTV</div>
                <div className="text-xs sm:text-sm text-cyan-400 font-semibold">NOTRE OFFRE</div>
              </Card>
            </div>
            <div className="col-span-1 text-center">
              <Card className="bg-gray-800/50 border border-gray-700 p-3 sm:p-4">
                <div className="text-base sm:text-lg font-bold text-white mb-1">Netflix</div>
              </Card>
            </div>
            <div className="col-span-1 text-center">
              <Card className="bg-gray-800/50 border border-gray-700 p-3 sm:p-4">
                <div className="text-base sm:text-lg font-bold text-white mb-1">Canal+</div>
              </Card>
            </div>
            <div className="col-span-1 text-center">
              <Card className="bg-gray-800/50 border border-gray-700 p-3 sm:p-4">
                <div className="text-base sm:text-lg font-bold text-white mb-1">Molotov TV</div>
              </Card>
            </div>
          </div>

          {/* Feature rows */}
          {features.map((feature, index) => (
            <div
              key={index}
              className={`grid grid-cols-5 gap-2 sm:gap-4 py-3 sm:py-4 border-b border-gray-800 ${
                index % 2 === 0 ? "bg-gray-900/20" : "bg-transparent"
              }`}
            >
              <div className="col-span-1 flex items-center">
                <span className="text-sm sm:text-base text-white font-medium">{feature.name}</span>
              </div>
              <div className="col-span-1 flex items-center justify-center bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                <div className="font-semibold text-cyan-400">{renderValue(feature.vistraTV)}</div>
              </div>
              <div className="col-span-1 flex items-center justify-center">
                <div className="text-gray-400">{renderValue(feature.netflix)}</div>
              </div>
              <div className="col-span-1 flex items-center justify-center">
                <div className="text-gray-400">{renderValue(feature.canalPlus)}</div>
              </div>
              <div className="col-span-1 flex items-center justify-center">
                <div className="text-gray-400">{renderValue(feature.molotovTV)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-10 sm:mt-12 text-center">
        <Button
          size="lg"
          className="bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white font-bold px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
        >
          Essayer VistraTV Gratuitement 24-48h
        </Button>
        <p className="text-gray-400 text-sm mt-4">Sans carte bancaire • Sans engagement</p>
      </div>
    </section>
  )
}
