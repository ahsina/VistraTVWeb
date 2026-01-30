import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const { data, error, count } = await supabase
      .from("admin_activity_log")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return Response.json({ data, count })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const body = await request.json()

    const { data, error } = await supabase.from("admin_activity_log").insert(body).select().single()

    if (error) throw error

    return Response.json(data)
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
