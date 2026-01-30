import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Starting wallet generation...")

    const body = await request.json()
    const { usdcAddress, affiliateAddress } = body

    if (!usdcAddress) {
      console.error("[v0] No USDC address provided")
      return NextResponse.json({ error: "USDC Polygon address is required" }, { status: 400 })
    }

    console.log("[v0] USDC address from request:", usdcAddress)

    const supabase = await createServerClient()

    // Get payment gateway config
    const { data: config, error: configError } = await supabase.from("payment_gateway_config").select("*").single()

    if (configError || !config) {
      console.error("[v0] Config error:", configError)
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 400 })
    }

    // Build callback URL (where PayGate.to will send payment notifications)
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/webhook`

    // Build PayGate.to wallet generation URL
    const walletParams = new URLSearchParams({
      callback: callbackUrl,
      address: usdcAddress, // Use address from request instead of database
    })

    if (affiliateAddress) {
      walletParams.append("affiliate", affiliateAddress)
    }

    const walletUrl = `https://api.paygate.to/control/wallet.php?${walletParams.toString()}`

    console.log("[v0] Calling PayGate.to wallet API:", walletUrl)

    // Call PayGate.to API to generate encrypted wallet
    const response = await fetch(walletUrl, {
      method: "GET",
    })

    if (!response.ok) {
      console.error("[v0] PayGate.to wallet generation failed:", response.status, await response.text())
      return NextResponse.json({ error: "Failed to generate payment wallet" }, { status: 500 })
    }

    const encryptedWallet = await response.text()
    console.log("[v0] PayGate.to wallet generated:", encryptedWallet)

    // Store encrypted wallet in database
    const { error: updateError } = await supabase
      .from("payment_gateway_config")
      .update({ encrypted_wallet: encryptedWallet.trim() })
      .eq("id", config.id)

    if (updateError) {
      console.error("[v0] Failed to store encrypted wallet:", updateError)
    }

    return NextResponse.json({
      success: true,
      encryptedWallet: encryptedWallet.trim(),
    })
  } catch (error) {
    console.error("[v0] Error generating wallet:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
