import Image from "next/image";

export type Product = {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-slate-900/30 sm:p-5">
      <div className="relative mx-auto mb-4 aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-800">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="200px"
          className="object-cover"
          priority={false}
        />
      </div>
      <h3 className="text-base font-semibold text-white sm:text-lg">
        {product.title}
      </h3>
      <p className="mt-2 text-sm text-slate-200/85">{product.description}</p>
      <div className="mt-auto pt-3 text-sm font-semibold text-amber-300 sm:text-base">
        {product.price}
      </div>
    </article>
  );
}
