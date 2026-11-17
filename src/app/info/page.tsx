import type { Metadata } from "next";
import Image from "next/image";
import { ChatIcon, MailIcon, PhoneIcon, PinIcon, ReceiptIcon, ShieldIcon, TruckIcon } from "@/components/icons";
import { business } from "@/content/business";
import { about, faq } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Хүргэлт, төлбөр, баталгаа",
  description: `${business.rules.delivery} ${business.rules.warranty} ${business.address}.`,
  alternates: { canonical: "/info" },
};

// the shop's FAQ plus the written rules as questions
const QA = [
  ...faq,
  { q: "Ямар төлбөрөөр авах вэ?", a: `${business.rules.payment} QPay-ээр аль ч банкны аппаар төлнө. ${business.rules.leasing}` },
  { q: "Захиалахаасаа өмнө юу шалгах вэ?", a: business.rules.terms },
  { q: "И-баримт өгөх үү?", a: business.rules.ebarimt },
];

export default function Info() {
  return (
    <div className="wrap pt-10 md:pt-14">
      <p className="kicker text-lava">Мэдээлэл</p>
      <h1 className="display mt-3 text-[56px] md:text-[96px]">
        Хүргэлт, төлбөр,
        <br />
        баталгаа
      </h1>

      <section className="mt-12 grid gap-3 md:grid-cols-3" id="delivery">
        {[
          { icon: TruckIcon, t: "Хүргэлт", d: business.rules.delivery, list: business.delivery.map((x) => `${x.name}: ${x.note}`) },
          { icon: ReceiptIcon, t: "Төлбөр", d: `${business.rules.payment} QPay: аль ч банкны аппаар.`, list: [business.rules.leasing] },
          { icon: ShieldIcon, t: "Баталгаа", d: business.rules.warranty, list: [business.rules.origin, business.rules.tradeIn] },
        ].map(({ icon: Icon, t, d, list }) => (
          <div key={t} className="rounded-[22px] bg-chalk p-6 md:p-7">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-basalt text-ember">
              <Icon size={22} />
            </span>
            <h2 className="display mt-5 text-[30px]">{t}</h2>
            <p className="mt-2 text-[15.5px] leading-relaxed">{d}</p>
            <ul className="prose-bd mt-3 text-[14.5px]">
              {list.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mt-3 rounded-[22px] bg-ember/20 p-6 md:p-7">
        <p className="flex gap-3 text-[16px] font-semibold">
          <ChatIcon size={22} className="mt-0.5 shrink-0" /> {business.rules.terms}
        </p>
      </section>

      <section id="faq" className="mt-20 grid scroll-mt-32 gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="kicker text-lava">FAQ</p>
          <h2 className="display mt-3 text-[48px] md:text-[60px]">Түгээмэл асуулт</h2>
        </div>
        <div className="divide-y divide-basalt/15 border-y border-basalt/15">
          {QA.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[17px] font-semibold">
                {f.q}
                <span className="mono mt-0.5 shrink-0 text-lava transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-[15.5px] leading-relaxed text-granite">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="about" className="mt-20 grid scroll-mt-32 gap-10 overflow-hidden rounded-[28px] bg-basalt p-6 text-chalk md:p-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="kicker text-ember">Est. {business.since}</p>
          <h2 className="display mt-3 text-[48px] md:text-[60px]">Бидний тухай</h2>
          <Image src="/brand/logo-stone.png" alt={business.name} width={910} height={438} className="mt-8 w-56 opacity-90" />
        </div>
        <div className="space-y-4 text-[16.5px] leading-relaxed text-chalk/80">
          {about.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
      </section>

      <section id="contact" className="mt-3 grid scroll-mt-32 gap-3 md:grid-cols-3">
        <div className="rounded-[22px] bg-chalk p-6">
          <PinIcon size={22} className="text-lava" />
          <p className="mt-3 font-semibold">{business.address}</p>
        </div>
        <a href={`tel:${business.phone.tel}`} className="rounded-[22px] bg-chalk p-6 transition hover:bg-white">
          <PhoneIcon size={22} className="text-lava" />
          <p className="mono mt-3 text-[20px] font-bold">{business.phone.display}</p>
        </a>
        <a href={`mailto:${business.email}`} className="rounded-[22px] bg-chalk p-6 transition hover:bg-white">
          <MailIcon size={22} className="text-lava" />
          <p className="mt-3 font-semibold break-all">{business.email}</p>
        </a>
      </section>
    </div>
  );
}
