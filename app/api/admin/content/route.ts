import { createAdminClient } from "@/lib/supabase/admin"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // hero, features, etc.
    const language = searchParams.get("language")

    let query

    switch (type) {
      case "hero":
        query = supabase.from("hero_content").select("*")
        if (language) {
          query = query.eq("language", language)
        }
        break
      case "features":
        query = supabase.from("features").select("*")
        if (language) {
          query = query.eq("language", language)
        }
        query = query.order("display_order", { ascending: true })
        break
      case "tutorials":
        query = supabase.from("tutorial_devices").select("*")
        if (language) {
          query = query.eq("language", language)
        }
        query = query.order("display_order", { ascending: true })
        break
      case "plans":
        query = supabase.from("subscription_plans").select("*")
        if (language) {
          query = query.eq("language", language)
        }
        query = query.order("display_order", { ascending: true })
        break
      default:
        return NextResponse.json({ error: "Invalid content type" }, { status: 400 })
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    const { type, ...contentData } = body

    let tableName
    switch (type) {
      case "hero":
        tableName = "hero_content"
        break
      case "features":
        tableName = "features"
        break
      case "tutorials":
        tableName = "tutorial_devices"
        break
      case "plans":
        tableName = "subscription_plans"
        break
      default:
        return NextResponse.json({ error: "Invalid content type" }, { status: 400 })
    }

    const { data, error } = await supabase.from(tableName).insert([contentData]).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    const { type, id, ...updateData } = body

    let tableName
    switch (type) {
      case "hero":
        tableName = "hero_content"
        break
      case "features":
        tableName = "features"
        break
      case "tutorials":
        tableName = "tutorial_devices"
        break
      case "plans":
        tableName = "subscription_plans"
        break
      default:
        return NextResponse.json({ error: "Invalid content type" }, { status: 400 })
    }

    const { data, error } = await supabase.from(tableName).update(updateData).eq("id", id).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const id = searchParams.get("id")

    if (!id || !type) {
      return NextResponse.json({ error: "ID and type required" }, { status: 400 })
    }

    let tableName
    switch (type) {
      case "hero":
        tableName = "hero_content"
        break
      case "features":
        tableName = "features"
        break
      case "tutorials":
        tableName = "tutorial_devices"
        break
      case "plans":
        tableName = "subscription_plans"
        break
      default:
        return NextResponse.json({ error: "Invalid content type" }, { status: 400 })
    }

    const { error } = await supabase.from(tableName).delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
