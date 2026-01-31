// lib/email/templates/welcome.ts

export interface WelcomeEmailData {
  name: string
  email: string
  loginUrl: string
  tutorialsUrl: string
  supportUrl: string
}

export function getWelcomeEmailHtml(data: WelcomeEmailData): string {
  const { name, loginUrl, tutorialsUrl, supportUrl } = data

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue sur VistraTV</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0d2c;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0a0d2c;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background: linear-gradient(135deg, rgba(26, 17, 71, 0.9), rgba(45, 16, 85, 0.9)); border-radius: 16px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #00d4ff, #e94b87);">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 800;">
                🎉 Bienvenue sur VistraTV !
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="color: #ffffff; font-size: 18px; line-height: 1.6; margin: 0 0 20px;">
                Bonjour <strong>${name}</strong>,
              </p>
              
              <p style="color: #e0e0e0; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                Nous sommes ravis de vous accueillir dans la communauté VistraTV ! Votre compte a été créé avec succès.
              </p>

              <!-- Features Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: rgba(255,255,255,0.05); border-radius: 12px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 25px;">
                    <h3 style="color: #00d4ff; margin: 0 0 15px; font-size: 18px;">Ce qui vous attend :</h3>
                    <ul style="color: #e0e0e0; font-size: 14px; line-height: 2; margin: 0; padding-left: 20px;">
                      <li>📺 Plus de <strong>20 000 chaînes</strong> en direct</li>
                      <li>🎬 <strong>50 000+ films</strong> et séries</li>
                      <li>📱 Compatible sur <strong>tous vos appareils</strong></li>
                      <li>💬 Support client <strong>24/7</strong></li>
                      <li>⚡ Qualité HD, 4K et 8K</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <!-- CTA Buttons -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 10px 0;">
                    <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #00d4ff, #e94b87); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: bold; font-size: 16px;">
                      🚀 Accéder à mon compte
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Next Steps -->
              <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.1);">
                <h3 style="color: #ffffff; margin: 0 0 15px; font-size: 16px;">Prochaines étapes :</h3>
                <p style="color: #e0e0e0; font-size: 14px; line-height: 1.8; margin: 0;">
                  1. <a href="${loginUrl}" style="color: #00d4ff; text-decoration: none;">Connectez-vous</a> à votre compte<br>
                  2. Choisissez un <a href="${loginUrl}" style="color: #00d4ff; text-decoration: none;">abonnement</a> adapté à vos besoins<br>
                  3. Suivez nos <a href="${tutorialsUrl}" style="color: #00d4ff; text-decoration: none;">tutoriels d'installation</a><br>
                  4. Profitez de vos contenus préférés !
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background: rgba(0,0,0,0.2); text-align: center;">
              <p style="color: #888888; font-size: 12px; line-height: 1.6; margin: 0 0 10px;">
                Besoin d'aide ? Notre équipe est là pour vous !
              </p>
              <a href="${supportUrl}" style="color: #00d4ff; font-size: 14px; text-decoration: none;">
                Contacter le support
              </a>
              
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                <p style="color: #666666; font-size: 11px; margin: 0;">
                  © ${new Date().getFullYear()} VistraTV. Tous droits réservés.<br>
                  Vous recevez cet email car vous avez créé un compte sur VistraTV.
                </p>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

export function getWelcomeEmailText(data: WelcomeEmailData): string {
  const { name, loginUrl, tutorialsUrl, supportUrl } = data

  return `
Bienvenue sur VistraTV !

Bonjour ${name},

Nous sommes ravis de vous accueillir dans la communauté VistraTV ! Votre compte a été créé avec succès.

Ce qui vous attend :
- Plus de 20 000 chaînes en direct
- 50 000+ films et séries
- Compatible sur tous vos appareils
- Support client 24/7
- Qualité HD, 4K et 8K

Prochaines étapes :
1. Connectez-vous à votre compte : ${loginUrl}
2. Choisissez un abonnement adapté à vos besoins
3. Suivez nos tutoriels d'installation : ${tutorialsUrl}
4. Profitez de vos contenus préférés !

Besoin d'aide ? Notre équipe est là pour vous !
Contacter le support : ${supportUrl}

---
© ${new Date().getFullYear()} VistraTV. Tous droits réservés.
Vous recevez cet email car vous avez créé un compte sur VistraTV.
`
}
