import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/email/email-service"
import { emailTemplates } from "@/lib/email/templates"
import { logActivity } from "@/lib/logging/logger"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: adminProfile } = await supabase.from("admin_profiles").select("is_admin").eq("id", user.id).single()

    if (!adminProfile?.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { reminderId } = await request.json()

    if (!reminderId) {
      return NextResponse.json({ error: "Reminder ID required" }, { status: 400 })
    }

    const { data: reminder, error: fetchError } = await supabase
      .from("abandoned_payment_reminders")
      .select("*")
      .eq("id", reminderId)
      .single()

    if (fetchError || !reminder) {
      return NextResponse.json({ error: "Reminder not found" }, { status: 404 })
    }

    const emailTemplate = emailTemplates.abandonedCart({
      name: reminder.email.split("@")[0],
      amount: reminder.amount.toFixed(2),
      currency: reminder.currency,
      planName: reminder.subscription_plan_name,
      paymentUrl: reminder.payment_url || `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
      locale: "fr",
    })

    await sendEmail({
      to: reminder.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    })

    console.log("[v0] Reminder email sent to:", reminder.email)

    // Update reminder count
    const { error: updateError } = await supabase
      .from("abandoned_payment_reminders")
      .update({
        reminder_count: reminder.reminder_count + 1,
        last_reminder_sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", reminderId)

    if (updateError) {
      console.error("[v0] Error updating reminder:", updateError)
      return NextResponse.json({ error: "Failed to update reminder" }, { status: 500 })
    }

    await logActivity({
      supabase,
      userId: user.id,
      action: "send_abandoned_payment_reminder",
      entityType: "abandoned_payment_reminder",
      entityId: reminderId,
      metadata: { email: reminder.email, reminderCount: reminder.reminder_count + 1 },
    })

    return NextResponse.json({
      success: true,
      message: "Reminder sent successfully",
      reminderCount: reminder.reminder_count + 1,
    })
  } catch (error) {
    console.error("[v0] Error sending reminder:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
