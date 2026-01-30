"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, RefreshCw, X, Calendar } from "@/lib/icons"
import { format } from "date-fns"

interface Subscription {
  id: string
  user_id: string
  plan_id: string
  status: string
  start_date: string
  end_date: string
  auto_renew: boolean
  created_at: string
  user_profiles: {
    email: string
    full_name: string | null
  }
  subscription_plans: {
    name: string
    price: number
    language: string
  }
}

interface ActiveSubscriptionsManagerProps {
  initialData: Subscription[]
}

export default function ActiveSubscriptionsManager({ initialData }: ActiveSubscriptionsManagerProps) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialData)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch =
      sub.user_profiles.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.user_profiles.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.subscription_plans.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || sub.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleCancelSubscription = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this subscription?")) return

    try {
      const response = await fetch(`/api/admin/subscriptions/${id}/cancel`, {
        method: "POST",
      })

      if (response.ok) {
        setSubscriptions(
          subscriptions.map((sub) => (sub.id === id ? { ...sub, status: "cancelled", auto_renew: false } : sub)),
        )
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error)
    }
  }

  const handleRenewSubscription = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/subscriptions/${id}/renew`, {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        setSubscriptions(subscriptions.map((sub) => (sub.id === id ? data : sub)))
      }
    } catch (error) {
      console.error("Error renewing subscription:", error)
    }
  }

  const getStatusBadge = (status: string, endDate: string) => {
    const isExpired = new Date(endDate) < new Date()
    if (status === "cancelled") {
      return <Badge className="bg-red-500/20 text-red-400">Cancelled</Badge>
    }
    if (isExpired) {
      return <Badge className="bg-orange-500/20 text-orange-400">Expired</Badge>
    }
    if (status === "active") {
      return <Badge className="bg-green-500/20 text-green-400">Active</Badge>
    }
    return <Badge className="bg-gray-500/20 text-gray-400">{status}</Badge>
  }

  const getDaysRemaining = (endDate: string) => {
    const days = Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  }

  const activeCount = subscriptions.filter((s) => s.status === "active").length
  const expiringCount = subscriptions.filter((s) => {
    const days = getDaysRemaining(s.end_date)
    return s.status === "active" && days <= 7 && days > 0
  }).length
  const totalRevenue = subscriptions
    .filter((s) => s.status === "active")
    .reduce((sum, s) => sum + s.subscription_plans.price, 0)

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by user or plan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="text-sm text-gray-400">Total Subscriptions</div>
          <div className="text-2xl font-bold text-white mt-1">{subscriptions.length}</div>
        </Card>
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="text-sm text-gray-400">Active</div>
          <div className="text-2xl font-bold text-green-400 mt-1">{activeCount}</div>
        </Card>
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="text-sm text-gray-400">Expiring Soon</div>
          <div className="text-2xl font-bold text-orange-400 mt-1">{expiringCount}</div>
        </Card>
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="text-sm text-gray-400">Monthly Revenue</div>
          <div className="text-2xl font-bold text-white mt-1">${totalRevenue.toFixed(2)}</div>
        </Card>
      </div>

      {/* Subscriptions Table */}
      <Card className="bg-white/5 border-white/10">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-white/5">
              <TableHead className="text-gray-400">User</TableHead>
              <TableHead className="text-gray-400">Plan</TableHead>
              <TableHead className="text-gray-400">Price</TableHead>
              <TableHead className="text-gray-400">Start Date</TableHead>
              <TableHead className="text-gray-400">End Date</TableHead>
              <TableHead className="text-gray-400">Days Left</TableHead>
              <TableHead className="text-gray-400">Auto-Renew</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscriptions.map((sub) => {
              const daysRemaining = getDaysRemaining(sub.end_date)
              return (
                <TableRow key={sub.id} className="border-white/10 hover:bg-white/5">
                  <TableCell>
                    <div>
                      <div className="text-white font-medium">{sub.user_profiles.full_name || "N/A"}</div>
                      <div className="text-sm text-gray-400">{sub.user_profiles.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-white">{sub.subscription_plans.name}</div>
                    <div className="text-xs text-gray-400">{sub.subscription_plans.language.toUpperCase()}</div>
                  </TableCell>
                  <TableCell className="text-white font-medium">${sub.subscription_plans.price}</TableCell>
                  <TableCell className="text-gray-300">{format(new Date(sub.start_date), "MMM dd, yyyy")}</TableCell>
                  <TableCell className="text-gray-300">{format(new Date(sub.end_date), "MMM dd, yyyy")}</TableCell>
                  <TableCell>
                    <span
                      className={
                        daysRemaining <= 7 && daysRemaining > 0
                          ? "text-orange-400 font-medium"
                          : daysRemaining === 0
                            ? "text-red-400 font-medium"
                            : "text-gray-300"
                      }
                    >
                      {daysRemaining} days
                    </span>
                  </TableCell>
                  <TableCell>
                    {sub.auto_renew ? (
                      <Badge className="bg-green-500/20 text-green-400">Yes</Badge>
                    ) : (
                      <Badge className="bg-gray-500/20 text-gray-400">No</Badge>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(sub.status, sub.end_date)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {sub.status === "active" && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRenewSubscription(sub.id)}
                            className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                            title="Extend subscription"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCancelSubscription(sub.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            title="Cancel subscription"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        {filteredSubscriptions.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No subscriptions found</p>
          </div>
        )}
      </Card>
    </div>
  )
}
