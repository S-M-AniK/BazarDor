import { cache } from "react";
import { db } from "./mongodb";

export async function createPriceAlerts(changes) {
  const real = changes.filter((c) => c.oldPrice !== c.newPrice);
  if (real.length === 0) return;

  const favs = await db
    .collection("favourites")
    .find({ productId: { $in: real.map((c) => c.productId) } })
    .toArray();
  if (favs.length === 0) return;

  const byProduct = new Map(real.map((c) => [c.productId, c]));
  const now = new Date();
  const docs = favs.map((f) => {
    const c = byProduct.get(f.productId);
    return {
      userId: f.userId,
      productId: f.productId,
      oldPrice: c.oldPrice,
      newPrice: c.newPrice,
      read: false,
      createdAt: now,
    };
  });

  await db.collection("alerts").insertMany(docs);
  await db
    .collection("alerts")
    .deleteMany({ createdAt: { $lt: new Date(Date.now() - 30 * 86400000) } });
}

export const getUnreadCount = cache(async (userId) =>
  db.collection("alerts").countDocuments({ userId, read: false })
);

export async function getAlerts(userId, limit = 30) {
  const docs = await db
    .collection("alerts")
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  if (docs.length === 0) return [];

  const ids = [...new Set(docs.map((d) => d.productId))];
  const products = await db.collection("products").find({ id: { $in: ids } }).toArray();
  const byId = new Map(products.map((p) => [p.id, p]));

  return docs.map((d) => {
    const p = byId.get(d.productId);
    return {
      id: d._id.toString(),
      productId: d.productId,
      name: p?.name ?? "",
      nameEn: p?.nameEn,
      icon: p?.icon ?? "🛒",
      oldPrice: d.oldPrice,
      newPrice: d.newPrice,
      read: d.read,
      createdAt: d.createdAt,
    };
  });
}