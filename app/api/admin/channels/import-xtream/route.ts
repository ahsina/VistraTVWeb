import { createServerClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

interface XtreamCategory {
  category_id: string
  category_name: string
  parent_id: number
}

interface XtreamChannel {
  stream_id: number
  num: number
  name: string
  stream_icon: string
  category_id: string
  epg_channel_id: string | null
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { xtreamUrl, username, password } = body

    if (!xtreamUrl || !username || !password) {
      return NextResponse.json(
        { error: "Missing required fields: xtreamUrl, username, password" },
        { status: 400 }
      )
    }

    console.log("[v0] Fetching Xtream IPTV data from:", xtreamUrl)

    const categoriesUrl = `${xtreamUrl}/player_api.php?username=${username}&password=${password}&action=get_live_categories`
    const categoriesResponse = await fetch(categoriesUrl)

    if (!categoriesResponse.ok) {
      throw new Error(`Failed to fetch categories: ${categoriesResponse.statusText}`)
    }

    const categories: XtreamCategory[] = await categoriesResponse.json()
    console.log("[v0] Fetched", categories.length, "categories")

    const streamsUrl = `${xtreamUrl}/player_api.php?username=${username}&password=${password}&action=get_live_streams`
    const streamsResponse = await fetch(streamsUrl)

    if (!streamsResponse.ok) {
      throw new Error(`Failed to fetch streams: ${streamsResponse.statusText}`)
    }

    const streams: XtreamChannel[] = await streamsResponse.json()
    console.log("[v0] Fetched", streams.length, "channels")

    const categoryMap = new Map<string, string>()
    categories.forEach((cat) => {
      categoryMap.set(cat.category_id, cat.category_name)
    })

    const channelsToImport = streams.map((stream, index) => ({
      name: stream.name,
      logo_url: stream.stream_icon || null,
      category: categoryMap.get(stream.category_id) || "Uncategorized",
      display_order: index,
      is_active: true,
    }))

    console.log("[v0] Prepared", channelsToImport.length, "channels for import")

    const { data: insertedChannels, error: insertError } = await supabase
      .from("channels")
      .insert(channelsToImport)
      .select()

    if (insertError) {
      console.error("[v0] Error inserting channels:", insertError)
      throw insertError
    }

    console.log("[v0] Successfully imported", insertedChannels?.length, "channels")

    return NextResponse.json({
      success: true,
      imported: insertedChannels?.length || 0,
      message: `Successfully imported ${insertedChannels?.length} channels from Xtream IPTV`,
    })
  } catch (error) {
    console.error("[v0] Error importing from Xtream IPTV:", error)
    return NextResponse.json(
      {
        error: "Failed to import channels",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
