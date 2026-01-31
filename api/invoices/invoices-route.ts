// app/api/invoices/[transactionId]/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@/lib/supabase/admin"
import { generateInvoicePDF, generateInvoiceNumber } from "@/lib/invoice/invoice-generator"

// GET - Télécharger une facture PDF
export async function GET(
  request: NextRequest,
  { params }: { params: { transactionId: string } }
) {
  try {
    const supabase = await createClient()
    const adminSupabase = createAdminClient()
    const { transactionId } = params

    // Vérifier l'authentification
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Récupérer la transaction
    const { data: transaction, error } = await adminSupabase
      .from("payment_transactions")
      .select(`
        *,
        subscription_plans:gateway_response->subscription_plan_id (
          name,
          price,
          currency,
          duration_months
        )
      `)
      .eq("id", transactionId)
      .single()

    if (error || !transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    // Vérifier que l'utilisateur a le droit de voir cette facture
    // (soit admin, soit propriétaire de la transaction)
    if (user) {
      const { data: profile } = await adminSupabase
        .from("user_profiles")
        .select("email")
        .eq("id", user.id)
        .single()

      const { data: adminProfile } = await adminSupabase
        .from("admin_profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single()

      if (!adminProfile?.is_admin && profile?.email !== transaction.email) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }

    // Générer la facture
    const planName = transaction.gateway_response?.subscription_plan_id 
      ? transaction.subscription_plans?.name 
      : "Abonnement VistraTV"

    const invoiceData = {
      invoiceNumber: transaction.invoice_number || generateInvoiceNumber(),
      date: new Date(transaction.created_at),
      customer: {
        name: transaction.email.split("@")[0],
        email: transaction.email,
      },
      items: [
        {
          description: planName || "Abonnement VistraTV",
          quantity: 1,
          unitPrice: transaction.amount,
          total: transaction.amount,
        },
      ],
      subtotal: transaction.amount,
      discount: transaction.promo_code
        ? {
            description: `Code promo: ${transaction.promo_code}`,
            amount: transaction.amount - transaction.final_amount,
          }
        : undefined,
      total: transaction.final_amount,
      currency: transaction.currency || "EUR",
      paymentMethod: transaction.payment_method === "stripe" ? "Carte bancaire" : "Crypto",
      transactionId: transaction.gateway_transaction_id,
      notes: "Cette facture a été générée automatiquement. Pour toute question, contactez billing@vistratv.com",
    }

    const pdfBuffer = await generateInvoicePDF(invoiceData)

    // Sauvegarder le numéro de facture si pas encore fait
    if (!transaction.invoice_number) {
      await adminSupabase
        .from("payment_transactions")
        .update({ invoice_number: invoiceData.invoiceNumber })
        .eq("id", transactionId)
    }

    // Retourner le PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="facture-${invoiceData.invoiceNumber}.pdf"`,
      },
    })
  } catch (error) {
    console.error("[v0] Invoice generation error:", error)
    return NextResponse.json({ error: "Failed to generate invoice" }, { status: 500 })
  }
}

// app/api/invoices/route.ts - Liste des factures
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Récupérer le profil pour l'email
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("email")
      .eq("id", user.id)
      .single()

    if (!profile?.email) {
      return NextResponse.json({ invoices: [] })
    }

    // Récupérer les transactions complétées
    const { data: transactions } = await supabase
      .from("payment_transactions")
      .select("*")
      .eq("email", profile.email)
      .eq("status", "completed")
      .order("created_at", { ascending: false })

    const invoices = (transactions || []).map((tx) => ({
      id: tx.id,
      invoiceNumber: tx.invoice_number || generateInvoiceNumber(),
      date: tx.created_at,
      amount: tx.final_amount,
      currency: tx.currency,
      status: tx.status,
      downloadUrl: `/api/invoices/${tx.id}`,
    }))

    return NextResponse.json({ invoices })
  } catch (error) {
    console.error("[v0] Error fetching invoices:", error)
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}
