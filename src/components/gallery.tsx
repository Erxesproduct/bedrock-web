"use client";

import Image from "next/image";
import { useState } from "react";
import type { Photo } from "@/lib/catalog";

/** Main photo on a white plinth, thumbnails underneath (a swipeable rail on phones). */
export function Gallery({ images, name, dim = false }: { images: Photo[]; name: string; dim?: boolean }) {
  const [i, setI] = useState(0);
  const img = images[i];
  return (
    <div>
      <div className="plinth relative aspect-square">
        <Image key={img.src} src={img.src} alt={i ? `${name}: зураг ${i + 1}` : name} fill priority={i === 0} sizes="(min-width: 1024px) 50vw, 100vw" className={`pop object-contain p-6 md:p-10 ${dim ? "opacity-50 grayscale" : ""}`} />
        {images.length > 1 && <span className="mono absolute right-4 bottom-4 rounded-md bg-basalt/85 px-2 py-1 text-[11.5px] text-chalk">{`${String(i + 1).padStart(2, "0")} / ${String(images.length).padStart(2, "0")}`}</span>}
      </div>
      {images.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((m, k) => (
            <button
              key={m.src}
              type="button"
              onClick={() => setI(k)}
              aria-label={`Зураг ${k + 1}`}
              aria-current={k === i ? "true" : undefined}
              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-basalt/10 transition hover:ring-basalt/40 aria-[current]:ring-2 aria-[current]:ring-lava"
            >
              <Image src={m.thumb.src} alt="" fill sizes="80px" className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
