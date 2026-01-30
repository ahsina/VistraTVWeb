import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: adminProfile } = await supabase.from("admin_profiles").select("is_admin").eq("id", user.id).single()

    if (!adminProfile?.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "all" // 'all' or 'unconverted'

    let emails: { email: string; status: string; created_at: string }[] = []

    if (type === "unconverted") {
      // Export only unconverted abandoned payments (pending and expired)
      const { data, error } = await supabase
        .from("abandoned_payment_reminders")
        .select("email, status, created_at")
        .in("status", ["pending", "expired"])
        .order("created_at", { ascending: false })

      if (error) {
        console.error("[v0] Error fetching unconverted emails:", error)
        return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 })
      }

      emails = data || []
    } else {
      // Export all emails from payment_transactions
      const { data, error } = await supabase
        .from("payment_transactions")
        .select("email, status, created_at")
        .not("email", "is", null)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("[v0] Error fetching all emails:", error)
        return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 })
      }

      emails = data || []
    }

    // Remove duplicates and format as CSV
    const uniqueEmails = Array.from(new Set(emails.map((e) => e.email)))
    const csvHeader = "Email,Status,Date\n"
    const csvRows = emails
      .map((e) => `${e.email},${e.status},${new Date(e.created_at).toLocaleString("fr-FR")}`)
      .join("\n")
    const csv = csvHeader + csvRows

    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="emails-${type}-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("[v0] Error in export route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
