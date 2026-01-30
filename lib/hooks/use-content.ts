"use client"

import { useState, useEffect } from "react"

export interface HeroContent {
  id: string
  title: string
  subtitle: string
  cta_text: string
  image_url: string
  language: string
}

export interface Feature {
  id: string
  icon: string
  title: string
  description: string
  order_position: number
  language: string
}

export interface Channel {
  id: string
  name: string
  logo_url: string
  category: string
  is_premium: boolean
  is_featured: boolean
  order_position: number
}

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  description: string | null
  features: string[] | null
  duration_months: number
  currency: string
  display_order: number
  language: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// Adding tutorial device interface
export interface TutorialDevice {
  id: string
  name: string
  device_type: string
  icon_name: string
  description: string
  display_order: number
  language: string
}

export function useHeroContent(language = "fr") {
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true)
        const response = await fetch(`/api/content/hero?language=${language}`)
        if (!response.ok) throw new Error("Failed to fetch hero content")
        const data = await response.json()
        setHeroContent(data[0] || null)
      } catch (err) {
        setError(err as Error)
        setHeroContent(null)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [language])

  return { heroContent, loading, error }
}

export function useFeatures(language = "fr") {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchFeatures() {
      try {
        setLoading(true)
        const response = await fetch(`/api/content/features?language=${language}`)
        if (!response.ok) throw new Error("Failed to fetch features")
        const data = await response.json()
        setFeatures(data.sort((a: Feature, b: Feature) => a.order_position - b.order_position))
      } catch (err) {
        setError(err as Error)
        setFeatures([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeatures()
  }, [language])

  return { features, loading, error }
}

export function useChannels() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchChannels() {
      try {
        setLoading(true)
        const response = await fetch("/api/content/channels")
        if (!response.ok) throw new Error("Failed to fetch channels")
        const data = await response.json()
        setChannels(data.sort((a: Channel, b: Channel) => a.order_position - b.order_position))
      } catch (err) {
        setError(err as Error)
        setChannels([])
      } finally {
        setLoading(false)
      }
    }

    fetchChannels()
  }, [])

  return { channels, loading, error }
}

export function useSubscriptionPlans(language = "fr") {
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchPlans() {
      try {
        setLoading(true)
        console.log("[v0] Fetching subscription plans for language:", language)
        const response = await fetch(`/api/content/subscription-plans?language=${language}`)
        console.log("[v0] Response status:", response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error("[v0] Error response:", errorText)
          throw new Error("Failed to fetch subscription plans")
        }

        const data = await response.json()
        console.log("[v0] Subscription plans data received:", data)

        setSubscriptionPlans(data.sort((a: SubscriptionPlan, b: SubscriptionPlan) => a.display_order - b.display_order))
      } catch (err) {
        console.error("[v0] Error fetching subscription plans:", err)
        setError(err as Error)
        setSubscriptionPlans([])
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [language])

  return { subscriptionPlans, loading, error }
}

// Adding tutorial device hook
export function useTutorials(language = "fr") {
  const [tutorials, setTutorials] = useState<TutorialDevice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchTutorials() {
      try {
        setLoading(true)
        const response = await fetch(`/api/content/tutorials?language=${language}`)
        if (!response.ok) throw new Error("Failed to fetch tutorials")
        const data = await response.json()
        setTutorials(data.sort((a: TutorialDevice, b: TutorialDevice) => a.display_order - b.display_order))
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchTutorials()
  }, [language])

  return { tutorials, loading, error }
}
