import { onSale, saving, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

export function Price({ p, large = false }: { p: Pick<Product, "price" | "compareAt">; large?: boolean }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
      <span className={`mono font-bold tracking-tight ${large ? "text-[34px] md:text-[40px]" : "text-[17px]"}`}>{formatPrice(p.price)}</span>
      {onSale(p) && (
        <>
          <s className={`mono text-ash ${large ? "text-lg" : "text-[13px]"}`}>{formatPrice(p.compareAt!)}</s>
          <span className={`mono rounded-md bg-lava font-bold text-white ${large ? "px-2 py-1 text-[13px]" : "px-1.5 py-0.5 text-[11px]"}`}>−{formatPrice(saving(p))}</span>
        </>
      )}
    </div>
  );
}
