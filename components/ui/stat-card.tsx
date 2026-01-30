import type React from "react"

import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  className?: string
}

export function StatCard({ label, value, icon, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border bg-card p-6 text-center shadow-sm transition-all hover:shadow-md",
        className,
      )}
    >
      {icon && <div className="text-primary">{icon}</div>}
      <div className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">{value}</div>
      <div className="text-sm font-medium text-muted-foreground">{label}</div>
    </div>
  )
}
