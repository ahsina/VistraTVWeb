import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase.from("analytics_popular_pages").select("*").limit(20)

    if (error) throw error

    return Response.json(data)
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
