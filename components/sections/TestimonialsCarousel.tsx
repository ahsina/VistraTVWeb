"use client"

import { Carousel } from "@/components/ui/carousel"
import { SectionTitle } from "@/components/ui/section-title"
import { Star } from "@/lib/icons"
import { useLanguage } from "@/lib/i18n/LanguageContext"

interface Testimonial {
  id: string
  name: string
  avatar: string
  rating: number
  comment: string
  date: string
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[]
}

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const { t } = useLanguage()

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <SectionTitle align="center" subtitle={t.home.testimonials.subtitle} className="mb-8 sm:mb-10 md:mb-12">
          {t.home.testimonials.title}
        </SectionTitle>

        <Carousel autoPlay autoPlayInterval={6000} itemsPerView={1} gap={16} className="sm:hidden">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-white/20"
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-6">"{testimonial.comment}"</p>

              {/* Author */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-base sm:text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm sm:text-base">{testimonial.name}</div>
                  <div className="text-white/60 text-xs sm:text-sm">{testimonial.date}</div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>

        <Carousel autoPlay autoPlayInterval={6000} itemsPerView={2} gap={20} className="hidden sm:block md:hidden">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-white/20"
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-6">"{testimonial.comment}"</p>

              {/* Author */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-base sm:text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm sm:text-base">{testimonial.name}</div>
                  <div className="text-white/60 text-xs sm:text-sm">{testimonial.date}</div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>

        <Carousel autoPlay autoPlayInterval={6000} itemsPerView={3} gap={24} className="hidden md:block">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-white/20"
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-white/90 text-base leading-relaxed mb-6">"{testimonial.comment}"</p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-white/60 text-sm">{testimonial.date}</div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  )
}
