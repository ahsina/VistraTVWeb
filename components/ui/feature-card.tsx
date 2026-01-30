import type React from "react"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  className?: string
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <Card className={cn("group transition-all hover:shadow-lg hover:scale-105", className)}>
      <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
        <div className="rounded-full bg-primary/10 p-4 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-balance">{title}</h3>
        <p className="text-sm text-muted-foreground text-pretty leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}
