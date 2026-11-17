import { categories } from "@/data/products";
import { addProduct } from "@/app/admin/add-actions";

const units = ["প্রতি কেজি", "প্রতি লিটার", "প্রতি ডজন", "প্রতি পিস", "প্রতি হালি", "প্রতি ১০০ গ্রাম"];

const messages = {
  invalid: "সব ঘর সঠিকভাবে পূরণ করুন",
  exists: "এই নামের পণ্য আগে থেকেই আছে",
};

const field =
  "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand bg-white";

export default function AddProductForm({ added, error }) {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-8">
      <h2 className="text-xl font-bold">➕ নতুন পণ্য যোগ করুন</h2>
      {added && (
        <p className="mt-4 text-sm bg-green-50 text-green-700 rounded-xl px-4 py-2.5">
          নতুন পণ্য যোগ হয়েছে
        </p>
      )}
      {error && messages[error] && (
        <p className="mt-4 text-sm bg-red-50 text-red-600 rounded-xl px-4 py-2.5">
          {messages[error]}
        </p>
      )}
      <form action={addProduct} className="mt-5 space-y-4">
        <input name="name" required placeholder="পণ্যের নাম (যেমন: লাউ)" className={field} />
        <div className="grid grid-cols-2 gap-4">
          <select name="category" required className={field}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
          <select name="unit" required className={field}>
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input name="icon" placeholder="ইমোজি (যেমন: 🥒)" className={field} />
          <input
            name="price"
            type="number"
            min="1"
            step="any"
            required
            placeholder="দাম (টাকা)"
            className={field}
          />
        </div>
        <button className="w-full bg-brand text-white font-semibold rounded-xl py-2.5 text-sm">
          পণ্য যোগ করুন
        </button>
      </form>
    </div>
  );
}