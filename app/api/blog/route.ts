import { createServerClient } from "@/lib/supabase/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const language = searchParams.get("language") || "fr"

    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, featured_image, language, tags, published_at, view_count")
      .eq("status", "published")
      .eq("language", language)
      .order("published_at", { ascending: false })

    if (error) throw error

    return Response.json({ posts: data || [] })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
