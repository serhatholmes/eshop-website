"use client";

import { useEffect, useMemo, useState } from "react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductCards } from "@/components/ProductCards";
import { TabsNav } from "@/components/TabsNav";
import { getProducts } from "@/services/productService";
import type { Product } from "@prisma/client";

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((items) => setProducts(items))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedQuery(query.trim().toLowerCase()),
      900
    );
    return () => clearTimeout(timer);
  }, [query]);

  const filteredProducts = useMemo(() => {
    if (!debouncedQuery) return products;
    return products.filter((product) =>
      product.title.toLowerCase().includes(debouncedQuery)
    );
  }, [debouncedQuery, products]);

  return (
    <div className="flex min-h-screen flex-col bg-[#e9b76d] text-[#2c1a0c]">
      <Header />
      <div className="py-5 sm:py-6">
        <TabsNav />
      </div>
      <main className="flex flex-1 px-4 pb-10 sm:pb-12">
        <div className="mx-auto w-full max-w-7xl rounded-3xl border border-[#6b3f1f]/30 bg-[#f3d89b] px-5 py-10 shadow-2xl sm:px-8 sm:py-12 lg:px-10">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold sm:text-4xl">
                Tüm ürünler
              </h1>
              <p className="mt-2 text-[#3b2414]">
                Koleksiyondaki saat modellerini keşfedin.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3b2414]">
                İsme göre ara
              </label>
              <input
                type="search"
                placeholder="Ürün ara..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full min-w-[240px] rounded-full border border-[#6b3f1f]/40 bg-white/70 px-4 py-2 text-sm text-[#2c1a0c] placeholder:text-[#72552e] focus:border-[#6b3f1f] focus:outline-none focus:ring-2 focus:ring-[#6b3f1f]/40 sm:w-[260px]"
              />
            </div>
            <span className="hidden rounded-full bg-[#6b3f1f]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#6b3f1f] sm:inline">
              {filteredProducts.length} ürün
            </span>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5 lg:gap-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-full rounded-2xl border border-[#6b3f1f]/20 bg-white/70 p-4"
                >
                  <div className="mb-3 aspect-[4/3] w-full animate-pulse rounded-xl bg-white/50" />
                  <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-white/50" />
                  <div className="mb-3 h-3 w-full animate-pulse rounded bg-white/50" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-white/50" />
                </div>
              ))}
            </div>
          ) : (
            <ProductCards products={filteredProducts} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
