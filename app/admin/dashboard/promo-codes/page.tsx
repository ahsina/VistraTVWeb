import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import PromoCodesManager from "@/components/admin/promo-codes-manager"

export default async function PromoCodesPage() {
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

  const { data: promoCodes } = await supabase.from("promo_codes").select("*").order("created_at", { ascending: false })

  return (
    <div className="p-6">
      <PromoCodesManager initialData={promoCodes || []} />
    </div>
  )
}
