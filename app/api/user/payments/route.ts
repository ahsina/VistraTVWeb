import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: payments, error } = await supabase
      .from("payments")
      .select(`
        id,
        amount,
        currency,
        status,
        payment_method,
        created_at,
        subscription_plans (
          name
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching user payments:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const formattedPayments = payments?.map((payment) => ({
      id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      method: payment.payment_method,
      plan: payment.subscription_plans?.name || "N/A",
      date: new Date(payment.created_at).toISOString().split("T")[0],
    }))

    return NextResponse.json({ payments: formattedPayments || [] })
  } catch (error) {
    console.error("[v0] User payments API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
