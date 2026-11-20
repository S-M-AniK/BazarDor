import { ObjectId } from "mongodb";
import { db } from "./mongodb";
import { bnShortDate, toBnDigits } from "./format";

const statuses = ["pending", "confirmed", "delivering", "delivered", "cancelled"];

export async function getOrder(id) {
  if (!ObjectId.isValid(id)) return null;
  const doc = await db.collection("orders").findOne({ _id: new ObjectId(id) });
  if (!doc) return null;
  return { ...doc, id: doc._id.toString() };
}

export async function getUserOrders(userId) {
  const docs = await db
    .collection("orders")
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray();
  return docs.map((d) => ({
    id: d._id.toString(),
    orderNo: d.orderNo,
    status: d.status,
    total: d.total,
    itemCount: d.items.length,
    createdAt: d.createdAt,
  }));
}

export async function getAdminOrders(status) {
  const query = statuses.includes(status) ? { status } : {};
  const docs = await db
    .collection("orders")
    .find(query)
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();
  return docs.map((d) => ({
    id: d._id.toString(),
    orderNo: d.orderNo,
    status: d.status,
    total: d.total,
    name: d.name,
    phone: d.phone,
    address: d.address,
    note: d.note,
    items: d.items,
    payment: d.payment,
    paymentStatus: d.paymentStatus,
    trxId: d.trxId,
    createdAt: d.createdAt,
  }));
}

export async function getOrderCounts() {
  const rows = await db
    .collection("orders")
    .aggregate([{ $group: { _id: "$status", n: { $sum: 1 } } }])
    .toArray();
  const counts = Object.fromEntries(rows.map((r) => [r._id, r.n]));
  counts.all = rows.reduce((sum, r) => sum + r.n, 0);
  return counts;
}

export function formatOrderTime(value, lang) {
  const local = new Date(new Date(value).getTime() + 6 * 3600000);
  const hh = String(local.getUTCHours()).padStart(2, "0");
  const mm = String(local.getUTCMinutes()).padStart(2, "0");
  const time = `${hh}:${mm}`;
  return `${bnShortDate(local.toISOString(), lang)}, ${lang === "en" ? time : toBnDigits(time)}`;
}