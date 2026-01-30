import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AffiliatesManager from "@/components/admin/affiliates-manager"

export default async function AffiliatesPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: adminProfile } = await supabase.from("admin_profiles").select("is_admin").eq("id", user.id).single()

  if (!adminProfile?.is_admin) {
    redirect("/")
  }

  const { data: affiliates } = await supabase.from("affiliates").select("*").order("created_at", { ascending: false })

  return (
    <div className="p-6">
      <AffiliatesManager initialData={affiliates || []} />
    </div>
  )
}
