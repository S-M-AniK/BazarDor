import { db } from "./mongodb";

const clean = (d) => ({
  id: d.id,
  name: d.name,
  icon: d.icon,
  category: d.category,
  unit: d.unit,
  price: d.price,
  prev: d.prev,
});

export async function getProducts() {
  const docs = await db.collection("products").find({}).sort({ id: 1 }).toArray();
  return docs.map(clean);
}

export async function getProduct(id) {
  const doc = await db.collection("products").findOne({ id: Number(id) });
  return doc ? clean(doc) : null;
}

export async function getHistory(id, limit = 30) {
  const docs = await db
    .collection("priceHistory")
    .find({ productId: Number(id) })
    .sort({ date: -1 })
    .limit(limit)
    .toArray();
  return docs.reverse().map((d) => ({
    price: d.price,
    date: d.date.toISOString(),
  }));
}