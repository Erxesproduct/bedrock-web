# BedRock storefront

Website for **BedRock · Electronics Store** (since 2022, Сансар центр, 2 давхар): iPhone, Mac, iPad, Apple Watch,
AirPods, accessories and Nintendo Switch 2. It replaces the Zochil shop at bedrock.mn (shop 32084).

Next.js 16 (App Router) + Tailwind CSS 4. Static catalog in `src/data/catalog.json`; orders go to erxes 3.0.

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint && npm run typecheck && npm run build
npm run test:order -- http://localhost:3000   # order API checks (add --send for one real erxes order)
npm run sync:erxes   # refresh prices from erxes (needs ERXES_API_URL + ERXES_APP_TOKEN)
```

| Path | What |
| --- | --- |
| `/` | Home: hero with floating product slabs, category layers, flagship, newest, the setup builder, sale, warranty / origin / delivery, FAQ, store |
| `/shop?c=<category>&s=<cat\|new\|low\|high>` | Catalog by category, sorted by category, newest or price |
| `/p/<slug>` | Product: gallery, specs, price, warranty and delivery facts, the shop's full description |
| `/info` | Delivery, payment, warranty, FAQ, about, contact |
| `/cart` | Cart + checkout (pick-up / Ulaanbaatar / countryside, QPay, eBarimt person or company) |
| `POST /api/orders` | Validates on the server (prices, stock, delivery) and sends the order to erxes |

The **setup builder** («Сетапаа давхаргаар угсар») stacks one product per layer (device, wrist, audio, extra) and adds
them all to the cart. Look: «strata», with the logo's mountain on light stone, basalt ink, contour lines and one lava
accent; Oswald + IBM Plex Sans + JetBrains Mono.

Business rules live in `src/content/business.ts`. Delivery fees are agreed by phone (Zochil has none set) and never
added to the online total. Old Zochil URLs (`/products/...`, `/about`, `/faq`, `/shopping-cart`) redirect to the new
pages. erxes setup and open questions: `docs/erxes/MANUAL-STEPS.md`.

Environment variables: see `.env.example` (never commit values).
