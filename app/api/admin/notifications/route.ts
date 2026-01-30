import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    // Get unread notifications first, then read ones
    const { data, error } = await supabase
      .from("admin_notifications")
      .select("*")
      .order("is_read", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) throw error

    return Response.json(data)
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const body = await request.json()

    const { data, error } = await supabase.from("admin_notifications").insert(body).select().single()

    if (error) throw error

    return Response.json(data)
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createServerClient()
    const { id, is_read } = await request.json()

    const { data, error } = await supabase
      .from("admin_notifications")
      .update({ is_read })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return Response.json(data)
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
