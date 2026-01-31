"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Copy, Check } from "lucide-react"

interface Template {
  id: string
  title: string
  content: string
  category: string
  language: string
}

interface SupportResponseTemplatesProps {
  initialTemplates?: Template[]
}

export function SupportResponseTemplates({ initialTemplates = [] }: SupportResponseTemplatesProps) {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const defaultTemplates: Template[] = [
    {
      id: "1",
      title: "Bienvenue",
      content: "Bonjour ! Merci de contacter le support VistraTV. Comment puis-je vous aider aujourd'hui ?",
      category: "greeting",
      language: "fr",
    },
    {
      id: "2",
      title: "Problème de connexion",
      content: "Je comprends que vous rencontrez des difficultés de connexion. Pouvez-vous me confirmer l'appareil que vous utilisez et si vous avez essayé de redémarrer l'application ?",
      category: "technical",
      language: "fr",
    },
    {
      id: "3",
      title: "Confirmation paiement",
      content: "Votre paiement a bien été reçu ! Vos identifiants de connexion ont été envoyés à votre adresse email. Si vous ne les avez pas reçus, vérifiez vos spams.",
      category: "payment",
      language: "fr",
    },
  ]

  const displayTemplates = templates.length > 0 ? templates : defaultTemplates

  const copyToClipboard = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const categoryColors: Record<string, string> = {
    greeting: "bg-green-500/20 text-green-300",
    technical: "bg-blue-500/20 text-blue-300",
    payment: "bg-yellow-500/20 text-yellow-300",
    general: "bg-gray-500/20 text-gray-300",
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Modèles de Réponse</h2>
          <p className="text-gray-400">Gérez vos réponses pré-enregistrées pour le support</p>
        </div>
        <Button className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87]">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau modèle
        </Button>
      </div>

      <div className="grid gap-4">
        {displayTemplates.map((template) => (
          <Card key={template.id} className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <CardTitle className="text-white text-lg">{template.title}</CardTitle>
                <Badge className={categoryColors[template.category] || categoryColors.general}>
                  {template.category}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(template.content, template.id)}
                  className="text-gray-400 hover:text-white"
                >
                  {copiedId === template.id ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm">{template.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default SupportResponseTemplates
