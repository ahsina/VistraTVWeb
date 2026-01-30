import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "30")

    const { data, error } = await supabase
      .from("analytics_engagement_metrics")
      .select("*")
      .gte("date", new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order("date", { ascending: true })

    if (error) throw error

    return Response.json(data)
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
