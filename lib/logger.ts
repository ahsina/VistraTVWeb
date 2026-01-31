// lib/logging/logger.ts
// Système de logging centralisé avec alertes

import { createClient } from "@/lib/supabase/admin"

export type LogLevel = "error" | "warn" | "info" | "debug"

export type LogCategory =
  | "payment"
  | "auth"
  | "api"
  | "database"
  | "cron"
  | "email"
  | "webhook"
  | "subscription"
  | "affiliate"
  | "support"
  | "system"

interface LogEntry {
  level: LogLevel
  category: LogCategory
  message: string
  stackTrace?: string
  metadata?: Record<string, unknown>
  userId?: string
  ipAddress?: string
  userAgent?: string
}

interface ActivityLogEntry {
  supabase: ReturnType<typeof createClient>
  userId: string
  action: string
  entityType: string
  entityId?: string
  metadata?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
}

// Seuils pour les alertes
const ALERT_THRESHOLDS = {
  errorCountPerHour: 10,
  paymentFailuresPerHour: 5,
  authFailuresPerMinute: 10,
}

// Logger principal
export async function log(entry: LogEntry): Promise<void> {
  const supabase = createClient()

  try {
    // Insérer le log dans la base de données
    const { error } = await supabase.from("system_logs").insert({
      level: entry.level,
      category: entry.category,
      message: entry.message,
      stack_trace: entry.stackTrace,
      metadata: entry.metadata,
      user_id: entry.userId,
      ip_address: entry.ipAddress,
      user_agent: entry.userAgent,
    })

    if (error) {
      console.error("[Logger] Failed to insert log:", error)
    }

    // Log en console aussi
    const consoleMethod = entry.level === "error" ? console.error : 
                         entry.level === "warn" ? console.warn : 
                         entry.level === "debug" ? console.debug : 
                         console.log

    consoleMethod(`[${entry.level.toUpperCase()}] [${entry.category}] ${entry.message}`, entry.metadata || "")

    // Vérifier si une alerte est nécessaire
    if (entry.level === "error") {
      await checkAndSendAlert(supabase, entry)
    }
  } catch (error) {
    console.error("[Logger] Logging failed:", error)
  }
}

// Raccourcis pour chaque niveau
export const logger = {
  error: (category: LogCategory, message: string, metadata?: Record<string, unknown>, stackTrace?: string) =>
    log({ level: "error", category, message, metadata, stackTrace }),
  
  warn: (category: LogCategory, message: string, metadata?: Record<string, unknown>) =>
    log({ level: "warn", category, message, metadata }),
  
  info: (category: LogCategory, message: string, metadata?: Record<string, unknown>) =>
    log({ level: "info", category, message, metadata }),
  
  debug: (category: LogCategory, message: string, metadata?: Record<string, unknown>) =>
    log({ level: "debug", category, message, metadata }),
}

// Logger d'activité admin
export async function logActivity(entry: ActivityLogEntry): Promise<void> {
  try {
    const { error } = await entry.supabase.from("admin_activity_log").insert({
      admin_id: entry.userId,
      action: entry.action,
      entity_type: entry.entityType,
      entity_id: entry.entityId,
      details: entry.metadata,
      ip_address: entry.ipAddress,
      user_agent: entry.userAgent,
    })

    if (error) {
      console.error("[Logger] Failed to log activity:", error)
    }
  } catch (error) {
    console.error("[Logger] Activity logging failed:", error)
  }
}

// Vérifier et envoyer des alertes
async function checkAndSendAlert(
  supabase: ReturnType<typeof createClient>,
  entry: LogEntry
): Promise<void> {
  try {
    const oneHourAgo = new Date()
    oneHourAgo.setHours(oneHourAgo.getHours() - 1)

    // Compter les erreurs récentes
    const { count: errorCount } = await supabase
      .from("system_logs")
      .select("*", { count: "exact", head: true })
      .eq("level", "error")
      .eq("category", entry.category)
      .gte("created_at", oneHourAgo.toISOString())

    // Si le seuil est atteint, créer une notification admin
    if ((errorCount || 0) >= ALERT_THRESHOLDS.errorCountPerHour) {
      // Vérifier si une alerte n'a pas déjà été envoyée récemment
      const { data: recentAlert } = await supabase
        .from("admin_notifications")
        .select("id")
        .eq("type", "error_alert")
        .eq("title", `Alerte: Erreurs ${entry.category}`)
        .gte("created_at", oneHourAgo.toISOString())
        .limit(1)

      if (!recentAlert || recentAlert.length === 0) {
        await supabase.from("admin_notifications").insert({
          type: "error_alert",
          title: `Alerte: Erreurs ${entry.category}`,
          message: `${errorCount} erreurs détectées dans la catégorie "${entry.category}" au cours de la dernière heure. Dernière erreur: ${entry.message}`,
          priority: "urgent",
          link: "/admin/dashboard/activity-log",
        })

        console.log("[Logger] Alert notification created for category:", entry.category)

        // Optionnel: Envoyer un email d'alerte
        await sendAlertEmail(entry.category, errorCount || 0, entry.message)
      }
    }
  } catch (error) {
    console.error("[Logger] Alert check failed:", error)
  }
}

// Envoyer un email d'alerte (optionnel)
async function sendAlertEmail(category: string, errorCount: number, lastError: string): Promise<void> {
  const alertEmail = process.env.ALERT_EMAIL
  if (!alertEmail) return

  try {
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: alertEmail,
        template: "system_alert",
        data: {
          category,
          errorCount,
          lastError,
          timestamp: new Date().toISOString(),
        },
      }),
    })
  } catch (error) {
    console.error("[Logger] Failed to send alert email:", error)
  }
}

// Capturer les erreurs non gérées
export function setupGlobalErrorHandlers(): void {
  if (typeof window !== "undefined") {
    // Client-side error handling
    window.onerror = (message, source, lineno, colno, error) => {
      logger.error("system", String(message), {
        source,
        lineno,
        colno,
      }, error?.stack)
    }

    window.onunhandledrejection = (event) => {
      logger.error("system", "Unhandled promise rejection", {
        reason: String(event.reason),
      })
    }
  }
}

export default logger
