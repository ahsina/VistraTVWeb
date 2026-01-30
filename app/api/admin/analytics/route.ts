import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const range = searchParams.get("range") || "30d"

    // Calculate date range
    const now = new Date()
    const daysAgo = range === "7d" ? 7 : range === "30d" ? 30 : 90
    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)

    // Get revenue data
    const { data: revenueData } = await supabase.rpc("get_revenue_by_month", {
      start_date: startDate.toISOString(),
    })

    // Get user growth data
    const { data: userGrowthData } = await supabase.rpc("get_user_growth_by_month", {
      start_date: startDate.toISOString(),
    })

    // Get top channels by views
    const { data: topChannelsData } = await supabase
      .from("channels")
      .select("name, total_views")
      .order("total_views", { ascending: false })
      .limit(5)

    // Get top content by views
    const { data: topContentData } = await supabase
      .from("content")
      .select("title, view_count")
      .order("view_count", { ascending: false })
      .limit(5)

    const data = {
      revenue:
        revenueData?.map((item: any) => ({
          month: item.month,
          amount: item.total_revenue,
        })) || [],
      users:
        userGrowthData?.map((item: any) => ({
          month: item.month,
          count: item.user_count,
        })) || [],
      topChannels:
        topChannelsData?.map((channel) => ({
          name: channel.name,
          views: channel.total_views,
        })) || [],
      topContent:
        topContentData?.map((content) => ({
          title: content.title,
          views: content.view_count,
        })) || [],
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
