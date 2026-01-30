import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select(`
        *,
        subscription_plans (
          name,
          price,
          billing_cycle,
          max_connections,
          video_quality,
          channels_count
        )
      `)
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("[v0] Error fetching subscription:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!subscription) {
      return NextResponse.json({ subscription: null })
    }

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        plan: subscription.subscription_plans,
        status: subscription.status,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
      },
    })
  } catch (error) {
    console.error("[v0] Subscription API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
