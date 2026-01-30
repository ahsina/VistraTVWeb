"use client"

import { useEffect, useRef } from "react"

export function LightParticles() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const particleCount = 20

    // Créer les particules
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div")
      particle.className = "particle"
      particle.style.left = `${Math.random() * 100}%`
      particle.style.top = `${Math.random() * 100}%`
      particle.style.animationDelay = `${Math.random() * 6}s`
      particle.style.animationDuration = `${6 + Math.random() * 4}s`
      container.appendChild(particle)
    }

    return () => {
      container.innerHTML = ""
    }
  }, [])

  return <div ref={containerRef} className="light-particles" />
}
