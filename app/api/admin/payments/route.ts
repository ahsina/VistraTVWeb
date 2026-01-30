import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createAdminClient()

    const { data: payments, error } = await supabase
      .from("payments")
      .select(`
        id,
        amount,
        status,
        payment_method,
        created_at,
        user_id,
        plan_id
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching payments:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const formattedPayments = await Promise.all(
      (payments || []).map(async (payment) => {
        // Get user data
        const { data: userData } = await supabase.auth.admin.getUserById(payment.user_id)

        // Get plan data
        const { data: planData } = await supabase
          .from("subscription_plans")
          .select("name")
          .eq("id", payment.plan_id)
          .single()

        return {
          id: payment.id,
          user: userData?.user?.user_metadata?.name || userData?.user?.email || "Unknown",
          email: userData?.user?.email || "N/A",
          amount: payment.amount,
          plan: planData?.name || "N/A",
          status: payment.status,
          date: new Date(payment.created_at).toISOString().split("T")[0],
          method: payment.payment_method || "N/A",
        }
      }),
    )

    return NextResponse.json(formattedPayments)
  } catch (error) {
    console.error("[v0] Payments API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
