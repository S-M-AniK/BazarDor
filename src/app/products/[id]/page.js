import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import PriceChart from "@/components/PriceChart";
import { getProduct, getHistory } from "@/lib/products";
import { marketPrices } from "@/lib/markets";
import { changePct, toBnNumber } from "@/lib/format";
import { getSession } from "@/lib/session";

export default async function ProductDetailPage({ params }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const history = await getHistory(id);
  const rows = marketPrices(product);
  const prices = rows.map((r) => r.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  const pct = changePct(product);

  const stats = [
    { label: "সর্বনিম্ন", value: min, cls: "text-green-700" },
    { label: "গড়", value: avg, cls: "text-gray-900" },
    { label: "সর্বাধিক", value: max, cls: "text-red-600" },
  ];

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8 pb-16">
        <Link href="/products" className="text-sm text-brand font-semibold">
          ← সব পণ্য
        </Link>

        <div className="mt-4 bg-white border border-gray-200 rounded-3xl p-6 flex items-center gap-4">
          <span className="w-16 h-16 rounded-2xl bg-gray-50 grid place-items-center text-4xl">{product.icon}</span>
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-sm text-gray-500">
              {product.unit} · আজকের দাম {toBnNumber(product.price)} টাকা ·{" "}
              {pct > 0 ? "▲" : pct < 0 ? "▼" : "—"} {toBnNumber(Math.abs(pct), 1)}%
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-2xl p-4">
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className={`mt-1 text-xl font-bold ${s.cls}`}>{toBnNumber(s.value)} টাকা</p>
            </div>
          ))}
        </div>

        <section className="mt-8 bg-white border border-gray-200 rounded-3xl p-6">
          <h2 className="font-bold">গত ৩০ দিনের দামের গতি</h2>
          <PriceChart data={history} />
        </section>

        <section className="mt-8 bg-white border border-gray-200 rounded-3xl p-6">
          <h2 className="font-bold">বাজারভিত্তিক তুলনা</h2>
          <div className="mt-4 space-y-4">
            {rows.map((r) => (
              <div key={r.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium flex items-center gap-2">
                    {r.name}
                    {r.price === min && (
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                        সবচেয়ে সস্তা
                      </span>
                    )}
                  </span>
                  <span className="font-bold">{toBnNumber(r.price)} টাকা</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-gray-100">
                  <div
                    className={`h-2 rounded-full ${r.price === min ? "bg-green-600" : "bg-brand"}`}
                    style={{ width: `${(r.price / max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}