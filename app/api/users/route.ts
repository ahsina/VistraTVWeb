import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const { data: profiles, error } = await supabase
      .from("user_profiles")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching users:", error)
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }

    let filteredProfiles = profiles || []

    // Filter by subscription status if provided
    if (status) {
      filteredProfiles = filteredProfiles.filter((profile) => profile.subscription_status === status)
    }

    return NextResponse.json({ users: filteredProfiles, total: filteredProfiles.length })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const body = await request.json()
    const { email, password, full_name } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: full_name || "",
        },
      },
    })

    if (authError || !authData.user) {
      console.error("[v0] Error creating user:", authError)
      return NextResponse.json({ error: authError?.message || "Failed to create user" }, { status: 500 })
    }

    // Create user profile
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .insert({
        id: authData.user.id,
        full_name: full_name || "",
        subscription_status: "free",
      })
      .select()
      .single()

    if (profileError) {
      console.error("[v0] Error creating profile:", profileError)
    }

    return NextResponse.json({ user: profile || authData.user }, { status: 201 })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
