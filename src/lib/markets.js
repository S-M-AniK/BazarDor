export const markets = [
  "কারওয়ান বাজার",
  "মালিবাগ বাজার",
  "মিরপুর ১ নম্বর",
  "মোহাম্মদপুর টাউন হল",
  "নিউ মার্কেট কাঁচাবাজার",
];

const base = [-0.04, 0, 0.03, -0.02, 0.05];

export const marketPrices = (product) =>
  markets.map((name, i) => {
    const jitter = (((product.id * 7 + i * 3) % 5) - 2) / 100;
    return { name, price: Math.round(product.price * (1 + base[i] + jitter)) };
  });