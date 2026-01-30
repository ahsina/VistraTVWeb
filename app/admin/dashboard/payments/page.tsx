import { createClient } from "@/lib/supabase/server"
import { PaymentsManager } from "@/components/admin/payments-manager"
import { redirect } from "next/navigation"

export default async function PaymentsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  return <PaymentsManager />
}
