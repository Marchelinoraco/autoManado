import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { CompareProvider } from "@/components/CompareProvider";
import CompareBar from "@/components/CompareBar";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://automanado.vercel.app"),
  title: {
    default: "Rental & Jual Mobil Manado Terpercaya | AutoManado",
    template: "%s | AutoManado",
  },
  description:
    "AutoManado — marketplace rental dan jual-beli mobil terbaik di Kota Manado, Sulawesi Utara. Sewa mobil harian, mingguan, bulanan, dan beli mobil berkualitas. Pesan mudah via WhatsApp.",
  keywords: [
    "rental mobil Manado",
    "sewa mobil Manado",
    "jual mobil Manado",
    "rental mobil Sulawesi Utara",
    "AutoManado",
  ],
  openGraph: {
    title: "Rental & Jual Mobil Manado Terpercaya | AutoManado",
    description:
      "Sewa & beli mobil terbaik di Kota Manado. Pesan mudah via WhatsApp.",
    type: "website",
    locale: "id_ID",
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
