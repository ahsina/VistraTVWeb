import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    const { data: plans, error } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("is_active", true)
      .order("price", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching pricing plans:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform to match frontend expected format
    const formattedPlans = plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      period: plan.billing_cycle || "mo",
      connections: plan.max_connections,
      quality: plan.video_quality,
      channels: plan.channels_count,
      isPopular: plan.is_popular || false,
      badge: plan.badge || undefined,
      features: plan.features || [],
    }))

    return NextResponse.json(formattedPlans)
  } catch (error) {
    console.error("[v0] Pricing API error:", error)
    return NextResponse.json({ error: "Failed to fetch pricing plans" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const plan = await request.json()

    const { data: newPlan, error } = await supabase
      .from("subscription_plans")
      .insert([
        {
          name: plan.name,
          price: plan.price,
          billing_cycle: plan.period || "monthly",
          max_connections: plan.connections,
          video_quality: plan.quality,
          channels_count: plan.channels,
          is_popular: plan.isPopular || false,
          badge: plan.badge,
          features: plan.features || [],
          is_active: true,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating plan:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(newPlan, { status: 201 })
  } catch (error) {
    console.error("[v0] Create plan error:", error)
    return NextResponse.json({ error: "Failed to create plan" }, { status: 500 })
  }
}
