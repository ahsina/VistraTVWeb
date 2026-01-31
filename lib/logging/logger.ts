import { createClient } from "@supabase/supabase-js"

type LogLevel = "error" | "warn" | "info" | "debug"
type LogCategory = "payment" | "auth" | "api" | "database" | "webhook" | "email" | "general"

interface LogOptions {
  level: LogLevel
  category: LogCategory
  message: string
  stackTrace?: string
  metadata?: Record<string, any>
  userId?: string
  ipAddress?: string
  userAgent?: string
}

export async function logToDatabase(options: LogOptions) {
  const { level, category, message, stackTrace, metadata, userId, ipAddress, userAgent } = options

  // Always log to console first
  const consoleMessage = `[${level.toUpperCase()}] [${category}] ${message}`
  if (level === "error") {
    console.error(consoleMessage, metadata)
  } else if (level === "warn") {
    console.warn(consoleMessage, metadata)
  } else {
    console.log(consoleMessage, metadata)
  }

  // Log to database
  try {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    await supabase.from("system_logs").insert({
      level,
      category,
      message,
      stack_trace: stackTrace,
      metadata: metadata || null,
      user_id: userId || null,
      ip_address: ipAddress,
      user_agent: userAgent,
    })
  } catch (error) {
    // Don't let logging errors break the app
    console.error("[v0] Failed to log to database:", error)
  }
}

// Convenience methods
export const logger = {
  error: (category: LogCategory, message: string, metadata?: Record<string, any>) =>
    logToDatabase({ level: "error", category, message, metadata }),

  warn: (category: LogCategory, message: string, metadata?: Record<string, any>) =>
    logToDatabase({ level: "warn", category, message, metadata }),

  info: (category: LogCategory, message: string, metadata?: Record<string, any>) =>
    logToDatabase({ level: "info", category, message, metadata }),

  debug: (category: LogCategory, message: string, metadata?: Record<string, any>) =>
    logToDatabase({ level: "debug", category, message, metadata }),
}


export async function logActivity(action: string, details?: any) {
  console.log("[Activity]", action, details)
}

export async function logWebhook(provider: string, status: string, data?: any) {
  console.log("[Webhook]", provider, status, data)
}