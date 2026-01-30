import { createClient } from "@supabase/supabase-js"

// Email service configuration
const RESEND_API_KEY = process.env.RESEND_API_KEY || ""
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@vistra.tv"

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  console.log("[v0] Sending email to:", to)

  if (!RESEND_API_KEY) {
    console.log("[v0] RESEND_API_KEY not configured, skipping email send")
    // Log to database for tracking even if email not sent
    await logEmailAttempt(to, subject, "no_api_key")
    return { success: false, error: "Email service not configured" }
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to,
        subject,
        html,
        text: text || stripHtml(html),
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("[v0] Email send failed:", data)
      await logEmailAttempt(to, subject, "failed", data.message)
      return { success: false, error: data.message }
    }

    console.log("[v0] Email sent successfully:", data.id)
    await logEmailAttempt(to, subject, "sent", null, data.id)
    return { success: true, id: data.id }
  } catch (error) {
    console.error("[v0] Email send error:", error)
    await logEmailAttempt(to, subject, "error", error instanceof Error ? error.message : "Unknown error")
    return { success: false, error: "Email send failed" }
  }
}

async function logEmailAttempt(to: string, subject: string, status: string, error?: string | null, emailId?: string) {
  try {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    await supabase.from("email_logs").insert({
      recipient: to,
      subject,
      status,
      error_message: error,
      email_id: emailId,
    })
  } catch (err) {
    console.error("[v0] Failed to log email attempt:", err)
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

// Pre-built email templates
export const emailTemplates = {
  abandonedCart: (name: string, planName: string, amount: number, checkoutUrl: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Votre abonnement vous attend!</h1>
          </div>
          <div class="content">
            <p>Bonjour ${name},</p>
            <p>Nous avons remarqué que vous n'avez pas finalisé votre abonnement à <strong>${planName}</strong>.</p>
            <p>Ne manquez pas l'occasion de profiter de:</p>
            <ul>
              <li>Plus de 10,000 chaînes de TV en direct</li>
              <li>Qualité HD/4K disponible</li>
              <li>Compatible tous appareils</li>
              <li>Support client 24/7</li>
            </ul>
            <p><strong>Montant: ${amount}€</strong></p>
            <div style="text-align: center;">
              <a href="${checkoutUrl}" class="button">Finaliser mon abonnement</a>
            </div>
            <p>Cette offre est valable pendant 24h.</p>
          </div>
          <div class="footer">
            <p>© 2025 VistraTV. Tous droits réservés.</p>
          </div>
        </div>
      </body>
    </html>
  `,

  ticketResponse: (name: string, ticketId: string, message: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #667eea; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #fff; }
          .ticket-id { background: #f0f0f0; padding: 10px; border-left: 4px solid #667eea; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Réponse à votre ticket de support</h2>
          </div>
          <div class="content">
            <p>Bonjour ${name},</p>
            <div class="ticket-id">
              <strong>Ticket #${ticketId}</strong>
            </div>
            <p>${message}</p>
            <p>Si vous avez d'autres questions, n'hésitez pas à répondre à ce ticket.</p>
            <p>Cordialement,<br>L'équipe VistraTV</p>
          </div>
        </div>
      </body>
    </html>
  `,

  welcome: (name: string, email: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #fff; padding: 30px; }
          .features { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Bienvenue sur VistraTV!</h1>
          </div>
          <div class="content">
            <p>Bonjour ${name},</p>
            <p>Merci d'avoir rejoint VistraTV! Votre compte a été créé avec succès.</p>
            <div class="features">
              <h3>Commencez dès maintenant:</h3>
              <ul>
                <li>Explorez plus de 10,000 chaînes TV</li>
                <li>Regardez en HD/4K</li>
                <li>Utilisez sur tous vos appareils</li>
                <li>Profitez du support 24/7</li>
              </ul>
            </div>
            <p><strong>Vos identifiants:</strong></p>
            <p>Email: ${email}</p>
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" class="button">Se connecter maintenant</a>
            </div>
          </div>
        </div>
      </body>
    </html>
  `,
}
