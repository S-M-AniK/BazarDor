"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/mongodb";
import { getSession } from "@/lib/session";

const bnDigits = "০১২৩৪৫৬৭৮৯";

const toNumber = (value) =>
  Number(
    String(value)
      .replace(/[০-৯]/g, (d) => bnDigits.indexOf(d))
      .replace(/[^\d.]/g, "")
  );

const parseLine = (line) => {
  const out = [];
  let cur = "";
  let quoted = false;
  for (const ch of line) {
    if (ch === '"') quoted = !quoted;
    else if (ch === "," && !quoted) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim());
};

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.user.email !== process.env.ADMIN_EMAIL) redirect("/login");
}

export async function updatePrice(formData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const price = Number(formData.get("price"));
  if (!id || !(price > 0)) redirect("/admin?error=1");

  const col = db.collection("products");
  const current = await col.findOne({ id });
  if (!current) redirect("/admin?error=1");

  await col.updateOne(
    { id },
    { $set: { prev: current.price, price, updatedAt: new Date() } }
  );
  await db.collection("priceHistory").insertOne({
    productId: id,
    price,
    date: new Date(),
  });

  revalidatePath("/", "layout");
  redirect("/admin?ok=1");
}

export async function bulkUpdatePrices(formData) {
  await requireAdmin();

  const file = formData.get("file");
  if (!file || typeof file === "string" || file.size === 0 || file.size > 200000) {
    redirect("/admin?csv=file");
  }

  const text = (await file.text()).replace(/^\uFEFF/, "");
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const header = parseLine(lines[0] ?? "").map((h) => h.toLowerCase());
  const idCol = header.indexOf("id");
  const priceCol = header.indexOf("price");
  if (idCol === -1 || priceCol === -1) redirect("/admin?csv=header");

  const products = await db.collection("products").find({}).toArray();
  const byId = new Map(products.map((p) => [p.id, p]));

  const ops = [];
  const history = [];
  let skipped = 0;
  const now = new Date();

  for (const line of lines.slice(1)) {
    const cells = parseLine(line);
    const id = toNumber(cells[idCol]);
    const price = toNumber(cells[priceCol]);
    const current = byId.get(id);

    if (!current || !(price > 0)) {
      skipped += 1;
      continue;
    }
    if (current.price === price) continue;

    ops.push({
      updateOne: {
        filter: { id },
        update: { $set: { prev: current.price, price, updatedAt: now } },
      },
    });
    history.push({ productId: id, price, date: now });
  }

  if (ops.length > 0) {
    await db.collection("products").bulkWrite(ops);
    await db.collection("priceHistory").insertMany(history);
    revalidatePath("/", "layout");
  }

  redirect(`/admin?updated=${ops.length}&skipped=${skipped}`);
}