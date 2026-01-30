import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/admin"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const transactionId = searchParams.get("transactionId")

    if (!transactionId) {
      return NextResponse.json({ error: "Transaction ID required" }, { status: 400 })
    }

    const supabase = createClient()

    const { data: transaction, error } = await supabase
      .from("payment_transactions")
      .select("status")
      .eq("id", transactionId)
      .single()

    if (error || !transaction) {
      console.error("[v0] Transaction not found:", error)
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({
      status: transaction.status,
    })
  } catch (error) {
    console.error("[v0] Error checking payment status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
