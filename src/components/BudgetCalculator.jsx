"use client";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { saveBudget } from "@/app/budget/actions";
import { toBnNumber } from "@/lib/format";

const unitLabel = (p) => p.unit.replace("প্রতি ", "");
const stepFor = (p) => (["কেজি", "লিটার"].includes(unitLabel(p)) ? 0.5 : 1);

export default function BudgetCalculator({ products, saved }) {
  const [qtys, setQtys] = useState(() =>
    Object.fromEntries(saved.map((i) => [i.productId, i.qty]))
  );
  const [pending, startTransition] = useTransition();

  const qtyOf = (p) => qtys[p.id] ?? 1;
  const total = products.reduce((sum, p) => sum + p.price * qtyOf(p), 0);

  const setQty = (id, value) => {
    const q = Number(value);
    setQtys((prev) => ({ ...prev, [id]: q >= 0 ? q : 0 }));
  };

  const save = () => {
    const items = products.map((p) => ({ productId: p.id, qty: qtyOf(p) }));
    startTransition(async () => {
      const res = await saveBudget(items);
      if (res.ok) toast.success("বাজেট সংরক্ষণ হয়েছে");
      else toast.error("সংরক্ষণ করা যায়নি");
    });
  };

  return (
    <section className="mt-10 bg-white border border-gray-200 rounded-3xl p-6">
      <h2 className="text-xl font-bold">🧮 বাজারের বাজেট</h2>
      <p className="mt-1 text-sm text-gray-500">
        প্রতিটি পণ্যের পরিমাণ দিন, আজকের দামে মোট খরচ দেখুন।
      </p>

      <div className="mt-4 divide-y divide-gray-100">
        {products.map((p) => (
          <div key={p.id} className="py-3 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gray-50 grid place-items-center text-xl">
              {p.icon}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{p.name}</p>
              <p className="text-xs text-gray-500">
                {toBnNumber(p.price)} টাকা {p.unit}
              </p>
            </div>
            <input
              type="number"
              min="0"
              step={stepFor(p)}
              value={qtyOf(p)}
              onChange={(e) => setQty(p.id, e.target.value)}
              className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center outline-none focus:border-brand"
            />
            <span className="text-xs text-gray-500 w-12">{unitLabel(p)}</span>
            <span className="w-20 text-right font-bold text-sm">
              {toBnNumber(p.price * qtyOf(p))} ৳
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-brand-soft px-5 py-4 flex items-center justify-between">
        <span className="font-semibold">মোট খরচ</span>
        <span className="text-2xl font-bold text-brand">{toBnNumber(total)} টাকা</span>
      </div>

      <button
        type="button"
        onClick={save}
        disabled={pending}
        className="mt-4 w-full bg-brand text-white font-semibold rounded-xl py-2.5 text-sm disabled:opacity-60"
      >
        {pending ? "সংরক্ষণ হচ্ছে..." : "বাজেট সংরক্ষণ করুন"}
      </button>
    </section>
  );
}