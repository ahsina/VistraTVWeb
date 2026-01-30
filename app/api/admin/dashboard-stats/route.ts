import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get real-time stats
    const [usersCount, activeSubscriptions, totalRevenue, todayRevenue, pendingPayments, abandonedCarts] =
      await Promise.all([
        supabase.from("users").select("id", { count: "exact", head: true }),
        supabase.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("payment_transactions").select("final_amount").eq("status", "completed"),
        supabase
          .from("payment_transactions")
          .select("final_amount")
          .eq("status", "completed")
          .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
        supabase.from("payment_transactions").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase
          .from("payment_transactions")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending")
          .lt("created_at", new Date(Date.now() - 30 * 60 * 1000).toISOString()),
      ])

    const totalRevenueSum =
      totalRevenue.data?.reduce((sum, transaction) => sum + (transaction.final_amount || 0), 0) || 0

    const todayRevenueSum =
      todayRevenue.data?.reduce((sum, transaction) => sum + (transaction.final_amount || 0), 0) || 0

    return NextResponse.json({
      totalUsers: usersCount.count || 0,
      activeSubscriptions: activeSubscriptions.count || 0,
      totalRevenue: totalRevenueSum,
      todayRevenue: todayRevenueSum,
      pendingPayments: pendingPayments.count || 0,
      abandonedCarts: abandonedCarts.count || 0,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
