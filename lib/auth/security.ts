// lib/auth/security.ts
import crypto from "crypto"

// ============================================================================
// PASSWORD VALIDATION
// ============================================================================

export interface PasswordValidationResult {
  isValid: boolean
  score: number // 0-100
  errors: string[]
  suggestions: string[]
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = []
  const suggestions: string[] = []
  let score = 0

  // Longueur minimum
  if (password.length < 8) {
    errors.push("Le mot de passe doit contenir au moins 8 caractères")
  } else {
    score += 20
    if (password.length >= 12) score += 10
    if (password.length >= 16) score += 10
  }

  // Majuscules
  if (!/[A-Z]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une majuscule")
    suggestions.push("Ajoutez une lettre majuscule")
  } else {
    score += 15
  }

  // Minuscules
  if (!/[a-z]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une minuscule")
    suggestions.push("Ajoutez une lettre minuscule")
  } else {
    score += 15
  }

  // Chiffres
  if (!/[0-9]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins un chiffre")
    suggestions.push("Ajoutez un chiffre")
  } else {
    score += 15
  }

  // Caractères spéciaux
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    suggestions.push("Ajoutez un caractère spécial pour plus de sécurité")
  } else {
    score += 15
  }

  // Vérifier les patterns communs
  const commonPatterns = [
    /^123456/,
    /password/i,
    /qwerty/i,
    /abc123/i,
    /letmein/i,
    /welcome/i,
    /admin/i,
    /(.)\1{2,}/, // Caractères répétés (aaa, 111, etc.)
  ]

  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      errors.push("Le mot de passe contient un pattern trop commun")
      score -= 20
      break
    }
  }

  // Vérifier les séquences
  if (/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password)) {
    suggestions.push("Évitez les séquences de caractères (abc, 123)")
    score -= 10
  }

  score = Math.max(0, Math.min(100, score))

  return {
    isValid: errors.length === 0 && score >= 50,
    score,
    errors,
    suggestions,
  }
}

export function getPasswordStrengthLabel(score: number): { label: string; color: string } {
  if (score < 30) return { label: "Très faible", color: "text-red-500" }
  if (score < 50) return { label: "Faible", color: "text-orange-500" }
  if (score < 70) return { label: "Moyen", color: "text-yellow-500" }
  if (score < 90) return { label: "Fort", color: "text-green-500" }
  return { label: "Très fort", color: "text-emerald-500" }
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

export interface SessionData {
  id: string
  userId: string
  userAgent: string
  ipAddress: string
  createdAt: Date
  lastActivityAt: Date
  expiresAt: Date
  isCurrentSession?: boolean
}

export function generateSessionId(): string {
  return crypto.randomBytes(32).toString("hex")
}

export function hashSessionId(sessionId: string): string {
  return crypto.createHash("sha256").update(sessionId).digest("hex")
}

export function parseUserAgent(userAgent: string): {
  browser: string
  os: string
  device: string
} {
  let browser = "Unknown"
  let os = "Unknown"
  let device = "Desktop"

  // Browser detection
  if (userAgent.includes("Chrome")) browser = "Chrome"
  else if (userAgent.includes("Firefox")) browser = "Firefox"
  else if (userAgent.includes("Safari")) browser = "Safari"
  else if (userAgent.includes("Edge")) browser = "Edge"
  else if (userAgent.includes("Opera")) browser = "Opera"

  // OS detection
  if (userAgent.includes("Windows")) os = "Windows"
  else if (userAgent.includes("Mac OS")) os = "macOS"
  else if (userAgent.includes("Linux")) os = "Linux"
  else if (userAgent.includes("Android")) os = "Android"
  else if (userAgent.includes("iOS") || userAgent.includes("iPhone")) os = "iOS"

  // Device detection
  if (userAgent.includes("Mobile") || userAgent.includes("Android") || userAgent.includes("iPhone")) {
    device = "Mobile"
  } else if (userAgent.includes("Tablet") || userAgent.includes("iPad")) {
    device = "Tablet"
  }

  return { browser, os, device }
}

// ============================================================================
// RATE LIMITING FOR AUTH
// ============================================================================

interface RateLimitEntry {
  count: number
  firstAttempt: number
  blocked: boolean
  blockedUntil?: number
}

const authRateLimits = new Map<string, RateLimitEntry>()

export function checkAuthRateLimit(
  identifier: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000, // 15 minutes
  blockDurationMs: number = 30 * 60 * 1000 // 30 minutes
): { allowed: boolean; remainingAttempts: number; blockedUntil?: Date } {
  const now = Date.now()
  const entry = authRateLimits.get(identifier)

  // Nettoyer les entrées expirées
  if (entry) {
    if (entry.blocked && entry.blockedUntil && now > entry.blockedUntil) {
      authRateLimits.delete(identifier)
    } else if (!entry.blocked && now - entry.firstAttempt > windowMs) {
      authRateLimits.delete(identifier)
    }
  }

  const currentEntry = authRateLimits.get(identifier)

  if (currentEntry?.blocked) {
    return {
      allowed: false,
      remainingAttempts: 0,
      blockedUntil: currentEntry.blockedUntil ? new Date(currentEntry.blockedUntil) : undefined,
    }
  }

  if (!currentEntry) {
    authRateLimits.set(identifier, {
      count: 1,
      firstAttempt: now,
      blocked: false,
    })
    return { allowed: true, remainingAttempts: maxAttempts - 1 }
  }

  currentEntry.count++

  if (currentEntry.count >= maxAttempts) {
    currentEntry.blocked = true
    currentEntry.blockedUntil = now + blockDurationMs
    return {
      allowed: false,
      remainingAttempts: 0,
      blockedUntil: new Date(currentEntry.blockedUntil),
    }
  }

  return { allowed: true, remainingAttempts: maxAttempts - currentEntry.count }
}

export function resetAuthRateLimit(identifier: string): void {
  authRateLimits.delete(identifier)
}

// ============================================================================
// CSRF TOKEN
// ============================================================================

export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

export function verifyCSRFToken(token: string, storedToken: string): boolean {
  if (!token || !storedToken) return false
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(storedToken))
}

// ============================================================================
// SECURE RANDOM
// ============================================================================

export function generateSecureCode(length: number = 6): string {
  const chars = "0123456789"
  let code = ""
  const randomBytes = crypto.randomBytes(length)
  for (let i = 0; i < length; i++) {
    code += chars[randomBytes[i] % chars.length]
  }
  return code
}

export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex")
}
