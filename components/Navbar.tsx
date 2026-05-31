"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { waLink } from "@/lib/whatsapp";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";

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
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-gray-200/80 bg-white/90 shadow-sm backdrop-blur-lg dark:border-gray-700/80 dark:bg-gray-900/90"
          : "bg-white dark:bg-gray-900"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Logo size={38} />
          <span className="text-[1.15rem] font-bold leading-none tracking-tight text-gray-900 dark:text-white">
            Auto<span className="text-teal">Manado</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => {
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`group relative text-sm font-medium transition-colors ${
                  isActive
                    ? "text-teal"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                {l.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-teal transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}

          <div className="h-5 w-px bg-gray-200 dark:bg-gray-700" />

          <ThemeToggle />

          <a
            href={waLink("Halo AutoManado, saya ingin bertanya soal rental/jual mobil di Manado.")}
            target="_blank"
            className="rounded-full bg-teal px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal/90 hover:shadow-md"
          >
            Hubungi WhatsApp
          </a>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  pathname === l.href
                    ? "bg-teal/10 text-teal"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <a
              href={waLink("Halo AutoManado, saya ingin bertanya soal rental/jual mobil di Manado.")}
              target="_blank"
              className="mt-2 rounded-full bg-teal px-5 py-2.5 text-center text-sm font-semibold text-white"
            >
              Hubungi WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
