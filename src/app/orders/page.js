import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getSession } from "@/lib/session";
import { getLang } from "@/lib/i18n";
import { getUserOrders, formatOrderTime } from "@/lib/orders";
import { orderText } from "@/data/orderText";
import { toBnNumber } from "@/lib/format";

const badge = {
  pending: "bg-yellow-50 text-yellow-700",
  confirmed: "bg-blue-50 text-blue-700",
  delivering: "bg-purple-50 text-purple-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-600",
};

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const lang = await getLang();
  const o = orderText[lang];
  const orders = await getUserOrders(session.user.id);

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8 pb-16">
        <h1 className="text-2xl font-bold">📦 {o.myOrders}</h1>

        {orders.length === 0 ? (
          <div className="mt-6 bg-white border border-gray-200 rounded-3xl p-8 text-center">
            <p className="text-gray-600">{o.noOrders}</p>
            <Link
              href="/products"
              className="inline-block mt-4 bg-brand text-white text-sm font-semibold px-5 py-2.5 rounded-full"
            >
              {o.browse}
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block bg-white border border-gray-200 rounded-2xl p-4 hover:border-brand transition"
              >
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <p className="font-bold">#{order.orderNo}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatOrderTime(order.createdAt, lang)} ·{" "}
                      {o.itemsCount.replace("{n}", toBnNumber(order.itemCount, 0, lang))}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full ${badge[order.status] ?? badge.pending}`}
                  >
                    {o.statuses[order.status] ?? order.status}
                  </span>
                  <span className="font-bold text-brand">
                    {toBnNumber(order.total, 0, lang)} {o.taka}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}