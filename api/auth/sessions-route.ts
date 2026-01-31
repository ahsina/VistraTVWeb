// app/api/auth/sessions/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@/lib/supabase/admin"
import { parseUserAgent } from "@/lib/auth/security"

// GET - Lister toutes les sessions de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const adminSupabase = createAdminClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Récupérer les sessions
    const { data: sessions, error } = await adminSupabase
      .from("user_sessions")
      .select("*")
      .eq("user_id", user.id)
      .gt("expires_at", new Date().toISOString())
      .order("last_activity_at", { ascending: false })

    if (error) throw error

    // Déterminer la session actuelle
    const currentSessionId = request.cookies.get("session_id")?.value

    const formattedSessions = (sessions || []).map((session) => {
      const { browser, os, device } = parseUserAgent(session.user_agent || "")
      return {
        id: session.id,
        browser,
        os,
        device,
        ipAddress: session.ip_address,
        location: session.location || "Unknown",
        createdAt: session.created_at,
        lastActivityAt: session.last_activity_at,
        isCurrentSession: session.session_token === currentSessionId,
      }
    })

    return NextResponse.json({ sessions: formattedSessions })
  } catch (error) {
    console.error("[v0] Error fetching sessions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Révoquer une session spécifique
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const adminSupabase = createAdminClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("id")
    const revokeAll = searchParams.get("all") === "true"

    if (revokeAll) {
      // Révoquer toutes les sessions sauf la courante
      const currentSessionId = request.cookies.get("session_id")?.value

      await adminSupabase
        .from("user_sessions")
        .delete()
        .eq("user_id", user.id)
        .neq("session_token", currentSessionId || "")

      return NextResponse.json({ success: true, message: "All other sessions revoked" })
    }

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    // Vérifier que la session appartient à l'utilisateur
    const { data: session } = await adminSupabase
      .from("user_sessions")
      .select("user_id")
      .eq("id", sessionId)
      .single()

    if (!session || session.user_id !== user.id) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Supprimer la session
    await adminSupabase.from("user_sessions").delete().eq("id", sessionId)

    return NextResponse.json({ success: true, message: "Session revoked" })
  } catch (error) {
    console.error("[v0] Error revoking session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// app/api/auth/sessions/current/route.ts
// Mettre à jour l'activité de la session courante
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const adminSupabase = createAdminClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sessionId = request.cookies.get("session_id")?.value

    if (sessionId) {
      await adminSupabase
        .from("user_sessions")
        .update({ last_activity_at: new Date().toISOString() })
        .eq("session_token", sessionId)
        .eq("user_id", user.id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
