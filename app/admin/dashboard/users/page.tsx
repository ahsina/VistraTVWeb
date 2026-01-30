import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { EnhancedUsersManager } from "@/components/admin/enhanced-users-manager"

export default async function UsersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  return <EnhancedUsersManager />
}
