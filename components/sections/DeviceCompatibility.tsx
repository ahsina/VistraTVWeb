"use client"

import type React from "react"
import { SectionTitle } from "@/components/ui/section-title"
import { useLanguage } from "@/lib/i18n/LanguageContext"

interface Device {
  id: string
  name: string
  icon: React.ReactNode
  description: string
}

interface DeviceCompatibilityProps {
  devices: Device[]
}

export function DeviceCompatibility({ devices }: DeviceCompatibilityProps) {
  const { t } = useLanguage()

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <SectionTitle align="center" subtitle={t.deviceCompatibility.subtitle} className="mb-8 sm:mb-12 md:mb-16">
          {t.deviceCompatibility.title}
        </SectionTitle>

        {/* Devices Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {devices.map((device) => (
            <div
              key={device.id}
              className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 hover:from-white/15 hover:to-white/10 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/30"
            >
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {device.icon}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1">{device.name}</h3>
                  <p className="text-xs sm:text-sm text-white/60">{device.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-8 sm:mt-12 text-center px-4">
          <p className="text-white/70 text-xs sm:text-sm">
            Compatible avec tous vos appareils préférés. Installation simple et rapide.
          </p>
        </div>
      </div>
    </section>
  )
}
