import { AbandonedPaymentsManager } from "@/components/admin/abandoned-payments-manager"

export default function AbandonedPaymentsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Paiements Abandonnés</h1>
      <AbandonedPaymentsManager />
    </div>
  )
}
