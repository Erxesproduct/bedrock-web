import data from "@/data/catalog.json";

export type Img = { src: string; w: number; h: number };
export type Photo = Img & { thumb: Img };

export type CategoryId = "iphone" | "mac" | "ipad" | "watch" | "airpods" | "accessories" | "gaming";
/** Slot in the setup builder: the main device, then wrist, audio and extras. */
export type Layer = "core" | "wrist" | "audio" | "extra";

export type Product = {
  /** Zochil product id (kept for the erxes product code and old-URL redirects). */
  id: number;
  slug: string;
  name: string;
  /** Model details moved out of the Zochil name, e.g. «16GB / 512GB · LL/A (АНУ)». */
  subtitle: string | null;
  category: CategoryId;
  layer: Layer;
  /** Selling price (the sale price when discounted). */
  price: number;
  /** Price before the discount, null when not discounted. */
  compareAt: number | null;
  /** Units in stock; null = not tracked; 0 = sold out. The shop hides stock counts (show_stock: false). */
  stock: number | null;
  createdAt: string;
  /** Short chips copied from the shop's own short description. */
  specs: string[];
  /** The shop's short description. */
  summary: string;
  /** The shop's long description: paragraphs and list items. */
  details: { t: "p" | "li"; text: string }[];
  images: Photo[];
};

export type Category = { id: CategoryId; name: string; note: string; count: number };

export const products = data.products as Product[];
export const categories = (data.categories as Category[]).filter((c) => c.count > 0);
export const faq = data.faq as { q: string; a: string }[];
export const about = data.about as string[];
export const catalogUpdatedAt = data.updatedAt;

const bySlug = new Map(products.map((p) => [p.slug, p]));
export const getProduct = (slug: string) => bySlug.get(slug);
export const getCategory = (id: string) => categories.find((c) => c.id === id);
export const inCategory = (id: CategoryId) => products.filter((p) => p.category === id);

export const soldOut = (p: { stock: number | null }) => p.stock === 0;
export const onSale = (p: Pick<Product, "price" | "compareAt">) => p.compareAt != null && p.compareAt > p.price;
export const saving = (p: Pick<Product, "price" | "compareAt">) => (onSale(p) ? p.compareAt! - p.price : 0);

/** The product a cart line points at (server side). */
export function resolveLine(slug: string) {
  const product = getProduct(slug);
  return product ? { product, price: product.price, stock: product.stock } : null;
}

/** erxes product code: BD-<zochil id>. */
export const sku = (p: Pick<Product, "id">) => `BD-${p.id}`;

/** Newest first: the latest arrivals on Zochil. */
export const newest = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
