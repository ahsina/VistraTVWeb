import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import RevenueAnalytics from "@/components/admin/revenue-analytics"

export default async function AdminRevenuePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Analyse des Revenus</h1>
        <p className="text-gray-400 mt-2">Suivez les performances financières de votre plateforme</p>
      </div>

      <RevenueAnalytics />
    </div>
  )
}
