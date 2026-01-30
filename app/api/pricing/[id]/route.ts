import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerClient()

    const { data: plan, error } = await supabase.from("subscription_plans").select("*").eq("id", params.id).single()

    if (error || !plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 })
    }

    return NextResponse.json(plan)
  } catch (error) {
    console.error("[v0] Get plan error:", error)
    return NextResponse.json({ error: "Failed to fetch plan" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerClient()
    const updates = await request.json()

    const { data: plan, error } = await supabase
      .from("subscription_plans")
      .update(updates)
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Update plan error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(plan)
  } catch (error) {
    console.error("[v0] PATCH plan error:", error)
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerClient()

    const { error } = await supabase.from("subscription_plans").delete().eq("id", params.id)

    if (error) {
      console.error("[v0] Delete plan error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] DELETE plan error:", error)
    return NextResponse.json({ error: "Failed to delete plan" }, { status: 500 })
  }
}
