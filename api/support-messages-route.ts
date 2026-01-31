// app/api/support/tickets/[ticketId]/messages/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@/lib/supabase/admin"
import { sendEmail } from "@/lib/email/email-service"

export async function GET(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const supabase = await createClient()
    const { ticketId } = params

    const { data: messages, error } = await supabase
      .from("ticket_messages")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("[v0] Error fetching messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const supabase = await createClient()
    const adminSupabase = createAdminClient()
    const { ticketId } = params
    const body = await request.json()
    const { message, senderType = "user" } = body

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Récupérer le ticket pour les infos
    const { data: ticket } = await adminSupabase
      .from("support_tickets")
      .select("*")
      .eq("id", ticketId)
      .single()

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    // Récupérer l'utilisateur actuel
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Créer le message
    const { data: newMessage, error: messageError } = await adminSupabase
      .from("ticket_messages")
      .insert({
        ticket_id: ticketId,
        sender_id: user?.id || null,
        sender_type: senderType,
        message: message.trim(),
        is_read: false,
      })
      .select()
      .single()

    if (messageError) {
      console.error("[v0] Error creating message:", messageError)
      return NextResponse.json({ error: messageError.message }, { status: 500 })
    }

    // Mettre à jour le ticket
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    // Si c'est la première réponse admin, enregistrer le temps de réponse
    if (senderType === "admin" && !ticket.first_response_at) {
      updateData.first_response_at = new Date().toISOString()
      updateData.status = "in_progress"
    }

    await adminSupabase
      .from("support_tickets")
      .update(updateData)
      .eq("id", ticketId)

    // Envoyer une notification email
    if (senderType === "admin" && ticket.email) {
      // Admin répond -> notifier l'utilisateur
      await sendEmail({
        to: ticket.email,
        template: "support_ticket_reply",
        data: {
          ticketId: ticketId.substring(0, 8).toUpperCase(),
          subject: ticket.subject,
          messagePreview: message.substring(0, 200) + (message.length > 200 ? "..." : ""),
        },
      })
      console.log("[v0] Email notification sent to user:", ticket.email)
    } else if (senderType === "user") {
      // Utilisateur répond -> notifier les admins (optionnel)
      // Créer une notification admin
      await adminSupabase.from("admin_notifications").insert({
        type: "ticket_reply",
        title: `Nouvelle réponse au ticket #${ticketId.substring(0, 8).toUpperCase()}`,
        message: `${ticket.name || ticket.email} a répondu au ticket: "${ticket.subject}"`,
        priority: ticket.priority === "urgent" ? "high" : "normal",
        link: `/admin/dashboard/support?ticket=${ticketId}`,
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: newMessage 
    })
  } catch (error) {
    console.error("[v0] Error creating message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
