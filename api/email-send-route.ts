// app/api/email/send/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { sendEmail, type EmailTemplateName } from "@/lib/email/email-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, template, data, from, replyTo } = body

    // Validation
    if (!to) {
      return NextResponse.json({ error: "Recipient email required" }, { status: 400 })
    }

    if (!template) {
      return NextResponse.json({ error: "Template name required" }, { status: 400 })
    }

    // Envoyer l'email
    const result = await sendEmail({
      to,
      template: template as EmailTemplateName,
      data: data || {},
      from,
      replyTo,
    })

    if (result.success) {
      return NextResponse.json({ success: true, id: result.id })
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("[v0] Email API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
