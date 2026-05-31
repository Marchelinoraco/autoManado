"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Car } from "lucide-react";
import { waLink } from "@/lib/whatsapp";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/katalog", label: "Katalog" },
  { href: "/promo", label: "Promo" },
  { href: "/tentang", label: "Tentang" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-ink/80 backdrop-blur-lg"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative grid h-9 w-9 place-items-center rounded-xl gradient-sunset">
            <Car className="h-5 w-5 text-ink" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">
            Auto<span className="text-gradient">Manado</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => {
            const activeLink = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`group relative text-sm font-medium transition ${
                  activeLink ? "text-emas" : "text-gray-300 hover:text-white"
                }`}
              >
                {l.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-0.5 gradient-sunset transition-all duration-300 ${
                    activeLink ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
          <a
            href={waLink("Halo AutoManado, saya ingin bertanya soal rental/jual mobil di Manado.")}
            target="_blank"
            className="rounded-full gradient-sunset px-5 py-2 text-sm font-semibold text-ink transition hover:opacity-90"
          >
            Hubungi WhatsApp
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="text-gray-200 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-ink/95 px-4 py-4 backdrop-blur-lg md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-2.5 text-sm transition ${
                  pathname === l.href ? "bg-white/5 text-emas" : "text-gray-200 hover:bg-white/5"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <a
              href={waLink("Halo AutoManado, saya ingin bertanya soal rental/jual mobil di Manado.")}
              target="_blank"
              className="mt-2 rounded-full gradient-sunset px-5 py-2.5 text-center font-semibold text-ink"
            >
              Hubungi WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
