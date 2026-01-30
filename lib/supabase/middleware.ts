import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  // Simple middleware qui laisse passer toutes les requêtes
  // La protection admin est gérée au niveau des routes
  return NextResponse.next()
}
