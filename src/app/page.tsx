import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroCarousel } from "@/components/HeroCarousel";
import { TabsNav } from "@/components/TabsNav";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#e9b76d] text-[#2c1a0c]">
      <Header />
      <div className="py-5 sm:py-6">
        <TabsNav />
      </div>
      <main className="flex flex-1 items-center justify-center px-4 pb-10 sm:pb-12">
        <div className="flex w-full max-w-7xl flex-col gap-6">
          <HeroCarousel />
        </div>
      </main>
      <Footer />
    </div>
  );
}
