// lib/storage/image-service.ts
import { createClient } from "@/lib/supabase/admin"

interface UploadOptions {
  bucket?: string
  folder?: string
  maxSizeMB?: number
  allowedTypes?: string[]
  generateThumbnail?: boolean
  thumbnailSize?: number
}

interface UploadResult {
  success: boolean
  url?: string
  thumbnailUrl?: string
  path?: string
  error?: string
  metadata?: {
    size: number
    type: string
    width?: number
    height?: number
  }
}

const defaultOptions: UploadOptions = {
  bucket: "images",
  folder: "uploads",
  maxSizeMB: 5,
  allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  generateThumbnail: true,
  thumbnailSize: 300,
}

export class ImageService {
  private supabase: ReturnType<typeof createClient>

  constructor() {
    this.supabase = createClient()
  }

  // Upload une image
  async upload(
    file: File | Buffer,
    filename: string,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    const opts = { ...defaultOptions, ...options }

    try {
      // Vérifier le type de fichier
      let fileType: string
      let fileSize: number
      let fileBuffer: Buffer

      if (file instanceof File) {
        fileType = file.type
        fileSize = file.size
        fileBuffer = Buffer.from(await file.arrayBuffer())
      } else {
        // C'est un Buffer, on déduit le type depuis le nom
        fileBuffer = file
        fileSize = file.length
        fileType = this.getMimeType(filename)
      }

      if (!opts.allowedTypes?.includes(fileType)) {
        return {
          success: false,
          error: `Type de fichier non autorisé. Types acceptés: ${opts.allowedTypes?.join(", ")}`,
        }
      }

      // Vérifier la taille
      const maxSize = (opts.maxSizeMB || 5) * 1024 * 1024
      if (fileSize > maxSize) {
        return {
          success: false,
          error: `Fichier trop volumineux. Taille max: ${opts.maxSizeMB}MB`,
        }
      }

      // Générer un nom unique
      const ext = filename.split(".").pop()
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
      const path = `${opts.folder}/${uniqueName}`

      // Upload vers Supabase Storage
      const { data, error } = await this.supabase.storage
        .from(opts.bucket!)
        .upload(path, fileBuffer, {
          contentType: fileType,
          cacheControl: "3600",
          upsert: false,
        })

      if (error) {
        console.error("[ImageService] Upload error:", error)
        return { success: false, error: error.message }
      }

      // Obtenir l'URL publique
      const { data: urlData } = this.supabase.storage
        .from(opts.bucket!)
        .getPublicUrl(path)

      const result: UploadResult = {
        success: true,
        url: urlData.publicUrl,
        path,
        metadata: {
          size: fileSize,
          type: fileType,
        },
      }

      // Générer une miniature si demandé
      if (opts.generateThumbnail && this.isImage(fileType)) {
        const thumbnailPath = `${opts.folder}/thumbnails/${uniqueName}`
        
        // Note: Pour la génération de miniatures côté serveur,
        // vous auriez besoin d'une lib comme sharp
        // Ici on utilise la transformation d'image de Supabase
        const thumbnailUrl = this.supabase.storage
          .from(opts.bucket!)
          .getPublicUrl(path, {
            transform: {
              width: opts.thumbnailSize,
              height: opts.thumbnailSize,
              resize: "cover",
            },
          })

        result.thumbnailUrl = thumbnailUrl.data.publicUrl
      }

      return result
    } catch (error) {
      console.error("[ImageService] Error:", error)
      return { success: false, error: String(error) }
    }
  }

  // Upload depuis une URL
  async uploadFromUrl(
    imageUrl: string,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    try {
      const response = await fetch(imageUrl)
      if (!response.ok) {
        return { success: false, error: "Failed to fetch image" }
      }

      const buffer = Buffer.from(await response.arrayBuffer())
      const contentType = response.headers.get("content-type") || "image/jpeg"
      const ext = contentType.split("/")[1] || "jpg"
      const filename = `downloaded.${ext}`

      return this.upload(buffer, filename, options)
    } catch (error) {
      console.error("[ImageService] URL upload error:", error)
      return { success: false, error: String(error) }
    }
  }

  // Supprimer une image
  async delete(path: string, bucket: string = "images"): Promise<boolean> {
    try {
      const { error } = await this.supabase.storage.from(bucket).remove([path])

      if (error) {
        console.error("[ImageService] Delete error:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("[ImageService] Delete error:", error)
      return false
    }
  }

  // Lister les images d'un dossier
  async list(
    folder: string,
    bucket: string = "images"
  ): Promise<{ name: string; url: string; size: number; createdAt: string }[]> {
    try {
      const { data, error } = await this.supabase.storage.from(bucket).list(folder)

      if (error) {
        console.error("[ImageService] List error:", error)
        return []
      }

      return (data || [])
        .filter((item) => !item.id.endsWith("/")) // Exclure les dossiers
        .map((item) => {
          const path = `${folder}/${item.name}`
          const { data: urlData } = this.supabase.storage.from(bucket).getPublicUrl(path)

          return {
            name: item.name,
            url: urlData.publicUrl,
            size: item.metadata?.size || 0,
            createdAt: item.created_at || "",
          }
        })
    } catch (error) {
      console.error("[ImageService] List error:", error)
      return []
    }
  }

  // Helpers privés
  private getMimeType(filename: string): string {
    const ext = filename.split(".").pop()?.toLowerCase()
    const mimeTypes: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
    }
    return mimeTypes[ext || ""] || "application/octet-stream"
  }

  private isImage(mimeType: string): boolean {
    return mimeType.startsWith("image/")
  }
}

export const imageService = new ImageService()
export default imageService
