// Utility functions to replace date-fns with native JavaScript

export function formatDate(date: Date | string, formatStr = "PPP"): string {
  const d = typeof date === "string" ? new Date(date) : date

  if (isNaN(d.getTime())) return "Invalid date"

  const locale = "fr-FR"

  // Common date-fns format mappings
  if (formatStr === "PPP" || formatStr === "dd MMMM yyyy") {
    return d.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })
  }

  if (formatStr === "PP" || formatStr === "dd/MM/yyyy") {
    return d.toLocaleDateString(locale, { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  if (formatStr === "dd MMM yyyy" || formatStr === "dd MMM") {
    const month = d.toLocaleDateString(locale, { month: "short" })
    const day = d.getDate()
    if (formatStr === "dd MMM") return `${day} ${month}`
    return `${day} ${month} ${d.getFullYear()}`
  }

  if (formatStr.includes("HH:mm")) {
    const dateStr = d.toLocaleDateString(locale, { day: "2-digit", month: "2-digit", year: "numeric" })
    const timeStr = d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", hour12: false })
    return `${dateStr} ${timeStr}`
  }

  if (formatStr === "PPp" || formatStr.includes("à HH:mm")) {
    const dateStr = d.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })
    const timeStr = d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", hour12: false })
    return `${dateStr} à ${timeStr}`
  }

  if (formatStr === "HH:mm" || formatStr === "p") {
    return d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", hour12: false })
  }

  if (formatStr === "yyyy-MM-dd") {
    return d.toISOString().split("T")[0]
  }

  // Default fallback
  return d.toLocaleDateString(locale)
}

export function format(date: Date | string, formatStr: string): string {
  return formatDate(date, formatStr)
}

export function subDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() - days)
  return result
}

export function subMonths(date: Date, months: number): Date {
  const result = new Date(date)
  result.setMonth(result.getMonth() - months)
  return result
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
}

// Locale object for compatibility
export const fr = {}
