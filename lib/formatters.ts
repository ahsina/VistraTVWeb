export const formatters = {
  currency: (amount: number, currency = "EUR"): string => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
    }).format(amount)
  },

  number: (num: number, locale = "fr-FR"): string => {
    return new Intl.NumberFormat(locale).format(num)
  },

  date: (date: Date | string, locale = "fr-FR"): string => {
    const d = typeof date === "string" ? new Date(date) : date
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d)
  },

  dateTime: (date: Date | string, locale = "fr-FR"): string => {
    const d = typeof date === "string" ? new Date(date) : date
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d)
  },

  relativeTime: (date: Date | string, locale = "fr-FR"): string => {
    const d = typeof date === "string" ? new Date(date) : date
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })

    if (diffInSeconds < 60) return rtf.format(-diffInSeconds, "second")
    if (diffInSeconds < 3600) return rtf.format(-Math.floor(diffInSeconds / 60), "minute")
    if (diffInSeconds < 86400) return rtf.format(-Math.floor(diffInSeconds / 3600), "hour")
    if (diffInSeconds < 2592000) return rtf.format(-Math.floor(diffInSeconds / 86400), "day")
    if (diffInSeconds < 31536000) return rtf.format(-Math.floor(diffInSeconds / 2592000), "month")
    return rtf.format(-Math.floor(diffInSeconds / 31536000), "year")
  },

  fileSize: (bytes: number): string => {
    const units = ["B", "KB", "MB", "GB", "TB"]
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`
  },

  duration: (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`
    }
    return `${secs}s`
  },

  truncate: (text: string, maxLength: number, suffix = "..."): string => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength - suffix.length) + suffix
  },

  capitalize: (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
  },

  titleCase: (text: string): string => {
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  },

  slug: (text: string): string => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  },

  phoneNumber: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, "")
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5")
    }
    return phone
  },

  creditCard: (cardNumber: string): string => {
    const cleaned = cardNumber.replace(/\s/g, "")
    return cleaned.replace(/(\d{4})/g, "$1 ").trim()
  },

  percentage: (value: number, total: number): string => {
    const percentage = (value / total) * 100
    return `${percentage.toFixed(1)}%`
  },
}
