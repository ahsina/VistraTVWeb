import { createAdminClient } from "@/lib/supabase/admin"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    const { id } = await params

    const { data, error } = await supabase.from("hero_content").update(body).eq("id", id).select().single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error updating hero content:", error)
    return NextResponse.json({ error: "Failed to update hero content" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createAdminClient()
    const { id } = await params

    const { error } = await supabase.from("hero_content").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting hero content:", error)
    return NextResponse.json({ error: "Failed to delete hero content" }, { status: 500 })
  }
}
