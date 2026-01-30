"use client"

import { useEffect, useState } from "react"
import { X } from "@/lib/icons"
import { Button } from "@/components/ui/button"

interface PaymentModalProps {
  isOpen: boolean
  paymentUrl: string
  transactionId: string
  onSuccess: () => void
  onFailure: () => void
  onClose: () => void
}

export function PaymentModal({ isOpen, paymentUrl, transactionId, onSuccess, onFailure, onClose }: PaymentModalProps) {
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    if (isOpen && paymentUrl) {
      console.log("[v0] Payment modal opened with URL:", paymentUrl)
      console.log("[v0] Transaction ID:", transactionId)
    }
  }, [isOpen, paymentUrl, transactionId])

  useEffect(() => {
    if (!isOpen || !transactionId) return

    const pollInterval = setInterval(async () => {
      try {
        setIsChecking(true)
        const response = await fetch(`/api/payment/status?transactionId=${transactionId}`)
        const data = await response.json()

        console.log("[v0] Payment status:", data.status)

        if (data.status === "completed") {
          clearInterval(pollInterval)
          onSuccess()
        } else if (data.status === "failed" || data.status === "cancelled") {
          clearInterval(pollInterval)
          onFailure()
        }
      } catch (error) {
        console.error("[v0] Error checking payment status:", error)
      } finally {
        setIsChecking(false)
      }
    }, 3000)

    return () => clearInterval(pollInterval)
  }, [isOpen, transactionId, onSuccess, onFailure])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-4xl h-[95vh] sm:h-[90vh] bg-gradient-to-br from-[#0a0d2c] via-[#1a1147] to-[#2d1055] rounded-lg sm:rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white/10 bg-black/20">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 animate-pulse" />
            <h2 className="text-sm sm:text-lg font-bold text-white">Paiement sécurisé</h2>
            {isChecking && (
              <span className="hidden sm:flex text-xs text-[#00d4ff] items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse" />
                Vérification...
              </span>
            )}
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>

        {/* Payment iframe */}
        <div className="w-full h-[calc(100%-48px)] sm:h-[calc(100%-60px)]">
          <iframe
            src={paymentUrl}
            className="w-full h-full border-0"
            title="PayGate Payment"
            allow="payment"
            sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation"
          />
        </div>
      </div>
    </div>
  )
}
