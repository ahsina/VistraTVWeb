// app/api/cron/subscriptions/route.ts
// Cron job pour gérer les expirations d'abonnements
// À exécuter quotidiennement via Vercel Cron ou un service externe

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/admin"
import { sendEmail } from "@/lib/email/email-service"

// Clé secrète pour sécuriser le cron
const CRON_SECRET = process.env.CRON_SECRET

export async function GET(request: NextRequest) {
  // Vérification de la clé secrète
  const authHeader = request.headers.get("authorization")
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createClient()
  const results = {
    expiring7days: 0,
    expiring3days: 0,
    expiring1day: 0,
    expired: 0,
    errors: [] as string[],
  }

  try {
    const now = new Date()

    // 1. Abonnements expirant dans 7 jours
    const in7Days = new Date(now)
    in7Days.setDate(in7Days.getDate() + 7)
    const in7DaysStart = new Date(in7Days)
    in7DaysStart.setHours(0, 0, 0, 0)
    const in7DaysEnd = new Date(in7Days)
    in7DaysEnd.setHours(23, 59, 59, 999)

    const { data: expiring7 } = await supabase
      .from("subscriptions")
      .select(`
        *,
        user_profiles!inner(email, full_name),
        subscription_plans(name)
      `)
      .eq("status", "active")
      .gte("end_date", in7DaysStart.toISOString())
      .lte("end_date", in7DaysEnd.toISOString())
      .is("expiry_notified_7d", null)

    for (const sub of expiring7 || []) {
      try {
        const email = sub.user_profiles?.email
        if (email) {
          await sendEmail({
            to: email,
            template: "subscription_expiring",
            data: {
              userName: sub.user_profiles?.full_name || "",
              planName: sub.subscription_plans?.name || "VistraTV",
              daysRemaining: 7,
              expirationDate: new Date(sub.end_date).toLocaleDateString("fr-FR"),
            },
          })

          // Marquer comme notifié
          await supabase
            .from("subscriptions")
            .update({ expiry_notified_7d: new Date().toISOString() })
            .eq("id", sub.id)

          results.expiring7days++
        }
      } catch (error) {
        results.errors.push(`7d notification error for ${sub.id}: ${error}`)
      }
    }

    // 2. Abonnements expirant dans 3 jours
    const in3Days = new Date(now)
    in3Days.setDate(in3Days.getDate() + 3)
    const in3DaysStart = new Date(in3Days)
    in3DaysStart.setHours(0, 0, 0, 0)
    const in3DaysEnd = new Date(in3Days)
    in3DaysEnd.setHours(23, 59, 59, 999)

    const { data: expiring3 } = await supabase
      .from("subscriptions")
      .select(`
        *,
        user_profiles!inner(email, full_name),
        subscription_plans(name)
      `)
      .eq("status", "active")
      .gte("end_date", in3DaysStart.toISOString())
      .lte("end_date", in3DaysEnd.toISOString())
      .is("expiry_notified_3d", null)

    for (const sub of expiring3 || []) {
      try {
        const email = sub.user_profiles?.email
        if (email) {
          await sendEmail({
            to: email,
            template: "subscription_expiring",
            data: {
              userName: sub.user_profiles?.full_name || "",
              planName: sub.subscription_plans?.name || "VistraTV",
              daysRemaining: 3,
              expirationDate: new Date(sub.end_date).toLocaleDateString("fr-FR"),
            },
          })

          await supabase
            .from("subscriptions")
            .update({ expiry_notified_3d: new Date().toISOString() })
            .eq("id", sub.id)

          results.expiring3days++
        }
      } catch (error) {
        results.errors.push(`3d notification error for ${sub.id}: ${error}`)
      }
    }

    // 3. Abonnements expirant demain
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStart = new Date(tomorrow)
    tomorrowStart.setHours(0, 0, 0, 0)
    const tomorrowEnd = new Date(tomorrow)
    tomorrowEnd.setHours(23, 59, 59, 999)

    const { data: expiring1 } = await supabase
      .from("subscriptions")
      .select(`
        *,
        user_profiles!inner(email, full_name),
        subscription_plans(name)
      `)
      .eq("status", "active")
      .gte("end_date", tomorrowStart.toISOString())
      .lte("end_date", tomorrowEnd.toISOString())
      .is("expiry_notified_1d", null)

    for (const sub of expiring1 || []) {
      try {
        const email = sub.user_profiles?.email
        if (email) {
          await sendEmail({
            to: email,
            template: "subscription_expiring",
            data: {
              userName: sub.user_profiles?.full_name || "",
              planName: sub.subscription_plans?.name || "VistraTV",
              daysRemaining: 1,
              expirationDate: new Date(sub.end_date).toLocaleDateString("fr-FR"),
            },
          })

          await supabase
            .from("subscriptions")
            .update({ expiry_notified_1d: new Date().toISOString() })
            .eq("id", sub.id)

          results.expiring1day++
        }
      } catch (error) {
        results.errors.push(`1d notification error for ${sub.id}: ${error}`)
      }
    }

    // 4. Abonnements expirés (mettre à jour le statut)
    const { data: expired } = await supabase
      .from("subscriptions")
      .select(`
        *,
        user_profiles(email, full_name),
        subscription_plans(name)
      `)
      .eq("status", "active")
      .lt("end_date", now.toISOString())

    for (const sub of expired || []) {
      try {
        // Mettre à jour le statut
        await supabase
          .from("subscriptions")
          .update({ status: "expired" })
          .eq("id", sub.id)

        // Envoyer email d'expiration
        const email = sub.user_profiles?.email
        if (email) {
          await sendEmail({
            to: email,
            template: "subscription_expired",
            data: {
              userName: sub.user_profiles?.full_name || "",
              planName: sub.subscription_plans?.name || "VistraTV",
              expirationDate: new Date(sub.end_date).toLocaleDateString("fr-FR"),
            },
          })
        }

        results.expired++
      } catch (error) {
        results.errors.push(`Expiration error for ${sub.id}: ${error}`)
      }
    }

    // Log des résultats
    await supabase.from("system_logs").insert({
      level: "info",
      category: "cron",
      message: "Subscription expiration cron completed",
      metadata: results,
    })

    console.log("[v0] Subscription cron completed:", results)

    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Subscription cron error:", error)

    await supabase.from("system_logs").insert({
      level: "error",
      category: "cron",
      message: "Subscription expiration cron failed",
      metadata: { error: String(error) },
    })

    return NextResponse.json(
      { error: "Cron job failed", details: String(error) },
      { status: 500 }
    )
  }
}

// Support POST pour compatibilité
export async function POST(request: NextRequest) {
  return GET(request)
}
