import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "pending"

    const { data, error } = await supabase
      .from("abandoned_payment_reminders")
      .select(
        `
        *,
        transaction:payment_transactions(*)
      `,
      )
      .eq("status", status)
      .order("created_at", { ascending: false })
      .limit(100)

    if (error) {
      console.error("[v0] Error fetching abandoned payments:", error)
      return NextResponse.json({ error: "Failed to fetch abandoned payments" }, { status: 500 })
    }

    return NextResponse.json({ abandonedPayments: data })
  } catch (error) {
    console.error("[v0] Error in abandoned payments route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
