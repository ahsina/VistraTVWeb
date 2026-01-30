"use client"

import Image from "next/image"
import { Carousel } from "@/components/ui/carousel"
import { SectionTitle } from "@/components/ui/section-title"
import { Play } from "@/lib/icons"
import { useLanguage } from "@/lib/i18n/LanguageContext"

interface Release {
  id: string
  title: string
  imageUrl: string
  type: "movie" | "series"
  year: string
  rating?: string
}

interface LatestReleasesProps {
  releases: Release[]
}

export function LatestReleases({ releases }: LatestReleasesProps) {
  const { t } = useLanguage()

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <SectionTitle align="center" subtitle={t.latestReleases.subtitle} className="mb-8 sm:mb-10 md:mb-12">
          {t.latestReleases.title}
        </SectionTitle>

        <Carousel autoPlay autoPlayInterval={4000} itemsPerView={1} gap={16} className="mb-8 sm:hidden">
          {releases.map((release) => (
            <div
              key={release.id}
              className="group relative aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10"
            >
              <Image
                src={release.imageUrl || "/placeholder.svg"}
                alt={release.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 25vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold text-lg mb-2">{release.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <span className="px-2 py-1 bg-white/20 rounded">
                      {release.type === "movie" ? t.latestReleases.movie : t.latestReleases.series}
                    </span>
                    <span>{release.year}</span>
                    {release.rating && <span className="text-yellow-400">★ {release.rating}</span>}
                  </div>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>

        <Carousel autoPlay autoPlayInterval={4000} itemsPerView={2} gap={16} className="mb-8 hidden sm:block md:hidden">
          {releases.map((release) => (
            <div
              key={release.id}
              className="group relative aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10"
            >
              <Image
                src={release.imageUrl || "/placeholder.svg"}
                alt={release.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <h3 className="text-white font-bold text-base sm:text-lg mb-2">{release.title}</h3>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/80">
                    <span className="px-2 py-1 bg-white/20 rounded text-[10px] sm:text-xs">
                      {release.type === "movie" ? t.latestReleases.movie : t.latestReleases.series}
                    </span>
                    <span>{release.year}</span>
                    {release.rating && <span className="text-yellow-400">★ {release.rating}</span>}
                  </div>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
                    <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1" fill="white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>

        <Carousel autoPlay autoPlayInterval={4000} itemsPerView={3} gap={20} className="mb-8 hidden md:block lg:hidden">
          {releases.map((release) => (
            <div
              key={release.id}
              className="group relative aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10"
            >
              <Image
                src={release.imageUrl || "/placeholder.svg"}
                alt={release.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <h3 className="text-white font-bold text-base sm:text-lg mb-2">{release.title}</h3>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/80">
                    <span className="px-2 py-1 bg-white/20 rounded text-[10px] sm:text-xs">
                      {release.type === "movie" ? t.latestReleases.movie : t.latestReleases.series}
                    </span>
                    <span>{release.year}</span>
                    {release.rating && <span className="text-yellow-400">★ {release.rating}</span>}
                  </div>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
                    <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1" fill="white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>

        <Carousel autoPlay autoPlayInterval={4000} itemsPerView={4} gap={24} className="mb-8 hidden lg:block">
          {releases.map((release) => (
            <div
              key={release.id}
              className="group relative aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10"
            >
              <Image
                src={release.imageUrl || "/placeholder.svg"}
                alt={release.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 25vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold text-lg mb-2">{release.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <span className="px-2 py-1 bg-white/20 rounded">
                      {release.type === "movie" ? t.latestReleases.movie : t.latestReleases.series}
                    </span>
                    <span>{release.year}</span>
                    {release.rating && <span className="text-yellow-400">★ {release.rating}</span>}
                  </div>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  )
}
