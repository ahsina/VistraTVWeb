import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/admin"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()

    const { data: content, error } = await supabase.from("content").select("*").eq("id", params.id).single()

    if (error) throw error

    return NextResponse.json(content)
  } catch (error) {
    console.error("[v0] Error fetching content:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { data, error } = await supabase.from("content").update(body).eq("id", params.id).select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("[v0] Error updating content:", error)
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("content").delete().eq("id", params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting content:", error)
    return NextResponse.json({ error: "Failed to delete content" }, { status: 500 })
  }
}
