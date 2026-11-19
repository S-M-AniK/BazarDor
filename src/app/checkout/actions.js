"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/mongodb";
import { getSession } from "@/lib/session";

const bnDigits = "০১২৩৪৫৬৭৮৯";

const normalizeDigits = (value) =>
  String(value ?? "").replace(/[০-৯]/g, (d) => bnDigits.indexOf(d));

const normalizePhone = (value) => {
  let digits = normalizeDigits(value).replace(/\D/g, "");
  if (digits.startsWith("88")) digits = digits.slice(2);
  return /^01[3-9]\d{8}$/.test(digits) ? digits : null;
};

const stepFor = (unit) => (["কেজি", "লিটার"].includes(unit.replace("প্রতি ", "")) ? 0.5 : 1);

const round = (n) => Math.round(n * 100) / 100;

export async function placeOrder(input) {
  const session = await getSession();
  if (!session) return { ok: false, error: "auth" };

  const name = String(input?.name ?? "").trim().slice(0, 80);
  const address = String(input?.address ?? "").trim().slice(0, 300);
  const note = String(input?.note ?? "").trim().slice(0, 200);
  const payment = input?.payment === "bkash" ? "bkash" : "cod";
  const trxId = String(input?.trxId ?? "").trim().toUpperCase();
  const phone = normalizePhone(input?.phone);

  if (!name) return { ok: false, error: "name" };
  if (!phone) return { ok: false, error: "phone" };
  if (address.length < 8) return { ok: false, error: "address" };
  if (payment === "bkash" && !/^[A-Z0-9]{8,12}$/.test(trxId)) return { ok: false, error: "trx" };

  const requested = new Map();
  for (const item of Array.isArray(input?.items) ? input.items : []) {
    const id = Number(item?.productId);
    const qty = round(Number(item?.qty));
    if (!id || !(qty > 0) || qty > 1000) continue;
    requested.set(id, round((requested.get(id) ?? 0) + qty));
  }
  if (requested.size === 0 || requested.size > 50) return { ok: false, error: "empty" };

  const products = db.collection("products");
  const docs = await products.find({ id: { $in: [...requested.keys()] } }).toArray();
  if (docs.length !== requested.size) return { ok: false, error: "empty" };

  const items = [];
  for (const p of docs) {
    const qty = requested.get(p.id);
    const step = stepFor(p.unit);
    if (Math.abs(qty / step - Math.round(qty / step)) > 1e-9) return { ok: false, error: "qty" };
    items.push({
      productId: p.id,
      name: p.name,
      nameEn: p.nameEn ?? null,
      icon: p.icon,
      unit: p.unit,
      price: p.price,
      qty,
      lineTotal: round(p.price * qty),
    });
  }

  const done = [];
  const rollback = async () => {
    for (const d of done) {
      await products.updateOne({ id: d.productId }, { $inc: { stock: d.qty } });
    }
  };

  for (const item of items) {
    const res = await products.updateOne(
      { id: item.productId, stock: { $gte: item.qty } },
      { $inc: { stock: -item.qty } }
    );
    if (res.modifiedCount !== 1) {
      await rollback();
      const current = docs.find((p) => p.id === item.productId);
      return {
        ok: false,
        error: "stock",
        productId: item.productId,
        available: Math.max(0, current?.stock ?? 0),
      };
    }
    done.push(item);
  }

  const now = new Date();
  const total = round(items.reduce((sum, i) => sum + i.lineTotal, 0));
  const orderNo = "BD" + Date.now().toString(36).toUpperCase().slice(-6);

  try {
    const result = await db.collection("orders").insertOne({
      orderNo,
      userId: session.user.id,
      userEmail: session.user.email,
      name,
      phone,
      address,
      note,
      items,
      total,
      payment,
      paymentStatus: payment === "bkash" ? "paid" : "unpaid",
      trxId: payment === "bkash" ? trxId : null,
      status: "pending",
      history: [{ status: "pending", at: now }],
      createdAt: now,
    });
    revalidatePath("/orders");
    revalidatePath("/admin");
    return { ok: true, id: result.insertedId.toString() };
  } catch {
    await rollback();
    return { ok: false, error: "server" };
  }
}