import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Admin Login | AutoManado" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-2xl font-extrabold">Admin AutoManado</h1>
        <p className="mt-1 text-sm text-gray-400">Masuk ke panel manajemen</p>
        <LoginForm />
      </div>
    </div>
  );
}
