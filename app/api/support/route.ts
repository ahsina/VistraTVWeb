import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const body = await request.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Create support ticket in database
    const { data: ticket, error } = await supabase
      .from("support_tickets")
      .insert([
        {
          user_id: user?.id || null,
          name: body.name,
          email: body.email,
          subject: body.subject,
          message: body.message,
          priority: body.priority || "medium",
          status: "open",
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating support ticket:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      ticket,
      message: "Support request submitted successfully",
    })
  } catch (error) {
    console.error("[v0] Support API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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

    const { data: tickets, error } = await supabase
      .from("support_tickets")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching tickets:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ tickets })
  } catch (error) {
    console.error("[v0] Support GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
