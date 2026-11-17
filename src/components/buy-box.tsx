"use client";

import Link from "next/link";
import { useState } from "react";
import { business } from "@/content/business";
import { cart, maxQty, useCart } from "@/lib/cart";
import { ArrowIcon, ChatIcon, CheckIcon, MinusIcon, PlusIcon } from "./icons";

/** Quantity stepper + add to cart; sold-out products point to the chat instead. */
export function BuyBox({ slug }: { slug: string }) {
  const cap = maxQty(slug);
  const inCart = useCart().find((i) => i.slug === slug)?.qty ?? 0;
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (cap <= 0)
    return (
      <div className="rounded-2xl border border-basalt/15 bg-chalk p-5">
        <p className="font-semibold">Одоогоор дууссан.</p>
        <p className="mt-1 text-[15px] text-granite">Дахин ирэх эсэхийг чатаар эсвэл утсаар лавлана уу.</p>
        <a href={business.messenger} target="_blank" rel="noreferrer" className="btn btn-basalt mt-4 w-full">
          <ChatIcon size={18} /> Чатаар лавлах
        </a>
      </div>
    );

  const room = Math.max(0, cap - inCart);
  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <div className="flex h-[54px] items-center rounded-[14px] border border-basalt/20 bg-chalk text-basalt">
          <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-[52px] w-12 place-items-center rounded-l-[14px] hover:bg-stone-2" aria-label="Цөөлөх">
            <MinusIcon size={18} />
          </button>
          <span className="mono w-8 text-center text-lg font-bold" aria-live="polite">
            {qty}
          </span>
          <button type="button" onClick={() => setQty(Math.min(Math.max(1, room), qty + 1))} disabled={qty >= room} className="grid h-[52px] w-12 place-items-center rounded-r-[14px] hover:bg-stone-2 disabled:opacity-30" aria-label="Нэмэх">
            <PlusIcon size={18} />
          </button>
        </div>
        <button
          type="button"
          disabled={room === 0}
          onClick={() => {
            cart.add(slug, qty);
            setAdded(true);
            setQty(1);
            setTimeout(() => setAdded(false), 2000);
          }}
          className="btn btn-lava min-w-48 flex-1 disabled:opacity-50"
        >
          {added ? (
            <span className="pop inline-flex items-center gap-2">
              <CheckIcon size={18} /> Сагсанд нэмэгдлээ
            </span>
          ) : room === 0 ? (
            "Боломжит тоо бүгд сагсанд"
          ) : (
            "Сагсанд хийх"
          )}
        </button>
      </div>
      {inCart > 0 && (
        <Link href="/cart" className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold text-lava hover:text-basalt">
          Сагсанд {inCart} ширхэг байна: захиалах <ArrowIcon size={16} />
        </Link>
      )}
    </div>
  );
}

/** Small «+» on cards. */
export function QuickAdd({ slug, name }: { slug: string; name: string }) {
  const [added, setAdded] = useState(false);
  if (maxQty(slug) <= 0) return null;
  return (
    <button
      type="button"
      onClick={() => {
        cart.add(slug);
        setAdded(true);
        setTimeout(() => setAdded(false), 1400);
      }}
      className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl transition duration-300 ${added ? "bg-lava text-white" : "bg-basalt text-chalk hover:-translate-y-0.5 hover:bg-lava"}`}
      aria-label={`${name}: сагсанд нэмэх`}
    >
      {added ? <CheckIcon size={18} /> : <PlusIcon size={18} />}
      <span className="sr-only" aria-live="polite">
        {added ? "Сагсанд нэмэгдлээ" : ""}
      </span>
    </button>
  );
}
