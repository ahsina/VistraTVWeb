"use client"

import { useLanguage } from "@/lib/i18n/LanguageContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle2, ArrowRight } from "lucide-react"
import { FadeIn } from "@/components/animations/FadeIn"
import { StaggerContainer } from "@/components/animations/StaggerContainer"
import Image from "next/image"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

const devices = [
  {
    id: "smart-tv",
    image: "/smart-tv-samsung-lg-television.jpg",
    titleKey: "tutorials.devices.smartTv.title",
    descKey: "tutorials.devices.smartTv.desc",
    brands: ["Samsung", "LG", "Sony", "Philips"],
    difficulty: "easy",
    duration: "5 min",
  },
  {
    id: "android-box",
    image: "/android-tv-box-nvidia-shield.jpg",
    titleKey: "tutorials.devices.androidBox.title",
    descKey: "tutorials.devices.androidBox.desc",
    brands: ["Nvidia Shield", "Mi Box", "Formuler"],
    difficulty: "easy",
    duration: "5 min",
  },
  {
    id: "android-phone",
    image: "/android-smartphone-samsung-phone.jpg",
    titleKey: "tutorials.devices.androidPhone.title",
    descKey: "tutorials.devices.androidPhone.desc",
    brands: ["Samsung", "Xiaomi", "Huawei"],
    difficulty: "easy",
    duration: "3 min",
  },
  {
    id: "fire-stick",
    image: "/amazon-fire-tv-stick.jpg",
    titleKey: "tutorials.devices.fireStick.title",
    descKey: "tutorials.devices.fireStick.desc",
    brands: ["Fire TV Stick", "Fire TV Cube"],
    difficulty: "medium",
    duration: "7 min",
  },
  {
    id: "apple-tv",
    image: "/apple-tv-4k-box.jpg",
    titleKey: "tutorials.devices.appleTv.title",
    descKey: "tutorials.devices.appleTv.desc",
    brands: ["Apple TV 4K", "Apple TV HD"],
    difficulty: "easy",
    duration: "5 min",
  },
  {
    id: "iphone-ipad",
    image: "/iphone-ipad-apple-devices.jpg",
    titleKey: "tutorials.devices.iphone.title",
    descKey: "tutorials.devices.iphone.desc",
    brands: ["iPhone", "iPad"],
    difficulty: "easy",
    duration: "3 min",
  },
  {
    id: "mac",
    image: "/macbook-imac-apple-computer.jpg",
    titleKey: "tutorials.devices.mac.title",
    descKey: "tutorials.devices.mac.desc",
    brands: ["MacBook", "iMac", "Mac Mini"],
    difficulty: "easy",
    duration: "4 min",
  },
  {
    id: "windows",
    image: "/windows-pc-computer-laptop.jpg",
    titleKey: "tutorials.devices.windows.title",
    descKey: "tutorials.devices.windows.desc",
    brands: ["Windows 10", "Windows 11"],
    difficulty: "easy",
    duration: "4 min",
  },
  {
    id: "kodi",
    image: "/kodi-media-center-logo.jpg",
    titleKey: "tutorials.devices.kodi.title",
    descKey: "tutorials.devices.kodi.desc",
    brands: ["Kodi 19+", "Kodi 20+"],
    difficulty: "medium",
    duration: "10 min",
  },
  {
    id: "chromecast",
    image: "/google-chromecast-device.jpg",
    titleKey: "tutorials.devices.chromecast.title",
    descKey: "tutorials.devices.chromecast.desc",
    brands: ["Chromecast", "Google TV"],
    difficulty: "medium",
    duration: "6 min",
  },
  {
    id: "playstation",
    image: "/playstation-5-console.png",
    titleKey: "tutorials.devices.playstation.title",
    descKey: "tutorials.devices.playstation.desc",
    brands: ["PS4", "PS5"],
    difficulty: "medium",
    duration: "8 min",
  },
  {
    id: "xbox",
    image: "/xbox-series-x.png",
    titleKey: "tutorials.devices.xbox.title",
    descKey: "tutorials.devices.xbox.desc",
    brands: ["Xbox One", "Xbox Series X/S"],
    difficulty: "medium",
    duration: "8 min",
  },
]

export default function TutorialsClient() {
  const { t } = useLanguage()

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-400"
      case "medium":
        return "text-yellow-400"
      case "hard":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen relative overflow-hidden">
        <div className="blur-circle blur-circle-purple w-[600px] h-[600px] top-0 right-0" />
        <div className="blur-circle blur-circle-pink w-[500px] h-[500px] bottom-0 right-0" />
        <div className="blur-circle blur-circle-blue w-[400px] h-[400px] top-1/2 left-0" />

        <div className="fixed inset-0 bg-gradient-main -z-10" />

        <div className="relative z-10">
          {/* Hero Section */}
          <section className="pt-20 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4">
            <div className="max-w-7xl mx-auto text-center">
              <FadeIn direction="up">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6">
                  <span className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87] bg-clip-text text-transparent">
                    {t.tutorials.hero.title}
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
                  {t.tutorials.hero.subtitle}
                </p>
              </FadeIn>

              <FadeIn direction="up" delay={0.2}>
                <div className="flex flex-wrap justify-center gap-4 mb-12 sm:mb-16 md:mb-24">
                  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
                    <CheckCircle2 className="w-5 h-5 text-[#00d4ff]" />
                    <span className="text-white">{t.tutorials.features.stepByStep}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
                    <CheckCircle2 className="w-5 h-5 text-[#00d4ff]" />
                    <span className="text-white">{t.tutorials.features.screenshots}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
                    <CheckCircle2 className="w-5 h-5 text-[#00d4ff]" />
                    <span className="text-white">{t.tutorials.features.videoGuides}</span>
                  </div>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* Devices Grid */}
          <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <FadeIn direction="up">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
                  {t.tutorials.selectDevice.title}
                </h2>
                <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">{t.tutorials.selectDevice.subtitle}</p>
              </FadeIn>

              <StaggerContainer>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {devices.map((device) => {
                    const deviceTitle =
                      t.tutorials.devices[device.id.replace(/-/g, "") as keyof typeof t.tutorials.devices]?.title ||
                      device.id
                    const deviceDesc =
                      t.tutorials.devices[device.id.replace(/-/g, "") as keyof typeof t.tutorials.devices]?.desc || ""

                    return (
                      <FadeIn key={device.id} direction="up">
                        <Link href={`/tutorials/${device.id}`}>
                          <Card className="group bg-white/5 backdrop-blur-sm border-white/10 hover:border-[#00d4ff]/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] p-6 h-full cursor-pointer">
                            <div className="flex flex-col h-full">
                              {/* Icon */}
                              <div className="mb-4 relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#00d4ff]/20 to-[#e94b87]/20">
                                <Image
                                  src={device.image || "/placeholder.svg"}
                                  alt={deviceTitle}
                                  fill
                                  className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>

                              {/* Title */}
                              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-[#00d4ff] transition-colors">
                                {deviceTitle}
                              </h3>

                              {/* Description */}
                              <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-4 flex-grow">
                                {deviceDesc}
                              </p>

                              {/* Brands */}
                              <div className="flex flex-wrap gap-2 mb-4">
                                {device.brands.slice(0, 2).map((brand) => (
                                  <span
                                    key={brand}
                                    className="text-xs sm:text-sm md:text-base px-2 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10"
                                  >
                                    {brand}
                                  </span>
                                ))}
                                {device.brands.length > 2 && (
                                  <span className="text-xs sm:text-sm md:text-base px-2 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10">
                                    +{device.brands.length - 2}
                                  </span>
                                )}
                              </div>

                              {/* Meta info */}
                              <div className="flex items-center justify-between text-sm sm:text-base md:text-lg pt-4 border-t border-white/10">
                                <span className={`font-medium ${getDifficultyColor(device.difficulty)}`}>
                                  {t.tutorials.difficulty[device.difficulty as keyof typeof t.tutorials.difficulty]}
                                </span>
                                <span className="text-gray-400">{device.duration}</span>
                              </div>

                              {/* Arrow */}
                              <div className="mt-4 flex items-center text-[#00d4ff] group-hover:translate-x-2 transition-transform">
                                <span className="text-sm sm:text-base md:text-lg font-medium mr-2">
                                  {t.tutorials.viewGuide}
                                </span>
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                              </div>
                            </div>
                          </Card>
                        </Link>
                      </FadeIn>
                    )
                  })}
                </div>
              </StaggerContainer>
            </div>
          </section>

          {/* Help Section */}
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
              <FadeIn direction="up">
                <Card className="bg-gradient-to-br from-[#00d4ff]/10 to-[#e94b87]/10 backdrop-blur-sm border-white/10 p-8 md:p-12 text-center">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 md:mb-8">
                    {t.tutorials.needHelp.title}
                  </h2>
                  <p className="text-gray-300 mb-8 sm:mb-12 md:mb-16 max-w-2xl mx-auto">
                    {t.tutorials.needHelp.subtitle}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      asChild
                      size="lg"
                      className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87] hover:opacity-90 text-white border-0"
                    >
                      <Link href="/support">{t.tutorials.needHelp.contactSupport}</Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      <Link href="/support#faq">{t.tutorials.needHelp.viewFaq}</Link>
                    </Button>
                  </div>
                </Card>
              </FadeIn>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  )
}
