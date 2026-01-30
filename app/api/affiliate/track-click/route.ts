import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { affiliateCode } = await request.json()

    if (!affiliateCode) {
      return NextResponse.json({ error: "Affiliate code required" }, { status: 400 })
    }

    // Find affiliate by code
    const { data: affiliate, error: affiliateError } = await supabase
      .from("affiliates")
      .select("id")
      .eq("affiliate_code", affiliateCode)
      .eq("status", "active")
      .maybeSingle()

    if (affiliateError || !affiliate) {
      return NextResponse.json({ error: "Invalid affiliate code" }, { status: 404 })
    }

    // Track the click
    const { error: clickError } = await supabase.from("affiliate_clicks").insert({
      affiliate_id: affiliate.id,
      ip_address: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
      user_agent: request.headers.get("user-agent"),
      referrer: request.headers.get("referer"),
    })

    if (clickError) {
      console.error("[v0] Error tracking affiliate click:", clickError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Affiliate click tracking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
