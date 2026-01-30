import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const response = await fetch(`${process.env.API_URL}/api/user/subscription/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${request.cookies.get("auth-token")?.value}`,
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 400 })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
