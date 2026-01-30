import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    console.log("[v0] Analytics track API called")
    const body = await request.json()
    console.log("[v0] Analytics event:", body.event)

    const supabase = await createServerClient()

    const { data, error } = await supabase.from("analytics_events").insert({
      event_type: body.event || body.category,
      page_url: body.url,
      referrer: body.referrer,
      user_agent: body.userAgent,
      session_id: body.sessionId,
      user_id: body.userId,
      event_data: {
        action: body.action,
        label: body.label,
        value: body.value,
        category: body.category,
        ...body.metadata,
      },
      created_at: body.timestamp,
    })

    if (error) {
      console.error("[v0] Analytics insert error:", error)
      return Response.json({ success: true, warning: "Analytics tracking degraded" })
    }

    console.log("[v0] Analytics event tracked successfully")
    return Response.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Analytics API error:", error)
    return Response.json({ success: true, warning: "Analytics unavailable" })
  }
}
