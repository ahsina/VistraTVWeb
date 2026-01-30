import { cn } from "@/lib/utils"
import { Tv } from "@/lib/icons"

interface LogoProps {
  className?: string
  showIcon?: boolean
}

export function Logo({ className, showIcon = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showIcon && <Tv className="h-8 w-8 text-primary" />}
      <span className="text-2xl font-bold tracking-tight">
        Vistra<span className="text-primary">TV</span>
      </span>
    </div>
  )
}
