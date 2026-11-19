import { toBnNumber } from "@/lib/format";
import { updateStock } from "@/app/admin/stock-actions";

const messages = {
  ok: { cls: "bg-green-50 text-green-700", text: "স্টক আপডেট হয়েছে" },
  invalid: { cls: "bg-red-50 text-red-600", text: "সঠিক পরিমাণ দিন" },
};

export default function StockManager({ products, status }) {
  const msg = messages[status];

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-8">
      <h2 className="text-xl font-bold">📦 স্টক ম্যানেজমেন্ট</h2>
      <p className="mt-1 text-sm text-gray-500">
        <b>+ যোগ</b> চাপলে বর্তমান স্টকের সাথে যোগ হবে, <b>= সেট</b> চাপলে স্টক ঠিক ঐ সংখ্যাই হবে।
      </p>

      {msg && <p className={`mt-4 text-sm rounded-xl px-4 py-2.5 ${msg.cls}`}>{msg.text}</p>}

      <div className="mt-4 divide-y divide-gray-100">
        {products.map((p) => {
          const known = typeof p.stock === "number";
          const cls = !known
            ? "text-gray-500"
            : p.stock <= 0
            ? "text-red-600"
            : p.stock <= 10
            ? "text-orange-600"
            : "text-green-700";

          return (
            <form key={p.id} action={updateStock} className="py-3 flex items-center gap-2 flex-wrap">
              <input type="hidden" name="id" value={p.id} />
              <span className="text-xl">{p.icon}</span>
              <span className="flex-1 min-w-32 text-sm font-semibold">{p.name}</span>
              <span className={`w-20 text-sm font-bold ${cls}`}>
                {known ? toBnNumber(p.stock, p.stock % 1 ? 1 : 0) : "—"}
              </span>
              <input
                name="amount"
                type="number"
                min="0"
                step="any"
                required
                placeholder="পরিমাণ"
                className="w-24 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center outline-none focus:border-brand bg-white"
              />
              <button
                name="mode"
                value="add"
                className="bg-brand text-white text-xs font-semibold rounded-lg px-3 py-2"
              >
                + যোগ
              </button>
              <button
                name="mode"
                value="set"
                className="border border-gray-200 text-xs font-semibold rounded-lg px-3 py-2 hover:bg-gray-50"
              >
                = সেট
              </button>
            </form>
          );
        })}
      </div>
    </div>
  );
}