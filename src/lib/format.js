const digits = "০১২৩৪৫৬৭৮৯";

export const toBnDigits = (value) =>
  String(value).replace(/\d/g, (d) => digits[d]);

export const toBnNumber = (n, fractionDigits = 0) =>
  toBnDigits(
    Number(n).toLocaleString("en-US", {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    })
  );

export const changePct = (p) => ((p.price - p.prev) / p.prev) * 100;

export const bnDate = () =>
  new Date().toLocaleDateString("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const months = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

export const bnShortDate = (iso) => {
  const d = new Date(iso);
  return `${toBnDigits(d.getUTCDate())} ${months[d.getUTCMonth()]}`;
};