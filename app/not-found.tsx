import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center px-4 py-32 text-center">
      <h1 className="text-6xl font-extrabold text-merah">404</h1>
      <p className="mt-4 text-xl">Halaman tidak ditemukan</p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-merah px-6 py-3 font-semibold text-white transition hover:bg-merah/90"
      >
        Kembali ke Beranda
      </Link>
    </section>
  );
}
