import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import LogoutButton from "@/components/LogoutButton";
import { getSession } from "@/lib/session";
import { getT } from "@/lib/i18n";
import { getFavouriteIds } from "@/lib/favourites";
import { getUserOrders, formatOrderTime } from "@/lib/orders";
import { orderText } from "@/data/orderText";
import { profileText } from "@/data/profileText";
import { bnShortDate, toBnDigits, toBnNumber } from "@/lib/format";

const badge = {
  pending: "bg-yellow-50 text-yellow-700",
  confirmed: "bg-blue-50 text-blue-700",
  delivering: "bg-purple-50 text-purple-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-600",
};

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const { lang, t } = await getT();
  const p = profileText[lang];
  const o = orderText[lang];
  const { user } = session;
  const isAdmin = user.email === process.env.ADMIN_EMAIL;

  const [orders, favIds] = await Promise.all([
    getUserOrders(user.id),
    getFavouriteIds(user.id),
  ]);

  const spent = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.total, 0);

  const joined = new Date(user.createdAt);
  const year = joined.getUTCFullYear();
  const memberSince = `${bnShortDate(joined.toISOString(), lang)} ${lang === "en" ? year : toBnDigits(year)}`;

  const stats = [
    { label: p.orders, value: toBnNumber(orders.length, 0, lang) },
    { label: p.favourites, value: toBnNumber(favIds.length, 0, lang) },
    { label: p.spent, value: `${toBnNumber(spent, 0, lang)} ${p.taka}` },
  ];

  const links = [
    { href: "/orders", icon: "📦", label: p.myOrders },
    { href: "/favourites", icon: "♥", label: p.myFavourites },
    { href: "/cart", icon: "🛍️", label: p.myCart },
    ...(isAdmin ? [{ href: "/admin", icon: "⚙️", label: p.admin }] : []),
  ];

  const recent = orders.slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8 pb-16 space-y-6">
        <section className="bg-white border border-gray-200 rounded-3xl p-6 flex items-center gap-4 flex-wrap">
          <div className="w-16 h-16 rounded-full bg-brand-soft text-brand grid place-items-center text-2xl font-bold">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-48">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-xs text-gray-500 mt-1">
              {p.memberSince}: {memberSince}
            </p>
          </div>
          <LogoutButton
            label={t("signOut")}
            message={t("signedOut")}
            className="bg-brand text-white text-sm font-semibold px-5 py-2.5 rounded-full"
          />
        </section>

        <section className="grid grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-2xl p-4">
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="mt-1 text-xl font-bold text-brand">{s.value}</p>
            </div>
          ))}
        </section>

        <section className="bg-white border border-gray-200 rounded-3xl p-6">
          <h2 className="font-bold">{p.quickLinks}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold hover:border-brand hover:bg-brand-soft transition"
              >
                <span className="text-lg">{l.icon}</span>
                {l.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">{p.recent}</h2>
            {orders.length > 0 && (
              <Link href="/orders" className="text-sm text-brand font-semibold">
                {p.viewAll}
              </Link>
            )}
          </div>

          {recent.length === 0 ? (
            <div className="mt-4 text-center py-4">
              <p className="text-sm text-gray-500">{p.noOrders}</p>
              <Link
                href="/products"
                className="inline-block mt-3 bg-brand text-white text-sm font-semibold px-5 py-2.5 rounded-full"
              >
                {p.shop}
              </Link>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-gray-100">
              {recent.map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="py-3 flex items-center justify-between gap-3 flex-wrap hover:opacity-80"
                >
                  <div>
                    <p className="font-bold text-sm">#{order.orderNo}</p>
                    <p className="text-xs text-gray-500">{formatOrderTime(order.createdAt, lang)}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full ${badge[order.status] ?? badge.pending}`}
                  >
                    {o.statuses[order.status] ?? order.status}
                  </span>
                  <span className="font-bold text-sm text-brand">
                    {toBnNumber(order.total, 0, lang)} {p.taka}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}