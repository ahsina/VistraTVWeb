// lib/i18n/translations.ts
// Système de traductions centralisé

export type Language = "fr" | "en" | "ar" | "es" | "it"

export const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.pricing": "Tarifs",
    "nav.channels": "Chaînes",
    "nav.faq": "FAQ",
    "nav.support": "Support",
    "nav.login": "Connexion",
    "nav.register": "Inscription",
    "nav.dashboard": "Tableau de bord",
    "nav.logout": "Déconnexion",

    // Hero
    "hero.title": "Streaming illimité",
    "hero.subtitle": "Accédez à des milliers de chaînes TV et films",
    "hero.cta": "Commencer maintenant",
    "hero.trial": "Essai gratuit de 24h",

    // Pricing
    "pricing.title": "Nos offres",
    "pricing.subtitle": "Choisissez le plan qui vous convient",
    "pricing.monthly": "Mensuel",
    "pricing.yearly": "Annuel",
    "pricing.popular": "Populaire",
    "pricing.save": "Économisez",
    "pricing.select": "Sélectionner",
    "pricing.features": "Fonctionnalités incluses",
    "pricing.channels": "chaînes",
    "pricing.devices": "appareils simultanés",
    "pricing.hd": "Qualité HD/4K",
    "pricing.support": "Support 24/7",
    "pricing.vod": "VOD inclus",

    // Checkout
    "checkout.title": "Finaliser votre commande",
    "checkout.email": "Email",
    "checkout.whatsapp": "WhatsApp",
    "checkout.promo": "Code promo",
    "checkout.apply": "Appliquer",
    "checkout.total": "Total",
    "checkout.discount": "Réduction",
    "checkout.pay": "Payer",
    "checkout.processing": "Traitement en cours...",
    "checkout.success": "Paiement réussi!",
    "checkout.error": "Erreur de paiement",
    "checkout.crypto": "Payer en crypto",

    // Auth
    "auth.login": "Se connecter",
    "auth.register": "S'inscrire",
    "auth.email": "Email",
    "auth.password": "Mot de passe",
    "auth.confirmPassword": "Confirmer le mot de passe",
    "auth.forgotPassword": "Mot de passe oublié?",
    "auth.resetPassword": "Réinitialiser le mot de passe",
    "auth.noAccount": "Pas encore de compte?",
    "auth.hasAccount": "Déjà un compte?",
    "auth.orContinueWith": "Ou continuer avec",
    "auth.termsAgree": "En vous inscrivant, vous acceptez nos",
    "auth.terms": "Conditions d'utilisation",
    "auth.privacy": "Politique de confidentialité",

    // Dashboard
    "dashboard.welcome": "Bienvenue",
    "dashboard.subscription": "Mon abonnement",
    "dashboard.active": "Actif",
    "dashboard.expired": "Expiré",
    "dashboard.expiresIn": "Expire dans",
    "dashboard.days": "jours",
    "dashboard.renew": "Renouveler",
    "dashboard.settings": "Paramètres",
    "dashboard.history": "Historique",
    "dashboard.invoices": "Factures",

    // Support
    "support.title": "Support",
    "support.subtitle": "Comment pouvons-nous vous aider?",
    "support.newTicket": "Nouveau ticket",
    "support.subject": "Sujet",
    "support.message": "Message",
    "support.send": "Envoyer",
    "support.priority": "Priorité",
    "support.low": "Basse",
    "support.medium": "Moyenne",
    "support.high": "Haute",
    "support.urgent": "Urgente",
    "support.status.open": "Ouvert",
    "support.status.inProgress": "En cours",
    "support.status.resolved": "Résolu",
    "support.status.closed": "Fermé",

    // FAQ
    "faq.title": "Questions fréquentes",
    "faq.search": "Rechercher une question...",
    "faq.categories.all": "Toutes",
    "faq.categories.installation": "Installation",
    "faq.categories.payment": "Paiement",
    "faq.categories.subscription": "Abonnement",
    "faq.categories.technical": "Technique",
    "faq.helpful": "Cette réponse vous a-t-elle aidé?",
    "faq.yes": "Oui",
    "faq.no": "Non",

    // Common
    "common.loading": "Chargement...",
    "common.error": "Une erreur est survenue",
    "common.success": "Succès",
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
    "common.delete": "Supprimer",
    "common.edit": "Modifier",
    "common.close": "Fermer",
    "common.back": "Retour",
    "common.next": "Suivant",
    "common.previous": "Précédent",
    "common.search": "Rechercher",
    "common.filter": "Filtrer",
    "common.sort": "Trier",
    "common.noResults": "Aucun résultat",
    "common.seeMore": "Voir plus",
    "common.seeLess": "Voir moins",

    // Footer
    "footer.about": "À propos",
    "footer.contact": "Contact",
    "footer.legal": "Mentions légales",
    "footer.privacy": "Confidentialité",
    "footer.terms": "CGV",
    "footer.copyright": "Tous droits réservés",

    // Affiliate
    "affiliate.title": "Programme d'affiliation",
    "affiliate.subtitle": "Gagnez des commissions en recommandant VistraTV",
    "affiliate.join": "Rejoindre le programme",
    "affiliate.yourCode": "Votre code",
    "affiliate.yourLink": "Votre lien",
    "affiliate.copy": "Copier",
    "affiliate.copied": "Copié!",
    "affiliate.stats": "Statistiques",
    "affiliate.clicks": "Clics",
    "affiliate.conversions": "Conversions",
    "affiliate.earnings": "Gains",
    "affiliate.pending": "En attente",
    "affiliate.paid": "Payé",

     // Checkout
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
    "support.createTicket": "Créer un ticket",
    "support.directContact": "Contact Direct",
    "support.needHelp": "Besoin d'aide ?",
    "support.viewFaq": "Voir la FAQ",
    "support.category": "Catégorie",
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
    // Navigation
    "nav.home": "Home",
    "nav.pricing": "Pricing",
    "nav.channels": "Channels",
    "nav.faq": "FAQ",
    "nav.support": "Support",
    "nav.login": "Login",
    "nav.register": "Sign up",
    "nav.dashboard": "Dashboard",
    "nav.logout": "Logout",

    // Hero
    "hero.title": "Unlimited Streaming",
    "hero.subtitle": "Access thousands of TV channels and movies",
    "hero.cta": "Get Started",
    "hero.trial": "24h free trial",

    // Pricing
    "pricing.title": "Our Plans",
    "pricing.subtitle": "Choose the plan that suits you",
    "pricing.monthly": "Monthly",
    "pricing.yearly": "Yearly",
    "pricing.popular": "Popular",
    "pricing.save": "Save",
    "pricing.select": "Select",
    "pricing.features": "Features included",
    "pricing.channels": "channels",
    "pricing.devices": "simultaneous devices",
    "pricing.hd": "HD/4K Quality",
    "pricing.support": "24/7 Support",
    "pricing.vod": "VOD included",

    // Checkout
    "checkout.title": "Complete your order",
    "checkout.email": "Email",
    "checkout.whatsapp": "WhatsApp",
    "checkout.promo": "Promo code",
    "checkout.apply": "Apply",
    "checkout.total": "Total",
    "checkout.discount": "Discount",
    "checkout.pay": "Pay",
    "checkout.processing": "Processing...",
    "checkout.success": "Payment successful!",
    "checkout.error": "Payment error",
    "checkout.crypto": "Pay with crypto",

    // Auth
    "auth.login": "Log in",
    "auth.register": "Sign up",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.confirmPassword": "Confirm password",
    "auth.forgotPassword": "Forgot password?",
    "auth.resetPassword": "Reset password",
    "auth.noAccount": "Don't have an account?",
    "auth.hasAccount": "Already have an account?",
    "auth.orContinueWith": "Or continue with",
    "auth.termsAgree": "By signing up, you agree to our",
    "auth.terms": "Terms of Service",
    "auth.privacy": "Privacy Policy",

    // Dashboard
    "dashboard.welcome": "Welcome",
    "dashboard.subscription": "My subscription",
    "dashboard.active": "Active",
    "dashboard.expired": "Expired",
    "dashboard.expiresIn": "Expires in",
    "dashboard.days": "days",
    "dashboard.renew": "Renew",
    "dashboard.settings": "Settings",
    "dashboard.history": "History",
    "dashboard.invoices": "Invoices",

    // Support
    "support.title": "Support",
    "support.subtitle": "How can we help you?",
    "support.newTicket": "New ticket",
    "support.subject": "Subject",
    "support.message": "Message",
    "support.send": "Send",
    "support.priority": "Priority",
    "support.low": "Low",
    "support.medium": "Medium",
    "support.high": "High",
    "support.urgent": "Urgent",
    "support.status.open": "Open",
    "support.status.inProgress": "In Progress",
    "support.status.resolved": "Resolved",
    "support.status.closed": "Closed",

    // FAQ
    "faq.title": "Frequently Asked Questions",
    "faq.search": "Search for a question...",
    "faq.categories.all": "All",
    "faq.categories.installation": "Installation",
    "faq.categories.payment": "Payment",
    "faq.categories.subscription": "Subscription",
    "faq.categories.technical": "Technical",
    "faq.helpful": "Was this answer helpful?",
    "faq.yes": "Yes",
    "faq.no": "No",

    // Common
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.success": "Success",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.close": "Close",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.noResults": "No results",
    "common.seeMore": "See more",
    "common.seeLess": "See less",

    // Footer
    "footer.about": "About",
    "footer.contact": "Contact",
    "footer.legal": "Legal notice",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
    "footer.copyright": "All rights reserved",

    // Affiliate
    "affiliate.title": "Affiliate Program",
    "affiliate.subtitle": "Earn commissions by recommending VistraTV",
    "affiliate.join": "Join the program",
    "affiliate.yourCode": "Your code",
    "affiliate.yourLink": "Your link",
    "affiliate.copy": "Copy",
    "affiliate.copied": "Copied!",
    "affiliate.stats": "Statistics",
    "affiliate.clicks": "Clicks",
    "affiliate.conversions": "Conversions",
    "affiliate.earnings": "Earnings",
    "affiliate.pending": "Pending",
    "affiliate.paid": "Paid",

    // Checkout
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
    "support.createTicket": "Create a ticket",
    "support.directContact": "Direct Contact",
    "support.needHelp": "Need help?",
    "support.viewFaq": "View FAQ",
    "support.category": "Category",
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
    // Navigation
    "nav.home": "الرئيسية",
    "nav.pricing": "الأسعار",
    "nav.channels": "القنوات",
    "nav.faq": "الأسئلة الشائعة",
    "nav.support": "الدعم",
    "nav.login": "تسجيل الدخول",
    "nav.register": "إنشاء حساب",
    "nav.dashboard": "لوحة التحكم",
    "nav.logout": "تسجيل الخروج",

    // Hero
    "hero.title": "بث غير محدود",
    "hero.subtitle": "الوصول إلى آلاف القنوات التلفزيونية والأفلام",
    "hero.cta": "ابدأ الآن",
    "hero.trial": "تجربة مجانية 24 ساعة",

    // Pricing
    "pricing.title": "عروضنا",
    "pricing.subtitle": "اختر الخطة المناسبة لك",
    "pricing.monthly": "شهري",
    "pricing.yearly": "سنوي",
    "pricing.popular": "الأكثر شعبية",
    "pricing.save": "وفر",
    "pricing.select": "اختر",
    "pricing.features": "الميزات المتضمنة",
    "pricing.channels": "قناة",
    "pricing.devices": "أجهزة متزامنة",
    "pricing.hd": "جودة HD/4K",
    "pricing.support": "دعم 24/7",
    "pricing.vod": "VOD مضمن",

    // Common
    "common.loading": "جاري التحميل...",
    "common.error": "حدث خطأ",
    "common.success": "نجاح",
    "common.save": "حفظ",
    "common.cancel": "إلغاء",
    "common.delete": "حذف",
    "common.edit": "تعديل",
    "common.close": "إغلاق",
    "common.back": "رجوع",
    "common.next": "التالي",
    "common.previous": "السابق",
    "common.search": "بحث",
    "common.filter": "تصفية",
    "common.sort": "ترتيب",
    "common.noResults": "لا توجد نتائج",
    "common.seeMore": "عرض المزيد",
    "common.seeLess": "عرض أقل",

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
    // Navigation
    "nav.home": "Inicio",
    "nav.pricing": "Precios",
    "nav.channels": "Canales",
    "nav.faq": "FAQ",
    "nav.support": "Soporte",
    "nav.login": "Iniciar sesión",
    "nav.register": "Registrarse",
    "nav.dashboard": "Panel",
    "nav.logout": "Cerrar sesión",

    // Hero
    "hero.title": "Streaming ilimitado",
    "hero.subtitle": "Accede a miles de canales de TV y películas",
    "hero.cta": "Empezar ahora",
    "hero.trial": "Prueba gratis de 24h",

    // Pricing
    "pricing.title": "Nuestros planes",
    "pricing.subtitle": "Elige el plan que te conviene",
    "pricing.monthly": "Mensual",
    "pricing.yearly": "Anual",
    "pricing.popular": "Popular",
    "pricing.save": "Ahorra",
    "pricing.select": "Seleccionar",
    "pricing.features": "Características incluidas",
    "pricing.channels": "canales",
    "pricing.devices": "dispositivos simultáneos",
    "pricing.hd": "Calidad HD/4K",
    "pricing.support": "Soporte 24/7",
    "pricing.vod": "VOD incluido",

    // Common
    "common.loading": "Cargando...",
    "common.error": "Ocurrió un error",
    "common.success": "Éxito",
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.delete": "Eliminar",
    "common.edit": "Editar",
    "common.close": "Cerrar",
    "common.back": "Volver",
    "common.next": "Siguiente",
    "common.previous": "Anterior",
    "common.search": "Buscar",
    "common.filter": "Filtrar",
    "common.sort": "Ordenar",
    "common.noResults": "Sin resultados",
    "common.seeMore": "Ver más",
    "common.seeLess": "Ver menos",

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
    // Navigation
    "nav.home": "Home",
    "nav.pricing": "Prezzi",
    "nav.channels": "Canali",
    "nav.faq": "FAQ",
    "nav.support": "Supporto",
    "nav.login": "Accedi",
    "nav.register": "Registrati",
    "nav.dashboard": "Dashboard",
    "nav.logout": "Esci",

    // Hero
    "hero.title": "Streaming illimitato",
    "hero.subtitle": "Accedi a migliaia di canali TV e film",
    "hero.cta": "Inizia ora",
    "hero.trial": "Prova gratuita di 24h",

    // Pricing
    "pricing.title": "I nostri piani",
    "pricing.subtitle": "Scegli il piano adatto a te",
    "pricing.monthly": "Mensile",
    "pricing.yearly": "Annuale",
    "pricing.popular": "Popolare",
    "pricing.save": "Risparmia",
    "pricing.select": "Seleziona",
    "pricing.features": "Funzionalità incluse",
    "pricing.channels": "canali",
    "pricing.devices": "dispositivi simultanei",
    "pricing.hd": "Qualità HD/4K",
    "pricing.support": "Supporto 24/7",
    "pricing.vod": "VOD incluso",

    // Common
    "common.loading": "Caricamento...",
    "common.error": "Si è verificato un errore",
    "common.success": "Successo",
    "common.save": "Salva",
    "common.cancel": "Annulla",
    "common.delete": "Elimina",
    "common.edit": "Modifica",
    "common.close": "Chiudi",
    "common.back": "Indietro",
    "common.next": "Avanti",
    "common.previous": "Precedente",
    "common.search": "Cerca",
    "common.filter": "Filtra",
    "common.sort": "Ordina",
    "common.noResults": "Nessun risultato",
    "common.seeMore": "Vedi altro",
    "common.seeLess": "Vedi meno",

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

// Fonction de traduction
export function t(key: string, locale: Language = "fr"): string {
  return translations[locale]?.[key] || translations.fr[key] || key
}

// Directions RTL
export const rtlLanguages: Language[] = ["ar"]

export function isRTL(locale: Language): boolean {
  return rtlLanguages.includes(locale)
}

export default translations

// AJOUTE ces lignes à la fin de ton fichier lib/i18n/translations.ts

export type TranslationKeys = Record<string, string>

export function getTranslation(locale: string): TranslationKeys {
  const validLocale = locale as Language
  return translations[validLocale] || translations.fr
}