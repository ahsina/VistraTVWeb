// lib/auth/two-factor.ts
import crypto from "crypto"

// Générer une clé secrète pour TOTP
export function generateTOTPSecret(): string {
  return crypto.randomBytes(20).toString("base64").replace(/[^a-zA-Z0-9]/g, "").substring(0, 32)
}

// Générer un code TOTP
export function generateTOTP(secret: string, timeStep: number = 30): string {
  const time = Math.floor(Date.now() / 1000 / timeStep)
  const timeBuffer = Buffer.alloc(8)
  timeBuffer.writeBigInt64BE(BigInt(time))

  const hmac = crypto.createHmac("sha1", Buffer.from(secret, "base32"))
  hmac.update(timeBuffer)
  const hash = hmac.digest()

  const offset = hash[hash.length - 1] & 0x0f
  const code = (
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff)
  ) % 1000000

  return code.toString().padStart(6, "0")
}

// Vérifier un code TOTP (avec fenêtre de tolérance)
export function verifyTOTP(secret: string, code: string, window: number = 1): boolean {
  const timeStep = 30
  const currentTime = Math.floor(Date.now() / 1000 / timeStep)

  for (let i = -window; i <= window; i++) {
    const time = currentTime + i
    const timeBuffer = Buffer.alloc(8)
    timeBuffer.writeBigInt64BE(BigInt(time))

    const hmac = crypto.createHmac("sha1", Buffer.from(secret, "base32"))
    hmac.update(timeBuffer)
    const hash = hmac.digest()

    const offset = hash[hash.length - 1] & 0x0f
    const generatedCode = (
      ((hash[offset] & 0x7f) << 24) |
      ((hash[offset + 1] & 0xff) << 16) |
      ((hash[offset + 2] & 0xff) << 8) |
      (hash[offset + 3] & 0xff)
    ) % 1000000

    if (generatedCode.toString().padStart(6, "0") === code) {
      return true
    }
  }

  return false
}

// Générer l'URL pour QR code (format otpauth)
export function generateTOTPUrl(secret: string, email: string, issuer: string = "VistraTV"): string {
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(email)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`
}

// Générer des codes de backup
export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = []
  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(4).toString("hex").toUpperCase()
    codes.push(`${code.substring(0, 4)}-${code.substring(4)}`)
  }
  return codes
}
