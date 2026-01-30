export interface Subscription {
  id: string
  name: string
  description: string
  price: number
  currency: string
  duration: "monthly" | "quarterly" | "yearly"
  features: string[]
  channelCount: number
  movieCount: number
  seriesCount: number
  deviceLimit: number
  isPopular?: boolean
}

export interface Customer {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  subscriptionId?: string
  subscriptionStatus: "active" | "inactive" | "trial" | "expired"
  subscriptionStartDate?: string
  subscriptionEndDate?: string
  createdAt: string
}

export interface Channel {
  id: string
  name: string
  logo: string
  category: string
  isHD: boolean
  is4K: boolean
}

export interface Content {
  id: string
  title: string
  description: string
  thumbnail: string
  type: "movie" | "series"
  year: number
  rating: number
  genre: string[]
}

export interface Testimonial {
  id: string
  customerName: string
  rating: number
  comment: string
  date: string
  avatar?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ChannelLogo {
  id: string
  name: string
  imageUrl: string
  brandColor?: string
  category?: string // Sports, Cinema, Series, Documentary
}

export interface ChannelShowcaseProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
  smallLogos: ChannelLogo[]
  totalChannels: number
  featuredLogos: ChannelLogo[]
}

export interface Stat {
  id: string
  value: string
  label: string
  icon?: string
}

export interface SocialProofProps {
  stats: Stat[]
  premiumLogos: ChannelLogo[]
}

export interface PricingPlan {
  id: string
  name: string
  price: number
  period: string
  connections: number
  quality: string
  channels: string
  isPopular: boolean
  badge?: string
  gradientColors: [string, string]
  buttonColor: string
}

export interface PricingSectionProps {
  plans: PricingPlan[]
}

export interface FAQItem {
  id: string
  question: string
  answer: string
}

export interface FAQSectionProps {
  items: FAQItem[]
  defaultOpenIndex?: number
}
