import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "30d"

    // Calculate date range based on period
    const now = new Date()
    const periodDays = period === "7d" ? 7 : period === "30d" ? 30 : 90
    const startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000)

    // Get total users and new users
    const { count: totalUsers } = await supabase.from("user_profiles").select("*", { count: "exact", head: true })

    const { count: newUsers } = await supabase
      .from("user_profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startDate.toISOString())

    // Get active subscriptions
    const { count: activeSubscriptions } = await supabase
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")

    // Get total revenue
    const { data: revenueData } = await supabase
      .from("payments")
      .select("amount")
      .eq("status", "completed")
      .gte("created_at", startDate.toISOString())

    const totalRevenue = revenueData?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0

    // Get subscription breakdown
    const { data: subscriptionBreakdown } = await supabase
      .from("subscriptions")
      .select(`
        subscription_plans (
          name
        )
      `)
      .eq("status", "active")

    const planCounts: Record<string, number> = {}
    subscriptionBreakdown?.forEach((sub: any) => {
      const planName = sub.subscription_plans?.name || "Unknown"
      planCounts[planName] = (planCounts[planName] || 0) + 1
    })

    // Get total channels
    const { count: totalChannels } = await supabase
      .from("channels")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)

    const analytics = {
      period,
      users: {
        total: totalUsers || 0,
        active: activeSubscriptions || 0,
        new: newUsers || 0,
        churn: 0, // Would need to calculate from cancelled subscriptions
      },
      revenue: {
        total: totalRevenue,
        mrr: (totalRevenue / periodDays) * 30, // Rough MRR calculation
        growth: 0, // Would need historical data to calculate
      },
      channels: {
        total: totalChannels || 0,
        active: totalChannels || 0,
        mostWatched: [], // Would need view tracking to populate
      },
      subscriptions: planCounts,
    }

    return NextResponse.json({ analytics })
  } catch (error) {
    console.error("[v0] Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
