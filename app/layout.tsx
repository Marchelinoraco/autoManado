import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { CompareProvider } from "@/components/CompareProvider";
import CompareBar from "@/components/CompareBar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SITE, SITE_URL, businessJsonLd } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Rental & Jual Mobil Manado Terpercaya | AutoManado",
    template: "%s | AutoManado",
  },
  description: SITE.description,
  alternates: { canonical: "/" },
  keywords: [
    "rental mobil Manado",
    "sewa mobil Manado",
    "rental mobil Manado murah",
    "sewa mobil lepas kunci Manado",
    "rental mobil dengan sopir Manado",
    "jual mobil Manado",
    "jual beli mobil bekas Manado",
    "rental mobil Sulawesi Utara",
    "AutoManado",
  ],
  openGraph: {
    title: "Rental & Jual Mobil Manado Terpercaya | AutoManado",
    description:
      "Sewa & beli mobil terbaik di Kota Manado. Pesan mudah via WhatsApp.",
    url: SITE_URL,
    siteName: SITE.name,
    type: "website",
    locale: "id_ID",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.variable}>
      <head>
        {/* Anti-flash: terapkan tema sebelum render */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.classList.toggle('dark',t==='dark')})()`,
          }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased bg-white dark:bg-gray-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />
        <ThemeProvider>
          <CompareProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <FloatingWhatsApp />
            <CompareBar />
          </CompareProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
