import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getSession } from "@/lib/session";
import { getAdminOrders, getOrderCounts, formatOrderTime } from "@/lib/orders";
import { orderText } from "@/data/orderText";
import { toBnNumber } from "@/lib/format";
import { updateOrderStatus } from "./actions";

const o = orderText.bn;

const badge = {
  pending: "bg-yellow-50 text-yellow-700",
  confirmed: "bg-blue-50 text-blue-700",
  delivering: "bg-purple-50 text-purple-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-600",
};

const cancel = { to: "cancelled", label: "✕ বাতিল", primary: false };

const actions = {
  pending: [{ to: "confirmed", label: "✔ নিশ্চিত করুন", primary: true }, cancel],
  confirmed: [{ to: "delivering", label: "🚚 ডেলিভারিতে পাঠান", primary: true }, cancel],
  delivering: [{ to: "delivered", label: "✅ ডেলিভারি হয়েছে", primary: true }, cancel],
};

const tabs = [
  { key: "", label: "সব" },
  { key: "pending", label: o.statuses.pending },
  { key: "confirmed", label: o.statuses.confirmed },
  { key: "delivering", label: o.statuses.delivering },
  { key: "delivered", label: o.statuses.delivered },
  { key: "cancelled", label: o.statuses.cancelled },
];

export default async function AdminOrdersPage({ searchParams }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.email !== process.env.ADMIN_EMAIL) redirect("/");

  const { filter = "", msg } = await searchParams;
  const [orders, counts] = await Promise.all([getAdminOrders(filter), getOrderCounts()]);

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8 pb-16">
        <h1 className="text-2xl font-bold">📋 অর্ডার ম্যানেজমেন্ট</h1>

        {msg === "ok" && (
          <p className="mt-4 text-sm bg-green-50 text-green-700 rounded-xl px-4 py-2.5">
            অর্ডারের অবস্থা আপডেট হয়েছে
          </p>
        )}
        {msg === "invalid" && (
          <p className="mt-4 text-sm bg-red-50 text-red-600 rounded-xl px-4 py-2.5">
            এই পরিবর্তন করা যায়নি (অর্ডারের অবস্থা আগেই বদলে গেছে হতে পারে)
          </p>
        )}

        <div className="mt-5 flex gap-2 flex-wrap">
          {tabs.map((tab) => {
            const active = filter === tab.key;
            const n = tab.key ? counts[tab.key] ?? 0 : counts.all ?? 0;
            return (
              <Link
                key={tab.key || "all"}
                href={tab.key ? `/admin/orders?filter=${tab.key}` : "/admin/orders"}
                className={`px-4 py-1.5 rounded-full text-sm border ${
                  active ? "bg-brand text-white border-brand" : "bg-white border-gray-200"
                }`}
              >
                {tab.label} ({toBnNumber(n)})
              </Link>
            );
          })}
        </div>

        {orders.length === 0 ? (
          <div className="mt-6 bg-white border border-gray-200 rounded-3xl p-8 text-center text-gray-600">
            কোনো অর্ডার নেই
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {orders.map((order) => (
              <section key={order.id} className="bg-white border border-gray-200 rounded-3xl p-5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <Link href={`/orders/${order.id}`} className="font-bold text-brand">
                      #{order.orderNo}
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5">{formatOrderTime(order.createdAt, "bn")}</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${badge[order.status]}`}>
                    {o.statuses[order.status]}
                  </span>
                  <span className="font-bold text-lg">{toBnNumber(order.total)} টাকা</span>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
                  <div>
                    <p className="font-semibold">{order.name}</p>
                    <p>{order.phone}</p>
                    <p className="text-gray-600">{order.address}</p>
                    {order.note && <p className="text-gray-500">{order.note}</p>}
                  </div>
                  <div>
                    {order.items.map((it) => (
                      <p key={it.productId}>
                        {it.icon} {it.name} × {toBnNumber(it.qty, it.qty % 1 ? 1 : 0)}{" "}
                        {it.unit.replace("প্রতি ", "")}
                      </p>
                    ))}
                    <p className="mt-2 text-gray-600">
                      {order.payment === "bkash" ? o.bkash : o.cod} ·{" "}
                      {order.paymentStatus === "paid" ? "পরিশোধিত" : "বাকি"}
                      {order.trxId ? ` (${order.trxId})` : ""}
                    </p>
                  </div>
                </div>

                {actions[order.status] && (
                  <form action={updateOrderStatus} className="mt-4 flex gap-2 flex-wrap">
                    <input type="hidden" name="orderId" value={order.id} />
                    <input type="hidden" name="filter" value={filter} />
                    {actions[order.status].map((a) => (
                      <button
                        key={a.to}
                        name="status"
                        value={a.to}
                        className={`text-sm font-semibold rounded-xl px-4 py-2 ${
                          a.primary
                            ? "bg-brand text-white"
                            : "border border-red-200 text-red-600 hover:bg-red-50"
                        }`}
                      >
                        {a.label}
                      </button>
                    ))}
                  </form>
                )}
              </section>
            ))}
          </div>
        )}
      </main>
    </>
  );
}