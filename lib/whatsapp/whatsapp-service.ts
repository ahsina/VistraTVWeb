// lib/whatsapp/whatsapp-service.ts
// Service d'intégration WhatsApp Business API

interface WhatsAppConfig {
  apiToken: string
  phoneId: string
  businessId: string
}

interface WhatsAppMessage {
  to: string // Numéro de téléphone avec code pays (ex: 33612345678)
  template?: {
    name: string
    language: string
    components?: Array<{
      type: "header" | "body" | "button"
      parameters: Array<{
        type: "text" | "image" | "document"
        text?: string
        image?: { link: string }
      }>
    }>
  }
  text?: string
}

interface WhatsAppResponse {
  success: boolean
  messageId?: string
  error?: string
}

class WhatsAppService {
  private config: WhatsAppConfig
  private baseUrl = "https://graph.facebook.com/v18.0"

  constructor() {
    this.config = {
      apiToken: process.env.WHATSAPP_API_TOKEN || "",
      phoneId: process.env.WHATSAPP_PHONE_ID || "",
      businessId: process.env.WHATSAPP_BUSINESS_ID || "",
    }
  }

  private async makeRequest(endpoint: string, method: string, body?: object): Promise<any> {
    const response = await fetch(`${this.baseUrl}/${this.config.phoneId}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.config.apiToken}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "WhatsApp API error")
    }

    return data
  }

  // Envoyer un message template
  async sendTemplate(message: WhatsAppMessage): Promise<WhatsAppResponse> {
    if (!this.config.apiToken) {
      console.log("[WhatsApp] API not configured, skipping message")
      return { success: false, error: "WhatsApp API not configured" }
    }

    try {
      const payload = {
        messaging_product: "whatsapp",
        to: message.to,
        type: "template",
        template: {
          name: message.template?.name,
          language: { code: message.template?.language || "fr" },
          components: message.template?.components,
        },
      }

      const response = await this.makeRequest("/messages", "POST", payload)

      return {
        success: true,
        messageId: response.messages?.[0]?.id,
      }
    } catch (error) {
      console.error("[WhatsApp] Error sending template:", error)
      return { success: false, error: String(error) }
    }
  }

  // Envoyer un message texte simple
  async sendText(to: string, text: string): Promise<WhatsAppResponse> {
    if (!this.config.apiToken) {
      console.log("[WhatsApp] API not configured, skipping message")
      return { success: false, error: "WhatsApp API not configured" }
    }

    try {
      const payload = {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text },
      }

      const response = await this.makeRequest("/messages", "POST", payload)

      return {
        success: true,
        messageId: response.messages?.[0]?.id,
      }
    } catch (error) {
      console.error("[WhatsApp] Error sending text:", error)
      return { success: false, error: String(error) }
    }
  }

  // Templates prédéfinis
  async sendPaymentConfirmation(to: string, data: {
    customerName: string
    planName: string
    amount: string
    orderNumber: string
  }): Promise<WhatsAppResponse> {
    return this.sendTemplate({
      to,
      template: {
        name: "payment_confirmation",
        language: "fr",
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: data.customerName },
              { type: "text", text: data.planName },
              { type: "text", text: data.amount },
              { type: "text", text: data.orderNumber },
            ],
          },
        ],
      },
    })
  }

  async sendSubscriptionExpiring(to: string, data: {
    customerName: string
    daysRemaining: number
    renewUrl: string
  }): Promise<WhatsAppResponse> {
    return this.sendTemplate({
      to,
      template: {
        name: "subscription_expiring",
        language: "fr",
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: data.customerName },
              { type: "text", text: String(data.daysRemaining) },
            ],
          },
          {
            type: "button",
            parameters: [{ type: "text", text: data.renewUrl }],
          },
        ],
      },
    })
  }

  async sendSupportTicketUpdate(to: string, data: {
    ticketId: string
    status: string
    message: string
  }): Promise<WhatsAppResponse> {
    return this.sendTemplate({
      to,
      template: {
        name: "support_update",
        language: "fr",
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: data.ticketId },
              { type: "text", text: data.status },
              { type: "text", text: data.message.substring(0, 100) },
            ],
          },
        ],
      },
    })
  }

  async sendWelcome(to: string, data: {
    customerName: string
    setupUrl: string
  }): Promise<WhatsAppResponse> {
    return this.sendTemplate({
      to,
      template: {
        name: "welcome_message",
        language: "fr",
        components: [
          {
            type: "body",
            parameters: [{ type: "text", text: data.customerName }],
          },
          {
            type: "button",
            parameters: [{ type: "text", text: data.setupUrl }],
          },
        ],
      },
    })
  }
}

export const whatsapp = new WhatsAppService()

// Formatter le numéro de téléphone pour WhatsApp
export function formatPhoneForWhatsApp(phone: string): string {
  // Supprimer tout sauf les chiffres
  let cleaned = phone.replace(/\D/g, "")

  // Si commence par 0, remplacer par le code pays (33 pour France par défaut)
  if (cleaned.startsWith("0")) {
    cleaned = "33" + cleaned.substring(1)
  }

  // Ajouter le code pays si absent
  if (cleaned.length <= 10) {
    cleaned = "33" + cleaned
  }

  return cleaned
}

export default whatsapp
