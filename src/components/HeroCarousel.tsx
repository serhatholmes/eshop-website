"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Slide = {
  image: string;
  title: string;
  description: string;
  badge: string;
};

const slides: Slide[] = [
  {
    image: "/images/slide1.jpg",
    title: "Yeni sezon parçaları şimdi vitrine çıktı.",
    description:
      "Minimal dokunuşlar, kuvvetli silüetler. Şehir temposuna eşlik eden koleksiyonla tanışın.",
    badge: "2025 koleksiyon",
  },
  {
    image: "/images/slide2.jpg",
    title: "Rahatlık ve şıklık aynı yerde.",
    description:
      "Nefes alan dokular, zamansız renkler ve hafif katmanlar ile stilinizi tamamlayın.",
    badge: "özel seri",
  },
  {
    image: "/images/slide3.jpg",
    title: "Her ekranda güçlü bir ilk izlenim.",
    description:
      "Mobil ve masaüstünde uyumlu, çarpıcı görsellerle markanızı öne çıkarın.",
    badge: "responsive deneyim",
  },
];

export function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6500);

    return () => clearInterval(timer);
  }, []);

  const goTo = (direction: "next" | "prev") => {
    setActiveIndex((prev) => {
      if (direction === "next") {
        return (prev + 1) % slides.length;
      }
      return (prev - 1 + slides.length) % slides.length;
    });
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 shadow-2xl">
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <Image
            key={slide.image}
            src={slide.image}
            alt={slide.title}
            fill
            priority={index === 0}
            sizes="100vw"
            className={`object-cover transition-opacity duration-700 ease-out ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/75 to-indigo-900/45" />
      </div>

      <div className="relative z-10 flex min-h-[65vh] flex-col justify-between gap-8 p-6 sm:p-10 lg:p-14">
        <div className="flex max-w-2xl flex-col gap-4">
          <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-amber-200">
            {slides[activeIndex].badge}
          </span>
          <h1 className="text-3xl font-semibold leading-tight text-white drop-shadow-md sm:text-4xl lg:text-5xl">
            {slides[activeIndex].title}
          </h1>
          <p className="text-base text-slate-100/90 sm:text-lg lg:text-xl">
            {slides[activeIndex].description}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#koleksiyon"
              className="rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/30 transition hover:-translate-y-0.5 hover:shadow-amber-400/40 sm:text-base"
            >
              Koleksiyonu incele
            </a>
            <a
              href="#detay"
              className="rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-amber-200 hover:bg-white/20 sm:text-base"
            >
              Detayları gör
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => goTo("prev")}
              className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:border-amber-200 hover:bg-white/20"
            >
              ← Önceki
            </button>
            <button
              type="button"
              onClick={() => goTo("next")}
              className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-amber-200 hover:bg-white/20"
            >
              Sonraki →
            </button>
          </div>
          <div className="flex items-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.image}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 w-2.5 rounded-full border border-white/40 transition ${
                  index === activeIndex
                    ? "bg-amber-300 shadow shadow-amber-300/60"
                    : "bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Slayt ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
