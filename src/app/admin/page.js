import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getProducts } from "@/lib/products";
import { getSession } from "@/lib/session";
import { toBnNumber } from "@/lib/format";
import { updatePrice } from "./actions";

export default async function AdminPage({ searchParams }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.email !== process.env.ADMIN_EMAIL) redirect("/");

  const { ok, error } = await searchParams;
  const products = await getProducts();

  return (
    <>
      <Navbar />
      <main className="max-w-xl mx-auto px-4 py-10">
        <div className="bg-white border border-gray-200 rounded-3xl p-8">
          <h1 className="text-2xl font-bold">দাম আপডেট করুন</h1>
          {ok && (
            <p className="mt-4 text-sm bg-green-50 text-green-700 rounded-xl px-4 py-2.5">
              দাম আপডেট হয়েছে
            </p>
          )}
          {error && (
            <p className="mt-4 text-sm bg-red-50 text-red-600 rounded-xl px-4 py-2.5">
              সঠিক পণ্য ও দাম দিন
            </p>
          )}
          <form action={updatePrice} className="mt-6 space-y-4">
            <select
              name="id"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand bg-white"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.icon} {p.name} (এখন {toBnNumber(p.price)} টাকা, {p.unit})
                </option>
              ))}
            </select>
            <input
              name="price"
              type="number"
              min="1"
              step="any"
              required
              placeholder="নতুন দাম (টাকা)"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand"
            />
            <button className="w-full bg-brand text-white font-semibold rounded-xl py-2.5 text-sm">
              আপডেট করুন
            </button>
          </form>
        </div>
      </main>
    </>
  );
}