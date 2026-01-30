import { createServerClient } from "@/lib/supabase/server"

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", params.slug)
      .eq("status", "published")
      .single()

    if (error) throw error

    // Incrémenter le compteur de vues
    await supabase
      .from("blog_posts")
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq("id", data.id)

    return Response.json({ post: data })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
