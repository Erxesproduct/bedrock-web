import Image from "next/image";
import Link from "next/link";
import { BuyBox } from "@/components/buy-box";
import { ArrowIcon, ChatIcon, PinIcon, PlaneIcon, ShieldIcon, StoreIcon, TruckIcon } from "@/components/icons";
import { Price } from "@/components/price";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { SetupBuilder } from "@/components/setup-builder";
import { Spot } from "@/components/spot";
import { business } from "@/content/business";
import { categories, faq, getProduct, inCategory, newest, products } from "@/lib/catalog";

const HERO = ["macbook-air-m5", "iphone-18-pro-max", "airpods-pro-3"].map((s) => getProduct(s)!);
const SUMMIT = getProduct("iphone-18-pro-max")!;
const SALE = products.filter((p) => p.compareAt);

export default function Home() {
  return (
    <>
      {/* ── hero ─────────────────────────────────────────── */}
      <section className="topo relative overflow-hidden">
        <div className="wrap grid items-center gap-10 pt-10 pb-6 md:pt-16 lg:grid-cols-[1.05fr_1fr] lg:pb-16">
          <div className="relative z-10">
            <p className="kicker rise flex items-center gap-2 text-granite">
              <span className="blink h-2 w-2 rounded-full bg-lava" /> Electronics store · Est. {business.since}
            </p>
            <h1 className="display rise mt-5 text-[clamp(40px,13.5vw,64px)] sm:text-[88px] lg:text-[clamp(76px,6.9vw,108px)]" style={{ "--d": "80ms" } as React.CSSProperties}>
              Технологийн
              <br />
              <span className="text-lava">бат</span> суурь
            </h1>
            <p className="rise mt-6 max-w-xl text-[17px] leading-relaxed text-granite md:text-[18px]" style={{ "--d": "160ms" } as React.CSSProperties}>
              iPhone, Mac, iPad, Apple Watch, AirPods, Nintendo Switch 2. Америк, Солонгосын баталгаат борлуулагчаас, үйлдвэрийн баталгаатай.
            </p>
            <div className="rise mt-8 flex flex-wrap gap-3" style={{ "--d": "240ms" } as React.CSSProperties}>
              <Link href="/shop" className="btn btn-lava">
                Дэлгүүр үзэх <ArrowIcon size={18} />
              </Link>
              <Link href="#setup" className="btn btn-line">
                Сетапаа угсрах
              </Link>
            </div>
            <dl className="rise mt-10 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-2xl bg-basalt/10 sm:grid-cols-4" style={{ "--d": "320ms" } as React.CSSProperties}>
              {[
                [String(products.length), "бараа"],
                ["3–12", "сар баталгаа"],
                ["48", "цагт хүргэнэ"],
                [String(business.since), "оноос"],
              ].map(([v, k]) => (
                <div key={k} className="bg-stone px-4 py-3">
                  <dt className="sr-only">{k}</dt>
                  <dd>
                    <span className="mono block text-[22px] font-bold">{v}</span>
                    <span className="text-[12.5px] text-ash">{k}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* a stack of rock slabs, each carrying a product */}
          <div className="relative mx-auto aspect-square w-full max-w-[560px]" aria-hidden>
            <Image src="/brand/mountain.png" alt="" width={910} height={205} priority className="absolute inset-x-0 top-[6%] w-full opacity-[0.07]" />
            <div className="absolute inset-x-[4%] bottom-[6%] h-[12%] rounded-[50%] bg-basalt/25 blur-2xl" />
            {HERO.map((p, i) => {
              const pos = [
                "left-[0%] top-[30%] z-10 w-[56%] [--r:-3deg] [--d:0s]",
                "right-[2%] top-[0%] w-[44%] [--r:4deg] [--d:-2s]",
                "right-[0%] bottom-[0%] z-20 w-[36%] [--r:-5deg] [--d:-4s]",
              ][i];
              return (
                <Link key={p.slug} href={`/p/${p.slug}`} tabIndex={-1} className={`float absolute ${pos}`}>
                  <span className="block overflow-hidden rounded-[22px] bg-plinth p-4 shadow-[0_30px_50px_-30px_rgb(20_20_19/0.7)] ring-1 ring-basalt/5">
                    <Image src={p.images[0].thumb.src} alt="" width={p.images[0].thumb.w} height={p.images[0].thumb.h} priority sizes="(min-width: 1024px) 18vw, 40vw" className="aspect-square w-full object-contain" />
                  </span>
                  <span className="mono mt-2 flex items-center justify-between gap-2 rounded-lg bg-basalt px-3 py-1.5 text-[11.5px] text-chalk">
                    <span className="truncate">{p.name}</span>
                    <span className="shrink-0 text-ember">{(p.price / 1e6).toFixed(1)}сая₮</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="strata" aria-hidden />
      </section>

      {/* ── ticker ───────────────────────────────────────── */}
      <div className="overflow-hidden bg-basalt py-3.5 text-chalk" aria-hidden>
        <div className="ticker">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {newest.map((p) => (
                <span key={p.slug} className="mono flex items-center gap-4 px-5 text-[14px] whitespace-nowrap">
                  <span className="text-lava">▲</span> {p.name} <span className="text-chalk/45">{(p.price / 1000).toLocaleString("en-US")}K₮</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── categories as layers ─────────────────────────── */}
      <section className="wrap pt-20 md:pt-28">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker text-lava">Давхарга бүрээр</p>
            <h2 className="display mt-3 text-[48px] md:text-[64px]">Ангилал</h2>
          </div>
          <Link href="/shop" className="inline-flex items-center gap-2 font-semibold hover:text-lava">
            Бүх {products.length} бараа <ArrowIcon size={18} />
          </Link>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((c, i) => {
            const lead = inCategory(c.id)[0];
            const big = i === 0;
            return (
              <Reveal key={c.id} delay={i * 60} className={big ? "col-span-2 row-span-2" : i === categories.length - 1 ? "md:col-span-3 lg:col-span-2" : i === categories.length - 2 ? "lg:col-span-2" : ""}>
                <Spot className="plinth group h-full">
                  <Link href={`/shop?c=${c.id}`} className={`flex h-full flex-col p-5 ${big ? "min-h-[380px] md:min-h-[520px]" : "min-h-[250px]"}`}>
                    <span className="kicker relative z-[2] text-ash">
                      {String(i + 1).padStart(2, "0")} · {c.note}
                    </span>
                    <span className={`display relative z-[2] mt-1 ${big ? "text-[clamp(40px,13vw,54px)] md:text-[72px]" : "text-[clamp(20px,6.4vw,30px)] md:text-[34px]"}`}>{c.name}</span>
                    <span className="relative mt-3 flex-1">
                      <Image src={lead.images[0].thumb.src} alt="" fill sizes={big ? "(min-width: 1024px) 45vw, 90vw" : "(min-width: 1024px) 22vw, 45vw"} className="object-contain transition duration-700 group-hover:scale-105 group-hover:-rotate-2" />
                    </span>
                    <span className="relative z-[2] mt-3 flex items-center justify-between text-[13.5px] font-semibold">
                      <span className="mono text-ash">{c.count} бараа</span>
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-basalt text-chalk transition group-hover:bg-lava">
                        <ArrowIcon size={16} />
                      </span>
                    </span>
                  </Link>
                </Spot>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── summit: the flagship ─────────────────────────── */}
      <section className="mt-24 md:mt-32">
        <div className="strata strata-flip" aria-hidden />
        <div className="topo-light bg-basalt text-chalk">
          <div className="wrap grid items-center gap-10 py-16 md:py-20 lg:grid-cols-2">
            <Reveal>
              <p className="kicker text-ember">Оргил · шинээр ирсэн</p>
              <h2 className="display mt-4 text-[56px] md:text-[80px]">{SUMMIT.name}</h2>
              <p className="mt-5 max-w-lg text-[16.5px] leading-relaxed text-chalk/70">{SUMMIT.summary}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {SUMMIT.specs.map((s) => (
                  <span key={s} className="chip border-white/15 bg-white/5 text-chalk">
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-8 text-chalk">
                <Price p={SUMMIT} large />
              </div>
              <div className="mt-6 max-w-md">
                <BuyBox slug={SUMMIT.slug} />
              </div>
            </Reveal>
            <Reveal delay={120} className="relative">
              <div className="absolute inset-[8%] rounded-full bg-lava/25 blur-[90px]" aria-hidden />
              <Link href={`/p/${SUMMIT.slug}`} className="relative block overflow-hidden rounded-[28px] bg-plinth p-8">
                <Image src={SUMMIT.images[0].src} alt={SUMMIT.name} width={SUMMIT.images[0].w} height={SUMMIT.images[0].h} sizes="(min-width: 1024px) 45vw, 90vw" className="mx-auto max-h-[440px] w-auto object-contain" />
              </Link>
            </Reveal>
          </div>
        </div>
        <div className="strata" aria-hidden />
      </section>

      {/* ── newest ───────────────────────────────────────── */}
      <section className="wrap pt-20 md:pt-28">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker text-lava">Шинэ давхарга</p>
            <h2 className="display mt-3 text-[48px] md:text-[64px]">Шинээр ирсэн</h2>
          </div>
          <Link href="/shop?s=new" className="inline-flex items-center gap-2 font-semibold hover:text-lava">
            Бүгдийг үзэх <ArrowIcon size={18} />
          </Link>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
          {newest.slice(0, 8).map((p, i) => (
            <Reveal key={p.slug} delay={(i % 4) * 70}>
              <ProductCard p={p} index={i} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── setup builder ────────────────────────────────── */}
      <section id="setup" className="wrap scroll-mt-32 pt-24 md:pt-32">
        <Reveal className="max-w-2xl">
          <p className="kicker text-lava">Интерактив</p>
          <h2 className="display mt-3 text-[48px] md:text-[64px]">Сетапаа давхаргаар угсар</h2>
          <p className="mt-4 text-[17px] text-granite">Суурь төхөөрөмжөө сонгоод цаг, чихэвч, нэмэлтээ давхарлан тавь. Нийт үнэ шууд бодогдоно, нэг товшилтоор бүгдийг сагсална.</p>
        </Reveal>
        <div className="mt-10">
          <SetupBuilder />
        </div>
      </section>

      {/* ── sale ─────────────────────────────────────────── */}
      {SALE.length > 0 && (
        <section className="wrap pt-24">
          <Reveal className="grain overflow-hidden rounded-[28px] bg-lava p-6 text-white md:p-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="display text-[44px] md:text-[60px]">Үнэ буусан</h2>
              <p className="mono max-w-sm text-[14px] text-white/85">{SALE.length} бараа · хуучин үнэ зураастай</p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {SALE.map((p) => (
                <Link key={p.slug} href={`/p/${p.slug}`} className="group flex items-center gap-4 rounded-2xl bg-white p-3 text-basalt transition hover:-translate-y-1 md:p-4">
                  <span className="relative h-28 w-28 shrink-0 md:h-32 md:w-32">
                    <Image src={p.images[0].thumb.src} alt="" fill sizes="128px" className="object-contain transition duration-500 group-hover:scale-105" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[17px] font-semibold">{p.name}</span>
                    {p.subtitle && <span className="block text-[13px] text-ash">{p.subtitle}</span>}
                    <span className="mt-2 block">
                      <Price p={p} />
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* ── why bedrock ──────────────────────────────────── */}
      <section className="wrap pt-24 md:pt-32">
        <Reveal>
          <p className="kicker text-lava">Яагаад BedRock</p>
          <h2 className="display mt-3 max-w-3xl text-[48px] md:text-[64px]">Бат бөх суурьтай худалдаа</h2>
        </Reveal>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShieldIcon, t: "3–12 сарын баталгаа", d: "Бараа бүтээгдэхүүнээс шалтгаалан үйлдвэрийн баталгаат хугацаа өгнө." },
            { icon: PlaneIcon, t: "Америк, Солонгосоос", d: "Apple-ийн бүтээгдэхүүн Америкаас, Nintendo Switch, PlayStation Солонгосоос." },
            { icon: TruckIcon, t: "48 цагт хүргэнэ", d: "Байршлаас хамаарч. Ихэнх захиалгыг өдөрт нь хүргэхийг хичээдэг. Орон нутагт унаагаар." },
            { icon: StoreIcon, t: "Ирж авах", d: business.address + ". Ирэхээсээ өмнө залгаарай." },
          ].map(({ icon: Icon, t, d }, i) => (
            <Reveal key={t} delay={i * 70} className="rounded-[22px] bg-chalk p-6">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-basalt text-ember">
                <Icon size={22} />
              </span>
              <h3 className="display mt-5 text-[24px]">{t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-granite">{d}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-3 flex flex-col gap-4 rounded-[22px] bg-basalt p-6 text-chalk md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-lava text-white">
              <ChatIcon size={22} />
            </span>
            <div>
              <p className="display text-[26px]">Лизинг, зээлийн апп-аар авах уу?</p>
              <p className="mt-1 text-[15px] text-chalk/70">{business.rules.leasing}</p>
            </div>
          </div>
          <a href={business.messenger} target="_blank" rel="noreferrer" className="btn btn-lava shrink-0">
            Чат бичих
          </a>
        </Reveal>
      </section>

      {/* ── faq + store ──────────────────────────────────── */}
      <section className="wrap grid gap-10 pt-24 md:pt-32 lg:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <p className="kicker text-lava">Асуулт, хариулт</p>
          <h2 className="display mt-3 text-[48px] md:text-[56px]">Түгээмэл асуулт</h2>
          <div className="mt-8 divide-y divide-basalt/15 border-y border-basalt/15">
            {faq.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[17px] font-semibold">
                  {f.q}
                  <span className="mono mt-0.5 shrink-0 text-lava transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[15.5px] leading-relaxed text-granite">{f.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
        <Reveal delay={100} className="topo flex flex-col rounded-[26px] bg-chalk p-6 md:p-8">
          <p className="kicker text-ash">Дэлгүүр</p>
          <p className="display mt-3 text-[36px]">Сансар центр</p>
          <p className="mt-2 flex gap-2 text-[16px] text-granite">
            <PinIcon size={20} className="mt-0.5 shrink-0 text-lava" /> {business.address}
          </p>
          <Image src="/brand/mountain.png" alt="" width={910} height={205} className="mt-auto w-full pt-10 opacity-90" />
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`tel:${business.phone.tel}`} className="btn btn-basalt mono">
              {business.phone.display}
            </a>
            <a href={business.facebook} target="_blank" rel="noreferrer" className="btn btn-line">
              Facebook
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
