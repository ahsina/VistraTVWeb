export const emailTemplates = {
  abandonedCart: (data: {
    name: string
    amount: string
    currency: string
    planName: string
    paymentUrl: string
    locale: string
  }) => {
    const templates: Record<string, any> = {
      fr: {
        subject: `Ne manquez pas votre abonnement VistraTV !`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">VistraTV</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #333; margin-top: 0;">Bonjour ${data.name},</h2>
    
    <p style="font-size: 16px;">Vous étiez sur le point de vous abonner à <strong>${data.planName}</strong> mais n'avez pas finalisé votre paiement.</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
      <h3 style="margin-top: 0; color: #667eea;">Votre offre vous attend :</h3>
      <p style="font-size: 18px; margin: 10px 0;"><strong>${data.planName}</strong></p>
      <p style="font-size: 24px; color: #667eea; margin: 10px 0;"><strong>${data.amount} ${data.currency}</strong></p>
    </div>
    
    <p style="font-size: 16px;">Profitez de milliers de chaînes en direct, films et séries en qualité HD et 4K !</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.paymentUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-size: 18px; font-weight: bold; display: inline-block;">
        Finaliser mon paiement
      </a>
    </div>
    
    <p style="font-size: 14px; color: #666; text-align: center;">Ce lien expire dans 24 heures</p>
    
    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
    
    <p style="font-size: 14px; color: #999; text-align: center;">
      VistraTV - Votre plateforme de streaming premium<br>
      <a href="https://vistratv.com" style="color: #667eea;">vistratv.com</a>
    </p>
  </div>
</body>
</html>`,
      },
      en: {
        subject: `Don't miss your VistraTV subscription!`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">VistraTV</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #333; margin-top: 0;">Hello ${data.name},</h2>
    
    <p style="font-size: 16px;">You were about to subscribe to <strong>${data.planName}</strong> but didn't complete your payment.</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
      <h3 style="margin-top: 0; color: #667eea;">Your offer is waiting:</h3>
      <p style="font-size: 18px; margin: 10px 0;"><strong>${data.planName}</strong></p>
      <p style="font-size: 24px; color: #667eea; margin: 10px 0;"><strong>${data.amount} ${data.currency}</strong></p>
    </div>
    
    <p style="font-size: 16px;">Enjoy thousands of live channels, movies and series in HD and 4K quality!</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.paymentUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-size: 18px; font-weight: bold; display: inline-block;">
        Complete my payment
      </a>
    </div>
    
    <p style="font-size: 14px; color: #666; text-align: center;">This link expires in 24 hours</p>
    
    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
    
    <p style="font-size: 14px; color: #999; text-align: center;">
      VistraTV - Your premium streaming platform<br>
      <a href="https://vistratv.com" style="color: #667eea;">vistratv.com</a>
    </p>
  </div>
</body>
</html>`,
      },
    }

    const template = templates[data.locale] || templates.fr
    return template
  },

  supportTicket: (data: {
    name: string
    ticketNumber: string
    subject: string
    trackingUrl: string
    locale: string
  }) => {
    const templates: Record<string, any> = {
      fr: {
        subject: `Confirmation de votre ticket support #${data.ticketNumber}`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Support VistraTV</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #333; margin-top: 0;">Bonjour ${data.name},</h2>
    
    <p style="font-size: 16px;">Votre ticket de support a été créé avec succès !</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
      <h3 style="margin-top: 0; color: #667eea;">Détails du ticket :</h3>
      <p style="margin: 10px 0;"><strong>Numéro :</strong> #${data.ticketNumber}</p>
      <p style="margin: 10px 0;"><strong>Sujet :</strong> ${data.subject}</p>
      <p style="margin: 10px 0;"><strong>Temps de réponse estimé :</strong> moins de 4 heures</p>
    </div>
    
    <p style="font-size: 16px;">Notre équipe support vous répondra dans les plus brefs délais.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.trackingUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-size: 18px; font-weight: bold; display: inline-block;">
        Suivre mon ticket
      </a>
    </div>
    
    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
    
    <p style="font-size: 14px; color: #999; text-align: center;">
      VistraTV Support - Nous sommes là pour vous aider<br>
      <a href="https://vistratv.com/support" style="color: #667eea;">support.vistratv.com</a>
    </p>
  </div>
</body>
</html>`,
      },
      en: {
        subject: `Support ticket confirmation #${data.ticketNumber}`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">VistraTV Support</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #333; margin-top: 0;">Hello ${data.name},</h2>
    
    <p style="font-size: 16px;">Your support ticket has been created successfully!</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
      <h3 style="margin-top: 0; color: #667eea;">Ticket details:</h3>
      <p style="margin: 10px 0;"><strong>Number:</strong> #${data.ticketNumber}</p>
      <p style="margin: 10px 0;"><strong>Subject:</strong> ${data.subject}</p>
      <p style="margin: 10px 0;"><strong>Estimated response time:</strong> less than 4 hours</p>
    </div>
    
    <p style="font-size: 16px;">Our support team will respond as soon as possible.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.trackingUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-size: 18px; font-weight: bold; display: inline-block;">
        Track my ticket
      </a>
    </div>
    
    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
    
    <p style="font-size: 14px; color: #999; text-align: center;">
      VistraTV Support - We're here to help<br>
      <a href="https://vistratv.com/support" style="color: #667eea;">support.vistratv.com</a>
    </p>
  </div>
</body>
</html>`,
      },
    }

    const template = templates[data.locale] || templates.fr
    return template
  },
}
