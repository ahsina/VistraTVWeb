import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { type } = await request.json()

    let data = null
    let filename = ""

    switch (type) {
      case "users":
        const { data: users } = await supabase.from("users").select("*").order("created_at", { ascending: false })
        data = users
        filename = "users_export.json"
        break

      case "subscriptions":
        const { data: subscriptions } = await supabase
          .from("subscriptions")
          .select("*, users(email, first_name, last_name)")
          .order("created_at", { ascending: false })
        data = subscriptions
        filename = "subscriptions_export.json"
        break

      case "payments":
        const { data: payments } = await supabase
          .from("payment_transactions")
          .select("*")
          .order("created_at", { ascending: false })
        data = payments
        filename = "payments_export.json"
        break

      case "channels":
        const { data: channels } = await supabase.from("channels").select("*").order("created_at", { ascending: false })
        data = channels
        filename = "channels_export.json"
        break

      case "full":
        const [usersRes, subsRes, paymentsRes, channelsRes] = await Promise.all([
          supabase.from("users").select("*"),
          supabase.from("subscriptions").select("*"),
          supabase.from("payment_transactions").select("*"),
          supabase.from("channels").select("*"),
        ])
        data = {
          users: usersRes.data,
          subscriptions: subsRes.data,
          payments: paymentsRes.data,
          channels: channelsRes.data,
          exportedAt: new Date().toISOString(),
        }
        filename = "full_backup.json"
        break

      default:
        return NextResponse.json({ error: "Invalid export type" }, { status: 400 })
    }

    return NextResponse.json({ data, filename })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 })
  }
}
