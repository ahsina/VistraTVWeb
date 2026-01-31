import { createClient } from "@supabase/supabase-js"
import type { NextRequest } from "next/server"

interface RateLimitConfig {
  maxRequests: number // Max requests per window
  windowMs: number // Time window in milliseconds
}

// Default rate limit: 100 requests per minute
const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 100,
  windowMs: 60 * 1000,
}

export async function checkRateLimit(
  request: NextRequest,
  endpoint: string,
  config: RateLimitConfig = DEFAULT_RATE_LIMIT,
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const identifier = getIdentifier(request)
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  try {
    const now = new Date()
    const windowStart = new Date(now.getTime() - config.windowMs)

    // Get or create rate limit record
    const { data: existing } = await supabase
      .from("api_rate_limits")
      .select("*")
      .eq("identifier", identifier)
      .eq("endpoint", endpoint)
      .gte("window_start", windowStart.toISOString())
      .single()

    if (!existing) {
      // First request in this window
      await supabase.from("api_rate_limits").insert({
        identifier,
        endpoint,
        request_count: 1,
        window_start: now.toISOString(),
      })

      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetAt: new Date(now.getTime() + config.windowMs),
      }
    }

    // Check if blocked
    if (existing.blocked_until && new Date(existing.blocked_until) > now) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(existing.blocked_until),
      }
    }

    // Check if limit exceeded
    if (existing.request_count >= config.maxRequests) {
      const blockUntil = new Date(now.getTime() + config.windowMs)
      await supabase.from("api_rate_limits").update({ blocked_until: blockUntil.toISOString() }).eq("id", existing.id)

      return {
        allowed: false,
        remaining: 0,
        resetAt: blockUntil,
      }
    }

    // Increment counter
    await supabase
      .from("api_rate_limits")
      .update({
        request_count: existing.request_count + 1,
        updated_at: now.toISOString(),
      })
      .eq("id", existing.id)

    return {
      allowed: true,
      remaining: config.maxRequests - existing.request_count - 1,
      resetAt: new Date(new Date(existing.window_start).getTime() + config.windowMs),
    }
  } catch (error) {
    console.error("[v0] Rate limit check failed:", error)
    // On error, allow the request but log it
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetAt: new Date(Date.now() + config.windowMs),
    }
  }
}

function getIdentifier(request: NextRequest): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  const cfConnectingIp = request.headers.get("cf-connecting-ip")

  return cfConnectingIp || forwarded?.split(",")[0] || realIp || "unknown"
}


// AJOUTE ces lignes à la fin de ton fichier lib/middleware/rate-limiter.ts

// Alias pour compatibilité avec les imports existants
export async function applyRateLimit(
  request: NextRequest,
  endpoint: string,
  maxRequests: number = 100
): Promise<{ success: boolean; remaining: number }> {
  const result = await checkRateLimit(request, endpoint, { maxRequests, windowMs: 60000 })
  return {
    success: result.allowed,
    remaining: result.remaining,
  }
}