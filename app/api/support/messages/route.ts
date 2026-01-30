import { createAdminClient } from "@/lib/supabase/admin"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ticket_id, sender_id, sender_type, message } = body

    console.log("[v0] Message API called with:", {
      ticket_id,
      sender_id,
      sender_type,
      message: message?.substring(0, 50),
    })

    if (!ticket_id || !sender_type || !message) {
      console.log("[v0] Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("ticket_messages")
      .insert({
        ticket_id,
        sender_id: sender_id === "anonymous" || !sender_id ? null : sender_id,
        sender_type,
        message,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating message:", error)
      throw error
    }

    console.log("[v0] Message created successfully:", data.id)
    return NextResponse.json({ success: true, message: data })
  } catch (error: any) {
    console.error("[v0] Error in message API:", error)
    return NextResponse.json({ error: error.message || "Failed to send message" }, { status: 500 })
  }
}
