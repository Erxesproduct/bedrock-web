"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { business, deliveryFee, deliveryOption, type DeliveryId } from "@/content/business";
import { cart, cartSubtotal, maxQty, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { resolveLine } from "@/lib/lite";
import type { OrderErrors, PaymentMethod } from "@/lib/orders/schema";
import { ChatIcon, CheckIcon, MinusIcon, MountainIcon, PhoneIcon, PlusIcon, TrashIcon } from "./icons";

type Done = { reference: string; total: number; deliveryFee: number | null; delivery: DeliveryId; lines: { name: string; qty: number; total: number }[] };

const field = "mt-1.5 w-full rounded-xl border border-basalt/20 bg-chalk px-4 py-3 text-[15.5px] outline-none transition focus:border-basalt focus:bg-white aria-invalid:border-lava aria-invalid:bg-lava/5";
const feeLabel = (fee: number | null) => (fee == null ? "Утсаар тохирно" : fee ? formatPrice(fee) : "Төлбөргүй");

export function Checkout() {
  const items = useCart();
  const [delivery, setDelivery] = useState<DeliveryId>("ub");
  const payment: PaymentMethod = "qpay";
  const [receiptType, setReceiptType] = useState<"person" | "company">("person");
  const [errors, setErrors] = useState<OrderErrors>({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [done, setDone] = useState<Done | null>(null);

  const lines = items.flatMap((i) => {
    const l = resolveLine(i.slug);
    return l ? [{ ...i, line: l }] : [];
  });
  const subtotal = cartSubtotal(items);
  const fee = deliveryFee(delivery);
  const total = subtotal + (fee ?? 0);
  const option = deliveryOption(delivery);

  if (done) return <Receipt done={done} />;

  if (!lines.length)
    return (
      <div className="topo mx-auto max-w-lg rounded-[26px] bg-chalk px-8 py-14 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-basalt text-chalk">
          <MountainIcon size={28} />
        </span>
        <p className="display mt-6 text-4xl">Сагс хоосон</p>
        <p className="mt-2 text-granite">Суурь төхөөрөмжөөсөө эхэл.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="btn btn-basalt">
            Бүх бараа
          </Link>
          <Link href="/#setup" className="btn btn-line">
            Сетап угсрах
          </Link>
        </div>
      </div>
    );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setNotice(null);
    setErrors({});
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.get("name"),
          phone: f.get("phone"),
          email: f.get("email"),
          delivery,
          address: f.get("address") ?? "",
          payment,
          receiptType,
          regNo: f.get("regNo") ?? "",
          note: f.get("note"),
          website: f.get("website"),
          items: items.map(({ slug, qty }) => ({ slug, qty })),
        }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok) {
        setDone({ reference: json.reference, total: json.total ?? total, deliveryFee: json.deliveryFee === undefined ? fee : json.deliveryFee, delivery, lines: lines.map((l) => ({ name: l.line.product.n, qty: l.qty, total: l.line.price * l.qty })) });
        cart.clear();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (res.status === 422 && json?.errors) {
        setErrors(json.errors);
        setNotice("Мэдээллээ шалгаад дахин оролдоно уу.");
      } else if (json?.error === "not_configured") {
        setNotice(`Онлайн захиалгын систем тохируулагдаж байна. Захиалгаа ${business.phone.display} дугаарт утсаар эсвэл Facebook чатаар өгнө үү (лавлах код ${json.reference}, барааны дүн ${formatPrice(json.total ?? total)}).`);
      } else {
        setNotice(`Захиалга илгээхэд алдаа гарлаа. Дахин оролдох эсвэл ${business.phone.display} дугаарт залгана уу.`);
      }
    } catch {
      setNotice("Интернэт холболтоо шалгаад дахин оролдоно уу.");
    } finally {
      setBusy(false);
    }
  }

  const err = (k: keyof OrderErrors) => errors[k] && <p className="mt-1.5 text-[13.5px] font-semibold text-lava">{errors[k]}</p>;
  const step = (n: number, t: string) => (
    <h2 className="flex items-center gap-3">
      <span className="mono grid h-9 w-9 place-items-center rounded-lg bg-basalt text-[14px] font-bold text-chalk">{String(n).padStart(2, "0")}</span>
      <span className="display text-[26px]">{t}</span>
    </h2>
  );

  return (
    <form onSubmit={submit} noValidate className="grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:gap-8">
      <div className="space-y-5">
        <section className="overflow-hidden rounded-[22px] bg-chalk">
          <ul className="divide-y divide-basalt/10">
            {lines.map(({ slug, qty, line }) => (
              <li key={slug} className="flex gap-4 p-4 md:p-5">
                <Link href={`/p/${slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-white">
                  <Image src={line.product.t} alt="" fill sizes="96px" className="object-contain p-2" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link href={`/p/${slug}`} className="text-[16.5px] leading-snug font-semibold hover:text-lava">
                    {line.product.n}
                  </Link>
                  <span className="mono text-[12.5px] text-ash">{formatPrice(line.price)} / ш</span>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
                    <div className="flex items-center rounded-lg border border-basalt/20 bg-white">
                      <button type="button" onClick={() => cart.setQty(slug, qty - 1)} className="grid h-9 w-9 place-items-center hover:bg-stone" aria-label="Цөөлөх">
                        <MinusIcon size={16} />
                      </button>
                      <span className="mono w-7 text-center text-sm font-bold">{qty}</span>
                      <button type="button" onClick={() => cart.setQty(slug, qty + 1)} disabled={qty >= maxQty(slug)} className="grid h-9 w-9 place-items-center hover:bg-stone disabled:opacity-30" aria-label="Нэмэх">
                        <PlusIcon size={16} />
                      </button>
                    </div>
                    <span className="mono font-bold">{formatPrice(line.price * qty)}</span>
                    <button type="button" onClick={() => cart.setQty(slug, 0)} className="grid h-9 w-9 place-items-center rounded-lg text-ash hover:bg-lava/10 hover:text-lava" aria-label={`${line.product.n}: хасах`}>
                      <TrashIcon size={17} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <p className="flex gap-2.5 border-t border-basalt/10 bg-ember/15 px-5 py-3.5 text-[13.5px] leading-snug text-granite">
            <ChatIcon size={18} className="mt-0.5 shrink-0 text-basalt" />
            <span>
              {business.rules.terms} Захиалгын дараа бид бэлэн эсэхийг утсаар баталгаажуулна.
            </span>
          </p>
        </section>

        <section className="rounded-[22px] bg-chalk p-5 md:p-7">
          {step(1, "Захиалагч")}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-[14px] font-semibold">
              Нэр
              <input name="name" autoComplete="name" required aria-invalid={!!errors.name} className={field} />
              {err("name")}
            </label>
            <label className="text-[14px] font-semibold">
              Утас
              <input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="99112233" required aria-invalid={!!errors.phone} className={field} />
              {err("phone")}
            </label>
            <label className="text-[14px] font-semibold sm:col-span-2">
              Имэйл <span className="font-normal text-ash">(заавал биш)</span>
              <input name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} className={field} />
              {err("email")}
            </label>
          </div>
          <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        </section>

        <section className="rounded-[22px] bg-chalk p-5 md:p-7">
          {step(2, "Хүлээн авах")}
          <div className="mt-5 grid gap-2.5" role="radiogroup" aria-label="Хүлээн авах хэлбэр">
            {business.delivery.map((d) => (
              <button
                key={d.id}
                type="button"
                role="radio"
                aria-checked={delivery === d.id}
                onClick={() => setDelivery(d.id)}
                className="flex items-start gap-3 rounded-xl border border-basalt/15 bg-white p-4 text-left transition hover:border-basalt/40 aria-checked:border-basalt aria-checked:ring-1 aria-checked:ring-basalt"
              >
                <span className={`mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full ring-2 ${delivery === d.id ? "ring-lava" : "ring-basalt/30"}`}>{delivery === d.id && <span className="h-2 w-2 rounded-full bg-lava" />}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-3 font-semibold">
                    {d.name}
                    <span className="mono text-[13px] font-semibold text-granite">{feeLabel(d.fee)}</span>
                  </span>
                  <span className="mt-0.5 block text-[13.5px] leading-snug text-ash">{d.note}</span>
                </span>
              </button>
            ))}
          </div>
          {option.needsAddress ? (
            <label className="mt-4 block text-[14px] font-semibold">
              {delivery === "countryside" ? "Аймаг, сум, хүлээн авах хаяг" : "Хаяг"}
              <textarea
                name="address"
                rows={2}
                required
                aria-invalid={!!errors.address}
                placeholder={delivery === "countryside" ? "Аймаг, сум, унааны мэдээлэл" : "Дүүрэг, хороо, байр, орц, давхар, тоот"}
                className={field}
              />
              {err("address")}
            </label>
          ) : (
            <p className="mt-4 rounded-xl bg-stone px-4 py-3 text-[14px]">
              <b>{business.address}.</b> Ирэхээсээ өмнө {business.phone.display} дугаарт залгаарай.
            </p>
          )}
        </section>

        <section className="rounded-[22px] bg-chalk p-5 md:p-7">
          {step(3, "И-баримт, тайлбар")}
          <div className="mt-5 flex gap-2" role="radiogroup" aria-label="И-баримтын төрөл">
            {(
              [
                ["person", "Хувь хүн"],
                ["company", "Байгууллага"],
              ] as const
            ).map(([id, label]) => (
              <button key={id} type="button" role="radio" aria-checked={receiptType === id} onClick={() => setReceiptType(id)} className="rounded-lg border border-basalt/20 px-5 py-2 text-[14.5px] font-semibold aria-checked:border-basalt aria-checked:bg-basalt aria-checked:text-chalk">
                {label}
              </button>
            ))}
          </div>
          {receiptType === "company" ? (
            <label className="mt-4 block text-[14px] font-semibold">
              Байгууллагын регистр
              <input name="regNo" inputMode="numeric" maxLength={7} placeholder="1234567" aria-invalid={!!errors.regNo} className={field} />
              {err("regNo")}
            </label>
          ) : (
            <p className="mt-3 text-[13.5px] text-ash">И-баримтыг таны утасны дугаараар бүртгэнэ.</p>
          )}
          <label className="mt-5 block text-[14px] font-semibold">
            Нэмэлт тайлбар <span className="font-normal text-ash">(өнгө, хүргэх цаг гэх мэт)</span>
            <textarea name="note" rows={2} className={field} />
          </label>
        </section>
      </div>

      <aside className="lg:sticky lg:top-32 lg:self-start">
        <div className="topo-light relative overflow-hidden rounded-[26px] bg-basalt p-6 text-chalk md:p-8">
          <h2 className="display text-[34px]">Төлөх дүн</h2>
          <dl className="mono mt-5 space-y-2.5 text-[14.5px]">
            <div className="flex justify-between gap-4">
              <dt className="text-chalk/60">Барааны дүн</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-chalk/60">Хүргэлт</dt>
              <dd className="text-right">{feeLabel(fee)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-t border-white/15 pt-3">
              <dt className="font-bold">Нийт</dt>
              <dd className="text-[28px] font-bold text-ember">{formatPrice(total)}</dd>
            </div>
          </dl>
          {fee == null && <p className="mt-2 text-[12.5px] text-chalk/55">Хүргэлтийн төлбөр нийт дүнд ороогүй, байршлаас хамаарч утсаар тохирно.</p>}
          <div className="mt-6 rounded-xl bg-white/6 p-4 ring-1 ring-white/10">
            <p className="kicker text-chalk/55">Төлбөр</p>
            <p className="mt-1.5 font-semibold">QPay</p>
            <p className="text-[12.5px] text-chalk/60">{business.payments[0].note}. {business.rules.payment}</p>
            {errors.payment && <p className="mt-2 text-[13px] font-semibold text-ember">{errors.payment}</p>}
          </div>
          <p className="mt-3 text-[12.5px] leading-snug text-chalk/60">{business.rules.leasing}</p>
          {notice && (
            <p role="alert" className="mt-4 rounded-xl bg-ember px-4 py-3 text-[14px] font-semibold text-basalt">
              {notice}
            </p>
          )}
          {errors.items && <p className="mt-3 text-[14px] font-semibold text-ember">{errors.items}</p>}
          <button type="submit" disabled={busy} className="btn btn-lava mt-6 h-14 w-full disabled:cursor-wait disabled:opacity-60">
            {busy ? "Илгээж байна…" : "Захиалга өгөх"}
          </button>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[14px] font-semibold text-chalk/75">
            <a href={`tel:${business.phone.tel}`} className="mono inline-flex items-center gap-2 hover:text-ember">
              <PhoneIcon size={16} /> {business.phone.display}
            </a>
            <a href={business.messenger} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-ember">
              <ChatIcon size={16} /> Facebook чат
            </a>
          </div>
        </div>
      </aside>
    </form>
  );
}

function Receipt({ done }: { done: Done }) {
  const option = deliveryOption(done.delivery);
  return (
    <div className="mx-auto max-w-lg">
      <div className="pop overflow-hidden rounded-[26px] bg-chalk">
        <div className="topo-light bg-basalt p-8 text-chalk">
          <span className="grid h-14 w-14 place-items-center rounded-xl bg-lava text-white">
            <CheckIcon size={28} />
          </span>
          <h2 className="display mt-5 text-[44px]">Захиалга хүлээн авлаа</h2>
          <p className="mt-2 text-chalk/70">
            Захиалгын код: <b className="mono text-ember">{done.reference}</b>
          </p>
        </div>
        <div className="p-8">
          <ul className="mono space-y-2 text-[14px]">
            {done.lines.map((l) => (
              <li key={l.name} className="flex justify-between gap-4">
                <span className="text-granite">
                  {l.name} × {l.qty}
                </span>
                <span className="shrink-0">{formatPrice(l.total)}</span>
              </li>
            ))}
            <li className="flex justify-between gap-4">
              <span className="text-granite">{option.name}</span>
              <span className="shrink-0">{feeLabel(done.deliveryFee)}</span>
            </li>
            <li className="flex justify-between gap-4 border-t border-basalt pt-3 text-lg font-bold">
              <span>Нийт</span>
              <span>{formatPrice(done.total)}</span>
            </li>
          </ul>
          <p className="mt-6 text-[14.5px] leading-relaxed text-granite">
            Бид бараа бэлэн эсэхийг шалгаад утсаар холбогдож, QPay нэхэмжлэл илгээнэ. {done.delivery === "pickup" ? `Ирж авах хаяг: ${business.address}.` : business.rules.delivery} {business.rules.ebarimt}
          </p>
          <Link href="/" className="btn btn-basalt mt-7">
            Нүүр хуудас
          </Link>
        </div>
      </div>
    </div>
  );
}
