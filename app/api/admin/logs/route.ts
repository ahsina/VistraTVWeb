import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "all"
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: adminProfile } = await supabase.from("admin_profiles").select("is_admin").eq("id", user.id).single()

    if (!adminProfile?.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    let query = supabase.from("system_logs").select("*").order("created_at", { ascending: false }).limit(limit)

    if (type !== "all") {
      query = query.eq("level", type)
    }

    const { data: logs, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(logs || [])
  } catch (error) {
    console.error("[v0] Error fetching logs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
