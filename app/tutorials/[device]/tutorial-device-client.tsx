"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { FadeIn } from "@/components/animations/FadeIn"
import { StaggerContainer } from "@/components/animations/StaggerContainer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2, Download, Play, AlertCircle } from "lucide-react"

// Device configurations with detailed steps
const deviceGuides = {
  "smart-tv": {
    appName: "IPTV Smarters Pro",
    downloadUrl: "https://play.google.com/store/apps/details?id=com.nst.iptvsmarterstvbox",
    steps: 8,
    requirements: ["Smart TV with Android OS", "Internet connection", "VistraTV subscription"],
  },
  "android-box": {
    appName: "IPTV Smarters Pro",
    downloadUrl: "https://play.google.com/store/apps/details?id=com.nst.iptvsmarterstvbox",
    steps: 7,
    requirements: ["Android TV Box", "Internet connection", "VistraTV subscription"],
  },
  "android-phone": {
    appName: "IPTV Smarters Pro",
    downloadUrl: "https://play.google.com/store/apps/details?id=com.nst.iptvsmarterstvbox",
    steps: 6,
    requirements: ["Android smartphone or tablet", "Internet connection", "VistraTV subscription"],
  },
  "fire-stick": {
    appName: "Downloader",
    downloadUrl: "https://www.amazon.com/AFTVnews-com-Downloader/dp/B01N0BP507",
    steps: 9,
    requirements: ["Amazon Fire TV Stick", "Internet connection", "VistraTV subscription"],
  },
  "apple-tv": {
    appName: "GSE Smart IPTV",
    downloadUrl: "https://apps.apple.com/app/gse-smart-iptv/id1028734023",
    steps: 7,
    requirements: ["Apple TV 4K or HD", "Internet connection", "VistraTV subscription"],
  },
  iphone: {
    appName: "GSE Smart IPTV",
    downloadUrl: "https://apps.apple.com/app/gse-smart-iptv/id1028734023",
    steps: 6,
    requirements: ["iPhone or iPad", "iOS 12 or later", "VistraTV subscription"],
  },
  mac: {
    appName: "VLC Media Player",
    downloadUrl: "https://www.videolan.org/vlc/",
    steps: 5,
    requirements: ["Mac computer", "macOS 10.11 or later", "VistraTV subscription"],
  },
  windows: {
    appName: "VLC Media Player",
    downloadUrl: "https://www.videolan.org/vlc/",
    steps: 5,
    requirements: ["Windows PC", "Windows 10 or later", "VistraTV subscription"],
  },
  kodi: {
    appName: "PVR IPTV Simple Client",
    downloadUrl: "https://kodi.tv/download",
    steps: 8,
    requirements: ["Kodi installed", "Internet connection", "VistraTV subscription"],
  },
  chromecast: {
    appName: "IPTV Smarters Pro",
    downloadUrl: "https://play.google.com/store/apps/details?id=com.nst.iptvsmarterstvbox",
    steps: 7,
    requirements: ["Chromecast device", "Android or iOS device", "VistraTV subscription"],
  },
  playstation: {
    appName: "Media Player",
    downloadUrl: "Built-in app",
    steps: 6,
    requirements: ["PlayStation 4 or 5", "Internet connection", "VistraTV subscription"],
  },
  xbox: {
    appName: "MyIPTV Player",
    downloadUrl: "Microsoft Store",
    steps: 6,
    requirements: ["Xbox One or Series X/S", "Internet connection", "VistraTV subscription"],
  },
}

export default function TutorialDeviceClient() {
  const params = useParams()
  const device = params.device as string
  const { t } = useLanguage()

  const guide = deviceGuides[device as keyof typeof deviceGuides]

  if (!guide) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <div className="fixed inset-0 bg-gradient-main -z-10" />
        <div className="relative z-10 flex items-center justify-center p-6 min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Guide not found</h1>
            <Link href="/tutorials">
              <Button>Back to Tutorials</Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // Get device info from translations
  const deviceKey = device.replace(/-/g, "")
  const deviceInfo = t.tutorials.devices[deviceKey as keyof typeof t.tutorials.devices]

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background blur circles */}
      <div className="blur-circle blur-circle-purple w-[600px] h-[600px] top-0 right-0" />
      <div className="blur-circle blur-circle-pink w-[500px] h-[500px] bottom-0 right-0" />
      <div className="blur-circle blur-circle-blue w-[400px] h-[400px] top-1/2 left-0" />

      {/* Main gradient background */}
      <div className="fixed inset-0 bg-gradient-main -z-10" />

      <div className="relative z-10 container mx-auto px-6 py-24">
        {/* Back button */}
        <FadeIn direction="left">
          <Link href="/tutorials">
            <Button variant="ghost" className="mb-8 text-white hover:text-[#00d4ff]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.tutorials.hero.title}
            </Button>
          </Link>
        </FadeIn>

        {/* Hero section */}
        <FadeIn direction="up" delay={0.1}>
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87] bg-clip-text text-transparent">
                {deviceInfo?.title || device}
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {deviceInfo?.desc || "Complete installation guide"}
            </p>
          </div>
        </FadeIn>

        {/* Requirements */}
        <FadeIn direction="up" delay={0.2}>
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-[#00d4ff]" />
                {t.tutorials.hero.subtitle.includes("Requirements") ? "Requirements" : "Prérequis"}
              </h2>
              <ul className="space-y-3">
                {guide.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-[#00d4ff] mt-0.5 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </FadeIn>

        {/* Installation steps */}
        <div className="max-w-4xl mx-auto">
          <FadeIn direction="up" delay={0.3}>
            <h2 className="text-3xl font-bold text-white mb-8 text-center">{t.tutorials.features.stepByStep}</h2>
          </FadeIn>

          <StaggerContainer className="space-y-8">
            {Array.from({ length: guide.steps }).map((_, index) => (
              <FadeIn key={index} direction="up" delay={0.1 * index}>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#e94b87] flex items-center justify-center text-white font-bold text-xl">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-3">
                        Step {index + 1}: {getStepTitle(device, index)}
                      </h3>
                      <p className="text-gray-300 mb-4">{getStepDescription(device, index)}</p>
                      {index === 0 && (
                        <div className="mt-4">
                          <Image
                            src={`/.jpg?height=300&width=600&query=${device} ${guide.appName} app screenshot`}
                            alt={`Step ${index + 1}`}
                            width={600}
                            height={300}
                            className="rounded-lg border border-white/10"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </StaggerContainer>
        </div>

        {/* Download CTA */}
        <FadeIn direction="up" delay={0.5}>
          <div className="max-w-4xl mx-auto mt-16">
            <div className="bg-gradient-to-r from-[#00d4ff]/20 to-[#e94b87]/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to get started?</h3>
              <p className="text-gray-300 mb-6">Download {guide.appName} and start enjoying VistraTV</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-[#00d4ff] to-[#e94b87] hover:opacity-90">
                  <Download className="mr-2 h-5 w-5" />
                  Download {guide.appName}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 hover:bg-white/10 bg-transparent text-white"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Video Tutorial
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Need help */}
        <FadeIn direction="up" delay={0.6}>
          <div className="max-w-4xl mx-auto mt-16 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">{t.tutorials.needHelp.title}</h3>
            <p className="text-gray-300 mb-6">{t.tutorials.needHelp.subtitle}</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/support">
                <Button variant="outline" className="border-white/20 hover:bg-white/10 bg-transparent text-white">
                  {t.tutorials.needHelp.contactSupport}
                </Button>
              </Link>
              <Link href="/support#faq">
                <Button variant="ghost" className="hover:bg-white/10 text-white">
                  {t.tutorials.needHelp.viewFaq}
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </main>
  )
}

// Helper functions for step content
function getStepTitle(device: string, step: number): string {
  const titles: Record<string, string[]> = {
    "smart-tv": [
      "Open Google Play Store",
      "Search for IPTV Smarters Pro",
      "Install the application",
      "Launch IPTV Smarters Pro",
      'Select "Login with Xtream Codes API"',
      "Enter your credentials",
      "Configure player settings",
      "Start watching",
    ],
    "android-box": [
      "Open Google Play Store",
      "Search for IPTV Smarters Pro",
      "Install the application",
      "Launch the app",
      "Select login method",
      "Enter your credentials",
      "Start watching",
    ],
    "android-phone": [
      "Open Google Play Store",
      "Download IPTV Smarters Pro",
      "Open the app",
      "Choose login method",
      "Enter credentials",
      "Enjoy your content",
    ],
    "fire-stick": [
      "Enable Apps from Unknown Sources",
      "Install Downloader app",
      "Download IPTV Smarters Pro",
      "Install the APK",
      "Launch the app",
      "Select login method",
      "Enter your credentials",
      "Configure settings",
      "Start streaming",
    ],
    "apple-tv": [
      "Open the App Store on your Apple TV.",
      "Search for GSE Smart IPTV.",
      "Download and install the application.",
      "Launch GSE Smart IPTV.",
      "Choose login method.",
      "Enter your VistraTV credentials.",
      "Browse and enjoy channels.",
    ],
    iphone: [
      "Open the App Store on your iPhone.",
      "Search for GSE Smart IPTV.",
      "Download and install the application.",
      "Launch GSE Smart IPTV.",
      "Choose login method.",
      "Enter your VistraTV credentials.",
      "Enjoy your content.",
    ],
    mac: [
      "Download VLC Media Player.",
      "Open VLC Media Player.",
      "Choose Media > Open Network Stream.",
      "Enter your VistraTV stream URL.",
      "Start streaming.",
      "Configure settings.",
      "Enjoy your content.",
    ],
    windows: [
      "Download VLC Media Player.",
      "Open VLC Media Player.",
      "Choose Media > Open Network Stream.",
      "Enter your VistraTV stream URL.",
      "Start streaming.",
      "Configure settings.",
      "Enjoy your content.",
    ],
    kodi: [
      "Install PVR IPTV Simple Client.",
      "Open PVR IPTV Simple Client.",
      "Choose login method.",
      "Enter your VistraTV credentials.",
      "Configure settings.",
      "Start streaming.",
      "Browse and enjoy channels.",
      "Enjoy your content.",
    ],
    chromecast: [
      "Open Google Play Store on your Android device.",
      "Search for IPTV Smarters Pro.",
      "Download and install the application.",
      "Open IPTV Smarters Pro.",
      "Choose login method.",
      "Enter your VistraTV credentials.",
      "Start streaming.",
    ],
    playstation: [
      "Open Media Player on your PlayStation.",
      "Enter your VistraTV stream URL.",
      "Start streaming.",
      "Browse and enjoy channels.",
      "Enjoy your content.",
    ],
    xbox: [
      "Open MyIPTV Player on your Xbox.",
      "Enter your VistraTV stream URL.",
      "Start streaming.",
      "Browse and enjoy channels.",
      "Enjoy your content.",
    ],
  }

  return titles[device]?.[step] || `Configuration step ${step + 1}`
}

function getStepDescription(device: string, step: number): string {
  const descriptions: Record<string, string[]> = {
    "smart-tv": [
      "Navigate to the Google Play Store on your Smart TV using your remote control.",
      'Use the search function to find "IPTV Smarters Pro" application.',
      "Click on the Install button and wait for the download to complete.",
      "Once installed, open the IPTV Smarters Pro application from your apps menu.",
      'On the welcome screen, choose "Login with Xtream Codes API" option.',
      "Enter the username, password, and server URL provided in your VistraTV subscription email.",
      "Go to settings and select your preferred video player and streaming quality.",
      "Return to the home screen and start browsing channels and content.",
    ],
    "android-box": [
      "Open the Google Play Store app on your Android TV Box.",
      'Search for "IPTV Smarters Pro" using the search bar.',
      "Download and install the application on your device.",
      "Open IPTV Smarters Pro from your apps list.",
      'Choose "Login with Xtream Codes API" from the options.',
      "Input your VistraTV credentials (username, password, and server URL).",
      "Browse and enjoy thousands of channels and VOD content.",
    ],
    "android-phone": [
      "Open Google Play Store on your Android device.",
      'Search for "IPTV Smarters Pro" using the search bar.',
      "Download and install the application.",
      "Open the IPTV Smarters Pro app.",
      'Choose "Login with Xtream Codes API" from the options.',
      "Enter your VistraTV credentials and start enjoying your content.",
    ],
    "fire-stick": [
      "Navigate to Settings > System > Developer Options.",
      "Enable 'Apps from unknown sources'.",
      "Open Downloader app.",
      "Download IPTV Smarters Pro APK.",
      "Install the APK on your Fire TV Stick.",
      "Open IPTV Smarters Pro app.",
      'Choose "Login with Xtream Codes API" from the options.',
      "Enter your VistraTV credentials.",
      "Configure settings and start streaming.",
    ],
    "apple-tv": [
      "Open the App Store on your Apple TV.",
      "Search for GSE Smart IPTV.",
      "Download and install the application.",
      "Launch GSE Smart IPTV.",
      "Choose login method.",
      "Enter your VistraTV credentials.",
      "Browse and enjoy channels.",
    ],
    iphone: [
      "Open the App Store on your iPhone.",
      "Search for GSE Smart IPTV.",
      "Download and install the application.",
      "Launch GSE Smart IPTV.",
      "Choose login method.",
      "Enter your VistraTV credentials.",
      "Enjoy your content.",
    ],
    mac: [
      "Visit the VLC Media Player website.",
      "Download the VLC Media Player installer.",
      "Open the installer and follow the instructions.",
      "Choose Media > Open Network Stream.",
      "Enter your VistraTV stream URL.",
      "Start streaming.",
      "Configure settings.",
      "Enjoy your content.",
    ],
    windows: [
      "Visit the VLC Media Player website.",
      "Download the VLC Media Player installer.",
      "Open the installer and follow the instructions.",
      "Choose Media > Open Network Stream.",
      "Enter your VistraTV stream URL.",
      "Start streaming.",
      "Configure settings.",
      "Enjoy your content.",
    ],
    kodi: [
      "Install PVR IPTV Simple Client from Kodi's Add-ons repository.",
      "Open PVR IPTV Simple Client.",
      "Choose login method.",
      "Enter your VistraTV credentials.",
      "Configure settings.",
      "Start streaming.",
      "Browse and enjoy channels.",
      "Enjoy your content.",
    ],
    chromecast: [
      "Open Google Play Store on your Android device.",
      "Search for IPTV Smarters Pro.",
      "Download and install the application.",
      "Open IPTV Smarters Pro.",
      "Choose login method.",
      "Enter your VistraTV credentials.",
      "Start streaming.",
    ],
    playstation: [
      "Open Media Player on your PlayStation.",
      "Enter your VistraTV stream URL.",
      "Start streaming.",
      "Browse and enjoy channels.",
      "Enjoy your content.",
    ],
    xbox: [
      "Open MyIPTV Player on your Xbox.",
      "Enter your VistraTV stream URL.",
      "Start streaming.",
      "Browse and enjoy channels.",
      "Enjoy your content.",
    ],
  }

  return descriptions[device]?.[step] || "Follow the on-screen instructions to complete this step."
}
