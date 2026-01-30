import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// Public endpoint to get channels (no auth required)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const premium = searchParams.get("premium")

    let query = supabase.from("channels").select("*")

    if (category) {
      query = query.eq("category", category)
    }

    if (featured === "true") {
      query = query.eq("is_featured", true)
    }

    if (premium === "true") {
      query = query.eq("is_premium", true)
    }

    query = query.order("display_order", { ascending: true })

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching channels:", error)
    return NextResponse.json({ error: "Failed to fetch channels" }, { status: 500 })
  }
}
