// app/api/cron/cleanup/route.ts
// Cron job pour nettoyer les données anciennes
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/admin"

const CRON_SECRET = process.env.CRON_SECRET

export async function GET(request: NextRequest) {
  // Vérification de la clé secrète
  const authHeader = request.headers.get("authorization")
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createClient()
  const results = {
    expiredSessions: 0,
    oldLogs: 0,
    oldAnalytics: 0,
    oldRateLimits: 0,
    errors: [] as string[],
  }

  try {
    const now = new Date()

    // 1. Nettoyer les sessions admin expirées
    try {
      const { count } = await supabase
        .from("admin_sessions")
        .delete()
        .lt("expires_at", now.toISOString())
        .select("*", { count: "exact", head: true })

      results.expiredSessions = count || 0
    } catch (error) {
      results.errors.push(`Sessions cleanup error: ${error}`)
    }

    // 2. Nettoyer les logs système anciens (> 30 jours)
    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    try {
      const { count } = await supabase
        .from("system_logs")
        .delete()
        .lt("created_at", thirtyDaysAgo.toISOString())
        .neq("level", "error") // Garder les erreurs plus longtemps
        .select("*", { count: "exact", head: true })

      results.oldLogs = count || 0
    } catch (error) {
      results.errors.push(`Logs cleanup error: ${error}`)
    }

    // 3. Nettoyer les analytics anciennes (> 90 jours)
    const ninetyDaysAgo = new Date(now)
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

    try {
      const { count } = await supabase
        .from("analytics_events")
        .delete()
        .lt("created_at", ninetyDaysAgo.toISOString())
        .select("*", { count: "exact", head: true })

      results.oldAnalytics = count || 0
    } catch (error) {
      results.errors.push(`Analytics cleanup error: ${error}`)
    }

    // 4. Nettoyer les rate limits expirés
    const oneDayAgo = new Date(now)
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)

    try {
      const { count } = await supabase
        .from("api_rate_limits")
        .delete()
        .lt("window_start", oneDayAgo.toISOString())
        .select("*", { count: "exact", head: true })

      results.oldRateLimits = count || 0
    } catch (error) {
      results.errors.push(`Rate limits cleanup error: ${error}`)
    }

    // Log des résultats
    await supabase.from("system_logs").insert({
      level: "info",
      category: "cron",
      message: "Cleanup cron completed",
      metadata: results,
    })

    console.log("[v0] Cleanup cron completed:", results)

    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Cleanup cron error:", error)

    await supabase.from("system_logs").insert({
      level: "error",
      category: "cron",
      message: "Cleanup cron failed",
      metadata: { error: String(error) },
    })

    return NextResponse.json(
      { error: "Cron job failed", details: String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
