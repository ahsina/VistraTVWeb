"use client"

import { MessageCircle, Check, CheckCheck } from "@/lib/icons"
import Image from "next/image"
import { Carousel } from "@/components/ui/carousel"
import { useLanguage } from "@/lib/i18n/LanguageContext"

interface WhatsAppMessage {
  id: string
  name: string
  avatar: string
  message: string
  time: string
  hasImage?: boolean
  imageUrl?: string
  isRead: boolean
}

interface WhatsAppTestimonialsProps {
  messages: WhatsAppMessage[]
}

export function WhatsAppTestimonials({ messages }: WhatsAppTestimonialsProps) {
  const { t } = useLanguage()

  return (
    <section className="relative py-12 sm:py-16 md:py-20 px-4 overflow-hidden">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-10 sm:mb-12 md:mb-16 text-center px-4">
        <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-[#25D366]/20 to-[#128C7E]/20 border border-[#25D366]/30">
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#25D366]" />
          <span className="text-[#25D366] font-bold text-xs sm:text-sm uppercase tracking-wider">
            {t.whatsapp.title}
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6 leading-tight">
          ILS NOUS FONT{" "}
          <span className="bg-gradient-to-r from-[#25D366] to-[#128C7E] bg-clip-text text-transparent">CONFIANCE</span>
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">{t.whatsapp.subtitle}</p>
      </div>

      {/* WhatsApp Messages Carousel */}
      <div className="max-w-7xl mx-auto">
        <Carousel
          autoPlay
          autoPlayInterval={4000}
          showControls={true}
          showIndicators={true}
          itemsPerView={1}
          gap={16}
          className="sm:hidden"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="group relative bg-[#0a0d2c]/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10 hover:border-[#25D366]/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#25D366]/20"
            >
              {/* WhatsApp Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                  {msg.avatar.startsWith("/") ? (
                    <Image src={msg.avatar || "/placeholder.svg"} alt={msg.name} fill className="object-cover" />
                  ) : (
                    msg.avatar
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg">{msg.name}</h3>
                  <p className="text-gray-400 text-sm">Client VistraTV</p>
                </div>
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
              </div>

              {/* WhatsApp Message Bubble */}
              <div className="relative bg-[#128C7E] rounded-2xl rounded-tl-none p-4 mb-3">
                <p className="text-white text-base leading-relaxed">{msg.message}</p>
                <div className="flex items-center justify-end gap-1 mt-2">
                  <span className="text-xs text-gray-200 opacity-80">{msg.time}</span>
                  {msg.isRead ? (
                    <CheckCheck className="w-4 h-4 text-blue-300" />
                  ) : (
                    <Check className="w-4 h-4 text-gray-300" />
                  )}
                </div>
              </div>

              {/* Optional Screenshot Image */}
              {msg.hasImage && msg.imageUrl && (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-[#25D366]/30">
                  <Image
                    src={msg.imageUrl || "/placeholder.svg"}
                    alt={`Screenshot from ${msg.name}`}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Hover Effect Gradient */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#25D366]/0 to-[#128C7E]/0 group-hover:from-[#25D366]/10 group-hover:to-[#128C7E]/10 transition-all duration-300 pointer-events-none" />
            </div>
          ))}
        </Carousel>

        <Carousel
          autoPlay
          autoPlayInterval={4000}
          showControls={true}
          showIndicators={true}
          itemsPerView={2}
          gap={20}
          className="hidden sm:block md:hidden"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="group relative bg-[#0a0d2c]/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10 hover:border-[#25D366]/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#25D366]/20"
            >
              {/* WhatsApp Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                  {msg.avatar.startsWith("/") ? (
                    <Image src={msg.avatar || "/placeholder.svg"} alt={msg.name} fill className="object-cover" />
                  ) : (
                    msg.avatar
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg">{msg.name}</h3>
                  <p className="text-gray-400 text-sm">Client VistraTV</p>
                </div>
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
              </div>

              {/* WhatsApp Message Bubble */}
              <div className="relative bg-[#128C7E] rounded-2xl rounded-tl-none p-4 mb-3">
                <p className="text-white text-base leading-relaxed">{msg.message}</p>
                <div className="flex items-center justify-end gap-1 mt-2">
                  <span className="text-xs text-gray-200 opacity-80">{msg.time}</span>
                  {msg.isRead ? (
                    <CheckCheck className="w-4 h-4 text-blue-300" />
                  ) : (
                    <Check className="w-4 h-4 text-gray-300" />
                  )}
                </div>
              </div>

              {/* Optional Screenshot Image */}
              {msg.hasImage && msg.imageUrl && (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-[#25D366]/30">
                  <Image
                    src={msg.imageUrl || "/placeholder.svg"}
                    alt={`Screenshot from ${msg.name}`}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Hover Effect Gradient */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#25D366]/0 to-[#128C7E]/0 group-hover:from-[#25D366]/10 group-hover:to-[#128C7E]/10 transition-all duration-300 pointer-events-none" />
            </div>
          ))}
        </Carousel>

        <Carousel
          autoPlay
          autoPlayInterval={4000}
          showControls={true}
          showIndicators={true}
          itemsPerView={3}
          gap={24}
          className="hidden md:block"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="group relative bg-[#0a0d2c]/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10 hover:border-[#25D366]/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#25D366]/20"
            >
              {/* WhatsApp Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                  {msg.avatar.startsWith("/") ? (
                    <Image src={msg.avatar || "/placeholder.svg"} alt={msg.name} fill className="object-cover" />
                  ) : (
                    msg.avatar
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg">{msg.name}</h3>
                  <p className="text-gray-400 text-sm">Client VistraTV</p>
                </div>
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
              </div>

              {/* WhatsApp Message Bubble */}
              <div className="relative bg-[#128C7E] rounded-2xl rounded-tl-none p-4 mb-3">
                <p className="text-white text-base leading-relaxed">{msg.message}</p>
                <div className="flex items-center justify-end gap-1 mt-2">
                  <span className="text-xs text-gray-200 opacity-80">{msg.time}</span>
                  {msg.isRead ? (
                    <CheckCheck className="w-4 h-4 text-blue-300" />
                  ) : (
                    <Check className="w-4 h-4 text-gray-300" />
                  )}
                </div>
              </div>

              {/* Optional Screenshot Image */}
              {msg.hasImage && msg.imageUrl && (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-[#25D366]/30">
                  <Image
                    src={msg.imageUrl || "/placeholder.svg"}
                    alt={`Screenshot from ${msg.name}`}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Hover Effect Gradient */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#25D366]/0 to-[#128C7E]/0 group-hover:from-[#25D366]/10 group-hover:to-[#128C7E]/10 transition-all duration-300 pointer-events-none" />
            </div>
          ))}
        </Carousel>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-4xl mx-auto mt-10 sm:mt-12 md:mt-16 text-center px-4">
        <div className="bg-gradient-to-r from-[#25D366]/10 to-[#128C7E]/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#25D366]/30">
          <p className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
            Rejoignez des milliers de clients satisfaits !
          </p>
          <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
            Contactez-nous sur WhatsApp pour toute question ou pour démarrer votre essai gratuit
          </p>
          <a
            href="https://wa.me/33123456789"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold text-base sm:text-lg rounded-full hover:scale-105 transition-transform duration-300 shadow-lg shadow-[#25D366]/30 w-full sm:w-auto"
          >
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            {t.whatsapp.cta}
          </a>
        </div>
      </div>
    </section>
  )
}
