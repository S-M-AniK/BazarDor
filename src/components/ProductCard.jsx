import Link from "next/link";
import { changePct, toBnNumber } from "@/lib/format";
import { productName, unitFull } from "@/data/translations";
import { getT } from "@/lib/i18n";
import { getSession } from "@/lib/session";
import FavouriteButton from "./FavouriteButton";
import AddToCartButton from "./AddToCartButton";

export default async function ProductCard({ product, favourite = false }) {
  const [{ lang, t }, session] = await Promise.all([getT(), getSession()]);
  const pct = changePct(product);
  const badge =
    pct > 0
      ? { cls: "bg-red-50 text-red-600", sym: "▲" }
      : pct < 0
      ? { cls: "bg-green-50 text-green-700", sym: "▼" }
      : { cls: "bg-gray-100 text-gray-500", sym: "—" };

  return (
    <div className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-brand hover:shadow-sm transition">
      <Link href={`/products/${product.id}`} className="block p-4">
        <div className="flex items-center gap-3 pr-10">
          <span className="w-11 h-11 rounded-xl bg-gray-50 grid place-items-center text-2xl">{product.icon}</span>
          <div className="leading-tight">
            <p className="font-semibold">{productName(product, lang)}</p>
            <p className="text-sm text-gray-500">{unitFull(product.unit, lang)}</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-500">{t("todayPrice")}</p>
        <div className="flex items-center justify-between">
          <p>
            <span className="font-bold">{toBnNumber(product.price, 0, lang)}</span> {t("taka")}
          </p>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge.cls}`}>
            {badge.sym} {toBnNumber(Math.abs(pct), 1, lang)}%
          </span>
        </div>
      </Link>
      <AddToCartButton
        productId={product.id}
        label={`🛍️ ${t("addToCart")}`}
        addedMsg={t("addedToCart")}
        className="w-full border-t border-gray-200 py-2.5 text-sm font-semibold text-brand hover:bg-brand-soft"
      />
      <div className="absolute top-3 right-3">
        <FavouriteButton
          productId={product.id}
          initial={favourite}
          addMsg={t("favAdded")}
          removeMsg={t("favRemoved")}
          loggedIn={Boolean(session)}
          loginMsg={t("signInToFav")}
        />
      </div>
    </div>
  );
}