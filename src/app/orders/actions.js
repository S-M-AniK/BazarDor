"use server";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/mongodb";
import { getSession } from "@/lib/session";

export async function cancelOrder(orderId) {
  const session = await getSession();
  if (!session || !ObjectId.isValid(orderId)) return { ok: false };

  const res = await db.collection("orders").findOneAndUpdate(
    { _id: new ObjectId(orderId), userId: session.user.id, status: "pending" },
    {
      $set: { status: "cancelled" },
      $push: { history: { status: "cancelled", at: new Date() } },
    },
    { returnDocument: "before" }
  );
  const before = res && "items" in res ? res : res?.value;
  if (!before) return { ok: false };

  for (const item of before.items) {
    await db
      .collection("products")
      .updateOne({ id: item.productId }, { $inc: { stock: item.qty } });
  }

  revalidatePath("/orders");
  revalidatePath("/admin/orders");
  revalidatePath("/", "layout");
  return { ok: true };
}