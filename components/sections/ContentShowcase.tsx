"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

interface ContentShowcaseProps {
  title: string
  description: string
  imageUrl: string
  ctaText: string
  onCtaClick: () => void
  reverse?: boolean
}

export function ContentShowcase({
  title,
  description,
  imageUrl,
  ctaText,
  onCtaClick,
  reverse = false,
}: ContentShowcaseProps) {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div
          className={`flex flex-col ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-8 sm:gap-12 lg:gap-20`}
        >
          {/* Content */}
          <div className="flex-1 space-y-4 sm:space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight">
              {title}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-white/80 leading-relaxed">{description}</p>
            <Button
              onClick={onCtaClick}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-full shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
            >
              {ctaText}
            </Button>
          </div>

          {/* Image */}
          <div className="flex-1 relative w-full">
            <div className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
