import type { Metadata, Viewport } from "next";
import { Fraunces, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { StickyWhatsApp } from "@/components/StickyWhatsApp";
import { Grain } from "@/components/decor/Grain";
import { SmoothScroll } from "@/components/decor/SmoothScroll";
import { ScrollProgress } from "@/components/decor/ScrollProgress";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { localBusinessSchema, organizationSchema, websiteSchema } from "@/lib/schema";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = buildMetadata();

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0e2a1e" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${fraunces.variable} ${interTight.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-bone text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-forest-deep focus:px-4 focus:py-2 focus:text-bone focus:outline focus:outline-2 focus:outline-leaf"
        >
          Skip to content
        </a>
        <Grain />
        <ScrollProgress />
        <Navigation />
        <SmoothScroll>
          <main id="main">{children}</main>
        </SmoothScroll>
        <Footer />
        <StickyWhatsApp />
        <JsonLd id="ld-business" data={localBusinessSchema} />
        <JsonLd id="ld-org" data={organizationSchema} />
        <JsonLd id="ld-website" data={websiteSchema} />
      </body>
    </html>
  );
}
