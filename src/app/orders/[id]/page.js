import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import CancelOrderButton from "@/components/CancelOrderButton";
import { getSession } from "@/lib/session";
import { getLang } from "@/lib/i18n";
import { getOrder, formatOrderTime } from "@/lib/orders";
import { orderText } from "@/data/orderText";
import { productName, unitFull } from "@/data/translations";
import { toBnNumber } from "@/lib/format";

const badge = {
  pending: "bg-yellow-50 text-yellow-700",
  confirmed: "bg-blue-50 text-blue-700",
  delivering: "bg-purple-50 text-purple-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-600",
};

export default async function OrderPage({ params, searchParams }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const lang = await getLang();
  const o = orderText[lang];
  const { id } = await params;
  const { placed } = await searchParams;

  const order = await getOrder(id);
  const isAdmin = session.user.email === process.env.ADMIN_EMAIL;
  const isOwner = order?.userId === session.user.id;
  if (!order || (!isOwner && !isAdmin)) notFound();

  const fee = order.deliveryFee ?? 0;
  const subtotal = order.subtotal ?? order.total - fee;
  const hasBreakdown = order.deliveryFee !== undefined;

  const cancelLabels = {
    hint: o.cancelHint,
    button: o.cancelOrder,
    wait: o.cancelWait,
    confirm: o.cancelConfirm,
    done: o.cancelDone,
    fail: o.cancelFail,
  };

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8 pb-16 space-y-6">
        {placed && (
          <p className="text-sm bg-green-50 text-green-700 rounded-xl px-4 py-3">{o.placedBanner}</p>
        )}

        <section className="bg-white border border-gray-200 rounded-3xl p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold">
                {o.orderTitle} #{order.orderNo}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {o.placedAt}: {formatOrderTime(order.createdAt, lang)}
              </p>
            </div>
            <span className={`text-sm font-semibold px-3 py-1.5 rounded-full ${badge[order.status] ?? badge.pending}`}>
              {o.statuses[order.status] ?? order.status}
            </span>
          </div>

          <div className="mt-5 divide-y divide-gray-100">
            {order.items.map((it) => (
              <div key={it.productId} className="py-3 flex items-center gap-3 text-sm">
                <span className="text-2xl">{it.icon}</span>
                <span className="flex-1">
                  {productName({ id: it.productId, name: it.name, nameEn: it.nameEn }, lang)}
                  <span className="block text-xs text-gray-500">
                    {toBnNumber(it.price, 0, lang)} {o.taka} {unitFull(it.unit, lang)} ×{" "}
                    {toBnNumber(it.qty, it.qty % 1 ? 1 : 0, lang)}
                  </span>
                </span>
                <span className="font-bold">{toBnNumber(it.lineTotal, 0, lang)} ৳</span>
              </div>
            ))}
          </div>

          {hasBreakdown && (
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">{o.subtotal}</span>
                <span>
                  {toBnNumber(subtotal, 0, lang)} {o.taka}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">{o.deliveryCharge}</span>
                <span className={fee === 0 ? "text-green-700 font-semibold" : ""}>
                  {fee === 0 ? o.freeDelivery : `${toBnNumber(fee, 0, lang)} ${o.taka}`}
                </span>
              </div>
            </div>
          )}

          <div className="mt-3 rounded-2xl bg-brand-soft px-5 py-4 flex items-center justify-between">
            <span className="font-semibold">{o.total}</span>
            <span className="text-2xl font-bold text-brand">
              {toBnNumber(order.total, 0, lang)} {o.taka}
            </span>
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-3xl p-6 grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <p className="text-gray-500">{o.deliverTo}</p>
            <p className="mt-1 font-semibold">{order.name}</p>
            <p>{order.phone}</p>
            <p>{order.address}</p>
            {order.note && <p className="text-gray-500 mt-1">{order.note}</p>}
          </div>
          <div>
            <p className="text-gray-500">{o.paymentLabel}</p>
            <p className="mt-1 font-semibold">{order.payment === "bkash" ? o.bkash : o.cod}</p>
            <p>{order.paymentStatus === "paid" ? o.paid : o.unpaid}</p>
            {order.trxId && <p className="text-gray-500">{order.trxId}</p>}
          </div>
        </section>

        {isOwner && order.status === "pending" && (
          <CancelOrderButton orderId={order.id} labels={cancelLabels} />
        )}

        <Link
          href="/products"
          className="inline-block bg-brand text-white text-sm font-semibold px-5 py-2.5 rounded-full"
        >
          {o.continueShopping}
        </Link>
      </main>
    </>
  );
}