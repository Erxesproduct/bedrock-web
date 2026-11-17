import Image from "next/image";
import Link from "next/link";
import { getCategory, soldOut, type Product } from "@/lib/catalog";
import { QuickAdd } from "./buy-box";
import { Price } from "./price";
import { Spot } from "./spot";

export function ProductCard({ p, priority = false, index }: { p: Product; priority?: boolean; index?: number }) {
  const img = p.images[0];
  const out = soldOut(p);
  return (
    <article className="group flex h-full flex-col">
      <Spot className="plinth aspect-square transition duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_24px_40px_-28px_rgb(20_20_19/0.55)]">
        <Link href={`/p/${p.slug}`} className="absolute inset-0 block p-6" aria-label={p.name}>
          <Image
            src={img.thumb.src}
            alt={p.name}
            width={img.thumb.w}
            height={img.thumb.h}
            priority={priority}
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 50vw"
            className={`h-full w-full object-contain transition duration-700 group-hover:scale-[1.05] ${out ? "opacity-50 grayscale" : ""}`}
          />
        </Link>
        <span className="kicker pointer-events-none absolute top-3 left-3 z-[2] text-ash">
          {index != null ? `${String(index + 1).padStart(2, "0")} / ` : ""}
          {getCategory(p.category)?.name}
        </span>
        {out ? (
          <span className="kicker absolute top-3 right-3 z-[2] rounded-md bg-basalt px-2 py-1 text-chalk">Дууссан</span>
        ) : p.compareAt ? (
          <span className="kicker absolute top-3 right-3 z-[2] rounded-md bg-lava px-2 py-1 text-white">Хямдрал</span>
        ) : null}
      </Spot>
      <div className="mt-4 flex flex-1 flex-col">
        <h3 className="text-[16.5px] leading-snug font-semibold">
          <Link href={`/p/${p.slug}`} className="hover:text-lava">
            {p.name}
          </Link>
        </h3>
        {p.subtitle && <p className="mt-0.5 text-[13px] text-ash">{p.subtitle}</p>}
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {p.specs.slice(0, 3).map((s) => (
            <span key={s} className="chip">
              {s}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <Price p={p} />
          <QuickAdd slug={p.slug} name={p.name} />
        </div>
      </div>
    </article>
  );
}
