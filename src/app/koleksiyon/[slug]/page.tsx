"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductCards } from "@/components/ProductCards";
import { TabsNav } from "@/components/TabsNav";
import { collections } from "@/data/collections";
import { getProducts } from "@/services/productService";
import type { Product } from "@prisma/client";

export default function CollectionPage() {
  const params = useParams();
  const slugParam = params?.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

  const collection = useMemo(
    () => collections.find((item) => item.slug === slug),
    [slug]
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((items) => setProducts(items))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    if (!slug) return products;
    return products.filter((product) => product.collectionSlug === slug);
  }, [products, slug]);

  const title = collection?.title ?? "Koleksiyon";
  const description =
    collection?.description ?? "Koleksiyondaki ürünleri keşfedin.";

  return (
    <div className="flex min-h-screen flex-col bg-[#e9b76d] text-[#2c1a0c]">
      <Header />
      <div className="py-5 sm:py-6">
        <TabsNav />
      </div>
      <main className="flex flex-1 px-4 pb-10 sm:pb-12">
        <div className="mx-auto w-full max-w-7xl rounded-3xl border border-[#6b3f1f]/30 bg-[#f3d89b] px-5 py-10 shadow-2xl sm:px-8 sm:py-12 lg:px-10">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>
              <p className="mt-2 text-[#3b2414]">{description}</p>
            </div>
            <span className="self-start rounded-full bg-[#6b3f1f]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#6b3f1f] sm:self-center">
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
