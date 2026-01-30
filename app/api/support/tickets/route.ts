import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/email/email-service"
import { emailTemplates } from "@/lib/email/templates"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message, priority } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 })
    }

    const acceptLanguage = request.headers.get("accept-language") || "fr,en;q=0.9"
    const locale = acceptLanguage.split(",")[0].split("-")[0] || "fr"

    const supabase = createAdminClient()

    const { data: ticket, error: ticketError } = await supabase
      .from("support_tickets")
      .insert({
        user_id: null,
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        status: "open",
        priority: priority || "medium",
      })
      .select()
      .single()

    if (ticketError) {
      console.error("[v0] Error creating ticket:", ticketError)
      return NextResponse.json({ error: ticketError.message }, { status: 500 })
    }

    if (ticket) {
      await supabase.from("ticket_messages").insert({
        ticket_id: ticket.id,
        sender_id: null,
        sender_type: "user",
        message: message.trim(),
      })

      const ticketNumber = ticket.id.substring(0, 8).toUpperCase()
      const welcomeMessages: Record<string, string> = {
        fr: `Bonjour ${name.trim()},\n\nBienvenue sur VistraTV Support !\n\nMerci d'avoir créé le ticket #${ticketNumber}.\n\nNotre équipe vous répondra dans les 4 heures. N'hésitez pas à poser toutes vos questions !\n\nCordialement,\nL'équipe Support VistraTV`,
        en: `Hello ${name.trim()},\n\nWelcome to VistraTV Support!\n\nThank you for creating ticket #${ticketNumber}.\n\nOur team will respond within 4 hours. Feel free to ask any questions!\n\nBest regards,\nVistraTV Support Team`,
        ar: `مرحباً ${name.trim()},\n\nأهلاً بك في دعم VistraTV!\n\nشكراً لإنشاء التذكرة #${ticketNumber}.\n\nسيرد فريقنا خلال 4 ساعات. لا تتردد في طرح أي أسئلة!\n\nمع أطيب التحيات,\nفريق دعم VistraTV`,
        es: `Hola ${name.trim()},\n\n¡Bienvenido al Soporte de VistraTV!\n\nGracias por crear el ticket #${ticketNumber}.\n\nNuestro equipo responderá en 4 horas. ¡No dudes en hacer cualquier pregunta!\n\nSaludos cordiales,\nEquipo de Soporte VistraTV`,
        it: `Ciao ${name.trim()},\n\nBenvenuto al Supporto VistraTV!\n\nGrazie per aver creato il ticket #${ticketNumber}.\n\nIl nostro team risponderà entro 4 ore. Non esitare a fare domande!\n\nCordiali saluti,\nTeam di Supporto VistraTV`,
      }

      const welcomeMessage = welcomeMessages[locale] || welcomeMessages.fr

      await supabase.from("ticket_messages").insert({
        ticket_id: ticket.id,
        sender_id: null,
        sender_type: "admin",
        message: welcomeMessage,
      })

      try {
        const emailTemplate = emailTemplates.supportTicket({
          name: name.trim(),
          ticketNumber,
          subject: subject.trim(),
          trackingUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://vistratv.com"}/support`,
          locale,
        })

        await sendEmail({
          to: email.trim(),
          subject: emailTemplate.subject,
          html: emailTemplate.html,
        })

        console.log("[v0] Support ticket confirmation email sent to:", email)
      } catch (emailError) {
        console.error("[v0] Error sending email:", emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      data: ticket,
      message: `Ticket créé avec succès ! ID: #${ticket.id.substring(0, 8).toUpperCase()}`,
    })
  } catch (error: any) {
    console.error("[v0] Error in ticket creation API:", error)
    return NextResponse.json({ error: error.message || "Erreur serveur" }, { status: 500 })
  }
}
