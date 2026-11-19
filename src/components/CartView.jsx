"use client";
import Link from "next/link";
import { useCart, addToCart, setQty, removeFromCart, clearCart } from "@/lib/cart";
import { toBnNumber } from "@/lib/format";

export default function CartView({ products, lang, labels, loggedIn }) {
  const cart = useCart();
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

  return (
    <div className="mt-6 bg-white border border-gray-200 rounded-3xl p-6">
      <div className="flex justify-end">
        <button type="button" onClick={clearCart} className="text-sm text-red-600 font-medium">
          {labels.clear}
        </button>
      </div>

      <div className="mt-2 divide-y divide-gray-100">
        {rows.map(({ product: p, qty }) => (
          <div key={p.id} className="py-3 flex items-center gap-3">
            <span className="w-11 h-11 rounded-xl bg-gray-50 grid place-items-center text-2xl">{p.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{p.displayName}</p>
              <p className="text-xs text-gray-500">
                {toBnNumber(p.price, 0, lang)} {labels.taka} {p.displayUnit}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQty(p.id, qty - p.step)}
                className="w-8 h-8 rounded-full border border-gray-200 hover:bg-gray-50"
              >
                −
              </button>
              <span className="w-14 text-center text-sm font-semibold">
                {toBnNumber(qty, qty % 1 ? 1 : 0, lang)} {p.displayUnitShort}
              </span>
              <button
                type="button"
                onClick={() => addToCart(p.id, p.step)}
                className="w-8 h-8 rounded-full border border-gray-200 hover:bg-gray-50"
              >
                +
              </button>
            </div>
            <span className="w-20 text-right font-bold text-sm">
              {toBnNumber(p.price * qty, 0, lang)} ৳
            </span>
            <button
              type="button"
              onClick={() => removeFromCart(p.id)}
              aria-label={labels.remove}
              className="text-gray-400 hover:text-red-600 text-lg"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-brand-soft px-5 py-4 flex items-center justify-between">
        <span className="font-semibold">{labels.total}</span>
        <span className="text-2xl font-bold text-brand">
          {toBnNumber(total, 0, lang)} {labels.taka}
        </span>
      </div>

      {loggedIn ? (
        <Link
          href="/checkout"
          className="mt-4 block text-center w-full bg-brand text-white font-semibold rounded-xl py-2.5 text-sm"
        >
          {labels.checkout}
        </Link>
      ) : (
        <Link
          href="/login"
          className="mt-4 block text-center w-full bg-brand text-white font-semibold rounded-xl py-2.5 text-sm"
        >
          {labels.signInToOrder}
        </Link>
      )}
    </div>
  );
}