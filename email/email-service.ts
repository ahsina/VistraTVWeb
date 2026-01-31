// lib/email/email-service.ts
// Service d'envoi d'emails avec Resend

import { createClient } from "@/lib/supabase/admin"

// Types
export interface EmailTemplate {
  subject: string
  html: string
  text?: string
}

export interface SendEmailParams {
  to: string | string[]
  template: EmailTemplateName
  data?: Record<string, unknown>
  from?: string
  replyTo?: string
}

export type EmailTemplateName =
  | "payment_confirmation"
  | "subscription_expiring"
  | "subscription_expired"
  | "welcome"
  | "password_reset"
  | "support_ticket_created"
  | "support_ticket_reply"
  | "affiliate_welcome"
  | "affiliate_commission"

// Configuration
const RESEND_API_KEY = process.env.RESEND_API_KEY
const DEFAULT_FROM = process.env.EMAIL_FROM || "VistraTV <noreply@vistratv.com>"
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://vistratv.com"

// Templates d'emails
const emailTemplates: Record<EmailTemplateName, (data: Record<string, unknown>) => EmailTemplate> = {
  payment_confirmation: (data) => ({
    subject: "✅ Confirmation de paiement - VistraTV",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de paiement</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0d2c;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #1a1147 0%, #2d1055 100%); border-radius: 16px; padding: 40px; color: white;">
      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 32px; margin: 0; background: linear-gradient(90deg, #00d4ff, #e94b87); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">VistraTV</h1>
      </div>
      
      <!-- Content -->
      <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
        <h2 style="color: #00d4ff; margin-top: 0;">🎉 Paiement confirmé !</h2>
        <p style="color: #e0e0e0; line-height: 1.6;">
          Merci pour votre confiance ! Votre paiement a été traité avec succès.
        </p>
        
        <div style="background: rgba(0,212,255,0.1); border-left: 4px solid #00d4ff; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
          <p style="margin: 0 0 10px 0; color: #00d4ff; font-weight: bold;">Détails de votre abonnement :</p>
          <p style="margin: 5px 0; color: #e0e0e0;">📦 Plan : <strong>${data.planName || "Premium"}</strong></p>
          <p style="margin: 5px 0; color: #e0e0e0;">🔑 ID : <strong>${data.subscriptionId || "N/A"}</strong></p>
          <p style="margin: 5px 0; color: #e0e0e0;">📅 Valide jusqu'au : <strong>${data.endDate || "N/A"}</strong></p>
        </div>
        
        <p style="color: #e0e0e0; line-height: 1.6;">
          Vos identifiants de connexion vous seront envoyés séparément par WhatsApp.
        </p>
      </div>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin-bottom: 30px;">
        <a href="${APP_URL}/dashboard" style="display: inline-block; background: linear-gradient(90deg, #00d4ff, #e94b87); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: bold; font-size: 16px;">
          Accéder à mon compte
        </a>
      </div>
      
      <!-- Support -->
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
        <p style="color: #888; font-size: 14px; margin: 0;">
          Besoin d'aide ? <a href="${APP_URL}/support" style="color: #00d4ff;">Contactez notre support</a>
        </p>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; margin-top: 20px;">
      <p style="color: #666; font-size: 12px;">
        © ${new Date().getFullYear()} VistraTV. Tous droits réservés.
      </p>
    </div>
  </div>
</body>
</html>
    `,
    text: `Confirmation de paiement - VistraTV

Merci pour votre confiance ! Votre paiement a été traité avec succès.

Détails de votre abonnement :
- Plan : ${data.planName || "Premium"}
- ID : ${data.subscriptionId || "N/A"}
- Valide jusqu'au : ${data.endDate || "N/A"}

Vos identifiants de connexion vous seront envoyés séparément par WhatsApp.

Accédez à votre compte : ${APP_URL}/dashboard

Besoin d'aide ? ${APP_URL}/support

© ${new Date().getFullYear()} VistraTV
    `,
  }),

  subscription_expiring: (data) => ({
    subject: `⏰ Votre abonnement expire dans ${data.daysRemaining} jour(s) - VistraTV`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0d2c;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #1a1147 0%, #2d1055 100%); border-radius: 16px; padding: 40px; color: white;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 32px; margin: 0; background: linear-gradient(90deg, #00d4ff, #e94b87); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">VistraTV</h1>
      </div>
      
      <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
        <h2 style="color: #ff6b6b; margin-top: 0;">⏰ Votre abonnement expire bientôt !</h2>
        <p style="color: #e0e0e0; line-height: 1.6;">
          Bonjour ${data.userName || "cher client"},
        </p>
        <p style="color: #e0e0e0; line-height: 1.6;">
          Votre abonnement <strong>${data.planName || "VistraTV"}</strong> expire dans <strong style="color: #ff6b6b;">${data.daysRemaining} jour(s)</strong>.
        </p>
        
        <div style="background: rgba(255,107,107,0.1); border: 1px solid rgba(255,107,107,0.3); border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; color: #ff6b6b; font-size: 18px; font-weight: bold;">
            Date d'expiration : ${data.expirationDate || "N/A"}
          </p>
        </div>
        
        <p style="color: #e0e0e0; line-height: 1.6;">
          Renouvelez maintenant pour continuer à profiter de tous nos contenus sans interruption !
        </p>
      </div>
      
      <div style="text-align: center; margin-bottom: 30px;">
        <a href="${APP_URL}/subscriptions" style="display: inline-block; background: linear-gradient(90deg, #00d4ff, #e94b87); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: bold; font-size: 16px;">
          🔄 Renouveler mon abonnement
        </a>
      </div>
      
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
        <p style="color: #888; font-size: 14px; margin: 0;">
          Des questions ? <a href="${APP_URL}/support" style="color: #00d4ff;">Contactez-nous</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
    `,
    text: `Votre abonnement VistraTV expire bientôt !

Bonjour ${data.userName || "cher client"},

Votre abonnement ${data.planName || "VistraTV"} expire dans ${data.daysRemaining} jour(s).
Date d'expiration : ${data.expirationDate || "N/A"}

Renouvelez maintenant : ${APP_URL}/subscriptions

© ${new Date().getFullYear()} VistraTV
    `,
  }),

  subscription_expired: (data) => ({
    subject: "❌ Votre abonnement a expiré - VistraTV",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0d2c;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #1a1147 0%, #2d1055 100%); border-radius: 16px; padding: 40px; color: white;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 32px; margin: 0; background: linear-gradient(90deg, #00d4ff, #e94b87); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">VistraTV</h1>
      </div>
      
      <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
        <h2 style="color: #ff6b6b; margin-top: 0;">❌ Votre abonnement a expiré</h2>
        <p style="color: #e0e0e0; line-height: 1.6;">
          Bonjour ${data.userName || "cher client"},
        </p>
        <p style="color: #e0e0e0; line-height: 1.6;">
          Votre abonnement <strong>${data.planName || "VistraTV"}</strong> a expiré le <strong>${data.expirationDate || "N/A"}</strong>.
        </p>
        <p style="color: #e0e0e0; line-height: 1.6;">
          Réactivez votre compte maintenant et retrouvez l'accès à tous nos contenus !
        </p>
      </div>
      
      <div style="text-align: center; margin-bottom: 30px;">
        <a href="${APP_URL}/subscriptions" style="display: inline-block; background: linear-gradient(90deg, #00d4ff, #e94b87); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: bold; font-size: 16px;">
          ✨ Réactiver mon abonnement
        </a>
      </div>
    </div>
  </div>
</body>
</html>
    `,
  }),

  welcome: (data) => ({
    subject: "🎉 Bienvenue sur VistraTV !",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0d2c;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #1a1147 0%, #2d1055 100%); border-radius: 16px; padding: 40px; color: white;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 32px; margin: 0; background: linear-gradient(90deg, #00d4ff, #e94b87); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">VistraTV</h1>
      </div>
      
      <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
        <h2 style="color: #00d4ff; margin-top: 0;">🎉 Bienvenue ${data.userName || ""} !</h2>
        <p style="color: #e0e0e0; line-height: 1.6;">
          Merci de rejoindre VistraTV ! Vous avez maintenant accès à la meilleure plateforme IPTV.
        </p>
        
        <div style="margin: 20px 0;">
          <p style="color: #00d4ff; font-weight: bold; margin-bottom: 10px;">Ce qui vous attend :</p>
          <ul style="color: #e0e0e0; line-height: 2; padding-left: 20px;">
            <li>📺 Plus de 20 000 chaînes en direct</li>
            <li>🎬 50 000+ films et séries</li>
            <li>📱 Compatible tous appareils</li>
            <li>🎧 Support 24/7</li>
          </ul>
        </div>
      </div>
      
      <div style="text-align: center; margin-bottom: 30px;">
        <a href="${APP_URL}/subscriptions" style="display: inline-block; background: linear-gradient(90deg, #00d4ff, #e94b87); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: bold; font-size: 16px;">
          Découvrir nos offres
        </a>
      </div>
    </div>
  </div>
</body>
</html>
    `,
  }),

  password_reset: (data) => ({
    subject: "🔐 Réinitialisation de mot de passe - VistraTV",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0d2c;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #1a1147 0%, #2d1055 100%); border-radius: 16px; padding: 40px; color: white;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 32px; margin: 0; background: linear-gradient(90deg, #00d4ff, #e94b87); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">VistraTV</h1>
      </div>
      
      <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
        <h2 style="color: #00d4ff; margin-top: 0;">🔐 Réinitialisation de mot de passe</h2>
        <p style="color: #e0e0e0; line-height: 1.6;">
          Vous avez demandé la réinitialisation de votre mot de passe.
        </p>
        <p style="color: #e0e0e0; line-height: 1.6;">
          Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
        </p>
      </div>
      
      <div style="text-align: center; margin-bottom: 30px;">
        <a href="${data.resetLink}" style="display: inline-block; background: linear-gradient(90deg, #00d4ff, #e94b87); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: bold; font-size: 16px;">
          Réinitialiser mon mot de passe
        </a>
      </div>
      
      <p style="color: #888; font-size: 14px; text-align: center;">
        Ce lien expire dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
      </p>
    </div>
  </div>
</body>
</html>
    `,
  }),

  support_ticket_created: (data) => ({
    subject: `🎫 Ticket #${data.ticketId} créé - VistraTV Support`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0d2c;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #1a1147 0%, #2d1055 100%); border-radius: 16px; padding: 40px; color: white;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 32px; margin: 0; background: linear-gradient(90deg, #00d4ff, #e94b87); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">VistraTV Support</h1>
      </div>
      
      <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
        <h2 style="color: #00d4ff; margin-top: 0;">🎫 Ticket créé avec succès</h2>
        <p style="color: #e0e0e0; line-height: 1.6;">
          Votre demande a bien été enregistrée.
        </p>
        
        <div style="background: rgba(0,212,255,0.1); border-left: 4px solid #00d4ff; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
          <p style="margin: 5px 0; color: #e0e0e0;">📝 Numéro : <strong>#${data.ticketId}</strong></p>
          <p style="margin: 5px 0; color: #e0e0e0;">📋 Sujet : <strong>${data.subject}</strong></p>
        </div>
        
        <p style="color: #e0e0e0; line-height: 1.6;">
          Notre équipe va traiter votre demande dans les plus brefs délais. Vous recevrez une notification par email dès qu'une réponse sera disponible.
        </p>
      </div>
      
      <div style="text-align: center;">
        <a href="${APP_URL}/support" style="display: inline-block; background: linear-gradient(90deg, #00d4ff, #e94b87); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: bold; font-size: 16px;">
          Suivre mon ticket
        </a>
      </div>
    </div>
  </div>
</body>
</html>
    `,
  }),

  support_ticket_reply: (data) => ({
    subject: `💬 Nouvelle réponse à votre ticket #${data.ticketId} - VistraTV`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0d2c;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #1a1147 0%, #2d1055 100%); border-radius: 16px; padding: 40px; color: white;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 32px; margin: 0; background: linear-gradient(90deg, #00d4ff, #e94b87); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">VistraTV Support</h1>
      </div>
      
      <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
        <h2 style="color: #00d4ff; margin-top: 0;">💬 Nouvelle réponse !</h2>
        <p style="color: #e0e0e0; line-height: 1.6;">
          Notre équipe a répondu à votre ticket <strong>#${data.ticketId}</strong>.
        </p>
        
        <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="color: #888; font-size: 12px; margin: 0 0 10px 0;">Aperçu de la réponse :</p>
          <p style="color: #e0e0e0; line-height: 1.6; margin: 0;">
            ${data.messagePreview || "Cliquez sur le bouton ci-dessous pour voir la réponse complète."}
          </p>
        </div>
      </div>
      
      <div style="text-align: center;">
        <a href="${APP_URL}/support" style="display: inline-block; background: linear-gradient(90deg, #00d4ff, #e94b87); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: bold; font-size: 16px;">
          Voir la réponse complète
        </a>
      </div>
    </div>
  </div>
</body>
</html>
    `,
  }),

  affiliate_welcome: (data) => ({
    subject: "🤝 Bienvenue dans le programme affilié VistraTV !",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0d2c;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #1a1147 0%, #2d1055 100%); border-radius: 16px; padding: 40px; color: white;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 32px; margin: 0; background: linear-gradient(90deg, #00d4ff, #e94b87); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">VistraTV Affiliates</h1>
      </div>
      
      <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
        <h2 style="color: #00d4ff; margin-top: 0;">🤝 Bienvenue ${data.affiliateName || ""} !</h2>
        <p style="color: #e0e0e0; line-height: 1.6;">
          Votre candidature au programme affilié a été <strong style="color: #4ade80;">approuvée</strong> !
        </p>
        
        <div style="background: rgba(0,212,255,0.1); border-left: 4px solid #00d4ff; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
          <p style="margin: 5px 0; color: #e0e0e0;">🔗 Votre code affilié : <strong style="color: #00d4ff; font-size: 18px;">${data.affiliateCode || "N/A"}</strong></p>
          <p style="margin: 5px 0; color: #e0e0e0;">💰 Commission : <strong>${data.commissionRate || 20}%</strong> par vente</p>
        </div>
        
        <p style="color: #e0e0e0; line-height: 1.6;">
          Votre lien de parrainage :<br>
          <code style="background: rgba(0,0,0,0.3); padding: 10px; display: block; margin-top: 10px; border-radius: 4px; word-break: break-all;">
            ${APP_URL}/register?ref=${data.affiliateCode}
          </code>
        </p>
      </div>
      
      <div style="text-align: center;">
        <a href="${APP_URL}/affiliate" style="display: inline-block; background: linear-gradient(90deg, #00d4ff, #e94b87); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: bold; font-size: 16px;">
          Accéder à mon dashboard
        </a>
      </div>
    </div>
  </div>
</body>
</html>
    `,
  }),

  affiliate_commission: (data) => ({
    subject: `💰 Nouvelle commission de ${data.commissionAmount}€ - VistraTV`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0d2c;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #1a1147 0%, #2d1055 100%); border-radius: 16px; padding: 40px; color: white;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 32px; margin: 0; background: linear-gradient(90deg, #00d4ff, #e94b87); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">VistraTV Affiliates</h1>
      </div>
      
      <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
        <h2 style="color: #4ade80; margin-top: 0;">💰 Nouvelle commission !</h2>
        <p style="color: #e0e0e0; line-height: 1.6;">
          Félicitations ! Vous avez reçu une nouvelle commission.
        </p>
        
        <div style="background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.3); border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; color: #4ade80; font-size: 36px; font-weight: bold;">
            +${data.commissionAmount}€
          </p>
        </div>
        
        <div style="color: #e0e0e0;">
          <p style="margin: 5px 0;">📊 Vos statistiques :</p>
          <p style="margin: 5px 0;">• Total gagné : <strong>${data.totalEarnings || 0}€</strong></p>
          <p style="margin: 5px 0;">• En attente : <strong>${data.pendingEarnings || 0}€</strong></p>
          <p style="margin: 5px 0;">• Total parrainages : <strong>${data.totalReferrals || 0}</strong></p>
        </div>
      </div>
      
      <div style="text-align: center;">
        <a href="${APP_URL}/affiliate" style="display: inline-block; background: linear-gradient(90deg, #00d4ff, #e94b87); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: bold; font-size: 16px;">
          Voir mon dashboard
        </a>
      </div>
    </div>
  </div>
</body>
</html>
    `,
  }),
}

// Fonction principale d'envoi
export async function sendEmail(params: SendEmailParams): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = createClient()
  const { to, template, data = {}, from = DEFAULT_FROM, replyTo } = params

  // Générer le contenu de l'email
  const templateFn = emailTemplates[template]
  if (!templateFn) {
    return { success: false, error: `Template "${template}" not found` }
  }

  const emailContent = templateFn(data)
  const recipients = Array.isArray(to) ? to : [to]

  // Log initial
  for (const recipient of recipients) {
    await supabase.from("email_logs").insert({
      recipient,
      subject: emailContent.subject,
      status: "pending",
    })
  }

  // Vérifier si l'API key est configurée
  if (!RESEND_API_KEY) {
    console.warn("[v0] RESEND_API_KEY not configured - email not sent")
    await updateEmailLogs(supabase, recipients, emailContent.subject, "no_api_key", "API key not configured")
    return { success: false, error: "Email service not configured" }
  }

  try {
    // Appeler l'API Resend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from,
        to: recipients,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
        reply_to: replyTo,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error("[v0] Resend API error:", result)
      await updateEmailLogs(supabase, recipients, emailContent.subject, "failed", result.message || "API error")
      return { success: false, error: result.message || "Failed to send email" }
    }

    // Succès
    await updateEmailLogs(supabase, recipients, emailContent.subject, "sent", null, result.id)
    console.log("[v0] Email sent successfully:", result.id)

    return { success: true, id: result.id }
  } catch (error) {
    console.error("[v0] Email sending error:", error)
    await updateEmailLogs(supabase, recipients, emailContent.subject, "error", String(error))
    return { success: false, error: String(error) }
  }
}

// Mise à jour des logs
async function updateEmailLogs(
  supabase: ReturnType<typeof createClient>,
  recipients: string[],
  subject: string,
  status: string,
  errorMessage: string | null,
  emailId?: string
) {
  for (const recipient of recipients) {
    await supabase
      .from("email_logs")
      .update({
        status,
        error_message: errorMessage,
        email_id: emailId,
      })
      .eq("recipient", recipient)
      .eq("subject", subject)
      .eq("status", "pending")
  }
}

// Export des types
export type { EmailTemplate, SendEmailParams, EmailTemplateName }
