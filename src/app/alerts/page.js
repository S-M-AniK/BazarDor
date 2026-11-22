import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import MarkReadButton from "@/components/MarkReadButton";
import { getSession } from "@/lib/session";
import { getLang } from "@/lib/i18n";
import { getAlerts } from "@/lib/alerts";
import { formatOrderTime } from "@/lib/orders";
import { alertText } from "@/data/alertText";
import { productName } from "@/data/translations";
import { toBnNumber } from "@/lib/format";

export default async function AlertsPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/alerts");

  const lang = await getLang();
  const a = alertText[lang];
  const alerts = await getAlerts(session.user.id);
  const hasUnread = alerts.some((x) => !x.read);

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8 pb-16">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h1 className="text-2xl font-bold">🔔 {a.title}</h1>
          {hasUnread && <MarkReadButton label={a.markRead} doneMsg={a.marked} failMsg={a.fail} />}
        </div>
        <p className="mt-1 text-sm text-gray-500">{a.hint}</p>

        {alerts.length === 0 ? (
          <div className="mt-6 bg-white border border-gray-200 rounded-3xl p-8 text-center">
            <p className="font-semibold">{a.empty}</p>
            <p className="mt-1 text-sm text-gray-500">{a.emptyHint}</p>
            <Link
              href="/products"
              className="inline-block mt-4 bg-brand text-white text-sm font-semibold px-5 py-2.5 rounded-full"
            >
              {a.browse}
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {alerts.map((x) => {
              const down = x.newPrice < x.oldPrice;
              const pct = Math.abs(((x.newPrice - x.oldPrice) / x.oldPrice) * 100);
              return (
                <Link
                  key={x.id}
                  href={`/products/${x.productId}`}
                  className={`block border rounded-2xl p-4 transition hover:border-brand ${
                    x.read ? "bg-white border-gray-200" : "bg-brand-soft border-brand"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="w-11 h-11 rounded-xl bg-gray-50 grid place-items-center text-2xl">
                      {x.icon}
                    </span>
                    <div className="flex-1 min-w-40">
                      <p className="font-semibold">
                        {productName({ id: x.productId, name: x.name, nameEn: x.nameEn }, lang)}
                        {!x.read && (
                          <span className="ml-2 text-xs bg-brand text-white rounded-full px-2 py-0.5">
                            {a.newBadge}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">{formatOrderTime(x.createdAt, lang)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {toBnNumber(x.oldPrice, 0, lang)} → {toBnNumber(x.newPrice, 0, lang)} {a.taka}
                      </p>
                      <p className={`text-xs font-semibold ${down ? "text-green-700" : "text-red-600"}`}>
                        {down ? "▼" : "▲"} {down ? a.down : a.up} ({toBnNumber(pct, 1, lang)}%)
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}