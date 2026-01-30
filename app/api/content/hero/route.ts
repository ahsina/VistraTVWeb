import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// Public endpoint to get hero content (no auth required)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams
    const language = searchParams.get("language") || "fr"

    const { data, error } = await supabase
      .from("hero_content")
      .select("*")
      .eq("language", language)
      .order("created_at", { ascending: false })
      .limit(1)

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching hero content:", error)
    return NextResponse.json({ error: "Failed to fetch hero content" }, { status: 500 })
  }
}
