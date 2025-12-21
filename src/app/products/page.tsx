import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TabsNav } from "@/components/TabsNav";

export default function ProductsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <Header />
      <div className="py-5 sm:py-6">
        <TabsNav />
      </div>
      <main className="flex flex-1 items-center justify-center px-4 pb-10 sm:pb-12">
        <div className="w-full max-w-7xl rounded-3xl border border-white/10 bg-slate-900/50 px-6 py-12 text-center shadow-2xl">
          <h1 className="text-3xl font-semibold sm:text-4xl">Tüm Ürünler</h1>
          <p className="mt-4 text-slate-200/80">
            Ürün listesi yakında eklenecek.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
