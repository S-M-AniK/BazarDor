export const markets = [
  { bn: "কারওয়ান বাজার", en: "Karwan Bazar" },
  { bn: "মালিবাগ বাজার", en: "Malibagh Bazar" },
  { bn: "মিরপুর ১ নম্বর", en: "Mirpur 1" },
  { bn: "মোহাম্মদপুর টাউন হল", en: "Mohammadpur Town Hall" },
  { bn: "নিউ মার্কেট কাঁচাবাজার", en: "New Market Kitchen Market" },
];

const base = [-0.04, 0, 0.03, -0.02, 0.05];

export const marketPrices = (product) =>
  markets.map((m, i) => {
    const jitter = (((product.id * 7 + i * 3) % 5) - 2) / 100;
    return {
      name: m.bn,
      nameEn: m.en,
      price: Math.round(product.price * (1 + base[i] + jitter)),
    };
  });