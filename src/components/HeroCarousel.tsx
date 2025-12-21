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
    title: "Yeni sezon parcalari simdi vitrine cikti.",
    description:
      "Minimal dokunuslar, kuvvetli siluetler. Sehir temposuna eslik eden koleksiyonla tanisin.",
    badge: "2025 koleksiyon",
  },
  {
    image: "/images/slide2.jpg",
    title: "Rahatlik ve siklik ayni yerde.",
    description:
      "Nefes alan dokular, zamansiz renkler ve hafif katmanlar ile stilinizi tamamlayin.",
    badge: "ozel seri",
  },
  {
    image: "/images/slide3.jpg",
    title: "Her ekranda guclu bir ilk izlenim.",
    description:
      "Mobil ve masaustunde uyumlu, carpici gorsellerle markanizi one cikarin.",
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
              Detaylari gor
            </a>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/25 bg-slate-950/60 px-3 py-2 shadow-lg shadow-slate-900/40 backdrop-blur">
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

      <div className="pointer-events-none absolute inset-y-0 left-0 right-0">
        <div className="flex h-full items-center justify-between px-3 sm:px-5 lg:px-6">
          <button
            type="button"
            onClick={() => goTo("prev")}
            aria-label="Onceki slayt"
            className="pointer-events-auto grid h-12 w-12 place-items-center rounded-full border border-white/25 bg-slate-950/60 text-xl font-bold text-white shadow-lg shadow-slate-900/50 transition hover:-translate-y-0.5 hover:border-amber-200 hover:bg-slate-900/70"
          >
            &lt;
          </button>
          <button
            type="button"
            onClick={() => goTo("next")}
            aria-label="Sonraki slayt"
            className="pointer-events-auto grid h-12 w-12 place-items-center rounded-full border border-white/25 bg-slate-950/60 text-xl font-bold text-white shadow-lg shadow-slate-900/50 transition hover:-translate-y-0.5 hover:border-amber-200 hover:bg-slate-900/70"
          >
            &gt;
          </button>
        </div>
      </div>
    </section>
  );
}
