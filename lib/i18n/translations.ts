import type { Locale } from "./config"

export const translations = {
  fr: {
    // Navigation
    nav: {
      home: "Accueil",
      offers: "Offres",
      presentation: "Présentation",
      tutorials: "Tutoriels",
      contact: "Contact",
      subscribe: "S'abonner",
      myAccount: "Mon compte",
      logout: "Déconnexion",
      channels: "Chaînes",
      content: "Contenus",
      support: "Support",
      howItWorks: "Comment ça marche",
      about: "À propos",
      terms: "Conditions",
      privacy: "Confidentialité",
    },

    // Home Page
    home: {
      hero: {
        title: "Découvrez VistraTV",
        subtitle: "L'IPTV Premium à portée de main",
        description:
          "Plus de 15 000 chaînes en direct, films et séries à la demande. Compatible avec tous vos appareils.",
        cta: "Découvrir nos offres",
        features: "Sans engagement • HD/4K • Support 24/7",
      },
      channels: {
        title: "15 000+ Chaînes du Monde Entier",
        subtitle: "Sport, Films, Séries, Actualités et bien plus",
      },
      pricing: {
        title: "Choisissez Votre Abonnement",
        subtitle: "Choisissez l'offre qui vous convient",
      },
      devices: {
        title: "Compatible avec Tous vos Appareils",
        subtitle: "Regardez où vous voulez, quand vous voulez",
      },
      testimonials: {
        title: "Ils nous font confiance",
        subtitle: "Des milliers de clients satisfaits",
      },
      faq: {
        title: "Questions Fréquentes",
        subtitle: "Tout ce que vous devez savoir",
      },
    },

    // Subscriptions
    subscriptions: {
      title: "Choisissez votre Abonnement",
      subtitle: "Profitez de VistraTV sur tous vos appareils",
      monthly: "Mensuel",
      quarterly: "3 Mois",
      semiAnnual: "6 Mois",
      annual: "Annuel",
      perMonth: "/mois",
      popular: "Populaire",
      bestValue: "Meilleure Offre",
      selectPlan: "Choisir",
      features: {
        channels: "chaînes en direct",
        devices: "appareils simultanés",
        quality: "Qualité HD/4K",
        vod: "VOD illimitée",
        support: "Support 24/7",
        updates: "Mises à jour gratuites",
      },
      guarantee: "Satisfait ou remboursé sous 7 jours",
      loading: "Chargement...",
      noPlans: "Aucun plan disponible",
      subscribe: "S'abonner",
      perYear: "/an",
    },

    // Checkout
    checkout: {
      title: "Finaliser votre Commande",
      subtitle: "Vous êtes à un pas de profiter de VistraTV",
      summary: "Résumé",
      plan: "Abonnement",
      price: "Prix",
      total: "Total",
      contactInfo: "Informations de Contact",
      firstName: "Prénom",
      lastName: "Nom",
      email: "Email",
      phone: "Téléphone",
      whatsapp: "Numéro WhatsApp",
      whatsappOptional: "Optionnel - pour recevoir vos identifiants",
      paymentMethod: "Méthode de Paiement",
      payNow: "Payer Maintenant",
      processing: "Traitement en cours...",
      secure: "Paiement sécurisé",
      errors: {
        required: "Ce champ est requis",
        email: "Email invalide",
        phone: "Téléphone invalide",
      },
      fillAllFields: "Veuillez remplir tous les champs",
      selectedPlan: "Plan Sélectionné",
      orderSummary: "Résumé de la Commande",
      tax: "TVA",
      securePayment: "Paiement 100% Sécurisé",
      cancelAnytime: "Annulez à Tout Moment",
      instantAccess: "Accès Instantané",
    },

    // Payment Success
    paymentSuccess: {
      title: "Paiement Réussi !",
      subtitle: "Merci pour votre confiance",
      message: "Votre abonnement VistraTV a été activé avec succès",
      credentials: {
        title: "Vos Identifiants IPTV",
        description: "Vous allez recevoir vos identifiants dans quelques minutes par :",
        email: "Email envoyé à",
        whatsapp: "Message WhatsApp au",
        info: "Les identifiants incluent votre nom d'utilisateur, mot de passe et le lien M3U pour configurer votre application IPTV.",
      },
      next: {
        title: "Prochaines Étapes",
        step1: "Consultez votre email ou WhatsApp",
        step2: "Téléchargez une application IPTV",
        step3: "Configurez avec vos identifiants",
        step4: "Profitez de VistraTV !",
      },
      support: {
        title: "Besoin d'Aide ?",
        description: "Notre équipe est disponible 24/7 pour vous assister",
        contact: "Contacter le Support",
      },
      backHome: "Retour à l'Accueil",
      verifying: "Vérification du paiement...",
      pleaseWait: "Veuillez patienter pendant que nous confirmons votre paiement",
      error: "Erreur",
      backToPayment: "Retour au Paiement",
      noTransaction: "Aucune transaction trouvée",
      transactionDetails: "Détails de la Transaction",
      transactionId: "ID Transaction",
      plan: "Plan",
      amount: "Montant",
      duration: "Durée",
      months: "mois",
      credentialsArriving: "Vos Identifiants Arrivent",
      credentialsMessage: "Vous allez recevoir vos identifiants IPTV dans quelques minutes par email et WhatsApp",
      features: {
        downloadLink: "📥 Lien de téléchargement de l'application",
        activationCode: "🔑 Code d'activation unique",
        installGuide: "📖 Guide d'installation complet",
        support: "💬 Accès au support prioritaire",
      },
      tutorialsButton: "Voir les Tutoriels d'Installation",
      notReceived: "Pas reçu vos identifiants ?",
      notReceivedMessage: "Contactez-nous sur WhatsApp au",
      needHelp: "Besoin d'aide ?",
      or: "ou",
      supportPage: "page de support",
    },

    // Support
    support: {
      title: "Centre d'Aide",
      subtitle: "Nous sommes là pour vous aider",
      contact: {
        title: "Contactez-nous",
        description: "Notre équipe répond en moins de 2 heures",
        whatsapp: "WhatsApp",
        email: "Email",
        hours: "Disponible 24/7",
      },
      faq: {
        title: "Questions Fréquentes",
      },
      ticket: {
        title: "Ouvrir un Ticket",
        subject: "Sujet",
        message: "Message",
        send: "Envoyer",
        success: "Ticket envoyé avec succès",
      },
      backHome: "Retour à l'Accueil",
      email: "Email",
      phone: "Téléphone",
      available: "Disponible 24/7",
      emailResponse: "Réponse sous 24h",
      instantResponse: "Réponse instantanée",
      myTickets: "Mes Tickets de Support",
      newTicket: "Nouveau Ticket",
      noTickets: "Aucun ticket pour le moment",
      noTicketsDesc: "Créez un ticket pour contacter notre support",
      fullName: "Nom complet",
      yourName: "Votre nom",
      yourEmail: "votre@email.com",
      summarizeProblem: "Résumez votre problème",
      describeProblem: "Décrivez votre problème en détail...",
      createTicket: "Créer le Ticket",
      submitting: "Envoi en cours...",
      ticketCreated: "Ticket créé avec succès !",
      ticketNumber: "Numéro",
      responseTime: "Délai de réponse",
      lessThan4Hours: "moins de 4 heures",
      confirmationSent: "Un email de confirmation a été envoyé à",
      trackTicket: "Vous pouvez suivre votre ticket ci-dessous.",
      back: "Retour",
      status: {
        open: "Ouvert",
        in_progress: "En cours",
        resolved: "Résolu",
        closed: "Fermé",
      },
      priority: {
        low: "Basse",
        medium: "Moyenne",
        high: "Haute",
      },
      errors: {
        createTicket: "Erreur lors de la création du ticket",
      },
    },

    // Tutorials
    tutorials: {
      hero: {
        title: "Guides d'Installation",
        subtitle: "Configurez VistraTV sur votre appareil en quelques minutes",
      },
      selectDevice: {
        title: "Sélectionnez Votre Appareil",
        subtitle: "Choisissez votre appareil pour voir le guide d'installation",
      },
      features: {
        stepByStep: "Étape par étape",
        screenshots: "Captures d'écran",
        videoGuides: "Guides vidéo",
      },
      devices: {
        smarttv: {
          title: "Smart TV",
          desc: "Samsung, LG, Sony et autres",
        },
        androidbox: {
          title: "Box Android",
          desc: "Nvidia Shield, Mi Box, etc.",
        },
        androidphone: {
          title: "Téléphone Android",
          desc: "Tous les smartphones Android",
        },
        firestick: {
          title: "Amazon Fire Stick",
          desc: "Fire TV Stick et Fire TV Cube",
        },
        appletv: {
          title: "Apple TV",
          desc: "Apple TV 4K et HD",
        },
        iphone: {
          title: "iPhone/iPad",
          desc: "Appareils iOS",
        },
        mac: {
          title: "Mac",
          desc: "MacBook, iMac, Mac Mini",
        },
        windows: {
          title: "Windows PC",
          desc: "Windows 10 et 11",
        },
        kodi: {
          title: "Kodi",
          desc: "Media Center Kodi",
        },
        chromecast: {
          title: "Chromecast",
          desc: "Chromecast avec Google TV",
        },
        playstation: {
          title: "PlayStation",
          desc: "PS4 et PS5",
        },
        xbox: {
          title: "Xbox",
          desc: "Xbox One et Series X/S",
        },
      },
      difficulty: {
        easy: "Facile",
        medium: "Moyen",
        hard: "Difficile",
      },
      viewGuide: "Voir le Guide",
      needHelp: {
        title: "Besoin d'Aide ?",
        subtitle: "Notre équipe est là pour vous accompagner dans votre installation",
        contactSupport: "Contacter le Support",
        viewFaq: "Voir la FAQ",
      },
    },

    // About
    about: {
      title: "Pourquoi Choisir VistraTV",
      subtitle: "L'excellence IPTV à votre service",
      description:
        "Profitez d'une qualité de streaming exceptionnelle avec plus de 15 000 chaînes en direct, un support client 24/7 et une compatibilité totale avec tous vos appareils.",
      cta: "Commencer Maintenant",
    },
    aboutPage: {
      hero: {
        title: "À Propos de VistraTV",
        subtitle: "Votre Partenaire IPTV de Confiance",
        description:
          "Depuis 2018, nous offrons une expérience de streaming premium à des milliers de clients dans le monde entier. Notre mission est de rendre le divertissement accessible à tous.",
      },
      mission: {
        title: "Notre Mission",
        description:
          "Fournir un service IPTV de qualité supérieure avec la meilleure sélection de contenu, une fiabilité exceptionnelle et un support client incomparable.",
      },
      values: {
        security: {
          title: "Sécurité",
          desc: "Vos données et votre vie privée sont notre priorité absolue",
        },
        performance: {
          title: "Performance",
          desc: "Infrastructure optimisée pour un streaming fluide 24/7",
        },
        support: {
          title: "Support",
          desc: "Équipe disponible pour vous aider à tout moment",
        },
        quality: {
          title: "Qualité",
          desc: "Contenus en haute définition, jusqu'à 8K",
        },
        global: {
          title: "Global",
          desc: "Service disponible dans plus de 50 pays",
        },
        passion: {
          title: "Passion",
          desc: "Amour du divertissement et satisfaction client",
        },
      },
      stats: {
        founded: "Fondé",
        customers: "Clients",
        channels: "Chaînes",
        uptime: "Disponibilité",
      },
      valuesTitle: "Nos Valeurs",
      valuesSubtitle: "Ce qui nous définit",
      cta: {
        title: "Rejoignez-Nous Aujourd'hui",
        subtitle: "Commencez votre voyage avec VistraTV",
        subscribe: "S'Abonner Maintenant",
        contact: "Nous Contacter",
      },
    },

    // Footer
    footer: {
      description: "Votre service IPTV premium",
      links: "Liens Rapides",
      legal: "Légal",
      contact: "Contact",
      allRightsReserved: "Tous droits réservés",
    },
    legal: {
      backHome: "Retour à l'Accueil",
      lastUpdated: "Dernière mise à jour",
      termsTitle: "Conditions Générales d'Utilisation",
      privacyTitle: "Politique de Confidentialité",
      acceptance: "Acceptation des Conditions",
      serviceDescription: "Description du Service",
      userAccount: "Compte Utilisateur",
      subscription: "Abonnement et Paiement",
      usage: "Utilisation Acceptable",
      termination: "Résiliation",
      contact: "Contact",
      dataCollection: "Collecte des Données",
      dataUsage: "Utilisation des Données",
      dataSharing: "Partage des Données",
      cookies: "Cookies",
      security: "Sécurité",
      rights: "Vos Droits",
    },

    // Common
    common: {
      loading: "Chargement...",
      error: "Une erreur est survenue",
      retry: "Réessayer",
      cancel: "Annuler",
      confirm: "Confirmer",
      save: "Enregistrer",
      delete: "Supprimer",
      edit: "Modifier",
      close: "Fermer",
      back: "Retour",
      next: "Suivant",
      previous: "Précédent",
      search: "Rechercher",
      filter: "Filtrer",
      sort: "Trier",
      viewMore: "Voir plus",
      viewLess: "Voir moins",
    },

    // Channel Showcase
    channelShowcase: {
      title: "Découvrez Nos Chaînes",
      channelsCount: "Chaînes Disponibles",
      categories: {
        sports: "Sports",
        cinema: "Cinéma",
        series: "Séries",
        documentary: "Documentaires",
        news: "Actualités",
        kids: "Enfants",
      },
    },

    // Social Proof
    socialProof: {
      title: "Rejoignez Des Milliers de Clients Satisfaits",
    },

    // Latest Releases
    latestReleases: {
      title: "Dernières Sorties",
      subtitle: "Films et séries récemment ajoutés",
      movie: "Film",
      series: "Série",
    },

    // Device Compatibility
    deviceCompatibility: {
      title: "Compatible avec Tous vos Appareils",
      subtitle: "Regardez où vous voulez, quand vous voulez",
    },

    // WhatsApp Testimonials
    whatsapp: {
      title: "Témoignages WhatsApp",
      subtitle: "Découvrez ce que nos clients disent de nous sur WhatsApp",
      cta: "Nous Contacter sur WhatsApp",
    },

    // Free Trial
    freeTrial: {
      title: "Testez Gratuitement Sans Engagement !",
      description:
        "Profitez de 24-48h d'essai gratuit pour découvrir notre service premium. Aucune carte bancaire requise.",
      duration: "Essai 24-48h Gratuit",
      cta: "Commencer l'essai gratuit",
    },

    // Marketing Components
    marketing: {
      badges: {
        title: "Pourquoi Nous Faire Confiance",
        secure: "100% Sécurisé",
        secureDesc: "Paiements cryptés SSL",
        privacy: "Vie Privée",
        privacyDesc: "Données protégées",
        payment: "Paiement Facile",
        paymentDesc: "Plusieurs options",
        support: "Support 24/7",
        supportDesc: "Toujours disponible",
        quality: "Qualité Premium",
        qualityDesc: "HD/4K garantie",
        guarantee: "Garantie",
        guaranteeDesc: "7 jours satisfait ou remboursé",
      },
      guarantee: {
        title: "Garantie Satisfait ou Remboursé",
        subtitle: "Essayez sans risque pendant 7 jours",
        point1Title: "Sans Engagement",
        point1Desc: "Aucun contrat, annulez quand vous voulez",
        point2Title: "Remboursement Rapide",
        point2Desc: "Argent remboursé sous 48h",
        point3Title: "100% Garanti",
        point3Desc: "Aucune question posée",
        description: "Si vous n'êtes pas satisfait dans les 7 premiers jours, nous vous remboursons intégralement.",
        cta: "Commencer Maintenant",
        terms: "Conditions générales applicables",
      },
      hours: "Heures",
      minutes: "Minutes",
      seconds: "Secondes",
    },

    // Cookie Consent
    cookieConsent: {
      message:
        "Nous utilisons des cookies pour améliorer votre expérience. En continuant, vous acceptez notre utilisation des cookies.",
      accept: "Accepter",
      decline: "Refuser",
    },

    // Content (used in footer)
    content: {
      allMovies: "Tous les Films",
    },

    // Devices (used in footer)
    devices: {
      title: "Appareils",
    },

    // FAQ (used in footer)
    faq: {
      title: "FAQ",
    },

    // Browse
    browse: {
      channelsTitle: "Parcourir les Chaînes",
      channelsSubtitle: "Explorez notre collection complète de chaînes du monde entier",
      contentTitle: "Parcourir le Contenu",
      contentSubtitle: "Découvrez des milliers de films et séries",
      searchPlaceholder: "Rechercher...",
      allCategories: "Toutes les Catégories",
      allGenres: "Tous les Genres",
      resultsCount: "{count} résultat(s)",
      watch: "Regarder",
      noResults: "Aucun résultat trouvé",
      all: "Tout",
      movies: "Films",
      series: "Séries",
      genres: {
        action: "Action",
        comedy: "Comédie",
        drama: "Drame",
        thriller: "Thriller",
        scifi: "Science-Fiction",
        romance: "Romance",
        horror: "Horreur",
        documentary: "Documentaire",
      },
    },

    // How It Works
    howItWorks: {
      hero: {
        title: "Comment ça Marche",
        subtitle: "Profitez de VistraTV en 4 étapes simples",
      },
      steps: {
        step1: {
          title: "Choisissez Votre Plan",
          desc: "Sélectionnez l'abonnement qui correspond le mieux à vos besoins",
        },
        step2: {
          title: "Payez en Toute Sécurité",
          desc: "Effectuez votre paiement via notre système sécurisé",
        },
        step3: {
          title: "Recevez vos Identifiants",
          desc: "Obtenez vos codes d'accès par email et WhatsApp",
        },
        step4: {
          title: "Profitez du Contenu",
          desc: "Configurez votre application et commencez à regarder",
        },
      },
      featuresTitle: "Ce qui est Inclus",
      featuresSubtitle: "Tout ce dont vous avez besoin pour une expérience parfaite",
      features: {
        feature1: "Accès illimité à toutes les chaînes",
        feature2: "Qualité HD, 4K et 8K disponible",
        feature3: "Compatible avec tous les appareils",
        feature4: "Mises à jour automatiques du contenu",
        feature5: "Support technique 24/7",
        feature6: "Pas de publicités intrusives",
      },
      videoTitle: "Tutoriel Vidéo",
      videoSubtitle: "Suivez notre guide vidéo pas à pas",
      watchTutorial: "Regarder le Tutoriel",
      faq: {
        title: "Questions Fréquentes",
        subtitle: "Vous avez des questions ? Consultez notre FAQ",
        cta: "Voir la FAQ",
      },
      cta: {
        title: "Prêt à Commencer ?",
        subtitle: "Rejoignez des milliers de clients satisfaits",
        start: "Commencer Maintenant",
        viewPlans: "Voir les Plans",
      },
    },
  },

  en: {
    // Navigation
    nav: {
      home: "Home",
      offers: "Offers",
      presentation: "Presentation",
      tutorials: "Tutorials",
      contact: "Contact",
      subscribe: "Subscribe",
      myAccount: "My Account",
      logout: "Logout",
      channels: "Channels",
      content: "Content",
      support: "Support",
      howItWorks: "How It Works",
      about: "About",
      terms: "Terms",
      privacy: "Privacy",
    },

    // Home Page
    home: {
      hero: {
        title: "Discover VistraTV",
        subtitle: "Premium IPTV at Your Fingertips",
        description: "Over 15,000 live channels, movies and series on demand. Compatible with all your devices.",
        cta: "Discover Our Offers",
        features: "No Commitment • HD/4K • 24/7 Support",
      },
      channels: {
        title: "15,000+ Channels Worldwide",
        subtitle: "Sports, Movies, Series, News and more",
      },
      pricing: {
        title: "Choose Your Subscription",
        subtitle: "Choose the plan that suits you",
      },
      devices: {
        title: "Compatible with All Your Devices",
        subtitle: "Watch anywhere, anytime",
      },
      testimonials: {
        title: "They Trust Us",
        subtitle: "Thousands of satisfied customers",
      },
      faq: {
        title: "Frequently Asked Questions",
        subtitle: "Everything you need to know",
      },
    },

    // Subscriptions
    subscriptions: {
      title: "Choose Your Subscription",
      subtitle: "Enjoy VistraTV on all your devices",
      monthly: "Monthly",
      quarterly: "3 Months",
      semiAnnual: "6 Months",
      annual: "Annual",
      perMonth: "/month",
      popular: "Popular",
      bestValue: "Best Value",
      selectPlan: "Select",
      features: {
        channels: "live channels",
        devices: "simultaneous devices",
        quality: "HD/4K Quality",
        vod: "Unlimited VOD",
        support: "24/7 Support",
        updates: "Free Updates",
      },
      guarantee: "7-day money-back guarantee",
      loading: "Loading...",
      noPlans: "No plans available",
      subscribe: "Subscribe",
      perYear: "/year",
    },

    // Checkout
    checkout: {
      title: "Complete Your Order",
      subtitle: "You're one step away from enjoying VistraTV",
      summary: "Summary",
      plan: "Subscription",
      price: "Price",
      total: "Total",
      contactInfo: "Contact Information",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      phone: "Phone",
      whatsapp: "WhatsApp Number",
      whatsappOptional: "Optional - to receive your credentials",
      paymentMethod: "Payment Method",
      payNow: "Pay Now",
      processing: "Processing...",
      secure: "Secure Payment",
      errors: {
        required: "This field is required",
        email: "Invalid email",
        phone: "Invalid phone",
      },
      fillAllFields: "Please fill in all fields",
      selectedPlan: "Selected Plan",
      orderSummary: "Order Summary",
      tax: "Tax",
      securePayment: "100% Secure Payment",
      cancelAnytime: "Cancel Anytime",
      instantAccess: "Instant Access",
    },

    // Payment Success
    paymentSuccess: {
      title: "Payment Successful!",
      subtitle: "Thank you for your trust",
      message: "Your VistraTV subscription has been successfully activated",
      credentials: {
        title: "Your IPTV Credentials",
        description: "You will receive your credentials in a few minutes via:",
        email: "Email sent to",
        whatsapp: "WhatsApp message to",
        info: "The credentials include your username, password, and M3U link to configure your IPTV application.",
      },
      next: {
        title: "Next Steps",
        step1: "Check your email or WhatsApp",
        step2: "Download an IPTV application",
        step3: "Configure with your credentials",
        step4: "Enjoy VistraTV!",
      },
      support: {
        title: "Need Help?",
        description: "Our team is available 24/7 to assist you",
        contact: "Contact Support",
      },
      backHome: "Back to Home",
      verifying: "Verifying payment...",
      pleaseWait: "Please wait while we confirm your payment",
      error: "Error",
      backToPayment: "Back to Payment",
      noTransaction: "No transaction found",
      transactionDetails: "Transaction Details",
      transactionId: "Transaction ID",
      plan: "Plan",
      amount: "Amount",
      duration: "Duration",
      months: "months",
      credentialsArriving: "Your Credentials Are Coming",
      credentialsMessage: "You'll receive your IPTV credentials in a few minutes via email and WhatsApp",
      features: {
        downloadLink: "📥 App download link",
        activationCode: "🔑 Unique activation code",
        installGuide: "📖 Complete installation guide",
        support: "💬 Priority support access",
      },
      tutorialsButton: "View Installation Tutorials",
      notReceived: "Haven't received your credentials?",
      notReceivedMessage: "Contact us on WhatsApp at",
      needHelp: "Need help?",
      or: "or",
      supportPage: "support page",
    },

    // Support
    support: {
      title: "Help Center",
      subtitle: "We're here to help",
      contact: {
        title: "Contact Us",
        description: "Our team responds in less than 2 hours",
        whatsapp: "WhatsApp",
        email: "Email",
        hours: "Available 24/7",
      },
      faq: {
        title: "Frequently Asked Questions",
      },
      ticket: {
        title: "Open a Ticket",
        subject: "Subject",
        message: "Message",
        send: "Send",
        success: "Ticket sent successfully",
      },
      backHome: "Back to Home",
      email: "Email",
      phone: "Phone",
      available: "Available 24/7",
      emailResponse: "Response within 24h",
      instantResponse: "Instant response",
      myTickets: "My Support Tickets",
      newTicket: "New Ticket",
      noTickets: "No tickets yet",
      noTicketsDesc: "Create a ticket to contact our support",
      fullName: "Full name",
      yourName: "Your name",
      yourEmail: "your@email.com",
      summarizeProblem: "Summarize your problem",
      describeProblem: "Describe your problem in detail...",
      createTicket: "Create Ticket",
      submitting: "Submitting...",
      ticketCreated: "Ticket created successfully!",
      ticketNumber: "Number",
      responseTime: "Response time",
      lessThan4Hours: "less than 4 hours",
      confirmationSent: "A confirmation email has been sent to",
      trackTicket: "You can track your ticket below.",
      back: "Back",
      status: {
        open: "Open",
        in_progress: "In Progress",
        resolved: "Resolved",
        closed: "Closed",
      },
      priority: {
        low: "Low",
        medium: "Medium",
        high: "High",
      },
      errors: {
        createTicket: "Error creating ticket",
      },
    },

    // Tutorials
    tutorials: {
      hero: {
        title: "Installation Guides",
        subtitle: "Set up VistraTV on your device in minutes",
      },
      selectDevice: {
        title: "Select Your Device",
        subtitle: "Choose your device to see the installation guide",
      },
      features: {
        stepByStep: "Step by step",
        screenshots: "Screenshots",
        videoGuides: "Video guides",
      },
      devices: {
        smarttv: {
          title: "Smart TV",
          desc: "Samsung, LG, Sony and others",
        },
        androidbox: {
          title: "Android Box",
          desc: "Nvidia Shield, Mi Box, etc.",
        },
        androidphone: {
          title: "Android Phone",
          desc: "All Android smartphones",
        },
        firestick: {
          title: "Amazon Fire Stick",
          desc: "Fire TV Stick and Fire TV Cube",
        },
        appletv: {
          title: "Apple TV",
          desc: "Apple TV 4K and HD",
        },
        iphone: {
          title: "iPhone/iPad",
          desc: "iOS devices",
        },
        mac: {
          title: "Mac",
          desc: "MacBook, iMac, Mac Mini",
        },
        windows: {
          title: "Windows PC",
          desc: "Windows 10 and 11",
        },
        kodi: {
          title: "Kodi",
          desc: "Kodi Media Center",
        },
        chromecast: {
          title: "Chromecast",
          desc: "Chromecast with Google TV",
        },
        playstation: {
          title: "PlayStation",
          desc: "PS4 and PS5",
        },
        xbox: {
          title: "Xbox",
          desc: "Xbox One and Series X/S",
        },
      },
      difficulty: {
        easy: "Easy",
        medium: "Medium",
        hard: "Hard",
      },
      viewGuide: "View Guide",
      needHelp: {
        title: "Need Help?",
        subtitle: "Our team is here to guide you through installation",
        contactSupport: "Contact Support",
        viewFaq: "View FAQ",
      },
    },

    // About
    about: {
      title: "Why Choose VistraTV",
      subtitle: "IPTV excellence at your service",
      description:
        "Enjoy exceptional streaming quality with over 15,000 live channels, 24/7 customer support, and full compatibility with all your devices.",
      cta: "Start Now",
    },
    aboutPage: {
      hero: {
        title: "About VistraTV",
        subtitle: "Your Trusted IPTV Partner",
        description:
          "Since 2018, we've been providing premium streaming experience to thousands of customers worldwide. Our mission is to make entertainment accessible to everyone.",
      },
      mission: {
        title: "Our Mission",
        description:
          "Provide superior IPTV service with the best content selection, exceptional reliability, and unmatched customer support.",
      },
      values: {
        security: {
          title: "Security",
          desc: "Your data and privacy are our top priority",
        },
        performance: {
          title: "Performance",
          desc: "Optimized infrastructure for smooth 24/7 streaming",
        },
        support: {
          title: "Support",
          desc: "Team available to help you anytime",
        },
        quality: {
          title: "Quality",
          desc: "High-definition content, up to 8K",
        },
        global: {
          title: "Global",
          desc: "Service available in over 50 countries",
        },
        passion: {
          title: "Passion",
          desc: "Love for entertainment and customer satisfaction",
        },
      },
      stats: {
        founded: "Founded",
        customers: "Customers",
        channels: "Channels",
        uptime: "Uptime",
      },
      valuesTitle: "Our Values",
      valuesSubtitle: "What defines us",
      cta: {
        title: "Join Us Today",
        subtitle: "Start your journey with VistraTV",
        subscribe: "Subscribe Now",
        contact: "Contact Us",
      },
    },

    // Footer
    footer: {
      description: "Your premium IPTV service",
      links: "Quick Links",
      legal: "Legal",
      contact: "Contact",
      allRightsReserved: "All rights reserved",
    },
    legal: {
      backHome: "Back to Home",
      lastUpdated: "Last updated",
      termsTitle: "Terms of Service",
      privacyTitle: "Privacy Policy",
      acceptance: "Acceptance of Terms",
      serviceDescription: "Service Description",
      userAccount: "User Account",
      subscription: "Subscription and Payment",
      usage: "Acceptable Use",
      termination: "Termination",
      contact: "Contact",
      dataCollection: "Data Collection",
      dataUsage: "Data Usage",
      dataSharing: "Data Sharing",
      cookies: "Cookies",
      security: "Security",
      rights: "Your Rights",
    },

    // Common
    common: {
      loading: "Loading...",
      error: "An error occurred",
      retry: "Retry",
      cancel: "Cancel",
      confirm: "Confirm",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      close: "Close",
      back: "Back",
      next: "Next",
      previous: "Previous",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      viewMore: "View More",
      viewLess: "View Less",
    },

    // Channel Showcase
    channelShowcase: {
      title: "Discover Our Channels",
      channelsCount: "Available Channels",
      categories: {
        sports: "Sports",
        cinema: "Cinema",
        series: "Series",
        documentary: "Documentary",
        news: "News",
        kids: "Kids",
      },
    },

    // Social Proof
    socialProof: {
      title: "Join Thousands of Satisfied Customers",
    },

    // Latest Releases
    latestReleases: {
      title: "Latest Releases",
      subtitle: "Recently added movies and series",
      movie: "Movie",
      series: "Series",
    },

    // Device Compatibility
    deviceCompatibility: {
      title: "Compatible with All Your Devices",
      subtitle: "Watch where you want, when you want",
    },

    // WhatsApp Testimonials
    whatsapp: {
      title: "WhatsApp Testimonials",
      subtitle: "See what our customers say about us on WhatsApp",
      cta: "Contact Us on WhatsApp",
    },

    // Free Trial
    freeTrial: {
      title: "Try Free Without Commitment!",
      description: "Enjoy 24-48h free trial to discover our premium service. No credit card required.",
      duration: "24-48h Free Trial",
      cta: "Start Free Trial",
    },

    // Marketing Components
    marketing: {
      badges: {
        title: "Why Trust Us",
        secure: "100% Secure",
        secureDesc: "SSL encrypted payments",
        privacy: "Privacy",
        privacyDesc: "Protected data",
        payment: "Easy Payment",
        paymentDesc: "Multiple options",
        support: "24/7 Support",
        supportDesc: "Always available",
        quality: "Premium Quality",
        qualityDesc: "HD/4K guaranteed",
        guarantee: "Guarantee",
        guaranteeDesc: "7-day money back",
      },
      guarantee: {
        title: "Money-Back Guarantee",
        subtitle: "Try risk-free for 7 days",
        point1Title: "No Commitment",
        point1Desc: "No contract, cancel anytime",
        point2Title: "Quick Refund",
        point2Desc: "Money back within 48h",
        point3Title: "100% Guaranteed",
        point3Desc: "No questions asked",
        description: "If you're not satisfied within the first 7 days, we'll refund you completely.",
        cta: "Start Now",
        terms: "Terms and conditions apply",
      },
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
    },

    // Cookie Consent
    cookieConsent: {
      message: "We use cookies to improve your experience. By continuing, you accept our use of cookies.",
      accept: "Accept",
      decline: "Decline",
    },

    // Content
    content: {
      allMovies: "All Movies",
    },

    // Devices
    devices: {
      title: "Devices",
    },

    // FAQ
    faq: {
      title: "FAQ",
    },

    // Browse
    browse: {
      channelsTitle: "Browse Channels",
      channelsSubtitle: "Explore our complete collection of channels from around the world",
      contentTitle: "Browse Content",
      contentSubtitle: "Discover thousands of movies and series",
      searchPlaceholder: "Search...",
      allCategories: "All Categories",
      allGenres: "All Genres",
      resultsCount: "{count} result(s)",
      watch: "Watch",
      noResults: "No results found",
      all: "All",
      movies: "Movies",
      series: "Series",
      genres: {
        action: "Action",
        comedy: "Comedy",
        drama: "Drama",
        thriller: "Thriller",
        scifi: "Sci-Fi",
        romance: "Romance",
        horror: "Horror",
        documentary: "Documentary",
      },
    },

    // How It Works
    howItWorks: {
      hero: {
        title: "How It Works",
        subtitle: "Enjoy VistraTV in 4 simple steps",
      },
      steps: {
        step1: {
          title: "Choose Your Plan",
          desc: "Select the subscription that best fits your needs",
        },
        step2: {
          title: "Pay Securely",
          desc: "Make your payment through our secure system",
        },
        step3: {
          title: "Receive Your Credentials",
          desc: "Get your access codes by email and WhatsApp",
        },
        step4: {
          title: "Enjoy Content",
          desc: "Set up your app and start watching",
        },
      },
      featuresTitle: "What's Included",
      featuresSubtitle: "Everything you need for a perfect experience",
      features: {
        feature1: "Unlimited access to all channels",
        feature2: "HD, 4K and 8K quality available",
        feature3: "Compatible with all devices",
        feature4: "Automatic content updates",
        feature5: "24/7 technical support",
        feature6: "No intrusive ads",
      },
      videoTitle: "Video Tutorial",
      videoSubtitle: "Follow our step-by-step video guide",
      watchTutorial: "Watch Tutorial",
      faq: {
        title: "Frequently Asked Questions",
        subtitle: "Have questions? Check our FAQ",
        cta: "View FAQ",
      },
      cta: {
        title: "Ready to Start?",
        subtitle: "Join thousands of satisfied customers",
        start: "Start Now",
        viewPlans: "View Plans",
      },
    },
  },

  es: {
    // Navigation
    nav: {
      home: "Inicio",
      offers: "Ofertas",
      presentation: "Presentación",
      tutorials: "Tutoriales",
      contact: "Contacto",
      subscribe: "Suscribirse",
      myAccount: "Mi Cuenta",
      logout: "Cerrar Sesión",
      channels: "Canales",
      content: "Contenido",
      support: "Soporte",
      howItWorks: "Cómo Funciona",
      about: "Acerca de",
      terms: "Términos",
      privacy: "Privacidad",
    },

    // Home Page
    home: {
      hero: {
        title: "Descubre VistraTV",
        subtitle: "IPTV Premium al Alcance de tu Mano",
        description:
          "Más de 15,000 canales en vivo, películas y series a la carta. Compatible con todos tus dispositivos.",
        cta: "Descubrir Nuestras Ofertas",
        features: "Sin Compromiso • HD/4K • Soporte 24/7",
      },
      channels: {
        title: "15,000+ Canales de Todo el Mundo",
        subtitle: "Deportes, Películas, Series, Noticias y más",
      },
      pricing: {
        title: "Elige Tu Suscripción",
        subtitle: "Elige el plan que te convenga",
      },
      devices: {
        title: "Compatible con Todos tus Dispositivos",
        subtitle: "Mira donde quieras, cuando quieras",
      },
      testimonials: {
        title: "Confían en Nosotros",
        subtitle: "Miles de clientes satisfechos",
      },
      faq: {
        title: "Preguntas Frecuentes",
        subtitle: "Todo lo que necesitas saber",
      },
    },

    // Subscriptions
    subscriptions: {
      title: "Elige tu Suscripción",
      subtitle: "Disfruta de VistraTV en todos tus dispositivos",
      monthly: "Mensual",
      quarterly: "3 Meses",
      semiAnnual: "6 Meses",
      annual: "Anual",
      perMonth: "/mes",
      popular: "Popular",
      bestValue: "Mejor Oferta",
      selectPlan: "Seleccionar",
      features: {
        channels: "canales en vivo",
        devices: "dispositivos simultáneos",
        quality: "Calidad HD/4K",
        vod: "VOD ilimitado",
        support: "Soporte 24/7",
        updates: "Actualizaciones gratuitas",
      },
      guarantee: "Garantía de devolución de dinero de 7 días",
      loading: "Cargando...",
      noPlans: "Sin planes disponibles",
      subscribe: "Suscribirse",
      perYear: "/año",
    },

    // Checkout
    checkout: {
      title: "Finalizar tu Pedido",
      subtitle: "Estás a un paso de disfrutar de VistraTV",
      summary: "Resumen",
      plan: "Suscripción",
      price: "Precio",
      total: "Total",
      contactInfo: "Información de Contacto",
      firstName: "Nombre",
      lastName: "Apellido",
      email: "Email",
      phone: "Teléfono",
      whatsapp: "Número de WhatsApp",
      whatsappOptional: "Opcional - para recibir tus credenciales",
      paymentMethod: "Método de Pago",
      payNow: "Pagar Ahora",
      processing: "Procesando...",
      secure: "Pago Seguro",
      errors: {
        required: "Este campo es obligatorio",
        email: "Email inválido",
        phone: "Teléfono inválido",
      },
      fillAllFields: "Por favor completa todos los campos",
      selectedPlan: "Plan Seleccionado",
      orderSummary: "Resumen del Pedido",
      tax: "Impuesto",
      securePayment: "Pago 100% Seguro",
      cancelAnytime: "Cancela en Cualquier Momento",
      instantAccess: "Acceso Instantáneo",
    },

    // Payment Success
    paymentSuccess: {
      title: "¡Pago Exitoso!",
      subtitle: "Gracias por tu confianza",
      message: "Tu suscripción a VistraTV ha sido activada con éxito",
      credentials: {
        title: "Tus Credenciales IPTV",
        description: "Recibirás tus credenciales en unos minutos por:",
        email: "Email enviado a",
        whatsapp: "Mensaje de WhatsApp a",
        info: "Las credenciales incluyen tu nombre de usuario, contraseña y el enlace M3U para configurar tu aplicación IPTV.",
      },
      next: {
        title: "Próximos Pasos",
        step1: "Consulta tu email o WhatsApp",
        step2: "Descarga una aplicación IPTV",
        step3: "Configura con tus credenciales",
        step4: "¡Disfruta de VistraTV!",
      },
      support: {
        title: "¿Necesitas Ayuda?",
        description: "Nuestro equipo está disponible 24/7 para asistirte",
        contact: "Contactar Soporte",
      },
      backHome: "Volver al Inicio",
      verifying: "Verificando pago...",
      pleaseWait: "Por favor espera mientras confirmamos tu pago",
      error: "Error",
      backToPayment: "Volver al Pago",
      noTransaction: "No se encontró transacción",
      transactionDetails: "Detalles de la Transacción",
      transactionId: "ID de Transacción",
      plan: "Plan",
      amount: "Monto",
      duration: "Duración",
      months: "meses",
      credentialsArriving: "Tus Credenciales Están Llegando",
      credentialsMessage: "Recibirás tus credenciales IPTV en unos minutos por email y WhatsApp",
      features: {
        downloadLink: "📥 Enlace de descarga de la app",
        activationCode: "🔑 Código de activación único",
        installGuide: "📖 Guía de instalación completa",
        support: "💬 Acceso a soporte prioritario",
      },
      tutorialsButton: "Ver Tutoriales de Instalación",
      notReceived: "¿No recibiste tus credenciales?",
      notReceivedMessage: "Contáctanos por WhatsApp al",
      needHelp: "¿Necesitas ayuda?",
      or: "o",
      supportPage: "página de soporte",
    },

    // Support
    support: {
      title: "Centro de Ayuda",
      subtitle: "Estamos aquí para ayudarte",
      contact: {
        title: "Contáctanos",
        description: "Nuestro equipo responde en menos de 2 horas",
        whatsapp: "WhatsApp",
        email: "Email",
        hours: "Disponible 24/7",
      },
      faq: {
        title: "Preguntas Frecuentes",
      },
      ticket: {
        title: "Abrir un Ticket",
        subject: "Asunto",
        message: "Mensaje",
        send: "Enviar",
        success: "Ticket enviado con éxito",
      },
      backHome: "Volver al Inicio",
      email: "Email",
      phone: "Teléfono",
      available: "Disponible 24/7",
      emailResponse: "Respuesta en 24h",
      instantResponse: "Respuesta instantánea",
      myTickets: "Mis Tickets de Soporte",
      newTicket: "Nuevo Ticket",
      noTickets: "Sin tickets aún",
      noTicketsDesc: "Crea un ticket para contactar a nuestro soporte",
      fullName: "Nombre completo",
      yourName: "Tu nombre",
      yourEmail: "tu@email.com",
      summarizeProblem: "Resume tu problema",
      describeProblem: "Describe tu problema en detalle...",
      createTicket: "Crear Ticket",
      submitting: "Enviando...",
      ticketCreated: "¡Ticket creado con éxito!",
      ticketNumber: "Número",
      responseTime: "Tiempo de respuesta",
      lessThan4Hours: "menos de 4 horas",
      confirmationSent: "Un email de confirmación ha sido enviado a",
      trackTicket: "Puedes seguir tu ticket a continuación.",
      back: "Atrás",
      status: {
        open: "Abierto",
        in_progress: "En Progreso",
        resolved: "Resuelto",
        closed: "Cerrado",
      },
      priority: {
        low: "Baja",
        medium: "Media",
        high: "Alta",
      },
      errors: {
        createTicket: "Error al crear el ticket",
      },
    },

    // Tutorials
    tutorials: {
      hero: {
        title: "Guías de Instalación",
        subtitle: "Configura VistraTV en tu dispositivo en minutos",
      },
      selectDevice: {
        title: "Selecciona Tu Dispositivo",
        subtitle: "Elige tu dispositivo para ver la guía de instalación",
      },
      features: {
        stepByStep: "Paso a paso",
        screenshots: "Capturas de pantalla",
        videoGuides: "Guías en video",
      },
      devices: {
        smarttv: { title: "Smart TV", desc: "Samsung, LG, Sony y otros" },
        androidbox: { title: "Box Android", desc: "Nvidia Shield, Mi Box, etc." },
        androidphone: { title: "Teléfono Android", desc: "Todos los smartphones Android" },
        firestick: { title: "Amazon Fire Stick", desc: "Fire TV Stick y Fire TV Cube" },
        appletv: { title: "Apple TV", desc: "Apple TV 4K y HD" },
        iphone: { title: "iPhone/iPad", desc: "Dispositivos iOS" },
        mac: { title: "Mac", desc: "MacBook, iMac, Mac Mini" },
        windows: { title: "Windows PC", desc: "Windows 10 y 11" },
        kodi: { title: "Kodi", desc: "Centro Multimedia Kodi" },
        chromecast: { title: "Chromecast", desc: "Chromecast con Google TV" },
        playstation: { title: "PlayStation", desc: "PS4 y PS5" },
        xbox: { title: "Xbox", desc: "Xbox One y Series X/S" },
      },
      difficulty: { easy: "Fácil", medium: "Medio", hard: "Difícil" },
      viewGuide: "Ver Guía",
      needHelp: {
        title: "¿Necesitas Ayuda?",
        subtitle: "Nuestro equipo está aquí para guiarte en la instalación",
        contactSupport: "Contactar Soporte",
        viewFaq: "Ver FAQ",
      },
    },

    // About
    about: {
      title: "Por Qué Elegir VistraTV",
      subtitle: "Excelencia IPTV a tu servicio",
      description:
        "Disfruta de una calidad de transmisión excepcional con más de 15,000 canales en vivo, soporte al cliente 24/7 y compatibilidad total con todos tus dispositivos.",
      cta: "Comenzar Ahora",
    },
    aboutPage: {
      hero: {
        title: "Acerca de VistraTV",
        subtitle: "Tu Socio IPTV de Confianza",
        description:
          "Desde 2018, hemos estado proporcionando una experiencia de streaming premium a miles de clientes en todo el mundo.",
      },
      mission: {
        title: "Nuestra Misión",
        description:
          "Proporcionar un servicio IPTV superior con la mejor selección de contenido, fiabilidad excepcional y soporte al cliente inigualable.",
      },
      values: {
        security: { title: "Seguridad", desc: "Tus datos y privacidad son nuestra máxima prioridad" },
        performance: {
          title: "Rendimiento",
          desc: "Infraestructura optimizada para streaming fluido 24/7",
        },
        support: { title: "Soporte", desc: "Equipo disponible para ayudarte en cualquier momento" },
        quality: { title: "Calidad", desc: "Contenido en alta definición, hasta 8K" },
        global: { title: "Global", desc: "Servicio disponible en más de 50 países" },
        passion: { title: "Pasión", desc: "Amor por el entretenimiento y satisfacción del cliente" },
      },
      stats: { founded: "Fundado", customers: "Clientes", channels: "Canales", uptime: "Disponibilidad" },
      valuesTitle: "Nuestros Valores",
      valuesSubtitle: "Lo que nos define",
      cta: {
        title: "Únete Hoy",
        subtitle: "Comienza tu viaje con VistraTV",
        subscribe: "Suscríbete Ahora",
        contact: "Contáctanos",
      },
    },

    // Footer
    footer: {
      description: "Tu servicio IPTV premium",
      links: "Enlaces Rápidos",
      legal: "Legal",
      contact: "Contacto",
      allRightsReserved: "Todos los derechos reservados",
    },
    legal: {
      backHome: "Volver al Inicio",
      lastUpdated: "Última actualización",
      termsTitle: "Términos de Servicio",
      privacyTitle: "Política de Privacidad",
      acceptance: "Aceptación de Términos",
      serviceDescription: "Descripción del Servicio",
      userAccount: "Cuenta de Usuario",
      subscription: "Suscripción y Pago",
      usage: "Uso Aceptable",
      termination: "Terminación",
      contact: "Contacto",
      dataCollection: "Recopilación de Datos",
      dataUsage: "Uso de Datos",
      dataSharing: "Compartir Datos",
      cookies: "Cookies",
      security: "Seguridad",
      rights: "Tus Derechos",
    },

    // Common
    common: {
      loading: "Cargando...",
      error: "Ocurrió un error",
      retry: "Reintentar",
      cancel: "Cancelar",
      confirm: "Confirmar",
      save: "Guardar",
      delete: "Eliminar",
      edit: "Editar",
      close: "Cerrar",
      back: "Atrás",
      next: "Siguiente",
      previous: "Anterior",
      search: "Buscar",
      filter: "Filtrar",
      sort: "Ordenar",
      viewMore: "Ver Más",
      viewLess: "Ver Menos",
    },

    // Channel Showcase
    channelShowcase: {
      title: "Descubre Nuestros Canales",
      channelsCount: "Canales Disponibles",
      categories: {
        sports: "Deportes",
        cinema: "Cine",
        series: "Series",
        documentary: "Documental",
        news: "Noticias",
        kids: "Niños",
      },
    },

    // Social Proof
    socialProof: {
      title: "Únete a Miles de Clientes Satisfechos",
    },

    // Latest Releases
    latestReleases: {
      title: "Últimos Lanzamientos",
      subtitle: "Películas y series recientemente agregadas",
      movie: "Película",
      series: "Serie",
    },

    // Device Compatibility
    deviceCompatibility: {
      title: "Compatible con Todos Tus Dispositivos",
      subtitle: "Mira donde quieras, cuando quieras",
    },

    // WhatsApp Testimonials
    whatsapp: {
      title: "Testimonios de WhatsApp",
      subtitle: "Mira lo que nuestros clientes dicen de nosotros en WhatsApp",
      cta: "Contáctanos en WhatsApp",
    },

    // Free Trial
    freeTrial: {
      title: "¡Prueba Gratis Sin Compromiso!",
      description:
        "Disfruta de 24-48h de prueba gratuita para descubrir nuestro servicio premium. Sin tarjeta de crédito.",
      duration: "Prueba Gratuita 24-48h",
      cta: "Comenzar Prueba Gratuita",
    },

    // Marketing Components
    marketing: {
      badges: {
        title: "Por Qué Confiar en Nosotros",
        secure: "100% Seguro",
        secureDesc: "Pagos encriptados SSL",
        privacy: "Privacidad",
        privacyDesc: "Datos protegidos",
        payment: "Pago Fácil",
        paymentDesc: "Múltiples opciones",
        support: "Soporte 24/7",
        supportDesc: "Siempre disponible",
        quality: "Calidad Premium",
        qualityDesc: "HD/4K garantizado",
        guarantee: "Garantía",
        guaranteeDesc: "7 días de devolución",
      },
      guarantee: {
        title: "Garantía de Devolución de Dinero",
        subtitle: "Prueba sin riesgo durante 7 días",
        point1Title: "Sin Compromiso",
        point1Desc: "Sin contrato, cancela cuando quieras",
        point2Title: "Reembolso Rápido",
        point2Desc: "Dinero devuelto en 48h",
        point3Title: "100% Garantizado",
        point3Desc: "Sin preguntas",
        description: "Si no estás satisfecho en los primeros 7 días, te reembolsaremos completamente.",
        cta: "Comenzar Ahora",
        terms: "Se aplican términos y condiciones",
      },
      hours: "Horas",
      minutes: "Minutos",
      seconds: "Segundos",
    },

    // Cookie Consent
    cookieConsent: {
      message: "Usamos cookies para mejorar tu experiencia. Al continuar, aceptas nuestro uso de cookies.",
      accept: "Aceptar",
      decline: "Rechazar",
    },

    // Content
    content: {
      allMovies: "Todas las Películas",
    },

    // Devices
    devices: {
      title: "Dispositivos",
    },

    // FAQ
    faq: {
      title: "FAQ",
    },

    // Browse
    browse: {
      channelsTitle: "Explorar Canales",
      channelsSubtitle: "Explora nuestra colección completa de canales de todo el mundo",
      contentTitle: "Explorar Contenido",
      contentSubtitle: "Descubre miles de películas y series",
      searchPlaceholder: "Buscar...",
      allCategories: "Todas las Categorías",
      allGenres: "Todos los Géneros",
      resultsCount: "{count} resultado(s)",
      watch: "Ver",
      noResults: "No se encontraron resultados",
      all: "Todo",
      movies: "Películas",
      series: "Series",
      genres: {
        action: "Acción",
        comedy: "Comedia",
        drama: "Drama",
        thriller: "Thriller",
        scifi: "Ciencia Ficción",
        romance: "Romance",
        horror: "Terror",
        documentary: "Documental",
      },
    },

    // How It Works
    howItWorks: {
      hero: {
        title: "Cómo Funciona",
        subtitle: "Disfruta de VistraTV en 4 pasos simples",
      },
      steps: {
        step1: { title: "Elige Tu Plan", desc: "Selecciona la suscripción que mejor se adapte a tus necesidades" },
        step2: { title: "Paga de Forma Segura", desc: "Realiza tu pago a través de nuestro sistema seguro" },
        step3: {
          title: "Recibe Tus Credenciales",
          desc: "Obtén tus códigos de acceso por email y WhatsApp",
        },
        step4: { title: "Disfruta del Contenido", desc: "Configura tu aplicación y comienza a ver" },
      },
      featuresTitle: "Qué Incluye",
      featuresSubtitle: "Todo lo que necesitas para una experiencia perfecta",
      features: {
        feature1: "Acceso ilimitado a todos los canales",
        feature2: "Calidad HD, 4K y 8K disponible",
        feature3: "Compatible con todos los dispositivos",
        feature4: "Actualizaciones automáticas de contenido",
        feature5: "Soporte técnico 24/7",
        feature6: "Sin anuncios intrusivos",
      },
      videoTitle: "Tutorial en Video",
      videoSubtitle: "Sigue nuestra guía en video paso a paso",
      watchTutorial: "Ver Tutorial",
      faq: {
        title: "Preguntas Frecuentes",
        subtitle: "¿Tienes preguntas? Consulta nuestra FAQ",
        cta: "Ver FAQ",
      },
      cta: {
        title: "¿Listo para Comenzar?",
        subtitle: "Únete a miles de clientes satisfechos",
        start: "Comenzar Ahora",
        viewPlans: "Ver Planes",
      },
    },
  },

  it: {
    // Navigation
    nav: {
      home: "Home",
      offers: "Offerte",
      presentation: "Presentazione",
      tutorials: "Tutorial",
      contact: "Contatto",
      subscribe: "Iscriviti",
      myAccount: "Il Mio Account",
      logout: "Esci",
      channels: "Canali",
      content: "Contenuti",
      support: "Supporto",
      howItWorks: "Come Funziona",
      about: "Chi Siamo",
      terms: "Termini",
      privacy: "Privacy",
    },

    // Home Page
    home: {
      hero: {
        title: "Scopri VistraTV",
        subtitle: "IPTV Premium a Portata di Mano",
        description:
          "Oltre 15.000 canali in diretta, film e serie on demand. Compatibile con tutti i tuoi dispositivi.",
        cta: "Scopri le Nostre Offerte",
        features: "Senza Impegno • HD/4K • Supporto 24/7",
      },
      channels: {
        title: "15.000+ Canali da Tutto il Mondo",
        subtitle: "Sport, Film, Serie, Notizie e altro",
      },
      pricing: {
        title: "Scegli il Tuo Abbonamento",
        subtitle: "Scegli il piano che fa per te",
      },
      devices: {
        title: "Compatibile con Tutti i Tuoi Dispositivi",
        subtitle: "Guarda dove vuoi, quando vuoi",
      },
      testimonials: {
        title: "Si Fidano di Noi",
        subtitle: "Migliaia di clienti soddisfatti",
      },
      faq: {
        title: "Domande Frequenti",
        subtitle: "Tutto quello che devi sapere",
      },
    },

    // Subscriptions
    subscriptions: {
      title: "Scegli il Tuo Abbonamento",
      subtitle: "Goditi VistraTV su tutti i tuoi dispositivi",
      monthly: "Mensile",
      quarterly: "3 Mesi",
      semiAnnual: "6 Mesi",
      annual: "Annuale",
      perMonth: "/mese",
      popular: "Popolare",
      bestValue: "Miglior Offerta",
      selectPlan: "Seleziona",
      features: {
        channels: "canali in diretta",
        devices: "dispositivi simultanei",
        quality: "Qualità HD/4K",
        vod: "VOD illimitato",
        support: "Supporto 24/7",
        updates: "Aggiornamenti gratuiti",
      },
      guarantee: "Garanzia di rimborso di 7 giorni",
      loading: "Caricamento...",
      noPlans: "Nessun piano disponibile",
      subscribe: "Iscriviti",
      perYear: "/anno",
    },

    // Checkout
    checkout: {
      title: "Completa il Tuo Ordine",
      subtitle: "Sei a un passo dal goderti VistraTV",
      summary: "Riepilogo",
      plan: "Abbonamento",
      price: "Prezzo",
      total: "Totale",
      contactInfo: "Informazioni di Contatto",
      firstName: "Nome",
      lastName: "Cognome",
      email: "Email",
      phone: "Telefono",
      whatsapp: "Numero WhatsApp",
      whatsappOptional: "Opzionale - per ricevere le tue credenziali",
      paymentMethod: "Metodo di Pagamento",
      payNow: "Paga Ora",
      processing: "Elaborazione...",
      secure: "Pagamento Sicuro",
      errors: {
        required: "Questo campo è obbligatorio",
        email: "Email non valida",
        phone: "Telefono non valido",
      },
      fillAllFields: "Compila tutti i campi",
      selectedPlan: "Piano Selezionato",
      orderSummary: "Riepilogo Ordine",
      tax: "IVA",
      securePayment: "Pagamento 100% Sicuro",
      cancelAnytime: "Annulla in Qualsiasi Momento",
      instantAccess: "Accesso Istantaneo",
    },

    // Payment Success
    paymentSuccess: {
      title: "Pagamento Riuscito!",
      subtitle: "Grazie per la tua fiducia",
      message: "Il tuo abbonamento a VistraTV è stato attivato con successo",
      credentials: {
        title: "Le Tue Credenziali IPTV",
        description: "Riceverai le tue credenziali tra pochi minuti tramite:",
        email: "Email inviata a",
        whatsapp: "Messaggio WhatsApp a",
        info: "Le credenziali includono il tuo nome utente, password e il link M3U per configurare la tua applicazione IPTV.",
      },
      next: {
        title: "Prossimi Passi",
        step1: "Controlla la tua email o WhatsApp",
        step2: "Scarica un'applicazione IPTV",
        step3: "Configura con le tue credenziali",
        step4: "Goditi VistraTV!",
      },
      support: {
        title: "Hai Bisogno di Aiuto?",
        description: "Il nostro team è disponibile 24/7 per assisterti",
        contact: "Contatta il Supporto",
      },
      backHome: "Torna alla Home",
      verifying: "Verifica in corso del pagamento...",
      pleaseWait: "Attendi mentre confermiamo il tuo pagamento",
      error: "Errore",
      backToPayment: "Torna al Pagamento",
      noTransaction: "Nessuna transazione trovata",
      transactionDetails: "Dettagli della Transazione",
      transactionId: "ID Transazione",
      plan: "Piano",
      amount: "Importo",
      duration: "Durata",
      months: "mesi",
      credentialsArriving: "Le tue credenziali stanno arrivando",
      credentialsMessage: "Riceverai le tue credenziali IPTV tra pochi minuti via email e WhatsApp",
      features: {
        downloadLink: "📥 Link per il download dell'app",
        activationCode: "🔑 Codice di attivazione unico",
        installGuide: "📖 Guida completa all'installazione",
        support: "💬 Accesso al supporto prioritario",
      },
      tutorialsButton: "Guarda i Tutorial di Installazione",
      notReceived: "Non hai ricevuto le tue credenziali?",
      notReceivedMessage: "Contattaci su WhatsApp al numero",
      needHelp: "Hai bisogno di aiuto?",
      or: "o",
      supportPage: "pagina di supporto",
    },

    // Support
    support: {
      title: "Centro Assistenza",
      subtitle: "Siamo qui per aiutarti",
      contact: {
        title: "Contattaci",
        description: "Il nostro team risponde in meno di 2 ore",
        whatsapp: "WhatsApp",
        email: "Email",
        hours: "Disponibile 24/7",
      },
      faq: {
        title: "Domande Frequenti",
      },
      ticket: {
        title: "Apri un Ticket",
        subject: "Oggetto",
        message: "Messaggio",
        send: "Invia",
        success: "Ticket inviato con successo",
      },
      backHome: "Torna alla Home",
      email: "Email",
      phone: "Telefono",
      available: "Disponibile 24/7",
      emailResponse: "Risposta entro 24 ore",
      instantResponse: "Risposta istantanea",
      myTickets: "I Miei Ticket di Supporto",
      newTicket: "Nuovo Ticket",
      noTickets: "Nessun ticket al momento",
      noTicketsDesc: "Crea un ticket per contattare il nostro supporto",
      fullName: "Nome completo",
      yourName: "Il tuo nome",
      yourEmail: "tua@email.com",
      summarizeProblem: "Riassumi il tuo problema",
      describeProblem: "Descrivi il tuo problema in dettaglio...",
      createTicket: "Crea Ticket",
      submitting: "Invio in corso...",
      ticketCreated: "Ticket creato con successo!",
      ticketNumber: "Numero",
      responseTime: "Tempo di risposta",
      lessThan4Hours: "meno di 4 ore",
      confirmationSent: "Un'email di conferma è stata inviata a",
      trackTicket: "Puoi seguire il tuo ticket qui sotto.",
      back: "Indietro",
      status: {
        open: "Aperto",
        in_progress: "In Corso",
        resolved: "Risolto",
        closed: "Chiuso",
      },
      priority: {
        low: "Bassa",
        medium: "Media",
        high: "Alta",
      },
      errors: {
        createTicket: "Errore durante la creazione del ticket",
      },
    },

    // Tutorials
    tutorials: {
      hero: {
        title: "Guide di Installazione",
        subtitle: "Configura VistraTV sul tuo dispositivo in pochi minuti",
      },
      selectDevice: {
        title: "Seleziona il Tuo Dispositivo",
        subtitle: "Scegli il tuo dispositivo per vedere la guida all'installazione",
      },
      features: {
        stepByStep: "Passo dopo passo",
        screenshots: "Screenshot",
        videoGuides: "Guide video",
      },
      devices: {
        smarttv: {
          title: "Smart TV",
          desc: "Samsung, LG, Sony e altri",
        },
        androidbox: {
          title: "Box Android",
          desc: "Nvidia Shield, Mi Box, ecc.",
        },
        androidphone: {
          title: "Telefono Android",
          desc: "Tutti gli smartphone Android",
        },
        firestick: {
          title: "Amazon Fire Stick",
          desc: "Fire TV Stick e Fire TV Cube",
        },
        appletv: {
          title: "Apple TV",
          desc: "Apple TV 4K e HD",
        },
        iphone: {
          title: "iPhone/iPad",
          desc: "Dispositivi iOS",
        },
        mac: {
          title: "Mac",
          desc: "MacBook, iMac, Mac Mini",
        },
        windows: {
          title: "PC Windows",
          desc: "Windows 10 e 11",
        },
        kodi: {
          title: "Kodi",
          desc: "Media Center Kodi",
        },
        chromecast: {
          title: "Chromecast",
          desc: "Chromecast con Google TV",
        },
        playstation: {
          title: "PlayStation",
          desc: "PS4 e PS5",
        },
        xbox: {
          title: "Xbox",
          desc: "Xbox One e Series X/S",
        },
      },
      difficulty: {
        easy: "Facile",
        medium: "Medio",
        hard: "Difficile",
      },
      viewGuide: "Vedi Guida",
      needHelp: {
        title: "Hai Bisogno di Aiuto?",
        subtitle: "Il nostro team è qui per guidarti nell'installazione",
        contactSupport: "Contatta il Supporto",
        viewFaq: "Vedi la FAQ",
      },
    },

    // About
    about: {
      title: "Perché Scegliere VistraTV",
      subtitle: "Eccellenza IPTV al tuo servizio",
      description:
        "Goditi una qualità di streaming eccezionale con oltre 15.000 canali in diretta, supporto clienti 24/7 e piena compatibilità con tutti i tuoi dispositivi.",
      cta: "Inizia Ora",
    },
    aboutPage: {
      hero: {
        title: "A Proposito di VistraTV",
        subtitle: "Il Tuo Partner IPTV di Fiducia",
        description:
          "Dal 2018, offriamo un'esperienza di streaming premium a migliaia di clienti in tutto il mondo. La nostra missione è rendere l'intrattenimento accessibile a tutti.",
      },
      mission: {
        title: "La Nostra Missione",
        description:
          "Fornire un servizio IPTV di alta qualità con la migliore selezione di contenuti, affidabilità eccezionale e supporto clienti impareggiabile.",
      },
      values: {
        security: {
          title: "Sicurezza",
          desc: "I tuoi dati e la tua privacy sono la nostra massima priorità",
        },
        performance: {
          title: "Prestazioni",
          desc: "Infrastruttura ottimizzata per streaming fluido 24/7",
        },
        support: {
          title: "Supporto",
          desc: "Team disponibile per aiutarti in qualsiasi momento",
        },
        quality: {
          title: "Qualità",
          desc: "Contenuti ad alta definizione, fino a 8K",
        },
        global: {
          title: "Globale",
          desc: "Servizio disponibile in oltre 50 paesi",
        },
        passion: {
          title: "Passione",
          desc: "Amore per l'intrattenimento e la soddisfazione del cliente",
        },
      },
      stats: {
        founded: "Fondato",
        customers: "Clienti",
        channels: "Canali",
        uptime: "Disponibilità",
      },
      valuesTitle: "I Nostri Valori",
      valuesSubtitle: "Cosa ci definisce",
      cta: {
        title: "Unisciti a Noi Oggi",
        subtitle: "Inizia il tuo viaggio con VistraTV",
        subscribe: "Iscriviti Ora",
        contact: "Contattaci",
      },
    },

    // Footer
    footer: {
      description: "Il tuo servizio IPTV premium",
      links: "Link Veloci",
      legal: "Legale",
      contact: "Contatto",
      allRightsReserved: "Tutti i diritti riservati",
    },
    legal: {
      backHome: "Torna alla Home",
      lastUpdated: "Ultimo aggiornamento",
      termsTitle: "Termini di Servizio",
      privacyTitle: "Informativa sulla Privacy",
      acceptance: "Accettazione dei Termini",
      serviceDescription: "Descrizione del Servizio",
      userAccount: "Account Utente",
      subscription: "Abbonamento e Pagamento",
      usage: "Uso Accettabile",
      termination: "Risoluzione",
      contact: "Contatto",
      dataCollection: "Raccolta Dati",
      dataUsage: "Utilizzo dei Dati",
      dataSharing: "Condivisione dei Dati",
      cookies: "Cookie",
      security: "Sicurezza",
      rights: "I Tuoi Diritti",
    },

    // Common
    common: {
      loading: "Caricamento...",
      error: "Si è verificato un errore",
      retry: "Riprova",
      cancel: "Annulla",
      confirm: "Conferma",
      save: "Salva",
      delete: "Elimina",
      edit: "Modifica",
      close: "Chiudi",
      back: "Indietro",
      next: "Successivo",
      previous: "Precedente",
      search: "Cerca",
      filter: "Filtra",
      sort: "Ordina",
      viewMore: "Vedi Altro",
      viewLess: "Vedi Meno",
    },

    // Channel Showcase
    channelShowcase: {
      title: "Scopri i Nostri Canali",
      channelsCount: "Canali Disponibili",
      categories: {
        sports: "Sport",
        cinema: "Cinema",
        series: "Serie",
        documentary: "Documentari",
        news: "Notizie",
        kids: "Bambini",
      },
    },

    // Social Proof
    socialProof: {
      title: "Unisciti a Migliaia di Clienti Soddisfatti",
    },

    // Latest Releases
    latestReleases: {
      title: "Ultime Uscite",
      subtitle: "Film e serie aggiunti di recente",
      movie: "Film",
      series: "Serie",
    },

    // Device Compatibility
    deviceCompatibility: {
      title: "Compatibile con Tutti i Tuoi Dispositivi",
      subtitle: "Guarda dove vuoi, quando vuoi",
    },

    // WhatsApp Testimonials
    whatsapp: {
      title: "Testimonianze WhatsApp",
      subtitle: "Scopri cosa dicono i nostri clienti di noi su WhatsApp",
      cta: "Contattaci su WhatsApp",
    },

    // Free Trial
    freeTrial: {
      title: "Prova Gratis Senza Impegno!",
      description:
        "Goditi 24-48h di prova gratuita per scoprire il nostro servizio premium. Nessuna carta di credito richiesta.",
      duration: "Prova Gratuita 24-48h",
      cta: "Inizia Prova Gratuita",
    },

    // Marketing Components
    marketing: {
      badges: {
        title: "Perché Fidarsi di Noi",
        secure: "100% Sicuro",
        secureDesc: "Pagamenti crittografati SSL",
        privacy: "Privacy",
        privacyDesc: "Dati protetti",
        payment: "Pagamento Facile",
        paymentDesc: "Opzioni multiple",
        support: "Supporto 24/7",
        supportDesc: "Sempre disponibile",
        quality: "Qualità Premium",
        qualityDesc: "HD/4K garantito",
        guarantee: "Garanzia",
        guaranteeDesc: "Rimborso entro 7 giorni",
      },
      guarantee: {
        title: "Garanzia Soddisfatti o Rimborsati",
        subtitle: "Prova senza rischi per 7 giorni",
        point1Title: "Senza Impegno",
        point1Desc: "Nessun contratto, annulla quando vuoi",
        point2Title: "Rimborso Veloce",
        point2Desc: "Soldi restituiti entro 48h",
        point3Title: "100% Garantito",
        point3Desc: "Nessuna domanda",
        description: "Se non sei soddisfatto entro i primi 7 giorni, ti rimborseremo completamente.",
        cta: "Inizia Ora",
        terms: "Si applicano termini e condizioni",
      },
      hours: "Ore",
      minutes: "Minuti",
      seconds: "Secondi",
    },

    // Cookie Consent
    cookieConsent: {
      message: "Utilizziamo cookie per migliorare la tua esperienza. Continuando, accetti il nostro uso dei cookie.",
      accept: "Accetta",
      decline: "Rifiuta",
    },

    // Content
    content: {
      allMovies: "Tutti i Film",
    },

    // Devices
    devices: {
      title: "Dispositivi",
    },

    // FAQ
    faq: {
      title: "FAQ",
    },

    // Browse
    browse: {
      channelsTitle: "Esplora Canali",
      channelsSubtitle: "Esplora la nostra collezione completa di canali da tutto il mondo",
      contentTitle: "Esplora Contenuti",
      contentSubtitle: "Scopri migliaia di film e serie",
      searchPlaceholder: "Cerca...",
      allCategories: "Tutte le Categorie",
      allGenres: "Tutti i Generi",
      resultsCount: "{count} risultato(i)",
      watch: "Guarda",
      noResults: "Nessun risultato trovato",
      all: "Tutti",
      movies: "Film",
      series: "Serie",
      genres: {
        action: "Azione",
        comedy: "Commedia",
        drama: "Dramma",
        thriller: "Thriller",
        scifi: "Fantascienza",
        romance: "Romantico",
        horror: "Horror",
        documentary: "Documentario",
      },
    },

    // How It Works
    howItWorks: {
      hero: {
        title: "Come Funziona",
        subtitle: "Goditi VistraTV in 4 semplici passaggi",
      },
      steps: {
        step1: {
          title: "Scegli il Tuo Piano",
          desc: "Seleziona l'abbonamento che meglio si adatta alle tue esigenze",
        },
        step2: {
          title: "Paga in Sicurezza",
          desc: "Effettua il pagamento tramite il nostro sistema sicuro",
        },
        step3: {
          title: "Ricevi le Tue Credenziali",
          desc: "Ottieni i tuoi codici di accesso via email e WhatsApp",
        },
        step4: {
          title: "Goditi i Contenuti",
          desc: "Configura la tua app e inizia a guardare",
        },
      },
      featuresTitle: "Cosa è Incluso",
      featuresSubtitle: "Tutto ciò di cui hai bisogno per un'esperienza perfetta",
      features: {
        feature1: "Accesso illimitato a tutti i canali",
        feature2: "Qualità HD, 4K e 8K disponibile",
        feature3: "Compatibile con tutti i dispositivi",
        feature4: "Aggiornamenti automatici dei contenuti",
        feature5: "Supporto tecnico 24/7",
        feature6: "Nessuna pubblicità invadente",
      },
      videoTitle: "Tutorial Video",
      videoSubtitle: "Segui la nostra guida video passo dopo passo",
      watchTutorial: "Guarda il Tutorial",
      faq: {
        title: "Domande Frequenti",
        subtitle: "Hai domande? Controlla la nostra FAQ",
        cta: "Vedi FAQ",
      },
      cta: {
        title: "Pronto per Iniziare?",
        subtitle: "Unisciti a migliaia di clienti soddisfatti",
        start: "Inizia Ora",
        viewPlans: "Vedi Piani",
      },
    },
  },

  ar: {
    // Navigation
    nav: {
      home: "الرئيسية",
      offers: "العروض",
      presentation: "العرض التقديمي",
      tutorials: "دروس",
      contact: "اتصل بنا",
      subscribe: "اشترك",
      myAccount: "حسابي",
      logout: "تسجيل الخروج",
      channels: "القنوات",
      content: "المحتوى",
      support: "الدعم",
      howItWorks: "كيف يعمل",
      about: "معلومات عنا",
      terms: "الشروط",
      privacy: "الخصوصية",
    },

    // Home Page
    home: {
      hero: {
        title: "اكتشف VistraTV",
        subtitle: "IPTV المميز في متناول يدك",
        description: "أكثر من 15000 قناة مباشرة، أفلام ومسلسلات حسب الطلب. متوافق مع جميع أجهزتك.",
        cta: "اكتشف عروضنا",
        features: "بدون التزام • HD/4K • دعم 24/7",
      },
      channels: {
        title: "أكثر من 15000 قناة من جميع أنحاء العالم",
        subtitle: "رياضة، أفلام، مسلسلات، أخبار والمزيد",
      },
      pricing: {
        title: "اختر اشتراكك",
        subtitle: "اختر الخطة التي تناسبك",
      },
      devices: {
        title: "متوافق مع جميع أجهزتك",
        subtitle: "شاهد أينما تريد، متى تريد",
      },
      testimonials: {
        title: "يثقون بنا",
        subtitle: "آلاف العملاء الراضين",
      },
      faq: {
        title: "الأسئلة الشائعة",
        subtitle: "كل ما تحتاج إلى معرفته",
      },
    },

    // Subscriptions
    subscriptions: {
      title: "اختر اشتراكك",
      subtitle: "استمتع بـ VistraTV على جميع أجهزتك",
      monthly: "شهري",
      quarterly: "3 أشهر",
      semiAnnual: "6 أشهر",
      annual: "سنوي",
      perMonth: "/شهر",
      popular: "شائع",
      bestValue: "أفضل قيمة",
      selectPlan: "اختر",
      features: {
        channels: "قناة مباشرة",
        devices: "أجهزة متزامنة",
        quality: "جودة HD/4K",
        vod: "VOD غير محدود",
        support: "دعم 24/7",
        updates: "تحديثات مجانية",
      },
      guarantee: "ضمان استرداد الأموال لمدة 7 أيام",
      loading: "جاري التحميل...",
      noPlans: "لا توجد خطط متاحة",
      subscribe: "اشترك",
      perYear: "/سنة",
    },

    // Checkout
    checkout: {
      title: "أكمل طلبك",
      subtitle: "أنت على بعد خطوة واحدة من الاستمتاع بـ VistraTV",
      summary: "ملخص",
      plan: "الاشتراك",
      price: "السعر",
      total: "الإجمالي",
      contactInfo: "معلومات الاتصال",
      firstName: "الاسم الأول",
      lastName: "اسم العائلة",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      whatsapp: "رقم الواتساب",
      whatsappOptional: "اختياري - لتلقي بيانات الاعتماد",
      paymentMethod: "طريقة الدفع",
      payNow: "ادفع الآن",
      processing: "جاري المعالجة...",
      secure: "دفع آمن",
      errors: {
        required: "هذا الحقل مطلوب",
        email: "بريد إلكتروني غير صالح",
        phone: "هاتف غير صالح",
      },
      fillAllFields: "يرجى ملء جميع الحقول",
      selectedPlan: "الخطة المحددة",
      orderSummary: "ملخص الطلب",
      tax: "ضريبة",
      securePayment: "دفع آمن 100%",
      cancelAnytime: "إلغاء في أي وقت",
      instantAccess: "وصول فوري",
    },

    // Payment Success
    paymentSuccess: {
      title: "تم الدفع بنجاح!",
      subtitle: "شكرا لثقتك",
      message: "تم تفعيل اشتراكك في VistraTV بنجاح",
      credentials: {
        title: "بيانات اعتماد IPTV الخاصة بك",
        description: "ستتلقى بيانات الاعتماد الخاصة بك خلال دقائق عبر:",
        email: "البريد الإلكتروني المرسل إلى",
        whatsapp: "رسالة واتساب إلى",
        info: "تتضمن بيانات الاعتماد اسم المستخدم وكلمة المرور ورابط M3U لتكوين تطبيق IPTV الخاص بك.",
      },
      next: {
        title: "الخطوات التالية",
        step1: "تحقق من بريدك الإلكتروني أو الواتساب",
        step2: "قم بتنزيل تطبيق IPTV",
        step3: "قم بالتكوين باستخدام بيانات الاعتماد الخاصة بك",
        step4: "استمتع بـ VistraTV!",
      },
      support: {
        title: "هل تحتاج إلى مساعدة؟",
        description: "فريقنا متاح على مدار الساعة طوال أيام الأسبوع لمساعدتك",
        contact: "اتصل بالدعم",
      },
      backHome: "العودة إلى الصفحة الرئيسية",
      verifying: "جاري التحقق من الدفع...",
      pleaseWait: "يرجى الانتظار بينما نقوم بتأكيد دفعتك",
      error: "خطأ",
      backToPayment: "العودة إلى الدفع",
      noTransaction: "لم يتم العثور على معاملة",
      transactionDetails: "تفاصيل المعاملة",
      transactionId: "معرف المعاملة",
      plan: "خطة",
      amount: "المبلغ",
      duration: "المدة",
      months: "أشهر",
      credentialsArriving: "بيانات الاعتماد الخاصة بك قادمة",
      credentialsMessage: "ستتلقى بيانات اعتماد IPTV الخاصة بك خلال دقائق عبر البريد الإلكتروني والواتساب",
      features: {
        downloadLink: "📥 رابط تنزيل التطبيق",
        activationCode: "🔑 رمز تفعيل فريد",
        installGuide: "📖 دليل التثبيت الكامل",
        support: "💬 الوصول إلى الدعم ذي الأولوية",
      },
      tutorialsButton: "عرض أدلة التثبيت",
      notReceived: "لم تستلم بيانات الاعتماد الخاصة بك؟",
      notReceivedMessage: "اتصل بنا على واتساب على الرقم",
      needHelp: "هل تحتاج إلى مساعدة؟",
      or: "أو",
      supportPage: "صفحة الدعم",
    },

    // Support
    support: {
      title: "مركز المساعدة",
      subtitle: "نحن هنا للمساعدة",
      contact: {
        title: "اتصل بنا",
        description: "يستجيب فريقنا في أقل من ساعتين",
        whatsapp: "واتساب",
        email: "البريد الإلكتروني",
        hours: "متاح 24/7",
      },
      faq: {
        title: "الأسئلة الشائعة",
      },
      ticket: {
        title: "افتح تذكرة",
        subject: "الموضوع",
        message: "الرسالة",
        send: "إرسال",
        success: "تم إرسال التذكرة بنجاح",
      },
      backHome: "العودة إلى الصفحة الرئيسية",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      available: "متاح 24/7",
      emailResponse: "الرد في غضون 24 ساعة",
      instantResponse: "استجابة فورية",
      myTickets: "تذاكر الدعم الخاصة بي",
      newTicket: "تذكرة جديدة",
      noTickets: "لا توجد تذاكر حتى الآن",
      noTicketsDesc: "قم بإنشاء تذكرة للاتصال بالدعم الخاص بنا",
      fullName: "الاسم الكامل",
      yourName: "اسمك",
      yourEmail: "your@email.com",
      summarizeProblem: "لخص مشكلتك",
      describeProblem: "صف مشكلتك بالتفصيل...",
      createTicket: "إنشاء تذكرة",
      submitting: "جاري الإرسال...",
      ticketCreated: "تم إنشاء التذكرة بنجاح!",
      ticketNumber: "رقم",
      responseTime: "وقت الاستجابة",
      lessThan4Hours: "أقل من 4 ساعات",
      confirmationSent: "تم إرسال بريد إلكتروني للتأكيد إلى",
      trackTicket: "يمكنك تتبع تذكرتك أدناه.",
      back: "رجوع",
      status: {
        open: "مفتوحة",
        in_progress: "قيد التقدم",
        resolved: "تم الحل",
        closed: "مغلقة",
      },
      priority: {
        low: "منخفض",
        medium: "متوسط",
        high: "عالي",
      },
      errors: {
        createTicket: "خطأ في إنشاء التذكرة",
      },
    },

    // Tutorials
    tutorials: {
      hero: {
        title: "أدلة التثبيت",
        subtitle: "قم بإعداد VistraTV على جهازك في دقائق",
      },
      selectDevice: {
        title: "حدد جهازك",
        subtitle: "اختر جهازك لرؤية دليل التثبيت",
      },
      features: {
        stepByStep: "خطوة بخطوة",
        screenshots: "لقطات شاشة",
        videoGuides: "أدلة فيديو",
      },
      devices: {
        smarttv: { title: "تلفزيون ذكي", desc: "سامسونج، إل جي، سوني وغيرها" },
        androidbox: { title: "صندوق أندرويد", desc: "Nvidia Shield, Mi Box, إلخ." },
        androidphone: { title: "هاتف أندرويد", desc: "جميع هواتف أندرويد الذكية" },
        firestick: { title: "Amazon Fire Stick", desc: "Fire TV Stick و Fire TV Cube" },
        appletv: { title: "Apple TV", desc: "Apple TV 4K و HD" },
        iphone: { title: "iPhone/iPad", desc: "أجهزة iOS" },
        mac: { title: "Mac", desc: "MacBook, iMac, Mac Mini" },
        windows: { title: "كمبيوتر ويندوز", desc: "Windows 10 و 11" },
        kodi: { title: "Kodi", desc: "مركز وسائط Kodi" },
        chromecast: { title: "Chromecast", desc: "Chromecast مع Google TV" },
        playstation: { title: "PlayStation", desc: "PS4 و PS5" },
        xbox: { title: "Xbox", desc: "Xbox One و Series X/S" },
      },
      difficulty: { easy: "سهل", medium: "متوسط", hard: "صعب" },
      viewGuide: "عرض الدليل",
      needHelp: {
        title: "هل تحتاج إلى مساعدة؟",
        subtitle: "فريقنا هنا لإرشادك خلال عملية التثبيت",
        contactSupport: "اتصل بالدعم",
        viewFaq: "عرض الأسئلة الشائعة",
      },
    },

    // About
    about: {
      title: "لماذا تختار VistraTV",
      subtitle: "التميز في IPTV في خدمتك",
      description:
        "استمتع بجودة بث استثنائية مع أكثر من 15000 قناة مباشرة، دعم عملاء على مدار الساعة، وتوافق كامل مع جميع أجهزتك.",
      cta: "ابدأ الآن",
    },
    aboutPage: {
      hero: {
        title: "معلومات عنا",
        subtitle: "شريك IPTV الموثوق به",
        description:
          "منذ عام 2018، نقدم تجربة بث متميزة لآلاف العملاء حول العالم. مهمتنا هي جعل الترفيه في متناول الجميع.",
      },
      mission: {
        title: "مهمتنا",
        description: "تقديم خدمة IPTV فائقة مع أفضل اختيار للمحتوى، وموثوقية استثنائية، ودعم عملاء لا مثيل له.",
      },
      values: {
        security: { title: "الأمان", desc: "بياناتك وخصوصيتك هي أولويتنا القصوى" },
        performance: { title: "الأداء", desc: "بنية تحتية محسّنة للبث السلس على مدار الساعة" },
        support: { title: "الدعم", desc: "فريق متاح لمساعدتك في أي وقت" },
        quality: { title: "الجودة", desc: "محتوى عالي الدقة، يصل إلى 8K" },
        global: { title: "عالمي", desc: "خدمة متاحة في أكثر من 50 دولة" },
        passion: { title: "الشغف", desc: "حب الترفيه ورضا العملاء" },
      },
      stats: { founded: "تأسست", customers: "عملاء", channels: "قنوات", uptime: "وقت التشغيل" },
      valuesTitle: "قيمنا",
      valuesSubtitle: "ما يميزنا",
      cta: {
        title: "انضم إلينا اليوم",
        subtitle: "ابدأ رحلتك مع VistraTV",
        subscribe: "اشترك الآن",
        contact: "اتصل بنا",
      },
    },

    // Footer
    footer: {
      description: "خدمة IPTV المميزة الخاصة بك",
      links: "روابط سريعة",
      legal: "قانوني",
      contact: "اتصل بنا",
      allRightsReserved: "جميع الحقوق محفوظة",
    },
    legal: {
      backHome: "العودة إلى الصفحة الرئيسية",
      lastUpdated: "آخر تحديث",
      termsTitle: "شروط الخدمة",
      privacyTitle: "سياسة الخصوصية",
      acceptance: "قبول الشروط",
      serviceDescription: "وصف الخدمة",
      userAccount: "حساب المستخدم",
      subscription: "الاشتراك والدفع",
      usage: "الاستخدام المقبول",
      termination: "الإنهاء",
      contact: "الاتصال",
      dataCollection: "جمع البيانات",
      dataUsage: "استخدام البيانات",
      dataSharing: "مشاركة البيانات",
      cookies: "ملفات تعريف الارتباط",
      security: "الأمان",
      rights: "حقوقك",
    },

    // Common
    common: {
      loading: "جاري التحميل...",
      error: "حدث خطأ",
      retry: "أعد المحاولة",
      cancel: "إلغاء",
      confirm: "تأكيد",
      save: "حفظ",
      delete: "حذف",
      edit: "تحرير",
      close: "إغلاق",
      back: "رجوع",
      next: "التالي",
      previous: "السابق",
      search: "بحث",
      filter: "تصفية",
      sort: "فرز",
      viewMore: "عرض المزيد",
      viewLess: "عرض أقل",
    },

    // Channel Showcase
    channelShowcase: {
      title: "اكتشف قنواتنا",
      channelsCount: "القنوات المتاحة",
      categories: {
        sports: "رياضة",
        cinema: "سينما",
        series: "مسلسلات",
        documentary: "وثائقي",
        news: "أخبار",
        kids: "أطفال",
      },
    },

    // Social Proof
    socialProof: {
      title: "انضم إلى آلاف العملاء الراضين",
    },

    // Latest Releases
    latestReleases: {
      title: "أحدث الإصدارات",
      subtitle: "أفلام ومسلسلات تمت إضافتها مؤخرًا",
      movie: "فيلم",
      series: "مسلسل",
    },

    // Device Compatibility
    deviceCompatibility: {
      title: "متوافق مع جميع أجهزتك",
      subtitle: "شاهد أينما تريد، متى تريد",
    },

    // WhatsApp Testimonials
    whatsapp: {
      title: "شهادات واتساب",
      subtitle: "اكتشف ما يقوله عملاؤنا عنا على واتساب",
      cta: "اتصل بنا على واتساب",
    },

    // Free Trial
    freeTrial: {
      title: "جرب مجانًا بدون التزام!",
      description: "استمتع بتجربة مجانية لمدة 24-48 ساعة لاكتشاف خدمتنا المميزة. لا حاجة لبطاقة ائتمان.",
      duration: "تجربة مجانية 24-48 ساعة",
      cta: "ابدأ التجربة المجانية",
    },

    // Marketing Components
    marketing: {
      badges: {
        title: "لماذا الثقة بنا",
        secure: "آمن 100%",
        secureDesc: "مدفوعات مشفرة SSL",
        privacy: "الخصوصية",
        privacyDesc: "بيانات محمية",
        payment: "دفع سهل",
        paymentDesc: "خيارات متعددة",
        support: "دعم 24/7",
        supportDesc: "متاح دائمًا",
        quality: "جودة مميزة",
        qualityDesc: "HD/4K مضمون",
        guarantee: "ضمان",
        guaranteeDesc: "استرداد خلال 7 أيام",
      },
      guarantee: {
        title: "ضمان استرداد الأموال",
        subtitle: "جرب بدون مخاطر لمدة 7 أيام",
        point1Title: "بدون التزام",
        point1Desc: "لا عقد، ألغِ في أي وقت",
        point2Title: "استرداد سريع",
        point2Desc: "استرداد المال خلال 48 ساعة",
        point3Title: "مضمون 100%",
        point3Desc: "بدون أسئلة",
        description: "إذا لم تكن راضيًا خلال أول 7 أيام، سنعيد لك أموالك كاملة.",
        cta: "ابدأ الآن",
        terms: "تطبق الشروط والأحكام",
      },
      hours: "ساعات",
      minutes: "دقائق",
      seconds: "ثواني",
    },

    // Cookie Consent
    cookieConsent: {
      message: "نستخدم ملفات تعريف الارتباط لتحسين تجربتك. بالمتابعة، فإنك تقبل استخدامنا لملفات تعريف الارتباط.",
      accept: "قبول",
      decline: "رفض",
    },

    // Content
    content: {
      allMovies: "جميع الأفلام",
    },

    // Devices
    devices: {
      title: "الأجهزة",
    },

    // FAQ
    faq: {
      title: "الأسئلة الشائعة",
    },

    // Browse
    browse: {
      channelsTitle: "استكشاف القنوات",
      channelsSubtitle: "استكشف مجموعتنا الكاملة من القنوات من جميع أنحاء العالم",
      contentTitle: "استكشاف المحتوى",
      contentSubtitle: "اكتشف آلاف الأفلام والمسلسلات",
      searchPlaceholder: "بحث...",
      allCategories: "جميع الفئات",
      allGenres: "جميع الأنواع",
      resultsCount: "{count} نتيجة (نتائج)",
      watch: "مشاهدة",
      noResults: "لم يتم العثور على نتائج",
      all: "الكل",
      movies: "أفلام",
      series: "مسلسلات",
      genres: {
        action: "أكشن",
        comedy: "كوميديا",
        drama: "دراما",
        thriller: "إثارة",
        scifi: "خيال علمي",
        romance: "رومانسي",
        horror: "رعب",
        documentary: "وثائقي",
      },
    },

    // How It Works
    howItWorks: {
      hero: {
        title: "كيف يعمل",
        subtitle: "استمتع بـ VistraTV في 4 خطوات بسيطة",
      },
      steps: {
        step1: {
          title: "اختر خطتك",
          desc: "اختر الاشتراك الذي يناسب احتياجاتك",
        },
        step2: {
          title: "ادفع بأمان",
          desc: "قم بالدفع عبر نظامنا الآمن",
        },
        step3: {
          title: "استلم بيانات الاعتماد الخاصة بك",
          desc: "احصل على رموز الوصول الخاصة بك عبر البريد الإلكتروني والواتساب",
        },
        step4: {
          title: "استمتع بالمحتوى",
          desc: "قم بإعداد تطبيقك وابدأ المشاهدة",
        },
      },
      featuresTitle: "ما هو متضمن",
      featuresSubtitle: "كل ما تحتاجه لتجربة مثالية",
      features: {
        feature1: "وصول غير محدود لجميع القنوات",
        feature2: "جودة HD، 4K و 8K متاحة",
        feature3: "متوافق مع جميع الأجهزة",
        feature4: "تحديثات محتوى تلقائية",
        feature5: "دعم فني 24/7",
        feature6: "لا توجد إعلانات متطفلة",
      },
      videoTitle: "فيديو تعليمي",
      videoSubtitle: "اتبع دليل الفيديو خطوة بخطوة",
      watchTutorial: "مشاهدة الفيديو التعليمي",
      faq: {
        title: "الأسئلة الشائعة",
        subtitle: "هل لديك أسئلة؟ تحقق من الأسئلة الشائعة",
        cta: "عرض الأسئلة الشائعة",
      },
      cta: {
        title: "هل أنت مستعد للبدء؟",
        subtitle: "انضم إلى آلاف العملاء الراضين",
        start: "ابدأ الآن",
        viewPlans: "عرض الخطط",
      },
    },
  },

  he: {
    // Navigation
    nav: {
      home: "בית",
      offers: "הצעות",
      presentation: "מצגת",
      tutorials: "מדריכים",
      contact: "צור קשר",
      subscribe: "הירשם",
      myAccount: "החשבון שלי",
      logout: "התנתק",
      channels: "ערוצים",
      content: "תוכן",
      support: "תמיכה",
      howItWorks: "איך זה עובד",
      about: "אודות",
      terms: "תנאים",
      privacy: "פרטיות",
    },

    // Home Page
    home: {
      hero: {
        title: "גלה את VistraTV",
        subtitle: "IPTV פרימיום בהישג יד",
        description: "למעלה מ-15,000 ערוצים בשידור חי, סרטים וסדרות לפי דרישה. תואם לכל המכשירים שלך.",
        cta: "גלה את ההצעות שלנו",
        features: "ללא התחייבות • HD/4K • תמיכה 24/7",
      },
      channels: {
        title: "למעלה מ-15,000 ערוצים מכל העולם",
        subtitle: "ספורט, סרטים, סדרות, חדשות ועוד",
      },
      pricing: {
        title: "בחר את המנוי שלך",
        subtitle: "בחר את התוכנית המתאימה לך",
      },
      devices: {
        title: "תואם לכל המכשירים שלך",
        subtitle: "צפה איפה שאתה רוצה, מתי שאתה רוצה",
      },
      testimonials: {
        title: "הם סומכים עלינו",
        subtitle: "אלפי לקוחות מרוצים",
      },
      faq: {
        title: "שאלות נפוצות",
        subtitle: "כל מה שאתה צריך לדעת",
      },
    },

    // Subscriptions
    subscriptions: {
      title: "בחר את המנוי שלך",
      subtitle: "תיהנה מ-VistraTV בכל המכשירים שלך",
      monthly: "חודשי",
      quarterly: "3 חודשים",
      semiAnnual: "6 חודשים",
      annual: "שנתי",
      perMonth: "/חודש",
      popular: "פופולרי",
      bestValue: "הערך הטוב ביותר",
      selectPlan: "בחר",
      features: {
        channels: "ערוצים בשידור חי",
        devices: "מכשירים במקביל",
        quality: "איכות HD/4K",
        vod: "VOD ללא הגבלה",
        support: "תמיכה 24/7",
        updates: "עדכונים חינם",
      },
      guarantee: "החזר כספי תוך 7 ימים",
      loading: "טוען...",
      noPlans: "אין תוכניות זמינות",
      subscribe: "הירשם",
      perYear: "/שנה",
    },

    // Checkout
    checkout: {
      title: "השלם את ההזמנה שלך",
      subtitle: "אתה צעד אחד מלהנות מ-VistraTV",
      summary: "סיכום",
      plan: "מנוי",
      price: "מחיר",
      total: "סה״כ",
      contactInfo: "פרטי קשר",
      firstName: "שם פרטי",
      lastName: "שם משפחה",
      email: "דוא״ל",
      phone: "טלפון",
      whatsapp: "מספר WhatsApp",
      whatsappOptional: "אופציונלי - לקבל את פרטי הגישה שלך",
      paymentMethod: "אמצעי תשלום",
      payNow: "שלם עכשיו",
      processing: "מעבד...",
      secure: "תשלום מאובטח",
      errors: {
        required: "שדה זה נדרש",
        email: "דוא״ל לא חוקי",
        phone: "טלפון לא חוקי",
      },
      fillAllFields: "אנא מלא את כל השדות",
      selectedPlan: "תוכנית שנבחרה",
      orderSummary: "סיכום הזמנה",
      tax: "מס",
      securePayment: "תשלום מאובטח 100%",
      cancelAnytime: "בטל בכל עת",
      instantAccess: "גישה מיידית",
    },

    // Payment Success
    paymentSuccess: {
      title: "התשלום הצליח!",
      subtitle: "תודה על האמון",
      message: "המנוי שלך ל-VistraTV הופעל בהצלחה",
      credentials: {
        title: "פרטי הגישה שלך ל-IPTV",
        description: "תקבל את פרטי הגישה שלך תוך מספר דקות דרך:",
        email: "דוא״ל נשלח אל",
        whatsapp: "הודעת WhatsApp אל",
        info: "פרטי הגישה כוללים את שם המשתמש, הסיסמה וקישור M3U להגדרת אפליקציית IPTV שלך.",
      },
      next: {
        title: "השלבים הבאים",
        step1: "בדוק את הדוא״ל או WhatsApp שלך",
        step2: "הורד אפליקציית IPTV",
        step3: "הגדר עם פרטי הגישה שלך",
        step4: "תיהנה מ-VistraTV!",
      },
      support: {
        title: "צריך עזרה?",
        description: "הצוות שלנו זמין 24/7 לסייע לך",
        contact: "צור קשר עם התמיכה",
      },
      backHome: "חזור לדף הבית",
      verifying: "מאמת תשלום...",
      pleaseWait: "אנא המתן בזמן שאנו מאשרים את תשלומך",
      error: "שגיאה",
      backToPayment: "חזור לתשלום",
      noTransaction: "לא נמצאה עסקה",
      transactionDetails: "פרטי עסקה",
      transactionId: "מזהה עסקה",
      plan: "תוכנית",
      amount: "סכום",
      duration: "משך",
      months: "חודשים",
      credentialsArriving: "פרטי הגישה שלך מגיעים",
      credentialsMessage: 'תקבל את פרטי הגישה שלך ל-IPTV תוך מספר דקות בדוא"ל וב-WhatsApp',
      features: {
        downloadLink: "📥 קישור להורדת האפליקציה",
        activationCode: "🔑 קוד הפעלה ייחודי",
        installGuide: "📖 מדריך התקנה מלא",
        support: "💬 גישה לתמיכה מועדפת",
      },
      tutorialsButton: "הצג מדריכי התקנה",
      notReceived: "לא קיבלת את פרטי הגישה שלך?",
      notReceivedMessage: "צור קשר ב-WhatsApp בטלפון",
      needHelp: "צריך עזרה?",
      or: "או",
      supportPage: "דף תמיכה",
    },

    // Support
    support: {
      title: "מרכז עזרה",
      subtitle: "אנחנו כאן כדי לעזור",
      contact: {
        title: "צור קשר",
        description: "הצוות שלנו עונה תוך פחות משעתיים",
        whatsapp: "WhatsApp",
        email: "דוא״ל",
        hours: "זמין 24/7",
      },
      faq: {
        title: "שאלות נפוצות",
      },
      ticket: {
        title: "פתח כרטיס",
        subject: "נושא",
        message: "הודעה",
        send: "שלח",
        success: "הכרטיס נשלח בהצלחה",
      },
      backHome: "חזור לדף הבית",
      email: "דוא״ל",
      phone: "טלפון",
      available: "זמין 24/7",
      emailResponse: "תגובה תוך 24 שעות",
      instantResponse: "תגובה מיידית",
      myTickets: "כרטיסי התמיכה שלי",
      newTicket: "כרטיס חדש",
      noTickets: "עדיין אין כרטיסים",
      noTicketsDesc: "צור כרטיס כדי ליצור קשר עם התמיכה שלנו",
      fullName: "שם מלא",
      yourName: "השם שלך",
      yourEmail: "your@email.com",
      summarizeProblem: "סכם את הבעיה שלך",
      describeProblem: "תאר את הבעיה שלך בפירוט...",
      createTicket: "צור כרטיס",
      submitting: "שולח...",
      ticketCreated: "הכרטיס נוצר בהצלחה!",
      ticketNumber: "מספר",
      responseTime: "זמן תגובה",
      lessThan4Hours: "פחות מ-4 שעות",
      confirmationSent: 'דוא"ל אישור נשלח אל',
      trackTicket: "תוכל לעקוב אחר הכרטיס שלך למטה.",
      back: "חזור",
      status: {
        open: "פתוח",
        in_progress: "בתהליך",
        resolved: "נפתר",
        closed: "סגור",
      },
      priority: {
        low: "נמוך",
        medium: "בינוני",
        high: "גבוה",
      },
      errors: {
        createTicket: "שגיאה ביצירת כרטיס",
      },
    },

    // Tutorials
    tutorials: {
      hero: {
        title: "מדריכי התקנה",
        subtitle: "הגדר את VistraTV במכשיר שלך תוך דקות",
      },
      selectDevice: {
        title: "בחר את המכשיר שלך",
        subtitle: "בחר את המכשיר שלך כדי לראות את מדריך ההתקנה",
      },
      features: {
        stepByStep: "שלב אחר שלב",
        screenshots: "צילומי מסך",
        videoGuides: "מדריכי וידאו",
      },
      devices: {
        smarttv: { title: "טלוויזיה חכמה", desc: "סמסונג, LG, סוני ואחרים" },
        androidbox: { title: "קופסת אנדרואיד", desc: "Nvidia Shield, Mi Box, וכו'." },
        androidphone: { title: "טלפון אנדרואיד", desc: "כל הסמארטפונים של אנדרואיד" },
        firestick: { title: "Amazon Fire Stick", desc: "Fire TV Stick ו-Fire TV Cube" },
        appletv: { title: "Apple TV", desc: "Apple TV 4K ו-HD" },
        iphone: { title: "iPhone/iPad", desc: "מכשירי iOS" },
        mac: { title: "Mac", desc: "MacBook, iMac, Mac Mini" },
        windows: { title: "מחשב Windows", desc: "Windows 10 ו-11" },
        kodi: { title: "Kodi", desc: "מרכז המדיה Kodi" },
        chromecast: { title: "Chromecast", desc: "Chromecast עם Google TV" },
        playstation: { title: "PlayStation", desc: "PS4 ו-PS5" },
        xbox: { title: "Xbox", desc: "Xbox One ו-Series X/S" },
      },
      difficulty: { easy: "קל", medium: "בינוני", hard: "קשה" },
      viewGuide: "הצג מדריך",
      needHelp: {
        title: "צריך עזרה?",
        subtitle: "הצוות שלנו כאן כדי להדריך אותך בתהליך ההתקנה",
        contactSupport: "צור קשר עם התמיכה",
        viewFaq: "הצג שאלות נפוצות",
      },
    },

    // About
    about: {
      title: "למה לבחור ב-VistraTV",
      subtitle: "מצוינות IPTV בשירותך",
      description:
        "תיהנה מאיכות סטרימינג יוצאת דופן עם למעלה מ-15,000 ערוצים בשידור חי, תמיכת לקוחות 24/7 ותאימות מלאה לכל המכשירים שלך.",
      cta: "התחל עכשיו",
    },
    aboutPage: {
      hero: {
        title: "אודות VistraTV",
        subtitle: "שותף ה-IPTV המהימן שלך",
        description:
          "מאז 2018, אנו מספקים חווית סטרימינג פרימיום לאלפי לקוחות ברחבי העולם. המשימה שלנו היא להפוך את הבידור לנגיש לכולם.",
      },
      mission: {
        title: "המשימה שלנו",
        description: "לספק שירות IPTV מעולה עם מבחר התכנים הטוב ביותר, אמינות יוצאת דופן, ותמיכת לקוחות ללא תחרות.",
      },
      values: {
        security: { title: "אבטחה", desc: "הנתונים והפרטיות שלך הם בראש סדר העדיפויות שלנו" },
        performance: { title: "ביצועים", desc: "תשתית מותאמת לסטרימינג חלק 24/7" },
        support: { title: "תמיכה", desc: "צוות זמין לסייע לך בכל עת" },
        quality: { title: "איכות", desc: "תוכן באיכות גבוהה, עד 8K" },
        global: { title: "גלובלי", desc: "שירות זמין בלמעלה מ-50 מדינות" },
        passion: { title: "תשוקה", desc: "אהבה לבידור ושביעות רצון לקוחות" },
      },
      stats: { founded: "נוסדה", customers: "לקוחות", channels: "ערוצים", uptime: "זמינות" },
      valuesTitle: "הערכים שלנו",
      valuesSubtitle: "מה מגדיר אותנו",
      cta: {
        title: "הצטרף אלינו היום",
        subtitle: "התחל את המסע שלך עם VistraTV",
        subscribe: "הירשם עכשיו",
        contact: "צור קשר",
      },
    },

    // Footer
    footer: {
      description: "שירות ה-IPTV הפרימיום שלך",
      links: "קישורים מהירים",
      legal: "משפטי",
      contact: "צור קשר",
      allRightsReserved: "כל הזכויות שמורות",
    },
    legal: {
      backHome: "חזור לדף הבית",
      lastUpdated: "עודכן לאחרונה",
      termsTitle: "תנאי שירות",
      privacyTitle: "מדיניות פרטיות",
      acceptance: "קבלת תנאים",
      serviceDescription: "תיאור השירות",
      userAccount: "חשבון משתמש",
      subscription: "מנוי ותשלום",
      usage: "שימוש מקובל",
      termination: "סיום",
      contact: "צור קשר",
      dataCollection: "איסוף נתונים",
      dataUsage: "שימוש בנתונים",
      dataSharing: "שיתוף נתונים",
      cookies: "עוגיות",
      security: "אבטחה",
      rights: "הזכויות שלך",
    },

    // Common
    common: {
      loading: "טוען...",
      error: "אירעה שגיאה",
      retry: "נסה שוב",
      cancel: "ביטול",
      confirm: "אישור",
      save: "שמור",
      delete: "מחק",
      edit: "ערוך",
      close: "סגור",
      back: "חזור",
      next: "הבא",
      previous: "קודם",
      search: "חיפוש",
      filter: "סינון",
      sort: "מיון",
      viewMore: "ראה עוד",
      viewLess: "ראה פחות",
    },

    // Channel Showcase
    channelShowcase: {
      title: "גלה את הערוצים שלנו",
      channelsCount: "ערוצים זמינים",
      categories: {
        sports: "ספורט",
        cinema: "קולנוע",
        series: "סדרות",
        documentary: "תיעודי",
        news: "חדשות",
        kids: "ילדים",
      },
    },

    // Social Proof
    socialProof: {
      title: "הצטרף לאלפי לקוחות מרוצים",
    },

    // Latest Releases
    latestReleases: {
      title: "שחרורים אחרונים",
      subtitle: "סרטים וסדרות שנוספו לאחרונה",
      movie: "סרט",
      series: "סדרה",
    },

    // Device Compatibility
    deviceCompatibility: {
      title: "תואם לכל המכשירים שלך",
      subtitle: "צפה איפה שאתה רוצה, מתי שאתה רוצה",
    },

    // WhatsApp Testimonials
    whatsapp: {
      title: "המלצות WhatsApp",
      subtitle: "ראה מה הלקוחות שלנו אומרים עלינו ב-WhatsApp",
      cta: "צור קשר ב-WhatsApp",
    },

    // Free Trial
    freeTrial: {
      title: "נסה בחינם ללא התחייבות!",
      description: "תיהנה מניסיון חינם של 24-48 שעות כדי לגלות את השירות הפרימיום שלנו. לא נדרש כרטיס אשראי.",
      duration: "ניסיון חינם 24-48 שעות",
      cta: "התחל ניסיון חינם",
    },

    // Marketing Components
    marketing: {
      badges: {
        title: "למה לסמוך עלינו",
        secure: "100% מאובטח",
        secureDesc: "תשלומים מוצפנים SSL",
        privacy: "פרטיות",
        privacyDesc: "נתונים מוגנים",
        payment: "תשלום קל",
        paymentDesc: "אפשרויות מרובות",
        support: "תמיכה 24/7",
        supportDesc: "תמיד זמין",
        quality: "איכות פרימיום",
        qualityDesc: "HD/4K מובטח",
        guarantee: "ערבות",
        guaranteeDesc: "החזר כספי תוך 7 ימים",
      },
      guarantee: {
        title: "ערבות החזר כספי",
        subtitle: "נסה ללא סיכון למשך 7 ימים",
        point1Title: "ללא התחייבות",
        point1Desc: "אין חוזה, בטל בכל עת",
        point2Title: "החזר מהיר",
        point2Desc: "כסף מוחזר תוך 48 שעות",
        point3Title: "מובטח 100%",
        point3Desc: "ללא שאלות",
        description: "אם אינך מרוצה בתוך 7 הימים הראשונים, נחזיר לך את כספך במלואו.",
        cta: "התחל עכשיו",
        terms: "תנאים והגבלות חלים",
      },
      hours: "שעות",
      minutes: "דקות",
      seconds: "שניות",
    },

    // Cookie Consent
    cookieConsent: {
      message: "אנו משתמשים בעוגיות כדי לשפר את החוויה שלך. בהמשך, אתה מקבל את השימוש שלנו בעוגיות.",
      accept: "קבל",
      decline: "דחה",
    },

    // Content
    content: {
      allMovies: "כל הסרטים",
    },

    // Devices
    devices: {
      title: "מכשירים",
    },

    // FAQ
    faq: {
      title: "שאלות נפוצות",
    },

    // Browse
    browse: {
      channelsTitle: "עיון בערוצים",
      channelsSubtitle: "חקור את המבחר המלא שלנו של ערוצים מכל העולם",
      contentTitle: "עיון בתוכן",
      contentSubtitle: "גלה אלפי סרטים וסדרות",
      searchPlaceholder: "חפש...",
      allCategories: "כל הקטגוריות",
      allGenres: "כל הז'אנרים",
      resultsCount: "{count} תוצאה (תוצאות)",
      watch: "צפה",
      noResults: "לא נמצאו תוצאות",
      all: "הכל",
      movies: "סרטים",
      series: "סדרות",
      genres: {
        action: "אקשן",
        comedy: "קומדיה",
        drama: "דרמה",
        thriller: "מותחן",
        scifi: "מדע בדיוני",
        romance: "רומנטיקה",
        horror: "אימה",
        documentary: "תיעודי",
      },
    },

    // How It Works
    howItWorks: {
      hero: {
        title: "איך זה עובד",
        subtitle: "תיהנה מ-VistraTV ב-4 צעדים פשוטים",
      },
      steps: {
        step1: {
          title: "בחר את התוכנית שלך",
          desc: "בחר את המנוי המתאים ביותר לצרכים שלך",
        },
        step2: {
          title: "שלם בצורה מאובטחת",
          desc: "בצע את התשלום דרך המערכת המאובטחת שלנו",
        },
        step3: {
          title: "קבל את פרטי הגישה שלך",
          desc: 'קבל את קודי הגישה שלך בדוא"ל וב-WhatsApp',
        },
        step4: {
          title: "תיהנה מהתוכן",
          desc: "הגדר את האפליקציה שלך והתחל לצפות",
        },
      },
      featuresTitle: "מה כלול",
      featuresSubtitle: "כל מה שאתה צריך לחוויה מושלמת",
      features: {
        feature1: "גישה בלתי מוגבלת לכל הערוצים",
        feature2: "זמינות באיכות HD, 4K ו-8K",
        feature3: "תואם לכל המכשירים",
        feature4: "עדכוני תוכן אוטומטיים",
        feature5: "תמיכה טכנית 24/7",
        feature6: "ללא פרסומות פולשניות",
      },
      videoTitle: "מדריך וידאו",
      videoSubtitle: "עקוב אחר מדריך הוידאו שלנו צעד אחר צעד",
      watchTutorial: "צפה במדריך",
      faq: {
        title: "שאלות נפוצות",
        subtitle: "יש לך שאלות? בדוק את השאלות הנפוצות שלנו",
        cta: "הצג שאלות נפוצות",
      },
      cta: {
        title: "מוכן להתחיל?",
        subtitle: "הצטרף לאלפי לקוחות מרוצים",
        start: "התחל עכשיו",
        viewPlans: "הצג תוכניות",
      },
    },
  },
}

export type TranslationKeys = typeof translations.fr

export function getTranslation(locale: Locale): TranslationKeys {
  return translations[locale] || translations.fr
}
