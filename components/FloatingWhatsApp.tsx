import { waLink } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  return (
    <a
      href={waLink("Halo AutoManado, saya tertarik dengan layanan rental/jual mobil di Manado.")}
      target="_blank"
      aria-label="Chat WhatsApp"
      className="group fixed bottom-24 right-5 z-40 flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3 font-semibold text-white shadow-xl shadow-[#25D366]/30 transition hover:scale-105 sm:bottom-5"
    >
      <span className="relative flex h-6 w-6 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40 opacity-75" />
        <MessageCircle className="relative h-6 w-6" />
      </span>
      <span className="hidden sm:flex sm:flex-col sm:leading-tight">
        <span className="text-sm">Chat WhatsApp</span>
        <span className="text-[10px] font-normal text-white/80">Balas cepat ±10 menit</span>
      </span>
    </a>
  );
}
