import { db } from "./mongodb";

export async function getBudget(userId) {
  const doc = await db.collection("budgets").findOne({ userId });
  return (doc?.items ?? []).map((i) => ({
    productId: i.productId,
    qty: i.qty,
  }));
}