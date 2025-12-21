import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroCarousel } from "@/components/HeroCarousel";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:py-12">
        <div className="flex w-full max-w-6xl flex-col gap-6">
          <HeroCarousel />
        </div>
      </main>
      <Footer />
    </div>
  );
}
