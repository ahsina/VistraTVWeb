import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    // TODO: Integrate with .NET Core API
    const response = await fetch(`${process.env.API_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    return NextResponse.json({ message: "Password reset successful" }, { status: 200 })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
  }
}
