import Image from "next/image";
import Link from "next/link";
import { business } from "@/content/business";
import { categories } from "@/lib/catalog";
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon } from "./icons";

export function Footer() {
  return (
    <footer className="mt-24">
      <div className="strata" aria-hidden />
      <div className="topo-light bg-basalt text-chalk">
        <div className="wrap grid gap-12 py-16 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Image src="/brand/logo-stone.png" alt={business.name} width={910} height={438} className="h-16 w-auto" />
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-chalk/70">{business.description}</p>
            <p className="kicker mt-6 text-ember">Est. {business.since}</p>
          </div>
          <div>
            <p className="kicker text-chalk/50">Ангилал</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[15px]">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link href={`/shop?c=${c.id}`} className="hover:text-ember">
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/info" className="hover:text-ember">
                  Хүргэлт, баталгаа
                </Link>
              </li>
              <li>
                <Link href="/info#faq" className="hover:text-ember">
                  Түгээмэл асуулт
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-[15px]">
            <p className="kicker text-chalk/50">Холбоо барих</p>
            <ul className="mt-4 grid gap-3">
              <li className="flex gap-2.5">
                <PinIcon size={18} className="mt-0.5 shrink-0 text-ember" /> {business.address}
              </li>
              <li>
                <a href={`tel:${business.phone.tel}`} className="mono inline-flex items-center gap-2.5 hover:text-ember">
                  <PhoneIcon size={18} className="text-ember" /> {business.phone.display}
                </a>
              </li>
              <li>
                <a href={`mailto:${business.email}`} className="inline-flex items-center gap-2.5 break-all hover:text-ember">
                  <MailIcon size={18} className="shrink-0 text-ember" /> {business.email}
                </a>
              </li>
            </ul>
            <div className="mt-6 flex gap-2">
              <a href={business.facebook} target="_blank" rel="noreferrer" className="grid h-11 w-11 place-items-center rounded-xl bg-chalk/10 hover:bg-lava" aria-label="Facebook">
                <FacebookIcon size={20} />
              </a>
              <a href={business.instagram} target="_blank" rel="noreferrer" className="grid h-11 w-11 place-items-center rounded-xl bg-chalk/10 hover:bg-lava" aria-label="Instagram">
                <InstagramIcon size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-chalk/10">
          <div className="wrap flex flex-wrap items-center justify-between gap-3 py-5 text-[12.5px] text-chalk/50">
            <p>
              © {new Date().getFullYear()} {business.name} · {business.tagline}
            </p>
            <p>Apple, iPhone, iPad, Mac, AirPods, Apple Watch нь Apple Inc.-ийн, Nintendo Switch нь Nintendo-ийн барааны тэмдэг.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
