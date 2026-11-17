"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cart, maxQty } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { getLite, liteProducts, type Lite } from "@/lib/lite";
import { ArrowIcon, CheckIcon, CloseIcon, LayersIcon } from "./icons";

const LAYERS: { id: Lite["l"]; no: string; name: string; hint: string; tone: string }[] = [
  { id: "extra", no: "04", name: "Нэмэлт", hint: "Үзэг, гар, хулгана, консол", tone: "bg-stone-2 text-basalt" },
  { id: "audio", no: "03", name: "Чихэнд", hint: "AirPods", tone: "bg-ash text-white" },
  { id: "wrist", no: "02", name: "Бугуйнд", hint: "Цаг, фитнес трекер", tone: "bg-granite text-white" },
  { id: "core", no: "01", name: "Суурь төхөөрөмж", hint: "iPhone, Mac, iPad", tone: "bg-basalt text-chalk" },
];
// the picker runs bottom-up: the bedrock first
const PICK_ORDER = [...LAYERS].reverse();

/** Pick one product per layer and watch the stack build up; the total and «add all» follow the picks. */
export function SetupBuilder() {
  const [pick, setPick] = useState<Record<Lite["l"], string | null>>({ core: "iphone-18-pro", wrist: "apple-watch-se-3-44mm", audio: "airpods-pro-3", extra: null });
  const [active, setActive] = useState<Lite["l"]>("core");
  const [done, setDone] = useState(false);

  const chosen = PICK_ORDER.map((l) => (pick[l.id] ? getLite(pick[l.id]!) : undefined)).filter((p): p is Lite => !!p);
  const total = chosen.reduce((s, p) => s + p.p, 0);
  const options = liteProducts.filter((p) => p.l === active);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
      {/* picker */}
      <div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Давхарга">
          {PICK_ORDER.map((l) => (
            <button
              key={l.id}
              type="button"
              role="tab"
              aria-selected={active === l.id}
              onClick={() => setActive(l.id)}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-left transition ${active === l.id ? "bg-basalt text-chalk" : "bg-chalk text-basalt hover:bg-stone-2"}`}
            >
              <span className="kicker block opacity-60">Давхарга {l.no}</span>
              <span className="mt-0.5 block text-[15px] font-semibold">{l.name}</span>
            </button>
          ))}
        </div>
        <p className="mt-4 text-[14px] text-ash">{LAYERS.find((l) => l.id === active)?.hint}: нэгийг сонго, эсвэл хоосон орхи.</p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {options.map((p) => {
            const selected = pick[active] === p.s;
            const out = maxQty(p.s) <= 0;
            return (
              <button
                key={p.s}
                type="button"
                disabled={out}
                onClick={() => {
                  setPick({ ...pick, [active]: selected ? null : p.s });
                  setDone(false);
                }}
                aria-pressed={selected}
                className={`group relative flex flex-col rounded-2xl bg-plinth p-3 text-left transition ${selected ? "ring-2 ring-lava" : "ring-1 ring-basalt/10 hover:ring-basalt/40"} disabled:cursor-not-allowed disabled:opacity-45`}
              >
                <span className="relative block aspect-square">
                  <Image src={p.t} alt="" fill sizes="(min-width: 1024px) 14vw, 40vw" className="object-contain transition duration-500 group-hover:scale-105" />
                </span>
                <span className="mt-2 line-clamp-2 text-[13.5px] leading-snug font-semibold">{p.n}</span>
                <span className="mono mt-1 text-[13px] text-granite">{out ? "Дууссан" : formatPrice(p.p)}</span>
                {selected && (
                  <span className="pop absolute top-2 right-2 grid h-7 w-7 place-items-center rounded-lg bg-lava text-white">
                    <CheckIcon size={16} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* the stack */}
      <div className="lg:sticky lg:top-32 lg:self-start">
        <div className="grain overflow-hidden rounded-[26px] bg-chalk p-4 shadow-[0_30px_60px_-40px_rgb(20_20_19/0.6)] md:p-6">
          <div className="flex items-center justify-between">
            <p className="kicker flex items-center gap-2 text-granite">
              <LayersIcon size={16} /> Таны сетап
            </p>
            <p className="kicker text-ash">{chosen.length} / 4 давхарга</p>
          </div>
          <ol className="mt-4 grid gap-1.5">
            {LAYERS.map((l, i) => {
              const p = pick[l.id] ? getLite(pick[l.id]!) : undefined;
              return (
                <li
                  key={`${l.id}-${p?.s ?? "none"}`}
                  className={`settle flex min-h-[68px] items-center gap-3 rounded-xl px-3 py-2 ${p ? l.tone : "border border-dashed border-basalt/20 text-ash"}`}
                  style={{ "--d": `${i * 70}ms`, marginInline: `${(3 - i) * 6}px` } as React.CSSProperties}
                >
                  <span className="kicker w-6 shrink-0 opacity-60">{l.no}</span>
                  {p ? (
                    <>
                      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white">
                        <Image src={p.t} alt="" fill sizes="48px" className="object-contain p-1" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14.5px] font-semibold">{p.n}</span>
                        <span className="mono block text-[12.5px] opacity-75">{formatPrice(p.p)}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setPick({ ...pick, [l.id]: null });
                          setDone(false);
                        }}
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg opacity-70 hover:bg-white/15 hover:opacity-100"
                        aria-label={`${p.n}: хасах`}
                      >
                        <CloseIcon size={16} />
                      </button>
                    </>
                  ) : (
                    <button type="button" onClick={() => setActive(l.id)} className="flex-1 text-left text-[14px]">
                      + {l.name}
                    </button>
                  )}
                </li>
              );
            })}
          </ol>
          <div className="mt-5 flex items-end justify-between gap-4 border-t border-basalt/10 pt-5">
            <div>
              <p className="kicker text-ash">Нийт</p>
              <p key={total} className="mono pop text-[30px] font-bold tracking-tight md:text-[36px]">
                {formatPrice(total)}
              </p>
            </div>
            <p className="pb-1.5 text-right text-[12.5px] text-ash">Хүргэлтийн төлбөрийг утсаар тохирно</p>
          </div>
          <button
            type="button"
            disabled={!chosen.length}
            onClick={() => {
              chosen.forEach((p) => cart.add(p.s, 1));
              setDone(true);
            }}
            className="btn btn-lava mt-4 w-full disabled:opacity-40"
          >
            {done ? (
              <span className="pop inline-flex items-center gap-2">
                <CheckIcon size={18} /> Сагсанд нэмэгдлээ
              </span>
            ) : (
              <>Бүгдийг сагсанд хийх</>
            )}
          </button>
          {done && (
            <Link href="/cart" className="mt-3 flex items-center justify-center gap-1.5 text-[15px] font-semibold text-lava hover:text-basalt">
              Сагс руу очих <ArrowIcon size={16} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
