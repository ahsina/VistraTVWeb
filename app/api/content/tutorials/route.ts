import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// Public endpoint to get tutorials (no auth required)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams
    const language = searchParams.get("language") || "fr"

    const { data, error } = await supabase
      .from("tutorial_devices")
      .select("*")
      .eq("language", language)
      .order("display_order", { ascending: true })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("[v0] Error fetching tutorials:", error)
    return NextResponse.json({ error: "Failed to fetch tutorials" }, { status: 500 })
  }
}
