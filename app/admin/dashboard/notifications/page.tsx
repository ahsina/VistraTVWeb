import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import NotificationsManager from "@/components/admin/notifications-manager"

export default async function AdminNotificationsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: notifications } = await supabase
    .from("admin_notifications")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Notifications Admin</h1>
        <p className="text-gray-400 mt-2">Gérez les notifications système et alertes</p>
      </div>

      <NotificationsManager initialNotifications={notifications || []} />
    </div>
  )
}
