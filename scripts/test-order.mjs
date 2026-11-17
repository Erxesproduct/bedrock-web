/**
 * End-to-end check of the website order flow (cart → /api/orders → erxes).
 *
 *   node scripts/test-order.mjs [baseUrl] [--send]
 *
 * Without --send it only runs the validation cases (no order reaches erxes).
 * With --send it also places ONE real test order, marked «ТЕСТ ЗАХИАЛГА: устгана уу» in the note.
 * Exit code 1 if any check fails.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const base = (args.find((a) => !a.startsWith("--")) ?? "http://localhost:3000").replace(/\/$/, "");
const send = args.includes("--send");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(await readFile(path.join(root, "src", "data", "catalog.json"), "utf8"));
const P = catalog.products;
// BedRock has no delivery price on Zochil: delivery fees are agreed by phone (null) and never added to the total;
// pick-up at the store costs nothing. So every online total is the goods total.
const orderable = (p) => p.stock == null || p.stock >= 1;

const cheap = P.filter(orderable).sort((a, b) => a.price - b.price);
const first = cheap.find((p) => p.stock == null || p.stock >= 2);
const second = cheap.find((p) => p !== first);
const big = [...P].filter(orderable).sort((a, b) => b.price - a.price)[0];
const soldout = P.find((p) => p.stock === 0);
const scarce = P.find((p) => p.stock != null && p.stock > 0 && p.stock < 20);

const SUBTOTAL = first.price * 2 + second.price;
const EXPECTED_TOTAL = SUBTOTAL;

const order = {
  name: "Тест Захиалагч",
  phone: "99112233",
  delivery: "ub",
  address: "Баянгол дүүрэг, 3-р хороо, тест хаяг, 1 тоот",
  payment: "qpay",
  receiptType: "person",
  note: "ТЕСТ ЗАХИАЛГА: устгана уу",
  items: [
    { slug: first.slug, qty: 2 },
    { slug: second.slug, qty: 1 },
  ],
};

async function post(body) {
  const res = await fetch(`${base}/api/orders`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return { status: res.status, json: await res.json().catch(() => null) };
}

// valid = passed validation (200 when erxes is set, 503 not_configured otherwise)
const valid = (r) => !r.json?.errors && (r.status === 200 || r.status === 503);
const rejects = (field) => (r) => r.status === 422 && !!r.json?.errors?.[field];
const total = (expected) => (r) => valid(r) && r.json?.total === expected;

const cases = [
  ["empty cart is rejected", { ...order, items: [] }, rejects("items")],
  ["unknown product is ignored (then empty)", { ...order, items: [{ slug: "no-such-product", qty: 1 }] }, rejects("items")],
  ...(soldout ? [[`sold-out product is not orderable (${soldout.slug})`, { ...order, items: [{ slug: soldout.slug, qty: 1 }] }, rejects("items")]] : []),
  ...(scarce ? [[`more than the stock is rejected (${scarce.slug}, stock ${scarce.stock})`, { ...order, items: [{ slug: scarce.slug, qty: scarce.stock + 1 }] }, rejects("items")]] : []),
  [`Улаанбаатар order: ${SUBTOTAL}₮, delivery fee by phone (not in the total)`, order, (r) => total(EXPECTED_TOTAL)(r) && r.json?.deliveryFee === null],
  [`pick-up needs no address and costs nothing`, { ...order, delivery: "pickup", address: "" }, (r) => total(EXPECTED_TOTAL)(r) && r.json?.deliveryFee === 0],
  [`a big order (${big.slug} × 2)`, { ...order, items: [{ slug: big.slug, qty: 2 }] }, total(big.price * 2)],
  ["address is required for Ulaanbaatar delivery", { ...order, address: "" }, rejects("address")],
  ["countryside (by bus) needs an address", { ...order, delivery: "countryside", address: "" }, rejects("address")],
  ["countryside with an address passes", { ...order, delivery: "countryside", address: "Дархан-Уул, Дархан сум, автобусаар" }, valid],
  ["QPay is accepted", order, valid],
  ["bank transfer is not offered (QPay only)", { ...order, payment: "bank" }, rejects("payment")],
  ["loan apps are not offered online", { ...order, payment: "loan" }, rejects("payment")],
  ["unknown delivery option is rejected", { ...order, delivery: "drone" }, rejects("delivery")],
  ["unknown payment is rejected", { ...order, payment: "cash" }, rejects("payment")],
  ["company eBarimt needs a 7-digit registry number", { ...order, receiptType: "company", regNo: "12" }, rejects("regNo")],
  ["company eBarimt with a valid registry number passes", { ...order, receiptType: "company", regNo: "1234567" }, valid],
  ["bad phone is rejected", { ...order, phone: "123" }, rejects("phone")],
  ["+976 phone prefix is accepted", { ...order, phone: "+976 9911 2233" }, valid],
  ["bad email is rejected", { ...order, email: "not-an-email" }, rejects("email")],
  ["quantity over 20 is ignored", { ...order, items: [{ slug: first.slug, qty: 21 }] }, rejects("items")],
  ["honeypot is silently accepted", { ...order, website: "spam" }, (r) => r.status === 200 && r.json?.ok === true],
];

let failed = 0;
console.log(`Order API checks against ${base}\n`);
for (const [label, body, ok] of cases) {
  const r = await post(body);
  const pass = ok(r);
  if (!pass) failed++;
  console.log(`${pass ? "✓" : "✗"} ${label}  (${r.status}${r.json?.errors ? " " + Object.keys(r.json.errors).join(",") : ""})`);
}

if (send) {
  const r = await post(order);
  if (r.status === 200 && r.json?.ok) {
    console.log(`\n✓ test order delivered to erxes: ${r.json.reference}, total ${r.json.total}₮ (expected ${EXPECTED_TOTAL})`);
    if (r.json.total !== EXPECTED_TOTAL) {
      failed++;
      console.log("✗ unexpected total");
    }
  } else if (r.status === 503 && r.json?.error === "not_configured") {
    console.log(`\n– test order NOT sent: erxes env vars are not set on ${base} (reference ${r.json.reference}). See .env.example.`);
  } else {
    failed++;
    console.log(`\n✗ test order failed: ${r.status} ${JSON.stringify(r.json)}`);
  }
}

console.log(failed ? `\n${failed} check(s) failed` : `\nall ${cases.length} checks passed`);
process.exit(failed ? 1 : 0);
