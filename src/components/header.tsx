import Image from "next/image";
import Link from "next/link";
import { business } from "@/content/business";
import { categories } from "@/lib/catalog";
import { CartLink } from "./cart-link";
import { PhoneIcon } from "./icons";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-basalt/10 bg-stone/85 backdrop-blur-xl">
      <div className="bg-basalt text-chalk">
        <div className="wrap flex h-9 items-center justify-between gap-4 text-[12.5px]">
          <p className="mono truncate">
            <span className="text-ember">●</span> Америк, Солонгосоос · 3–12 сарын баталгаа · 48 цагт хүргэнэ
          </p>
          <a href={`tel:${business.phone.tel}`} className="mono hidden shrink-0 items-center gap-1.5 hover:text-ember sm:inline-flex">
            <PhoneIcon size={13} /> {business.phone.display}
          </a>
        </div>
      </div>
      <div className="wrap flex h-[68px] items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center" aria-label={`${business.name}: нүүр хуудас`}>
          <Image src="/brand/logo.png" alt={business.name} width={910} height={438} priority className="h-11 w-auto" />
        </Link>
        <nav aria-label="Ангилал" className="hidden items-center gap-1 lg:flex">
          {categories.map((c) => (
            <Link key={c.id} href={`/shop?c=${c.id}`} className="rounded-lg px-3 py-2 text-[14.5px] font-medium text-granite transition hover:bg-basalt hover:text-chalk">
              {c.name}
            </Link>
          ))}
          <Link href="/#setup" className="ml-1 rounded-lg px-3 py-2 text-[14.5px] font-semibold text-lava transition hover:bg-lava hover:text-white">
            Сетап угсрах
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/info" className="hidden rounded-lg px-3 py-2 text-[14.5px] font-medium text-granite hover:text-basalt md:block">
            Хүргэлт, баталгаа
          </Link>
          <CartLink />
        </div>
      </div>
      {/* phones: categories as a swipeable rail */}
      <nav aria-label="Ангилал" className="no-scrollbar -mt-1 flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
        {categories.map((c) => (
          <Link key={c.id} href={`/shop?c=${c.id}`} className="shrink-0 rounded-lg border border-basalt/15 bg-chalk px-3 py-1.5 text-[13.5px] font-medium">
            {c.name}
          </Link>
        ))}
        <Link href="/#setup" className="shrink-0 rounded-lg bg-lava px-3 py-1.5 text-[13.5px] font-semibold text-white">
          Сетап угсрах
        </Link>
      </nav>
    </header>
  );
}
