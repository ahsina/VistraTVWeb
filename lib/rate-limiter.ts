// lib/utils/rate-limiter.ts
// Utilitaire de rate limiting pour les API

import { createClient } from "@/lib/supabase/admin"

interface RateLimitConfig {
  windowMs: number      // Fenêtre en millisecondes
  maxRequests: number   // Nombre max de requêtes
  blockDurationMs?: number  // Durée du blocage (optionnel)
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: Date
  blocked: boolean
  blockedUntil?: Date
}

// Configurations par défaut pour différents endpoints
export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  // Auth endpoints - plus restrictif
  "auth/login": {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    blockDurationMs: 30 * 60 * 1000, // 30 min de blocage
  },
  "auth/register": {
    windowMs: 60 * 60 * 1000, // 1 heure
    maxRequests: 3,
    blockDurationMs: 60 * 60 * 1000, // 1h de blocage
  },
  "auth/forgot-password": {
    windowMs: 60 * 60 * 1000, // 1 heure
    maxRequests: 3,
  },
  
  // Payment endpoints
  "payment/initiate": {
    windowMs: 60 * 60 * 1000, // 1 heure
    maxRequests: 10,
  },
  "payment/webhook": {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // Webhooks peuvent être fréquents
  },
  
  // Support
  "support/tickets": {
    windowMs: 60 * 60 * 1000, // 1 heure
    maxRequests: 5,
  },
  
  // Promo codes
  "promo-codes/validate": {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
  },
  
  // Analytics
  "analytics/track": {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
  },
  
  // Default
  default: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60,
  },
}

// Rate limiter en mémoire (pour le développement et les petites instances)
const inMemoryStore = new Map<string, { count: number; windowStart: number; blockedUntil?: number }>()

export async function checkRateLimit(
  identifier: string,
  endpoint: string,
  useDatabase: boolean = false
): Promise<RateLimitResult> {
  const config = RATE_LIMIT_CONFIGS[endpoint] || RATE_LIMIT_CONFIGS.default
  const key = `${identifier}:${endpoint}`
  const now = Date.now()

  if (useDatabase) {
    return checkRateLimitDatabase(identifier, endpoint, config)
  }

  // Rate limiting en mémoire
  const record = inMemoryStore.get(key)

  // Vérifier si bloqué
  if (record?.blockedUntil && record.blockedUntil > now) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(record.blockedUntil),
      blocked: true,
      blockedUntil: new Date(record.blockedUntil),
    }
  }

  // Nouvelle fenêtre ou fenêtre expirée
  if (!record || now - record.windowStart >= config.windowMs) {
    inMemoryStore.set(key, { count: 1, windowStart: now })
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: new Date(now + config.windowMs),
      blocked: false,
    }
  }

  // Incrémenter le compteur
  record.count++
  
  // Vérifier si limite atteinte
  if (record.count > config.maxRequests) {
    // Appliquer le blocage si configuré
    if (config.blockDurationMs) {
      record.blockedUntil = now + config.blockDurationMs
    }
    
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(record.windowStart + config.windowMs),
      blocked: !!record.blockedUntil,
      blockedUntil: record.blockedUntil ? new Date(record.blockedUntil) : undefined,
    }
  }

  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetAt: new Date(record.windowStart + config.windowMs),
    blocked: false,
  }
}

// Rate limiting via base de données (pour production distribuée)
async function checkRateLimitDatabase(
  identifier: string,
  endpoint: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const supabase = createClient()
  const now = new Date()
  const windowStart = new Date(now.getTime() - config.windowMs)

  try {
    // Chercher un enregistrement existant
    const { data: existing } = await supabase
      .from("api_rate_limits")
      .select("*")
      .eq("identifier", identifier)
      .eq("endpoint", endpoint)
      .single()

    // Vérifier si bloqué
    if (existing?.blocked_until && new Date(existing.blocked_until) > now) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(existing.blocked_until),
        blocked: true,
        blockedUntil: new Date(existing.blocked_until),
      }
    }

    // Fenêtre expirée ou nouveau
    if (!existing || new Date(existing.window_start) < windowStart) {
      await supabase
        .from("api_rate_limits")
        .upsert({
          identifier,
          endpoint,
          request_count: 1,
          window_start: now.toISOString(),
          blocked_until: null,
          updated_at: now.toISOString(),
        })

      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetAt: new Date(now.getTime() + config.windowMs),
        blocked: false,
      }
    }

    // Incrémenter
    const newCount = existing.request_count + 1

    // Limite atteinte ?
    if (newCount > config.maxRequests) {
      const blockedUntil = config.blockDurationMs
        ? new Date(now.getTime() + config.blockDurationMs)
        : null

      await supabase
        .from("api_rate_limits")
        .update({
          request_count: newCount,
          blocked_until: blockedUntil?.toISOString(),
          updated_at: now.toISOString(),
        })
        .eq("id", existing.id)

      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(new Date(existing.window_start).getTime() + config.windowMs),
        blocked: !!blockedUntil,
        blockedUntil: blockedUntil || undefined,
      }
    }

    // Mettre à jour le compteur
    await supabase
      .from("api_rate_limits")
      .update({
        request_count: newCount,
        updated_at: now.toISOString(),
      })
      .eq("id", existing.id)

    return {
      allowed: true,
      remaining: config.maxRequests - newCount,
      resetAt: new Date(new Date(existing.window_start).getTime() + config.windowMs),
      blocked: false,
    }
  } catch (error) {
    console.error("[v0] Rate limit check error:", error)
    // En cas d'erreur, permettre la requête (fail open)
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetAt: new Date(now.getTime() + config.windowMs),
      blocked: false,
    }
  }
}

// Middleware helper pour Next.js
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(RATE_LIMIT_CONFIGS.default.maxRequests),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": result.resetAt.toISOString(),
    ...(result.blocked && result.blockedUntil
      ? { "X-RateLimit-Blocked-Until": result.blockedUntil.toISOString() }
      : {}),
  }
}

// Nettoyer les entrées expirées (à appeler périodiquement)
export function cleanupInMemoryStore() {
  const now = Date.now()
  const maxAge = 24 * 60 * 60 * 1000 // 24 heures

  for (const [key, record] of inMemoryStore.entries()) {
    if (now - record.windowStart > maxAge) {
      inMemoryStore.delete(key)
    }
  }
}

// Lancer le nettoyage périodiquement
if (typeof setInterval !== "undefined") {
  setInterval(cleanupInMemoryStore, 60 * 60 * 1000) // Toutes les heures
}
