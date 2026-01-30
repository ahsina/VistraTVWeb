"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface FloatingElementProps {
  children: ReactNode
  duration?: number
  yOffset?: number
  className?: string
}

export function FloatingElement({ children, duration = 3, yOffset = 20, className }: FloatingElementProps) {
  return (
    <motion.div
      animate={{
        y: [0, -yOffset, 0],
      }}
      transition={{
        duration,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
