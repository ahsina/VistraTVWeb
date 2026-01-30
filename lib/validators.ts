export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  password: (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long")
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter")
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter")
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number")
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push("Password must contain at least one special character")
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  },

  phone: (phone: string): boolean => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    return phoneRegex.test(phone.replace(/[\s-]/g, ""))
  },

  creditCard: (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\s/g, "")
    if (!/^\d{13,19}$/.test(cleaned)) return false

    // Luhn algorithm
    let sum = 0
    let isEven = false

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = Number.parseInt(cleaned[i], 10)

      if (isEven) {
        digit *= 2
        if (digit > 9) digit -= 9
      }

      sum += digit
      isEven = !isEven
    }

    return sum % 10 === 0
  },

  cvv: (cvv: string): boolean => {
    return /^\d{3,4}$/.test(cvv)
  },

  expiryDate: (expiry: string): boolean => {
    const [month, year] = expiry.split("/").map((s) => Number.parseInt(s.trim(), 10))
    if (!month || !year) return false

    const now = new Date()
    const currentYear = now.getFullYear() % 100
    const currentMonth = now.getMonth() + 1

    if (month < 1 || month > 12) return false
    if (year < currentYear) return false
    if (year === currentYear && month < currentMonth) return false

    return true
  },

  url: (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },

  required: (value: any): boolean => {
    if (typeof value === "string") return value.trim().length > 0
    if (Array.isArray(value)) return value.length > 0
    return value !== null && value !== undefined
  },

  minLength: (value: string, min: number): boolean => {
    return value.length >= min
  },

  maxLength: (value: string, max: number): boolean => {
    return value.length <= max
  },

  numeric: (value: string): boolean => {
    return /^\d+$/.test(value)
  },

  alphanumeric: (value: string): boolean => {
    return /^[a-zA-Z0-9]+$/.test(value)
  },
}

export function validateForm<T extends Record<string, any>>(
  data: T,
  rules: Partial<Record<keyof T, ((value: any) => boolean | { valid: boolean; errors: string[] })[]>>,
): { valid: boolean; errors: Partial<Record<keyof T, string[]>> } {
  const errors: Partial<Record<keyof T, string[]>> = {}

  for (const field in rules) {
    const fieldRules = rules[field]
    if (!fieldRules) continue

    const fieldErrors: string[] = []
    for (const rule of fieldRules) {
      const result = rule(data[field])
      if (typeof result === "boolean") {
        if (!result) fieldErrors.push(`${String(field)} is invalid`)
      } else if (!result.valid) {
        fieldErrors.push(...result.errors)
      }
    }

    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
