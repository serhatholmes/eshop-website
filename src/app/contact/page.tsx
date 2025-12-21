import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Header, socialLinks } from "@/components/Header";
import { TabsNav } from "@/components/TabsNav";

const GETFORM_ENDPOINT = "https://getform.io/f/your-getform-endpoint";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <Header />
      <div className="py-5 sm:py-6">
        <TabsNav />
      </div>
      <main className="flex flex-1 items-center justify-center px-4 pb-10 sm:pb-12">
        <div className="w-full max-w-7xl rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-3 lg:items-start">
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-semibold sm:text-4xl">
                İletişim
              </h1>
              <p className="mt-3 text-slate-200/85">
                Formu doldurun, ekibimiz en kısa sürede dönüş yapsın.
              </p>

              <form
                action={GETFORM_ENDPOINT}
                method="POST"
                className="mt-8 space-y-5"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm font-medium text-slate-100">
                    Ad Soyad
                    <input
                      type="text"
                      name="name"
                      required
                      className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-400 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200/50"
                      placeholder="Örn: Deniz Kaya"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-slate-100">
                    E-posta
                    <input
                      type="email"
                      name="email"
                      required
                      className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-400 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200/50"
                      placeholder="ornek@mail.com"
                    />
                  </label>
                </div>
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-100">
                  Mesaj
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-400 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200/50"
                    placeholder="Mesajınızı yazın..."
                  />
                </label>
                <button
                  type="submit"
                  className="w-full rounded-full bg-amber-400 px-6 py-3 text-center text-base font-semibold text-slate-950 shadow-lg shadow-amber-500/30 transition hover:-translate-y-0.5 hover:shadow-amber-400/40 sm:w-auto sm:px-8"
                >
                  Gönder
                </button>
              </form>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-100 shadow-inner shadow-slate-900/30">
              <p className="text-base font-semibold text-amber-200">
                Sosyal medya
              </p>
              <p className="text-slate-300">
                Dilerseniz sosyal hesaplardan da ulaşabilirsiniz.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {socialLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-slate-50 transition hover:-translate-y-0.5 hover:border-amber-300/60 hover:bg-white/20"
                  >
                    <span className="text-amber-200 transition group-hover:text-amber-100">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-6 text-xs text-slate-400">
            Not: GETFORM endpointinizi `GETFORM_ENDPOINT` sabitinde güncelleyin.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
