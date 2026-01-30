import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// Public endpoint to get subscription plans (no auth required)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams
    const language = searchParams.get("language") || "fr"

    console.log("[v0] Fetching subscription plans for language:", language)

    const { data, error } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("language", language)
      .eq("is_active", true)
      .order("display_order", { ascending: true })

    console.log("[v0] Subscription plans query result:", { data, error })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching subscription plans:", error)
    return NextResponse.json({ error: "Failed to fetch subscription plans" }, { status: 500 })
  }
}
