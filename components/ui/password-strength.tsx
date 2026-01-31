"use client"

import { useMemo } from "react"
import { Check, X } from "lucide-react"

interface PasswordStrengthProps {
  password: string
  showRequirements?: boolean
  className?: string
}

interface PasswordRequirement {
  label: string
  test: (password: string) => boolean
}

const requirements: PasswordRequirement[] = [
  { label: "Au moins 8 caractères", test: (p) => p.length >= 8 },
  { label: "Une lettre majuscule", test: (p) => /[A-Z]/.test(p) },
  { label: "Une lettre minuscule", test: (p) => /[a-z]/.test(p) },
  { label: "Un chiffre", test: (p) => /[0-9]/.test(p) },
  { label: "Un caractère spécial (!@#$%^&*)", test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
]

export function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
  isValid: boolean
} {
  if (!password) {
    return { score: 0, label: "", color: "bg-gray-500", isValid: false }
  }

  const passedRequirements = requirements.filter((req) => req.test(password)).length
  const score = (passedRequirements / requirements.length) * 100

  // Minimum requirements: 8 chars, 1 uppercase, 1 lowercase, 1 number
  const isValid =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)

  if (score < 40) {
    return { score, label: "Faible", color: "bg-red-500", isValid }
  } else if (score < 60) {
    return { score, label: "Moyen", color: "bg-orange-500", isValid }
  } else if (score < 80) {
    return { score, label: "Bon", color: "bg-yellow-500", isValid }
  } else {
    return { score, label: "Excellent", color: "bg-green-500", isValid }
  }
}

export function PasswordStrengthIndicator({
  password,
  showRequirements = true,
  className = "",
}: PasswordStrengthProps) {
  const strength = useMemo(() => getPasswordStrength(password), [password])

  if (!password) return null

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Force du mot de passe</span>
          <span
            className={`font-medium ${
              strength.score < 40
                ? "text-red-400"
                : strength.score < 60
                ? "text-orange-400"
                : strength.score < 80
                ? "text-yellow-400"
                : "text-green-400"
            }`}
          >
            {strength.label}
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strength.color}`}
            style={{ width: `${strength.score}%` }}
          />
        </div>
      </div>

      {/* Requirements List */}
      {showRequirements && (
        <div className="space-y-1">
          {requirements.map((req, index) => {
            const passed = req.test(password)
            return (
              <div
                key={index}
                className={`flex items-center gap-2 text-sm transition-colors ${
                  passed ? "text-green-400" : "text-gray-500"
                }`}
              >
                {passed ? (
                  <Check className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <X className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{req.label}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Validation function for use in forms
export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Le mot de passe doit contenir au moins 8 caractères")
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une majuscule")
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une minuscule")
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins un chiffre")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
