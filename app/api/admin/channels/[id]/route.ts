import { createAdminClient } from "@/lib/supabase/admin"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createAdminClient()
    const { id } = params

    const { data: channel, error } = await supabase.from("channels").select("*").eq("id", id).single()

    if (error) throw error

    return NextResponse.json(channel)
  } catch (error) {
    console.error("[v0] Error fetching channel:", error)
    return NextResponse.json({ error: "Failed to fetch channel" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    const { id } = params

    const { data, error } = await supabase.from("channels").update(body).eq("id", id).select().single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error updating channel:", error)
    return NextResponse.json({ error: "Failed to update channel" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    const { id } = params

    const { data, error } = await supabase.from("channels").update(body).eq("id", id).select().single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error updating channel:", error)
    return NextResponse.json({ error: "Failed to update channel" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createAdminClient()
    const { id } = params

    const { error } = await supabase.from("channels").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting channel:", error)
    return NextResponse.json({ error: "Failed to delete channel" }, { status: 500 })
  }
}
