import { createAdminClient } from "@/lib/supabase/admin"
import { type NextRequest, NextResponse } from "next/server"
import { applyRateLimit } from "@/lib/middleware/rate-limiter"
import { logActivity } from "@/lib/logging/logger"

export async function GET(request: NextRequest) {
  const rateLimitResult = await applyRateLimit(request, "admin-users-list", 30)
  if (!rateLimitResult.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  try {
    const supabase = createAdminClient()

    // Get all users from auth.users (admin only operation)
    const { data, error } = await supabase.auth.admin.listUsers()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data.users)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const rateLimitResult = await applyRateLimit(request, "admin-users-create", 10)
  if (!rateLimitResult.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  try {
    const supabase = createAdminClient()
    const body = await request.json()

    const { email, password, metadata } = body

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: metadata,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      await logActivity({
        supabase,
        userId: user.id,
        action: "create_user",
        entityType: "user",
        entityId: data.user.id,
        metadata: { email },
      })
    }

    return NextResponse.json(data.user)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const rateLimitResult = await applyRateLimit(request, "admin-users-delete", 10)
  if (!rateLimitResult.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("id")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const { error } = await supabase.auth.admin.deleteUser(userId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      await logActivity({
        supabase,
        userId: user.id,
        action: "delete_user",
        entityType: "user",
        entityId: userId,
        metadata: {},
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
