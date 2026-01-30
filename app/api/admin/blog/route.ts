import { createServerClient } from "@/lib/supabase/server"

// GET - Liste des articles
export async function GET(req: Request) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    console.log("[v0] Blog API - User:", user?.email)

    if (!user) {
      return Response.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { data: adminProfile } = await supabase
      .from("admin_profiles")
      .select("*")
      .eq("id", user.id)
      .eq("is_admin", true)
      .single()

    if (!adminProfile) {
      return Response.json({ error: "Accès refusé" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const language = searchParams.get("language")

    let query = supabase
      .from("blog_posts")
      .select("*, admin_profiles!blog_posts_author_id_fkey(full_name, email)")
      .order("created_at", { ascending: false })

    if (status) {
      query = query.eq("status", status)
    }

    if (language) {
      query = query.eq("language", language)
    }

    const { data, error } = await query

    if (error) throw error

    console.log("[v0] Blog posts fetched:", data?.length)

    return Response.json({ posts: data || [] })
  } catch (error: any) {
    console.error("[v0] Error fetching blog posts:", error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

// POST - Créer un nouvel article
export async function POST(req: Request) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: "Non authentifié" }, { status: 401 })
    }

    const body = await req.json()
    const { title, content, excerpt, featured_image, language, tags, status, meta_title, meta_description } = body

    if (!title || !content) {
      return Response.json({ error: "Titre et contenu requis" }, { status: 400 })
    }

    // Générer un slug unique
    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .substring(0, 100) +
      "-" +
      Date.now()

    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        title,
        slug,
        content,
        excerpt,
        featured_image,
        language: language || "fr",
        status: status || "draft",
        author_id: user.id,
        tags: tags || [],
        meta_title: meta_title || title,
        meta_description: meta_description || excerpt,
        published_at: status === "published" ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (error) throw error

    return Response.json({ post: data })
  } catch (error: any) {
    console.error("[v0] Error creating blog post:", error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
