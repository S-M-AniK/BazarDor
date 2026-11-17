import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProductSection from "@/components/ProductSection";
import BudgetCalculator from "@/components/BudgetCalculator";
import { getProducts } from "@/lib/products";
import { getFavouriteIds } from "@/lib/favourites";
import { getBudget } from "@/lib/budget";
import { getSession } from "@/lib/session";
import { getT } from "@/lib/i18n";
import { productName, unitFull, unitShort } from "@/data/translations";
import { toBnNumber } from "@/lib/format";

export default async function FavouritesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const { lang, t } = await getT();
  const [all, favIds, saved] = await Promise.all([
    getProducts(),
    getFavouriteIds(session.user.id),
    getBudget(session.user.id),
  ]);
  const items = all.filter((p) => favIds.includes(p.id));

  const budgetProducts = items.map((p) => ({
    ...p,
    displayName: productName(p, lang),
    displayUnit: unitFull(p.unit, lang),
    displayUnitShort: unitShort(p.unit, lang),
  }));

  const labels = {
    title: t("budgetTitle"),
    hint: t("budgetHint"),
    total: t("totalCost"),
    save: t("saveBudget"),
    saving: t("saving"),
    saved: t("budgetSaved"),
    failed: t("saveFailed"),
    taka: t("taka"),
  };

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8 pb-16">
        <h1 className="text-2xl font-bold">♥ {t("favTitle")}</h1>
        {items.length === 0 ? (
          <div className="mt-6 bg-white border border-gray-200 rounded-3xl p-8 text-center">
            <p className="text-gray-600">{t("favEmpty")}</p>
            <Link
              href="/products"
              className="inline-block mt-4 bg-brand text-white text-sm font-semibold px-5 py-2.5 rounded-full"
            >
              {t("browse")}
            </Link>
          </div>
        ) : (
          <>
            <ProductSection
              subtitle={t("totalItems", { n: toBnNumber(items.length, 0, lang) })}
              items={items}
              favIds={favIds}
            />
            <BudgetCalculator
              products={budgetProducts}
              saved={saved}
              lang={lang}
              labels={labels}
            />
          </>
        )}
      </main>
    </>
  );
}