import { createServerClient } from "@/lib/supabase/server"

// GET - Récupérer un article
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*, admin_profiles!blog_posts_author_id_fkey(full_name, email)")
      .eq("id", params.id)
      .single()

    if (error) throw error

    return Response.json({ post: data })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Mettre à jour un article
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: "Non authentifié" }, { status: 401 })
    }

    const body = await req.json()
    const updates: any = { ...body }

    // Si on publie l'article pour la première fois
    if (updates.status === "published" && !updates.published_at) {
      updates.published_at = new Date().toISOString()
    }

    const { data, error } = await supabase.from("blog_posts").update(updates).eq("id", params.id).select().single()

    if (error) throw error

    return Response.json({ post: data })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Supprimer un article
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { error } = await supabase.from("blog_posts").delete().eq("id", params.id)

    if (error) throw error

    return Response.json({ success: true })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
