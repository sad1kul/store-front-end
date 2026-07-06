const KEY = "sts_recently_viewed";
const MAX = 8;

interface MinProduct {
  id: string;
  name: string;
  slug: string;
  images: string[];
  retailPrice: number;
  category: string;
}

export function addRecentlyViewed(product: MinProduct) {
  if (typeof window === "undefined") return;
  const stored = getRecentlyViewed();
  const filtered = stored.filter((p) => p.id !== product.id);
  const next = [
    { id: product.id, name: product.name, slug: product.slug, images: product.images, retailPrice: product.retailPrice, category: product.category },
    ...filtered,
  ].slice(0, MAX);
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function getRecentlyViewed(): MinProduct[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
