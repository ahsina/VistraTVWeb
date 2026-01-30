"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Tv, CreditCard, BookOpen, Users, DollarSign, TrendingUp, AlertCircle, Film } from "@/lib/icons"
import { format } from "@/lib/utils/date-formatter"
import Link from "next/link"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    usersCount: 0,
    activeSubsCount: 0,
    totalRevenue: 0,
    openTicketsCount: 0,
    heroCount: 0,
    featuresCount: 0,
    channelsCount: 0,
    contentCount: 0,
    plansCount: 0,
    tutorialsCount: 0,
  })
  const [recentPayments, setRecentPayments] = useState<any[]>([])
  const [recentUsers, setRecentUsers] = useState<any[]>([])

  useEffect(() => {
    console.log("[v0] Dashboard page mounted")
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    try {
      console.log("[v0] Starting to load dashboard data...")
      const supabase = createClient()

      // Check authentication
      const {
        data: { user },
      } = await supabase.auth.getUser()

      console.log("[v0] User:", user?.email)

      if (!user) {
        console.log("[v0] No user, redirecting to login")
        router.push("/admin/login")
        return
      }

      // Fetch all counts in parallel
      console.log("[v0] Fetching counts...")
      const [
        { count: usersCount },
        { count: activeSubsCount },
        { count: heroCount },
        { count: featuresCount },
        { count: channelsCount },
        { count: contentCount },
        { count: plansCount },
        { count: tutorialsCount },
        { count: openTicketsCount },
        { data: payments },
        { data: allPayments },
        { data: users },
      ] = await Promise.all([
        supabase.from("user_profiles").select("*", { count: "exact", head: true }),
        supabase.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("hero_content").select("*", { count: "exact", head: true }),
        supabase.from("features").select("*", { count: "exact", head: true }),
        supabase.from("channels").select("*", { count: "exact", head: true }),
        supabase.from("content").select("*", { count: "exact", head: true }),
        supabase.from("subscription_plans").select("*", { count: "exact", head: true }),
        supabase.from("tutorial_devices").select("*", { count: "exact", head: true }),
        supabase.from("support_tickets").select("*", { count: "exact", head: true }).eq("status", "open"),
        supabase
          .from("payments")
          .select("*")
          .eq("status", "completed")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase.from("payments").select("amount").eq("status", "completed"),
        supabase.from("user_profiles").select("*").order("created_at", { ascending: false }).limit(5),
      ])

      console.log("[v0] Counts fetched:", {
        usersCount,
        activeSubsCount,
        heroCount,
        featuresCount,
        channelsCount,
        contentCount,
        plansCount,
        tutorialsCount,
        openTicketsCount,
      })

      const totalRevenue = allPayments?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0

      setStats({
        usersCount: usersCount || 0,
        activeSubsCount: activeSubsCount || 0,
        totalRevenue,
        openTicketsCount: openTicketsCount || 0,
        heroCount: heroCount || 0,
        featuresCount: featuresCount || 0,
        channelsCount: channelsCount || 0,
        contentCount: contentCount || 0,
        plansCount: plansCount || 0,
        tutorialsCount: tutorialsCount || 0,
      })

      setRecentPayments(payments || [])
      setRecentUsers(users || [])

      console.log("[v0] Dashboard data loaded successfully")
    } catch (error) {
      console.error("[v0] Error loading dashboard data:", error)
    } finally {
      setLoading(false)
      console.log("[v0] Dashboard loading complete")
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Admin</h1>
          <p className="text-muted-foreground mt-1">Chargement...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const mainStats = [
    {
      title: "Total Utilisateurs",
      value: stats.usersCount,
      icon: Users,
      color: "text-blue-500",
      href: "/admin/dashboard/users",
    },
    {
      title: "Abonnements Actifs",
      value: stats.activeSubsCount,
      icon: CreditCard,
      color: "text-green-500",
      href: "/admin/dashboard/active-subscriptions",
    },
    {
      title: "Revenu Total",
      value: `${stats.totalRevenue.toFixed(0)} MAD`,
      icon: DollarSign,
      color: "text-yellow-500",
      href: "/admin/dashboard/payments",
    },
    {
      title: "Tickets Ouverts",
      value: stats.openTicketsCount,
      icon: AlertCircle,
      color: "text-red-500",
      href: "/admin/dashboard/support",
    },
  ]

  const contentStats = [
    {
      title: "Hero Content",
      value: stats.heroCount,
      icon: FileText,
      href: "/admin/dashboard/hero",
    },
    {
      title: "Features",
      value: stats.featuresCount,
      icon: TrendingUp,
      href: "/admin/dashboard/features",
    },
    {
      title: "Chaînes Live",
      value: stats.channelsCount,
      icon: Tv,
      href: "/admin/dashboard/channels",
    },
    {
      title: "Films & Séries",
      value: stats.contentCount,
      icon: Film,
      href: "/admin/dashboard/content",
    },
    {
      title: "Plans Abonnement",
      value: stats.plansCount,
      icon: CreditCard,
      href: "/admin/dashboard/subscriptions",
    },
    {
      title: "Tutoriels",
      value: stats.tutorialsCount,
      icon: BookOpen,
      href: "/admin/dashboard/tutorials",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-rose-400 bg-clip-text text-transparent">
          Dashboard Admin
        </h1>
        <p className="text-muted-foreground mt-1">Vue d'ensemble de la plateforme VistraTV</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="bg-card/50 backdrop-blur-md border-border hover:bg-card/80 transition-all cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Gestion du Contenu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentStats.map((stat) => {
            const Icon = stat.icon
            return (
              <Link key={stat.title} href={stat.href}>
                <Card className="bg-card/50 backdrop-blur-md border-border hover:bg-card/80 transition-all cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 backdrop-blur-md border-border">
          <CardHeader>
            <CardTitle>Derniers Paiements</CardTitle>
          </CardHeader>
          <CardContent>
            {recentPayments && recentPayments.length > 0 ? (
              <div className="space-y-3">
                {recentPayments.map((payment: any) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <div className="flex-1">
                      <p className="font-medium text-sm">ID: {payment.user_id.slice(0, 8)}...</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(payment.created_at), "dd MMM yyyy")}
                      </p>
                    </div>
                    <div className="font-semibold text-green-500">
                      {payment.amount} {payment.currency}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Aucun paiement récent</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-md border-border">
          <CardHeader>
            <CardTitle>Nouveaux Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            {recentUsers && recentUsers.length > 0 ? (
              <div className="space-y-3">
                {recentUsers.map((user: any) => (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{user.full_name || "N/A"}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">{format(new Date(user.created_at), "dd MMM")}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Aucun nouvel utilisateur</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50 backdrop-blur-md border-border">
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link
              href="/admin/dashboard/content"
              className="p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-rose-500/10 hover:from-cyan-500/20 hover:to-rose-500/20 border border-cyan-500/20 transition-all text-center"
            >
              <Film className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
              <p className="text-sm font-medium">Ajouter Contenu</p>
            </Link>
            <Link
              href="/admin/dashboard/channels"
              className="p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-rose-500/10 hover:from-cyan-500/20 hover:to-rose-500/20 border border-cyan-500/20 transition-all text-center"
            >
              <Tv className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
              <p className="text-sm font-medium">Gérer Chaînes</p>
            </Link>
            <Link
              href="/admin/dashboard/support"
              className="p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-rose-500/10 hover:from-cyan-500/20 hover:to-rose-500/20 border border-cyan-500/20 transition-all text-center"
            >
              <AlertCircle className="w-6 h-6 mx-auto mb-2 text-rose-400" />
              <p className="text-sm font-medium">Support Client</p>
            </Link>
            <Link
              href="/admin/dashboard/analytics"
              className="p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-rose-500/10 hover:from-cyan-500/20 hover:to-rose-500/20 border border-cyan-500/20 transition-all text-center"
            >
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <p className="text-sm font-medium">Voir Analytics</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
