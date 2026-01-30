import { createClient } from "@/lib/supabase/server"
import ContentManager from "@/components/admin/content-manager"
import { redirect } from "next/navigation"

export default async function ContentPage() {
  const supabase = await createClient()

  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  // Fetch content
  const { data: content, error } = await supabase.from("content").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching content:", error)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Content Management</h1>
      <p className="text-gray-400 mb-6">Manage movies, series, and VOD content</p>
      <ContentManager initialData={content || []} />
    </div>
  )
}
