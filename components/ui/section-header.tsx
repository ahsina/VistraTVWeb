import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
}

export function SectionHeader({ title, subtitle, centered = false, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3", centered && "items-center text-center", className)}>
      <h2 className="text-3xl font-bold tracking-tight text-balance lg:text-4xl xl:text-5xl">{title}</h2>
      {subtitle && <p className="text-lg text-muted-foreground text-pretty leading-relaxed max-w-2xl">{subtitle}</p>}
    </div>
  )
}
