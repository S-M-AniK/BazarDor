const digits = "০১২৩৪৫৬৭৮৯";

export const toBnDigits = (value) =>
  String(value).replace(/\d/g, (d) => digits[d]);

export const toBnNumber = (n, fractionDigits = 0, lang = "bn") => {
  const text = Number(n).toLocaleString("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
  return lang === "en" ? text : toBnDigits(text);
};

export const changePct = (p) => ((p.price - p.prev) / p.prev) * 100;

export const bnDate = (lang = "bn") =>
  new Date().toLocaleDateString(lang === "en" ? "en-GB" : "bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const monthsBn = [
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

const monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const bnShortDate = (iso, lang = "bn") => {
  const d = new Date(iso);
  const day = d.getUTCDate();
  const month = d.getUTCMonth();
  return lang === "en" ? `${day} ${monthsEn[month]}` : `${toBnDigits(day)} ${monthsBn[month]}`;
};