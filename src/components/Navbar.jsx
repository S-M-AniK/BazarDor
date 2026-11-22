import Link from "next/link";
import { bnDate } from "@/lib/format";
import { getSession } from "@/lib/session";
import { getT } from "@/lib/i18n";
import { getUnreadCount } from "@/lib/alerts";
import LogoutButton from "./LogoutButton";
import ThemeToggle from "./ThemeToggle";
import LangToggle from "./LangToggle";
import CartLink from "./CartLink";

export default async function Navbar() {
  const [session, { lang, t }] = await Promise.all([getSession(), getT()]);
  const user = session?.user;
  const unread = user ? await getUnreadCount(user.id) : 0;

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-brand text-white grid place-items-center text-xl">🛒</span>
          <span className="leading-tight">
            <span className="block font-bold">{t("siteName")}</span>
            <span className="block text-xs text-gray-500">{bnDate(lang)}</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <LangToggle lang={lang} />
          <Link href="/products" className="font-semibold text-sm">{t("products")}</Link>
          <CartLink label={t("cart")} />
          {user ? (
            <>
              <Link href="/alerts" aria-label="alerts" className="relative font-semibold text-sm">
                🔔
                {unread > 0 && (
                  <span className="absolute -top-2 -right-3 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-xs grid place-items-center">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </Link>
              {user.email === process.env.ADMIN_EMAIL && (
                <>
                  <Link href="/admin" className="font-semibold text-sm text-brand">{t("priceUpdate")}</Link>
                  <Link href="/admin/orders" className="font-semibold text-sm text-brand">
                    📋 {lang === "en" ? "Manage orders" : "অর্ডার ম্যানেজ"}
                  </Link>
                </>
              )}
              <Link href="/orders" className="font-semibold text-sm">📦 {t("myOrders")}</Link>
              <Link href="/favourites" className="font-semibold text-sm">♥ {t("favourites")}</Link>
              <Link href="/profile" className="font-semibold text-sm">{user.name}</Link>
              <LogoutButton
                label={t("signOut")}
                message={t("signedOut")}
                className="bg-brand text-white text-sm font-semibold px-5 py-2 rounded-full"
              />
            </>
          ) : (
            <>
              <Link href="/login" className="font-semibold text-sm">{t("signIn")}</Link>
              <Link href="/register" className="bg-brand text-white text-sm font-semibold px-5 py-2 rounded-full">
                {t("signUp")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}