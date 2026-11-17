import type { Metadata } from "next";
import { Checkout } from "@/components/checkout";

export const metadata: Metadata = { title: "Сагс", robots: { index: false } };

export default function CartPage() {
  return (
    <div className="wrap pt-10 md:pt-14">
      <p className="kicker text-lava">Захиалга</p>
      <h1 className="display mt-3 text-[60px] md:text-[88px]">Сагс</h1>
      <div className="mt-10">
        <Checkout />
      </div>
    </div>
  );
}
