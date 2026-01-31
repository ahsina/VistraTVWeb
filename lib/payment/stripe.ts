// lib/payment/stripe.ts
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export interface CreateCheckoutParams {
  email: string
  planId: string
  planName: string
  amount: number
  currency?: string
  promoCode?: string
  affiliateCode?: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}

export interface StripeWebhookEvent {
  type: string
  data: {
    object: Stripe.Checkout.Session | Stripe.PaymentIntent
  }
}

// Créer une session de checkout
export async function createCheckoutSession(params: CreateCheckoutParams): Promise<Stripe.Checkout.Session> {
  const {
    email,
    planId,
    planName,
    amount,
    currency = "eur",
    promoCode,
    affiliateCode,
    successUrl,
    cancelUrl,
    metadata = {},
  } = params

  // Vérifier si un code promo Stripe existe
  let discounts: Stripe.Checkout.SessionCreateParams.Discount[] = []
  if (promoCode) {
    try {
      const promotionCodes = await stripe.promotionCodes.list({
        code: promoCode,
        active: true,
        limit: 1,
      })
      if (promotionCodes.data.length > 0) {
        discounts = [{ promotion_code: promotionCodes.data[0].id }]
      }
    } catch (error) {
      console.warn("[v0] Stripe promo code not found:", promoCode)
    }
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency,
          product_data: {
            name: planName,
            description: `Abonnement VistraTV - ${planName}`,
          },
          unit_amount: Math.round(amount * 100), // Stripe utilise les centimes
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    discounts,
    metadata: {
      plan_id: planId,
      promo_code: promoCode || "",
      affiliate_code: affiliateCode || "",
      ...metadata,
    },
  })

  return session
}

// Créer un abonnement récurrent
export async function createSubscription(params: {
  customerId: string
  priceId: string
  trialDays?: number
}): Promise<Stripe.Subscription> {
  const { customerId, priceId, trialDays } = params

  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    trial_period_days: trialDays,
    payment_behavior: "default_incomplete",
    expand: ["latest_invoice.payment_intent"],
  })

  return subscription
}

// Créer ou récupérer un client
export async function getOrCreateCustomer(email: string, name?: string): Promise<Stripe.Customer> {
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  })

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0]
  }

  return stripe.customers.create({
    email,
    name,
  })
}

// Créer un remboursement
export async function createRefund(params: {
  paymentIntentId: string
  amount?: number
  reason?: Stripe.RefundCreateParams.Reason
}): Promise<Stripe.Refund> {
  const { paymentIntentId, amount, reason } = params

  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amount ? Math.round(amount * 100) : undefined,
    reason: reason || "requested_by_customer",
  })

  return refund
}

// Récupérer une session de checkout
export async function getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["payment_intent", "customer"],
  })
}

// Récupérer les paiements d'un client
export async function getCustomerPayments(customerId: string, limit: number = 10): Promise<Stripe.PaymentIntent[]> {
  const paymentIntents = await stripe.paymentIntents.list({
    customer: customerId,
    limit,
  })

  return paymentIntents.data
}

// Générer une facture PDF
export async function createInvoice(params: {
  customerId: string
  items: Array<{ description: string; amount: number }>
  dueDate?: Date
}): Promise<Stripe.Invoice> {
  const { customerId, items, dueDate } = params

  // Créer les lignes de facture
  for (const item of items) {
    await stripe.invoiceItems.create({
      customer: customerId,
      amount: Math.round(item.amount * 100),
      currency: "eur",
      description: item.description,
    })
  }

  // Créer et finaliser la facture
  const invoice = await stripe.invoices.create({
    customer: customerId,
    auto_advance: true,
    due_date: dueDate ? Math.floor(dueDate.getTime() / 1000) : undefined,
  })

  return stripe.invoices.finalizeInvoice(invoice.id)
}

// Vérifier la signature webhook
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, secret)
}

export { stripe }
