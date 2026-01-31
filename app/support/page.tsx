"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { useToast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Mail, Phone, MessageCircle, Send, CheckCircle, HelpCircle } from "lucide-react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { FadeIn } from "@/components/animations/FadeIn"
import { DynamicFAQ } from "@/components/faq/dynamic-faq"
import { Turnstile, useTurnstile } from "@/components/ui/turnstile"
import { validateEmail, validateName } from "@/lib/utils/validation"
import Link from "next/link"

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAA..."

const categories = [
  { value: "technical", label: "Problème technique" },
  { value: "billing", label: "Facturation / Paiement" },
  { value: "account", label: "Mon compte" },
  { value: "installation", label: "Installation" },
  { value: "other", label: "Autre" },
]

const priorities = [
  { value: "low", label: "Basse" },
  { value: "medium", label: "Moyenne" },
  { value: "high", label: "Haute" },
]

export default function SupportPage() {
  const { t } = useLanguage()
  const { addToast } = useToast()
  
  // Form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState("medium")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  
  // Validation errors
  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [subjectError, setSubjectError] = useState("")
  const [messageError, setMessageError] = useState("")
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [ticketId, setTicketId] = useState("")
  
  // Turnstile
  const turnstile = useTurnstile()

  // Validate name
  const handleNameChange = (value: string) => {
    setName(value)
    if (value) {
      const validation = validateName(value)
      setNameError(validation.error || "")
    } else {
      setNameError("")
    }
  }

  // Validate email
  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (value) {
      const validation = validateEmail(value)
      setEmailError(validation.error || "")
    } else {
      setEmailError("")
    }
  }

  // Validate form
  const validateForm = (): boolean => {
    let isValid = true

    // Name
    const nameValidation = validateName(name)
    if (!nameValidation.isValid) {
      setNameError(nameValidation.error || "Nom requis")
      isValid = false
    }

    // Email
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || "Email requis")
      isValid = false
    }

    // Subject
    if (!subject.trim()) {
      setSubjectError("Le sujet est requis")
      isValid = false
    } else if (subject.length < 5) {
      setSubjectError("Le sujet doit contenir au moins 5 caractères")
      isValid = false
    } else {
      setSubjectError("")
    }

    // Message
    if (!message.trim()) {
      setMessageError("Le message est requis")
      isValid = false
    } else if (message.length < 20) {
      setMessageError("Le message doit contenir au moins 20 caractères")
      isValid = false
    } else {
      setMessageError("")
    }

    // Category
    if (!category) {
      addToast("Veuillez sélectionner une catégorie", "error")
      isValid = false
    }

    // Turnstile
    if (!turnstile.isVerified) {
      addToast("Veuillez compléter la vérification de sécurité", "error")
      isValid = false
    }

    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Verify Turnstile token
      const verifyResponse = await fetch("/api/verify-turnstile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: turnstile.token }),
      })

      if (!verifyResponse.ok) {
        addToast("Erreur de vérification de sécurité. Veuillez réessayer.", "error")
        turnstile.reset()
        setIsSubmitting(false)
        return
      }

      // Submit ticket
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          category,
          priority,
          subject,
          message,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setTicketId(data.ticketId || "XXXXX")
        setIsSubmitted(true)
        addToast("Votre ticket a été créé avec succès !", "success")
      } else {
        addToast(data.error || "Erreur lors de la création du ticket", "error")
      }
    } catch (error) {
      console.error("[v0] Support ticket error:", error)
      addToast("Erreur lors de l'envoi du ticket. Veuillez réessayer.", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success state
  if (isSubmitted) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-[#0a0d2c] via-[#1a1147] to-[#2d1055]">
          <div className="container mx-auto px-4 py-16">
            <FadeIn direction="up">
              <Card className="max-w-lg mx-auto p-8 bg-white/5 backdrop-blur-sm border-white/10 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#00ff88] flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">Ticket créé !</h1>
                <p className="text-gray-300 mb-2">
                  Votre demande a été enregistrée avec succès.
                </p>
                <p className="text-gray-400 mb-6">
                  Numéro de ticket: <span className="text-[#00d4ff] font-mono font-bold">{ticketId}</span>
                </p>
                <p className="text-sm text-gray-400 mb-8">
                  Nous vous répondrons dans les plus brefs délais à l'adresse {email}.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => {
                      setIsSubmitted(false)
                      setName("")
                      setEmail("")
                      setCategory("")
                      setPriority("medium")
                      setSubject("")
                      setMessage("")
                      turnstile.reset()
                    }}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    Nouveau ticket
                  </Button>
                  <Link href="/">
                    <Button className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87]">
                      Retour à l'accueil
                    </Button>
                  </Link>
                </div>
              </Card>
            </FadeIn>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-[#0a0d2c] via-[#1a1147] to-[#2d1055]">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <FadeIn direction="up">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {t.support?.title || "Support"}{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-rose-400 bg-clip-text text-transparent">
                  Client
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                {t.support?.subtitle || "Comment pouvons-nous vous aider ?"}
              </p>
            </FadeIn>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <FadeIn direction="up" delay={0.1}>
                <Card className="p-6 md:p-8 bg-white/5 backdrop-blur-sm border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <MessageCircle className="w-6 h-6 text-[#00d4ff]" />
                    Créer un ticket
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">Nom complet *</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => handleNameChange(e.target.value)}
                          placeholder="Jean Dupont"
                          className={`bg-white/10 border-white/20 text-white placeholder:text-gray-500 ${
                            nameError ? "border-red-500" : ""
                          }`}
                        />
                        {nameError && <p className="text-red-400 text-sm">{nameError}</p>}
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => handleEmailChange(e.target.value)}
                          placeholder="votre@email.com"
                          className={`bg-white/10 border-white/20 text-white placeholder:text-gray-500 ${
                            emailError ? "border-red-500" : ""
                          }`}
                        />
                        {emailError && <p className="text-red-400 text-sm">{emailError}</p>}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Category */}
                      <div className="space-y-2">
                        <Label className="text-white">Catégorie *</Label>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue placeholder="Sélectionner..." />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Priority */}
                      <div className="space-y-2">
                        <Label className="text-white">Priorité</Label>
                        <Select value={priority} onValueChange={setPriority}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {priorities.map((prio) => (
                              <SelectItem key={prio.value} value={prio.value}>
                                {prio.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-white">Sujet *</Label>
                      <Input
                        id="subject"
                        value={subject}
                        onChange={(e) => {
                          setSubject(e.target.value)
                          if (e.target.value.length >= 5) setSubjectError("")
                        }}
                        placeholder="Décrivez brièvement votre problème"
                        className={`bg-white/10 border-white/20 text-white placeholder:text-gray-500 ${
                          subjectError ? "border-red-500" : ""
                        }`}
                      />
                      {subjectError && <p className="text-red-400 text-sm">{subjectError}</p>}
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-white">Message *</Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value)
                          if (e.target.value.length >= 20) setMessageError("")
                        }}
                        placeholder="Décrivez votre problème en détail..."
                        rows={5}
                        className={`bg-white/10 border-white/20 text-white placeholder:text-gray-500 resize-none ${
                          messageError ? "border-red-500" : ""
                        }`}
                      />
                      {messageError && <p className="text-red-400 text-sm">{messageError}</p>}
                      <p className="text-sm text-gray-400">{message.length}/1000 caractères</p>
                    </div>

                    {/* Turnstile */}
                    <div className="flex justify-center">
                      <Turnstile
                        siteKey={TURNSTILE_SITE_KEY}
                        onVerify={turnstile.handleVerify}
                        onError={turnstile.handleError}
                        onExpire={turnstile.handleExpire}
                        theme="dark"
                      />
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      disabled={isSubmitting || !turnstile.isVerified}
                      className="w-full bg-gradient-to-r from-[#00d4ff] to-[#e94b87] py-6 text-lg disabled:opacity-50"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      {isSubmitting ? "Envoi en cours..." : "Envoyer le ticket"}
                    </Button>
                  </form>
                </Card>
              </FadeIn>
            </div>

            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              <FadeIn direction="up" delay={0.2}>
                <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">Contact Direct</h3>
                  <div className="space-y-4">
                    <a
                      href="mailto:support@vistratv.com"
                      className="flex items-center gap-3 text-gray-300 hover:text-[#00d4ff] transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      support@vistratv.com
                    </a>
                    <a
                      href="https://wa.me/33612345678"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-300 hover:text-green-400 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      WhatsApp
                    </a>
                    <div className="flex items-center gap-3 text-gray-300">
                      <Phone className="w-5 h-5" />
                      +33 1 23 45 67 89
                    </div>
                  </div>
                </Card>
              </FadeIn>

              <FadeIn direction="up" delay={0.3}>
                <Card className="p-6 bg-gradient-to-br from-[#00d4ff]/10 to-[#e94b87]/10 border-[#00d4ff]/30">
                  <div className="flex items-center gap-3 mb-3">
                    <HelpCircle className="w-6 h-6 text-[#00d4ff]" />
                    <h3 className="text-lg font-bold text-white">Besoin d'aide ?</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    Consultez notre FAQ pour trouver rapidement des réponses à vos questions.
                  </p>
                  <Link href="#faq">
                    <Button variant="outline" className="w-full border-[#00d4ff]/50 text-white hover:bg-[#00d4ff]/10 bg-transparent">
                      Voir la FAQ
                    </Button>
                  </Link>
                </Card>
              </FadeIn>
            </div>
          </div>

          {/* FAQ Section */}
          <div id="faq" className="mt-16 max-w-4xl mx-auto">
            <FadeIn direction="up" delay={0.4}>
              <h2 className="text-3xl font-bold text-white text-center mb-8">
                Questions Fréquentes
              </h2>
              <DynamicFAQ showSearch={true} showCategories={true} />
            </FadeIn>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
