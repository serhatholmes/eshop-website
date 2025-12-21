 "use client";

import { useEffect, useMemo, useState } from "react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductCards } from "@/components/ProductCards";
import type { Product } from "@/components/ProductCard";
import { TabsNav } from "@/components/TabsNav";

const products: Product[] = [
  {
    id: "watch-01",
    title: "Minimal Saat",
    description: "Mat gövde, değiştirilebilir kayış ve günlük kullanım konforu.",
    price: "2.450 TL",
    image: "/images/slide1.jpg",
  },
  {
    id: "watch-02",
    title: "Gri Seri",
    description: "Hafif kasa, sessiz mekanizma ve net kadran tasarımı.",
    price: "2.750 TL",
    image: "/images/slide2.jpg",
  },
  {
    id: "watch-03",
    title: "Gece Mavisi",
    description: "Suya dayanıklı gövde ve parlak indekslerle stil sahibi.",
    price: "3.150 TL",
    image: "/images/slide3.jpg",
  },
  {
    id: "watch-04",
    title: "Klasik Çelik",
    description: "Paslanmaz çelik kayış ve ince çizgili kadran.",
    price: "3.450 TL",
    image: "/images/slide1.jpg",
  },
  {
    id: "watch-05",
    title: "Günlük Deri",
    description: "Hakiki deri kayış ve günlük kombinlere uyumlu renkler.",
    price: "2.900 TL",
    image: "/images/slide2.jpg",
  },
  {
    id: "watch-06",
    title: "Spor Hibrit",
    description: "Adım sayar, hafif silikon kayış ve dayanıklı kasa.",
    price: "3.050 TL",
    image: "/images/slide3.jpg",
  },
  {
    id: "watch-07",
    title: "Rose Edition",
    description: "Rose gold detaylar ve minimal kadran tasarımı.",
    price: "3.600 TL",
    image: "/images/slide1.jpg",
  },
  {
    id: "watch-08",
    title: "Siyah Mat",
    description: "Parlamayan yüzey, yüksek okunabilirlik ve modern siluet.",
    price: "3.250 TL",
    image: "/images/slide2.jpg",
  },
  {
    id: "watch-09",
    title: "Pilot Serisi",
    description: "Büyük kadran, belirgin indeksler ve dayanıklı cam.",
    price: "3.800 TL",
    image: "/images/slide3.jpg",
  },
  {
    id: "watch-10",
    title: "Gece Yolcusu",
    description: "Lüminesans detaylar ve şık silikon kayış.",
    price: "3.150 TL",
    image: "/images/slide1.jpg",
  },
];

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 900);
    return () => clearTimeout(timer);
  }, [query]);

  const filteredProducts = useMemo(() => {
    if (!debouncedQuery) return products;
    return products.filter((product) =>
      product.title.toLowerCase().includes(debouncedQuery)
    );
  }, [debouncedQuery]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <Header />
      <div className="py-5 sm:py-6">
        <TabsNav />
      </div>
      <main className="flex flex-1 px-4 pb-10 sm:pb-12">
        <div className="mx-auto w-full max-w-7xl rounded-3xl border border-white/10 bg-slate-900/50 px-5 py-10 shadow-2xl sm:px-8 sm:py-12 lg:px-10">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold sm:text-4xl">Tüm Ürünler</h1>
              <p className="mt-2 text-slate-200/80">
                Koleksiyondaki saat modellerini keşfedin.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                Isme gore ara
              </label>
              <input
                type="search"
                placeholder="Ürün ara..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full min-w-[240px] rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-400 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200/50 sm:w-[260px]"
              />
            </div>
            <span className="hidden rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200 sm:inline">
              {filteredProducts.length} ürün
            </span>
          </div>
          <ProductCards products={filteredProducts} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
