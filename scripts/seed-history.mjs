import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();

const db = client.db();
const products = await db.collection("products").find({}).toArray();
const col = db.collection("priceHistory");
await col.deleteMany({});

const days = 30;
const docs = [];

for (const p of products) {
  let price = p.price;
  const series = [price];
  for (let i = 1; i < days; i++) {
    const r = Math.sin(p.id * 12.9898 + i * 78.233) * 43758.5453;
    const f = r - Math.floor(r) - 0.5;
    price = Math.max(1, Math.round(price * (1 + f * 0.06)));
    series.unshift(price);
  }
  series.forEach((value, i) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - (days - 1 - i));
    docs.push({ productId: p.id, price: value, date });
  });
}

await col.insertMany(docs);
await col.createIndex({ productId: 1, date: 1 });

console.log(`${docs.length} history points saved`);
await client.close();