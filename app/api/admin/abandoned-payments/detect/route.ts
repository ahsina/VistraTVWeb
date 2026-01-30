import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/admin"

// This endpoint can be called by a cron job to detect abandoned payments
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Find pending transactions older than 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString()

    const { data: pendingTransactions, error: fetchError } = await supabase
      .from("payment_transactions")
      .select("*")
      .eq("status", "pending")
      .lt("created_at", thirtyMinutesAgo)

    if (fetchError) {
      console.error("[v0] Error fetching pending transactions:", fetchError)
      return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
    }

    if (!pendingTransactions || pendingTransactions.length === 0) {
      return NextResponse.json({ message: "No abandoned payments found", count: 0 })
    }

    let createdCount = 0

    // Create abandoned payment reminders for transactions that don't have one yet
    for (const transaction of pendingTransactions) {
      // Check if reminder already exists
      const { data: existingReminder } = await supabase
        .from("abandoned_payment_reminders")
        .select("id")
        .eq("transaction_id", transaction.id)
        .single()

      if (!existingReminder) {
        // Get subscription plan name from gateway_response
        const planName = transaction.gateway_response?.subscription_plan_name || "Subscription"

        // Regenerate payment URL
        const { data: config } = await supabase.from("payment_gateway_config").select("*").maybeSingle()

        let paymentUrl = ""
        if (config?.encrypted_wallet) {
          const wallet =
            typeof config.encrypted_wallet === "string" ? JSON.parse(config.encrypted_wallet) : config.encrypted_wallet
          const walletAddress = wallet.address_in

          const baseUrl = "https://checkout.paygate.to/process-payment.php"
          const urlParams = [
            `address=${walletAddress}`,
            `amount=${transaction.final_amount}`,
            `currency=${transaction.currency}`,
            `email=${encodeURIComponent(transaction.email)}`,
          ]

          if (config.payment_provider && config.payment_provider !== "auto") {
            urlParams.push(`provider=${config.payment_provider}`)
          }

          paymentUrl = `${baseUrl}?${urlParams.join("&")}`
        }

        const { error: insertError } = await supabase.from("abandoned_payment_reminders").insert({
          transaction_id: transaction.id,
          email: transaction.email,
          whatsapp_phone: transaction.whatsapp_phone,
          subscription_plan_name: planName,
          amount: transaction.final_amount,
          currency: transaction.currency,
          payment_url: paymentUrl,
          abandoned_at: transaction.created_at,
        })

        if (!insertError) {
          createdCount++
        }
      }
    }

    console.log("[v0] Created abandoned payment reminders:", createdCount)

    return NextResponse.json({
      success: true,
      message: `Detected ${pendingTransactions.length} abandoned payments, created ${createdCount} new reminders`,
      detected: pendingTransactions.length,
      created: createdCount,
    })
  } catch (error) {
    console.error("[v0] Error detecting abandoned payments:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
