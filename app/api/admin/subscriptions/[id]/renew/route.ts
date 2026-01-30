import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    // Fetch current subscription
    const { data: subscription, error: fetchError } = await supabase
      .from("subscriptions")
      .select("end_date")
      .eq("id", params.id)
      .single()

    if (fetchError) throw fetchError

    // Extend by 30 days
    const currentEndDate = new Date(subscription.end_date)
    const newEndDate = new Date(currentEndDate)
    newEndDate.setDate(newEndDate.getDate() + 30)

    const { data, error } = await supabase
      .from("subscriptions")
      .update({
        end_date: newEndDate.toISOString(),
        status: "active",
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error renewing subscription:", error)
    return NextResponse.json({ error: "Failed to renew subscription" }, { status: 500 })
  }
}
