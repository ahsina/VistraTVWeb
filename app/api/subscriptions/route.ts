import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    let query = supabase
      .from("subscriptions")
      .select(`
        *,
        subscription_plans (
          name,
          price,
          currency,
          features
        )
      `)
      .order("created_at", { ascending: false })

    if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data: subscriptions, error } = await query

    if (error) {
      console.error("[v0] Error fetching subscriptions:", error)
      return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 })
    }

    return NextResponse.json({ subscriptions: subscriptions || [] })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const body = await request.json()
    const { user_id, plan_id, price, duration_months = 1 } = body

    if (!user_id || !plan_id || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Calculate end date
    const startDate = new Date()
    const endDate = new Date(startDate)
    endDate.setMonth(endDate.getMonth() + duration_months)

    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .insert({
        user_id,
        plan_id,
        price,
        status: "active",
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      })
      .select(`
        *,
        subscription_plans (
          name,
          price,
          currency,
          features
        )
      `)
      .single()

    if (error) {
      console.error("[v0] Error creating subscription:", error)
      return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
    }

    return NextResponse.json({ subscription }, { status: 201 })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
  }
}
