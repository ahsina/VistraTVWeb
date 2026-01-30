import { createClient } from "@/lib/supabase/server"
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard"
import { redirect } from "next/navigation"

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  return <AnalyticsDashboard />
}
