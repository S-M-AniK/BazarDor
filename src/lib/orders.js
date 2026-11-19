import { ObjectId } from "mongodb";
import { db } from "./mongodb";
import { bnShortDate, toBnDigits } from "./format";

export async function getOrder(id) {
  if (!ObjectId.isValid(id)) return null;
  const doc = await db.collection("orders").findOne({ _id: new ObjectId(id) });
  if (!doc) return null;
  return { ...doc, id: doc._id.toString() };
}

export function formatOrderTime(value, lang) {
  const local = new Date(new Date(value).getTime() + 6 * 3600000);
  const hh = String(local.getUTCHours()).padStart(2, "0");
  const mm = String(local.getUTCMinutes()).padStart(2, "0");
  const time = `${hh}:${mm}`;
  return `${bnShortDate(local.toISOString(), lang)}, ${lang === "en" ? time : toBnDigits(time)}`;
}