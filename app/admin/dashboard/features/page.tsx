import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import FeaturesManager from "@/components/admin/features-manager"

export default async function FeaturesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: features } = await supabase.from("features").select("*").order("display_order", { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Features Management</h1>
        <p className="text-gray-300">Manage site features for all languages</p>
      </div>
      <FeaturesManager initialData={features || []} />
    </div>
  )
}
