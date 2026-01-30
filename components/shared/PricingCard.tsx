"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "@/lib/icons"

interface PricingCardProps {
  name: string
  price: number
  period: string
  connections: number
  quality: string
  channels: string
  isPopular: boolean
  badge?: string
  gradientClass: string
  onSelect: () => void
}

export function PricingCard({
  name,
  price,
  period,
  connections,
  quality,
  channels,
  isPopular,
  badge,
  gradientClass,
  onSelect,
}: PricingCardProps) {
  return (
    <div
      className={`relative rounded-3xl p-10 shadow-2xl transition-all duration-300 hover:-translate-y-2 ${gradientClass} ${
        isPopular ? "scale-105 border-2 border-white/20" : ""
      }`}
    >
      {badge && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black font-bold px-5 py-1.5 text-xs shadow-lg">
          {badge}
        </Badge>
      )}

      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold text-white mb-6">{name}</h3>
        <div className="flex items-baseline justify-center">
          <span className="text-6xl font-extrabold text-white">${price}</span>
          <span className="text-2xl text-white/70 ml-2">{period}</span>
        </div>
      </div>

      <ul className="space-y-4 mb-8">
        <li className="flex items-center text-white/90 text-base">
          <Check className="w-5 h-5 mr-3 flex-shrink-0" />
          {connections} Connection{connections > 1 ? "s" : ""}
        </li>
        <li className="flex items-center text-white/90 text-base">
          <Check className="w-5 h-5 mr-3 flex-shrink-0" />
          {quality}
        </li>
        <li className="flex items-center text-white/90 text-base">
          <Check className="w-5 h-5 mr-3 flex-shrink-0" />+ {channels}
        </li>
      </ul>

      <Button
        onClick={onSelect}
        className="w-full bg-white text-gray-900 hover:bg-white/90 rounded-full py-6 text-base font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
      >
        Choose Plan
      </Button>
    </div>
  )
}
