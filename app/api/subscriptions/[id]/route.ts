import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createServerClient()
    const { id } = await params

    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select(`
        *,
        subscription_plans (
          name,
          price,
          currency,
          features
        )
      `)
      .eq("id", id)
      .single()

    if (error || !subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
    }

    return NextResponse.json({ subscription })
  } catch (error) {
    console.error("[v0] Error fetching subscription:", error)
    return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createServerClient()
    const { id } = await params
    const body = await request.json()

    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(`
        *,
        subscription_plans (
          name,
          price,
          currency,
          features
        )
      `)
      .single()

    if (error) {
      console.error("[v0] Error updating subscription:", error)
      return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 })
    }

    return NextResponse.json({ subscription })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createServerClient()
    const { id } = await params

    const { error } = await supabase
      .from("subscriptions")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      console.error("[v0] Error cancelling subscription:", error)
      return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 })
    }

    return NextResponse.json({ message: "Subscription cancelled successfully" })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 })
  }
}
