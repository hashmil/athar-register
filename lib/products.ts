export interface Product {
  code: string;
  name: string;
  tileImage: string;
  productImage?: string;
  isPlaceholder?: boolean;
}

export const PRODUCTS: Record<string, Product> = {
  SC7: {
    code: "SC7",
    name: "Solo Crunch Chips",
    tileImage: "/homescr/btn-chips.png",
    productImage: "/products/SoloCrunch.png",
  },
  IV8: {
    code: "IV8",
    name: "Instant Viral Noodles",
    tileImage: "/homescr/btn-noodles.png",
    productImage: "/products/noodles.png",
  },
  VC9: {
    code: "VC9",
    name: "Vibe Ce-real",
    tileImage: "/homescr/btn-cereal.png",
    productImage: "/products/VibeCereal.png",
  },
  WT2: {
    code: "WT2",
    name: "Whatever Tea",
    tileImage: "/homescr/btn-tea.png",
    productImage: "/products/Tea.png",
  },
  FM3: {
    code: "FM3",
    name: "Filter Milk",
    tileImage: "/homescr/btn-milk.png",
    productImage: "/products/Milk.png",
  },
  PL0: {
    code: "PL0",
    name: "Coming Soon",
    tileImage: "/homescr/btn-eyes.png",
    isPlaceholder: true,
  },
};

export const PRODUCT_CODES = Object.keys(PRODUCTS);

export function getProduct(code: string): Product | null {
  const normalizedCode = code.toUpperCase().trim();
  return PRODUCTS[normalizedCode] || null;
}

export function isValidProductCode(code: string): boolean {
  const normalizedCode = code.toUpperCase().trim();
  return normalizedCode in PRODUCTS;
}
