import { cookies } from "next/headers";

export const messages = {
  bn: {
    products: "পণ্য",
    priceUpdate: "দাম আপডেট",
    favourites: "পছন্দ",
    signIn: "সাইন ইন",
    signUp: "সাইন আপ",
    signOut: "সাইন আউট",
    signedOut: "সাইন আউট হয়েছে",
    siteName: "বাজার দর",
    heroTitle: "আজকের বাজারের দাম এক নজরে",
    heroText:
      "চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।",
    viewAll: "সব পণ্য দেখুন",
    searchPlaceholder: "🔍 পণ্য খুঁজুন (যেমন: পেঁয়াজ)",
    search: "খুঁজুন",
    risers: "আজ দাম বেড়েছে",
    fallers: "আজ দাম কমেছে",
    allProducts: "সব পণ্য",
    totalShown: "মোট {n}টি পণ্য দেখানো হচ্ছে",
    todayPrice: "আজকের দাম",
    taka: "টাকা",
  },
  en: {
    products: "Products",
    priceUpdate: "Update prices",
    favourites: "Favourites",
    signIn: "Sign in",
    signUp: "Sign up",
    signOut: "Sign out",
    signedOut: "Signed out",
    siteName: "BazarDor",
    heroTitle: "Today's market prices at a glance",
    heroText:
      "Prices of rice, lentils, oil, vegetables, fish, meat, eggs and spices — market-wise details, average, lowest-highest and price changes in one place.",
    viewAll: "View all products",
    searchPlaceholder: "🔍 Search products (e.g. onion)",
    search: "Search",
    risers: "Prices up today",
    fallers: "Prices down today",
    allProducts: "All products",
    totalShown: "Showing {n} products",
    todayPrice: "Today's price",
    taka: "Taka",
  },
};

export async function getLang() {
  const value = (await cookies()).get("lang")?.value;
  return value === "en" ? "en" : "bn";
}

export async function getT() {
  const lang = await getLang();
  const t = (key, vars = {}) => {
    let text = messages[lang][key] ?? messages.bn[key] ?? key;
    for (const [name, value] of Object.entries(vars)) {
      text = text.replace(`{${name}}`, value);
    }
    return text;
  };
  return { lang, t };
}