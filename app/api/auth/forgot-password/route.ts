import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // TODO: Integrate with .NET Core API
    const response = await fetch(`${process.env.API_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Reset email sent" }, { status: 200 })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Failed to send reset email" }, { status: 500 })
  }
}
