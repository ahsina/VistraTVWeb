"use client"

import { useState } from "react"
import { ChannelShowcase } from "@/components/sections/ChannelShowcase"
import { SocialProof } from "@/components/sections/SocialProof"
import { ContentShowcase } from "@/components/sections/ContentShowcase"
import { AboutSection } from "@/components/sections/AboutSection"
import { DeviceCompatibility } from "@/components/sections/DeviceCompatibility"
import { LatestReleases } from "@/components/sections/LatestReleases"
import { TestimonialsCarousel } from "@/components/sections/TestimonialsCarousel"
import { WhatsAppTestimonials } from "@/components/sections/WhatsAppTestimonials"
import { PricingSection } from "@/components/sections/PricingSection"
import { FreeTrialCTA } from "@/components/sections/FreeTrialCTA"
import { FAQSection } from "@/components/sections/FAQSection"
import { UrgencyBanner } from "@/components/marketing/UrgencyBanner"
import { LiveViewers } from "@/components/marketing/LiveViewers"
import { RecentPurchases } from "@/components/marketing/RecentPurchases"
import { FadeIn } from "@/components/animations/FadeIn"
import { LightParticles } from "@/components/effects/light-particles"
import { useHeroContent, useFeatures, useChannels, useSubscriptionPlans } from "@/lib/hooks/use-content"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import type { ChannelLogo, Stat, PricingPlan, FAQItem } from "@/lib/types"
import { Tv, Zap, Shield, Clock, Laptop, Smartphone, Tablet, Monitor } from "@/lib/icons"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { TrustBadges } from "@/components/marketing/TrustBadges"
import { StickyCtaBar } from "@/components/marketing/StickyCtaBar"
import { CompetitorComparison } from "@/components/sections/CompetitorComparison"
import { StreamingQuality } from "@/components/sections/StreamingQuality"

export default function ClientPage() {
  const [activeCategory, setActiveCategory] = useState("Sports")
  const { language } = useLanguage()

  const { heroContent, loading: heroLoading } = useHeroContent(language)
  const { features, loading: featuresLoading } = useFeatures(language)
  const { channels, loading: channelsLoading } = useChannels(language)
  const { subscriptionPlans, loading: plansLoading } = useSubscriptionPlans(language)

  const categories = ["Sports", "Cinema", "Series", "Documentary"]

  const smallLogos: ChannelLogo[] =
    channelsLoading || !channels || channels.length === 0
      ? [
          { id: "1", name: "HBO", imageUrl: "/hbo-logo.png", brandColor: "#000" },
          { id: "2", name: "Cartoon Network", imageUrl: "/cartoon-network-logo.png", brandColor: "#000" },
          { id: "3", name: "beIN Sports", imageUrl: "/bein-sports-logo.jpg", brandColor: "#000" },
          { id: "4", name: "CQC", imageUrl: "/cqc-logo.jpg", brandColor: "#e74c3c" },
          { id: "5", name: "RTL TV", imageUrl: "/rtl-tv-logo.jpg", brandColor: "#000" },
          { id: "6", name: "TF1", imageUrl: "/tf1-logo.jpg", brandColor: "#e74c3c" },
          { id: "7", name: "D", imageUrl: "/abstract-d-logo.png", brandColor: "#9b59b6" },
          { id: "8", name: "Gulli", imageUrl: "/gulli-logo.jpg", brandColor: "#3498db" },
          { id: "9", name: "PHF", imageUrl: "/phf-logo.jpg", brandColor: "#000" },
          { id: "10", name: "IDF1", imageUrl: "/idf1-logo.jpg", brandColor: "#3498db" },
          { id: "11", name: "RTN", imageUrl: "/rtn-logo.jpg", brandColor: "#9b59b6" },
          { id: "12", name: "Archives", imageUrl: "/archives-logo.jpg", brandColor: "#e74c3c" },
          { id: "13", name: "RFTV", imageUrl: "/rftv-logo.jpg", brandColor: "#3498db" },
          { id: "14", name: "HBO", imageUrl: "/hbo-logo.png", brandColor: "#000" },
          { id: "15", name: "MTV", imageUrl: "/mtv-logo.jpg", brandColor: "#000" },
          { id: "16", name: "Sky", imageUrl: "/generic-sky-logo.png", brandColor: "#000" },
          { id: "17", name: "Disney+", imageUrl: "/generic-entertainment-logo.png", brandColor: "#000" },
          { id: "18", name: "MTV", imageUrl: "/mtv-logo.jpg", brandColor: "#9b59b6" },
          { id: "19", name: "ZJPC", imageUrl: "/zjpc-logo.jpg", brandColor: "#000" },
          { id: "20", name: "RKY", imageUrl: "/rky-logo.jpg", brandColor: "#3498db" },
        ]
      : channels.map((ch) => ({
          id: ch.id,
          name: ch.name,
          imageUrl: ch.logo_url,
          brandColor: ch.brand_color || "#000",
        }))

  const featuredLogos: ChannelLogo[] = [
    { id: "f1", name: "HBO", imageUrl: "/hbo-logo.png" },
    { id: "f2", name: "Cartoon Network", imageUrl: "/cartoon-network-logo.png" },
    { id: "f3", name: "Sky", imageUrl: "/generic-sky-logo.png" },
    { id: "f4", name: "Disney+", imageUrl: "/generic-entertainment-logo.png" },
    { id: "f5", name: "MTV", imageUrl: "/mtv-logo.jpg" },
  ]

  const stats: Stat[] = [
    { id: "1", value: "74k+", label: "Active Users" },
    { id: "2", value: "120+", label: "Scaulittles" },
    { id: "3", value: "+10k", label: "Channels" },
    { id: "4", value: "99.9%", label: "Uptime" },
    { id: "5", value: "HD", label: "", icon: "HD" },
  ]

  const premiumLogos: ChannelLogo[] = [
    { id: "p1", name: "ESPN", imageUrl: "/espn-logo.png" },
    { id: "p2", name: "Sky", imageUrl: "/generic-sky-logo.png" },
    { id: "p3", name: "AMC", imageUrl: "/amc-logo.jpg" },
    { id: "p4", name: "MTV", imageUrl: "/mtv-logo.jpg" },
    { id: "p5", name: "HBO", imageUrl: "/hbo-logo.png" },
  ]

  const plans: PricingPlan[] =
    plansLoading || !subscriptionPlans || subscriptionPlans.length === 0
      ? [
          {
            id: "basic",
            name: "Basic",
            price: 19,
            period: "/mo",
            connections: 1,
            quality: "HD-Quality",
            channels: "10K-Channels",
            isPopular: false,
            gradientColors: ["#2d1b69", "#1f1147"],
            buttonColor: "#ffffff",
          },
          {
            id: "premium",
            name: "Premium",
            price: 29,
            period: "/mo",
            connections: 2,
            quality: "4K-Quality",
            channels: "15K-Channels",
            isPopular: true,
            badge: "ÉVOLUTIAR",
            gradientColors: ["#3b82f6", "#8b5cf6"],
            buttonColor: "#ffffff",
          },
          {
            id: "ultimate",
            name: "Ultimate",
            price: 39,
            period: "/mo",
            connections: 4,
            quality: "8K-Quality",
            channels: "20K-Channels",
            isPopular: false,
            gradientColors: ["#ec4899", "#ef4444"],
            buttonColor: "#ffffff",
          },
        ]
      : subscriptionPlans.map((plan) => ({
          id: plan.id,
          name: plan.name,
          price: Number.parseFloat(plan.price),
          period: `/${plan.billing_cycle === "monthly" ? "mo" : "year"}`,
          connections: plan.max_connections,
          quality: plan.video_quality,
          channels: `${plan.channels_count}K-Channels`,
          isPopular: plan.is_popular,
          gradientColors: ["#3b82f6", "#8b5cf6"],
          buttonColor: "#ffffff",
        }))

  const aboutFeatures = [
    {
      icon: <Tv className="w-7 h-7 text-white" />,
      title: "Catalogue Complet",
      description: "Plus de 10,000 chaînes TV du monde entier",
    },
    {
      icon: <Zap className="w-7 h-7 text-white" />,
      title: "Streaming Rapide",
      description: "Qualité HD, 4K et 8K sans interruption",
    },
    {
      icon: <Shield className="w-7 h-7 text-white" />,
      title: "Sécurisé",
      description: "Connexion cryptée et données protégées",
    },
    {
      icon: <Clock className="w-7 h-7 text-white" />,
      title: "Support 24/7",
      description: "Assistance disponible à tout moment",
    },
  ]

  const devices = [
    {
      id: "1",
      name: "Smart TV",
      icon: <Tv className="w-10 h-10 text-white" />,
      description: "Samsung, LG, Sony",
    },
    {
      id: "2",
      name: "Ordinateur",
      icon: <Laptop className="w-10 h-10 text-white" />,
      description: "Windows, Mac",
    },
    {
      id: "3",
      name: "Smartphone",
      icon: <Smartphone className="w-10 h-10 text-white" />,
      description: "iOS, Android",
    },
    {
      id: "4",
      name: "Tablette",
      icon: <Tablet className="w-10 h-10 text-white" />,
      description: "iPad, Android",
    },
    {
      id: "5",
      name: "Box TV",
      icon: <Monitor className="w-10 h-10 text-white" />,
      description: "Apple TV, Fire TV",
    },
  ]

  const handleCTA = () => {
    console.log("[v0] CTA clicked")
  }

  const latestReleases = [
    {
      id: "1",
      title: "The Last of Us",
      imageUrl: "/the-last-of-us-poster.jpg",
      type: "series" as const,
      year: "2023",
      rating: "9.2",
    },
    {
      id: "2",
      title: "Avatar 2",
      imageUrl: "/avatar-2-movie-poster.jpg",
      type: "movie" as const,
      year: "2023",
      rating: "8.5",
    },
    {
      id: "3",
      title: "Wednesday",
      imageUrl: "/wednesday-series-poster.jpg",
      type: "series" as const,
      year: "2023",
      rating: "8.8",
    },
    {
      id: "4",
      title: "Top Gun Maverick",
      imageUrl: "/top-gun-maverick-inspired-poster.png",
      type: "movie" as const,
      year: "2023",
      rating: "9.0",
    },
    {
      id: "5",
      title: "Stranger Things",
      imageUrl: "/stranger-things-inspired-poster.png",
      type: "series" as const,
      year: "2023",
      rating: "8.9",
    },
    {
      id: "6",
      title: "Dune",
      imageUrl: "/dune-inspired-poster.png",
      type: "movie" as const,
      year: "2023",
      rating: "8.7",
    },
  ]

  const testimonials = [
    {
      id: "1",
      name: "Marie Dubois",
      avatar: "MD",
      rating: 5,
      comment:
        "Service exceptionnel ! La qualité d'image est parfaite et le support client est très réactif. Je recommande vivement !",
      date: "Il y a 2 jours",
    },
    {
      id: "2",
      name: "Thomas Martin",
      avatar: "TM",
      rating: 5,
      comment:
        "Meilleur IPTV que j'ai testé. Aucune coupure, des milliers de chaînes, et un prix imbattable. Parfait !",
      date: "Il y a 5 jours",
    },
    {
      id: "3",
      name: "Sophie Laurent",
      avatar: "SL",
      rating: 5,
      comment:
        "Installation facile, interface intuitive. Mes enfants adorent les chaînes pour enfants. Très satisfaite !",
      date: "Il y a 1 semaine",
    },
    {
      id: "4",
      name: "Pierre Rousseau",
      avatar: "PR",
      rating: 5,
      comment: "Qualité 4K impeccable pour les matchs de foot. Plus besoin de plusieurs abonnements, tout est là !",
      date: "Il y a 1 semaine",
    },
    {
      id: "5",
      name: "Julie Bernard",
      avatar: "JB",
      rating: 5,
      comment:
        "Rapport qualité-prix imbattable. L'essai gratuit m'a convaincu en quelques heures. Je ne regrette pas !",
      date: "Il y a 2 semaines",
    },
    {
      id: "6",
      name: "Alexandre Petit",
      avatar: "AP",
      rating: 5,
      comment: "Support client disponible 24/7, réponse rapide à toutes mes questions. Service professionnel !",
      date: "Il y a 2 semaines",
    },
  ]

  const whatsappMessages = [
    {
      id: "1",
      name: "Ahmed K.",
      avatar: "AK",
      message:
        "Franchement c'est le meilleur IPTV que j'ai testé ! Aucune coupure pendant les matchs, qualité HD nickel 👌",
      time: "14:32",
      isRead: true,
    },
    {
      id: "2",
      name: "Fatima B.",
      avatar: "FB",
      message:
        "Merci beaucoup pour le service ! Mes parents peuvent maintenant regarder toutes leurs chaînes arabes préférées 🙏",
      time: "09:15",
      isRead: true,
    },
    {
      id: "3",
      name: "Karim M.",
      avatar: "KM",
      message: "Installation super rapide, en 5 min c'était bon ! Et le support répond direct sur WhatsApp, top 💯",
      time: "16:48",
      isRead: true,
    },
    {
      id: "4",
      name: "Yasmine L.",
      avatar: "YL",
      message:
        "J'ai pris l'abonnement famille, on peut regarder sur 4 écrans en même temps sans problème. Les enfants sont contents 😊",
      time: "11:23",
      isRead: true,
    },
    {
      id: "5",
      name: "Mehdi R.",
      avatar: "MR",
      message:
        "Qualité 4K incroyable ! Je regarde tous les matchs de la Ligue 1 et la Champions League sans lag. Je recommande à 100% 🔥",
      time: "20:05",
      isRead: true,
    },
    {
      id: "6",
      name: "Samira D.",
      avatar: "SD",
      message:
        "Excellent rapport qualité/prix ! Beaucoup moins cher que les autres et bien plus de chaînes. Merci VistraTV ❤️",
      time: "13:57",
      isRead: true,
    },
  ]

  const faqItems: FAQItem[] = [
    {
      question: "Quelle est la qualité de streaming ?",
      answer: "Nous offrons la qualité HD, 4K et 8K sans interruption.",
    },
    {
      question: "Quels appareils sont compatibles ?",
      answer:
        "Notre service est compatible avec tous vos appareils préférés : Smart TV, Ordinateur, Smartphone, Tablette et Box TV.",
    },
    {
      question: "Comment puis-je tester le service ?",
      answer: "Vous pouvez tester notre service pendant 24-48h gratuitement sans engagement.",
    },
    {
      question: "Quelle est la durée de l'uptime ?",
      answer: "Notre uptime est de 99.9%.",
    },
    {
      question: "Quels canaux sont disponibles ?",
      answer:
        "Plus de 10,000 chaînes TV du monde entier sont disponibles, comprenant des sports, des films, des séries et des documentaires.",
    },
  ]

  return (
    <>
      <Header />

      <main className="relative min-h-screen overflow-hidden">
        <LightParticles />

        {/* Background blur circles */}
        <div className="blur-circle blur-circle-purple w-[600px] h-[600px] top-0 right-0 float-animation" />
        <div
          className="blur-circle blur-circle-pink w-[500px] h-[500px] bottom-0 right-0 float-animation"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="blur-circle blur-circle-blue w-[400px] h-[400px] top-1/2 left-0 float-animation"
          style={{ animationDelay: "2s" }}
        />

        {/* Main gradient background */}
        <div className="fixed inset-0 bg-gradient-main -z-10" />

        {/* Marketing Conversion Components */}
        <UrgencyBanner />
        <LiveViewers />
        <RecentPurchases />
        <StickyCtaBar />

        {/* Sections */}
        <FadeIn direction="up" duration={0.6}>
          <ChannelShowcase
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            smallLogos={smallLogos}
            totalChannels={10000}
            featuredLogos={featuredLogos}
          />
        </FadeIn>

        <TrustBadges />

        <FadeIn direction="up" duration={0.6} delay={0.1}>
          <SocialProof stats={stats} premiumLogos={premiumLogos} />
        </FadeIn>

        <FadeIn direction="left" duration={0.7} delay={0.2}>
          <ContentShowcase
            title="TOUTES VOS CHAÎNES"
            description="Accédez à plus de 10,000 chaînes TV du monde entier. Sports, films, séries, documentaires et bien plus encore."
            imageUrl="/tv-channels-grid-interface.jpg"
            ctaText="Je m'abonne !"
            onCtaClick={handleCTA}
          />
        </FadeIn>

        <FadeIn direction="up" duration={0.6} delay={0.1}>
          <LatestReleases releases={latestReleases} />
        </FadeIn>

        <FadeIn direction="right" duration={0.7} delay={0.2}>
          <ContentShowcase
            title="TOUS VOS FILMS"
            description="Une bibliothèque illimitée de films en HD, 4K et 8K. Les dernières sorties et les grands classiques."
            imageUrl="/movie-streaming-interface.jpg"
            ctaText="Je m'abonne !"
            onCtaClick={handleCTA}
            reverse
          />
        </FadeIn>

        <FadeIn direction="left" duration={0.7} delay={0.2}>
          <ContentShowcase
            title="TOUTES VOS SÉRIES"
            description="Binge-watchez vos séries préférées. Toutes les saisons, tous les épisodes, disponibles instantanément."
            imageUrl="/tv-series-streaming-interface.jpg"
            ctaText="Je m'abonne !"
            onCtaClick={handleCTA}
          />
        </FadeIn>

        <FadeIn direction="up" duration={0.6} delay={0.1}>
          <TestimonialsCarousel testimonials={testimonials} />
        </FadeIn>

        <FadeIn direction="up" duration={0.6} delay={0.1}>
          <WhatsAppTestimonials messages={whatsappMessages} />
        </FadeIn>

        <FadeIn direction="up" duration={0.7} delay={0.2}>
          <AboutSection
            title="Le Meilleur IPTV depuis 2018"
            subtitle="VistraTV - Votre Partenaire Streaming"
            description="Nous offrons la meilleure expérience de streaming IPTV avec une qualité exceptionnelle, un support client réactif et des milliers de chaînes disponibles."
            features={aboutFeatures}
            ctaText="Découvrir Nos Abonnements"
            onCtaClick={handleCTA}
          />
        </FadeIn>

        <FadeIn direction="up" duration={0.6} delay={0.1}>
          <DeviceCompatibility
            title="Votre IPTV depuis n'importe où"
            subtitle="Compatible avec tous vos appareils préférés"
            devices={devices}
          />
        </FadeIn>

        <FadeIn direction="up" duration={0.7} delay={0.2}>
          <StreamingQuality />
        </FadeIn>

        <FadeIn direction="up" duration={0.7} delay={0.2}>
          <CompetitorComparison />
        </FadeIn>

        <FadeIn direction="up" duration={0.7} delay={0.2}>
          <PricingSection plans={plans} />
        </FadeIn>

        <FadeIn direction="up" duration={0.6} delay={0.1}>
          <FreeTrialCTA
            title="Testez Gratuitement Sans Engagement !"
            description="Profitez de 24-48h d'essai gratuit pour découvrir notre service premium. Aucune carte bancaire requise."
            trialDuration="Essai 24-48h Gratuit"
            features={["Accès complet", "Sans engagement", "Support inclus"]}
            ctaText="Commencer l'essai gratuit"
            onCtaClick={handleCTA}
          />
        </FadeIn>

        <FadeIn direction="up" duration={0.6} delay={0.1}>
          <FAQSection items={faqItems} />
        </FadeIn>
      </main>

      <Footer />
    </>
  )
}
