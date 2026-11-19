import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import CheckoutForm from "@/components/CheckoutForm";
import { getProducts } from "@/lib/products";
import { getSession } from "@/lib/session";
import { getLang } from "@/lib/i18n";
import { orderText } from "@/data/orderText";
import { productName, unitShort } from "@/data/translations";

export default async function CheckoutPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [lang, all] = await Promise.all([getLang(), getProducts()]);
  const o = orderText[lang];

  const products = all.map((p) => ({
    id: p.id,
    icon: p.icon,
    price: p.price,
    displayName: productName(p, lang),
    displayUnitShort: unitShort(p.unit, lang),
  }));

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8 pb-16">
        <h1 className="text-2xl font-bold">🧾 {o.checkoutTitle}</h1>
        <CheckoutForm products={products} lang={lang} labels={o} defaultName={session.user.name} />
      </main>
    </>
  );
}