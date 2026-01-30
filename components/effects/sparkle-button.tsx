"use client"

import type { ReactNode } from "react"

interface SparkleButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
}

export function SparkleButton({ children, onClick, className = "" }: SparkleButtonProps) {
  return (
    <button onClick={onClick} className={`relative overflow-hidden group ${className}`}>
      {/* Effet de brillance */}
      <div className="absolute inset-0 shine-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Halo lumineux */}
      <div className="absolute inset-0 glow-halo opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Contenu */}
      <span className="relative z-10">{children}</span>

      {/* Étincelles au hover */}
      <span
        className="absolute top-0 left-1/4 w-2 h-2 bg-white rounded-full sparkle-animation opacity-0 group-hover:opacity-100"
        style={{ animationDelay: "0s" }}
      />
      <span
        className="absolute top-1/2 right-1/4 w-2 h-2 bg-white rounded-full sparkle-animation opacity-0 group-hover:opacity-100"
        style={{ animationDelay: "0.3s" }}
      />
      <span
        className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-white rounded-full sparkle-animation opacity-0 group-hover:opacity-100"
        style={{ animationDelay: "0.6s" }}
      />
    </button>
  )
}
