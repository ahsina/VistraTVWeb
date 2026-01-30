"use client"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Wallet, Key, Link as LinkIcon, Settings } from "@/lib/icons"

interface GatewayConfig {
  id: string
  gateway_name: string
  api_url: string
  api_key: string | null
  merchant_id: string | null
  polygon_wallet_address: string | null
  usdc_polygon_address: string | null
  affiliate_address: string | null
  encrypted_wallet: string | null
  webhook_url: string | null
  payment_provider: string | null
  is_active: boolean
  test_mode: boolean
}

const PAYMENT_PROVIDERS = [
  { value: "wert", label: "Wert" },
  { value: "moonpay", label: "MoonPay" },
  { value: "transak", label: "Transak" },
  { value: "guardarian", label: "Guardarian" },
  { value: "utorg", label: "Utorg" },
  { value: "onramper", label: "Onramper" },
]

export function GatewayConfigManager() {
  const [config, setConfig] = useState<GatewayConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    setLoading(true)
    const { data, error } = await supabase.from("payment_gateway_config").select("*").eq("is_active", true).single()

    if (!error && data) {
      setConfig(data)
    } else {
      // Create default config if none exists
      const { data: newConfig } = await supabase
        .from("payment_gateway_config")
        .insert({
          gateway_name: "PayGate.to",
          api_url: "https://api.paygate.to",
          payment_provider: "wert",
          is_active: true,
          test_mode: true,
        })
        .select()
        .single()

      if (newConfig) setConfig(newConfig)
    }
    setLoading(false)
  }

  const handleSave = async () => {
    if (!config) return

    setSaving(true)
    const { error } = await supabase
      .from("payment_gateway_config")
      .update({
        gateway_name: config.gateway_name,
        api_url: config.api_url,
        api_key: config.api_key,
        merchant_id: config.merchant_id,
        polygon_wallet_address: config.polygon_wallet_address,
        usdc_polygon_address: config.usdc_polygon_address,
        affiliate_address: config.affiliate_address,
        webhook_url: config.webhook_url,
        payment_provider: config.payment_provider,
        is_active: config.is_active,
        test_mode: config.test_mode,
        updated_at: new Date().toISOString(),
      })
      .eq("id", config.id)

    if (!error) {
      alert("Configuration sauvegardée avec succès!")
    } else {
      alert("Erreur lors de la sauvegarde")
    }
    setSaving(false)
  }

  const handleGenerateWallet = async () => {
    if (!config.usdc_polygon_address) {
      alert("Veuillez d'abord entrer votre adresse USDC Polygon")
      return
    }

    setGenerating(true)
    console.log("[v0] Starting wallet generation from admin...")

    const response = await fetch("/api/payment/generate-wallet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usdcAddress: config.usdc_polygon_address,
        affiliateAddress: config.affiliate_address,
      }),
    })

    console.log("[v0] Wallet generation response status:", response.status)
    const data = await response.json()
    console.log("[v0] Wallet generation response data:", data)

    if (response.ok && data.encryptedWallet) {
      setConfig({ ...config, encrypted_wallet: data.encryptedWallet })
      alert("Wallet crypté généré avec succès!")
      await fetchConfig() // Refresh to get updated data
    } else {
      alert(data.error || "Erreur lors de la génération du wallet")
    }
    setGenerating(false)
  }

  if (loading) {
    return <div className="text-white">Chargement...</div>
  }

  if (!config) {
    return <div className="text-white">Erreur de chargement de la configuration</div>
  }

  return (
    <div className="space-y-6">
      {/* Gateway Settings */}
      <Card className="p-6 bg-white/5 border-white/10">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-6 h-6 text-[#00d4ff]" />
          <h2 className="text-2xl font-bold text-white">Paramètres Généraux</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-white">Nom de la Gateway</Label>
            <Input
              value={config.gateway_name}
              onChange={(e) => setConfig({ ...config, gateway_name: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div>
            <Label className="text-white">Provider de Paiement</Label>
            <Select
              value={config.payment_provider || "wert"}
              onValueChange={(value) => setConfig({ ...config, payment_provider: value })}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_PROVIDERS.map((provider) => (
                  <SelectItem key={provider.value} value={provider.value}>
                    {provider.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-400 mt-1">Sélectionnez le fournisseur de paiement utilisé par PayGate.to</p>
          </div>

          <div>
            <Label className="text-white flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              URL de l'API
            </Label>
            <Input
              value={config.api_url}
              onChange={(e) => setConfig({ ...config, api_url: e.target.value })}
              placeholder="https://api.paygate.to"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div>
            <Label className="text-white flex items-center gap-2">
              <Key className="w-4 h-4" />
              Clé API
            </Label>
            <Input
              type="password"
              value={config.api_key || ""}
              onChange={(e) => setConfig({ ...config, api_key: e.target.value })}
              placeholder="sk_live_..."
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div>
            <Label className="text-white">Merchant ID</Label>
            <Input
              value={config.merchant_id || ""}
              onChange={(e) => setConfig({ ...config, merchant_id: e.target.value })}
              placeholder="merchant_123456"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div>
            <Label className="text-white">Webhook URL</Label>
            <Input
              value={config.webhook_url || ""}
              onChange={(e) => setConfig({ ...config, webhook_url: e.target.value })}
              placeholder="https://votresite.com/api/webhook/payment"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <Separator className="bg-white/10" />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Mode Test</Label>
              <p className="text-sm text-gray-400">Activez pour tester sans transactions réelles</p>
            </div>
            <Switch
              checked={config.test_mode}
              onCheckedChange={(checked) => setConfig({ ...config, test_mode: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Gateway Active</Label>
              <p className="text-sm text-gray-400">Activez pour accepter les paiements</p>
            </div>
            <Switch
              checked={config.is_active}
              onCheckedChange={(checked) => setConfig({ ...config, is_active: checked })}
            />
          </div>
        </div>
      </Card>

      {/* Polygon Wallet */}
      <Card className="p-6 bg-white/5 border-white/10">
        <div className="flex items-center gap-2 mb-6">
          <Wallet className="w-6 h-6 text-[#00d4ff]" />
          <h2 className="text-2xl font-bold text-white">PayGate.to - Wallet USDC Polygon</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-white">Adresse du Wallet USDC (Polygon)</Label>
            <Input
              value={config.usdc_polygon_address || ""}
              onChange={(e) => setConfig({ ...config, usdc_polygon_address: e.target.value })}
              placeholder="0x..."
              className="bg-white/10 border-white/20 text-white font-mono"
            />
            <p className="text-sm text-gray-400 mt-2">
              Votre adresse de wallet pour recevoir les paiements en USDC sur Polygon
            </p>
          </div>

          <div>
            <Label className="text-white">Adresse Affiliate (Optionnel)</Label>
            <Input
              value={config.affiliate_address || ""}
              onChange={(e) => setConfig({ ...config, affiliate_address: e.target.value })}
              placeholder="0x..."
              className="bg-white/10 border-white/20 text-white font-mono"
            />
            <p className="text-sm text-gray-400 mt-2">
              Adresse pour recevoir des commissions d'affiliation de PayGate.to
            </p>
          </div>

          <div>
            <Label className="text-white">Wallet Crypté PayGate.to</Label>
            <div className="flex gap-2">
              <Input
                value={config.encrypted_wallet || "Non généré"}
                readOnly
                className="bg-white/5 border-white/20 text-white font-mono text-sm"
              />
              <Button
                onClick={handleGenerateWallet}
                disabled={!config.usdc_polygon_address || generating}
                className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87] whitespace-nowrap"
              >
                {generating ? "Génération..." : "Générer"}
              </Button>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Générez un wallet crypté pour accepter les paiements via PayGate.to
            </p>
          </div>

          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-300">
              <strong>Note:</strong> PayGate.to permet d'accepter les paiements par carte (Visa, MasterCard, Maestro),
              Apple Pay, Google Pay, et virements bancaires SEPA/ACH. Les paiements sont instantanément convertis en
              USDC et envoyés à votre wallet Polygon.
            </p>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87]">
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Sauvegarde..." : "Sauvegarder la Configuration"}
        </Button>
      </div>
    </div>
  )
}
