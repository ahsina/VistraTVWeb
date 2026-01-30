import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SettingsManager } from "@/components/admin/settings-manager"

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  return <SettingsManager userId={user.id} />
}
