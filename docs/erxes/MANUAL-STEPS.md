# BedRock: erxes manual steps

Owner of every step below: **Terbish**, with BedRock for credentials and decisions.

These steps happen inside the erxes 3.0 admin, not in code. The website reads the results through the
environment variables in `.env.example`. Never commit their values.

| Task | Status | What to do in erxes (admin path) |
| --- | --- | --- |
| [1.1] Import products, categories, prices | website done · manual import in erxes | Section 1.1 |
| [1.2] Payment setup (QPay) | website done · manual, blocked on QPay merchant credentials | Section 1.2 |
| [1.3] eBarimt setup | website done · manual, blocked on PosAPI registration + TIN | Section 1.3 |
| [1.4] Delivery zones, fees, order statuses | website done · manual in erxes, fees blocked on BedRock | Section 1.4 |
| [1.5] Test order from cart to receipt | validation verified · real order blocked on erxes env vars + 1.2 + 1.3 | Section 1.5 |

There is no erxes instance for BedRock yet ("erxes 3.0: NOT SET"). Create it first, then add the env vars under
**Vercel → bedrock-web → Settings → Environment Variables**.

---

## 1.1 Import products, categories and prices

Source: bedrock.mn (Zochil shop 32084), scraped 2026-11-17: 21 products (108 photos), the logo, the home banner, the
About page and 5 FAQ. Zochil has no blog posts and an empty Terms page (the terms text is in the shop settings). The
Facebook page (facebook.com/TheBedRockmn) gives no content without a login; Instagram (bedrockmn) is linked.

Zochil had 5 categories; **iPhone 18 Pro, iPhone 18 Pro Max and Nintendo Switch 2 had none**, so the website adds
«iPhone» and «Gaming»:

| Code | Name | Products | Zochil id |
| --- | --- | --- | --- |
| `BD-iphone` | iPhone | 2 | (new) |
| `BD-mac` | Mac | 4 | 277634 |
| `BD-ipad` | iPad | 2 | 277787 |
| `BD-watch` | Watch | 4 (incl. Google Fitbit Air, which Zochil had under Accessories) | 277784 |
| `BD-airpods` | AirPods | 4 | 277785 |
| `BD-accessories` | Accessories | 4 | 277786 |
| `BD-gaming` | Gaming | 1 | (new) |

Files:

- `docs/erxes/bedrock-categories.csv`: the parent `BD` and the 7 categories.
- `docs/erxes/bedrock-products.csv`: **21 rows**, code `BD-<zochilId>`, with price, old price, stock, status,
  subtitle, spec chips, the full description and photo paths.

Steps:

1. **Products & services → Categories**: import `bedrock-categories.csv`, or create the 7 by hand under «BedRock».
2. **Settings → Import & Export → Import → Products**: upload `bedrock-products.csv`. Map `code → Code`,
   `name → Name`, `categoryCode → Category code`, `unitPrice → Unit price`, `type → Type`, `uom → UOM`,
   `description → Description`. Keep the codes: the website and `npm run sync:erxes` match on them.
3. **Inventories → Remainders**: Zochil tracks stock on 16 products (57 units); **Magic Keyboard for iPad Air is 0
   (sold out)**. Not tracked: both iPhones, Apple Watch Series 12, MacBook Neo, MacBook Pro. The shop hides stock
   counts (`show_stock: false`), so the website never shows them either, but it does not sell more than the stock.
   Until erxes stock is wired to the site, update `stock` in `src/data/catalog.json`.
4. Upload the photos (`public/images/*.webp`) on the products.
5. Run `npm run sync:erxes` once with a Client Portal token to confirm the codes match (it also refreshes
   `src/data/lite.json`, which the cart reads).

Changes on the website (facts unchanged):

- Name tidy-ups: the model suffix moved to the subtitle («MacBook Air M5 16GB/512GB LL/A» → «MacBook Air M5» +
  «16GB / 512GB · LL/A (АНУ)»; same for MacBook Pro, MacBook Neo, iPad A16 / Air M4, Apple Pencil, Magic Keyboard).
- **Photos**: most products' first Zochil photo is a price poster («30 сар» instalments, loan-app logos). Several
  poster prices differ from the listing: **MacBook Pro 14" M5 poster 7,500,000₮ vs listing 7,000,000₮; Nintendo
  Switch 2 poster 2,000,000₮ vs listing 2,200,000₮**; the MacBook Air and Mac mini posters also show a second
  model (15.3" 5,600,000₮; Mac mini M5 4,000,000₮), and the MacBook Neo poster a 512GB one
  (3,400,000₮), that are not products. The website uses the listing prices, leaves
  the posters out and shows the clean product photos; Google Fitbit Air only had a poster, so the product is cropped
  out of it.
- MacBook Pro has `sale_price` = price (7,000,000₮), so no discount is shown. Discounts shown: MacBook Air M5
  4,600,000₮ (was 4,800,000₮), iPad Air M4 2,800,000₮ (was 2,900,000₮).
