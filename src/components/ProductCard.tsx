import type { Product } from "@prisma/client";
import Image from "next/image";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-[#6b3f1f]/30 bg-white/80 p-4 shadow-lg shadow-[#6b3f1f]/20 sm:p-5">
      <div className="relative mx-auto mb-4 aspect-[4/3] w-full overflow-hidden rounded-xl bg-white/70">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="200px"
          className="object-cover"
          priority={false}
        />
      </div>
      <h3 className="text-base font-semibold text-[#2c1a0c] sm:text-lg">
        {product.title}
      </h3>
      <p className="mt-2 text-sm text-[#3b2414]">{product.description}</p>
      <div className="mt-auto pt-3 text-sm font-semibold text-[#6b3f1f] sm:text-base">
        {product.price}
      </div>
    </article>
  );
}
