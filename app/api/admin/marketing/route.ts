import { NextResponse } from "next/server"
import type { MarketingConfig } from "@/lib/types/marketing"
import { defaultMarketingConfig } from "@/lib/types/marketing"

// In a real app, this would be stored in a database
let marketingConfig: MarketingConfig = defaultMarketingConfig

export async function GET() {
  return NextResponse.json(marketingConfig)
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    // Validate the config
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid configuration" }, { status: 400 })
    }

    // Update the config
    marketingConfig = { ...marketingConfig, ...body }

    // In a real app, save to database here
    // await db.marketingConfig.update({ data: marketingConfig })

    return NextResponse.json(marketingConfig)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update configuration" }, { status: 500 })
  }
}
