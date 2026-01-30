import { createClient } from "@/lib/supabase/server"
import { SupportTicketsManager } from "@/components/admin/support-tickets-manager"
import { redirect } from "next/navigation"

export default async function SupportTicketsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  return <SupportTicketsManager adminId={user.id} />
}
