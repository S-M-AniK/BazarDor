"use server";
import { db } from "@/lib/mongodb";
import { getSession } from "@/lib/session";

export async function saveBudget(items) {
  const session = await getSession();
  if (!session) return { ok: false };

  const clean = (Array.isArray(items) ? items : [])
    .map((i) => ({ productId: Number(i.productId), qty: Number(i.qty) }))
    .filter((i) => i.productId > 0 && i.qty >= 0 && i.qty < 100000)
    .slice(0, 100);

  await db.collection("budgets").updateOne(
    { userId: session.user.id },
    { $set: { items: clean, updatedAt: new Date() } },
    { upsert: true }
  );

  return { ok: true };
}