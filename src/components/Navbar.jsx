import Link from "next/link";
import { bnDate } from "@/lib/format";
import { getSession } from "@/lib/session";
import LogoutButton from "./LogoutButton";
import ThemeToggle from "./ThemeToggle";

export default async function Navbar() {
  const session = await getSession();
  const user = session?.user;

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-brand text-white grid place-items-center text-xl">🛒</span>
          <span className="leading-tight">
            <span className="block font-bold">বাজার দর</span>
            <span className="block text-xs text-gray-500">{bnDate()}</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
                      <ThemeToggle />
          {user ? (
            <>
              <Link href="/products" className="font-semibold text-sm">পণ্য</Link>
                            {user.email === process.env.ADMIN_EMAIL && (
                <Link href="/admin" className="font-semibold text-sm text-brand">দাম আপডেট</Link>
              )}
              <Link href="/favourites" className="font-semibold text-sm">♥ পছন্দ</Link>
              <Link href="/profile" className="font-semibold text-sm">{user.name}</Link>
              <LogoutButton className="bg-brand text-white text-sm font-semibold px-5 py-2 rounded-full" />
            </>
          ) : (
            <>
              <Link href="/login" className="font-semibold text-sm">সাইন ইন</Link>
              <Link href="/register" className="bg-brand text-white text-sm font-semibold px-5 py-2 rounded-full">
                সাইন আপ
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}