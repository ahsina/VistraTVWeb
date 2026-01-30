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

    const { data: profile, error } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single()

    if (error && error.code !== "PGRST116") {
      console.error("[v0] Error fetching profile:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: profile?.full_name || user.user_metadata?.name || "",
      avatar: profile?.avatar_url || user.user_metadata?.avatar_url,
      phone: profile?.phone,
      created_at: user.created_at,
    })
  } catch (error) {
    console.error("[v0] Profile API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const body = await request.json()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update user_profiles table
    const { data: profile, error } = await supabase
      .from("user_profiles")
      .upsert(
        {
          user_id: user.id,
          full_name: body.name,
          phone: body.phone,
          avatar_url: body.avatar,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        },
      )
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating profile:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      profile,
    })
  } catch (error) {
    console.error("[v0] Update profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
