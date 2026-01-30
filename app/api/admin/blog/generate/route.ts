import { generateText } from "ai"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { data: adminProfile } = await supabase
      .from("admin_profiles")
      .select("*")
      .eq("id", user.id)
      .eq("is_admin", true)
      .single()

    if (!adminProfile) {
      return Response.json({ error: "Accès refusé" }, { status: 403 })
    }

    const { prompt, language = "fr", includeTable = false, includeImages = false } = await req.json()

    if (!prompt) {
      return Response.json({ error: "Prompt requis" }, { status: 400 })
    }

    console.log("[v0] Generating blog content with AI for prompt:", prompt)

    const languageMap: Record<string, string> = {
      fr: "français",
      en: "anglais",
      es: "espagnol",
      it: "italien",
      ar: "arabe",
      he: "hébreu",
    }

    const tableInstruction = includeTable
      ? "\n- Inclure au moins un tableau de données pertinent (format markdown)"
      : ""
    const imageInstruction = includeImages
      ? "\n- Suggérer des descriptions d'images à générer (format: [IMAGE: description])"
      : ""

    const startTime = Date.now()

    const { text, usage, finishReason } = await generateText({
      model: "openai/gpt-5",
      prompt: `Tu es un rédacteur expert de blog pour un service IPTV. Génère un article de blog complet et professionnel en ${languageMap[language] || "français"}.

Sujet: ${prompt}

Instructions:
- Titre accrocheur et SEO-optimisé (commence par "# ")
- Introduction engageante (100-150 mots)
- Sections bien structurées avec sous-titres (##, ###)
- Utilise des listes à puces et numérotées quand approprié
- Style clair, informatif et professionnel${tableInstruction}${imageInstruction}
- Conclusion avec call-to-action
- 3-5 tags pertinents à la fin (format: Tags: tag1, tag2, tag3)
- Longueur: 800-1200 mots

Format: Markdown strict pour une mise en forme optimale.`,
      maxOutputTokens: 4000,
      temperature: 0.7,
      topP: 0.9,
      frequencyPenalty: 0.1,
      presencePenalty: 0.1,
    })

    const generationTime = Date.now() - startTime

    console.log("[v0] AI generation completed:", {
      tokensUsed: usage?.totalTokens || 0,
      generationTime,
      finishReason,
    })

    const lines = text.split("\n").filter((line) => line.trim())
    const title =
      lines
        .find((line) => line.startsWith("# "))
        ?.replace("# ", "")
        .trim() || "Article sans titre"

    // Extraire le premier paragraphe substantiel comme extrait
    const contentLines = lines.filter((line) => !line.startsWith("#") && !line.startsWith("Tags:") && line.length > 50)
    const excerpt = contentLines[0]?.substring(0, 200) || ""

    // Extraire les tags
    const tagsLine = lines.find((line) => line.toLowerCase().startsWith("tags:"))
    const tags = tagsLine
      ? tagsLine
          .replace(/tags:/i, "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : []

    return Response.json({
      success: true,
      content: text,
      title,
      excerpt,
      tags,
      usage: {
        totalTokens: usage?.totalTokens || 0,
        promptTokens: usage?.promptTokens || 0,
        completionTokens: usage?.completionTokens || 0,
      },
      generationTime,
      finishReason,
    })
  } catch (error: any) {
    console.error("[v0] Error generating blog content:", error)
    return Response.json(
      {
        error: "Erreur lors de la génération",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
