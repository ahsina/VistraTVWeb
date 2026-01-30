import { createAdminClient } from "@/lib/supabase/admin"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    const { id } = await params

    const { data, error } = await supabase.from("subscription_plans").update(body).eq("id", id).select().single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error updating subscription plan:", error)
    return NextResponse.json({ error: "Failed to update subscription plan" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createAdminClient()
    const { id } = await params

    const { error } = await supabase.from("subscription_plans").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting subscription plan:", error)
    return NextResponse.json({ error: "Failed to delete subscription plan" }, { status: 500 })
  }
}
