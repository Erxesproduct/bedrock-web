import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyBox } from "@/components/buy-box";
import { Gallery } from "@/components/gallery";
import { ArrowIcon, ChatIcon, PlaneIcon, ShieldIcon, StoreIcon, TruckIcon } from "@/components/icons";
import { Price } from "@/components/price";
import { ProductCard } from "@/components/product-card";
import { business } from "@/content/business";
import { getCategory, getProduct, inCategory, products, sku, soldOut } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site-url";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const img = p.images[0];
  return {
    title: p.name,
    description: p.summary.slice(0, 160),
    alternates: { canonical: `/p/${p.slug}` },
    openGraph: { title: p.name, description: p.summary.slice(0, 160), images: [{ url: img.src, width: img.w, height: img.h }] },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const cat = getCategory(p.category)!;
  const out = soldOut(p);
  // one more from the same category, then the first product of each other setup layer
  const sibling = inCategory(p.category).find((x) => x.slug !== p.slug);
  const layers = (["core", "wrist", "audio", "extra"] as const).filter((l) => l !== p.layer);
  const related = [...(sibling ? [sibling] : []), ...layers.map((l) => products.find((x) => x.layer === l && x.stock !== 0)!).filter(Boolean)].slice(0, 4);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: sku(p),
    image: p.images.map((m) => absoluteUrl(m.src)),
    description: p.summary,
    offers: { "@type": "Offer", priceCurrency: "MNT", price: p.price, availability: out ? "https://schema.org/OutOfStock" : "https://schema.org/InStock", url: absoluteUrl(`/p/${p.slug}`) },
  };

  // the long description: paragraphs, with list items grouped into lists
  const blocks: ({ t: "p"; text: string } | { t: "ul"; items: string[] })[] = [];
  for (const b of p.details) {
    const last = blocks[blocks.length - 1];
    if (b.t === "li") {
      if (last?.t === "ul") last.items.push(b.text);
      else blocks.push({ t: "ul", items: [b.text] });
    } else blocks.push({ t: "p", text: b.text });
  }

  return (
    <div className="wrap pt-6 md:pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Зам" className="mono flex flex-wrap items-center gap-2 text-[12.5px] text-ash">
        <Link href="/" className="hover:text-basalt">
          Нүүр
        </Link>
        /
        <Link href={`/shop?c=${cat.id}`} className="hover:text-basalt">
          {cat.name}
        </Link>
        / <span className="text-basalt">{p.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Gallery images={p.images} name={p.name} dim={out} />
        </div>
        <div>
          <p className="kicker text-lava">
            {cat.name} · {cat.note}
          </p>
          <h1 className="display mt-3 text-[46px] md:text-[64px]">{p.name}</h1>
          {p.subtitle && <p className="mono mt-2 text-[14px] text-granite">{p.subtitle}</p>}
          <div className="mt-5 flex flex-wrap gap-1.5">
            {p.specs.map((s) => (
              <span key={s} className="chip bg-white">
                {s}
              </span>
            ))}
          </div>
          <div className="mt-7">
            <Price p={p} large />
            <p className="mt-1 text-[13px] text-ash">Бэлэн төлбөрөөр (QPay). Лизинг, зээлийн апп: чатаар.</p>
          </div>
          <div className="mt-6">
            <BuyBox slug={p.slug} />
          </div>
          {!out && (
            <a href={business.messenger} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-[14.5px] font-semibold text-granite hover:text-lava">
              <ChatIcon size={17} /> Бэлэн эсэх, өнгөний сонголтыг чатаар асуух
            </a>
          )}

          <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl bg-basalt/10 sm:grid-cols-2">
            {[
              { icon: ShieldIcon, t: "3–12 сарын баталгаа", d: "Бүтээгдэхүүнээс хамаарна" },
              // FAQ: Apple products come from the US, PlayStation / Nintendo Switch from Korea; other brands are not stated
              { icon: PlaneIcon, t: p.category === "gaming" ? "Солонгосоос" : p.name.startsWith("Google") ? "Баталгаат бараа" : "Америкаас", d: "Баталгаат борлуулагчаас" },
              { icon: TruckIcon, t: "48 цагийн дотор", d: "Байршлаас хамаарч хүргэнэ" },
              { icon: StoreIcon, t: "Ирж авах", d: "Сансар центр, 2 давхар" },
            ].map(({ icon: Icon, t, d }) => (
              <li key={t} className="flex items-center gap-3 bg-chalk p-4">
                <Icon size={20} className="shrink-0 text-lava" />
                <span>
                  <span className="block text-[14.5px] font-semibold">{t}</span>
                  <span className="block text-[12.5px] text-ash">{d}</span>
                </span>
              </li>
            ))}
          </ul>

          <section className="mt-10">
            <h2 className="kicker text-ash">Тойм</h2>
            <p className="mt-3 text-[18px] leading-relaxed">{p.summary}</p>
          </section>
          {blocks.length > 0 && (
            <section className="mt-8 border-t border-basalt/15 pt-8">
              <h2 className="kicker text-ash">Дэлгэрэнгүй</h2>
              <div className="prose-bd mt-4">
                {blocks.map((b, i) =>
                  b.t === "p" ? (
                    <p key={i}>{b.text}</p>
                  ) : (
                    <ul key={i}>
                      {b.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  ),
                )}
              </div>
            </section>
          )}
        </div>
      </div>

      <section className="pt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-[40px] md:text-[52px]">Дараагийн давхарга</h2>
          <Link href="/#setup" className="inline-flex items-center gap-2 font-semibold hover:text-lava">
            Сетап угсрах <ArrowIcon size={18} />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
          {related.map((r) => (
            <ProductCard key={r.slug} p={r} />
          ))}
        </div>
      </section>
    </div>
  );
}
