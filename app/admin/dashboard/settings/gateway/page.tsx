import { GatewayConfigManager } from "@/components/admin/gateway-config-manager"

export default function GatewayConfigPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Configuration Payment Gateway</h1>
        <p className="text-gray-400 mt-2">Configurez votre passerelle de paiement et wallet Polygon</p>
      </div>
      <GatewayConfigManager />
    </div>
  )
}
