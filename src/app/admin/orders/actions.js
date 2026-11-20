"use server";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/mongodb";
import { getSession } from "@/lib/session";

const transitions = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["delivering", "cancelled"],
  delivering: ["delivered", "cancelled"],
};

const filters = ["pending", "confirmed", "delivering", "delivered", "cancelled"];

export async function updateOrderStatus(formData) {
  const session = await getSession();
  if (!session || session.user.email !== process.env.ADMIN_EMAIL) redirect("/login");

  const id = String(formData.get("orderId") ?? "");
  const next = String(formData.get("status") ?? "");
  const filter = String(formData.get("filter") ?? "");
  const back = filters.includes(filter) ? `/admin/orders?filter=${filter}` : "/admin/orders";
  const sep = back.includes("?") ? "&" : "?";

  const from = Object.entries(transitions)
    .filter(([, to]) => to.includes(next))
    .map(([status]) => status);
  if (!ObjectId.isValid(id) || from.length === 0) redirect(`${back}${sep}msg=invalid`);

  const set = { status: next };
  if (next === "delivered") set.paymentStatus = "paid";

  const res = await db.collection("orders").findOneAndUpdate(
    { _id: new ObjectId(id), status: { $in: from } },
    { $set: set, $push: { history: { status: next, at: new Date() } } },
    { returnDocument: "before" }
  );
  const before = res && "items" in res ? res : res?.value;
  if (!before) redirect(`${back}${sep}msg=invalid`);

  if (next === "cancelled") {
    for (const item of before.items) {
      await db
        .collection("products")
        .updateOne({ id: item.productId }, { $inc: { stock: item.qty } });
    }
  }

  revalidatePath("/admin/orders");
  revalidatePath("/orders");
  revalidatePath("/", "layout");
  redirect(`${back}${sep}msg=ok`);
}