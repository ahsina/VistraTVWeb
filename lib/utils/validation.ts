// lib/utils/validation.ts

/**
 * Validate email format
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email) {
    return { isValid: false, error: "L'email est requis" }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Format d'email invalide" }
  }

  return { isValid: true }
}

/**
 * Validate WhatsApp phone number with international format
 */
export function validateWhatsApp(phone: string): { isValid: boolean; error?: string } {
  if (!phone) {
    return { isValid: false, error: "Le numéro WhatsApp est requis" }
  }

  // Remove spaces, dashes, and parentheses for validation
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, "")

  // Check if starts with + and country code
  if (!cleanPhone.startsWith("+")) {
    return { isValid: false, error: "Le numéro doit commencer par l'indicatif pays (ex: +33)" }
  }

  // Check minimum length (at least + country code + 6 digits)
  if (cleanPhone.length < 8) {
    return { isValid: false, error: "Le numéro est trop court" }
  }

  // Check maximum length
  if (cleanPhone.length > 16) {
    return { isValid: false, error: "Le numéro est trop long" }
  }

  // Check if only contains valid characters
  if (!/^\+[0-9]+$/.test(cleanPhone)) {
    return { isValid: false, error: "Le numéro ne doit contenir que des chiffres" }
  }

  return { isValid: true }
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!password) {
    return { isValid: false, errors: ["Le mot de passe est requis"] }
  }

  if (password.length < 8) {
    errors.push("Au moins 8 caractères")
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Au moins une lettre majuscule")
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Au moins une lettre minuscule")
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Au moins un chiffre")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate name
 */
export function validateName(name: string): { isValid: boolean; error?: string } {
  if (!name) {
    return { isValid: false, error: "Le nom est requis" }
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: "Le nom doit contenir au moins 2 caractères" }
  }

  if (name.length > 100) {
    return { isValid: false, error: "Le nom est trop long" }
  }

  return { isValid: true }
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const clean = phone.replace(/[\s\-\(\)]/g, "")
  
  // Format based on country code
  if (clean.startsWith("+33")) {
    // French format: +33 6 12 34 56 78
    return clean.replace(/(\+33)(\d)(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5 $6")
  }
  if (clean.startsWith("+212")) {
    // Moroccan format: +212 6 12 34 56 78
    return clean.replace(/(\+212)(\d)(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5 $6")
  }
  
  // Generic format
  return phone
}

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim()
}

/**
 * Validate promo code format
 */
export function validatePromoCode(code: string): { isValid: boolean; error?: string } {
  if (!code) {
    return { isValid: true } // Promo code is optional
  }

  const cleanCode = code.toUpperCase().trim()

  if (cleanCode.length < 3) {
    return { isValid: false, error: "Code trop court" }
  }

  if (cleanCode.length > 20) {
    return { isValid: false, error: "Code trop long" }
  }

  if (!/^[A-Z0-9]+$/.test(cleanCode)) {
    return { isValid: false, error: "Le code ne doit contenir que des lettres et des chiffres" }
  }

  return { isValid: true }
}
