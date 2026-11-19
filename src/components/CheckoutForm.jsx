"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCart, clearCart } from "@/lib/cart";
import { placeOrder } from "@/app/checkout/actions";
import { toBnNumber } from "@/lib/format";

const field =
  "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand bg-white";

export default function CheckoutForm({ products, lang, labels, defaultName }) {
  const router = useRouter();
  const cart = useCart();
  const [payment, setPayment] = useState("cod");
  const [pending, startTransition] = useTransition();

  const byId = new Map(products.map((p) => [p.id, p]));
  const rows = Object.entries(cart)
    .map(([id, qty]) => ({ product: byId.get(Number(id)), qty }))
    .filter((r) => r.product && r.qty > 0);
  const total = rows.reduce((sum, r) => sum + r.product.price * r.qty, 0);

  if (rows.length === 0) {
    return (
      <div className="mt-6 bg-white border border-gray-200 rounded-3xl p-8 text-center">
        <p className="text-gray-600">{labels.empty}</p>
        <Link
          href="/products"
          className="inline-block mt-4 bg-brand text-white text-sm font-semibold px-5 py-2.5 rounded-full"
        >
          {labels.browse}
        </Link>
      </div>
    );
  }

  const errorText = (res) => {
    if (res.error === "stock") {
      const p = byId.get(res.productId);
      return labels.stockError
        .replace("{name}", p?.displayName ?? "")
        .replace("{n}", toBnNumber(res.available, res.available % 1 ? 1 : 0, lang));
    }
    return labels.errors[res.error] ?? labels.errors.server;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const payload = {
      name: data.get("name"),
      phone: data.get("phone"),
      address: data.get("address"),
      note: data.get("note"),
      payment,
      trxId: data.get("trxId"),
      items: rows.map((r) => ({ productId: r.product.id, qty: r.qty })),
    };
    startTransition(async () => {
      const res = await placeOrder(payload);
      if (res.ok) {
        clearCart();
        router.push(`/orders/${res.id}?placed=1`);
      } else {
        toast.error(errorText(res));
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-6">
        <section className="bg-white border border-gray-200 rounded-3xl p-6 space-y-4">
          <h2 className="font-bold">{labels.delivery}</h2>
          <input name="name" required defaultValue={defaultName} placeholder={labels.fullName} className={field} />
          <input name="phone" required inputMode="tel" placeholder={labels.phone} className={field} />
          <textarea name="address" required rows={3} placeholder={labels.address} className={field} />
          <input name="note" placeholder={labels.note} className={field} />
        </section>

        <section className="bg-white border border-gray-200 rounded-3xl p-6 space-y-3">
          <h2 className="font-bold">{labels.payment}</h2>
          {["cod", "bkash"].map((key) => (
            <label
              key={key}
              className={`flex items-start gap-3 border rounded-xl p-3 cursor-pointer ${
                payment === key ? "border-brand bg-brand-soft" : "border-gray-200"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={key}
                checked={payment === key}
                onChange={() => setPayment(key)}
                className="mt-1"
              />
              <span>
                <span className="block font-semibold text-sm">{labels[key]}</span>
                <span className="block text-xs text-gray-500">{labels[`${key}Hint`]}</span>
              </span>
            </label>
          ))}
          {payment === "bkash" && (
            <div className="space-y-3">
              <p className="text-xs text-gray-600 bg-gray-50 rounded-xl p-3">{labels.bkashBox}</p>
              <input name="trxId" required placeholder={labels.trxId} className={field} />
            </div>
          )}
        </section>
      </div>

      <aside className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-6 h-fit">
        <h2 className="font-bold">{labels.summary}</h2>
        <div className="mt-3 divide-y divide-gray-100">
          {rows.map(({ product: p, qty }) => (
            <div key={p.id} className="py-2.5 flex items-center gap-2 text-sm">
              <span className="text-xl">{p.icon}</span>
              <span className="flex-1">
                {p.displayName}
                <span className="block text-xs text-gray-500">
                  {toBnNumber(qty, qty % 1 ? 1 : 0, lang)} {p.displayUnitShort}
                </span>
              </span>
              <span className="font-bold">{toBnNumber(p.price * qty, 0, lang)} ৳</span>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl bg-brand-soft px-4 py-3 flex items-center justify-between">
          <span className="font-semibold">{labels.total}</span>
          <span className="text-xl font-bold text-brand">
            {toBnNumber(total, 0, lang)} {labels.taka}
          </span>
        </div>
        <button
          disabled={pending}
          className="mt-4 w-full bg-brand text-white font-semibold rounded-xl py-2.5 text-sm disabled:opacity-60"
        >
          {pending ? labels.placing : labels.placeOrder}
        </button>
      </aside>
    </form>
  );
}