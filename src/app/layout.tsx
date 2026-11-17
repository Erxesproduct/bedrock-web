import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { business } from "@/content/business";
import { getProduct } from "@/lib/catalog";
import { siteUrl } from "@/lib/site-url";
import { display, mono, sans } from "./fonts";
import "./globals.css";

const description = "BedRock: iPhone, Mac, iPad, Apple Watch, AirPods, Nintendo Switch 2. Америк, Солонгосын баталгаат борлуулагчаас, 3–12 сарын баталгаатай. Сансар центр, 2 давхар.";
const og = getProduct("iphone-18-pro-max")!.images[0];

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${business.name}: Electronics Store`, template: `%s · ${business.name}` },
  description,
  openGraph: { type: "website", locale: "mn_MN", siteName: business.name, description, images: [{ url: og.src, width: og.w, height: og.h }] },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#141413" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="mn" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-basalt focus:px-4 focus:py-2 focus:text-chalk">
          Үндсэн агуулга руу
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
