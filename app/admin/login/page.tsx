import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Admin Login | AutoManado" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h1 className="text-2xl font-bold text-gray-900">Admin AutoManado</h1>
        <p className="mt-1 text-sm text-gray-500">Masuk ke panel manajemen</p>
        <LoginForm />
      </div>
    </div>
  );
}
