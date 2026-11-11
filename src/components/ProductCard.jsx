import Link from "next/link";
import { changePct, toBnNumber } from "@/lib/format";
import FavouriteButton from "./FavouriteButton";

export default function ProductCard({ product, favourite = false }) {
  const pct = changePct(product);
  const badge =
    pct > 0
      ? { cls: "bg-red-50 text-red-600", sym: "▲" }
      : pct < 0
      ? { cls: "bg-green-50 text-green-700", sym: "▼" }
      : { cls: "bg-gray-100 text-gray-500", sym: "—" };

  return (
    <div className="relative">
      <Link
        href={`/products/${product.id}`}
        className="block bg-white border border-gray-200 rounded-2xl p-4 hover:border-brand hover:shadow-sm transition"
      >
        <div className="flex items-center gap-3 pr-10">
          <span className="w-11 h-11 rounded-xl bg-gray-50 grid place-items-center text-2xl">{product.icon}</span>
          <div className="leading-tight">
            <p className="font-semibold">{product.name}</p>
            <p className="text-sm text-gray-500">{product.unit}</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-500">আজকের দাম</p>
        <div className="flex items-center justify-between">
          <p>
            <span className="font-bold">{toBnNumber(product.price)}</span> টাকা
          </p>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge.cls}`}>
            {badge.sym} {toBnNumber(Math.abs(pct), 1)}%
          </span>
        </div>
      </Link>
      <div className="absolute top-3 right-3">
        <FavouriteButton productId={product.id} initial={favourite} />
      </div>
    </div>
  );
}