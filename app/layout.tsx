import { Geist_Mono, Inter, Space_Grotesk } from "next/font/google"
import type { Metadata, Viewport } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ConvexClientProvider } from "@/components/ConvexClientProvider"
import { getToken } from "@/lib/auth-server"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toast"
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  TAGLINE,
} from "@/lib/site"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const themeInitScript = `(function () {
  try {
    var stored = localStorage.getItem("theme");
    var theme = stored || "system";
    var dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    var el = document.documentElement;
    el.classList.toggle("dark", dark);
    el.style.colorScheme = dark ? "dark" : "light";
  } catch (e) {}
})();`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "YouTube creator tools",
  keywords: [
    "faceless youtube channels",
    "faceless youtube niches",
    "find profitable youtube channel",
    "youtube channel ideas",
    "faceless channel research",
    "youtube competitor analysis",
    "youtube automation",
    "youtube outlier videos",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#141726" },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const token = await getToken()
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable,
        fontDisplay.variable
      )}
    >
      <body>
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <ConvexClientProvider initialToken={token}>
          <ThemeProvider>{children}</ThemeProvider>
          <Toaster />
        </ConvexClientProvider>
      </body>
    </html>
  )
}
