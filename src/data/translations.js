export const namesEn = {
  1: "Swarnamachhi Rice",
  2: "Miniket Rice",
  3: "Najir Rice",
  4: "Masoor Dal",
  5: "Aman Dal",
  6: "Mustard Oil",
  7: "Palm Oil",
  8: "Onion",
  9: "Ginger",
  10: "Eggplant",
  11: "Potato",
  12: "Garlic",
  13: "Green Chilli",
  14: "Rui Fish",
  15: "Katla Fish",
  16: "Broiler Chicken",
  17: "Duck Meat",
  18: "Goat Meat",
  19: "Eggs",
  20: "Butter (100 g)",
  21: "Turmeric Powder",
  22: "Cumin",
};

const categoriesEn = {
  rice: "Rice",
  dal: "Lentils",
  oil: "Oil",
  veg: "Vegetables",
  fish: "Fish",
  meat: "Meat",
  dairy: "Eggs & Dairy",
  spice: "Spices",
};

const unitsEn = {
  "প্রতি কেজি": "per kg",
  "প্রতি লিটার": "per litre",
  "প্রতি ডজন": "per dozen",
  "প্রতি পিস": "per piece",
  "প্রতি হালি": "per 4 pcs",
  "প্রতি ১০০ গ্রাম": "per 100 g",
};

const unitShortEn = {
  কেজি: "kg",
  লিটার: "litre",
  ডজন: "dozen",
  পিস: "pc",
  হালি: "4 pcs",
  "১০০ গ্রাম": "100 g",
};

export const productName = (p, lang) => (lang === "en" && namesEn[p.id]) || p.name;

export const categoryName = (c, lang) => (lang === "en" && categoriesEn[c.id]) || c.name;

export const unitFull = (unit, lang) => (lang === "en" && unitsEn[unit]) || unit;

export const unitShort = (unit, lang) => {
  const short = unit.replace("প্রতি ", "");
  return (lang === "en" && unitShortEn[short]) || short;
};