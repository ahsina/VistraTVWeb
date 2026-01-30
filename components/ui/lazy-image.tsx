"use client"
import { useState } from "react"
import Image from "next/image"

interface LazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export function LazyImage({ src, alt, width, height, className, priority = false }: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div className={`bg-white/10 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">Image non disponible</span>
      </div>
    )
  }

  return (
    <div className="relative">
      {isLoading && <div className={`absolute inset-0 bg-white/10 animate-pulse ${className}`}></div>}
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={width || 800}
        height={height || 600}
        className={className}
        priority={priority}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
      />
    </div>
  )
}
