import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const language = searchParams.get("language")

    let query = supabase.from("channels").select("*").eq("is_active", true).order("display_order", { ascending: true })

    if (category) {
      query = query.eq("category", category)
    }

    const { data: channels, error } = await query

    if (error) {
      console.error("[v0] Error fetching channels:", error)
      return NextResponse.json({ error: "Failed to fetch channels" }, { status: 500 })
    }

    return NextResponse.json({ channels: channels || [], total: channels?.length || 0 })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Failed to fetch channels" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const body = await request.json()
    const { name, category, logo_url } = body

    if (!name || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: channel, error } = await supabase
      .from("channels")
      .insert({
        name,
        category,
        logo_url: logo_url || null,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating channel:", error)
      return NextResponse.json({ error: "Failed to create channel" }, { status: 500 })
    }

    return NextResponse.json({ channel }, { status: 201 })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Failed to create channel" }, { status: 500 })
  }
}
