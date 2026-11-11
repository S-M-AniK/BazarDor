import Link from "next/link";
import { bnDate } from "@/lib/format";

export default function Hero() {
  return (
    <section className="bg-white border border-gray-200 rounded-3xl p-8 flex items-center justify-between gap-6">
      <div className="max-w-xl">
        <span className="inline-block bg-brand-soft text-brand text-xs font-medium px-3 py-1.5 rounded-lg">
          {bnDate()}
        </span>
        <h1 className="mt-4 text-3xl md:text-4xl font-bold">আজকের বাজারের দাম এক নজরে</h1>
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
          চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
        </p>
        <Link
          href="/products"
          className="inline-block mt-5 bg-brand text-white text-sm font-semibold px-5 py-2.5 rounded-full"
        >
          সব পণ্য দেখুন
        </Link>
      </div>
      <div className="hidden md:block text-9xl pr-10">🧺</div>
    </section>
  );
}