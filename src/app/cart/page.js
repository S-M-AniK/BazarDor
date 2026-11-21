import Navbar from "@/components/Navbar";
import CartView from "@/components/CartView";
import { getProducts } from "@/lib/products";
import { getSession } from "@/lib/session";
import { getT } from "@/lib/i18n";
import { productName, unitFull, unitShort } from "@/data/translations";

const stepFor = (unit) => (["কেজি", "লিটার"].includes(unit.replace("প্রতি ", "")) ? 0.5 : 1);

export default async function CartPage() {
  const [session, { lang, t }, all] = await Promise.all([getSession(), getT(), getProducts()]);

  const products = all.map((p) => ({
    id: p.id,
    icon: p.icon,
    price: p.price,
    step: stepFor(p.unit),
    displayName: productName(p, lang),
    displayUnit: unitFull(p.unit, lang),
    displayUnitShort: unitShort(p.unit, lang),
  }));

  const labels = {
    empty: t("cartEmpty"),
    browse: t("browse"),
    clear: t("clearCart"),
    remove: t("remove"),
    total: t("cartTotal"),
    taka: t("taka"),
    checkout: t("checkout"),
    signInToOrder: t("signInToOrder"),
    subtotal: t("subtotal"),
    delivery: t("deliveryCharge"),
    free: t("freeDelivery"),
    freeHint: t("freeHint"),
  };

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8 pb-16">
        <h1 className="text-2xl font-bold">🛍️ {t("cartTitle")}</h1>
        <CartView products={products} lang={lang} labels={labels} loggedIn={Boolean(session)} />
      </main>
    </>
  );
}