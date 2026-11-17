import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { categories, getCategory, products, type CategoryId, type Product } from "@/lib/catalog";

const SORTS = [
  { id: "cat", name: "Ангиллаар" },
  { id: "new", name: "Шинэ нь эхэндээ" },
  { id: "low", name: "Хямд нь эхэндээ" },
  { id: "high", name: "Үнэтэй нь эхэндээ" },
] as const;
type SortId = (typeof SORTS)[number]["id"];

type Search = Promise<{ c?: string; s?: string }>;

export async function generateMetadata({ searchParams }: { searchParams: Search }): Promise<Metadata> {
  const { c } = await searchParams;
  const cat = c ? getCategory(c) : undefined;
  return {
    title: cat ? `${cat.name}: ${cat.note}` : "Бүх бараа",
    description: cat ? `BedRock: ${cat.name} (${cat.note}), ${cat.count} бараа.` : `BedRock: бүх ${products.length} бараа.`,
    alternates: { canonical: cat ? `/shop?c=${cat.id}` : "/shop" },
  };
}

const sorters: Record<SortId, ((a: Product, b: Product) => number) | null> = {
  cat: null,
  new: (a, b) => b.createdAt.localeCompare(a.createdAt),
  low: (a, b) => a.price - b.price,
  high: (a, b) => b.price - a.price,
};

export default async function Shop({ searchParams }: { searchParams: Search }) {
  const { c, s } = await searchParams;
  const cat = c ? getCategory(c) : undefined;
  const sort: SortId = SORTS.some((x) => x.id === s) ? (s as SortId) : "cat";
  let list = cat ? products.filter((p) => p.category === (cat.id as CategoryId)) : products;
  const fn = sorters[sort];
  if (fn) list = [...list].sort(fn);
  const href = (next: { c?: string | null; s?: string | null }) => {
    const q = new URLSearchParams();
    const cc = next.c === undefined ? cat?.id : next.c;
    const ss = next.s === undefined ? sort : next.s;
    if (cc) q.set("c", cc);
    if (ss && ss !== "cat") q.set("s", ss);
    const str = q.toString();
    return str ? `/shop?${str}` : "/shop";
  };

  return (
    <div className="wrap pt-10 md:pt-14">
      <p className="kicker text-lava">{cat ? cat.note : "Дэлгүүр"}</p>
      <h1 className="display mt-3 text-[60px] md:text-[96px]">{cat ? cat.name : "Бүх бараа"}</h1>
      <p className="mono mt-3 text-[14px] text-ash">{list.length} бараа</p>

      <div className="mt-8 border-y border-basalt/10 py-3">
        <nav aria-label="Ангилал" className="no-scrollbar flex gap-2 overflow-x-auto">
          <Link href={href({ c: null })} aria-current={!cat ? "page" : undefined} className="shrink-0 rounded-lg border border-basalt/15 bg-chalk px-3.5 py-2 text-[14px] font-semibold aria-[current]:border-basalt aria-[current]:bg-basalt aria-[current]:text-chalk">
            Бүгд <span className="mono opacity-60">{products.length}</span>
          </Link>
          {categories.map((x) => (
            <Link key={x.id} href={href({ c: x.id })} aria-current={cat?.id === x.id ? "page" : undefined} className="shrink-0 rounded-lg border border-basalt/15 bg-chalk px-3.5 py-2 text-[14px] font-semibold aria-[current]:border-basalt aria-[current]:bg-basalt aria-[current]:text-chalk">
              {x.name} <span className="mono opacity-60">{x.count}</span>
            </Link>
          ))}
        </nav>
        <nav aria-label="Эрэмбэ" className="no-scrollbar mt-2 flex gap-4 overflow-x-auto text-[13.5px]">
          {SORTS.map((x) => (
            <Link key={x.id} href={href({ s: x.id })} aria-current={sort === x.id ? "true" : undefined} className="shrink-0 text-ash hover:text-basalt aria-[current]:font-semibold aria-[current]:text-lava">
              {x.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
        {list.map((p, i) => (
          <ProductCard key={p.slug} p={p} index={i} priority={i < 4} />
        ))}
      </div>
    </div>
  );
}
