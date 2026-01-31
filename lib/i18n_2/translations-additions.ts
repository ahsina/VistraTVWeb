// lib/i18n/translations-additions.ts
// Ces traductions doivent être ajoutées/fusionnées avec le fichier translations.ts existant

export const additionalTranslations = {
  fr: {
    // Checkout
    "checkout.title": "Finaliser votre commande",
    "checkout.subtitle": "Paiement sécurisé et rapide",
    "checkout.orderSummary": "Récapitulatif",
    "checkout.fillAllFields": "Veuillez remplir tous les champs",
    "checkout.invalidEmail": "Veuillez entrer une adresse email valide",
    "checkout.invalidWhatsApp": "Veuillez entrer un numéro WhatsApp valide (ex: +33612345678)",
    "checkout.acceptTerms": "Veuillez accepter les conditions générales",
    "checkout.completeCaptcha": "Veuillez compléter la vérification de sécurité",
    "checkout.selectPlan": "Veuillez sélectionner un plan d'abonnement",
    "checkout.tax": "TVA (10%)",
    "checkout.securePayment": "Paiement 100% sécurisé",
    "checkout.termsAccept": "J'accepte les Conditions Générales de Vente et la Politique de Confidentialité",
    "checkout.paymentError": "Erreur lors du paiement",
    "checkout.processingError": "Erreur lors du traitement du paiement",
    "checkout.promoApplied": "Code promo appliqué",
    "checkout.promoRemoved": "Code promo retiré",
    "checkout.promoInvalid": "Code promo invalide",
    
    // Auth
    "auth.fullName": "Nom complet",
    "auth.loginSuccess": "Connexion réussie ! Bienvenue.",
    "auth.loginError": "Identifiants incorrects. Vérifiez votre email et mot de passe.",
    "auth.registerSuccess": "Compte créé avec succès ! Bienvenue sur VistraTV.",
    "auth.registerError": "Erreur lors de la création du compte",
    "auth.loginSubtitle": "Accédez à votre espace VistraTV",
    "auth.registerSubtitle": "Rejoignez VistraTV dès maintenant",
    "auth.rememberMe": "Se souvenir de moi",
    "auth.passwordWeak": "Mot de passe trop faible",
    "auth.passwordMismatch": "Les mots de passe ne correspondent pas",
    
    // Password strength
    "password.strength": "Force du mot de passe",
    "password.weak": "Faible",
    "password.medium": "Moyen",
    "password.good": "Bon",
    "password.excellent": "Excellent",
    "password.minLength": "Au moins 8 caractères",
    "password.uppercase": "Une lettre majuscule",
    "password.lowercase": "Une lettre minuscule",
    "password.number": "Un chiffre",
    "password.special": "Un caractère spécial (!@#$%^&*)",
    
    // Support
    "support.ticketCreated": "Ticket créé !",
    "support.ticketNumber": "Numéro de ticket",
    "support.ticketConfirmation": "Votre demande a été enregistrée avec succès.",
    "support.newTicket": "Nouveau ticket",
    "support.createTicket": "Créer un ticket",
    "support.directContact": "Contact Direct",
    "support.needHelp": "Besoin d'aide ?",
    "support.viewFaq": "Voir la FAQ",
    "support.category": "Catégorie",
    "support.priority": "Priorité",
    "support.subject": "Sujet",
    "support.message": "Message",
    "support.send": "Envoyer le ticket",
    "support.sending": "Envoi en cours...",
    
    // Validation
    "validation.required": "Ce champ est requis",
    "validation.emailInvalid": "Format d'email invalide",
    "validation.whatsappInvalid": "Le numéro doit commencer par l'indicatif pays (ex: +33)",
    "validation.tooShort": "Ce champ est trop court",
    "validation.tooLong": "Ce champ est trop long",
    
    // Security
    "security.captchaError": "Erreur de vérification de sécurité. Veuillez réessayer.",
    "security.secureConnection": "Connexion sécurisée - Vos données sont protégées",
  },

  en: {
    // Checkout
    "checkout.title": "Complete your order",
    "checkout.subtitle": "Secure and fast payment",
    "checkout.orderSummary": "Order Summary",
    "checkout.fillAllFields": "Please fill in all fields",
    "checkout.invalidEmail": "Please enter a valid email address",
    "checkout.invalidWhatsApp": "Please enter a valid WhatsApp number (e.g., +33612345678)",
    "checkout.acceptTerms": "Please accept the terms and conditions",
    "checkout.completeCaptcha": "Please complete the security verification",
    "checkout.selectPlan": "Please select a subscription plan",
    "checkout.tax": "VAT (10%)",
    "checkout.securePayment": "100% secure payment",
    "checkout.termsAccept": "I accept the Terms of Service and Privacy Policy",
    "checkout.paymentError": "Payment error",
    "checkout.processingError": "Error processing payment",
    "checkout.promoApplied": "Promo code applied",
    "checkout.promoRemoved": "Promo code removed",
    "checkout.promoInvalid": "Invalid promo code",
    
    // Auth
    "auth.fullName": "Full name",
    "auth.loginSuccess": "Login successful! Welcome.",
    "auth.loginError": "Invalid credentials. Check your email and password.",
    "auth.registerSuccess": "Account created successfully! Welcome to VistraTV.",
    "auth.registerError": "Error creating account",
    "auth.loginSubtitle": "Access your VistraTV space",
    "auth.registerSubtitle": "Join VistraTV now",
    "auth.rememberMe": "Remember me",
    "auth.passwordWeak": "Password too weak",
    "auth.passwordMismatch": "Passwords do not match",
    
    // Password strength
    "password.strength": "Password strength",
    "password.weak": "Weak",
    "password.medium": "Medium",
    "password.good": "Good",
    "password.excellent": "Excellent",
    "password.minLength": "At least 8 characters",
    "password.uppercase": "One uppercase letter",
    "password.lowercase": "One lowercase letter",
    "password.number": "One number",
    "password.special": "One special character (!@#$%^&*)",
    
    // Support
    "support.ticketCreated": "Ticket created!",
    "support.ticketNumber": "Ticket number",
    "support.ticketConfirmation": "Your request has been successfully registered.",
    "support.newTicket": "New ticket",
    "support.createTicket": "Create a ticket",
    "support.directContact": "Direct Contact",
    "support.needHelp": "Need help?",
    "support.viewFaq": "View FAQ",
    "support.category": "Category",
    "support.priority": "Priority",
    "support.subject": "Subject",
    "support.message": "Message",
    "support.send": "Send ticket",
    "support.sending": "Sending...",
    
    // Validation
    "validation.required": "This field is required",
    "validation.emailInvalid": "Invalid email format",
    "validation.whatsappInvalid": "Number must start with country code (e.g., +33)",
    "validation.tooShort": "This field is too short",
    "validation.tooLong": "This field is too long",
    
    // Security
    "security.captchaError": "Security verification error. Please try again.",
    "security.secureConnection": "Secure connection - Your data is protected",
  },

  ar: {
    // Checkout
    "checkout.title": "إتمام طلبك",
    "checkout.subtitle": "دفع آمن وسريع",
    "checkout.orderSummary": "ملخص الطلب",
    "checkout.fillAllFields": "يرجى ملء جميع الحقول",
    "checkout.invalidEmail": "يرجى إدخال بريد إلكتروني صحيح",
    "checkout.invalidWhatsApp": "يرجى إدخال رقم واتساب صحيح",
    "checkout.acceptTerms": "يرجى قبول الشروط والأحكام",
    "checkout.completeCaptcha": "يرجى إكمال التحقق الأمني",
    "checkout.selectPlan": "يرجى اختيار خطة اشتراك",
    "checkout.tax": "ضريبة القيمة المضافة (10%)",
    "checkout.securePayment": "دفع آمن 100%",
    
    // Auth
    "auth.fullName": "الاسم الكامل",
    "auth.loginSuccess": "تم تسجيل الدخول بنجاح!",
    "auth.loginError": "بيانات الدخول غير صحيحة",
    "auth.registerSuccess": "تم إنشاء الحساب بنجاح!",
    "auth.rememberMe": "تذكرني",
    
    // Password
    "password.strength": "قوة كلمة المرور",
    "password.weak": "ضعيفة",
    "password.medium": "متوسطة",
    "password.good": "جيدة",
    "password.excellent": "ممتازة",
  },

  es: {
    // Checkout
    "checkout.title": "Completar su pedido",
    "checkout.subtitle": "Pago seguro y rápido",
    "checkout.orderSummary": "Resumen del pedido",
    "checkout.fillAllFields": "Por favor complete todos los campos",
    "checkout.invalidEmail": "Por favor ingrese un email válido",
    "checkout.invalidWhatsApp": "Por favor ingrese un número de WhatsApp válido",
    "checkout.acceptTerms": "Por favor acepte los términos y condiciones",
    "checkout.completeCaptcha": "Por favor complete la verificación de seguridad",
    "checkout.selectPlan": "Por favor seleccione un plan de suscripción",
    "checkout.tax": "IVA (10%)",
    "checkout.securePayment": "Pago 100% seguro",
    
    // Auth
    "auth.fullName": "Nombre completo",
    "auth.loginSuccess": "¡Inicio de sesión exitoso!",
    "auth.loginError": "Credenciales incorrectas",
    "auth.registerSuccess": "¡Cuenta creada con éxito!",
    "auth.rememberMe": "Recuérdame",
    
    // Password
    "password.strength": "Fuerza de la contraseña",
    "password.weak": "Débil",
    "password.medium": "Media",
    "password.good": "Buena",
    "password.excellent": "Excelente",
  },

  it: {
    // Checkout
    "checkout.title": "Completa il tuo ordine",
    "checkout.subtitle": "Pagamento sicuro e veloce",
    "checkout.orderSummary": "Riepilogo ordine",
    "checkout.fillAllFields": "Compila tutti i campi",
    "checkout.invalidEmail": "Inserisci un'email valida",
    "checkout.invalidWhatsApp": "Inserisci un numero WhatsApp valido",
    "checkout.acceptTerms": "Accetta i termini e le condizioni",
    "checkout.completeCaptcha": "Completa la verifica di sicurezza",
    "checkout.selectPlan": "Seleziona un piano di abbonamento",
    "checkout.tax": "IVA (10%)",
    "checkout.securePayment": "Pagamento 100% sicuro",
    
    // Auth
    "auth.fullName": "Nome completo",
    "auth.loginSuccess": "Accesso riuscito!",
    "auth.loginError": "Credenziali non valide",
    "auth.registerSuccess": "Account creato con successo!",
    "auth.rememberMe": "Ricordami",
    
    // Password
    "password.strength": "Forza della password",
    "password.weak": "Debole",
    "password.medium": "Media",
    "password.good": "Buona",
    "password.excellent": "Eccellente",
  },
}

// Instructions pour fusionner avec translations.ts:
// 1. Ouvrir lib/i18n/translations.ts
// 2. Pour chaque langue (fr, en, ar, es, it), ajouter les nouvelles clés
// 3. Exemple:
//    fr: {
//      ...existingTranslations.fr,
//      ...additionalTranslations.fr,
//    }
