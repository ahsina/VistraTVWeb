import type { ReactNode } from "react"

interface SectionTitleProps {
  children: ReactNode
  subtitle?: string
  className?: string
  align?: "left" | "center" | "right"
}

export function SectionTitle({ children, subtitle, className = "", align = "center" }: SectionTitleProps) {
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align]

  return (
    <div className={`mb-12 ${alignClass} ${className}`}>
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 relative inline-block">
        {/* Glow effect behind text */}
        <span className="absolute inset-0 blur-xl bg-gradient-to-r from-[#00d4ff] via-[#e94b87] to-[#00d4ff] opacity-50 animate-pulse" />

        {/* Main gradient text with animation */}
        <span className="relative bg-gradient-to-r from-[#00d4ff] via-[#e94b87] to-[#00d4ff] bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">
          {children}
        </span>

        {/* Light beam effect */}
        <span className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm opacity-0 group-hover:opacity-100 transition-opacity animate-light-sweep" />
      </h2>

      {subtitle && (
        <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mt-4 relative">
          <span className="relative z-10">{subtitle}</span>
          <span className="absolute inset-0 blur-md bg-gradient-to-r from-[#00d4ff]/20 to-[#e94b87]/20 animate-pulse" />
        </p>
      )}
    </div>
  )
}
