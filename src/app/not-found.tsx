import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap topo grid place-items-center py-24 text-center">
      <Image src="/brand/mountain.png" alt="" width={910} height={205} className="w-64 opacity-80" />
      <p className="display mt-6 text-[120px] md:text-[180px]">
        4<span className="text-lava">0</span>4
      </p>
      <p className="mt-2 max-w-md text-granite">Энэ хуудас газрын хөрсөнд дарагдсан бололтой. Хаяг өөрчлөгдсөн байж магадгүй.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-basalt">
          Нүүр хуудас
        </Link>
        <Link href="/shop" className="btn btn-line">
          Бүх бараа
        </Link>
      </div>
    </div>
  );
}
