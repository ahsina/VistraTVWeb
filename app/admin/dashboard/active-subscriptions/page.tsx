import { createClient } from "@/lib/supabase/server"
import ActiveSubscriptionsManager from "@/components/admin/active-subscriptions-manager"
import { redirect } from 'next/navigation'

export default async function ActiveSubscriptionsPage() {
  const supabase = await createClient()

  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  // Fetch subscriptions with plan details only
  const { data: subscriptions, error } = await supabase
    .from("subscriptions")
    .select(`
      *,
      subscription_plans!subscriptions_plan_id_fkey (
        name,
        price,
        language,
        duration_months,
        currency
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching subscriptions:", error)
  }

  // Enrich subscriptions with user data
  const enrichedSubscriptions = subscriptions ? await Promise.all(
    subscriptions.map(async (sub) => {
      const { data: { user: subUser } } = await supabase.auth.admin.getUserById(sub.user_id)
      return {
        ...sub,
        user_email: subUser?.email || 'N/A',
        user_name: subUser?.user_metadata?.full_name || 'N/A'
      }
    })
  ) : []

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Active Subscriptions</h1>
      <p className="text-gray-400 mb-6">Manage user subscriptions and billing</p>
      <ActiveSubscriptionsManager initialData={enrichedSubscriptions} />
    </div>
  )
}
