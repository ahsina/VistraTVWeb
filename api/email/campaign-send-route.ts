// app/api/email/campaign/send/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/admin"
import { sendEmail } from "@/lib/email/email-service"

interface CampaignRecipient {
  id: string
  email: string
  full_name?: string
}

export async function POST(request: NextRequest) {
  try {
    const { campaignId } = await request.json()

    if (!campaignId) {
      return NextResponse.json({ error: "Campaign ID required" }, { status: 400 })
    }

    const supabase = createClient()

    // Récupérer la campagne
    const { data: campaign, error: campaignError } = await supabase
      .from("email_campaigns")
      .select("*")
      .eq("id", campaignId)
      .single()

    if (campaignError || !campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    if (campaign.status === "sent") {
      return NextResponse.json({ error: "Campaign already sent" }, { status: 400 })
    }

    // Récupérer les destinataires selon l'audience
    let recipients: CampaignRecipient[] = []

    switch (campaign.audience) {
      case "all":
        const { data: allUsers } = await supabase
          .from("user_profiles")
          .select("id, email, full_name")
          .not("email", "is", null)
        recipients = allUsers || []
        break

      case "active":
        const { data: activeUsers } = await supabase
          .from("subscriptions")
          .select("user_profiles(id, email, full_name)")
          .eq("status", "active")
        recipients = (activeUsers || [])
          .map((s: any) => s.user_profiles)
          .filter(Boolean)
        break

      case "expired":
        const { data: expiredUsers } = await supabase
          .from("subscriptions")
          .select("user_profiles(id, email, full_name)")
          .eq("status", "expired")
        recipients = (expiredUsers || [])
          .map((s: any) => s.user_profiles)
          .filter(Boolean)
        break

      case "free":
        // Utilisateurs sans abonnement actif
        const { data: allProfiles } = await supabase
          .from("user_profiles")
          .select("id, email, full_name")

        const { data: activeSubUsers } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("status", "active")

        const activeUserIds = new Set((activeSubUsers || []).map((s) => s.user_id))
        recipients = (allProfiles || []).filter((p) => !activeUserIds.has(p.id))
        break

      case "custom":
        if (campaign.custom_audience_ids?.length > 0) {
          const { data: customUsers } = await supabase
            .from("user_profiles")
            .select("id, email, full_name")
            .in("id", campaign.custom_audience_ids)
          recipients = customUsers || []
        }
        break
    }

    // Dédupliquer par email
    const uniqueRecipients = Array.from(
      new Map(recipients.map((r) => [r.email, r])).values()
    ).filter((r) => r.email)

    // Mettre à jour le nombre de destinataires
    await supabase
      .from("email_campaigns")
      .update({
        status: "sending",
        total_recipients: uniqueRecipients.length,
      })
      .eq("id", campaignId)

    // Envoyer les emails (en batch)
    const BATCH_SIZE = 50
    const DELAY_BETWEEN_BATCHES = 1000 // 1 seconde
    let sentCount = 0
    const errors: string[] = []

    for (let i = 0; i < uniqueRecipients.length; i += BATCH_SIZE) {
      const batch = uniqueRecipients.slice(i, i + BATCH_SIZE)

      const results = await Promise.allSettled(
        batch.map(async (recipient) => {
          // Remplacer les variables dans le contenu
          let content = campaign.content
          let subject = campaign.subject

          const variables: Record<string, string> = {
            "{{name}}": recipient.full_name || recipient.email.split("@")[0],
            "{{email}}": recipient.email,
            "{{unsubscribe_link}}": `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(recipient.email)}`,
          }

          for (const [key, value] of Object.entries(variables)) {
            content = content.replace(new RegExp(key, "g"), value)
            subject = subject.replace(new RegExp(key, "g"), value)
          }

          // Envoyer l'email
          await sendEmail({
            to: recipient.email,
            subject,
            html: content,
            tags: [`campaign:${campaignId}`],
          })

          return recipient.email
        })
      )

      // Compter les succès et erreurs
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          sentCount++
        } else {
          errors.push(`${batch[index].email}: ${result.reason}`)
        }
      })

      // Mettre à jour le compteur
      await supabase
        .from("email_campaigns")
        .update({ sent_count: sentCount })
        .eq("id", campaignId)

      // Attendre entre les batches pour éviter le rate limiting
      if (i + BATCH_SIZE < uniqueRecipients.length) {
        await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_BATCHES))
      }
    }

    // Finaliser la campagne
    await supabase
      .from("email_campaigns")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        sent_count: sentCount,
      })
      .eq("id", campaignId)

    // Logger
    await supabase.from("system_logs").insert({
      level: "info",
      category: "email",
      message: `Campaign sent: ${campaign.name}`,
      metadata: {
        campaign_id: campaignId,
        total_recipients: uniqueRecipients.length,
        sent_count: sentCount,
        error_count: errors.length,
      },
    })

    return NextResponse.json({
      success: true,
      sent: sentCount,
      total: uniqueRecipients.length,
      errors: errors.length > 0 ? errors.slice(0, 10) : undefined,
    })
  } catch (error) {
    console.error("[v0] Campaign send error:", error)
    return NextResponse.json(
      { error: "Failed to send campaign" },
      { status: 500 }
    )
  }
}
