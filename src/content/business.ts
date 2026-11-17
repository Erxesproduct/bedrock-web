/**
 * Business facts from bedrock.mn (Zochil shop 32084: shop settings, payment / delivery rules, terms, About, FAQ) and the
 * Facebook page facebook.com/TheBedRockmn, read on 2026-11-17. Nothing here is invented; open questions are listed in
 * docs/erxes/MANUAL-STEPS.md.
 */
export const business = {
  name: "BedRock",
  /** Under the mountain on the logo. */
  tagline: "Electronics Store",
  /** About page: «BedRock нь 2022 онд байгуулагдсан…». */
  since: 2022,
  description: "BedRock: Apple-ийн бүтээгдэхүүн, Nintendo Switch 2. Америк, Солонгосын баталгаат борлуулагчаас, 3–12 сарын баталгаатай.",
  phone: { display: "8915-5069", tel: "+97689155069" },
  email: "thebedrockllc@gmail.com",
  address: "БГД, 14-р хороо, Сансар центр, 2 давхарт",
  facebook: "https://www.facebook.com/TheBedRockmn",
  messenger: "https://m.me/TheBedRockmn",
  instagram: "https://www.instagram.com/bedrockmn/",
  /** Zochil has a QPay (qpay2, Khan Bank) payment method. Rule: website orders are cash (full) purchases only. */
  payments: [{ id: "qpay", name: "QPay", note: "Аль ч банкны аппаар QR уншуулж төлнө" }],
  /**
   * Zochil has no delivery option with a price for this shop (no `delivery_options`), so the fee is agreed by phone
   * (`fee: null`) and never added to the total. Pick-up is enabled (`pickup_enabled: 1`) at the store address.
   * Countryside: «Орон нутгийн унаанд тавьж өгнө» (delivery rule).
   */
  delivery: [
    { id: "pickup", name: "Дэлгүүрээс ирж авах", fee: 0 as number | null, needsAddress: false, note: "Сансар центр, 2 давхар" },
    { id: "ub", name: "Улаанбаатарт хүргүүлэх", fee: null as number | null, needsAddress: true, note: "Байршлаас хамаарч 48 цагийн дотор · төлбөрийг утсаар тохирно" },
    { id: "countryside", name: "Орон нутагт", fee: null as number | null, needsAddress: true, note: "Орон нутгийн унаанд тавьж өгнө · төлбөрийг утсаар тохирно" },
  ],
  rules: {
    delivery: "Хүргүүлэх байршлаас хамаарч 48 цагийн дотор хүргэнэ. Орон нутгийн унаанд тавьж өгнө.",
    payment: "Вэбсайтаар зөвхөн бэлэн худалдан авалт хийх боломжтой.",
    leasing: "Хаан банкны лизинг болон зээлийн апп ашиглан худалдан авалт хийх бол Facebook чат эсвэл 8915-5069 дугаараар холбогдоно уу.",
    terms: "Захиалга хийхээсээ өмнө манайх руу чат бичиж, эсвэл утсаар залгаж таны сонирхож буй бараа бэлэн байгаа эсэхийг шалгаарай.",
    warranty: "Бараа бүтээгдэхүүнээс шалтгаалан 3–12 сарын баталгаат хугацаа өгнө.",
    origin: "Apple-ийн бүтээгдэхүүн Америкаас, PlayStation, Nintendo Switch Солонгосоос ирдэг.",
    tradeIn: "Trade-in үйлчилгээ байхгүй.",
    ebarimt: "Бүх захиалгад и-баримт олгоно. Байгууллагаар авах бол 7 оронтой регистрийн дугаараа бичнэ үү.",
  },
} as const;

export type DeliveryId = (typeof business.delivery)[number]["id"];
export const deliveryOption = (id: DeliveryId) => business.delivery.find((d) => d.id === id)!;
/** null = agreed by phone, not part of the online total. */
export const deliveryFee = (id: DeliveryId): number | null => deliveryOption(id).fee;
