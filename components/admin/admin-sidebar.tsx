"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  Tv,
  CreditCard,
  BookOpen,
  Users,
  Settings,
  Film,
  Calendar,
  DollarSign,
  MessageSquare,
  TrendingUp,
  Sparkles,
  Megaphone,
  Tag,
  UserPlus,
  Wallet,
  Mail,
  Bell,
  Activity,
  BarChart3,
} from "@/lib/icons"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Blog", href: "/admin/dashboard/blog", icon: FileText },
  { name: "Analytics", href: "/admin/dashboard/analytics", icon: TrendingUp },
  { name: "Analytics Avancées", href: "/admin/dashboard/analytics-advanced", icon: BarChart3 },
  { name: "Revenus", href: "/admin/dashboard/revenue", icon: DollarSign },
  { name: "Hero Content", href: "/admin/dashboard/hero", icon: FileText },
  { name: "Features", href: "/admin/dashboard/features", icon: Sparkles },
  { name: "Channels", href: "/admin/dashboard/channels", icon: Tv },
  { name: "Content", href: "/admin/dashboard/content", icon: Film },
  { name: "Subscription Plans", href: "/admin/dashboard/subscriptions", icon: CreditCard },
  { name: "Active Subscriptions", href: "/admin/dashboard/active-subscriptions", icon: Calendar },
  { name: "Payments", href: "/admin/dashboard/payments", icon: DollarSign },
  { name: "Paniers Abandonnés", href: "/admin/dashboard/abandoned-payments", icon: Mail },
  { name: "Promo Codes", href: "/admin/dashboard/promo-codes", icon: Tag },
  { name: "Affiliates", href: "/admin/dashboard/affiliates", icon: UserPlus },
  { name: "Support", href: "/admin/dashboard/support", icon: MessageSquare },
  { name: "Tutorials", href: "/admin/dashboard/tutorials", icon: BookOpen },
  { name: "Marketing", href: "/admin/dashboard/marketing", icon: Megaphone },
  { name: "Notifications", href: "/admin/dashboard/notifications", icon: Bell },
  { name: "Users", href: "/admin/dashboard/users", icon: Users },
  { name: "Journal d'Activité", href: "/admin/dashboard/activity-log", icon: Activity },
  { name: "Settings", href: "/admin/dashboard/settings", icon: Settings },
  { name: "Gateway Config", href: "/admin/dashboard/settings/gateway", icon: Wallet },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-white/5 backdrop-blur-md border-r border-white/10">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00d4ff] to-[#e94b87] bg-clip-text text-transparent">
          VistraTV Admin
        </h1>
      </div>
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                isActive
                  ? "bg-gradient-to-r from-[#00d4ff]/20 to-[#e94b87]/20 text-white border border-white/20"
                  : "text-gray-300 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
