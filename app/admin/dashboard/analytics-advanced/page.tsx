import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdvancedAnalyticsDashboard from "@/components/admin/advanced-analytics-dashboard"

export default async function AdminAdvancedAnalyticsPage() {
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
        <h1 className="text-3xl font-bold text-white">Analytics Avancées</h1>
        <p className="text-gray-400 mt-2">Analyse approfondie du comportement utilisateur et des conversions</p>
      </div>

      <AdvancedAnalyticsDashboard />
    </div>
  )
}
