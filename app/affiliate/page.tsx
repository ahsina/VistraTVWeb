import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AffiliateClientDashboard from "./affiliate-client"

export default async function AffiliatePage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: affiliate } = await supabase.from("affiliates").select("*").eq("user_id", user.id).maybeSingle()

  const { data: referrals } = affiliate
    ? await supabase
        .from("affiliate_referrals")
        .select("*")
        .eq("affiliate_id", affiliate.id)
        .order("created_at", { ascending: false })
    : { data: null }

  const { data: clicks } = affiliate
    ? await supabase
        .from("affiliate_clicks")
        .select("*")
        .eq("affiliate_id", affiliate.id)
        .order("created_at", { ascending: false })
        .limit(100)
    : { data: null }

  return (
    <AffiliateClientDashboard
      affiliate={affiliate}
      referrals={referrals || []}
      clicks={clicks || []}
      userEmail={user.email || ""}
    />
  )
}
