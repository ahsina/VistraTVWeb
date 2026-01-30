"use client"

import { useState, useEffect, useCallback, type ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "@/lib/icons"
import { Button } from "@/components/ui/button"

interface CarouselProps {
  children: ReactNode[]
  autoPlay?: boolean
  autoPlayInterval?: number
  showControls?: boolean
  showIndicators?: boolean
  itemsPerView?: number
  gap?: number
  className?: string
}

export function Carousel({
  children,
  autoPlay = false,
  autoPlayInterval = 5000,
  showControls = true,
  showIndicators = true,
  itemsPerView = 1,
  gap = 16,
  className = "",
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const totalSlides = Math.ceil(children.length / itemsPerView)

  const goToSlide = useCallback(
    (index: number) => {
      setCurrentIndex((index + totalSlides) % totalSlides)
    },
    [totalSlides],
  )

  const goToPrevious = useCallback(() => {
    goToSlide(currentIndex - 1)
  }, [currentIndex, goToSlide])

  const goToNext = useCallback(() => {
    goToSlide(currentIndex + 1)
  }, [currentIndex, goToSlide])

  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      goToNext()
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, goToNext])

  return (
    <div className={`relative w-full ${className}`}>
      {/* Carousel Container */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            gap: `${gap}px`,
          }}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div key={slideIndex} className="flex-shrink-0 w-full flex" style={{ gap: `${gap}px` }}>
              {children.slice(slideIndex * itemsPerView, (slideIndex + 1) * itemsPerView).map((child, itemIndex) => (
                <div
                  key={itemIndex}
                  style={{ width: `calc((100% - ${gap * (itemsPerView - 1)}px) / ${itemsPerView})` }}
                >
                  {child}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      {showControls && totalSlides > 1 && (
        <>
          <Button
            onClick={goToPrevious}
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12 backdrop-blur-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            onClick={goToNext}
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12 backdrop-blur-sm"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && totalSlides > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-gradient-to-r from-cyan-400 to-blue-500"
                  : "w-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
