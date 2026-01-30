import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import SubscriptionsManager from "@/components/admin/subscriptions-manager"

export default async function SubscriptionsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: plans } = await supabase
    .from("subscription_plans")
    .select("*")
    .order("display_order", { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Subscription Plans</h1>
        <p className="text-gray-300">Manage subscription plans for all languages</p>
      </div>
      <SubscriptionsManager initialData={plans || []} />
    </div>
  )
}
