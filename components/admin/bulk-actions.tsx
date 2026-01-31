// components/admin/bulk-actions.tsx
"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  ChevronDown,
  Trash,
  Download,
  Mail,
  CheckCircle,
  XCircle,
  Archive,
  Send,
  FileSpreadsheet,
} from "lucide-react"

export type BulkActionType =
  | "delete"
  | "export_csv"
  | "export_json"
  | "send_email"
  | "activate"
  | "deactivate"
  | "archive"
  | "mark_read"
  | "mark_unread"

interface BulkAction {
  id: BulkActionType
  label: string
  icon: React.ReactNode
  color?: string
  requiresConfirmation?: boolean
  confirmMessage?: string
}

interface BulkActionsProps {
  selectedIds: string[]
  entityType: "users" | "payments" | "tickets" | "subscriptions" | "affiliates" | "promo_codes" | "notifications"
  onActionComplete?: (action: BulkActionType, result: { success: boolean; count: number }) => void
  customActions?: BulkAction[]
}

const defaultActions: Record<string, BulkAction[]> = {
  users: [
    { id: "export_csv", label: "Exporter CSV", icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: "send_email", label: "Envoyer email", icon: <Mail className="w-4 h-4" /> },
    { id: "activate", label: "Activer", icon: <CheckCircle className="w-4 h-4" />, color: "text-green-400" },
    { id: "deactivate", label: "Désactiver", icon: <XCircle className="w-4 h-4" />, color: "text-yellow-400" },
    {
      id: "delete",
      label: "Supprimer",
      icon: <Trash className="w-4 h-4" />,
      color: "text-red-400",
      requiresConfirmation: true,
      confirmMessage: "Cette action est irréversible. Les utilisateurs sélectionnés seront définitivement supprimés.",
    },
  ],
  payments: [
    { id: "export_csv", label: "Exporter CSV", icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: "export_json", label: "Exporter JSON", icon: <Download className="w-4 h-4" /> },
    { id: "archive", label: "Archiver", icon: <Archive className="w-4 h-4" /> },
  ],
  tickets: [
    { id: "export_csv", label: "Exporter CSV", icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: "mark_read", label: "Marquer comme lu", icon: <CheckCircle className="w-4 h-4" /> },
    { id: "archive", label: "Archiver", icon: <Archive className="w-4 h-4" /> },
    {
      id: "delete",
      label: "Supprimer",
      icon: <Trash className="w-4 h-4" />,
      color: "text-red-400",
      requiresConfirmation: true,
    },
  ],
  subscriptions: [
    { id: "export_csv", label: "Exporter CSV", icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: "activate", label: "Activer", icon: <CheckCircle className="w-4 h-4" />, color: "text-green-400" },
    { id: "deactivate", label: "Suspendre", icon: <XCircle className="w-4 h-4" />, color: "text-yellow-400" },
  ],
  affiliates: [
    { id: "export_csv", label: "Exporter CSV", icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: "send_email", label: "Envoyer email", icon: <Mail className="w-4 h-4" /> },
    { id: "activate", label: "Approuver", icon: <CheckCircle className="w-4 h-4" />, color: "text-green-400" },
    { id: "deactivate", label: "Rejeter", icon: <XCircle className="w-4 h-4" />, color: "text-red-400" },
  ],
  promo_codes: [
    { id: "export_csv", label: "Exporter CSV", icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: "activate", label: "Activer", icon: <CheckCircle className="w-4 h-4" />, color: "text-green-400" },
    { id: "deactivate", label: "Désactiver", icon: <XCircle className="w-4 h-4" />, color: "text-yellow-400" },
    { id: "delete", label: "Supprimer", icon: <Trash className="w-4 h-4" />, color: "text-red-400", requiresConfirmation: true },
  ],
  notifications: [
    { id: "mark_read", label: "Marquer comme lu", icon: <CheckCircle className="w-4 h-4" /> },
    { id: "mark_unread", label: "Marquer non lu", icon: <XCircle className="w-4 h-4" /> },
    { id: "delete", label: "Supprimer", icon: <Trash className="w-4 h-4" />, color: "text-red-400" },
  ],
}

const tableMapping: Record<string, string> = {
  users: "user_profiles",
  payments: "payment_transactions",
  tickets: "support_tickets",
  subscriptions: "subscriptions",
  affiliates: "affiliates",
  promo_codes: "promo_codes",
  notifications: "admin_notifications",
}

export function BulkActions({
  selectedIds,
  entityType,
  onActionComplete,
  customActions,
}: BulkActionsProps) {
  const [loading, setLoading] = useState(false)
  const [confirmAction, setConfirmAction] = useState<BulkAction | null>(null)
  const supabase = createClient()

  const actions = customActions || defaultActions[entityType] || []

  const executeAction = async (action: BulkAction) => {
    if (action.requiresConfirmation && !confirmAction) {
      setConfirmAction(action)
      return
    }

    setLoading(true)
    setConfirmAction(null)

    try {
      const tableName = tableMapping[entityType]
      let success = true
      let count = selectedIds.length

      switch (action.id) {
        case "export_csv":
        case "export_json":
          await exportData(tableName, selectedIds, action.id === "export_csv" ? "csv" : "json")
          break

        case "delete":
          const { error: deleteError } = await supabase
            .from(tableName)
            .delete()
            .in("id", selectedIds)
          if (deleteError) throw deleteError
          break

        case "activate":
          const activateField = entityType === "promo_codes" ? "is_active" : "status"
          const activateValue = entityType === "promo_codes" ? true : "active"
          const { error: activateError } = await supabase
            .from(tableName)
            .update({ [activateField]: activateValue })
            .in("id", selectedIds)
          if (activateError) throw activateError
          break

        case "deactivate":
          const deactivateField = entityType === "promo_codes" ? "is_active" : "status"
          const deactivateValue = entityType === "promo_codes" ? false : "inactive"
          const { error: deactivateError } = await supabase
            .from(tableName)
            .update({ [deactivateField]: deactivateValue })
            .in("id", selectedIds)
          if (deactivateError) throw deactivateError
          break

        case "archive":
          const { error: archiveError } = await supabase
            .from(tableName)
            .update({ status: "archived" })
            .in("id", selectedIds)
          if (archiveError) throw archiveError
          break

        case "mark_read":
          const { error: readError } = await supabase
            .from(tableName)
            .update({ is_read: true, read_at: new Date().toISOString() })
            .in("id", selectedIds)
          if (readError) throw readError
          break

        case "mark_unread":
          const { error: unreadError } = await supabase
            .from(tableName)
            .update({ is_read: false, read_at: null })
            .in("id", selectedIds)
          if (unreadError) throw unreadError
          break

        case "send_email":
          // Récupérer les emails et ouvrir un dialog d'envoi
          const { data: emailData } = await supabase
            .from(tableName)
            .select("email")
            .in("id", selectedIds)
          // TODO: Ouvrir un dialog pour composer l'email
          console.log("Emails to send:", emailData?.map((d) => d.email))
          break
      }

      onActionComplete?.(action.id, { success, count })
    } catch (error) {
      console.error("[v0] Bulk action error:", error)
      onActionComplete?.(action.id, { success: false, count: 0 })
    } finally {
      setLoading(false)
    }
  }

  const exportData = async (tableName: string, ids: string[], format: "csv" | "json") => {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .in("id", ids)

    if (error || !data) throw error

    let content: string
    let mimeType: string
    let extension: string

    if (format === "csv") {
      const headers = Object.keys(data[0] || {})
      const rows = data.map((row) =>
        headers.map((h) => {
          const value = row[h]
          if (value === null || value === undefined) return ""
          if (typeof value === "object") return JSON.stringify(value)
          return String(value).includes(",") ? `"${value}"` : value
        }).join(",")
      )
      content = [headers.join(","), ...rows].join("\n")
      mimeType = "text/csv"
      extension = "csv"
    } else {
      content = JSON.stringify(data, null, 2)
      mimeType = "application/json"
      extension = "json"
    }

    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `${tableName}_export_${new Date().toISOString().split("T")[0]}.${extension}`
    link.click()
  }

  if (selectedIds.length === 0) {
    return null
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={loading}>
            Actions ({selectedIds.length})
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {actions.map((action, index) => (
            <div key={action.id}>
              {index > 0 && action.id === "delete" && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onClick={() => executeAction(action)}
                className={`cursor-pointer ${action.color || ""}`}
              >
                {action.icon}
                <span className="ml-2">{action.label}</span>
              </DropdownMenuItem>
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent className="bg-gray-900 border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmer l'action</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              {confirmAction?.confirmMessage ||
                `Êtes-vous sûr de vouloir ${confirmAction?.label.toLowerCase()} ${selectedIds.length} élément(s) ?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmAction && executeAction(confirmAction)}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// Hook pour gérer la sélection
export function useSelection<T extends { id: string }>(items: T[]) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    setSelectedIds(items.map((i) => i.id))
  }

  const deselectAll = () => {
    setSelectedIds([])
  }

  const isSelected = (id: string) => selectedIds.includes(id)

  const isAllSelected = items.length > 0 && selectedIds.length === items.length

  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < items.length

  return {
    selectedIds,
    toggleSelect,
    selectAll,
    deselectAll,
    isSelected,
    isAllSelected,
    isSomeSelected,
  }
}

export default BulkActions
