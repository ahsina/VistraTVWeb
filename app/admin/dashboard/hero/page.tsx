import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import HeroContentManager from "@/components/admin/hero-content-manager"

export default async function HeroContentPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: heroContent } = await supabase.from("hero_content").select("*").order("language", { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Hero Content Management</h1>
        <p className="text-gray-300">Manage hero section content for all languages</p>
      </div>
      <HeroContentManager initialData={heroContent || []} />
    </div>
  )
}
