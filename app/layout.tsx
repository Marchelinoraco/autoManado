import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { CompareProvider } from "@/components/CompareProvider";
import CompareBar from "@/components/CompareBar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-display",
});

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
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <CompareProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <FloatingWhatsApp />
          <CompareBar />
        </CompareProvider>
      </body>
    </html>
  );
}
